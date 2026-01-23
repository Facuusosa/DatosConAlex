"""
Vistas para integración con Mercado Pago - Flujo de Redirect (Checkout Pro)

Este módulo maneja:
1. Creación de preferencias de pago (create_preference)
2. Validación de pagos exitosos (pago_exitoso) + entrega del archivo
3. Webhook para notificaciones de Mercado Pago (webhook)

IMPORTANTE: Ahora integrado con el modelo Order para registrar clientes.
"""

import json
import os
from pathlib import Path
from django.http import JsonResponse, FileResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import mercadopago
from dotenv import load_dotenv

import logging
from .models import Order
from .services import send_product_email

logger = logging.getLogger(__name__)

# Cargar variables de entorno desde el directorio backend
BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / '.env')

# Inicializar SDK de Mercado Pago
sdk = mercadopago.SDK(os.getenv('MP_ACCESS_TOKEN'))

# URL del frontend para redirecciones
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Ruta al archivo del curso (configurable por variable de entorno)
COURSE_FILE_PATH = os.getenv('COURSE_FILE_PATH', str(BACKEND_DIR / 'files' / 'curso-excel.zip'))


@csrf_exempt
@require_http_methods(["POST"])
def create_preference(request):
    """
    Crea una preferencia de pago en Mercado Pago y retorna el init_point (URL de redirect).
    
    AHORA: Crea un registro Order en la base de datos ANTES de llamar a MP.
    El order.id se usa como external_reference para vincular el pago.
    
    Request Body:
    {
        "full_name": "Juan Pérez",
        "email": "juan@email.com",
        "course_id": "excel-principiantes",
        "title": "Excel para Principiantes",
        \"price\": 24.50
    }
    
    Response:
    {
        \"success\": true,
        \"init_point\": \"https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...\",
        \"preference_id\": \"123456789-xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx\",
        \"order_id\": 1
    }
    """
    try:
        # Parsear el body de la request
        data = json.loads(request.body)
        
        # Campos requeridos del cliente
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        document = data.get('document', '').strip()
        email = data.get('email', '').strip()
        
        # Validar campos requeridos
        if not first_name:
            return JsonResponse({
                'success': False,
                'error': 'El nombre es requerido'
            }, status=400)
        
        if not last_name:
            return JsonResponse({
                'success': False,
                'error': 'El apellido es requerido'
            }, status=400)
        
        if not document:
            return JsonResponse({
                'success': False,
                'error': 'El DNI/CUIT es requerido'
            }, status=400)
        
        # Validar que el documento solo contenga números
        if not document.replace('.', '').replace('-', '').isdigit():
            return JsonResponse({
                'success': False,
                'error': 'El DNI/CUIT debe contener solo números'
            }, status=400)
        
        if not email:
            return JsonResponse({
                'success': False,
                'error': 'El email es requerido'
            }, status=400)
        
        # Validar formato de email básico
        if '@' not in email or '.' not in email:
            return JsonResponse({
                'success': False,
                'error': 'El formato del email no es válido'
            }, status=400)
        
        # Datos del curso
        course_id = data.get('course_id', 'curso-excel')
        title = data.get('title', 'Curso AIExcel')
        price = float(data.get('price', 0))
        quantity = int(data.get('quantity', 1))
        
        # Validar precio
        if price <= 0:
            return JsonResponse({
                'success': False,
                'error': 'El precio debe ser mayor a 0'
            }, status=400)
        
        # ========================================
        # PASO 1: Crear Order en la base de datos
        # ========================================
        order = Order.objects.create(
            first_name=first_name,
            last_name=last_name,
            document=document,
            email=email,
            course_id=course_id,
            course_title=title,
            price=price,
            status='pending'
        )
        
        # ========================================
        # PASO 2: Crear preferencia en Mercado Pago
        # ========================================
        preference_data = {
            "items": [
                {
                    "id": course_id,
                    "title": title,
                    "currency_id": "ARS",
                    "unit_price": price,
                    "quantity": quantity,
                    "description": f"Acceso completo al curso: {title}",
                    "category_id": "learnings",
                }
            ],
            # URLs de retorno - El frontend maneja estos estados
            "back_urls": {
                "success": f"{FRONTEND_URL}/pago-exitoso",
                "failure": f"{FRONTEND_URL}/pago-fallido",
                "pending": f"{FRONTEND_URL}/pago-pendiente",
            },
            # IMPORTANTE: external_reference = order.id para vincular
            "external_reference": str(order.id),
            "statement_descriptor": "ALEXCEL",
            "expires": False,
            # Datos del pagador
            "payer": {
                "name": first_name,
                "surname": last_name,
                "email": email,
                "identification": {
                    "type": "DNI",
                    "number": document.replace('.', '').replace('-', '')
                }
            }
        }
        
        # Crear la preferencia en Mercado Pago
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response.get("response", {})
        
        if "id" not in preference:
            # Si falla MP, marcamos la orden como cancelada
            order.status = 'cancelled'
            order.save()
            return JsonResponse({
                'success': False,
                'error': 'Error al crear la preferencia de pago',
                'details': preference_response
            }, status=500)
        
        # Guardar el preference_id en la orden
        order.preference_id = preference.get('id')
        order.save()
        
        # Retornar el init_point para redirect
        return JsonResponse({
            'success': True,
            'init_point': preference.get('init_point'),
            'sandbox_init_point': preference.get('sandbox_init_point'),
            'preference_id': preference.get('id'),
            'order_id': order.id
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'JSON inválido en el body de la request'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def pago_exitoso(request):
    """
    Valida un pago exitoso y solicita el envío del producto por mail.
    """
    try:
        # Obtener parámetros de la URL
        payment_id = request.GET.get('payment_id') or request.GET.get('collection_id')
        external_reference = request.GET.get('external_reference')
        
        if not payment_id or not external_reference:
            return JsonResponse({'success': False, 'error': 'Faltan parámetros'}, status=400)
        
        # 1. Recuperar la Orden
        try:
            # Asegurarse que es un int para evitar inyecciones raras
            order_id = int(external_reference)
            order = Order.objects.get(id=order_id)
        except (Order.DoesNotExist, ValueError):
            return JsonResponse({'success': False, 'error': 'Orden no válida'}, status=404)
            
        # 2. Verificar estado real con Mercado Pago
        try:
            payment_response = sdk.payment().get(payment_id)
            if payment_response["status"] != 200:
                logger.error(f"Error consultando MP: {payment_response}")
                return JsonResponse({'success': False, 'error': 'Error consultando MP'}, status=502)
                
            remote_payment = payment_response.get("response", {})
            real_status = remote_payment.get("status")
            status_detail = remote_payment.get("status_detail")
            
        except Exception as e:
            logger.error(f"Excepción conectando con MP: {e}")
            return JsonResponse({'success': False, 'error': 'Error de conexión con MP'}, status=502)

        # 3. Procesar si está aprobado
        if real_status == 'approved':
            # Actualizar orden
            order.status = 'approved'
            order.payment_id = payment_id
            order.save()
            
            # ------------------------------------------------------------------
            # ENVÍO DE EMAIL CON PRODUCTO (CORE REQUIREMENT)
            # ------------------------------------------------------------------
            email_sent = send_product_email(order)
            
            return JsonResponse({
                'success': True,
                'status': 'approved',
                'payment_id': payment_id,
                'email_sent': email_sent,
                'order_id': order.id,
                'message': 'Pago aprobado. El email con la descarga ha sido enviado.'
            })
            
        else:
            # Pago no aprobado (in_process, rejected, etc)
            logger.warning(f"Pago {payment_id} no aprobado. Estado: {real_status}")
            return JsonResponse({
                'success': False,
                'status': real_status,
                'status_detail': status_detail,
                'message': 'El pago no se encuentra aprobado.'
            })

    except Exception as e:
        logger.exception("Error no manejado en pago_exitoso")
        return JsonResponse({'success': False, 'error': f'Error interno: {str(e)}'}, status=500)
        
        payment_status = payment_info.get('status')
        payment_status_detail = payment_info.get('status_detail')
        transaction_amount = payment_info.get('transaction_amount')
        
        # ========================================
        # PASO 3: Actualizar Order en la BD
        # ========================================
        order.payment_id = payment_id
        
        # Mapear status de MP a nuestro status
        status_mapping = {
            'approved': 'approved',
            'pending': 'pending',
            'in_process': 'in_process',
            'rejected': 'rejected',
            'cancelled': 'cancelled',
            'refunded': 'refunded',
        }
        order.status = status_mapping.get(payment_status, 'pending')
        order.save()
        
        # ========================================
        # PASO 4: Responder según el estado
        # ========================================
        if payment_status == 'approved':
            # Pago aprobado - retornar info de éxito
            # El frontend puede usar esta info para mostrar el botón de descarga
            return JsonResponse({
                'success': True,
                'payment_id': payment_id,
                'status': 'approved',
                'status_detail': payment_status_detail,
                'amount': transaction_amount,
                'order_id': order.id,
                'customer_name': order.full_name,
                'customer_email': order.email,
                'course_title': order.course_title,
                'message': '¡Pago procesado exitosamente! Ya puedes descargar tu curso.',
                'download_url': f'/api/payments/download/{order.id}/?token={payment_id}'
            })
        else:
            # Pago no aprobado
            return JsonResponse({
                'success': False,
                'payment_id': payment_id,
                'status': payment_status,
                'status_detail': payment_status_detail,
                'order_id': order.id,
                'error': f'El pago no fue aprobado. Estado: {payment_status}'
            }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def download_file(request, order_id):
    """
    Endpoint para descargar el archivo del curso.
    Solo permite descarga si la orden está aprobada.
    
    Requiere el payment_id como token de verificación.
    
    URL: /api/payments/download/<order_id>/?token=<payment_id>
    """
    try:
        token = request.GET.get('token')
        
        if not token:
            return JsonResponse({
                'success': False,
                'error': 'Token de descarga no proporcionado'
            }, status=401)
        
        # Buscar la orden
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Orden no encontrada'
            }, status=404)
        
        # Verificar que el token coincide con el payment_id
        if order.payment_id != token:
            return JsonResponse({
                'success': False,
                'error': 'Token de descarga inválido'
            }, status=401)
        
        # Verificar que el pago está aprobado
        if order.status != 'approved':
            return JsonResponse({
                'success': False,
                'error': f'El pago no está aprobado. Estado actual: {order.status}'
            }, status=403)
        
        # Servir el archivo
        file_path = Path(COURSE_FILE_PATH)
        
        if not file_path.exists():
            return JsonResponse({
                'success': False,
                'error': 'Archivo del curso no encontrado. Contacta al soporte.'
            }, status=500)
        
        # Retornar el archivo para descarga
        response = FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=f'{order.course_id}.zip'
        )
        return response
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def webhook(request):
    """
    Webhook para recibir notificaciones de Mercado Pago.
    
    IMPORTANTE: Actualiza la Order en la BD cuando MP notifica cambios.
    Esto es crítico para casos donde el usuario cierra el browser
    antes de ser redirigido de vuelta.
    """
    try:
        # Obtener el tipo de notificación
        topic = request.GET.get('topic') or request.GET.get('type')
        resource_id = request.GET.get('id') or request.GET.get('data.id')
        
        # Parsear body si existe
        body = {}
        if request.body:
            try:
                body = json.loads(request.body)
            except json.JSONDecodeError:
                pass
        
        # Si es una notificación de pago
        if topic == 'payment' or body.get('type') == 'payment':
            payment_id = resource_id or body.get('data', {}).get('id')
            
            if payment_id:
                # Consultar el pago
                payment_response = sdk.payment().get(payment_id)
                payment_info = payment_response.get("response", {})
                
                if payment_info:
                    external_reference = payment_info.get('external_reference')
                    payment_status = payment_info.get('status')
                    
                    if external_reference:
                        try:
                            order = Order.objects.get(id=int(external_reference))
                            order.payment_id = str(payment_id)
                            
                            # Mapear status
                            status_mapping = {
                                'approved': 'approved',
                                'pending': 'pending',
                                'in_process': 'in_process',
                                'rejected': 'rejected',
                                'cancelled': 'cancelled',
                                'refunded': 'refunded',
                            }
                            order.status = status_mapping.get(payment_status, order.status)
                            order.save()
                            
                            print(f"[WEBHOOK] Order #{order.id} actualizada: {payment_status}")
                            print(f"[WEBHOOK] Cliente: {order.full_name} ({order.email})")
                            
                        except Order.DoesNotExist:
                            print(f"[WEBHOOK] Order no encontrada: {external_reference}")
        
        # Siempre responder 200 OK
        return JsonResponse({'status': 'ok'})
        
    except Exception as e:
        print(f"[WEBHOOK ERROR] {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)})

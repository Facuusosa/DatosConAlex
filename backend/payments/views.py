"""
Vistas para integración con Mercado Pago - Flujo de Redirect (Checkout Pro)
=============================================================================
VERSIÓN PRODUCCIÓN - "Datos con Alex"

Este módulo maneja:
1. create_preference - Crea preferencias de pago con metadata del cliente
2. pago_exitoso - Valida pagos por redirección y envía emails
3. webhook - FUENTE DE VERDAD para notificaciones de Mercado Pago (backup)

ARQUITECTURA STATELESS:
- No usamos base de datos para órdenes
- Los datos del cliente viajan en la metadata de Mercado Pago
- El webhook actúa como backup si pago_exitoso falla

IMPORTANTE PARA PRODUCCIÓN:
- MP_ACCESS_TOKEN debe ser APP_USR-xxxx (no TEST-xxxx)
- FRONTEND_URL debe apuntar al dominio de Vercel
- EMAIL_HOST_USER y EMAIL_HOST_PASSWORD deben estar configuradas (Brevo SMTP)
=============================================================================
"""

import json
import os
import time
import hashlib
import hmac
from types import SimpleNamespace
from pathlib import Path
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import mercadopago
from dotenv import load_dotenv

import logging
from .services import send_product_email

logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURACIÓN
# =============================================================================

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / '.env')

# Inicializar SDK de Mercado Pago
MP_ACCESS_TOKEN = os.getenv('MP_ACCESS_TOKEN', '')
sdk = mercadopago.SDK(MP_ACCESS_TOKEN)

# URL del frontend para redirecciones (Railway/Vercel)
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Modo debug (desactivar en producción)
DEBUG_MODE = os.getenv('DEBUG', 'False').lower() == 'true'

# Cache simple en memoria para evitar envío duplicado de emails
# En producción real, usar Redis o similar
_processed_payments = set()


def is_production_token():
    """Verifica si estamos usando credenciales de producción."""
    return MP_ACCESS_TOKEN.startswith('APP_USR-')


def log_payment_event(event_type: str, payment_id: str, details: dict):
    """Log estructurado para monitoreo en Railway."""
    log_data = {
        "event": event_type,
        "payment_id": payment_id,
        "production": is_production_token(),
        **details
    }
    logger.info(f"[PAYMENT_EVENT] {json.dumps(log_data)}")


# =============================================================================
# CREATE PREFERENCE - Inicia el flujo de pago
# =============================================================================

@csrf_exempt
@require_http_methods(["POST"])
def create_preference(request):
    """
    Crea un ID de preferencia en Mercado Pago.
    
    STATELESS: Los datos del cliente se guardan en 'metadata' de MP,
    no en base de datos local.
    
    Request Body:
    {
        "first_name": "Juan",
        "last_name": "Pérez",
        "document": "12345678",
        "email": "cliente@email.com",
        "course_id": "tracker-habitos",
        "title": "Tracker de Hábitos",
        "price": 1.00,
        "quantity": 1
    }
    
    Response:
    {
        "success": true,
        "init_point": "https://www.mercadopago.com.ar/checkout/...",
        "preference_id": "xxx-xxx-xxx",
        "order_id": 1234567890
    }
    """
    try:
        data = json.loads(request.body)
        
        # Validar campos requeridos
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        document = data.get('document', '').strip()
        email = data.get('email', '').strip().lower()
        course_id = data.get('course_id', 'tracker-habitos')
        title = data.get('title', 'Producto Digital')
        price = float(data.get('price', 0))
        quantity = int(data.get('quantity', 1))

        # Validaciones básicas
        if not all([first_name, last_name, email, price]):
            return JsonResponse({
                'success': False, 
                'error': 'Faltan datos requeridos (nombre, apellido, email, precio)'
            }, status=400)
        
        if '@' not in email or '.' not in email:
            return JsonResponse({
                'success': False, 
                'error': 'Email inválido'
            }, status=400)
        
        if price <= 0:
            return JsonResponse({
                'success': False, 
                'error': 'El precio debe ser mayor a 0'
            }, status=400)

        # Generar ID de referencia (timestamp único)
        temp_order_id = int(time.time() * 1000)  # Milisegundos para mayor unicidad

        # Construir preferencia de Mercado Pago
        preference_data = {
            "items": [
                {
                    "id": course_id,
                    "title": title,
                    "currency_id": "ARS",
                    "unit_price": price,
                    "quantity": quantity,
                    "description": f"Archivo Excel: {title}",
                    "category_id": "learnings",
                }
            ],
            "back_urls": {
                "success": f"{FRONTEND_URL}/pago-exitoso",
                "failure": f"{FRONTEND_URL}/pago-fallido",
                "pending": f"{FRONTEND_URL}/pago-pendiente",
            },
            "auto_return": "approved",
            "external_reference": str(temp_order_id),
            "statement_descriptor": "DATOS CON ALEX",
            "payer": {
                "name": first_name,
                "surname": last_name,
                "email": email,
                "identification": {
                    "type": "DNI",
                    "number": document.replace('.', '').replace('-', '').replace(' ', '')
                }
            },
            # METADATA CRÍTICA - Aquí viajan los datos del cliente
            "metadata": {
                "customer_first_name": first_name,
                "customer_last_name": last_name,
                "customer_email": email,
                "course_id": course_id,
                "course_title": title,
                "price": price,
                "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        }
        
        # Log de inicio
        log_payment_event("PREFERENCE_CREATING", str(temp_order_id), {
            "email": email,
            "course": course_id,
            "price": price,
            "frontend_url": FRONTEND_URL
        })
        
        # Crear preferencia en MP
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response.get("response", {})
        
        if "id" not in preference:
            error_msg = preference_response.get("response", {}).get("message", "Error desconocido de Mercado Pago")
            logger.error(f"[MP_ERROR] create_preference failed: {preference_response}")
            return JsonResponse({
                'success': False, 
                'error': f'Error MP: {error_msg}'
            }, status=500)
        
        log_payment_event("PREFERENCE_CREATED", str(temp_order_id), {
            "preference_id": preference.get('id'),
            "init_point": preference.get('init_point', '')[:50] + "..."
        })
            
        # Respuesta exitosa
        # PRODUCCIÓN: usamos init_point
        # SANDBOX: usamos sandbox_init_point
        response_data = {
            'success': True,
            'preference_id': preference.get('id'),
            'order_id': temp_order_id
        }
        
        if is_production_token():
            response_data['init_point'] = preference.get('init_point')
        else:
            response_data['init_point'] = preference.get('sandbox_init_point')
            response_data['sandbox_init_point'] = preference.get('sandbox_init_point')
            
        return JsonResponse(response_data)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'error': 'JSON inválido en el request'
        }, status=400)
    except Exception as e:
        logger.exception("[CRITICAL] Error en create_preference")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


# =============================================================================
# PAGO EXITOSO - Validación por redirección (usuario presente)
# =============================================================================

@csrf_exempt
@require_http_methods(["GET"])
def pago_exitoso(request):
    """
    Valida el pago consultando a MP y envía el email.
    MÉTODO PRIMARIO de entrega. El webhook es backup.
    """
    print("=" * 80)
    print("[VALIDATE] ========== INICIO pago_exitoso ==========")
    print(f"[VALIDATE] Query params: {dict(request.GET)}")
    logger.info(f"[VALIDATE] ========== INICIO pago_exitoso ==========")
    
    try:
        # Obtener payment_id de los parámetros
        payment_id = request.GET.get('payment_id') or request.GET.get('collection_id')
        
        if not payment_id:
            print("[VALIDATE] ❌ ERROR: No hay payment_id en los parámetros")
            logger.warning("[VALIDATE] Llamada sin payment_id")
            return JsonResponse({
                'success': False, 
                'error': 'Falta payment_id en la URL'
            }, status=400)
        
        print(f"[VALIDATE] ✅ payment_id recibido: {payment_id}")
        logger.info(f"[VALIDATE] payment_id: {payment_id}")
        
        # Consultar a Mercado Pago para obtener datos REALES del pago
        print(f"[VALIDATE] Consultando MP API para payment {payment_id}...")
        try:
            payment_response = sdk.payment().get(payment_id)
            mp_http_status = payment_response.get("status")
            print(f"[VALIDATE] MP API respondió HTTP status: {mp_http_status}")
            
            if mp_http_status != 200:
                print(f"[VALIDATE] ❌ ERROR: MP devolvió status {mp_http_status}")
                print(f"[VALIDATE] Respuesta completa de MP: {json.dumps(payment_response, default=str)[:500]}")
                logger.error(f"[MP_ERROR] get payment {payment_id}: {payment_response}")
                return JsonResponse({
                    'success': False, 
                    'error': 'Error al consultar el pago con Mercado Pago'
                }, status=502)
            
            payment_data = payment_response.get("response", {})
            status = payment_data.get("status")
            status_detail = payment_data.get("status_detail", "N/A")
            amount = payment_data.get("transaction_amount")
            
            # Extraer metadata (MP convierte keys a snake_case)
            metadata = payment_data.get("metadata", {})
            
            print(f"[VALIDATE] ✅ Datos del pago obtenidos de MP:")
            print(f"[VALIDATE]    status         = {status}")
            print(f"[VALIDATE]    status_detail  = {status_detail}")
            print(f"[VALIDATE]    amount         = {amount}")
            print(f"[VALIDATE]    metadata keys  = {list(metadata.keys())}")
            print(f"[VALIDATE]    metadata       = {json.dumps(metadata, default=str)}")
            logger.info(f"[VALIDATE] Payment {payment_id}: status={status}, amount={amount}, metadata_keys={list(metadata.keys())}")
            
        except Exception as e:
            print(f"[VALIDATE] ❌ EXCEPCIÓN consultando MP: {type(e).__name__}: {e}")
            logger.exception(f"[CRITICAL] Error recuperando pago {payment_id}")
            return JsonResponse({
                'success': False, 
                'error': 'Error de conexión con Mercado Pago'
            }, status=502)

        # Solo procesamos pagos APROBADOS
        if status == 'approved':
            print(f"[VALIDATE] ✅ Pago APROBADO - procesando envío de email...")
            
            # Verificar si ya procesamos este pago (evitar doble envío)
            if payment_id in _processed_payments:
                print(f"[VALIDATE] ⚠️ Payment {payment_id} YA FUE PROCESADO anteriormente (skip)")
                logger.info(f"[SKIP] Payment {payment_id} ya fue procesado")
                return JsonResponse({
                    'success': True,
                    'status': 'approved',
                    'payment_id': payment_id,
                    'email_sent': True,
                    'message': '¡Pago exitoso! El email ya fue enviado anteriormente.'
                })
            
            # Construir objeto order para el servicio de email
            customer_email = metadata.get("customer_email", "")
            customer_name = metadata.get("customer_first_name", "Cliente")
            course_id = metadata.get("course_id", "tracker-habitos")
            course_title = metadata.get("course_title", "Producto Digital")
            
            print(f"[VALIDATE] Datos del cliente extraídos de metadata:")
            print(f"[VALIDATE]    customer_email = '{customer_email}'")
            print(f"[VALIDATE]    customer_name  = '{customer_name}'")
            print(f"[VALIDATE]    course_id      = '{course_id}'")
            print(f"[VALIDATE]    course_title   = '{course_title}'")
            
            # Validar que tenemos email del cliente
            if not customer_email:
                print(f"[VALIDATE] ❌ ERROR: No hay customer_email en metadata!")
                print(f"[VALIDATE]    Metadata completa: {json.dumps(metadata, default=str)}")
                logger.error(f"[ERROR] No hay email en metadata para payment {payment_id}")
                return JsonResponse({
                    'success': True,
                    'status': 'approved',
                    'payment_id': payment_id,
                    'email_sent': False,
                    'email_error': 'No se encontró el email del cliente en la metadata',
                    'message': '¡Pago exitoso! Pero no pudimos enviar el email. Contactanos a datos.conalex@gmail.com'
                })
            
            fake_order = SimpleNamespace(
                id=payment_data.get("external_reference", payment_id),
                first_name=customer_name,
                email=customer_email,
                course_title=course_title,
                course_id=course_id,
                price=metadata.get("price", amount or 0),
                status=status
            )
            
            # Enviar email con producto
            email_sent = False
            email_error = None
            
            try:
                print(f"[VALIDATE] 📧 Llamando a send_product_email()...")
                print(f"[VALIDATE]    → to: {fake_order.email}")
                print(f"[VALIDATE]    → product: {fake_order.course_id}")
                print(f"[VALIDATE]    → name: {fake_order.first_name}")
                logger.info(f"[EMAIL] Enviando a {fake_order.email} - Producto: {fake_order.course_id}")
                
                email_sent = send_product_email(fake_order)
                
                print(f"[VALIDATE] 📧 send_product_email() retornó: {email_sent}")
                
                if email_sent:
                    _processed_payments.add(payment_id)
                    print(f"[VALIDATE] ✅ EMAIL ENVIADO EXITOSAMENTE")
                    logger.info(f"[EMAIL_SENT_SUCCESS] Payment {payment_id} → {fake_order.email}")
                else:
                    print(f"[VALIDATE] ❌ send_product_email retornó False - EMAIL NO ENVIADO")
                    logger.error(f"[EMAIL_SENT_FAILED] Payment {payment_id} → {fake_order.email}")
                    
            except Exception as email_ex:
                email_error = str(email_ex)
                print(f"[VALIDATE] ❌ EXCEPCIÓN en send_product_email: {type(email_ex).__name__}: {email_error}")
                logger.error(f"[CRITICAL] Email error for {payment_id}: {email_error}")
            
            print(f"[VALIDATE] ========== FIN pago_exitoso (email_sent={email_sent}) ==========")
            print("=" * 80)
            
            return JsonResponse({
                'success': True,
                'status': 'approved',
                'payment_id': payment_id,
                'email_sent': email_sent,
                'email_error': email_error,
                'customer_email': customer_email[:3] + "***",
                'message': '¡Pago exitoso! Revisá tu email (y la carpeta de spam).' if email_sent 
                          else '¡Pago exitoso! Hubo un problema enviando el email, contactanos a datos.conalex@gmail.com'
            })
        
        elif status == 'pending':
            print(f"[VALIDATE] ⏳ Pago PENDIENTE - no se envía email")
            return JsonResponse({
                'success': False,
                'status': 'pending',
                'message': 'Tu pago está pendiente de acreditación. Te avisaremos cuando se confirme.'
            })
        
        elif status == 'in_process':
            print(f"[VALIDATE] ⏳ Pago EN PROCESO - no se envía email")
            return JsonResponse({
                'success': False,
                'status': 'in_process',
                'message': 'Tu pago está siendo procesado. Recibirás el producto una vez se confirme.'
            })
        
        else:
            print(f"[VALIDATE] ❌ Pago NO aprobado. Status: {status}")
            return JsonResponse({
                'success': False, 
                'status': status,
                'message': f'El pago no fue aprobado. Estado: {status}'
            })

    except Exception as e:
        print(f"[VALIDATE] ❌ EXCEPCIÓN GENERAL: {type(e).__name__}: {e}")
        logger.exception("[CRITICAL] Error en pago_exitoso")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


# =============================================================================
# DOWNLOAD FILE - Legacy endpoint
# =============================================================================

@csrf_exempt
@require_http_methods(["GET"])
def download_file(request, order_id):
    """
    Endpoint legacy - No funciona en arquitectura stateless.
    Los archivos se entregan por email.
    """
    return JsonResponse({
        'error': 'Este endpoint ya no está disponible. El archivo fue enviado a tu email.'
    }, status=410)


# =============================================================================
# WEBHOOK - Fuente de verdad y backup (Mercado Pago notifica aquí)
# =============================================================================

@csrf_exempt
@require_http_methods(["POST", "GET"])
def webhook(request):
    """
    Webhook de Mercado Pago - FUENTE DE VERDAD para notificaciones.
    Backup cuando pago_exitoso no se ejecuta.
    SIEMPRE responde 200 OK para que MP no reintente.
    """
    # GET request = MP verificando que el webhook existe
    if request.method == 'GET':
        return JsonResponse({'status': 'webhook active', 'production': is_production_token()})
    
    print("=" * 80)
    print("[WEBHOOK] ========== NOTIFICACIÓN RECIBIDA ==========")
    logger.info("[WEBHOOK] ========== NOTIFICACIÓN RECIBIDA ==========")
    
    try:
        # 1. PARSEAR BODY
        raw_body = request.body.decode('utf-8', errors='replace') if request.body else '{}'
        print(f"[WEBHOOK] PASO 1 - Raw body recibido: {raw_body[:1000]}")
        logger.info(f"[WEBHOOK] Raw body: {raw_body[:500]}")
        
        try:
            body = json.loads(request.body) if request.body else {}
        except json.JSONDecodeError as jde:
            print(f"[WEBHOOK] ❌ ERROR parseando JSON: {jde}")
            body = {}
        
        # 2. IDENTIFICAR TIPO DE NOTIFICACIÓN
        notification_type = body.get('type', 'unknown')
        action = body.get('action', 'unknown')
        
        print(f"[WEBHOOK] PASO 2 - Tipo de notificación:")
        print(f"[WEBHOOK]    type   = '{notification_type}'")
        print(f"[WEBHOOK]    action = '{action}'")
        print(f"[WEBHOOK]    keys   = {list(body.keys())}")
        logger.info(f"[WEBHOOK] type={notification_type}, action={action}")
        
        # Solo procesamos notificaciones de pago
        if notification_type != 'payment':
            print(f"[WEBHOOK] ⚠️ Ignorando - no es tipo 'payment' (es '{notification_type}')")
            logger.info(f"[WEBHOOK] Ignorando notificación tipo: {notification_type}")
            return JsonResponse({'status': 'ignored', 'reason': 'not a payment notification'})
        
        # 3. EXTRAER PAYMENT_ID
        data = body.get('data', {})
        payment_id = data.get('id') or body.get('data.id')
        
        print(f"[WEBHOOK] PASO 3 - Extracción de payment_id:")
        print(f"[WEBHOOK]    body['data']      = {data}")
        print(f"[WEBHOOK]    payment_id        = {payment_id}")
        
        if not payment_id:
            print("[WEBHOOK] ❌ ERROR: No se pudo extraer payment_id")
            logger.warning("[WEBHOOK] No payment_id en la notificación")
            return JsonResponse({'status': 'ignored', 'reason': 'no payment_id'})
        
        payment_id = str(payment_id)
        print(f"[WEBHOOK] ✅ payment_id: {payment_id}")
        
        # 4. CHECK DUPLICADOS
        if payment_id in _processed_payments:
            print(f"[WEBHOOK] ⚠️ Payment {payment_id} YA PROCESADO (en caché). Skip.")
            logger.info(f"[WEBHOOK] Payment {payment_id} ya procesado, skipping")
            return JsonResponse({'status': 'already_processed'})
        
        print(f"[WEBHOOK] PASO 4 - Payment {payment_id} NO está en caché. Procesando...")
        
        # 5. CONSULTAR DETALLES DEL PAGO A MP
        print(f"[WEBHOOK] PASO 5 - Consultando MP API sdk.payment().get({payment_id})...")
        try:
            payment_response = sdk.payment().get(payment_id)
            mp_http_status = payment_response.get("status")
            
            print(f"[WEBHOOK]    MP API HTTP status: {mp_http_status}")
            
            if mp_http_status != 200:
                print(f"[WEBHOOK] ❌ ERROR: MP devolvió HTTP {mp_http_status}")
                print(f"[WEBHOOK]    Respuesta: {json.dumps(payment_response, default=str)[:500]}")
                logger.error(f"[WEBHOOK] Error obteniendo pago {payment_id}: {payment_response}")
                return JsonResponse({'status': 'error', 'reason': 'mp_api_error'}, status=200)
            
            payment_data = payment_response.get("response", {})
            status = payment_data.get("status")
            status_detail = payment_data.get("status_detail", "N/A")
            amount = payment_data.get("transaction_amount")
            metadata = payment_data.get("metadata", {})
            
            print(f"[WEBHOOK] ✅ Datos del pago obtenidos de MP:")
            print(f"[WEBHOOK]    status         = '{status}'")
            print(f"[WEBHOOK]    status_detail  = '{status_detail}'")
            print(f"[WEBHOOK]    amount         = {amount}")
            print(f"[WEBHOOK]    metadata keys  = {list(metadata.keys())}")
            print(f"[WEBHOOK]    metadata FULL  = {json.dumps(metadata, default=str)}")
            logger.info(f"[WEBHOOK] Payment {payment_id}: status={status}, amount={amount}")
            
        except Exception as e:
            print(f"[WEBHOOK] ❌ EXCEPCIÓN consultando MP: {type(e).__name__}: {e}")
            logger.exception(f"[WEBHOOK] Error consultando MP para {payment_id}")
            return JsonResponse({'status': 'error', 'reason': str(e)}, status=200)
        
        # 6. VERIFICAR APROBACIÓN
        if status != 'approved':
            print(f"[WEBHOOK] ⚠️ Pago NO aprobado (status='{status}'). No se envía email.")
            logger.info(f"[WEBHOOK] Payment {payment_id} status={status}, no action needed")
            return JsonResponse({'status': 'noted', 'payment_status': status})
        
        print(f"[WEBHOOK] ✅ PASO 6 - Pago APROBADO. Preparando envío de email...")
        
        # 7. EXTRAER DATOS DEL CLIENTE DE METADATA
        customer_email = metadata.get("customer_email", "")
        customer_name = metadata.get("customer_first_name", "Cliente")
        course_id = metadata.get("course_id", "tracker-habitos")
        course_title = metadata.get("course_title", "Producto Digital")
        
        print(f"[WEBHOOK] PASO 7 - Datos del cliente de metadata:")
        print(f"[WEBHOOK]    customer_email = '{customer_email}'")
        print(f"[WEBHOOK]    customer_name  = '{customer_name}'")
        print(f"[WEBHOOK]    course_id      = '{course_id}'")
        print(f"[WEBHOOK]    course_title   = '{course_title}'")
        
        if not customer_email:
            print(f"[WEBHOOK] ❌ ERROR: No hay customer_email en metadata!")
            print(f"[WEBHOOK]    metadata completa: {json.dumps(metadata, default=str)}")
            logger.error(f"[WEBHOOK] No email en metadata para {payment_id}")
            return JsonResponse({
                'status': 'error', 
                'reason': 'no_customer_email',
                'action': 'manual_intervention_required'
            }, status=200)
        
        # 8. CONSTRUIR ORDEN Y ENVIAR EMAIL
        fake_order = SimpleNamespace(
            id=payment_data.get("external_reference", payment_id),
            first_name=customer_name,
            email=customer_email,
            course_title=course_title,
            course_id=course_id,
            price=metadata.get("price", amount or 0),
            status=status
        )
        
        print(f"[WEBHOOK] PASO 8 - fake_order construido:")
        print(f"[WEBHOOK]    id     = {fake_order.id}")
        print(f"[WEBHOOK]    email  = {fake_order.email}")
        print(f"[WEBHOOK]    course = {fake_order.course_id}")
        
        try:
            print(f"[WEBHOOK] 📧 Llamando a send_product_email()...")
            logger.info(f"[WEBHOOK] Enviando email a {customer_email} para payment {payment_id}")
            
            email_sent = send_product_email(fake_order)
            
            print(f"[WEBHOOK] 📧 send_product_email() retornó: {email_sent}")
            
            if email_sent:
                _processed_payments.add(payment_id)
                print(f"[WEBHOOK] ✅ ¡EMAIL ENVIADO EXITOSAMENTE!")
                print(f"[WEBHOOK] ========== FIN WEBHOOK (éxito) ==========")
                print("=" * 80)
                logger.info(f"[WEBHOOK_EMAIL_SUCCESS] {payment_id} → {customer_email}")
                return JsonResponse({'status': 'processed', 'email_sent': True})
            else:
                print(f"[WEBHOOK] ❌ send_product_email retornó False - REVISAR LOGS DE services.py")
                print(f"[WEBHOOK] ========== FIN WEBHOOK (email falló) ==========")
                print("=" * 80)
                logger.error(f"[WEBHOOK_EMAIL_FAILED] {payment_id} → {customer_email}")
                return JsonResponse({'status': 'processed', 'email_sent': False})
                
        except Exception as e:
            print(f"[WEBHOOK] ❌ EXCEPCIÓN en send_product_email: {type(e).__name__}: {e}")
            import traceback
            print(f"[WEBHOOK] Traceback:\n{traceback.format_exc()}")
            print(f"[WEBHOOK] ========== FIN WEBHOOK (excepción) ==========")
            print("=" * 80)
            logger.exception(f"[WEBHOOK] Error enviando email para {payment_id}")
            return JsonResponse({
                'status': 'error', 
                'reason': 'email_failed',
                'error': str(e)
            }, status=200)
        
    except Exception as e:
        print(f"[WEBHOOK] ❌ EXCEPCIÓN GENERAL: {type(e).__name__}: {e}")
        import traceback
        print(f"[WEBHOOK] Traceback:\n{traceback.format_exc()}")
        print("=" * 80)
        logger.exception("[CRITICAL] Error general en webhook")
        # SIEMPRE responder 200 para que MP no reintente
        return JsonResponse({'status': 'error', 'reason': str(e)}, status=200)

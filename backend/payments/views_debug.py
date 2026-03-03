"""
Endpoints de diagnóstico y debug para el sistema de pagos.
==========================================================
Estos endpoints ayudan a verificar que todo esté configurado correctamente.

IMPORTANTE: En producción, considerar restringir acceso a estos endpoints.
==========================================================
"""

from django.http import JsonResponse
from django.conf import settings
from django.core.mail import EmailMessage
import os
import logging
from typing import Any

from .services import test_email_connection, list_available_products, validate_product_files

logger = logging.getLogger(__name__)


def health_check(request) -> JsonResponse:
    """
    Verificación básica de que el backend está corriendo.
    GET /api/payments/health/
    """
    mp_token = os.environ.get('MP_ACCESS_TOKEN', '')
    is_production = mp_token.startswith('APP_USR-')
    
    return JsonResponse({
        "status": "ok",
        "message": "Backend running - Datos con Alex",
        "email_service": "Brevo SMTP",
        "production_mode": is_production,
        "token_type": "production" if is_production else "sandbox/test"
    })


def env_check(request) -> JsonResponse:
    """
    Verificación de variables de entorno configuradas.
    GET /api/payments/env-check/
    
    Útil para diagnosticar problemas de configuración en Railway.
    """
    mp_token = os.environ.get('MP_ACCESS_TOKEN', '')
    email_user = os.environ.get('EMAIL_HOST_USER', '')
    email_pass = os.environ.get('EMAIL_HOST_PASSWORD', '')
    frontend_url = os.environ.get('FRONTEND_URL', 'Not Set')
    
    return JsonResponse({
        "environment": {
            "DEBUG": os.environ.get('DEBUG', 'Not Set'),
            "FRONTEND_URL": frontend_url,
        },
        "mercado_pago": {
            "token_configured": bool(mp_token),
            "token_prefix": mp_token[:15] + "..." if len(mp_token) > 15 else "Too short",
            "is_production": mp_token.startswith('APP_USR-'),
        },
        "email_brevo": {
            "host": os.environ.get('EMAIL_HOST', 'smtp-relay.brevo.com'),
            "port": os.environ.get('EMAIL_PORT', '587'),
            "user_configured": bool(email_user),
            "user_preview": email_user[:5] + "***" if len(email_user) > 5 else "Not Set",
            "password_configured": bool(email_pass),
            "from_email": settings.DEFAULT_FROM_EMAIL,
        },
        "django": {
            "allowed_hosts": os.environ.get('ALLOWED_HOSTS', 'Not Set'),
            "secret_key_set": bool(os.environ.get('DJANGO_SECRET_KEY')),
        }
    })


def products_check(request) -> JsonResponse:
    """
    Verificación de productos y archivos disponibles.
    GET /api/payments/products-check/
    
    Muestra todos los productos configurados y si sus archivos existen.
    """
    return JsonResponse(list_available_products())


def test_email(request) -> JsonResponse:
    """
    Prueba de envío de email con Brevo SMTP.
    GET /api/payments/test-email/?to=tu@email.com
    
    NOTA: Requiere EMAIL_HOST, EMAIL_HOST_USER y EMAIL_HOST_PASSWORD configurados.
    """
    destinatario = request.GET.get('to')
    if not destinatario:
        return JsonResponse({
            "status": "error", 
            "message": "Falta parámetro 'to'. Uso: /api/payments/test-email/?to=tu@email.com"
        }, status=400)
    
    # Verificar configuración
    email_check = test_email_connection()
    if not email_check.get("config_valid"):
        return JsonResponse({
            "status": "error",
            "message": "Configuración de email inválida",
            "details": email_check
        }, status=500)
    
    try:
        email = EmailMessage(
            subject="🧪 Prueba de Email - Datos con Alex",
            body="""
                <div style="font-family: sans-serif; padding: 20px; background: #1a1a1a; color: white; border-radius: 10px;">
                    <h2 style="color: #22c55e;">✅ Email de Prueba Exitoso</h2>
                    <p>Si estás leyendo esto, el sistema de emails funciona correctamente.</p>
                    <p style="color: #888; font-size: 12px;">Enviado desde el backend de Datos con Alex vía Brevo SMTP</p>
                </div>
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[destinatario],
            reply_to=[settings.EMAIL_HOST_USER] if settings.EMAIL_HOST_USER else None
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)
        
        return JsonResponse({
            "status": "ok",
            "message": f"✅ Email de prueba enviado a {destinatario}",
            "service": "Brevo SMTP",
            "from": settings.DEFAULT_FROM_EMAIL
        })
        
    except Exception as e:
        logger.exception("Error en test_email")
        return JsonResponse({
            "status": "error",
            "message": str(e),
            "type": type(e).__name__
        }, status=500)


def system_status(request) -> JsonResponse:
    """
    Estado completo del sistema.
    GET /api/payments/system-status/
    
    Resumen de todos los checks para verificar que el sistema está listo.
    """
    mp_token = os.environ.get('MP_ACCESS_TOKEN', '')
    email_user = os.environ.get('EMAIL_HOST_USER', '')
    email_pass = os.environ.get('EMAIL_HOST_PASSWORD', '')
    frontend_url = os.environ.get('FRONTEND_URL', '')
    
    # Verificar productos
    products = list_available_products()
    all_products_ready = all(
        p.get("all_files_exist", False) 
        for p in products.get("products", [])
    )
    
    # Calcular status general
    checks = {
        "mp_token_production": mp_token.startswith('APP_USR-'),
        "brevo_user_configured": bool(email_user),
        "brevo_password_configured": bool(email_pass),
        "frontend_url_set": bool(frontend_url),
        "all_products_ready": all_products_ready,
        "debug_off": os.environ.get('DEBUG', 'True').lower() != 'true',
    }
    
    all_ok = all(checks.values())
    
    return JsonResponse({
        "ready_for_production": all_ok,
        "email_service": "Gmail SMTP",
        "checks": checks,
        "products": products,
        "recommendation": "🚀 Sistema listo para producción" if all_ok else "⚠️ Revisar checks fallidos"
    })

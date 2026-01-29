
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
import os
import logging

logger = logging.getLogger(__name__)

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Backend is running!"})

def env_check(request):
    token = os.getenv('MP_ACCESS_TOKEN')
    frontend = os.getenv('FRONTEND_URL')
    
    # Check EMAIL vars (safely)
    email_host = os.getenv('EMAIL_HOST')
    email_user = os.getenv('EMAIL_HOST_USER')
    
    return JsonResponse({
        "has_mp_token": bool(token),
        "frontend_url_set": bool(frontend),
        "frontend_url_value": frontend if frontend else "Not Set",
        "email_host": email_host,
        "email_user": email_user,
        "email_debug": bool(os.getenv('DEBUG')),
    })

def test_email(request):
    """
    Intenta enviar un email de prueba y reporta el error exacto si falla.
    Uso: /api/payments/test-email/?to=tu@email.com
    """
    destinatario = request.GET.get('to')
    if not destinatario:
        return JsonResponse({"status": "error", "message": "Falta parametro 'to'"}, status=400)
    
    try:
        send_mail(
            subject="Prueba de SMTP - ALEXCEL",
            message="Si lees esto, el envío de emails funciona en Railway.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[destinatario],
            fail_silently=False,
        )
        return JsonResponse({"status": "ok", "message": f"Email enviado a {destinatario}"})
    except Exception as e:
        logger.exception("Error test_email")
        return JsonResponse({
            "status": "error", 
            "message": str(e),
            "type": type(e).__name__
        }, status=500)

import os
import django
from django.core.mail import send_mail
from dotenv import load_dotenv

load_dotenv()

import sys
from django.conf import settings

if not settings.configured:
    settings.configure(
        EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend',
        EMAIL_HOST = 'smtp.gmail.com',
        EMAIL_PORT = 465,  # CAMBIO: Puerto SSL
        EMAIL_USE_TLS = False, # CAMBIO: No TLS
        EMAIL_USE_SSL = True,  # CAMBIO: Usar SSL
        EMAIL_HOST_PASSWORD = 'yzmpilwyefccibps', # Sin espacios
        DEFAULT_FROM_EMAIL = 'facuu2009@gmail.com',
    )
    django.setup()

def probar_email():
    print("--- PRUEBA SMTP SSL (PUERTO 465) ---")
    try:
        print("Conectando vía SSL...")
        send_mail(
            'Prueba Alexcel SSL',
            'Prueba por puerto 465 SSL exitosa.',
            'facuu2009@gmail.com',
            ['facuu2009@gmail.com'],
            fail_silently=False,
        )
        print("✅ ¡ÉXITO! Conexión SSL establecida y correo enviado.")
    except Exception as e:
        print(f"❌ FALLO SSL: {e}")

if __name__ == "__main__":
    probar_email()

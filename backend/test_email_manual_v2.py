import os
import django
from django.core.mail import send_mail
from dotenv import load_dotenv

# Cargar .env manualmente para el script
load_dotenv()

# Configurar settings mínimos necesarios para el script
import sys
from django.conf import settings

# Solo configurar si no está configurado
if not settings.configured:
    settings.configure(
        EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend',
        EMAIL_HOST = 'smtp.gmail.com',
        EMAIL_PORT = 587,
        EMAIL_USE_TLS = True,
        EMAIL_HOST_USER = 'facuu2009@gmail.com', # Hardcodeado para debug
        EMAIL_HOST_PASSWORD = 'vrlw acgv pbwc gllc', # Hardcodeado para debug
        DEFAULT_FROM_EMAIL = 'facuu2009@gmail.com',
    )
    django.setup()

def probar_email():
    print("--- INICIANDO PRUEBA DE EMAIL ---")
    print(f"Usuario: {settings.EMAIL_HOST_USER}")
    
    try:
        print("Intentando enviar correo...")
        send_mail(
            'Prueba Técnica de Alexcel V2',
            'Si lees esto, con la nueva clave funcionó 🚀',
            'facuu2009@gmail.com',
            ['facuu2009@gmail.com'],
            fail_silently=False,
        )
        print("✅ ¡ÉXITO! El correo fue enviado. Revisá tu bandeja de entrada.")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    probar_email()

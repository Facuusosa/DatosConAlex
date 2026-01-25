import os
import django
from django.conf import settings
from django.core.mail import send_mail

# Configurar entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def probar_email():
    print("--- INICIANDO PRUEBA DE EMAIL ---")
    print(f"Usuario: {settings.EMAIL_HOST_USER}")
    
    try:
        print("Intentando enviar correo...")
        send_mail(
            'Prueba Técnica de Alexcel',
            'Si lees esto, el sistema de correos funciona perfecto 🚀',
            settings.DEFAULT_FROM_EMAIL,
            ['facuu2009@gmail.com'], # Tu email
            fail_silently=False,
        )
        print("✅ ¡ÉXITO! El correo fue enviado. Revisá tu bandeja de entrada.")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    probar_email()

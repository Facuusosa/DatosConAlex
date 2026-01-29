
import os
import resend
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def test_send():
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        print("❌ Error: NO se encontró RESEND_API_KEY en variables de entorno.")
        return

    resend.api_key = api_key
    print(f"🔑 Usando API Key: {api_key[:5]}...")

    params = {
        "from": "Datos con Alex <onboarding@resend.dev>",
        "to": ["datos.conalex@gmail.com"],
        "subject": "Test Resend Directo",
        "html": "<h1>Funciona!</h1><p>Este es un email enviado desde el script de prueba de Resend.</p>",
    }

    print("📨 Enviando email...")
    try:
        r = resend.Emails.send(params)
        print("✅ ÉXITO!")
        print(f"🆔 ID del Email: {r.get('id')}")
        print(r)
    except Exception as e:
        print(f"❌ FALLO EL ENVIO: {e}")

if __name__ == "__main__":
    test_send()

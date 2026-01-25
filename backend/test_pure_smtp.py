import smtplib
from email.mime.text import MIMEText

# Credenciales
USER = 'facuu2009@gmail.com'
PASS = 'yzmp ilwy efcc ibps'  # Con espacios

def test_smtp_pure():
    print(f"--- DIAGNÓSTICO SMTP PURO ---")
    print(f"Usuario: {USER}")
    
    try:
        # Intento 1: Puerto 587 (TLS) - El estándar moderno
        print("\n1. Probando conexión TLS (587)...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.set_debuglevel(1) # Veremos el diálogo exacto
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(USER, PASS)
        print("✅ LOGIN EXITOSO EN 587")
        
        # Enviar
        msg = MIMEText("Prueba de diagnóstico exitosa")
        msg['Subject'] = "Diagnóstico Alexcel OK"
        msg['From'] = USER
        msg['To'] = USER
        
        server.sendmail(USER, [USER], msg.as_string())
        print("✅ CORREO ENVIADO")
        server.quit()
        return

    except Exception as e:
        print(f"❌ FALLÓ 587: {e}")
    
    try:
        # Intento 2: Puerto 465 (SSL) - Legacy robusto
        print("\n2. Probando conexión SSL (465)...")
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.set_debuglevel(1)
        server.ehlo()
        server.login(USER, PASS)
        print("✅ LOGIN EXITOSO EN 465")
        
        server.sendmail(USER, [USER], f"Subject: Test SSL\n\nTest SSL OK")
        print("✅ CORREO ENVIADO")
        server.quit()
        
    except Exception as e:
        print(f"❌ FALLÓ 465: {e}")

if __name__ == '__main__':
    test_smtp_pure()

"""
Servicio de envío de emails con productos - Datos con Alex
===========================================================
Versión Producción - Brevo API (HTTPS)

Usa Brevo API (SIB SDK) para enviar emails, evitando el bloqueo
de puertos SMTP (25, 587, 465) común en plataformas como Railway.

CONFIGURACIÓN REQUERIDA EN .env o variables de entorno:
- EMAIL_HOST_PASSWORD: Tu API Key de Brevo (xkeysib-...)
- DEFAULT_FROM_EMAIL: Email del remitente validado en Brevo
===========================================================
"""

from __future__ import annotations

import os
import logging
import base64
from pathlib import Path
from typing import Any

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from django.conf import settings

logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURACIÓN DE PRODUCTOS
# =============================================================================

PRODUCT_FILES: dict[str, list[str]] = {
    'tracker-habitos': ['tracker-habitos.xlsx'],
    'planificador-financiero': ['planificador-financiero.xlsx'],
    'pack-productividad': ['tracker-habitos.xlsx', 'planificador-financiero.xlsx'],
}

# =============================================================================
# VALIDACIÓN DE CONFIGURACIÓN
# =============================================================================

def validate_email_config() -> dict[str, Any]:
    errors: list[str] = []
    api_key = os.environ.get('EMAIL_HOST_PASSWORD', '')
    from_email = os.environ.get('DEFAULT_FROM_EMAIL', '')

    if not api_key:
        errors.append("EMAIL_HOST_PASSWORD (API Key) no está configurado")
    if not from_email:
        errors.append("DEFAULT_FROM_EMAIL no está configurado")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }

def validate_product_files(product_id: str) -> dict[str, Any]:
    """Valida la existencia de los archivos de un producto."""
    file_paths = get_product_files(product_id)
    result = {"product_id": product_id, "files": []}
    for path in file_paths:
        exists = os.path.exists(path)
        result["files"].append({
            "path": path,
            "filename": os.path.basename(path),
            "exists": exists,
            "size": os.path.getsize(path) if exists else 0
        })
    return result

# =============================================================================
# FUNCIONES DE ARCHIVOS
# =============================================================================

def get_product_files(product_id: str) -> list[str]:
    filenames = PRODUCT_FILES.get(product_id)
    if not filenames:
        filenames = [f"{product_id}.xlsx"]
    
    base_path = Path(settings.BASE_DIR) / 'files'
    return [str(base_path / f) for f in filenames]

# =============================================================================
# ENVÍO DE EMAIL VÍA API
# =============================================================================

def send_product_email(order: Any) -> bool:
    """
    Envía el email usando la API de Brevo (HTTPS).
    """
    config_check = validate_email_config()
    if not config_check["valid"]:
        logger.critical(f"[API ABORTED] Errores: {config_check['errors']}")
        return False

    try:
        # API Configuration
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = os.environ.get('EMAIL_HOST_PASSWORD')
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        # Destination Data
        recipient_email = getattr(order, 'email', '')
        customer_name = getattr(order, 'first_name', 'Cliente')
        product_id = getattr(order, 'course_id', '')
        product_title = getattr(order, 'course_title', 'Producto Digital')
        from_email = os.environ.get('DEFAULT_FROM_EMAIL')

        # Content
        html_content = f"""
        <html>
        <body style="font-family: sans-serif; color: #333; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; border: 1px solid #eee;">
                <h1 style="color: #22c55e;">🎉 ¡Gracias por tu compra!</h1>
                <p>Hola <strong>{customer_name}</strong>,</p>
                <p>Tu pedido <strong>{product_title}</strong> está confirmado.</p>
                <p>📎 <strong>Tus archivos están adjuntos a este correo.</strong></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Datos con Alex</p>
            </div>
        </body>
        </html>
        """

        # Attachments
        attachments = []
        file_paths = get_product_files(product_id)
        
        for path in file_paths:
            if os.path.exists(path):
                with open(path, "rb") as f:
                    content = base64.b64encode(f.read()).decode('utf-8')
                attachments.append({
                    "content": content,
                    "name": os.path.basename(path)
                })
            else:
                logger.error(f"[API] Archivo no existe: {path}")

        if not attachments:
            logger.error("[API ABORTED] No hay archivos para enviar")
            return False

        # Send SMTP Email object
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": recipient_email, "name": customer_name}],
            sender={"email": from_email, "name": "Datos con Alex"},
            subject=f"🎉 Tu compra: {product_title}",
            html_content=html_content,
            attachment=attachments
        )

        # Execute
        api_response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"[API SUCCESS] Email enviado vía API. ID: {api_response.message_id}")
        return True

    except ApiException as e:
        logger.error(f"[API FAILED] Error en Brevo API: {e}")
        return False
    except Exception as e:
        logger.exception(f"[API CRITICAL] Error inesperado: {e}")
        return False

# Mantenemos las otras funciones para compatibilidad con las vistas de debug
def test_email_connection():
    return {"service": "Brevo API (HTTPS)", "config_valid": validate_email_config()["valid"]}

def list_available_products():
    result = {"products": []}
    base_path = Path(settings.BASE_DIR) / 'files'
    for pid, files in PRODUCT_FILES.items():
        ready = all((base_path / f).exists() for f in files)
        result["products"].append({
            "id": pid, 
            "ready": ready,
            "all_files_exist": ready
        })
    return result

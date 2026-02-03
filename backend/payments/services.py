"""
Servicio de envío de emails con productos - Datos con Alex
===========================================================
Versión Producción

Usa Resend SDK para enviar emails con archivos adjuntos.

CONFIGURACIÓN REQUERIDA:
1. RESEND_API_KEY en variables de entorno
2. Dominio verificado en Resend (para usar email propio)
   - Sin dominio verificado: onboarding@resend.dev
   - Con dominio verificado: noreply@datosconalex.com

IMPORTANTE: Los archivos deben existir en backend/files/
===========================================================
"""

import os
import logging
from pathlib import Path
from django.conf import settings
import resend

logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURACIÓN DE PRODUCTOS
# =============================================================================

# Mapeo de product_id a archivos (puede ser uno o varios)
# IMPORTANTE: Los IDs deben coincidir EXACTAMENTE con los del frontend (data/planillas.ts)
PRODUCT_FILES = {
    'tracker-habitos': ['tracker-habitos.xlsx'],
    'planificador-financiero': ['planificador-financiero.xlsx'],
    'pack-productividad': ['tracker-habitos.xlsx', 'planificador-financiero.xlsx'],
}

# Configuración del remitente
# PRODUCCIÓN: Cuando tengas dominio verificado, cambiar a tu email
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Datos con Alex")
EMAIL_FROM_ADDRESS = os.getenv("DEFAULT_FROM_EMAIL", "onboarding@resend.dev")
EMAIL_REPLY_TO = os.getenv("EMAIL_REPLY_TO", "datos.conalex@gmail.com")


def get_product_files(product_id: str) -> list:
    """
    Retorna lista de rutas absolutas a los archivos del producto.
    
    Args:
        product_id: ID del producto (ej: 'tracker-habitos')
        
    Returns:
        Lista de paths absolutos a los archivos
    """
    filenames = PRODUCT_FILES.get(product_id)
    
    if not filenames:
        logger.warning(f"[FILES] Producto '{product_id}' no encontrado en PRODUCT_FILES. Usando fallback.")
        # Fallback: intentar usar el ID como nombre de archivo
        filenames = [f"{product_id}.xlsx"]
    
    # Construir paths absolutos
    base_path = Path(settings.BASE_DIR) / 'files'
    return [str(base_path / f) for f in filenames]


def validate_product_files(product_id: str) -> dict:
    """
    Valida que los archivos de un producto existan.
    Útil para diagnóstico.
    
    Returns:
        {
            "product_id": str,
            "files": [{"path": str, "exists": bool, "size": int}]
        }
    """
    file_paths = get_product_files(product_id)
    result = {
        "product_id": product_id,
        "files": []
    }
    
    for path in file_paths:
        file_info = {
            "path": path,
            "exists": os.path.exists(path),
            "size": os.path.getsize(path) if os.path.exists(path) else 0
        }
        result["files"].append(file_info)
    
    return result


def send_product_email(order) -> bool:
    """
    Envía el email con el/los producto(s) adjunto(s) usando Django EmailBackend (Gmail SMTP).
    """
    try:
        # 1. Obtener archivos
        file_paths = get_product_files(order.course_id)
        
        # 2. Configurar email
        from django.core.mail import EmailMessage
        
        # 3. Construir HTML
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #22c55e;">¡Gracias por tu compra!</h1>
                <p>Hola <strong>{order.first_name}</strong>,</p>
                <p>Tu pedido <strong>{order.course_title}</strong> está confirmado.</p>
                <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                    📎 <strong>Tus archivos están adjuntos a este correo.</strong>
                </p>
                <p>Cualquier duda, respondé a este email.</p>
            </div>
        </body>
        </html>
        """

        # 4. Crear objeto EmailMessage
        email = EmailMessage(
            subject=f"🎉 Tu compra: {order.course_title}",
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.email],
            reply_to=[settings.EMAIL_HOST_USER]  # Responder al Gmail
        )
        email.content_subtype = "html"  # Main content is now text/html

        # 5. Adjuntar archivos
        attachments_count = 0
        for file_path in file_paths:
            if os.path.exists(file_path):
                email.attach_file(file_path)
                attachments_count += 1
                logger.info(f"[EMAIL] Adjuntando: {os.path.basename(file_path)}")
            else:
                logger.error(f"[EMAIL] Archivo NO encontrado: {file_path}")

        if attachments_count == 0:
             logger.critical(f"[EMAIL ABORTED] No hay archivos para enviar.")
             return False

        # 6. ENVIAR
        email.send()
        logger.info(f"[EMAIL SUCCESS] Enviado a {order.email} vía Gmail SMTP")
        return True

    except Exception as e:
        logger.exception(f"[EMAIL FAILED] Error enviando con Gmail: {str(e)}")
        return False


# =============================================================================
# UTILIDADES DE DIAGNÓSTICO
# =============================================================================

def test_resend_connection() -> dict:
    """
    Prueba la conexión con Resend.
    Útil para verificar que la API key funciona.
    """
    try:
        resend.api_key = os.getenv("RESEND_API_KEY")
        if not resend.api_key:
            return {"success": False, "error": "RESEND_API_KEY no configurada"}
        
        # Intentar obtener info de la API key
        # Resend no tiene endpoint de "me", así que solo verificamos que la key existe
        return {
            "success": True,
            "api_key_prefix": resend.api_key[:10] + "...",
            "from_address": f"{EMAIL_FROM_NAME} <{EMAIL_FROM_ADDRESS}>",
            "reply_to": EMAIL_REPLY_TO
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}


def list_available_products() -> dict:
    """
    Lista todos los productos configurados con estado de archivos.
    """
    result = {"products": []}
    
    for product_id in PRODUCT_FILES.keys():
        validation = validate_product_files(product_id)
        all_exist = all(f["exists"] for f in validation["files"])
        
        result["products"].append({
            "id": product_id,
            "files_count": len(validation["files"]),
            "all_files_exist": all_exist,
            "details": validation["files"]
        })
    
    return result

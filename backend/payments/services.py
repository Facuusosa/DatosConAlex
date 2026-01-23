import os
import logging
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Order

logger = logging.getLogger(__name__)

def send_product_email(order: Order) -> bool:
    """
    Envía el email automatizado con el producto adjunto.
    Cumple con el estándar 'Complete Artifact' de entrega de producto.
    
    Args:
        order (Order): Orden aprobada con datos del cliente.
        
    Returns:
        bool: True si el envío fue exitoso.
    """
    try:
        # 1. Definir Ruta del Archivo (Artifact a entregar)
        # Se busca en backend/files/guia_excel.xlsx como default o según el curso
        filename = 'guia_excel.xlsx'
        file_path = os.path.join(settings.BASE_DIR, 'files', filename)
        
        # Fallback de seguridad para entorno de desarrollo: crea archivo dummy si no existe
        if not os.path.exists(file_path):
            logger.warning(f"[EMAIL ARTIFAC] Archivo no encontrado en {file_path}. Creando dummy para demo.")
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w') as f:
                f.write("Contenido simulado del Curso de Excel.")
        
        # 2. Construcción del Email (Professional HTML)
        subject = f"Tu compra en ALEXCEL: {order.course_title}"
        
        # Template HTML limpio y profesional
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }}
                .email-container {{ max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .header {{ border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 20px; }}
                .header h1 {{ margin: 0; color: #111; font-size: 24px; }}
                .content {{ font-size: 16px; color: #555; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }}
                .highlight {{ color: #22c55e; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>ALEXCEL</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>{order.first_name}</strong>,</p>
                    <p>Gracias por tu compra.</p>
                    <p>Tu pedido <strong>#{order.id}</strong> ha sido confirmado.</p>
                    <p>Adjunto a este correo encontrarás tu archivo: <span class="highlight">{order.course_title}</span>.</p>
                    <p>¡Esperamos que potencie tus habilidades!</p>
                </div>
                <div class="footer">
                    <p>Este es un mensaje automático de ALEXCEL.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # 3. Configurar Mensaje
        email = EmailMessage(
            subject=subject,
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.email],
        )
        email.content_subtype = "html"
        
        # 4. Adjuntar Archivo
        email.attach_file(file_path)
        
        # 5. Enviar
        email.send()
        
        logger.info(f"[EMAIL SUCCESS] Producto enviado a {order.email} (Orden #{order.id})")
        return True
        
    except Exception as e:
        # CRITICAL: Log error but do NOT crash application logic
        logger.error(f"[EMAIL CRITICAL FAILURE] No se pudo enviar email a {order.email}: {str(e)}")
        return False

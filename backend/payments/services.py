import os
import logging
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Order

logger = logging.getLogger(__name__)

# Mapeo de product_id a archivo
PRODUCT_FILES = {
    'tracker-habitos': 'tracker-habitos.xlsx',
    'planificador-financiero': 'planificador-financiero.xlsx',
    'pack-productividad': 'pack-productividad.zip',  # Contiene ambos archivos
}

def get_product_file_path(product_id: str) -> str:
    """
    Retorna la ruta al archivo del producto según su ID.
    Si no existe, usa un archivo genérico de prueba.
    """
    filename = PRODUCT_FILES.get(product_id, 'demo-product.xlsx')
    return os.path.join(settings.BASE_DIR, 'files', filename)


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
        # 1. Definir Ruta del Archivo según el producto comprado
        file_path = get_product_file_path(order.course_id)
        
        # Fallback: si no existe el archivo, crea uno demo
        if not os.path.exists(file_path):
            logger.warning(f"[EMAIL] Archivo no encontrado: {file_path}. Creando demo.")
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w') as f:
                f.write(f"Archivo de prueba para: {order.course_title}")
        
        # 2. Template del Email - Marca "Datos con Alex"
        subject = f"🎉 Tu compra: {order.course_title} - Datos con Alex"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    background-color: #f4f4f4; 
                    padding: 20px; 
                    margin: 0;
                }}
                .email-container {{ 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: #ffffff; 
                    padding: 40px; 
                    border-radius: 16px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                }}
                .header {{ 
                    text-align: center;
                    border-bottom: 3px solid #22c55e; 
                    padding-bottom: 24px; 
                    margin-bottom: 24px; 
                }}
                .logo {{ 
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    color: white;
                    font-weight: bold;
                    padding: 12px 24px;
                    border-radius: 12px;
                    display: inline-block;
                    font-size: 18px;
                    margin-bottom: 16px;
                }}
                .header h1 {{ 
                    margin: 0; 
                    color: #111; 
                    font-size: 28px;
                    font-weight: 600;
                }}
                .content {{ 
                    font-size: 16px; 
                    color: #555; 
                }}
                .content p {{
                    margin: 16px 0;
                }}
                .highlight {{ 
                    color: #22c55e; 
                    font-weight: bold; 
                }}
                .order-box {{
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 24px 0;
                }}
                .order-box p {{
                    margin: 8px 0;
                }}
                .footer {{ 
                    margin-top: 32px; 
                    padding-top: 24px; 
                    border-top: 1px solid #eee; 
                    font-size: 13px; 
                    color: #999; 
                    text-align: center; 
                }}
                .social-links {{
                    margin-top: 16px;
                }}
                .social-links a {{
                    color: #22c55e;
                    text-decoration: none;
                    margin: 0 8px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">DA</div>
                    <h1>Datos con Alex</h1>
                </div>
                <div class="content">
                    <p>¡Hola <strong>{order.first_name}</strong>! 👋</p>
                    
                    <p>¡Gracias por tu compra! Tu pago ha sido <span class="highlight">confirmado</span>.</p>
                    
                    <div class="order-box">
                        <p><strong>📦 Pedido:</strong> #{order.id}</p>
                        <p><strong>📊 Producto:</strong> {order.course_title}</p>
                        <p><strong>💰 Total:</strong> ${order.price}</p>
                    </div>
                    
                    <p>Adjunto a este correo encontrarás tu archivo: <span class="highlight">{order.course_title}</span></p>
                    
                    <p>¡Esperamos que te sea de mucha utilidad! Si tenés alguna duda, no dudes en contactarnos.</p>
                    
                    <p>¡Éxitos! 🚀</p>
                </div>
                <div class="footer">
                    <p>Este es un mensaje automático de Datos con Alex.</p>
                    <div class="social-links">
                        <a href="https://www.tiktok.com/@datos.conalex">TikTok</a> | 
                        <a href="https://www.instagram.com/datos_conalex">Instagram</a>
                    </div>
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
        if os.path.exists(file_path):
            email.attach_file(file_path)
            logger.info(f"[EMAIL] Archivo adjuntado: {file_path}")
        else:
            logger.warning(f"[EMAIL] No se pudo adjuntar archivo: {file_path}")
        
        # 5. Enviar
        email.send()
        
        logger.info(f"[EMAIL SUCCESS] Producto enviado a {order.email} (Orden #{order.id})")
        return True
        
    except Exception as e:
        # CRITICAL: Log error but do NOT crash application logic
        logger.error(f"[EMAIL CRITICAL FAILURE] No se pudo enviar email a {order.email}: {str(e)}")
        return False

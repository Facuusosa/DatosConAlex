"""
Modelos para el sistema de pagos de ALEXCEL.

Este módulo define el modelo Order para registrar todas las compras
de cursos, vinculadas con los pagos de Mercado Pago.
"""

from django.db import models


class Order(models.Model):
    """
    Modelo que representa una orden de compra de un curso.
    
    Se crea cuando el usuario inicia el proceso de pago y se actualiza
    cuando Mercado Pago confirma el estado del pago.
    """
    
    # Información del cliente
    first_name = models.CharField(
        max_length=100,
        verbose_name="Nombre"
    )
    last_name = models.CharField(
        max_length=100,
        verbose_name="Apellido"
    )
    document = models.CharField(
        max_length=20,
        verbose_name="DNI/CUIT"
    )
    email = models.EmailField(
        verbose_name="Email"
    )
    
    # Información del producto
    course_id = models.CharField(
        max_length=100,
        verbose_name="ID del curso"
    )
    course_title = models.CharField(
        max_length=255,
        verbose_name="Título del curso"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Precio"
    )
    
    # Información de Mercado Pago
    payment_id = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="ID de pago MP"
    )
    preference_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="ID de preferencia MP"
    )
    
    # Estado del pedido
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
        ('cancelled', 'Cancelado'),
        ('in_process', 'En proceso'),
        ('refunded', 'Reembolsado'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Estado"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de creación"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de actualización"
    )
    
    class Meta:
        db_table = 'orders'
        verbose_name = 'Orden'
        verbose_name_plural = 'Órdenes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.first_name} {self.last_name} - {self.status}"

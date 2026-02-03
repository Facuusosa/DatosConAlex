# 🚀 GUÍA DE CONFIGURACIÓN PARA PRODUCCIÓN
## Datos con Alex - Sistema de Pagos

**Última actualización:** 2 de Febrero, 2026

---

## 📦 ARQUITECTURA

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   VERCEL        │────▶│   RAILWAY       │────▶│   RESEND        │
│   (Frontend)    │     │   (Backend)     │     │   (Emails)      │
│   React + Vite  │     │   Django        │     │   SDK           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         │                      ▼
         │              ┌─────────────────┐
         └─────────────▶│  MERCADO PAGO   │
                        │  (Pagos)        │
                        └─────────────────┘
```

---

## 🔐 VARIABLES DE ENTORNO

### Railway (Backend Django)

| Variable | Valor Producción | Descripción |
|----------|------------------|-------------|
| `MP_ACCESS_TOKEN` | `APP_USR-xxxx...` | **CRÍTICO**: Debe empezar con `APP_USR-` (no `TEST-`) |
| `RESEND_API_KEY` | `re_xxxx...` | API Key de Resend para envío de emails |
| `DEFAULT_FROM_EMAIL` | `onboarding@resend.dev` | Remitente (cambiar cuando tengas dominio verificado) |
| `FRONTEND_URL` | `https://datos-con-alex.vercel.app` | URL de tu frontend en Vercel |
| `DEBUG` | `False` | Desactivar en producción |
| `DJANGO_ALLOWED_HOSTS` | `alexcel-backend-production.up.railway.app` | Host permitido |
| `SECRET_KEY` | `<random-string>` | Clave secreta de Django |

### Vercel (Frontend React)

| Variable | Valor Producción | Descripción |
|----------|------------------|-------------|
| `VITE_API_URL` | `https://alexcel-backend-production.up.railway.app` | URL del backend en Railway |

> ⚠️ **NOTA IMPORTANTE**: El frontend tiene hardcodeado como fallback la URL de Railway en `CheckoutPage.tsx`. Esto es intencional para evitar errores de configuración.

---

## 📂 ARCHIVOS CRÍTICOS

### Backend (`backend/files/`)

Los archivos Excel que se envían a los clientes DEBEN existir en:
```
backend/
└── files/
    ├── tracker-habitos.xlsx        ✅ (7.5 KB)
    └── planificador-financiero.xlsx ✅ (7.7 KB)
```

### Mapeo ID → Archivos (`services.py`)

```python
PRODUCT_FILES = {
    'tracker-habitos': ['tracker-habitos.xlsx'],
    'planificador-financiero': ['planificador-financiero.xlsx'],
    'pack-productividad': ['tracker-habitos.xlsx', 'planificador-financiero.xlsx'],
}
```

---

## 🔄 FLUJO DE PAGO

```
1. Usuario llena formulario en CheckoutPage.tsx
   └─▶ POST /api/payments/create-preference/
       └─▶ Mercado Pago crea preferencia con metadata

2. Usuario paga en Mercado Pago
   └─▶ Redirige a /pago-exitoso?payment_id=xxx

3. Frontend llama GET /api/payments/validate/?payment_id=xxx
   └─▶ Backend valida con MP SDK
       └─▶ Si approved: send_product_email()
           └─▶ Resend envía email con Excel adjunto

4. (Backup) Webhook recibe notificación de MP
   └─▶ Si pago_exitoso falló, el webhook reenvía
```

---

## ⚙️ CONFIGURACIÓN EN MERCADO PAGO

1. **Integrations** → **Webhooks**:
   - URL: `https://alexcel-backend-production.up.railway.app/api/payments/webhook/`
   - Eventos: `payment` (created, updated)

2. **Credenciales de Producción**:
   - Ir a "Credenciales de producción"
   - Copiar `Access Token` (debe empezar con `APP_USR-`)
   - Pegarlo en Railway como `MP_ACCESS_TOKEN`

---

## ✅ CHECKLIST FINAL ANTES DE LANZAR

- [ ] `MP_ACCESS_TOKEN` empieza con `APP_USR-` (NO `TEST-`)
- [ ] `RESEND_API_KEY` configurado en Railway
- [ ] `DEFAULT_FROM_EMAIL` es `onboarding@resend.dev` (o dominio verificado)
- [ ] `FRONTEND_URL` apunta a Vercel
- [ ] Archivos `.xlsx` existen en `backend/files/`
- [ ] Webhook configurado en panel de Mercado Pago
- [ ] `DEBUG=False` en Railway
- [ ] Probar compra real con $1 ARS

---

## 🧪 TEST DE PRODUCCIÓN

1. Abrir `https://datos-con-alex.vercel.app/planilla/tracker-habitos`
2. Click "Comprar Ahora"
3. Llenar formulario con email REAL
4. Pagar $1 con tarjeta real
5. Verificar:
   - [ ] Redirección a página de éxito
   - [ ] Email recibido con archivo adjunto
   - [ ] Logs en Railway muestran `[EMAIL SUCCESS]`

---

## 🆘 TROUBLESHOOTING

### El email no llega
1. Verificar `RESEND_API_KEY` en Railway
2. Revisar logs: buscar `[EMAIL FAILED]` o `[EMAIL ABORTED]`
3. Si dice "No se encontraron archivos": los `.xlsx` no están en `backend/files/`

### Error 502 al pagar
1. Verificar que Railway está corriendo
2. Revisar `DJANGO_ALLOWED_HOSTS`

### Webhook no dispara
1. Verificar URL en panel de Mercado Pago
2. Probar GET: `curl https://alexcel-backend-production.up.railway.app/api/payments/webhook/`
   - Debe responder: `{"status": "webhook active", "production": true}`

---

## 📧 CONTACTO TÉCNICO

Si hay problemas críticos en producción:
- Email de soporte: `datos.conalex@gmail.com`
- El cliente verá este email si el envío falla

---
description: Start ALEXCEL Fullstack Environment (Django :8000 & Vite :5173)
---

// turbo-all

## 🚀 ALEXCEL Startup Workflow

Este workflow levanta el entorno completo de desarrollo.

---

### 1. Backend Startup (Django)

Iniciar el servidor Django en el puerto 8000:

```bash
cd backend && python manage.py runserver 8000
```

**Nota:** Ejecutar en background, no esperar a que termine.

---

### 2. Frontend Startup (Vite + React)

Iniciar el servidor de desarrollo Vite:

```bash
npm run dev
```

**Nota:** Ejecutar en background, no esperar a que termine.

---

### 3. Ready Signal

Mostrar mensaje de confirmación:

```bash
echo "🚀 ALEXCEL Systems Online! Backend: http://127.0.0.1:8000 | Frontend: http://localhost:5173"
```

---

## ✅ Resultado Esperado

Después de ejecutar este workflow:

- **Backend Django:** http://127.0.0.1:8000
- **Frontend Vite:** http://localhost:5173
- **API Payments:** http://127.0.0.1:8000/api/payments/

Para detener los servidores, usar `Ctrl+C` en cada terminal o cerrar las terminales.

---
description: Levantar el entorno completo de ALEXCEL (Backend Django + Frontend Vite)
---

# 🚀 Run ALEXCEL - Workflow Automatizado

Este workflow levanta todo el entorno de desarrollo de ALEXCEL automáticamente.

## Pre-requisitos
- Python con venv instalado
- Node.js con npm instalado
- Dependencias instaladas (`pip install -r requirements.txt` y `npm install`)

---

## Pasos de Ejecución

// turbo-all

### 1. Verificar que no haya servidores corriendo
Antes de iniciar, verificar si ya hay procesos corriendo en los puertos 8000 y 5173.
Si los hay, informar al usuario que ya están corriendo.

### 2. Iniciar Backend Django
Ejecutar el servidor Django en el puerto 8000:
```bash
cd backend && python manage.py runserver 8000
```
- **Directorio**: `backend/`
- **Puerto**: 8000
- **Modo**: Background (no bloquea la terminal)

### 3. Iniciar Frontend Vite
Ejecutar el servidor de desarrollo Vite:
```bash
npm run dev
```
- **Directorio**: Raíz del proyecto
- **Puerto**: 5173
- **Modo**: Background (no bloquea la terminal)

### 4. Verificar que ambos servidores estén corriendo
Esperar 3-5 segundos y verificar el status de ambos comandos.

### 5. Mostrar status final
Mostrar mensaje de éxito:
```
🚀 ¡ALEXCEL está corriendo!

📦 Backend Django:  http://localhost:8000
🌐 Frontend Vite:   http://localhost:5173

Para detener los servidores, usar Ctrl+C en cada terminal
o ejecutar el workflow /stop_alexcel
```

---

## Notas
- En Windows, no es necesario activar el venv manualmente si Python está en PATH
- El backend debe iniciarse ANTES que el frontend para evitar errores CORS
- Los logs de cada servidor aparecen en sus respectivas terminales de fondo

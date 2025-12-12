# Webmail Frontend

Aplicación frontend de webmail construida con React + TypeScript + Vite + Tailwind CSS.

## Características

- ✨ Interfaz moderna y responsive
- 📧 Gestión de correos electrónicos
- 🔍 Búsqueda en tiempo real
- ⭐ Sistema de favoritos
- 📱 Diseño mobile-first
- 🎨 Tailwind CSS para estilos
- 🚀 Vite para desarrollo rápido
- 🔐 Autenticación JWT
- 🔌 Integración con backend NestJS

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

**Importante:** Asegúrate de que el backend esté corriendo en `http://localhost:3001`

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes React
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   ├── EmailList/
│   │   ├── EmailDetail/
│   │   ├── ComposeModal/
│   │   ├── Login/
│   │   └── Toast/
│   ├── store/           # Zustand store
│   ├── services/        # Servicios API
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilidades
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── index.html
└── package.json
```

## Configuración

El frontend está configurado para hacer proxy de las peticiones `/api` al backend en `http://localhost:3001` (ver `vite.config.ts`).

## Autenticación

La aplicación requiere autenticación mediante JWT. Al iniciar sesión, el token se guarda en `localStorage` y se incluye automáticamente en todas las peticiones al backend.

## Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Zustand** - Gestión de estado
- **Day.js** - Manejo de fechas
- **Axios** - Cliente HTTP

## Endpoints del Backend

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/mail` - Obtener lista de correos
- `GET /api/mail/message/:uid` - Obtener detalle de correo
- `POST /api/mail/send` - Enviar correo
- `PATCH /api/mail/:id/read` - Marcar como leído
- `PATCH /api/mail/:id/star` - Marcar como favorito
- `PATCH /api/mail/:id/archive` - Archivar correo
- `DELETE /api/mail/:id` - Eliminar correo

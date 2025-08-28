# Configuración del Sistema de Referidos Simplificado

## 🎯 **Sistema Optimizado y Escalable**

El sistema ha sido simplificado para ser más eficiente:
- **Contador simple** de aperturas de enlaces
- **Ranking automático** basado en cantidad de aperturas
- **Sin complejidad innecesaria** - solo lo esencial
- **Escalable** para futuras funcionalidades

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/referrals_db"

# YouTube API
YOUTUBE_API_KEY="tu_clave_api_de_youtube"

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

## Instalación de Dependencias

```bash
npm install
```

## Configuración de la Base de Datos

1. Asegúrate de tener PostgreSQL instalado y corriendo
2. Crea una base de datos llamada `referrals_db`
3. Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Configuración de YouTube API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la YouTube Data API v3
4. Crea credenciales de API
5. Copia la clave API en tu archivo `.env`

## Iniciar el Servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 🚀 **Endpoints Principales**

### YouTube
- `POST /youtube/channel` - Agregar canal de YouTube
- `GET /youtube/live-sessions` - Obtener sesiones en vivo activas
- `POST /youtube/check-now` - Verificar transmisiones en vivo manualmente


### Sesiones en Vivo
- `GET /live-sessions` - Obtener todas las sesiones
- `GET /live-sessions/active` - Obtener sesiones activas
- `GET /live-sessions/:id` - Obtener sesión específica

### Referidos
- `POST /referrals` - Crear referido
- `GET /referrals/open/:code` - **ABRIR enlace de referido** (incrementa contador)
- `GET /referrals/code/:code` - Obtener referido por código
- `GET /referrals/user/:userId` - Obtener referidos de un usuario

### 🏆 **Ranking (NUEVO)**
- `GET /ranking` - Ranking global de referidos
- `GET /ranking/session/:id` - Ranking de sesión específica
- `GET /ranking/user/:id` - Ranking de usuario específico
- `GET /ranking/top-performers` - Top performers global
- `GET /ranking/session/:id/stats` - Estadísticas de sesión

## 🔄 **Flujo del Sistema Simplificado**

1. **Detección Automática**: El sistema verifica cada minuto si hay transmisiones en vivo
2. **Creación de Usuario**: El frontend envía formulario para crear usuario
3. **Generación de Referido**: Se crea un enlace único para el usuario
4. **Apertura de Enlaces**: Cada vez que se abre el enlace, se incrementa el contador
5. **Ranking Automático**: Los rankings se generan automáticamente basados en contadores
6. **Estadísticas**: Métricas en tiempo real de rendimiento

## 🗄️ **Estructura de la Base de Datos Simplificada**

- **YouTubeChannel**: Configuración de canales de YouTube
- **LiveSession**: Sesiones en vivo detectadas
- **Referral**: Enlaces de referidos con contador de aperturas
- **Sin tablas innecesarias** - solo lo esencial


# 🚀 Sistema de Referidos para YouTube Live

## 📋 Descripción

Sistema backend simple y escalable que detecta automáticamente transmisiones en vivo de YouTube y genera enlaces de referidos con ranking automático basado en la cantidad de aperturas.

## ✨ Características Principales

- **🔴 Detección Automática**: Verifica cada minuto si hay transmisiones en vivo
- **🔗 Enlaces Únicos**: Genera códigos únicos de 8 caracteres para cada usuario
- **📊 Ranking Automático**: Clasifica referidos por cantidad de aperturas
- **⚡ Simple y Eficiente**: Solo cuenta aperturas, sin complejidad innecesaria
- **🔄 Escalable**: Arquitectura modular para futuras funcionalidades
- **📈 Estadísticas en Tiempo Real**: Métricas actualizadas automáticamente

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   YouTube API   │    │   NestJS App    │    │   PostgreSQL    │
│                 │◄──►│                 │◄──►│                 │
│ - Detecta lives │    │ - Módulos       │    │ - Esquema       │
│ - Canal config  │    │ - Servicios     │    │ - Índices       │
└─────────────────┘    │ - Controladores │    │ - Rankings      │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Módulos del Sistema

- **YouTubeModule**: Detección automática de transmisiones en vivo
- **LiveSessionModule**: Control de sesiones en vivo
- **ReferralModule**: Generación y gestión de enlaces de referidos
- **RankingModule**: Sistema de rankings y estadísticas
- **PrismaModule**: Conexión y gestión de base de datos

## 📊 Flujo del Sistema

1. **Configuración**: Se configura el canal de YouTube y API key
2. **Detección**: El sistema detecta automáticamente transmisiones en vivo
3. **Formulario**: Los usuarios llenan datos en el frontend
4. **Generación**: Se crea un enlace único de referido para cada usuario
5. **Apertura**: Cada vez que se abre el enlace, se incrementa el contador
6. **Ranking**: Los rankings se generan automáticamente
7. **Estadísticas**: Métricas en tiempo real del rendimiento

## 🛠️ Tecnologías Utilizadas

- **Backend**: NestJS (Node.js)
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Scheduler**: @nestjs/schedule para tareas automáticas
- **API**: YouTube Data API v3
- **Lenguaje**: TypeScript

## 📁 Estructura del Proyecto

```
src/
├── app.module.ts              # Módulo principal
├── main.ts                    # Punto de entrada
├── prisma/                    # Configuración de base de datos
├── youtube/                   # Integración con YouTube
├── live-session/              # Sesiones en vivo
├── referral/                  # Sistema de referidos
└── ranking/                   # Rankings y estadísticas
```

## 🚀 Instalación y Configuración

### 1. Clonar y Instalar
```bash
git clone <tu-repositorio>
cd referrals-backend
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar Base de Datos
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Iniciar Servidor
```bash
npm run start:dev
```

## 📚 Documentación

- **[SETUP.md](SETUP.md)**: Guía completa de configuración
- **[API_EXAMPLES.md](API_EXAMPLES.md)**: Ejemplos de uso de la API
- **[Prisma Schema](prisma/schema.prisma)**: Estructura de la base de datos

## 🔗 Endpoints Principales

### YouTube
- `POST /youtube/channel` - Configurar canal
- `GET /youtube/live-sessions` - Sesiones activas
- `POST /youtube/check-now` - Verificar manualmente


### Referidos
- `POST /referrals` - Crear referido
- `GET /referrals/open/:code` - **ABRIR enlace** (incrementa contador)

### 🏆 Ranking
- `GET /ranking` - Ranking global
- `GET /ranking/session/:id` - Ranking de sesión
- `GET /ranking/top-performers` - Top performers

## 📈 Ventajas del Sistema

1. **Simplicidad**: Solo cuenta aperturas, sin complejidad innecesaria
2. **Eficiencia**: Índices optimizados para rankings rápidos
3. **Escalabilidad**: Fácil agregar nuevas funcionalidades
4. **Mantenibilidad**: Código limpio y bien organizado
5. **Rendimiento**: Sin joins complejos ni tablas innecesarias



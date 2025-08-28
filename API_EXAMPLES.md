# Ejemplos de Uso de la API - Sistema de Referidos Simplificado

## 🎯 **Sistema Simplificado y Escalable**

El sistema ahora es más directo y eficiente:
- **Contador simple** de aperturas de enlaces
- **Ranking automático** basado en cantidad de aperturas
- **Sin complejidad innecesaria** - solo lo esencial
- **Escalable** para futuras funcionalidades

## 1. Configurar Canal de YouTube

```bash
curl -X POST http://localhost:3000/youtube/channel \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "UC1234567890abcdef",
    "channelTitle": "Mi Canal de YouTube",
    "apiKey": "tu_clave_api_aqui"
  }'
```

## 2. Crear Usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }'
```

## 3. Verificar Transmisiones en Vivo

```bash
# Verificar manualmente
curl -X POST http://localhost:3000/youtube/check-now

# Obtener sesiones activas
curl http://localhost:3000/youtube/live-sessions
```

## 4. Crear Referido

```bash
curl -X POST http://localhost:3000/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "id_del_usuario_aqui",
    "liveSessionId": "id_de_la_sesion_aqui"
  }'
```

## 5. **ABRIR ENLACE DE REFERIDO** (Nuevo)

```bash
# Cuando alguien abre el enlace, se incrementa el contador
curl http://localhost:3000/referrals/open/ABC12345
```

## 6. **RANKING Y ESTADÍSTICAS** (Nuevo)

### Ranking Global
```bash
curl "http://localhost:3000/ranking?limit=20&offset=0"
```

### Ranking de Sesión Específica
```bash
curl "http://localhost:3000/ranking/session/id_sesion?limit=50&offset=0"
```

### Ranking de Usuario
```bash
curl "http://localhost:3000/ranking/user/id_usuario?limit=25&offset=0"
```

### Top Performers
```bash
curl "http://localhost:3000/ranking/top-performers?limit=10"
```

### Estadísticas de Sesión
```bash
curl http://localhost:3000/ranking/session/id_sesion/stats
```

## 7. Consultar Sesiones en Vivo

```bash
# Todas las sesiones
curl http://localhost:3000/live-sessions

# Solo sesiones activas
curl http://localhost:3000/live-sessions/active

# Sesión específica
curl http://localhost:3000/live-sessions/id_de_la_sesion
```

## 🔄 **Flujo Completo de Prueba**

1. **Configurar canal**: POST `/youtube/channel`
2. **Crear usuario**: POST `/users`
3. **Verificar transmisiones**: POST `/youtube/check-now`
4. **Obtener sesión activa**: GET `/youtube/live-sessions`
5. **Crear referido**: POST `/referrals`
6. **Simular aperturas**: GET `/referrals/open/CODIGO` (múltiples veces)
7. **Ver ranking**: GET `/ranking` o GET `/ranking/session/ID_SESION`

## 📊 **Respuestas de Ejemplo**

### Referido Creado
```json
{
    "referral": {
        "id": "cmevzdtlh000j6dnzdxfl0pha",
        "code": "I1X5OATF",
        "username": "Prueba40",
        "uidBitunix": "linkreferr",
        "tradingView": "mica@ejemplo.com",
        "liveSessionId": "simulated-session-005",
        "createdAt": "2025-08-28T22:34:05.717Z",
        "lastOpenedAt": null,
        "isExpired": false,
        "clickCount": 0,
        "liveSession": {
            "id": "simulated-session-005",
            "status": "LIVE",
            "youtubeUrl": "https://www.youtube.com/watch?v=simulated123'",
            "youtubeVideoId": "simulated127",
            "channelId": "UCI0dTjG7dk35yGZm77u3OkQ",
            "channelTitle": "mica pedemonti",
            "videoTitle": "Transmisión Simulada para Prueba 25s",
            "startedAt": "2025-08-28T10:22:09.086Z",
            "endedAt": null,
            "isActive": true
        },
        "link": "http://localhost:3000/referrals/open/I1X5OATF"
    },
    "message": "Referral link successfully created"
}
```

### Ranking de Sesión
```json
{
    "referrals": [
        {
            "username": "Prueba40",
            "clickCount": 5
        },
        {
            "username": "Prueba41",
            "clickCount": 3
        }
    ],
    "total": 2,
    "limit": 100,
    "offset": 0,
    "hasMore": false
}
```

### Estadísticas de Sesión
```json
{
  "totalReferrals": 15,
  "totalOpens": 342,
  "averageOpens": 22.8,
  "topReferral": {
    "user": {
      "name": "María García",
      "email": "maria@ejemplo.com"
    },
    "openCount": 45
  }
}
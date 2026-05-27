# Despliegue de API NestJS + PostgreSQL en Orange Pi Zero 3 con Cloudflare Tunnel

Este documento resume los pasos exitosos para desplegar una aplicación NestJS con Prisma y PostgreSQL en una Orange Pi Zero 3, haciéndola accesible desde internet mediante un túnel de Cloudflare (sin necesidad de abrir puertos en el router ni configurar Nginx).

## Requisitos previos

- Orange Pi Zero 3 con sistema operativo basado en Debian/Ubuntu (ARM64)
- Cuenta gratuita en [Cloudflare](https://dash.cloudflare.com)
- Dominio (en este caso `nicfer21x7k9m2w4q6.dpdns.org`) agregado a Cloudflare y con los nameservers apuntando a Cloudflare
- El código de la aplicación (NestJS + Prisma) en un repositorio Git

---

## 1. Preparación de la Orange Pi

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Instalar Docker Compose Plugin
sudo apt install docker-compose-plugin -y

```

## 2. Preparación de la Orange Pi

```bash
git clone <tu-repositorio> ~/app
cd ~/app
```

## 3. ARCHIVOS FINALES

```bash

docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: mi-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
  app:
    build: ./backend
    container_name: mi-app-nest
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    env_file:
      - .env
volumes:
  postgres_data:

dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init
RUN addgroup -S nodejs && adduser -S nestjs
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --chown=nestjs:nodejs entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chown -R nestjs:nodejs /app && chmod -R 755 /app
USER nestjs
EXPOSE 3000
ENTRYPOINT ["dumb-init", "/usr/local/bin/entrypoint.sh"]


entrypoint.sh

#!/bin/sh
set -e

echo "Postgres asumido listo por healthcheck de Compose"

cat > prisma.config.ts << EOF
import { defineConfig } from 'prisma/config';
export default defineConfig({
  datasource: { url: '$DATABASE_URL' },
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
});
EOF

echo "Ejecutando migraciones..."
npx prisma migrate deploy

echo "Ejecutando seed con Node (desde dist)..."
node dist/prisma/seed.js

echo "Iniciando NestJS..."
exec node dist/src/main.js


```

## 4 Construir y levantar los contenedores

```bash
docker compose build
docker compose up -d

docker ps
curl http://localhost:3000   # Debe responder con la API
```

## 5 Exponer la aplicación con Cloudflare Tunnel (sin Nginx)

```bash
5.1 Instalar cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb


5.2 Autenticar con Cloudflare
cloudflared tunnel login


5.3 Crear el túnel
cloudflared tunnel create api-nest-tunnel
Anotar el UUID que se genera (ej. 7d773115-d544-4c8e-980d-ccc6ac215b2b).


5.4 Configurar el túnel
Crear archivo /root/.cloudflared/config.yml (como root, o en ~/.cloudflared/ si usas usuario no root):


tunnel: <TU_UUID>
credentials-file: /root/.cloudflared/<TU_UUID>.json

ingress:
  - hostname: nicfer21x7k9m2w4q6.dpdns.org
    service: http://localhost:3000
  - service: http_status:404


5.5 Enrutar el dominio
Antes de ejecutar este comando, ve al panel web de Cloudflare, selecciona tu dominio (dpdns.org) y elimina cualquier registro DNS (Buscar RECORD) existente con el nombre nicfer21x7k9m2w4q6 (CNAME, A, AAAA). Luego:

cloudflared tunnel route dns api-nest-tunnel nicfer21x7k9m2w4q6.dpdns.org


5.6 Probar el túnel manualmente
cloudflared tunnel run api-nest-tunnel
Dejar corriendo y desde el móvil (con datos móviles) abrir https://nicfer21x7k9m2w4q6.dpdns.org.
Debería verse la respuesta de la API NestJS

5.7 Instalar como servicio systemd
cloudflared service install api-nest-tunnel
systemctl start cloudflared
systemctl enable cloudflared
systemctl status cloudflared


6. Resultado final
La aplicación NestJS corre dentro del contenedor mi-app-nest.

PostgreSQL corre en mi-postgres.

Cloudflare Tunnel expone la aplicación en https://nicfer21x7k9m2w4q6.dpdns.org con HTTPS automático (sin necesidad de Certbot ni Nginx).

No se requiere abrir puertos en el router; todo el tráfico se canaliza por el túnel.


Solución de problemas comunes
Problema	Solución
El contenedor no arranca	Revisar logs: docker compose logs app
Error de conexión a PostgreSQL	Verificar que el healthcheck de postgres pase: docker inspect mi-postgres
El seed no se ejecuta	Asegurar que dist/prisma/seed.js existe. Si usas TypeScript, compilarlo con tsc
cloudflared tunnel run no encuentra credenciales	Ejecutar como el mismo usuario que creó el túnel (root vs orangepi). Usar rutas absolutas en config.yml
El dominio no resuelve	Esperar 1-2 minutos y comprobar en panel Cloudflare que el CNAME se haya creado

```

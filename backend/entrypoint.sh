#!/bin/sh
set -e

echo "Esperando a PostgreSQL..."
until nc -z postgres 5432; do
  echo "Postgres no está listo, esperando..."
  sleep 1
done

echo "Postgres listo."

# Opcional: generar prisma.config.ts solo para la URL (sin seed)
cat > prisma.config.ts << EOF
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: '$DATABASE_URL',
  },
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
});
EOF

echo "Ejecutando migraciones..."
npx prisma migrate deploy

echo "Ejecutando seed con Node (desde dist)..."
node dist/prisma/seed.js

echo "Iniciando NestJS..."
exec node dist/src/main.js
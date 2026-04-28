#!/bin/sh

echo "⏳ Waiting for database (optional)..."

# Optional: kalau pakai DB container (uncomment kalau perlu)
# until nc -z db 5432; do
#   echo "Waiting for DB..."
#   sleep 2
# done

echo "⚙️ Generating Prisma Client..."
npx prisma generate

echo "🚀 Starting app..."
npm run start
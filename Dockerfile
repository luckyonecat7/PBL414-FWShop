FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 penting: pastikan .env ikut
COPY .env .env

# Prisma butuh ini saat build
RUN npx prisma generate

# Next.js build
RUN npm run build

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
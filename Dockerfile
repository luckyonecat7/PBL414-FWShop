FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 WAJIB: generate sebelum build
RUN npx prisma generate

# Baru build Next.js
RUN npm run build

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
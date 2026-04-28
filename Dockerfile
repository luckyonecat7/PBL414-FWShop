FROM node:20

WORKDIR /app

# Copy dependency dulu (cache)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Copy env (biar prisma bisa baca saat build)
COPY .env .env

# Generate Prisma
RUN npx prisma generate

# Build Next.js (TANPA turbopack)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
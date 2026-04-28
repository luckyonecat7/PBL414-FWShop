FROM node:20

WORKDIR /app

# Copy dependency dulu (biar cache kepake)
COPY package*.json ./
RUN npm install

# Copy semua source
COPY . .

# Copy entrypoint
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
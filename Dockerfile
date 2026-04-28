FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install prisma@6 @prisma/client@6
RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npx next build --turbopack

EXPOSE 3000

CMD ["npm", "start"]

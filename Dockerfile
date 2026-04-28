FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npx next build --turbopack

EXPOSE 3000

CMD ["npm", "start"]
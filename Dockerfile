FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL=postgresql://user:password@localhost:5432/dbname

RUN npx prisma generate

EXPOSE 3000

ENV NODE_ENV=development

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "dev"]

# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Générer le client Prisma (avec une URL factice pour le build)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
RUN npx prisma generate

# Compiler TypeScript
RUN npm run build

# Étape 2 : Production
FROM node:20-alpine

WORKDIR /app

# Copier les dépendances de production
COPY package*.json ./
RUN npm ci --only=production

# Copier le code compilé depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Exposer le port de l'application
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]

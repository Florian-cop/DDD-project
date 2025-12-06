# ===================================
# Étape 1 : Dependencies
# ===================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copier uniquement les fichiers de dépendances pour optimiser le cache
COPY package*.json ./

# Installer toutes les dépendances (dev + prod) pour le build
RUN npm ci --prefer-offline --no-audit

# ===================================
# Étape 2 : Builder
# ===================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier node_modules depuis l'étape dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Générer le client Prisma (avec URL factice pour le build)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
RUN npx prisma generate

# Copier le code source
COPY src ./src

# Compiler TypeScript
RUN npm run build

# Supprimer les devDependencies (déjà compilé)
RUN npm prune --production

# ===================================
# Étape 3 : Production
# ===================================
FROM node:20-alpine AS production

# Installer dumb-init pour gérer les signaux (SIGTERM/SIGINT)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copier uniquement les fichiers nécessaires depuis builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/prisma.config.ts ./

# Changer vers l'utilisateur non-root
USER nodejs

# Exposer le port de l'application
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Utiliser dumb-init pour gérer les processus (graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["node", "dist/server.js"]

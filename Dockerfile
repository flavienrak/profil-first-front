# Étape 1 : Build
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

# Installer uniquement les deps nécessaires au build
RUN npm install --frozen-lockfile

COPY . .

# Construire l'app
RUN npm run build

# Supprimer les dépendances de dev après le build
RUN npm prune --production

# Étape 2 : Image finale minimaliste
FROM node:20-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copier uniquement ce qui est nécessaire à l'exécution
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./next.config.ts

# Port exposé
EXPOSE 3000

CMD ["npm", "run", "start"]

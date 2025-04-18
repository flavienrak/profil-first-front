# Étape 1 : Construction de l'app
FROM node:20-slim AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation
COPY package*.json ./
RUN npm install

# Copier le reste de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape 2 : Image finale de production
FROM node:20-slim AS runner


# Répertoire de travail
WORKDIR /app

# Copier uniquement ce qui est nécessaire à l'exécution
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Ouvrir le port
EXPOSE 3000

# Démarrer l'app Next.js
CMD ["npm", "run", "start"]

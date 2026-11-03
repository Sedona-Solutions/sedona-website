# Relais formulaire de contact -> Brevo. Aucune dépendance npm : image minimale.
FROM node:22-alpine

ENV NODE_ENV=production PORT=8080
WORKDIR /app

COPY package.json server.mjs ./

# Utilisateur non-root fourni par l'image officielle.
USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["node", "server.mjs"]

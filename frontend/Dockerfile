# Etapa de compilación
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "start"]

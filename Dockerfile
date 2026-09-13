FROM node:20-alpine

WORKDIR /app

# Install curl and openssl for healthchecks and Prisma engines
RUN apk add --no-cache curl openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Generate Prisma Client for container environment
RUN npx prisma generate

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV WATCHPACK_POLLING=true

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npm run dev"]

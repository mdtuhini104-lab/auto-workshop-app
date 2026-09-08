# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.15.0

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Install dependencies with cache optimization
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy dependencies from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy built application to .next and keep a fallback copy in .next_dist
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next_dist
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "start"]

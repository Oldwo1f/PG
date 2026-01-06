# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production || npm install --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/.output ./.output

# Set non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 && \
    chown -R nuxt:nodejs /app

USER nuxt

EXPOSE 3002

ENV NODE_ENV=production
ENV PORT=3002
ENV HOST=0.0.0.0

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", ".output/server/index.mjs"]


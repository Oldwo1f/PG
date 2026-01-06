# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN echo "Building NestJS application..." && \
    npm run build && \
    echo "Build completed. Checking output..." && \
    ls -la dist/ && \
    test -f dist/main.js || (echo "ERROR: dist/main.js not found after build" && ls -la dist/ && find dist -name "*.js" | head -10 && exit 1) && \
    echo "✅ Build successful: dist/main.js found"

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/template/templates ./dist/template/templates

# Create directories for uploads and assets
RUN mkdir -p uploads/images assets/icons

# Copy existing assets if they exist
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/uploads ./uploads

# Set non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]


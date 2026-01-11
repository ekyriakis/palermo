# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy app source
COPY . .

# Build static export for web
RUN npm run web:build

# Production stage - serve static files
FROM node:20-alpine

WORKDIR /app

# Install serve to run the static app
RUN npm install -g serve

# Copy built app from builder - serve the client directory
COPY --from=builder /app/dist/client ./public

# Copy serve config for SPA routing
COPY serve.json ./serve.json

# Expose port
EXPOSE 8081

# Serve the built app from public directory with SPA routing
CMD ["serve", "-c", "serve.json", "-s", "public", "-l", "8081"]

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

# Copy built app from builder - serve the client directory
COPY --from=builder /app/dist/client ./public

# Copy custom server
COPY server.js ./server.js

# Expose port
EXPOSE 8081

# Start custom Node server for proper SPA routing
CMD ["node", "server.js"]

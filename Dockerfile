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

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8081

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "8081"]

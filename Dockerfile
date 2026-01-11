# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy app source
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy app source
COPY --from=builder /app . .

# Expose port for web
EXPOSE 8081

# Start Expo web with port binding
CMD ["npm", "start", "--", "--web", "--host", "0.0.0.0", "--port", "8081"]

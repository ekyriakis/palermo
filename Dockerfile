# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Export web app for production
RUN npm install -g expo-cli && \
    npx expo export --platform web

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to serve the static files
RUN npm install -g serve

# Copy only the dist folder from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]

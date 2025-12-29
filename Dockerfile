FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy app source
COPY . .

# Export static web app
RUN npx expo export --platform web

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to serve the built files
RUN npm install -g serve

# Copy exported files from builder (expo exports to .expo/dist by default)
COPY --from=builder /app/.expo/dist ./dist

# Expose port
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3000"]

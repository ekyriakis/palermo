FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag (for React 18 compatibility)
RUN npm ci --legacy-peer-deps

# Copy app source
COPY . .

# Expose port for web
EXPOSE 8081

# Start Expo web server
CMD ["npm", "start", "--", "--web"]

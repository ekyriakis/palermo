FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy app source
COPY . .

# Expose port for web
EXPOSE 8081

# Start Expo web with explicit hostname
CMD ["npm", "start", "--", "--web"]

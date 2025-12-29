FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Expose port for web
EXPOSE 8081

# Start Expo web server
CMD ["npm", "start", "--", "--web"]

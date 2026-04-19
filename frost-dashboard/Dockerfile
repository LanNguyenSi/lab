# Frost Dashboard - Development Dockerfile
FROM node:22-alpine

# Install git (needed for cloning frost-core)
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of application
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command (dev server)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

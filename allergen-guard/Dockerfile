# AllergenGuard - Production Docker Image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S allergen && \
    adduser -S allergen -u 1001 && \
    chown -R allergen:allergen /app

USER allergen

# Set entry point
ENTRYPOINT ["node", "dist/cli/index.js"]

# Default command (show help)
CMD ["--help"]

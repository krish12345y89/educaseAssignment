FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json . 
RUN npm install --production

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port and define start command
EXPOSE 5001
CMD ["npm", "run", "start"]

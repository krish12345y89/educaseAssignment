FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json . 
RUN npm ci --production

# Copy application files
COPY . .


# Expose port and define start command
EXPOSE 5001
CMD ["npm", "start"]

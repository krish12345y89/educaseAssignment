FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json . 
RUN npm ci 
# Copy application files
COPY . .
RUN npm install --force
RUN npm run build

# Expose port and define start command
EXPOSE 5001
CMD ["npm", "start"]

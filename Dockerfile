FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package.json . 
RUN npm install 

# Copy all application files
COPY . .

# Expose port and define start command
EXPOSE 5000
CMD ["npm", "run", "start"]

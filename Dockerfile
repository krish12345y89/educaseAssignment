FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package.json . 
RUN npm install 

# Copy all application files
COPY . .

# build the code
RUN npm run build
# Expose port and define start command
EXPOSE 5001
CMD ["npm", "run", "start"]

FROM node:23.3.0
WORKDIR /app
COPY package*.json . 
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["npm", "run", "start"]

FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install 
COPY dist .
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]
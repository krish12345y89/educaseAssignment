FROM node:18-alpine
WORKDIR /app/backend
COPY package.json .
RUN npm install --force
COPY . ./
RUN npm run build
EXPOSE 5001
CMD ["npm", "run", "start"]

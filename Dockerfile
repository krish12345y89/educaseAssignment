#_______________------------------- Stage 1: Build -------------------_______________
FROM node:18.16-alpine AS builder
WORKDIR /app

# Copy dependency files first (leverages Docker layer caching)
COPY package.json package-lock.json ./
RUN npm install --production=false

# Copy source files and build the project
COPY . .
RUN npm run build

#_______________------------------- Stage 2: Production -------------------_______________
FROM node:18.16-alpine
WORKDIR /app

# Copy only necessary build artifacts from the builder stage
COPY --from=builder /app/dist .

# Install production dependencies
RUN npm install --production && npm cache clean --force

# Expose the port your app runs on
EXPOSE 5000

# Define the start command
CMD ["npm", "run", "start"]

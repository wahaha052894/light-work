# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the NestJS app (production build)
RUN npm run build

# Expose port
EXPOSE 3000

# Start NestJS application
CMD ["npm", "run", "start:prod"]

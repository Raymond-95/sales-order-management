# Use the official Node.js image for building the Vue app
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file into the Docker image
COPY .env ../

# Build the Vue app
RUN npm run build

# Use a lightweight web server to serve the built Vue app
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

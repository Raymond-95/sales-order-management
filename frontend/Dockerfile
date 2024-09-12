# Use the official Node.js image for building the Vue app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vue app
RUN npm run build

# Use a lightweight web server to serve the built Vue app
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Expose the port for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

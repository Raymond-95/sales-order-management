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

# Add an argument to toggle between build environments (default: dev)
ARG ENV=dev

# Build the Vue app based on the environment
RUN if [ "$ENV" -eq "dev" ]; then npm run build --mode ${ENV}; else npm run build; fi

# Use a lightweight web server to serve the built Vue app
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Use the official Node.js image.
FROM node:16

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy the source code into the container.
COPY . .

ARG ENV=dev

# Set environment variables
ENV DATABASE_URL=mysql://devUser:devUser@db:3306/vuetest

EXPOSE 3000

# Run the web service on container startup.
CMD [ "npm", "start" ]

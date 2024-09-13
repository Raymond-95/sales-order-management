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

# Expose port 3000
EXPOSE 3000

# Set environment variable default value
ARG ENV=prod

RUN if [ "$ENV" = "dev" ]; then npm run dev; else npm run ${ENV}; fi
# ENV ENV=${ENV}

# # Use the entry point script to determine the command to run
# ENTRYPOINT ["/app/entrypoint.sh"]

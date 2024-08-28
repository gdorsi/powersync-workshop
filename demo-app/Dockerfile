# Use Node.js 20 Docker image as base
FROM node:20

ARG VITE_POWERSYNC_URL
ARG VITE_BACKEND_URL

VOLUME ["/app/src"]

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
COPY pnpm-lock*.yaml ./
COPY vite.config.mts ./

RUN npm install -g pnpm@9

# Install dependencies
RUN pnpm install

# Command to run the application
CMD ["pnpm", "start"]
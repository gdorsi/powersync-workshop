# Use Node.js 20 Docker image as base
FROM node:20

ENV DATABASE_HOST=
ENV DATABASE_PORT=
ENV DATABASE_NAME=
ENV DATABASE_USER=
ENV DATABASE_PASSWORD=
ENV POWERSYNC_URL=
ENV POWERSYNC_PUBLIC_KEY=
ENV POWERSYNC_PRIVATE_KEY=
ENV JWT_ISSUER=

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./
COPY pnpm-lock*.yaml ./

RUN npm install -g pnpm@9

# Install dependencies
RUN pnpm install

# Copy the rest of the demo launcher code to the container
COPY / ./

# Command to run the application
CMD ["pnpm", "start"]
# REMINDER: The context is at <root_monorepo>
# Base Image
FROM node:18 AS base

# Set working directory
WORKDIR /app

# Install the required Yarn 3.5 version
RUN corepack enable && corepack prepare yarn@3.5.0 --activate

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
# RUN yarn install

# Development Stage
FROM base AS dev

# Set working directory
WORKDIR /app

# Copy all source files
COPY . .

# Install dev dependencies and certs
RUN yarn install 
RUN apt-get update && apt-get install -y openssl

# Use non-root user
USER node

# Expose the necessary port
EXPOSE 5001

# Command for development with nodemon
CMD ["yarn", "start:dev"]

# Production Stage
FROM base AS test

COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Use non-root user
USER node

# Expose the necessary port
EXPOSE 5002

# Command for production
CMD ["yarn", "start:test"]

# Production Stage
FROM base AS prod

COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Use non-root user
USER node

# Expose the necessary port
EXPOSE 5001

# Command for production
CMD ["yarn", "start"]






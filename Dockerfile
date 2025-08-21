# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache sox sox-dev

# Copy and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application source
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Build the application
RUN yarn prebuild && yarn vite build

# Stage 2: Production
FROM node:20-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache sox sox-dev

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install all dependencies (including dev dependencies since we need vite)
RUN yarn install --frozen-lockfile

# Install serve globally
RUN yarn global add serve

# Copy built assets and config files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/vite.config.* ./
COPY --from=builder /usr/src/app/src ./src

# Set environment variable
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]
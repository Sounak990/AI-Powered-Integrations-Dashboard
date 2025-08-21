#!/bin/bash

# Define variables
IMAGE_NAME="maraca_dev"
TEMP_CONTAINER_NAME="temp-maraca-container"
BUILD_ARTIFACTS_DIR="/var/www/maraca"
DOCKERFILE_DIR="/root/chainwide-react"

# Navigate to the directory containing the Dockerfile
cd $DOCKERFILE_DIR

# Step 1: Clean up any existing Docker artifacts

# Remove existing Docker images with the same name
if [ "$(docker images -q $IMAGE_NAME)" ]; then
    echo "Removing existing Docker images with the name $IMAGE_NAME..."
    docker rmi -f $IMAGE_NAME
fi

# Remove dangling images (those with <none> as their tag)
if [ "$(docker images -q -f dangling=true)" ]; then
    echo "Removing dangling Docker images..."
    docker rmi -f $(docker images -q -f dangling=true)
fi

# Remove any stopped containers
if [ "$(docker ps -aq -f status=exited)" ]; then
    echo "Removing stopped containers..."
    docker rm -f $(docker ps -aq -f status=exited)
fi

# Remove unused Docker networks
if [ "$(docker network ls -q -f dangling=true)" ]; then
    echo "Removing unused Docker networks..."
    docker network prune -f
fi

docker system prune -a -f --volumes

# Step 2: Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME .

# Step 3: Check if a temporary container already exists and remove it
if [ "$(docker ps -aq -f name=^$TEMP_CONTAINER_NAME$)" ]; then
    echo "Removing existing temporary container..."
    docker rm -f $TEMP_CONTAINER_NAME
fi

# Step 4: Create a new temporary container from the image
echo "Creating a new temporary container..."
docker create --name $TEMP_CONTAINER_NAME $IMAGE_NAME

# Step 5: Copy the build artifacts from the container to the host
echo "Copying build artifacts to $BUILD_ARTIFACTS_DIR..."
docker cp $TEMP_CONTAINER_NAME:/usr/src/app/dist $BUILD_ARTIFACTS_DIR

# Step 6: Remove the temporary container
echo "Removing the temporary container..."
docker rm $TEMP_CONTAINER_NAME

# Step 7: Reload Nginx to apply configuration changes
echo "Reloading Nginx configuration..."
sudo nginx -s reload

echo "Deployment completed successfully."

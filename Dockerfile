# Use the official Node.js image based on Debian slim (smaller, but still compatible)
FROM node:23-bookworm-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to install dependencies
COPY package.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the application code into the container
COPY . .

# Expose port 80 to be able to access the app
EXPOSE 80

# Start the Node.js application
CMD ["node", "app.js"]

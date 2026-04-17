FROM node:18-alpine

WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the API port
EXPOSE 5001

# Start the production server
CMD ["npm", "run", "start"]

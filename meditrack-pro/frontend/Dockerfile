# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variable at build time (Vite bakes this into the static files)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx config with ours to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (internal to docker network, mapped in compose)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

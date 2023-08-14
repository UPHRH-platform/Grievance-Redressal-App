# Use an official Node.js runtime as the base image
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code to the working directory
COPY . .

# Copy the appropriate environment file
COPY ./src/environments/environment.prod.ts ./src/environments/environment.ts

# Build the Angular app
RUN npm run build

# Use a lightweight web server to serve the app
FROM node:16
COPY --from=build /app/dist/grievance-app /usr/share/nginx/html
RUN npm install -g http-server
EXPOSE 8080

# Start the nginx web server
CMD ["http-server", "-p", "8080"]

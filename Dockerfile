# Stage 1: Build the React application
FROM node:20-alpine3.16 as build

## Set the working directory in the container
WORKDIR /app

## Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

## Install dependencies
RUN npm install

## Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

## Build the project
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

## Copy the built files from the build stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

## Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

## Expose port 80 to the outside once the container has launched
EXPOSE 80

## Define the command to run your app using CMD which defines your runtime
CMD ["nginx", "-g", "daemon off;"]
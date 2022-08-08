# Create image based off of the official Node 6 image
FROM node:18

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app-frontend

# Change directory so that our commands run inside this new dir
WORKDIR /usr/src/app-frontend

# Copy dependency definitions
COPY package.json /usr/src/app-frontend
COPY package-lock.json /usr/src/app-frontend

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app-frontend

# Expose the port the app runs in
EXPOSE 8080

# Serve the app
CMD ["npm", "run", "serve"]

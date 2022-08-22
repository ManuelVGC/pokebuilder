# Create image based off of the official Node 6 image
FROM node:18

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app-backend

# Change directory so that our commands run inside this new dir
WORKDIR /usr/src/app-backend

# Copy dependency definitions
COPY package.json /usr/src/app-backend
COPY package-lock.json /usr/src/app-backend

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app-backend

# Expose the port the app runs in
EXPOSE 4000

# Serve the app
CMD ["npm", "run", "dev"]

FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . /usr/src/app
COPY ./Scripts /usr/src/app/Scripts

# Those don't do anything, just for documentation purpose
EXPOSE 9314/tcp
EXPOSE 9313/tcp

# Execute main.js in Node.js
CMD [ "node", "./Scripts/main.js" ]

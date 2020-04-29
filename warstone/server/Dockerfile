FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/Scripts
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app
COPY ./Scripts /usr/src/app/Scripts

# Those don't do anything, just for documentation purpose
EXPOSE 9314/tcp
EXPOSE 9313/tcp

# Execute main.js in Node.js
CMD [ "node", "./Scripts/main.js" ]

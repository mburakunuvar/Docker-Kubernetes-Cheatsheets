# Specify a base image
FROM node:alpine
# Specifying a Working Directory
WORKDIR /usr/app
COPY ./package.json ./
# Install dependencies
RUN npm install
COPY ./ ./
# default command
CMD ["npm","start"]

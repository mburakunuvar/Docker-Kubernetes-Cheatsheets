# Specify a base image
FROM node:alpine
# permissions 
USER node
RUN mkdir -p /home/node/app
# Specifying a Working Directory
WORKDIR /home/node/app
COPY --chown=node:node ./package.json ./
# Install dependencies
RUN npm install
COPY --chown=node:node ./ ./
# default command
CMD ["npm","start"]

# FROM node:alpine
# WORKDIR '/app'
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx
# EXPOSE 80 #needed for elastic beanstalk
# COPY --from=0 /app/build /usr/share/nginx/html

## UPDATES MARCH 2021

FROM node:alpine
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node ./package.json ./
RUN npm install
COPY --chown=node:node ./ ./
RUN npm run build
FROM nginx
EXPOSE 80
COPY --from=0 /home/node/app/build /usr/share/nginx/html
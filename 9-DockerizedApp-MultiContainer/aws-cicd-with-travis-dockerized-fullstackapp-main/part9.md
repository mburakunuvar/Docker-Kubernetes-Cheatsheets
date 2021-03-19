## Starting with Development Versions

### step 1 : client (frontend)

```Dockerfile.dev
FROM node:alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start"]

```

```bash
$ docker build -f Dockerfile.dev .
$ docker run -it IMAGE_ID

```

### step 2 : server (frontend)

```Dockerfile.dev

```

```bash
$ docker build -f Dockerfile.dev .
$ docker run -it IMAGE_ID

```

### step 3 : worker (frontend)

```bash
FROM node:alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
#to be able to use nodemon in package.json
CMD ["npm", "run", "dev"]

```

```bash
$ docker build -f Dockerfile.dev .
$ docker run -it IMAGE_ID

```

## Building docker-compose

### step 1: postgres

```yml
version: "3"
services:
  postgres:
    image: "postgres:latest"
```

### step 2: redis

```yml
redis-server:
  image: "redis"
```

### step 3: server

```yml
server:
  build:
    context: ./server
    dockerfile: Dockerfile.dev
  volumes:
    - /app/node_modules
    - ./server:/app
```

## ENVIRONMENT VARIABLES

We're going to try to pull some information from the environment and to use that information to customize the way in which the process behaves.

When we set up an environment variable inside of a docker-compose file we are setting up an environment variable that is applied at runtime.(only when the container is started up, so when you specify an environment variable inside of a darker compose file that information is not
being encoded inside the image)

#### option 1

```yml
variableName=value
```

#### option 2

If you specify just the variable name then the value for this variable is going to be taken from your computer.

```yml
variableName
```

https://hub.docker.com/_/redis

## Nginx Path Routing

what's the difference between adding on something to the front of the route and something to the end of the route ?

- The difference here is that when we are specifying a port the port can very easily change depending on the environment that we are deploying to one day our API might be hosted on port 5000 in sight of all these docker composed containers. And the next day it might be on port 5001. You just don't know these ports are sometimes very finicky and sometimes for various reasons they need to change all the time.

- And so it's a lot easier to just specify this very constant token right here of slash API and to say OK like here such API this is the destination and we can then rely upon NGINX to do the routing for us.

**Note on next step** : instead chopping /api, updating GET/POST routes on express is also an optio

## Nginx Config with default.conf

- setup upstreams

```
upstream name_of_upstream {
    server name_of_service: 3000;
}
```

- name_of_service will be taken as url, thanks to docker-compose.

- instead of naming backend as "server" ,let's prefer "api" or sth else to prevent confusion

- chopoff /api to be align with app code.

```
rewrite /api/(.*) /$1 break;
```

- $1 means whatever in regex

- break means don't apply any re-write rules

## Building NGINX IMAGE :

```dockerfile
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
```

## Start up

try 2 -3 times, as pulling inn images of redis-postgres etc might take time

### Websocket connections

Essentially we're seeing this error message because any time our react application boots up in development mode it wants to keep a active connection to the development server and be notified of any time that some file changes now.

The issue here is that our browser in the running react up inside of it wants to get a active connection back to the development server so that it gets a notification any time that our source code changes telling it that the browser needs to automatically reload.

```
location /sockjs-node {
proxy_pass http://client;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
}
```

## Multiple Local Containers and Docker Compose

### App Server Starter Code

#### Step 1 - Dockerfile

```dockerfile
# Specify a base image
FROM node:alpine
# download and install a dependency
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./ ./
#starts
CMD ["npm","start"]
```

### Step 2 - build and run

```bash
$ mkdir visits
# use package.json and index.js
# build Dockerfile
$ docker build -t burakunuvar/visits:latest .
$ docker run burakunuvar/visits:latest
# gives error because there's no redis server in place
```

=> gives error because there's no redis server in place for connecting into.

### Step 3 - run Redis

```bash
$ docker run redis
```

=> gives error because those processes above will not be connected to each other.

We've got a node application in one container and the redis application in the separate dock or container. These two containers do not have any automatic communication between the two.

In order to make sure that our node app has the ability to kind of reach out to the red a server and stored information or work with it in some fashion we need to set up some networking infrastructure between the two.

### Intro to Docker Compose

to issue multiple commands much more quickly.

```bash
$ docker run burakunuvar/visits:latest
# gives the same error
```

You know when it comes to setting up some networking functionality between two separate containers we have for right now two options to look at here's are two options.

- We can either make use of the dockers CLI that we've been making use of throughout this course so far. This built in CLI has functionality tied to it that will allow us to set up a network between two separate containers. However it's a real pain in the neck to do, involving a handful of different commands that we rewrite on every single time you start up your different containers.

- we're going to make use of a separate CLI tool called `docker compose`. `Docker-compose` is a separate tool that gets installed along with docker. Docker compose really exists to keep you from having to write out a ton of different repetitive commands with the Docker CLI. So one of the big purposes of Docker compose is to just avoid having to write out all these really annoying tiny little options every time you want to start up a container

- The other big thing that Docker compose is going to do for us is it's going to make it very easy and very straightforward to start up multiple docker containers at the same time and automatically connect them together with some form of networking and it's all going to happen behind the scenes for us quite automatically.

### Working with Docker Compose Files

Using `docker-compose.yml`

```yml
version: "3"
services:
  redis-server:
    image: "redis"
  node-app:
    build: .
    ports:
      - "4001:8081"
```

- You'll notice that we have put absolutely no configuration into this file right here to kind of specify any layer of networking believe or not just a finding of these two services. Inside this file doc-compose is going to automatically create both these containers on essentially the same network and they're going to have free access to communicate to each other in any way that they're placed.

- No port declaration is necessary (The port declaration in file is solely to open up our container access to our container on our local)

- An update on app code for host will be sufficient

```js
const client = redis.createClient({});
```

Now usually if we were not using docker if we were this was just a traditional node application without

any doc or stuff whatsoever we would usually put in some type of address right here like

```js
const client = redis.createClient({
  host: "https://my-redis-server.com",
  port: 6379,
});
```

but since we are making use of docker compose,
we can simply refer to it by its name of redis-server.

```js
const client = redis.createClient({
  host: "redis-server",
  // default,
  port: 6379,
});
```

And so redis just going to make a good faith or this redis client right here can make a good faith effort to connect to the server at this hostname. When the connection request goes out from this node application Docker's going to see it.

So Redis client is going to get automatically redirected over to the container running our copy of redis.

### Docker Compose Commands

#### start

```bash
# commands for running a container is
$ docker build .
$ docker run myimage
#will be replaced with
$ docker-compose up

# to rebuild images
$ docker build .
$ docker run myimage
#will be  replaced with
$ docker-compose up --build
```

you just create a new set of containers or services with Docker compose, it's going to automatically make a network for you that's going to join those different containers together.

We created two separate services and compose automatically made connections between the two available.

#### stop docker compose containers

```bash
$ docker run redis
# -d is used to make it run at background so that we can keep using cli
$ docker run -d redis
$ docker ps # to get the IDs
$ docker stop #id
```

```bash
# run at background
$ docker-compose up -d
$ docker-compose down

```

### container maintentance & automatic restarts

```js
const process = require("process");
// ...
process.exit(0);
// 0: exit status code
// => exited with code 0
```

docker-compose should also be updated as below :

```yml
version: "3"
services:
  redis-server:
    image: "redis"
  node-app:
    restart: always
    build: .
    ports:
      - "4001:8081"
```

options :

- "no"
- always
- on-failure (except for code 0)
- unless-stopped

### container status

```
$ docker-compose ps
```

it requires docker-compose.yml file in the folder

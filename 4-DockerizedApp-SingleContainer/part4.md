## Creating Real Project

```dockerfile
# Specify a base image
FROM alpine
# Install dependencies
RUN npm install
# default command
CMD ["npm","start"]
```

### Error 1 : node:alpine

`FROM alpine` in Dockerfile will not work as it lacks node and npm

option 1 : Install node on this basic image
option 2 : Re-use built-in node image
https://hub.docker.com/_/node

Alpine is a term in the docker world for an image that is as small and compact as possible.

Prefer `FROM node:alpine` not to include additional preinstalled git, text editing tools etc

```dockerfile
# Specify a base image
FROM node:alpine
# Install dependencies
RUN npm install
# default command
CMD ["npm","start"]
```

### Error 2 : package.json directory

When you are building an image none of the files inside of your project directory your are available inside the container by default they are all 100 percent sectioned off completely segmented out.

They are not at all available and you cannot assume that any of these files are available unless you specifically allow it inside of your docker file

The copy instruction is used to move files and folders from our local file system on your machine to the file system inside of that temporary container that is created during the build process.

`COPY ./ ./ `

```dockerfile
# Specify a base image
FROM node:alpine
# Install dependencies
COPY ./ ./
RUN npm install
# default command
CMD ["npm","start"]
```

```bash
$ docker build -t burakunuvar/simpleweb .
$ docker run burakunuvar/simpleweb
```

### Error 3 Container Port Mapping

- We have to set up a explicit port mapping a port mapping essentially says any time that someone makes a request to a given port on your local network take that request in automatically forward it to some port inside the container. So in other words if anyone makes a request to local hosts 8080 take that request automatically forward it into the container on port 80 where the node application can then receive it and process the request and eventually respond to it.

- Your docker container can by default make requests on its own behalf to the outside world. We've already seen that in action any time you've been installing a dependency. When we ran install during the docker build process just a moment ago NPM reaches to the outside world. It reaches out across the Internet and so there's no limitation by default on your container's ability to reach out.

It's strictly a limitation on the ability for incoming traffic to get in to the container.

So this is not a change that we're going to make to the docker file. We do not setup port forwarding inside the doc or file the port forwarding stuff is strictly a run time constraint. In other words it's something that we only change when we run a container or start a container.

```bash
$ docker run -p 80:8080 burakunuvar/simpleweb
```

You can change any of the ports here, but if you change the port inside the container you need to make sure that your actual web server application.

### Specifying a Working Directory

add a WORKDIR right after the FROM instruction:

```dockerfile
# Specify a base image
FROM node:alpine
# Specifying a Working Directory
WORKDIR /usr/app
# Install dependencies
COPY ./ ./
RUN npm install
# default command
CMD ["npm","start"]
```

that worked for instruction right here not only affects commands that are issued later on INSIDE of our doc or file it also affects commands that are executed inside the container later on through the docker exec command.

```bash
$ docker run -it burakunuvar/simpleweb sh
/user/app # ls
#or
$ docker exec -it burakunuvar/simpleweb sh
```

### Unnecessary Rebuilds

- making a change to our index such as file and then rebuilding the image caused the copy step to be completely invalidated.

```js
res.send("Hi there - updated version");
```

- rebuild image
- updated index.js file, requires all files at `./` directory to be copied and then next steps of built tp be repeated

change Dockerfile from this

```dockerfile
# Specify a base image
FROM node:alpine
# Specifying a Working Directory
WORKDIR /usr/app
# Install dependencies
COPY ./ ./
RUN npm install
# default command
CMD ["npm","start"]
```

to this

```dockerfile
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
```

so whenever there's no change in package.json, npm install will not be executed

You can make as many changes as you want to the index not just file and it will not invalidate the cache for either of these steps right here. The only time that NPM is NPM install is going to be executed again is if we make a change to that step or any step above it.

```bash
# run for the 1st time with new Dockerfile
$ docker build -t burakunuvar/simpleweb .
# run for the 2nd time with the new Dockerfile
# should be very quick
$ docker build -t burakunuvar/simpleweb .
# update index.js
# run for the 3rd time with the new Dockerfile
# again should be quick with only once change
```

```bash
$ docker build -t simple-node-app-image .
$ docker ps
$ docker images
$ docker container ls
$ docker run --name simple-node-app-container -p 80:8080 simple-node-app-image
$ docker stop simple-node-app-container
$ docker start -a simple-node-app-container
```

### Resolving "npm ERR! could not detect node name from path or package"

The v15 version of Node has recently been released and is causing issues with some of our project code.

In the next lecture you may get the following error when building the Dockerfile:

npm ERR! could not detect node name from path or package

To resolve this, add a WORKDIR right after the FROM instruction: (we will be adding this very soon anyway)

```
FROM node:alpine
WORKDIR /usr/app
```

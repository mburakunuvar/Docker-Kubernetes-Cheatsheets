## Creating a Production Grade Workflow

### [how to install Create React App globally and generate the application](https://create-react-app.dev/docs/getting-started#npx)

[upgrade to newer version](https://stackoverflow.com/questions/64963796/create-react-app-is-not-working-since-version-4-0-1)

[upgrade to newer version](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker)

```bash
$ npx create-react-app simple-react-app
#necessary commands
$ npm start #starts up a development server
$ npm test #run tests associated with project
$ npm run build #builds prod version of app

```

Now we should also have a folder called `build` in the working directory

### Creating the Dev Dockerfile

The purpose of the .dev on the end right there is going to make sure that it's really clear that this docker file is only used when we are trying to run our application in a development environment in the future (We're going to put together a second doc file for running this thing in production and it's going to have a name of simply docker file so that docker file that is named simply docker file will be the one that we use for production.)

```bash
$ touch Dockerfile.dev
$ docker build . #will not work !
$ docker build -f Dockerfile.dev .
```

So, when we're running locally and trying to actively develop our application; we'll build our image and start up our container using the Dockerfile.dev instead

### Prevent duplicating dependencies

Container will build node_modules folder for itself.
Then it will also COPY . .
So, Delete node_modules folder in order to prevent Duplicating Dependencies

```bash
$ rm -rf node_modules
```

### Starting the container

```bash
$ cp Dockerfile-v2.dev simple-react-app/Dockerfile.dev
$ docker run -it -p 3000:3000 IMAGE_ID
```

Well of course we probably do not want to rebuild the image every time we make a change or source code so we'll use Docker volumes

### Docker Volumes

We're going to figure out how we can somehow get this changed to somewhat cleverly show up inside of that running docker container without us having to stop it rebuild the image and then restart the container.

We will essentially setting up a mapping from a folder inside the container to a folder outside the container.

```bash
# make sure you're in the app folder (frontent in this case)
$ docker run -it -p 80:3000 -v /home/node/app/node_modules -v $(pwd):/home/node/app IMAGE_ID
```

`-v $(pwd)/:home/node/app IMAGE_ID` : maps local volume to the disk area of the running container

`-v /home/node/app/node_modules` : to prevent mapping , as we had deleted node_modules folder from local volume. This command will make container use the folder from its own disk, not from the local.

## Easier approach with Docker-Compose

whole purpose was to make executing docker run easier ; )

```bash
# instead of this
$ docker run -it -p 80:3000 -v /app/node_modules -v $(pwd):/app IMAGE_ID
# use below :
$ touch docker-compose.yml
# after preparing the file :
$ docker-compose up
# to rebuild
$ docker-compose down && docker-compose up --build
```

```yml
## VERSION 1 : GETTING STARTED
version: "3"
services:
  web-app:
    stdin_open: true # to prevent bug with the Create React App
    # restart: always
    # build: . will not work for Dockerfile.dev
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "80:3000"
    volumes:
      - /home/node/app/node_modules #don't map this
      - .:/home/node/app #map all the rest
```

### Do we still need the COPY line in Dockerfile.dev ?

not mandatory for DEV but highly recommended for prod

```dockerfile

# ...
COPY package.json .
RUN npm install
# COPY . . ??
# ...
```

even though it's not strictly necessary for what we're doing right now we would probably still
leave it in there kind of as a reminder or a reference for myself in the future.

At some point time in the future you might decide to no longer make use of docker-compose or alternatively you might decide to use this docker file right here as inspiration to set up your production docker file. In either case you would definitely still need to have this copy instruction right here.

You would definitely need to still have the copy instruction to copy over all of your source code.

## Executing Tests - CLI

Live Update Tests

```bash
$ docker build -f Dockerfile.dev .
# replace the start command
$ docker run IMAGE_ID npm run test
# will work but not allow inputs
# to have std_in of container after start :
$ docker run -it IMAGE_ID npm run test
```

### VOLUME MAPPING FOR TESTS ?

#### opt 1 enable mappig

```bash
# OPT1 => VOLUME MAPPING but again you'll need volume mapping for updates on App.test.js file
$ docker run -it -v /app/node_modules -v $(pwd):/app IMAGE_ID npm run test
```

#### opt 2 run test suite in existing environment

```bash
# OPT2 =>or attach to the existig container
# run tests as a 2nd process within same enviromet
$ docker run IMAGE_ID # will start container
# ssh into container and execute another process
$ docker exec -it CONTAINER_ID npm run test
# or
$ docker exec -it CONTAINER_ID sh
  /app $ npm run test
```

Also,we can do that with Docker file

### Executing Tests - Docker Compose

let's add the 2nd suite to the code in App.test.js

```js
test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

#### for testing at run time

But we should again map the local volume to the container ( by docker-compose or longer version run command, like the one
`docker run -it -v /app/node_modules -v $(pwd):/app IMAGE_ID npm run test` )

### Opt 1 : rather than making a second service inside the docker-compose file we could instead attach to the existing container that is created when we attach to it.

We already had a container started by docker-compose which was already mapped to app.test.js so let's start with that :

```bash
# get the id of running container started by docker-compose
$ docker ps
$ docker exec -it CONTAINER_ID npm run test
```

You can input w, a , q inputs etc
If it's hard for you to remember the ID of the container and the complex command etc, there's also an easier way for this :

### Opt2 : add a new service into Docker Compose for running tests

create a new service within docker-compose.yml only with this purpose

```yml
test-app:
  stdin_open: true
  build:
    context: .
    dockerfile: Dockerfile.dev
  # no need for ports ...
  #   ports:
  #     - "3000:3000"
  volumes:
    - /home/node/app/node_modules
    - .:/home/node/app
  # over-write start command
  command: ["npm", "test"]
```

```bash
$ docker-compose up --build
```

this time the downtime here is, all output of the test suit is inside of the login interface of docker-compose. We can't have the ability to kind of manipulate the running test suite with the p and q shortcuts.

### Shortcomings on Testing and Docker Attach

**reminder** standard out standard in and standard out are all process specific. So every different process inside this container has its own instance of standard in and standard out.

Even if we use `docker attach`; it's not gonna be possible to provide inputs.

```bash
# We are attaching to the standard in standard out in standard err of the primary process inside that container.
$ docker attach CONTAINER_ID
```

We're not going to be able to be able to manipulate our test suite by entering p t.

#### Why are not we going to be able to attach directly to that container and enter in commands and have them be affecting that running test process.

what if we start another process within container with exec ( starting a connection to STD_IN) ?

```bash
$ docker exec -it CONTAINER_ID sh
> ps
```

In reality what is running is the process NPM which looks at the additional arguments we are providing specifically to run test and it uses those additional arguments to decide what to do. So it's going to eventually start up a second process that is actually running our tests.
And this is the process that is actually executing our test suite and receiving commands over STD_IN to understand when to filter down the test suite or re-run them or whatever it might be.

- When we run `docker attach`, we always attach to standard in the primary process of the container - or the process with the process id of 1.

- But it's not the NPM command that is in charge of receiving those key presses and interpreting all those kind of different options we have of the P T and q an end to right here. It's the 2nd process that was started by NPM.

### Getting Ready for Production => Need for Nginx

- Development server falls away because it's really not appropriate to be running in a production environment.It has a ton of processing power inside of it dedicated to processing these javascript files that we're putting together and that's something that we do not need to do when we are running in production because we're no longer making any changes to the javascript code of our project.

- what we need for a production environment is some type of server here whose sole purpose is going to be to respond to browser requests.To solve this we're going to make use of a server called NGINX. It's really just about taking incoming traffic and somehow routing it or somehow responding to it with
  some static files which is exactly what you and I are going to use it for.

## Multi-Step Docker Build

So we are going to create a separate docker file that is going to create a production version of our web container. This production version of the web container is going to start up an NGINX, that we'll use to produce or execute to serve up our index.html and main.js

### Creating the Prod Dockerfile

- The first big issue is tied to install dependency step. The dependencies that we are installing, only have to be installed because we're trying to build our application.

If you recall a little bit ago when we initially installed all those dependencies we first generate our app that was 155 megabytes worth of dependencies. And those are only required when we're trying to build the application after we actually build the application dependencies no longer required.

It is solely that build directory so this thing right here.
The index.html and eventually the main.js files are in there as well.That is the only output from the build step that we really care about.

- The other big issue with this flow is the start NGINX,At what point in time did that get installed or configured or set up in any way shape or form ?

So essentially it seems like we're in a situation right now where it would be really nice to be able to have two different base images and that's exactly what we're going to do.

#### build a doctor file that has something called a multi step build process inside the docker

[nginx - Docker Hub](https://hub.docker.com/_/nginx)
Use Docker Hub for NGINX (hosting simple static content)

When we copy it over to the run phase everything else that occurred during that build face like the use of the node alpine image the dependencies that we installed all that additional stuff gets dropped out of the final result of our container.

```dockerfile
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
# Now when we copy it over to the run phase everything else that occurred during that build face like the use of the node Alpina image the dependencies that we installed all that additional stuff gets dropped out of the final result of our container.
```

### Now when we copy it over to the run phase everything else that occurred during that build face like the use of the node Alpina image the dependencies that we installed all that additional stuff gets dropped out of the final result of our container.

**reminder** So notice now that we are doing this build phase and we kind of don't have any concern over changing our source code.We don't have to make use of that entire volume system anymore. That volume system that we were put implementing with docker compose was only required because we wanted to develop our application and have our changes immediately show up inside the container. When we're running our code in production env that's not a concern anymore because we're not changing our code at all. So we can just do a straight copy of all of our source code directly into the container

**Note** Now one thing I want to point out here is that the build folder will be created in the working directory. So the folder that you and I really care about like the folder with all of our production assets that we want to serve up to the outside world the path to that inside the container will be `/app/build`. that's going to have all the stuff we care about.

`/home/node/app/build` => all the stuff we care about

AWS currently will fail if you attempt to use a named builder as shown.

To remedy this, we should create an unnamed builder like so:

```dockerfile
FROM node:alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
#by just putting in a second statement that essentially says OK previous block all complete.Don't worry about it any single block or any single face here can only have a single from statement.
FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html
#So you can kind of imagine that the from statements we put in here are kind of terminating each successive

#the default command of the engine X container or the engine X image is going
```

To sum up, when we do this copy step at the end, we're essentially dumping everything else that was created while
this set of configuration was executed so we're not pulling over anything from the node Alpine image. We're not pulling over any of the results of the install. We're not copying over any of our source code. All we are getting is the result of that app slash build directory.

## Running NGINX

```bash
$ cp Dockerfile-v3 simple-react-app/Dockerfile
$ docker build .
$ docker run -p 9000:80 IMAGE_ID #We aren't using 3000 port anymore, used by react for test
```

http://54.74.55.33:3000/=>test

http://54.74.55.33:9000/=>prod

## more notes

Recently, a bug was introduced with the latest Create React App version that is causing the React app to exit when starting with Docker Compose.

To Resolve this:

Add stdin_open property to your docker-compose.yml file

web:
stdin_open: true
Make sure you rebuild your containers after making this change with docker-compose down && docker-compose up --build

https://github.com/facebook/create-react-app/issues/8688

https://stackoverflow.com/questions/60790696/react-scripts-start-exiting-in-docker-foreground-cmd

# EACCES: permission denied, mkdir '/app/node_modules.cache' - Linux and WSL2 hosts

There is an issue with permissions in regards to Linux hosts (which includes Windows WSL2) and volumes. It can be solved by doing the following:

```yaml
FROM node:alpine

USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node ./package.json ./
RUN npm install
COPY --chown=node:node ./ ./

CMD ["npm", "start"]
```

- Remember to update the working directory paths in your docker run command to /home/node/app instead of just /app

- When we refactor to use Docker Compose, remember to update the working directory paths in your compose file:

```yaml
volumes:
  volumes:
    - /home/node/app/node_modules
    - .:/home/node/app
```

Explanation of changes:

We are specifying that the USER which will execute RUN, CMD, or ENTRYPOINT instructions will be the node user, as opposed to root (default).

https://docs.docker.com/engine/reference/builder/#user

We are then creating a directory of /home/node/app prior to the WORKDIR instruction. This will prevent a permissions issue since WORKDIR by default will create a directory if it does not exist and set ownership to root.

The inline chown commands will set ownership of the files you are copying from your local environment to the node user in the container.

The end result will be that all files and directories in the project will no longer be owned by root and will instead be owned by the node user.

The code above was taken from this thread:

https://github.com/nodejs/docker-node/issues/740

https://github.com/moby/moby/issues/36408

Also, you can read up on the chown flag for the COPY instruction here:

https://docs.docker.com/engine/reference/builder/#copy

```

```

https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker

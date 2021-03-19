##  Intro to Docker Client

### `docker run` and over-writing default command

```bash
# Example 1 - this image has only one command within fs
$ docker run hello-world
# Example 2 - for some other programs within fs of snapshop
# default command of busybox is 'sh'
$ docker run busybox
# over-writing default command
$ docker run busybox ls
$ docker run busybox echo hi there
```

### `docker ps` to list containers

```bash
$ docker run busybox ping google.com
# open a different terminal to list running containers 
$ docker ps
# in order to list containers that aren't running
$ docker ps --all
```

### Container lifecycle : `docker run` = `docker create` + `docker start`

```bash
$ docker create hello-world
$ docker start #id 
# -a is used for attaching to the container and then printing the output
$ docker start -a #id
```

There's a very small difference between `docker run` and `docker start`. `docker run` is going to show you all the logs or all the information coming out of the container by default. `docker start` is the opposite - it is not going to show you information coming out of the terminal.

- Therefore we use, `-a` which means get attached to the container to speak and watch for output coming from it and printed out at my terminal.


### restarting stopped containers

```bash
$ docker start -a #id
```

- If you use `docker run` it'll create a new process so prefer `docker start` to restart the existing one

- When you have a container that's already been created we can not replace that default command as soon as you started up with the default command.


### removing all stopped containers


```bash
$ docker system prune
# to remove with all images
$ docker system prune -a
```

### retrieving log outputs

Imagine you've forgotten to add `-a` for a long running process, instead of running the same command with the tag :

```bash
$ docker create busybox echo hello world !
$ docker start #id
$ docker start -a #id might take long time for some images 
$ docker logs #id
```

another example :

```bash
$ docker create busybox ping google.com
$ docker start #id
$ docker logs #id
```

It's used for getting a record of all the logs that have been emitted from that container


### stopping containers

```bash
$ docker create busybox echo ping google.com
$ docker start #id
$ docker logs #id
# goes on working ...
$ docker stop #id
$ docker kill #id
```
Note : `stop` command will give 10 seconds to an ongoing process, before ending it whereas `kill` command will directly end it.


### Multi-command Containers and Executing Commands in Running Containers

```bash

$ docker run redis
$ docker exec -it '#id' redis-cli
# -it allows us to enable providing input to the redis-cli
# -i is used to attach terminal to the STDIN of running process
# -t is used for format and indentation
> set mynumber 5
> get mynumber 
```

`-it` allows us to have stuff that we type into our terminal directed into that running process and allows us to get information out back over to our terminal.


#### EXEC vs ATTACH

```bash
$ docker run -it debian bash
# or
$ docker run redis 
# to connect to redis-cli
$ docker exec -it '#id' redis-cli
# to start a 2nd process within container
$ docker exec -it #ID sh
# to attach with STD of a process within container
$ docker attach #ID 
```

### Getting a Command Prompt in a container

A very common thing that you're going to want to do when you are using docker is to get shell - terminal access to your running container. In other words you are going to want to run commands inside of your container without having to rerun doc or exec doc or exact doc or exec again and again all day.

```bash
$ docker exec -it '#id' sh
# cd ~/
# ls
# cd /
# ls
# redis -cli
>>
# use ctrl + C to exit from redis-cli
# use ctrl + D to exit from sh
# another program for shell
$ docker exec -it '#id' bash

```

- exec is used for starting up a 2nd process inside a running container

- full terminal access inside the context of the container is extremely powerful for debugging.

Traditionally a lot of the different containers that you're going to be working with are probably going
to have the SH command or bash program already included. Some more complete versions of containers or images are going to also have the bash command processor as well. So in some cases you can make use of bash directly in vast majority.


### Starting a Container with a Shell 

You're probably going to run the shell inside there to start up a command prompt and type in some commands

```bash
# using sh at startup will replace other start up commands
$ docker run -it busybox echo hi
$ docker run -it busybox sh
$ docker run redis redis-cli
```

It's a little bit more common that you're going to want to start up your container with a primary process of like maybe your web server or whatever it might be and then attach to it a running shell by using the `docker exec` command wherever it is right here.



### Container Isolation

Two running containers have absolutely completely separate file systems and there's no sharing of data between the two.

So in general unless you specifically form up a connection between two containers we really consider them to be more or less completely isolated from each other and totally separate.

### How To Remove Docker Images, Containers, and Volumes

https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes


### Create an image that runs redis-server

```bash
$ docker build .
$ docker images
$ docker run #imageID
```

### Tagging Image

```bash
$ docker build -t burakunuvar/redis-server:v1 .
$ docker run burakunuvar/redis-server:v1

$ docker run burakunuvar/redis-server
$ docker run burakunuvar/redis-server:latest

```

### Creating Image from Running Container

```bash
$ docker run -it alpine sh
> apk add --update redis
```

```bash 
# open another terminal and list the running process
$ docker ps
$ docker commit -c 'CMD ["redis-server"]' #id
$ docker commit -c 'CMD ["redis-server"]' fe9f7935ce73
# sha256:768325db6f5c5533c7b64f55c97dd7651097fd1b04961e9d1cae0e9d530c4d4b
$ docker run 768325db6f5c5
```

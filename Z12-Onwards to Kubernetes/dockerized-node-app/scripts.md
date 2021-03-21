```bash
$ docker build -t simple-node-app-image .
$ docker ps
$ docker images
$ docker container ls
$ docker run --name simple-node-app-container -p 80:8080 simple-node-app-image
$ docker stop simple-node-app-container
$ docker start -a simple-node-app-container
```

### MAPPING EXISTING KNOWLEDGE FROM docker-compose

#### MAKE SURE IMAGES ARE ON DOCKER-HUB

```bash
$ docker build -t dockerized-react-app-image .
$ docker ps
$ docker images
$ docker container ls
$ docker run --name dockerized-react-app -p 80:8080 dockerized-react-app-image
$ docker stop dockerized-react-app-container
$ docker start -a dockerized-react-app-container
$ docker push burakunuvar/dockerized-react-app
```

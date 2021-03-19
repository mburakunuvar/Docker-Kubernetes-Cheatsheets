## Installing Docker on Amazon Linux

[How To install Docker on an Amazon EC2 instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html)

[Repo for Amazon Linux 2](https://gist.github.com/npearce/6f3c7826c7499587f00957fee62f8ee9)

#### Docker Compose

- https://github.com/docker/compose/
- https://docs.docker.com/compose/install/

#### Docker Machine

- https://github.com/docker/machine/
- https://docs.docker.com/machine/install-machine/

```bash
// install docker
$ sudo amazon-linux-extras install docker
$ sudo service docker start
$ sudo usermod -a -G docker ec2-user
$ sudo chkconfig docker on
$ sudo yum install -y git
$ sudo reboot
$ docker --version

// install compose
$ sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$ docker-compose version

// install machine
$ base=https://github.com/docker/machine/releases/download/v0.16.0
$ curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine
$ sudo mv /tmp/docker-machine /usr/local/bin/docker-machine
$ chmod +x /usr/local/bin/docker-machine
$ docker-machine version

// first command
$ docker run hello-world
```

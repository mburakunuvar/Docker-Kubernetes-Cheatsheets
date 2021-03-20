## Onwards to Kubernetes

Question: how would we scale up this application?

Now unfortunately we don't really have a lot of control over what each of these different groups of containers are doing when we proceed with Beanstalk.

if we were making use of Kubernetes, we could have had additional machines running each of our containers and we could have had a lot of control over what these additional machines were doing or what containers they were running.

### Kubernetes Cluster

- Cluster in the world of Kubernetes is the assembly of something called a master and one or more nodes.

- Master has a set of different programs running on it that control what each of these different nodes is running at any given time.

- A node which is each of these blue boxes right here are a virtual machine or a physical computer that is going to use to run some number of different containers so each of these different virtual machines or physical computers you see right here can be used to run different sets of containers.

These can be completely different containers. They don't have to be identical.

- Now outside of our cluster which is represented by this great black box right here we have a load balancer which will take some amount of outside traffic in the form of network requests and relay all those requests into each of our different notes.

### Kubernetes in Development and Production

- In the last section we said that Cabernets is a system for running many different types of containers over multa machines and we choose to use it if we have an application that specifically requires us to run multiple different types of containers.

- If you are planning on creating an application that would largely just have one type of container inside of it -Kubernetes might not be the best solution for you.

development : `minicube` creates a cluster on your local machine.
(so behind the scenes it's essentially going to create a virtual machine whose sole purpose is going to be to run some number of containers => minicube is a program that is used to create this virtual machine)

`kubectl` is used to interact with it. kubectl is that program that is used to interact with a Kubernetes cluster in general and manage what all the different nodes are doing and what different containers they are running.

we're going to start using a lot of different programs to work with communities.

production : EKS , ECS

## Installation ?

You'll recall that we had said that when we installed docker for Mac or Docker for Windows it was technically creating a virtual machine at the same time. So that's essentially the same thing that's happening in the world of Kubernetes.

The only difference is that docker for Mac or for Windows install that virtual machine for you and all the associated software with it. In the world of Kubernetes this is not quite so automatic you and I have to install a little bit of software that's going to allow companies to create or mini cube in this case to create a virtual machine for you now to install this virtual machine.

https://www.devopsschool.com/blog/minikube-installation-on-ec2/

```bash
# kubectl
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
$ chmod +x ./kubectl
$ sudo mv ./kubectl /usr/local/bin/kubectl
$ which kubectl

## minicube
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ chmod +x minikube
$ sudo mv minikube /usr/local/bin/
$ which minikube

#start
$ sudo su
$ minikube start
# for amazon linux :
$ minikube start --vm-driver=none
$ minikube status

$ kubectl cluster-info
$ minikube stop
$ minikube delete

```

### Step By Step

#### Install Kubectl

In your terminal run the following:

```bash
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl

$ chmod +x ./kubectl

$ sudo mv ./kubectl /usr/local/bin/kubectl

#Check your Installation:

$ kubectl version
```

- See also official docs:
  https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux

#### Install Minikube

In your terminal run the following:

```bash
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube

$ sudo install minikube /usr/local/bin

# Check your installation:

$ minikube version

# Start Minikube:

$ minikube start
```

See also official docs:

https://kubernetes.io/docs/tasks/tools/install-minikube/

### Getting Started - Mapping existing knowledge

```bash
$ minikube status
# minikube
# type: Control Plane
# host: Running
# kubelet: Running
# apiserver: Running
# kubeconfig: Configured
# timeToStop: Nonexistent

$ kubectl cluster-info

# Kubernetes control plane is running at https://192.168.49.2:8443
# KubeDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

#### differences than docker-compose

1. So first each entry that we put inside that Docker-compose file optionally allowed us to build an image.So in the Kubernetes world we don't get any benefit like that - we are expected to come with all of our images already built. Kubernetes has no build pipeline there is no build process.

- The expectation is that during some outside step you're going to build all of your different images and have them ready to go ready for deployment onto your Kubernetes cluster.

2. Now the next big observation was that each entry inside of our docker-compose file represented a container that we wanted to create with Kubernetes things are just a little bit different With Kubernetes - we do not have a single config file.

- Instead we're going to end up with multiple configuration files.Each of these different configuration files we're going to put together are going to attempt to create a different object. An object is not necessarily going to be a container.

3. We had said that each entry inside of the Dakar compose file to find the different networking requirements. So in the Kubernetes world we have to manually set up a vast majority of all of our networking. Remember in docker-compose if we created all of these different containers inside of a single doc or compose file we could very easily connect to other containers. In addition if we wanted to do any port mapping it was as easy as adding in a little entry to the docker-compose file.

- So in that Kubernetes world the process of kind of joining together to containers with networking or exposing a port on a container to the outside world is a much more far more involved process and a vast majority of the work that we do throughout the rest of this course is going to be all focused 100 percent on some of these networking topics.

Therefore :

1. MAKE SURE IMAGES ARE ON DOCKER-HUB
2. CREATE ONE CONFIG FILE FOR EACH CONTAINER
3. ONE MORE CONFIGURATION TO SETUP NETWORKING

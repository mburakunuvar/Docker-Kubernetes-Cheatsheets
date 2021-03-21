### MAPPING EXISTING KNOWLEDGE FROM docker-compose

#### MAKE SURE IMAGES ARE ON DOCKER-HUB

```bash
$ docker build -t burakunuvar/dockerized-node-app-image .
$ docker images
$ docker run --name dockerized-node-app -p 80:3000 burakunuvar/dockerized-node-app-image
$ docker login
- username
- password
$ docker push burakunuvar/dockerized-node-app-image
```

## Adding Configuration Files => sample-k8s-pod.yaml

=> with `docker-compose` we had created a configuration file to describe the different containers that we want to create.

=> And we had done something very similarly over with elastic beanstalk as well with `dockerrun.aws`

=> Now with Kubernetes we do make these config files to make containers. But when we make a config files for kubernetes we're not quite making a container. We're kind of making something else slightly different. We're making something called an object.

### Object Types and API Versions

```bash
$ mkdir simplek8s
$ touch sample-k8s-pod.yaml
$ touch sample-k8s-service.yaml
```

So we've written to configuration files we're going to eventually take these two configuration files

We put together and feed them into the cubectl command line tool that we installed a couple of videos ago. When we pass them in cubectl is going to interpret both those files and create two objects out of each file. So the config files that we write are going to use to create objects in general.

**The term object is a reference to a thing that exists inside of our kubernetes cluster.**

### types of objects :

So the first thing to understand here is that the kind entry inside of all the configuration files that you and I are going to write is meant to represent or indicate the type of object that we want to make.

- stateful set
- replica controller
- Pod : used to run a container
- Service : going to set up some kind of networking

every object that we're going to create or every type of object has a slightly different purpose.

#### API version

So when we specify the API version at the very top of the file that essentially scope's or limits the types of objects that we can specify that we want to create within a given configuration file.

### Running Containers in Pods

`minicube start` when we ran that command, it created a new virtual machine on your computer. We refer to that virtual machine that is now running on your computer as a node. That node is going to be used by Kubernetes to run some number of different objects.

one of the most basic objects :

#### POD : the smallest thing that we can deploy in the world of Kubernetes

=> essentially a grouping of containers with a very common purpose.

=> in the Kubernetes world there is no such thing as just creating a container on a cluster.We do not have the ability to just run one naked single container by itself with no associated overhead. The smallest thing that you and I can deploy is a pod.

# WHY DO WE NEED POD ?

So the requirement of a POD is that we must run one or more containers inside of it.

We had our elastic beanstalk and it was running multiple different containers all in this single little grouping. if we take away the vast majority of these containers the rest the containers inside the group are still going to generally function the way we expect.

- it's not what a pod is meant to do!!!

=> The purpose of a POD is to allow that grouping of containers with a very similar purpose or containers that absolutely positively must be deployed together and must be running together in order for application to work correctly.

In the world of POD when we start to group together containers we're grouping to gather containers that have a very discrete very tightly coupled relationship. In other words these are containers that absolutely have a tight integration and must be executed with each other.

#### NOTE:

Inside this course you and I are only going to be running one container inside of any given pod butreasons that you might want to add in more containers is if you have some other containers that have a very very tight integration with other containers that exist inside the pod

We are creating a pod that's going to run one container inside of it.

- We're going to give that container an arbitrary name ( mainly for logging and giving us the ability to reference this running container. But if we were running other containers within pod, we could also use this name property to get some networking or connections between different containers that are running inside the single pod.)
- image pulled from dockerhub
- port to expose the listening port within nodejs app
- metadata mainly for logging purposes
- labes integration with other objects (tightly coupled to the other config file (service config))

### SERVICE CONFIG FILE IN DEPTH

- We use this object type anytime we want to set up some amount of networking inside of a kubernetes cluster.

#### SERVICE SUBTYPES

- **ClusterIP:**
- **NodePort:** The purpose of the node port service is to expose a container to the outside world or in other words to be able to allow you like you as a developer on your computer to open up your web browser and access. A node port service is only good for development purposes. And we do not use node port as a service type in site of production environments outside of one or two very specific exceptions.

=> set up a communication layer between the outside world and the container running inside that port.

- LoadBalancer
- Ingress

In our example we're making a node port service.

**Kube proxy(from outside into services)**
Every single node where every single member of a kubernetes cluster that we create has a program on it called the """cube proxy => essentially the one single window to the outside world.""" So anytime that request comes into a node it's going to flow through this thing called the cube proxy. This proxy is going to inspect the request and decide how to route it to different services or different pods that we may have created inside of this note. So right we're using one service (). But over time we might end up with multiple different services something like that right there as messy as that may be.

- Node port service is going to attempt to take the request and forward it on to Port 3000 of our container that we defined to run inside of our pod.

**label selector (for port forwarding btw services and podes)**

we ise a system in K8S is called the label selector system (rather than any naming ) in order to direct traffic from service to pods. .

- So inside of the service file you'll notice that we have a selector of
  - selector=>component: web.
- Also back inside of the pod file we have a meta data labels property of component
  - labels=>component:web.

That's how these two different objects get linked together (names are arbitrary)

**Collection of (3 different)ports**

So in the service we have a port section this is describing all the different collections of ports that need to be opened up or mapped on the target object.

1. **port** for you and me is more or less 100 percent worthless for the application that we are putting together right now. The port property is going to be the port that another pod or another container inside of our application could access in order to get access to the multi- client pod.

2. **the target port** is the port inside of that pod that we want to open up traffic to.

We used a target port of 3000 right here which indicates that we want to send any incoming traffic into port 3000 inside this pod and port 3000 has been mapped up to the multi client container.

- containerPort is - should be identical to the targetPort (3000, or 80 )

3. **node port** Now the node port is the one that you and I probably care about the most whenever we make use of a node port type. The node port is the port that you and I are inside of our browser are going to access whenever you and I like want to actually test out the container running inside that pod.

So the node pord right here is going to be essentially what you and I type into our browser; in order to access the multi-client pod.

```
localhost:31515
```

So again we can kind of ignore the port property for this application or do and right now the node port is what gets exposed to the outside world and the target port is what gets opened up inside of the targeted pod.

Now the last thing I want to mention is that the node port is going to always be a number between 30000 and 32767. ( randomly assigned => Now the reason or I should say one of the reasons that you and I do not make use of the node port service in a production environment is because of these funky port mappings.)

## Connecting to Running Containers ( local )

```bash
$ minikube start
$ minikube status
$ kubectl apply -f sample-k8s-pod.yaml
$ kubectl apply -f sample-k8s-service.yaml
$ kubectl get pods
$ kubectl get services
# sample-k8s-service
# kubernetes ( one of the default services, about inner working )
```

PORT(S) 1st number : port ( for other containers)
PORT(S) 2nd number : node port ( for browser access )

Note: You will notice that the one port that is not reflected inside of here is the target port.
So the service does not report the port that is trying to open up inside the Target port. That's not done for any security issues. It's just done because we don't need it. You probably only care about the port property and the node port.

**Access the IP Address of VM created by Minikube :**

So at any point in time or ever inside this course and your own applications any time that you want to access some application that is running inside of many cube or inside that virtual machine you are not going to use localhost just forget it. Instead you're going to run mini cube IP and you're going to use this IP address right here.

```bash
$ minikube ip
# local host will no more work
#
```

### Access our container via the EC2 Instance Port on a web browser.

https://medium.com/faun/running-kubernetes-using-minikube-on-aws-cloud-f0d9ecad7be7

```bash
# we need a cluster without a seperate vm
$ minikube stop
$ minikube delete
$ minikube start --vm-driver=none

#  Kubernetes 1.20.2 requires conntrack to be installed in root's path
# sudo apt install conntrack
$ sudo yum install conntrack
$ minikube start --vm-driver=none
$ minikube status

## SAMPLE 1 - using public objects
$ kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080
# Expose the container port so that we can access it and Find where port 8080 in the container exposed in the EC2 Instance port.
$ kubectl expose pod hello-minikube --type=NodePort
$ kubectl get svc

## SAMPLE 2 - using local objects
$ kubectl apply -f sample-k8s-pod.yaml
$ kubectl apply -f sample-k8s-service.yaml
```

# Exposing an External IP Address to Access an Application in a Cluster

https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/

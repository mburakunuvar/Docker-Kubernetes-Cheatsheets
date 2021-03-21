### Updating Existing Objects

Now one thing that's kind of interesting about the process of the declarative approach over here is that we're essentially saying that we're going to take this config file throw it into cube Seitel which is of course going to forward it on to master and somehow magically the master is going to realize that it needs to update this existing pod as opposed to creating a new one

**requirements for above:**

- name of config should be same (client-pod)
- type of config should be same (Pod)

```yaml
kind: Pod
metadata:
  name: client-pod
```

If it has a new name or kind, then a new object will be created

### Declarative Updates in Action

#### MAKE SURE IMAGES ARE ON DOCKER-HUB

We're going to update the image within our pod object
=> (simple-node by simple-react)

```bash
$ docker build -t burakunuvar/dockerized-react-app-image .
$ docker images
$ docker run --name dockerized-react-app -p 80:3000 burakunuvar/dockerized-react-app-image
$ docker login
- username
- password
$ docker push burakunuvar/dockerized-react-app-image
```

=> Kubernetes App Running on http://54.170.114.35:31515/
=> Docker app running on http://54.170.114.35/

- replace existing image in pod object (burakunuvar/dockerized-node-app-image) by (burakunuvar/dockerized-react-app-image)

```yaml
spec:
  containers:
    - name: nodejs-app
      # image: burakunuvar/dockerized-node-app-image
      image: burakunuvar/dockerized-react-app-image
      ports:
        - containerPort: 3000
```

```bash
$ kubectl apply -f sample-k8s-pod.yaml
# pod/client-pod configured

```

**inspect the new running pod**

```bash
# for specific object
$ kubectl describe pod sample-k8s-pod

# for all objects with specific type
$ kubectl describe pods
```

**limitations on config updates for POD Object**

- changing container port within pod object is not possible

```yaml
- containerPort: 3000=>3050 not allowed!
```

Not allowed ! ( only image and few others are possible to be updated )

### How to handle above issue ? Running Containers with Deployments

In order to prevent error when updating containerport, or any other not allowed configs :

## USE A NEW TYPE OF OBJECT => DEPLOYMENT

**Pods vs Deployments**

- A deployment is a KUBERNETERS object that is meant to maintain a set of identical pods. so that can be one part two part three pod whatever number => the deployment is going to constantly work to make sure that every single pod in its set that it's supposed to manage is always running that can correct configuration and is always in a runnable state.

- Now a deployment is very similar in nature to a pod. But at the end of the day we can use either deployments or pods with Kuber Nettie's to run containers for our application.

- Pod is mainly for one of dev whereas Deployment is meant to run a set of identical pods better for production and enables more flexibily in terms of updates

- So when we create a deployment object it's going to have attached to it something called a pod template. A pod template is essentially a little block of configuration file or see a little block configuration that says hey here's what any pod that is created by this deployment is supposed to look like.

# From this point forward throughout this course. We are no longer going to create pods ourselves manually. Instead we're going to create deployments that will create pods for us.

## Deployment Configuration Files

=> When a deployment creates a pod it doesn't directly create the pod itself and maintain it. Instead the deployment reaches out to the kubernetes API on the master and says Hey Master I need you to create a pod for me.

=> So the deployment after the pod has created needs to somehow get a handle on the pod that is created and that's the purpose of that selector field.

```yaml
selector:
  matchLabels:
    component: web
```

## Applying a Deployment

Remove the existing pod object first and then use the deployment config :

```bash
# an imperative update to the state of cluster
$ kubectl delete -f sample-k8s-pod.yaml
# might take 10 seconds until container is killed/stopped
$ kubectl apply -f sample-k8s-deployment.yaml
$ kubectl get pods
$ kubectl get deployments
```

reminder: delete is an imperative update.
reminder: You should be in the directory of config files

## Why to Use Service Objects?

=> Every single pod that we create gets its own IP address assigned to it. ( not the minikube ip , which was the ip of node)

```bash
$ kubectl get pods -o wide
```

Our pod was randomly assigned an IP address of 172.17.06 ( assigned to the pod inside of vm)

Whenever pod is restarted or a new one created, IP Address will change. Therefore, in order to provide a stabilized approach we use SERVICES.

So that's why we make use of the service. These pods are coming and going all the time. Pods are getting deleted they're getting recreated and every time they potentially might get assigned a brand new IP address the service is going to kind of abstract out that difficulty and that's why we make use of these services. And each time that we want to connect to one of our different pots.

- remember that Services use selectors in order to find the target port, not their IPs.

```yaml
selector:
  component: web
```

## Scaling and Changing Deployments

- Now we can update the port number in yaml file, which will spin up a new pod and kill the previous one. (recreate)

```yaml
spec:
  # replicas: 1
  replicas: 5
  selector:
    matchLabels:
      component: web
  template:
    metadata:
      labels:
        component: web
    spec:
      containers:
        - name: dockerized-react-app
          # image: burakunuvar/dockerized-react-app-image
          image: burakunuvar/dockerized-node-app-image
          ports:
            # - containerPort: 3000
            - containerPort: 3050 # this requires change on app code as well,
```

- We can also update number of replicas ( from 1 to 5)

```bash
$ kubectl get deployments
```

- We can also update images

# how to pull down latest version of image

## updating image version

1. update react code

2.

```bash
$ docker build -t burakunuvar/dockerized-react-app-image .
$ docker push burakunuvar/dockerized-react-app-image
```

## Rebuilding the Client Image

## Force pods to re-pull an image without changing the image tag 33664

https://github.com/kubernetes/kubernetes/issues/33664

There's nothing in yaml files that refer to versions.

OPT 1 : delete pods, so while recreating it'll use the latest image

OPT 2 : mention versions on image in yaml (v1,v2 )

```bash
$ docker build -t burakunuvar/dockerized-react-app-image .
# update yaml
$ kubeclt apply ... with new config
```

requires manual steps

```yaml
containers:
  - name: dockerized-react-app
    image: burakunuvar/dockerized-react-app-image:v2
    image: burakunuvar/dockerized-react-app-image:v3
```

Note: Environment variables aren't allowed within this file so no way to use sth like ${client_version}

OPT 3 : Imperative update

## Imperatively Updating a Deployment's Image => Step by step

Note : We'd already built our deployments and pods

```bash
$ minikube start --vm-driver=none
$ kubectl apply -f sample-k8-deployment.yaml
$ kubectl apply -f sample-k8-port.yaml
```

step 1 : update the code of react app
step 2 : rebuild your image

```bash
$ docker build -t burakunuvar/dockerized-react-app-image:v3
$ docker run -p 9000:80 burakunuvar/dockerized-react-app-image:v3
# visit http://3.249.61.82:9000/
$ docker push burakunuvar/dockerized-react-app-image:v3
```

Step 3 :

```bash
$ kubectl set image deployment/sample-k8-deployment client=burakunuvar/dockerized-react-app-image:v3
```

**Note:** when we eventually move over to a production environment all this versioning stuff is going to be completely automated for us and we're not going to have to do any additional work.

# BELOW WILL NOT APPLY FOR Docker Desktop's Kubernetes Users OR --vm-drive=NONE CASE

## Multiple Docker Installations

quick note:

```bash
$ docker ps
# will show only the ones in minikube vm , if there's one
```

How to use docker-client to interact with minikube vm as well as
docker for Mac (local copy)

Whenever you use a `docker cli` command like docker ps
when docker is invoked it's going to look at a set of environment variables to decide what copy of docker- server it is supposed to connect to an attempt to execute this command.
So when we run this `minicube docker-env `and command with the `eval` command especially it's going to set up some new environment variables that we're going to tell docker cli to reach into the virtual machine to find the copy of docker server that is supposed to work work with.

```bash
$ eval $(minikube docker-env)
# to see what it's doing:
$ minikube docker-env
# exports env variables
```

So when I run this command right here it's going to very temporarily reconfigure my copy of docker clie to connect to the or server inside of my cube Kubernetes node.

This is temporary, you need to do anytime you open a new terminal.

### Why would we ever want to look at the copy of Dharker running inside the virtual machine.

Especially since I told you when we first started looking at Kubernetes that you and I as developers do not mess around with the inner workings of the virtual machine. ( we leave it to master)

## Why Mess with Docker in the Node (minikube vm) ?

you need to run anytime :

```bash
$ eval $(minikube docker-env)
```

- in order to apply same debugging techniques of Docker CLI

```bash
$ docker logs ...
$ docker exec -it ... sh
```

those are also available by kubectl

```bash
$ kubectl get pods
$ kubectl logs
$ kubectl exec -it ... sh
```

- manually kill containers to test "Self-Heal" of Kubernetes

- delete cached images in the node (minikube vm)

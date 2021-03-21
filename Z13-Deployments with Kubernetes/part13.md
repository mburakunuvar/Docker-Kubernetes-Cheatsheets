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

=> update the image (simple-node by simple-react)

- or in my case replace existing (stephengrider/multi-client) by (burakunuvar/multi-client-for-kubernetes)

```bash
$ kubectl apply -f client-pod.yaml
# pod/client-pod configured

```

**inspect the new running pod**

```bash
$ kubectl describe pod client-pod
```

- didn't work so why not returning back to (stephengrider/multi-client) ?

**limitations on config updates**

- changing container port

```yaml
- containerPort: 3000
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

### removing object

```bash
# an imperative update to the state of cluster
$ kubectl delete -f client-pod.yaml
# might take 10 seconds until container is killed/stopped
$ kubectl apply -f client-deployment.yaml

$ kubectl get pods
$ kubectl get deployments
```

## Why to Use Service Objects?

```bash
# for local desktop
$ minikube ip
#or start minikube without vm on amazon linux
# we need a cluster without a seperate vm
$ minikube stop
$ minikube delete
$ minikube start --vm-driver=none
#  Kubernetes 1.20.2 requires conntrack to be installed in root's path
# sudo apt install conntrack
$ sudo yum install conntrack

```

=> Every single pod that we create gets its own IP address assigned to it. ( not the minikube ip , which was the ip of node)

```bash
$ kubectl get pods -o wide
```

Our pod was randomly assigned an IP address of 172.17.06 ( assigned to the pod inside of vm)

Whenever pod is restarted or a new one created, IP Address will change. Therefore, in order to provide a stabilized approach we use SERVICES.

So that's why we make use of the service these pods are coming and going all the time. Pods are getting deleted they're getting recreated and every time they potentially might get assigned a brand new IP address the service is going to kind of abstract out that difficulty and that's why we make use of these services. And each time that we want to connect to one of our different pots.

- remember that Services use selectors in order to find the target port, not their IPs.

```yaml
selector:
  component: web
```

## Scaling and Changing Deployments

- Now we can update the port number in yaml file, which will spin up a new pod and kill the previous one. (recreate)

```bash
$ kubectl get pods
$ kubectl describe pods ...
```

- We can also update number of replcas ( from 1 to 5)

```bash
$ kubectl get deployments
```

- We can also update images

# how to pull down latest version of image

## updating image version

1. update react code

2.

```bash
$ docker build -t stephengrider/multi-client .
$ docker push stephengrider/multi-client
```

## Rebuilding the Client Image

## Force pods to re-pull an image without changing the image tag 33664

https://github.com/kubernetes/kubernetes/issues/33664

There's nothing in yaml files that refer to versions.

OPT 1 : delete pods, so while recreating it'll use the latest image

OPT 2 : mention versions on image in yaml (v1,v2 )

```bash
$ docker build -t stephengrider/multi-client .
# update yaml
$ kubeclt apply ... with new config
```

requires manual steps

Note: Environment variables aren't allowed within this file so no way to use sth like ${client_version}

OPT 3 : Imperative update

step 1 : Build your own image

```bash
$ cd frontend
$ docker build -t burakunuvar/simple-react-frontend
$ docker run -p 9000:80 burakunuvar/simple-react-frontend
# visit http://3.249.61.82:9000/
$ docker push burakunuvar/simple-react-frontend
```

step 2 : Build your own deployments and pods

```
$ minikube start --vm-driver=none
$ kubectl apply -f client-deployment.yaml
$ kubectl apply -f client-node-port.yaml
```

step 3 : update the code of react app

Step 4 :

```bash
$ docker build -t burakunuvar/simple-react-frontend:v5 .
$ docker push burakunuvar/simple-react-frontend:v5

$ kubectl set image deployment/client-deployment client=burakunuvar/simple-react-frontend:v5
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

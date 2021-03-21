## The Entire Deployment Flow

```bash
$ kubectl get pods
$ docker ps
$ docker kill IDWITHKUBERNETES 5e9ed34553d9
$ docker ps
# It's still there!
$ kubectl get pods

```

Now we're going to imagine that rather than creating a single instance of the multi client image or multi client container, maybe we have a deployment file instead that says that it wants to create four copies using the multi worker image.

- If we manually delete containers within a pod, it'll be restarted

- the deployment file is essentially identical to the two files that we just put together that create a pod or a service

- So when we run `apply` command the file is taken and it is passed off to something called the master.

on the master there is a variety of different programs (three or four in total) that control your entire cluster. Let's name them as "kube-apiserver" for the sake of simplicity.

#### "kube-apiserver"

100 percent responsible for monitoring the current status of all the different nodes inside of your cluster and making sure that they are essentially doing the correct thing. It's going to read the configuration file and it's going to interpret it in some fashion.

- The master then has a little kind of Notepad of sorts that records all of its responsibilities or essentially all the things that you and I have told it to do in the form of these deployment files.

- kube-apiserver going to update its little list of responsibilities and say OK I need to be running an image called multi-worker I need to be running four copies of it.("So you three nodes. I want you to startup some number of copies of multi worker that's going to say to the first no down here I want you to startup two copies of multi worker.")

**a copy of docker is running inside of each of these virtual machines**

- So technically on your computer you now have two copies of Docker running both the copy created by docker
  for Windows or dockerfor Mac and the copy that is running inside of that single node that has been created by minikube.

these copies of docker are 100 percent kind of autonomous - not connected.

- Those will reach out to DockerHub, download images and run containers inside pods

**Summary:** You see the master is always continuously pulling each of these different notes. It's watching every single one. And any time that something happens inside one of these nodes the master gets all notification so we can kind of imagine that when I ran Dr. kill and then I killed that container we can imagine that one of these containers essentially fell away like so. So the Master then got a little notification that said hey little issue here.
One of our containers just up and died completely gone. And so the master very temporarily updated its little list of responsibilities to say OK I need four copies of multi worker but I now have three copies running. Whoa that's a big problem. So the Master then looks back out at its collection notes and it says maybe it picks this note right here and says hey you you need to have an additional copy of multi worker running. And so this note right here we'll use that image that it's already downloaded.

**Now some of the big takeaways I want you to understand here from all this stuff.**

- First off when you and I loaded up that deployment file we did not pass that deployment file directly off to one of these worker notes. Instead the deployment file went to the master.

So the big lesson here is that you and I as developers work with this master you and I do not work directly with the notes over here. In other words you and I are never going to reach into a node with some serious commands and attempt to manually start a container inside of one of them. Instead we're always going to use the cubectl command line tool which is going to send all of our commands off to the master. It's then up to the master and the different programs that are running inside this thing to reach out to some appropriate node and create the appropriate container or essentially update the appropriate note. It's up to the master to reach out to some node and tell it to do some amount of work to fulfill the master's little list of responsibilities.

- The next big thing to take notice of is that the master is always watching each of these different notes and each time that some container or some object for that matter runs into some issue the master is going to automatically attempt to recreate that object inside of some given note until it's list of responsibilities is 100 percent balanced out.

Now that kind of idea of us kind of saying Hey Master Here's your list of responsibilities and then having the master constantly work to make sure that that list of responsibilities is fulfilled is one of the most important ideas in everything around Kubernetes.

# Imperative vs Declarative Deployments

To deploy something we updated that desired state of the master with a config file.We passed in this deployment file over here and the master updated its little list of responsibilities. Master's going to work constantly to meet your desired state.

- So were going to look at a couple of more diagrams that are going to expand upon this idea of us kind of telling companies what we want as opposed to us very specifically saying like hey please create this POD or something like that.

**with an imperative style**

You and I would issue a series of commands that say specifically like create this container and create this container and then delete that one and then upgrade that one and restart that one or whatever might need to happen

very discrete commands

**in the case of a declarative deployment**
we say to our master something like you know it would be great if you just made four containers happen and made four containers happen all the time. Master you just go ahead you figure out how to deal with that.

we kind of set guidance or a directive

### Best Practice

So the reason I'm telling you all this is that when you start looking at Kubernetes documentation

Blog posts stack overflow posts whatever else you are going to see some resources out there Recommend that you take a imperative approach.Kubernetes also has a set of commands to do things through a declarative approach as well.

For any real production deployment everything every engineer out there everyone in the community is always going to advocate taking the declarative approach.

In general you and I are going to always going to meet you and I are going to always try to do the same thing over and over and over again of updating a configuration file and then sending that config off to master

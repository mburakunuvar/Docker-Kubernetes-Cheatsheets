## Multi-Container Deployments to AWS

### Multi-Container Definition Files

Elastic beanstalk doesn't actually know how to work with containers especially a multi container environment.
Behind the scenes when you tell beanstalk to host a set of containers it's actually delegating that hosting off to another service - ECS

You work with ECS by creating files that are called **Task definitions** and a task definition is essentially a file that tells us how to run one single container.

Each of these task definition files are very similar almost identical to the container definitions that you and I are going to write inside of our **Dockerrun.aws.json** chase on file.

### Container Definitions

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions

### Dockerrun.aws.json

The docker run file is really just customized to work directly with AWS and the big difference between the two is that the `docker-compose` file has directions on how to build an image but with `dockker-run file` we have already built the image no build required. We're just going to specify the image to use.

### More Container Definitions(hostnames)

- "hostname": "nginx" is optional as this one isn't used by any of the dockerfiles. (same for "hostname": "express-worker" )

- "essential": true is required for at least one container must be marked as essential if this container crashes for any reason everything else. All these other containers will be automatically shut down at the same time.

#### hostname ( dockercompose vs dockkerrun.aws )

Remember that back inside of our docker compose file we had the list of services and every service had a different name. So for example "express-server" was called "express-server". By sending out this name right here, it essentially also created a new host name that could be accessed by any other container that was created by Docker-compose.

Therefore, within default.conf it was also possible to use the name of services also as hostname.

```
 location / {
    proxy_pass http://react-frontend;
  }

  location /api {
    rewrite /api/(.*) /$1 break;
    proxy_pass http://express-server;
```

However for "dockkerrun.aws" we have to specify a very distinct hostname.

### Forming Container Links

#### Port Mappings

docker-compose had the one below :

```yml
ports:
  - "3000:80"
```

should be replaced with :

```json
{
  "portMappings": [
    {
      "hostPort": 3000,
      "containerPort": 80
    }
  ]
}
```

#### Service Names & Host Names & Links

As a quick reminder back inside of our docker compose file we were very easily able to kind of communicate between different containers by making use of the different hostnames = service names.

So for example when the express-server had to connect to redis we simply said Oh yeah connect to the hostname of redis (service name).

Any time that the express-server made a request out to a hostname of redis it automatically got routed over to this other running service or this other running container.

- communication within docker-compose is built based on names of services.So in the world of Docker compose everything was easy as pie.

#### we were using the names of services as hostnames in default.conf

```conf
 location / {
    proxy_pass http://react-frontend; => service name in docker-compose
  }

  location /api {
    rewrite /api/(.*) /$1 break;
    proxy_pass http://express-server; => service name in docker-compose
```

However, when you start deploying containers over to Amazon Elastic beanstalk or you know as we've said behind the scenes technically is yes we have to do a little bit more explicit mapping or kind of more explicitly form up links or connections between these different containers.

#### we will now need to define hostnames separately and then also establish a link between services by using service names.

```json
"links": ["react-frontend", "express-server"]
```

```conf
 location / {
    proxy_pass http://react-frontend; => host name in docker-compose
  }

  location /api {
    rewrite /api/(.*) /$1 break;
    proxy_pass http://express-server; => host name in docker-compose
```

- Links are kind of unit directional. In other words NGINX only has to kind of point over to client but we don't have to form an opposite direction connection.

### hostname vs link :

We've used all same names in this example for both hostname and the service names, for the sake of simplicity.

- Hostname is used by the code itself ( default.conf file, express.js files of node apps )

- Links are only a replacement for a default docker-compose feature ; which was spinning up all containers already within a network. You need to use the name of service ( not hostname) to establish links.

JSON VALIDATOR https://jsonlint.com/

### CREATING EB ENVIRONMENT

=> Follow BeanstalkCheatSheet p2

### Managed Data Service Providers & VPC Overview

### CREATING ElastiCache and RDS ENVIRONMENT

=> Follow BeanstalkCheatSheet p2

- Set Master Username to postgres
- Set Master Password to postgres_password and confirm.
- Set Initial database name to dockerized-fullstackapp

### environment variables

=> Follow BeanstalkCheatSheet p2

Back when we put together the docker compose file we had to manually specify all these environment variables and specifically pass them into this specific service. And we did the same thing for rests on the worker down here as well. Now on the Leszek beanstalk when you set up those environment variables they automatically get added to all the different containers that you listed inside that dock or run your study case on file.

So every single one of these containers has automatic access to that set of environment variables. So we do not have to do any additional environment variable mapping. So that makes life a little bit easier.

### Travis Deploy Script

The only difference this time around is that the only file that we really have to deploy is the send over elastic beanstalk is the `dockerrun.aws.json` file.Once elastic beanstalk gets a file it's going to pull these images from Docker hub and take it away from there.

### Container Memory Allocations

error : service:ECS => MEMORY !

=> MEMORY is a required option for each container defined in `Dockerrun.aws.json`

```

```

AWS Configuration Cheat Sheet
updated 6-26-2020
confirmed working as of 10-15-2020

This lecture note is not intended to be a replacement for the videos, but to serve as a cheat sheet for students who want to quickly run thru the AWS configuration steps or easily see if they missed a step. It will also help navigate through the changes to the AWS UI since the course was recorded.

## EBS Application Creation

1. Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

2. Click “Create Application”

3. Set Application Name to 'multi-docker'

4. Scroll down to Platform and select Docker

5. In Platform Branch, select Multi-Container Docker running on 64bit Amazon Linux

6. Click Create Application

You may need to refresh, but eventually, you should see a green checkmark underneath Health.

## RDS Database Creation

1. Go to AWS Management Console and use Find Services to search for RDS

2. Click Create database button

3. Select PostgreSQL

4. In Templates, check the Free tier box.

5. Scroll down to Settings.

6. Set DB Instance identifier to multi-docker-postgres

- Set Master Username to postgres

- Set Master Password to postgres_password and confirm.

7. Scroll down to Connectivity. Make sure VPC is set to Default VPC

8. Scroll down to Additional Configuration and click to unhide.

- Set Initial database name to dockerized-fullstackapp

9. Scroll down and click Create Database button

## ElastiCache Redis Creation

172.31.32.0/20

1. Go to AWS Management Console and use Find Services to search for ElastiCache

2. Click Redis in sidebar

3. Click the Create button

4. Make sure Cluster Mode Enabled is NOT ticked

5. In Redis Settings form, set Name to multi-docker-redis

6. Change Node type to 'cache.t2.micro'

7. Change Replicas per Shard to 0

8. Scroll down and click Create button

## Creating a Custom Security Group

1. Go to AWS Management Console and use Find Services to search for VPC

2. Find the Security section in the left sidebar and click Security Groups

3. Click Create Security Group button

4. Set Security group name to multi-docker

5. Set Description to multi-docker

6. Make sure VPC is set to default VPC

7. Click Create Button

8. Scroll down and click Inbound Rules

9. Cick Edit Rules button

10. Click Add Rule

11. Set Port Range to 5432-6379

12. Click in the box next to Source and start typing 'sg' into the box. Select the Security Group you just created.

13. Click Create Security Group

### Applying Security Groups to ElastiCache

1. Go to AWS Management Console and use Find Services to search for ElastiCache

2. Click Redis in Sidebar

3. Check the box next to Redis cluster

4. Click Actions and click Modify

5. Click the pencil icon to edit the VPC Security group. Tick the box next to the new multi-docker group and click Save

6. Click Modify

7. Applying Security Groups to RDS

8. Go to AWS Management Console and use Find Services to search for RDS

9. Click Databases in Sidebar and check the box next to your instance

10. Click Modify button

11. Scroll down to Network and Security and add the new multi-docker security group

12. Scroll down and click Continue button

13. Click Modify DB instance button

### Applying Security Groups to Elastic Beanstalk

1. Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

2. Click Environments in the left sidebar.

3. Click MultiDocker-env

4. Click Configuration

5. In the Instances row, click the Edit button.

6. Scroll down to EC2 Security Groups and tick box next to multi-docker

7. Click Apply and Click Confirm

8. After all the instances restart and go from No Data to Severe, you should see a green checkmark under Health.

## Add AWS configuration details to .travis.yml file's deploy script

1. Set the region. The region code can be found by clicking the region in the toolbar next to your username.
   eg: 'us-east-1'

app should be set to the EBS Application Name
eg: 'multi-docker'

env should be set to your EBS Environment name.
eg: 'MultiDocker-env'

2. Set the bucket_name. This can be found by searching for the S3 Storage service. Click the link for the elasticbeanstalk bucket that matches your region code and copy the name.

eg: 'elasticbeanstalk-us-east-1-923445599289'

3. Set the bucket_path to 'docker-multi'

4. Set access_key_id to $AWS_ACCESS_KEY

5. Set secret_access_key to $AWS_SECRET_KEY

### Setting Environment Variables

1. Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

2. Click Environments in the left sidebar.

3. Click MultiDocker-env

4. Click Configuration

5. In the Software row, click the Edit button

6. Scroll down to Environment properties

7. In another tab Open up ElastiCache, click Redis and check the box next to your cluster. Find the Primary Endpoint and copy that value but omit the :6379

Set REDIS_HOST key to the primary endpoint listed above, remember to omit :6379

Set REDIS_PORT to 6379

Set PGUSER to postgres

Set PGPASSWORD to postgrespassword

8. In another tab, open up the RDS dashboard, click databases in the sidebar, click your instance and scroll to Connectivity and Security. Copy the endpoint.

Set the PGHOST key to the endpoint value listed above.

Set PGDATABASE to fibvalues

Set PGPORT to 5432

9. Click Apply button

10. After all instances restart and go from No Data, to Severe, you should see a green checkmark under Health.

### IAM Keys for Deployment

1. You can use the same IAM User's access and secret keys from the single container app we created earlier.

2. AWS Keys in Travis

3. Go to your Travis Dashboard and find the project repository for the application we are working on.

4. On the repository page, click "More Options" and then "Settings"

5. Create an AWS_ACCESS_KEY variable and paste your IAM access key

6. Create an AWS_SECRET_KEY variable and paste your IAM secret key

### Deploying App

1. Make a small change to your src/App.js file in the greeting text.

2. In the project root, in your terminal run:

```bash
git add.
git commit -m “testing deployment"
git push origin master
```

3. Go to your Travis Dashboard and check the status of your build.

4. The status should eventually return with a green checkmark and show "build passing"

5. Go to your AWS Elasticbeanstalk application

It should say "Elastic Beanstalk is updating your environment"

It should eventually show a green checkmark under "Health". You will now be able to access your application at the external URL provided under the environment name.

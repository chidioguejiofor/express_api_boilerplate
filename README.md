# Boiler Plate code for Node/Express + TypeScript projects

This boiler plate repository shows some general features I usually implement in my express + TypeScript projects. 


### Setup
- Clone the repo
- Setup commit message interface by running 
```bash
    git config --local commit.template .gitmessage
```
- Add the env variables using .env.example

### Running Redis
You can run Redis in your machine easily via:

```bash
docker run -p [PORT_HERE]:[PORT_IN_DOCKER_HERE] redis
``` 

eg

```bash
docker run -p 6379:6379 redis
``` 


#### Running app with Docker
- Ensure you have [Docker](https://docs.docker.com/docker-for-mac/install/) installed and running on your machine

- Build and tag the docker image
```bash
docker build -t <tag> -f Docker/Dockerfile .
```
eg
```bash
docker build -t  express_boiler -f Docker/Dockerfile .
```

- Spin up the container
```bash
docker run -d --name <container name> -p <port-in-.env>:<port-in-.env>  <tag>:latest
```
eg

```bash
docker run  --name express_boiler_container  -p 4000:4000 express_boiler:latest
```

- The above command should return a container ID, to stop a running container
```bash
 docker stop <containerID>
```
OR
```bash
 docker stop <container name>
```


### Documentation

This boilerplate handles all the authentication-related endpoints including:
- Login
- Register
- Reset Password
- Forgot Password

You can access the documentation of these endpoints in this [Postman Documentation](https://documenter.getpostman.com/view/4208573/TVYGcy7v) or download run in  [![this collection](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b823ff20b7bde97333b4#?env%5BHeroku%5D=W3sia2V5IjoiYmFzZS11cmwiLCJ2YWx1ZSI6ImxvY2FsaG9zdDozMDAwL2FwaSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicmVzZXQtaWQiLCJ2YWx1ZSI6IjY3ZWI0N2M3LWFlYTMtNGYxZC1hOGRmLWIyZjZlODIyZDYzZCIsImVuYWJsZWQiOnRydWV9XQ==)


You may also decide to download the docs from the docs folder in the repository.


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


I used to hate docker. It was scary — I didn’t fully understand it, nor did I want to. I liked my processes: I liked writing code and running it on my machine, straight on the metal. I liked having to write long “READMEs” about how to install all the dependencies, dealing with my local install of Postgres, and fighting with orchestrating many different services locally. *Wait…*


I used to think Docker was useless. I honestly believed that it was like Kubernetes: over-engineered for most of my use cases, and couldn’t believe that people were actually using it. For one of my projects, I wanted to use Hasura. Unfortunately, the best way to use it was by using Docker. “Fine”, I huffed. I bit the bullet and installed Docker Desktop.

Hating every second of it, I coped the “docker-compose” file. With hate flowing through my fingertips, I typed the command “docker-compose up”. I waited (furiously) as docker began to pull images from the cloud. Spitefully, I laughed as the Postgres database and Hasura both launched seamlessly on my machine and began talking to eachother with no need for my intervention.

Wait! What? That’s it? I just had to copy the docker-compose.yml file, run Docker-Compose up, and that’s it? I have my database and server running on my machine just like that? This has to be a prank. I typed “localhost:8080” in my chrome browser I was greeted by the Hasura admin screen. I opened my DBAdmin (This isn’t sponsored, but I use TablePlus for Mac — much better then PHPMyAdmin.) and connected to my locally running postgres instance without a hiccup.

I was hooked.

I’ll admit, I’ve fallen a little off the deep end of docker lunacy. But it’s just so easy. I started a new project the other day, and I wanted to be able to orchistrate:
- 2 Postgres databases
- a Node.js project running Postgraphile
- Google Cloud Functions local runners
Imagine onboarding a new engineer onto this project without docker. I’d need to tell them that they should locally create two postgres databases, have node.js installed, and how to run the Cloud Functions in a daemon. It’s not easy! I could do that, or I could just explain how to install docker and run docker-compose up. I don’t care if they’re using an M1 or Intel Mac, a Windows machine, any Linux distro, even a Chromebook (actually I’m not sure about the last one but I can only presume). If they can get docker working, they can run the app full stack locally.

I was scared of learning docker, because I thought it would be a huge time investment. There’s entire jobs dedicated to DevOps, and isn’t Docker a dev-opsy type deal? I thought it would be a weeks long learning process, and I’d have to know a bunch of stuff to be able to write a Dockerfile.

Nope. Just use alpine linux, bro. Install your dependencies and you’re good to go. You want two docker containers to talk to eachother? Write a docker-compose.
Trust me, it’s not as hard as it seems. I wanted to hate it too, I really did — I wanted to be a hipster of the development community. “No dude, I don’t use docker 😎 I just orchestrate everything manually and waste many dev-hours troubleshooting the project setup on their machines.”

I really do think it’s useful for anyone, not just backend devs or Devops guys. At the very least, know of what it’s useful for, so if you’re ever faced with a problem that docker might solve, you might be able to reach towards the loveable whale.
Is docker applicable for every single situation? Absouletly not. There are cases where a package.json is just fine, or even deploying a executable binary does the trick. If you’re working alone, or working on a weekend project, or just trying some new technology out, why not? You’ll incur some overhead setting it up on your raw computer, but who cares. It’s your computer, and in cases like this, you probably just want to start learning fast.
Any situation, though, that you need to share a project, or deploy a project to multiple machines, you’re gonna want to dockerize it. It is not hard, and there’s no need for a two hour tutorial. I bet I could teach docker and docker compose in a 10 minute article.
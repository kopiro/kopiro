## How to easily run any Linux tool on any machine

#### Published on 7/30/2020

![How to easily run any Linux tool on any machine](https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzita7utklosbwa4lp9nn.png)


Have you ever encountered a situation like the ones below?

**Situation 1**: You’re on your Linux workstation, and there is a PHP code that you must execute. But this code only runs under PHP 7, and your workstation only has PHP 5.

**Situation 2**: You’re working on your MacBook laptop, and you desperately need your sqlmap tool from your Kali Linux distribution. But you don’t have access to your Virtual Machine.

**Situation 3**: You’re on your Windows PC, and you immediately need an NGINX server that serves your static files from a directory.

**Situation 4**: No matter which platform, you have to start your Node.js 10 project. But you don’t have Node.js installed on your platform.

Or, in general, have you ever been a situation like this:

**Situation X:** you are on one platform, and you immediately need a specific Linux tool, without altering your configuration or installing additional software.

All these situations can be easily solved with a single tool you may have already heard about. It works without messing up your computer by installing additional software, or editing configurations that worked for a long time.

**Docker** is an OS-level virtualization system. It can potentially run any binary you have in mind. Furthermore, it can run it in an isolated system, so it can’t touch your files and your precious working configurations.

All you need is for someone to have already containerized your binary so that you can simply download it as an image. There are already a ton of Docker-built images out there waiting for you.

Docker does do more than this. It is a platform for developers and system administrators to develop, deploy, and run applications with containers. If you use it only to run your preferred binary, you’re using 1% of its features.

But let’s start from the beginning.

You can install Docker on your machine by clicking [this link](https://docs.docker.com/install/overview/) and selecting your platform from left menu. Then, follow the guide.

Once you have installed Docker, open your preferred Terminal or Command Prompt.

### Basic concepts

First of all, let’s test if your Docker configuration is working correctly. From the terminal:

```bash
$ docker --version
Docker version 18.03.0-ce, build 0520e24
```

If Docker is up and running, you should see your version number.

All you need now is the docker run command.

The first thing to know is the name of the image you want to use. For official images, you usually have the name of the binary with no additions.

For example, in the case of PHP, the image name is simply `php`. And what about the version? Simple as well, just add the version number (e.g., 7).

Now let’s run our first container.

### Situation 1

> You’re on your Linux workstation, and there is a PHP code that you must execute. But this code only runs under PHP 7, and your workstation only has PHP 5.

Ok, now let’s imagine we have this simple code. It only works under PHP 7, because of the spaceship** **operator:

```php
<?php echo 1 <=> 0;
```

How we can execute this code with Docker? Let’s build our docker run command.

```bash
$ docker run -it php:7
*Interactive shell
php > echo 1<=>0;
1
```

Yes — that’s all we need!

The extra part is the `-it` flag, but that’s not difficult. Since we are in the interactive shell, it simply specifies that this container should:

* -t (—tty): allocate a [pseudo-TTY](https://unix.stackexchange.com/questions/21147/what-are-pseudo-terminals-pty-tty)

* -i (—interactive): keep [STDIN](https://en.wikipedia.org/wiki/Standard_streams) open, even if not attached

You should use them most of the time, with some exceptions.

### Situation 2

> You’re working on your MacBook laptop, and you desperately need your sqlmap tool from your Kali Linux distribution. But you don’t have access to your Virtual Machine.

Unfortunately, sqlmap doesn’t have an official simple image name. But maybe someone else has created an image. Let’s search for it.

```bash
$ docker search sqlmap
    NAME                     DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
    paoloo/sqlmap            Dockered sqlmap. Build instructions: https:/…   6
    k0st/alpine-sqlmap       sqlmap on alpine (size: ~113 MB)                3                                       [OK]
    jdecool/sqlmap           sqlmap (Automatic SQL injection) in a contai…   2                                       [OK]
    harshk13/kali-sqlmap     Kali Linux base image with Sqlmap               1
    marcomsousa/sqlmap       Simple image that execute Automatic SQL inje…   1                                       [OK]
....
```

We have several choices. This can happen often. For most cases, the image should be the first one (or the one with the greater star count).

Let’s use it.

```bash
$ docker run -it paoloo/sqlmap --url [http://localhost](http://localhost)
             _
     ___ ___| |_____ ___ ___  {1.0.9.32#dev}
    |_ -| . | |     | .'| . |
    |___|_  |_|_|_|_|__,|  _|
          |_|           |_|   [http://sqlmap.org](http://sqlmap.org)

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program.
...
```

All arguments that are after [docker run -it {image}]** **are passed to the binary executed in Docker, which is sqlmap in this case.

Easy enough, right? Yes, but there is a con.

sqlmap writes log files onto the disk in the `~/.sqlmap` path. But since Docker containers run in an isolated environment, we lose everything!!

This is a feature, but in this case represents a bug for us — let’s fix it.

To enable persistence so that we don’t lose that log file, we have to create a bind mount between our workstation (host) and the Docker container.

Let’s decide that our host bind mount directory is `/tmp/sqlmap`. This should be an empty directory created only for this purpose!

```bash
$ docker run -it -v \
   /tmp/sqlmap:/root/.sqlmap \
   paoloo/sqlmap \
   --url [http://localhost](http://localhost)
```

With the -v option we’ll create a bind mount. The first argument is the host path, and the second is the path on the container that we want to map.

And, in fact, everything has been saved — including our reports.

### Situation 3

> You’re on your Windows PC, and you immediately need an NGINX server that serves your static files from a directory.

As you may have noticed, the first time you run docker run, it downloads the images from [the Docker Hub](https://hub.docker.com).

This could be hundreds of hundreds gigabytes. This is because we downloaded the tag latest of the image (the default).

But most images have also an ‘alpine’ version of the same image. It uses Linux Alpine OS. This is an optimized version of Linux, which occupies about 130MB.

Let’s use it in this situation. We know that image name upfront is `nginx` (since it is an official image).

So the final image name will be `nginx:alpine`. If you want a specific version (such as 1.14), use `nginx:1.14-alpine`.

You may have more questions. How do we know which directory the NGINX container uses to serve our files? How do we know which port it exposes?

Luckily, the answers to all your questions are in [the Docker Hub](https://hub.docker.com/_/nginx/).

So, to recap:

* We have to share our directory to serve into the container. Again, this can be done using bind mounts: `-v "$(pwd):/usr/share/nginx/html"`

* By adding :ro at the end, we are sure that container uses our files in read-only mode.

* We must bind the port exposed by the container to the host, and then communicate via TCP on our host: -p 80:80

```bash
$ docker run \
   -v $(pwd):/usr/share/nginx/html:ro \
   -p 80:80 \
   nginx:alpine
```

### Situation 4

> No matter which platform, you have to start your Node.js 10 project. But you don’t have Node.js installed on your platform.

Perhaps you now understand how it works. Here, we have to share our content and bind ports.

However, we don’t know the container working directory. Instead, we’re gonna explicitly set it with the -w flag to a custom directory of our choice. For example, you might choose/src — just don’t override an existing directory!

```
$ docker run \
   -p 3000:3000 \
   -v $(pwd):/src \
   -w /src \
   node:10-alpine \
   node main.js
```

Simple and powerful enough?

Additionally, do you want a ‘shortcut’ to just execute binaries without searching for third-party images?

Why don’t you try [my simple tool DR](https://github.com/kopiro/dr)?

I hope that you’re gonna use Docker for all your future binaries! :)



---

© 2025 [Flavio De Stefano](https://www.kopiro.me) - [0xEDE51005D982268E](https://www.kopiro.me/gpg.txt)
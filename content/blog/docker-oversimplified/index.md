---
title: Docker Oversimplified
date: 2020-12-11T16:58:49+0700
description: "Overly simple explanations of docker concepts"
tags:
    - docker
---

Imagine we're building an app, (for example) using laravel php framework. Like most of the framework to build apps, laravel has some [requirements](https://laravel.com/docs/8.x#installation).

If you want to develop apps with laravel, you (or your team) have setup specific version of php with some extensions enabled, a web server, a database system, etc.

When it comes the time to deploy your application to production, you have to setup the each one of the requirements again on your production server, and then you can deploy your app to the server. In other word, the application and the required environment are separated.

The difference when using docker is, it let us deploy our app along with its required environment to run together. The app, web server, database, etc can be bundled together.

We can let docker know how our app (along with its required environment) should be bundled, via series of instructions we write to a file, usually called [Dockerfile](https://docs.docker.com/engine/reference/builder/). For example, the instructions to install packages, prepare some pre-made config files, or run any needed commands.

Then we tell docker using those instructions to build our app (along with its required environment) as a bundle. The resulting bundle is what we call `docker image`. This image is what we can deploy. Because the image already contains required environment for the app to run, we don't need to setup the environment and deploy our app in separate steps.

After we deploy our `docker image`, we can then "run" it using the [docker engine](https://docs.docker.com/get-started/overview/#docker-engine) installed on production server. When we run our images, docker will create special executable that "contains" our image, called [container](https://www.docker.com/resources/what-container). Each container is isolated from one or another, but docker provides a way to communiate between them. Docker image can be "run" multiple times at the same time, and docker will create multiple containers for the image.

While we can ship our app along with all of its dependencies in one big image that manage everything, we can also leverage multiple docker images for "running one app".

The idea is to keep each image focused on one service. For example, we can have one image containing our app, another image for database, another image for cache driver, etc. Then we can connect them together using [networking](https://docs.docker.com/network/) provided by docker.

Another thing to note is, since each container is isolated, it cannot access filesystem on host machine directly (without being told so). Each container has its own isolated "filesystem". The content of the filesystem is "discarded" each time we restart the container.

So, if our app need to persist some data, for example to store data for database, we need to tell docker how we would like to [connect the host filesystem to the containers](https://docs.docker.com/storage/).

## .

If you reach here, you can safely assume that you have learned the basic concepts of using docker. My hope is that after this, at least you can navigate its [official docs](https://docs.docker.com/) with less confusion.

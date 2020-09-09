---
title: SysV Init - SystemD
date: 2019-10-14 21:06:05
description: Simple comparison between sysv init and systmd.
tags:
---

As of writing this article, I'm using Ubuntu 16.04 and there are two installed service manager that runs in coexistence.

## SysV Init

We can say that we're using SysV Init if we use these commands:

```
sudo service apache2 start

# or

sudo /etc/init.d/apache2 start
```

## SystemD

Meanwhile, SystemD use this command to manage service:

```
sudo systemctl start apache2.service
```


## Long story short...

SystemD came after SysV Init as some sort of replacement. But it still maintain compatibility for the old SysV Init.

However, only one service manager is active at one time. In this particular case (Ubuntu 16.04), it is SystemD.

So, this allows us to run SysV Init command although we use SystemD.

## Resources & Further Reading

[Difference between systemctl init.d and service](https://askubuntu.com/a/911543)

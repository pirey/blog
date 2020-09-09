---
title: chmod permissions made easy
date: 2016-08-24 14:04:07
description: A simple chmod cheatsheet
tags:
    - shell
---

You are doing some chmod now and then, and get lost..frequently. Then you're definitely need to look at this. `r` = 4 `w` = 2 `x` = 1 `-` = 0   Example:

- `rwx r-- r-- (4+2+1) (4+0+0) (4+0+0) = 744`
- `rw- r-x r-x (4+2+0) (4+0+1) (4+0+1) = 655`
- the list goes on..

  There you have it.

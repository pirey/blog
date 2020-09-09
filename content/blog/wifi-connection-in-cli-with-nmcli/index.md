---
title: Wifi connection in cli with nmcli
date: 2019-06-30 18:15:14
description: An nmcli cheatsheet
tags:
    - linux
---

## Turn on wifi

### Check whether the wifi is enabled

```sh
nmcli radio wifi
```

### Enable wifi

```sh
nmcli radio wifi on
```

## View available wifi SSID

```sh
nmcli dev wifi
```

## New connection

```sh
nmcli dev wifi connect <connection name> password <password>
```

## Connect to previously saved connection

### Check previously saved connection

```sh
nmcli connection show
```

### Connect to saved connection

```sh
nmcli connection up <connection name>
```

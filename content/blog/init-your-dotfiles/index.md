---
title: Init your dotfiles
date: 2019-06-23 20:19:21
description: Here you will learn how to init your dotfiles.
tags:
---

The point of [dotfiles](https://dotfiles.github.io/) repository is basically to store configuration of any program that we use.

For example, if we're using vim, the configuration is just a plain text, usually called `.vimrc`. Notice the dot `.` in the filename. The dot prefix is so common for configuration files that there are so many application store its configuration using the same semantic.

We can regularly backup our configs and place it somewhere safe, but we can take advantage of git to manage our configs. I personally hosted [my dotfiles](https://github.com/pirey/dotfiles) on github. The reason is that its easy for me if I want to switch computer, I'll just fetch my configs and ready to go. Another benefit of using git is that we can keep track of what we're doing along the way.

However, there are some problem if we want to immediately store our configs in git repo.

First, the config files is usually placed in `$HOME` directory. But its not a good idea to init our git directly in `$HOME` directory. Because that is usually we place our other files or documents, like photos, videos, or other big sized files that is unappropriate since we are only interested in storing config files.

We can easily resolve it by initializing our git repo in new directory and put our config files inside it. We can place the dotfiles directory anywhere we want.

But since dotfiles are meant to be placed in specific directory (usually under `$HOME` directory), we need a way to somehow place them in their respective place.

For example, if we're managing our `.vimrc` file, we can manually copy and paste it from our dotfiles directory to `$HOME` directory EVERYTIME we make a change. Now this is not only tiresome, its also error prone. Now if we're doing it like this and we're managing a lot of dotfiles, it will not be good for our health.

One simple way to handle this is by creating symlinks of our dotfiles into their respective place.

```sh
ln -sf /path/to/our/dotfiles/.vimrc $HOME/.vimrc
```

With symlinks, we don't have to manually copy our files everytime we make a changes, instead we can work on original files inside our dotfiles repo and the change is automatically reflected in the symlinked files.

We have solved our problem but don't worry, we still have another one. The location of config files doesn't always reside under `$HOME`, it can be scattered across multiple places depending on the application that we use. For example if you're using `i3`, the config is placed inside `$HOME/.config/i3/config`. So if we're creating each symlink manually, it would be more or less the same as copying each file one by one.

Luckily we can write a script for that.

For example we can create a new file called `setup.sh`

```sh
#!/bin/sh

ln -sf /path/to/dotfiles/.tmux.conf                $HOME/.tmux.conf
ln -sf /path/to/dotfiles/.agignore                 $HOME/.agignore
ln -sf /path/to/dotfiles/.ctags                    $HOME/.ctags
ln -sf /path/to/dotfiles/.gitconfig                $HOME/.gitconfig

ln -sf /path/to/dotfiles/.editorconfig             $HOME/.editorconfig
ln -sf /path/to/dotfiles/.npmrc                    $HOME/.npmrc
ln -sf /path/to/dotfiles/.prettierrc               $HOME/.prettierrc

ln -sf /path/to/dotfiles/.aliases                  $HOME/.aliases
ln -sf /path/to/dotfiles/.zshrc                    $HOME/.zshrc

ln -sf /path/to/dotfiles/.config/i3/config         $HOME/.config/i3/config
ln -sf /path/to/dotfiles/.config/i3status/config   $HOME/.config/i3status/config
ln -sf /path/to/dotfiles/.config/volumeicon/config $HOME/.config/volumeicon/config
ln -sf /path/to/dotfiles/.config/rofi/config       $HOME/.config/rofi/config
```

We only need to run the scripts once when we clone our repo. Or whenever we like, that doesn't make any difference anyway. Like this:

```sh
./setup.sh
```

With this setup, at least our config files become more manageable.


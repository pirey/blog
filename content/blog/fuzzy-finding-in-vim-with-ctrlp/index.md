---
title: "Vim pro tips: fuzzy finding with CtrlP"
date: 2016-08-24 23:50:40
description: "Here you will learn to easily find files in project directory using vim using CtrlP"
tags:
    - vim
---

Update
------

I'm now using fzf for fuzzy finding and no longer using CtrlP, but it was (and still) a great plugin to get started.

Intro
-----

Sublime Text (or other editor) has a fuzzy finder feature that let us search for files within our project directory.

Imagine if we want to open specific file but we don't know where it is located, or if we know where the file located but it is buried too deep inside folder directory (for example `app/very/long/namespace/controller/domestic.controller.js`), it may be hard to find it.

That's why this is a really powerful feature. And since we love vim (aren't we?), we want this feature in our favorite editor too. Vim doesn't have this feature out of the box, but don't worry because there's a plugin for that. Actually, [there's already vim plugin for (almost) every feature we need](http://vimawesome.com). For this task, there's several option we can choose, and I personally have used [Ctrl-P](https://github.com/ctrlpvim/ctrlp.vim) for almost a year. It's simple and straightforward.

Installation
------------

Installation guide can be found on its [documentation](https://github.com/ctrlpvim/ctrlp.vim).

Configuration
-------------

By default, whenever we invoke Ctrl-P, it scans our project directory, entirely. It works fine when our directory is relatively small. But when we work with large codebase with over thousands of files, we're most likely will find it quiet annoying. One way to workaround this problem is to utilize its caching mechanism. According to one of it's plugin configuration option, it turns out that cache is already enabled by default, but it's cleared every time we exit vim. We can keep the cache with this option; add this to vimrc

`let g:ctrlp_clear_cache_on_exit = 0`

Note that this automatically make our directory out of sync with Ctrl-P. So if we have new files, or rename any existing file, it will not appear immediately in Ctrl-P. To refresh or rescan our directory, we can use <F5> inside Ctrl-P window. This is a way much better behavior than rescan  entire codebase every time we enter vim. Also, Ctrl-P by default ignores all hidden files, e.g filename begin with dot: .gitignore, .jshint, .htaccess, etc. To show hidden files, we can add this to our .vimrc

`let g:ctrlp_show_hidden = 1`

Usage
-----

To open Ctrl-P window we use, well, `ctrl-p`. A new window will appear at the bottom, and there are by default three modes visible, and these are what we'll use frequently. Use `ctrl-f` and `ctrl-b` to cycle between modes.

- `files` search for all files within project directory
- `buffer` search for files that's already open in buffer.
- `mru` search for most recently used files.

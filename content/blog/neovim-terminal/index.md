---
title: Neovim terminal
date: 2020-12-28T10:45:12+0700
description: My custom setup for using built-in neovim terminal
tags:
    - neovim
---

Previously I've been using neovim alongside tmux for spinning up quick terminal session. But when I open new tmux pane or window, the layout of my screen is changed and it is kinda break my state of focus when writing code. I find it more pleasant to open terminal inside neovim directly as it doesn't change my current focus. I feel that I don't loose control of the things I'm working on.

The basic command to open built-in terminal is `:terminal`, but it just open it on current buffer, which drags my attention away from the code I'm working, which is a no.

I want to open new terminal in a new split. I tried to mimic the behavior of vscode built-in terminal, that is to open new terminal at the bottom of the screen.

Basically I need to open new split, at the bottom of the screen, and call the terminal command. I also choose to create new command to do the thing.

```vim
command! Term :bot sp | term
```

I can also make new mapping for quicker action, but thinking about which key to use to trigger the thing is kinda time consuming and I don't wanna think too much about it right now, so I'll just use the command for a while.

Also, when opening a new terminal, the default mode is `normal` mode, but when I open a terminal usually I want to just run a one time command, e.g. I need to run a test, or starting dev server, etc.

So I create new autocommand to automatically start insert mode when I open new terminal.

```vim
autocmd TermOpen term://* startinsert
```

The last thing I want to mention is, to scroll output of the terminal, I need to enter the `normal` mode of the terminal, the default keymap is `<c-\><c-n>` which is definitely awkward, so I came up with more sane adjustment.

```vim
tnoremap <Esc> <C-\><C-n>
```
But because I also use fzf, I don't want to remap the escape key when I'm opening fzf buffer. So I tweak it a little bit.

```vim
tnoremap <expr> <Esc> &ft == 'fzf' ? '<Esc>' : '<C-\><C-n>'
```

Now I can move around pretty easily.

Nice.

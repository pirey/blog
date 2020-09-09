---
title: 'Vim pro tips: move like a ninja!'
date: 2017-11-21 18:13:43
description: Jump, jump, jump, jumpy jumpy cursor!
tags:
    - vim
---

"Smooth" Scrolling
------------------

Vim default scrolling behaviour is terrible. `<c-f>` to scroll one page down, `<c-b>` to scroll one page down, these feature is just not right. I get lost easily. It makes me dizzy. It also has another pair of commands, `<c-d>` and `<c-u>` to scroll up and down half page, but is no better than the previous.

![badmove.gif](https://yeripratama.files.wordpress.com/2017/11/badmove.gif)

wtf. So I made my own version of _smooth scrolling._ I came out with these pairs of mapping `nnoremap J 10gj` `nnoremap K 10gk` `vnoremap J 10gj` `vnoremap K 10gk`

![muchbetter.gif](https://yeripratama.files.wordpress.com/2017/11/muchbetter.gif)

Much better.

Horizontal jump
---------------

We use `w` or `e` and `b` to leap one word. Why don't we give it a boost? `nnoremap E 20l` `nnoremap B 20h` `vnoremap E 20l` `vnoremap B 20h` Now watch, I can jump around like a ninja!

![horizontal.gif](https://yeripratama.files.wordpress.com/2017/11/horizontal.gif)

How cool is that?

Crazy fast window movement
--------------------------

This is a classic tips but extremely useful, you'll love it soon or later. `nnoremap <C-h> <C-w>h` `nnoremap <C-j> <C-w>j` `nnoremap <C-k> <C-w>k` `nnoremap <C-l> <C-w>l`

![windo.gif](https://yeripratama.files.wordpress.com/2017/11/windo.gif)

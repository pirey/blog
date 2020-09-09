---
title: 'Clearing confusion: Prettier vs Linters'
url: 340.html
date: 2018-12-05 16:25:19
description: Simple comparison between prettier and linters
tags:
    - javascript
---

[Prettier](https://prettier.io) is like a set of rules for linter (e.g. [eslint](https://github.com/eslint/eslint) or [tslint](https://github.com/palantir/tslint)), but instead of being a ["shareable config"](https://eslint.org/docs/developer-guide/shareable-configs), it is a separate tool and can be used independently without linter. It have similar features with linters, it checks your source code, and automatically "fix" any formatting problems. That being said, prettier can also being used alongside linter. In fact, prettier also put a guide on how to integrate it with eslint in their [docs](https://prettier.io/docs/en/eslint.html).

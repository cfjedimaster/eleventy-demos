---
layout: post
title: "HTML Escaper Visual Studio Code Extension"
date: "2016-02-10"
categories: [development]
tags: []
banner_image: 
permalink: /2016/02/10/html-escaper-visual-studio-code-extension
---

Just a quick note to say I've released a new extension for [Visual Studio Code](http://code.visualstudio.com). This extension simply takes a document and outputs an escaped version of it appropriate for blog posts
or other online forums. This is basically the same thing I built for Brackets, but it wasn't possible for
Visual Studio Code until the release this month. Here's an example of how it looks.

![Example](https://static.raymondcamden.com/images/2016/02/vsc_preview.gif)

The code I used was based on a simple example made by Erich Gamma of Microsoft. Shoot, 90% of the code is his and I just modified the bare minimum to create my extension. You can find my code here ([https://github.com/cfjedimaster/htmlescape-vscode](https://github.com/cfjedimaster/htmlescape-vscode) and you can install it directly within Visual Studio Code itself. You can also download the packaged version
from the [gallery](https://marketplace.visualstudio.com/items?itemName=raymondcamden.htmlescape-vscode-extension) as well.
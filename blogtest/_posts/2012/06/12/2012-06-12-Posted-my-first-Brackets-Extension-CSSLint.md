---
layout: post
title: "Posted my first Brackets Extension - CSSLint"
date: "2012-06-12T14:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2012/06/12/Posted-my-first-Brackets-Extension-CSSLint
guid: 4648
---

This weekend I worked on my first extension for <a href="https://github.com/adobe/brackets">Brackets</a> - <a href="https://github.com/cfjedimaster/brackets-csslint">CSSLint</a>. The experience was pretty interesting. Much like writing extensions for ColdFusion Builder, your time is split between creating the UI/extension connection points and the actual logic of the extension itself. In this case, since it was my first extension, I'd say 95% of was on the "Extension" aspect and the rest on running CSSLint. Which is to be expected I think. The  <a href="http://csslint.net/">CSSLint</a> tool is trivial to implement in code. In fact, once I got the current document in Brackets I just had to do this: 

results = CSSLint.verify(text);

Here's a quick screen shot of the results. If you are curious - it was run on a file from jQuery UI.

<img src="https://static.raymondcamden.com/images/ScreenClip96.png" />

Here's a shot showing a complete view of Brackets and my extension running:

<img src="https://static.raymondcamden.com/images/ScreenClip97.png" />

If you are playing around with Brackets, you can <a href="https://github.com/cfjedimaster/brackets-csslint">download</a> the extension and give it a shot. Let me know what you think.
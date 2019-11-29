---
layout: post
title: "Run Visual Studio Code Insiders from WSL"
date: "2017-09-19T20:19:00-07:00"
categories: [development]
tags: [visual studio code]
banner_image: 
permalink: /2017/09/19/run-visual-studio-code-insiders-from-wsl
---

A quick tip that is 100% thanks to the [Visual Studio Code twitter](https://twitter.com/code) account. For a while now I've been able to run Visual Studio Code from WSL (Windows Subsystem for Linux) by simply doing `code .` in the directory I'm working in. However, a few months ago I switched to the [Insiders](https://code.visualstudio.com/insiders) build. I was hesitant to do so as it seemed like it would be risky, but after one of Microsoft's engineers assured me it was safe I gave it a try.

I think in the last few months I've seen one case where a bug was introduced that forced me back to the "regular" Code for a few days. Outside of that I've enjoyed getting the new features earlier and it is now my primary editor. (And to be clear, you can absolutely have *both* installed, and running, at the same time.)

However, I noticed recently I wasn't able to run the Insiders editor from within WSL. I could still run `code`, but nothing worked for the Insiders build. After asking about this on Twitter, I got this:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">You probably need to add the \bin path to your .bash_rc or PATH</p>&mdash; Visual Studio Code (@code) <a href="https://twitter.com/code/status/910264600385396736">September 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


Duh. I did a quick `echo $PATH` and saw that Code's path was available, but not Insiders. I hadn't even noticed it, but WSL automatically includes your Windows PATH setting into the Bash shell, so to fix this, I simply added it there. Another nice surprise (one I found a few months ago), is that Windows made editing your path a heck of a lot easier.

![Screen shot](https://static.raymondcamden.com/images/2017/9/vsci3.jpg)

So - I added it - fired up a new Ubuntu shell - and bam, I could run `code-insiders .` and it worked right away. Note that if you do this under a Ubuntu directory, Insiders won't be able to view the files. But if you open it open `/mnt/c` (or lower) then Insiders correctly loads the proper Windows directory. I'll probably also make an alias so I can type fewer characters. I have a confession to make though. As much as I love using WSL I'm still very much new to Bash stuff.
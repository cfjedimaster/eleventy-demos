---
layout: post
title: "Lamest command line tool ever"
date: "2006-12-14T10:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/12/14/Lamest-command-line-tool-ever
guid: 1712
---

Today I needed to add Subversion as a Windows service. The docs pointed me to the "sc" tool. This seemed like a simple tool but for the life of me I couldn't get it to work. Every time I ran the tool I would get a help message back. Here is an example of what I was trying to run:

<code>
sc create svnserve binpath="c:\svnserve\svnserve.exe --service 
--root c:\repos" displayname="Subversion" depend=tcpip start=auto
</code>

I noticed something odd in the help message though: 

<blockquote>
The option name includes the equal sign.
</blockquote>

I looked again at the web site instructions and noticed that after every option there was a space. I was convinced that was just a typo, or formatting used to wrap nicely in a browser. However, on a whim I tried it:

<code>
sc create svnserve binpath= "c:\svnserve\svnserve.exe --service 
--root c:\repos" displayname= "Subversion" depend= tcpip start= auto
</code>

Guess what? It worked. For some reason the person who created sc.exe decided to make the syntax: opt1= val1. I was just crazy thinking that this syntax would be fine: opt1=val1.

Seriously - can someone tell me why this syntax would be used? Would it have been so hard to support a simple opt1=val1 type syntax like, oh, most other command line tools?
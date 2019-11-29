---
layout: post
title: "Check out varScoper"
date: "2008-04-21T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/21/Check-out-varScoper
guid: 2779
---

One of the things you've probably heard me say about a thousand times is to be sure to properly var scope your CFC methods and UDFs. It's one of those 'rules' that us bloggers like to repeat so many times it sounds like a mantra. (I'm waiting for the Var Scope YouTube song to launch.) At my current job (working with Sean as a contractor at <a href="http://broadchoice.com/">Broadchoice</a>) I've been lucky to be exposed to some cool tools that I've never worked with much before, like ColdSpring and Transfer. Another tool I've recently played with is <a href="http://varscoper.riaforge.org">varScoper</a>. This tool will scan a directory of files and look for un-var-scoped variables. Imagine my surprise when it discovered more than one missing var statement in my own code. Not that I'm perfect of course, but I was really impressed with how quickly the tool dug up the issues. It creates a nice HTML based report (it has other formats as well) that is easy to work with. (See screen shot <a href="http://varscoper.riaforge.org/screenshots/varscoperScreen1.gif">here</a>.)

It did report two false positives. One was a variable that was in the arguments scope, but I forgot to scope it. To me that's a good false positive as I try to always use "arguments." in front of each argument. The other one was an issue with cffeed. I've reported it to the author and I'm sure it will get fixed soon.

I really want to recommend this to folks. As I said - no one is perfect, and with a tool like this, there is no reason not to check your code daily to ensure you don't make any mistakes.
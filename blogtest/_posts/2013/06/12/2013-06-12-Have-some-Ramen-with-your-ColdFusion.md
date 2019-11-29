---
layout: post
title: "Have some Ramen with your ColdFusion"
date: "2013-06-12T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/06/12/Have-some-Ramen-with-your-ColdFusion
guid: 4958
---

This morning (which now seems like a <i>real</i>long time ago), I tweeted about how spoiled I am with npm and package management in general. If you've never experienced this, let me give you a real quick, rough idea of what this means as a developer.
<!--more-->
I needed to add email support to a Node.js project I'm building (javascriptcookbook.com - almost done - honest!). Once I found the name of the package I needed, I modified my package.json file. The package.json file, for Node apps, is like a metadata file for your application. Here is how it looked before I changed it:

<script src="https://gist.github.com/cfjedimaster/5769355.js"></script>

To add my email package, I added one line.

<script src="https://gist.github.com/cfjedimaster/5769364.js"></script>

In Terminal, I typed npm install, hit enter, and that was it. The npm command line took care of grabbing "nodemailer" and seeing what <i>it</i> needed. It then grabbed those resources. And oh yeah, if that crap needed something it got that too. All while ensuring it didn't re-download anything it didn't need to.

Yeah, I <i>really</i> freaking dig that. As I said in the beginning, I'm getting spoiled by it. After tweeting about it though a few friends replied and mentioned the Ramen project by Adam Tuttle: <a href="https://github.com/CFCommunity/ramen">https://github.com/CFCommunity/ramen</a>

While not the <i>exact</i> same, it is pretty cool to see something like this being built for ColdFusion developers. You can see it in action below.


<iframe src="http://player.vimeo.com/video/45369854" width="500" height="313" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe> <p><a href="http://vimeo.com/45369854">Ramen: An Integrated Installer for ColdFusion 8+</a> from <a href="http://vimeo.com/fusiongrokker">Adam Tuttle</a> on <a href="http://vimeo.com">Vimeo</a>.</p>
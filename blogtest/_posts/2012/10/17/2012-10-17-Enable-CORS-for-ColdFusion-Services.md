---
layout: post
title: "Enable CORS for ColdFusion Services"
date: "2012-10-17T12:10:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2012/10/17/Enable-CORS-for-ColdFusion-Services
guid: 4760
---

Just a quick tip. CORS is a way to allow remote JavaScript clients to use your fancy APIs. Only the best APIs support it now, but usage is growing. For a good introduction to the topic, see Brian Rinaldi's excellent blog post here: <a href="http://www.remotesynthesis.com/post.cfm/getting-html5-ready-cors">Getting HTML5 Ready - CORS</a>. Enabling CORS may be done at the web server level, but if you don't have access to that, or if you want to specifically provide access to one particular CFC file (or method), here is how you can do it.
<!--more-->
<script src="https://gist.github.com/3906295.js?file=gistfile1.cfm"></script>

I've got a CFC with 2 simple methods. Don't worry about what they do - they are just samples. To allow for CORS, you can add one simple header to your code. Unfortunately, you can't do cfheader in script-based CFCs. Therefore I made a new file, head.cfm, with one line:

<script src="https://gist.github.com/3906304.js?file=gistfile1.cfm"></script>

Obviously if you use tag-based CFCs this won't be a problem. Also note you can move that include (or the tag) into a method to enable CORS only for some methods and not others. 

Hope this helps!
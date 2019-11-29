---
layout: post
title: "Nifty little trick with fileRead and ColdFusion 10"
date: "2012-05-21T07:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/05/21/Nifty-little-trick-with-fileRead-and-ColdFusion-10
guid: 4623
---

ColdFusion 10 adds a nifty little feature to the VFS (Virtual File System) - support for FTP, HTTP, and ZIP. This means you can treat remote resources and zip files as if they were simple file systems. The docs don't go into great detail on this (and instead ask you to read the <a href="http://commons.apache.org/vfs/filesystems.html">Apache Commons</a> docs instead</a>), but I discovered a simple, but really nice, good example of this.

<script src="https://gist.github.com/2761798.js?file=gistfile1.cfm"></script>

Because fileRead supports http, if you want to quickly grab the contents of a URL, you can use it as I've done above. All it does is save you one line of code (compared to the normal cfhttp call followed by a set to grab the file contents), but it's handy!
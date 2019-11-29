---
layout: post
title: "Syncing Brackets extensions across multiple machines"
date: "2014-11-04T11:11:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/11/04/Syncing-Brackets-extensions-across-multiple-machines
guid: 5342
---

<p>
This really isn't a new tip, but as someone just asked on Twitter for a quick explanation, I thought I'd write it up. If you want to sync Brackets extensions across multiple machines, the easiest way to do it is with Dropbox, or a Dropbox-like service. As long as it creates a physical folder on your machine, you can simply store your extensions there (for me it is /Users/ray/Dropbox/BracketsExtensions) and then create a symlink between that folder and the folder Brackets uses for extensions. What folder is that?
</p>
<!--more-->
<p>
In the Bracket's Help menu, simply click "Show Extensions Folder."
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-11-04 at 10.43.14 AM.png" />
</p>

<p>
Make a note of that path, drop into Terminal, or CMD (and yes, <a href="http://lifehacker.com/5496652/how-to-use-symlinks-in-windows">Windows can do symlinks</a>), and make the connection.
</p>
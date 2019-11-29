---
layout: post
title: "Subclipse and Unable to load default SVN client"
date: "2008-09-05T11:09:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/09/05/Subclipse-and-Unable-to-load-default-SVN-client
guid: 3000
---

I recently had to reinstall Eclipse (for the 10th time) and I ran into a problem when trying to open a repository with Subclipse. Every time I went to open a repo, I got:

<blockquote>
<p>
Unable to load default SVN client
</p>
</blockquote>

This didn't make sense to me. I knew I had SVN installed (I used it at the command line a few minutes before). A quick Google search turned up this <a href="http://svn.haxx.se/subusers/archive-2008-07/0368.shtml">this thread</a> where I found the issue was simply that Subclipse was now wanting SVN 1.5, not SVN 1.4 (the default in OSX). For a quick way to grab SVN for 1.5, go <a href="http://www.collab.net/downloads/community/">here</a>. I'm not sure what I did wrong in my Subclipse install for it to require 1.5, maybe it was the mix of Eclipse 3.4 as well, but either way, this is the solution if you run into the same problem.

p.s. I've twitted, ranted, etc, a lot lately about Eclipse. I don't know why, but for a month or so now Eclipse has been so flakey I've almost been tempted to switch to Dreamweaver. Shoot, I've almost been tempted to run my Windows VM just to get HomeSite+. I'd like to blame my troubles on the new plugins I've added for Groovy/JBoss development, but things were flakey before that as well. My new plan of attack though is to have one Eclipse 3.4 install just for work, and just with the Groovy/Java/Flex plugins, and a 100% separate Eclipse 3.3 install with CFEclipse/Adobe CFML Plugins.
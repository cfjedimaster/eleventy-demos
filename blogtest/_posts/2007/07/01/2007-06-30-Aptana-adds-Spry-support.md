---
layout: post
title: "Aptana adds Spry support"
date: "2007-07-01T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/07/01/Aptana-adds-Spry-support
guid: 2162
---

I've blogged about Aptana's <a href="http://www.aptana.com/air/">AIR</a> support a few days ago. They have updated it recently to now include Spry support, which is pretty cool. There are some oddities with the support however. Any project using Spry will have a file named spry_sample.html added to it. This file doesn't serve any purpose and looks like an accident. Also - the <i>entire</i> Spry zip is included, not just the core CSS/JavaScript files. This include demos and samples. This will dramatically increase the size of your final AIR file, although you can deselect them all before you do a build. I'm going to see if I can file a bug report on this. 

Not really related to AIR or Spry, Aptana also added support to view your pages as the iPhone would view it. More information may be found <a href="http://www.aptana.com/iphone/">here</a>. I'm curious how well this works. Would someone mind sending me an iPhone to compare? Please? Thanks. (Ok, I had to try.)
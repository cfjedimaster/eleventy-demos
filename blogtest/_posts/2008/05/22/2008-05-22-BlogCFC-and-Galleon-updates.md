---
layout: post
title: "BlogCFC and Galleon updates"
date: "2008-05-22T23:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/22/BlogCFC-and-Galleon-updates
guid: 2840
---

I had decided to not work anymore on BlogCFC 5, but with 6 being delayed so long, I gave some love to the 5.X code base tonight. <a href="http://blogcfc.riaforge.org">BlogCFC</a> 5.9.003 was released tonight. Nothing major was changed, but I did switch to <a href="http://coldfish.riaforge.org">ColdFish</a>, the code syntax highlighter written by Jason Delmore. This replaces the ancient code I had in there before. 

Also released was an update to <a href="http://galleon.riaforge.org">Galleon</a>. This release fixes an issue related to the past security changes as well as a case sensitivity issue. (Sorry, but you will never convince me case sensitive file systems make sense. Who in the heck wants a file named foo.txt and Foo.txt??)

I also want to point out an interesting article by Ike: <a href="http://ontap.riaforge.org/blog/index.cfm/2008/5/22/Galleon">Porting Galleon Forums</a>. He is porting Galleon to various frameworks and will be posting about the process.
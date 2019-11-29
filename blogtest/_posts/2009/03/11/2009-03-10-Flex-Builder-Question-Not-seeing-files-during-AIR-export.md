---
layout: post
title: "Flex Builder Question - Not seeing files during AIR export"
date: "2009-03-11T10:03:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2009/03/11/Flex-Builder-Question-Not-seeing-files-during-AIR-export
guid: 3271
---

I've got a weird Flex Builder question I hope my readers can help me with. I'm working with an open source Flex project (<a href="http://www.sharefirereader.com/">ShareFire</a>) and need to build the code myself. I created a new project in FB and then manually copied the files over from ShareFire's SVN drop.

When I did a debug build, I noticed that the non-code files (one SQL xml file and a CSS file) were not copied to bin-debug. Not thinking much of it, I just copied the files manually to bin-debug.

But this wasn't a real solution and it's now biting me on the rear. When I go to export a release build, the AIR File Contents screen refuses to list the other files:


<img src="https://static.raymondcamden.com/images//Picture 144.png">

I thought perhaps I had messed something up by manually dragging files into the project, yet when I made a new file from within FB (readme.txt), it wasn't noticed either.

Any ideas folks?

p.s. Sorry for the lack of posts this week. Been fighting the flu the last few days and the flu is winning.
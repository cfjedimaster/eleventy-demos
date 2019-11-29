---
layout: post
title: "Making Subclipse recognize a project checked out from Subversion"
date: "2009-09-03T17:09:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2009/09/03/Making-Subclipse-recognize-a-project-checked-out-from-Subversion
guid: 3512
---

When I typically work with Subclipse, I begin my project doing a checkout. Today I added Subclipse to install of ColdFusion Builder where one of the projects was already pointing to a working directory. I expected, perhaps foolishly, that Subclipse would recognize the .svn folder and just - um - do it's thing. No joy. I happened to guess upon a working solution though and thought I'd share with others. <b>Warning</b> - I have yet to actually commit or update - but I did confirm that I could compare against the latest in the repository.

1) Right click on your project. 

2) Select Team. 

3) Select Shared Project. 

This is the part I was most unsure of. I didn't want to share - the project was already shared. But Subclipse recognized that the project was already shared and noted that. I clicked the Finish button and then stood back.

Eclipse began to chew. And chew. Progress windows opened up and closed by themselves. After about 30 seconds or so the demonic possession seemed complete - but I still didn't have little funky graphics next to my files signifying their state. On a whim I tried a Refresh and that seemed to do the trick.

Hope this helps others.
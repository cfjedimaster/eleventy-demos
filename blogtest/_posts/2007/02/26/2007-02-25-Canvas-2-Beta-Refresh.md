---
layout: post
title: "Canvas 2 Beta Refresh"
date: "2007-02-26T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/26/Canvas-2-Beta-Refresh
guid: 1861
---

I've got a new version of the Canvas 2 Beta ready for testing. This update finally fixes the loginpath bug (thanks to a forum user for making it easy to reproduce) and adds security to file uploads. 

This is it. I'm only going to add one more thing before releasing this application and it is a big one. Like <a href="http://blogcfc.riaforge.org">BlogCFC</a>, Canvas is going to support multiple Wikis in one database. This will make it easier to use for folks who may have a limited amount of databases at an ISP.

To make things interesting - you will be able to set the name of the Wiki ("name" being a string label to use in the database) in the XML, <i>or</i> do it at runtime. Why is that important? Being able to set the value at runtime means I can run multiple, virtual Wikis on the fly. Hmm, what <a href="http://www.riaforge.org">site</a> could I add that too?

Lastly - a question. Canvas 2 changes the "language" used to markup pages. How critical is it that I ship a tool to update your old markup?

The bits are attached to this blog entry.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcanvas3%{% endraw %}2Ezip'>Download attached file.</a></p>
---
layout: post
title: "Update to CFLib Extension"
date: "2011-05-03T19:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/03/Update-to-CFLib-Extension
guid: 4218
---

Many moons ago I wrote a simple (and ugly) ColdFusion Builder extension that allows you to download and install UDFs from <a href="http://www.cflib.org">CFLib</a>. I rewrote it last night into a view for ColdFusion Builder 2. Here's a quick example:

<img src="https://static.raymondcamden.com/images/ScreenClip77.png" />

Selecting a category will then fetch all the UDFs...

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip78.png" />

And finally selecting a UDF allows you to cut and paste it:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip79.png" />


Awesome design work, right? I thank <a href="http://macwebdiva.wordpress.com/">Dee Sadler</a> for giving me some good CSS links. Although don't blame her for the color scheme. That's all me, baby. Note that you can load CFLib as a View from the "Views" menu in CFB2 <i>or</i> right click on a file to launch it. Because you can run the app in a view I decided against supporting "add to file". You can do that in extensions obviously (have been since version 1), but as a view I don't think it makes sense. While I removed one feature I did at least add search in. 

Anyway - you can download it now at the RIAForge URL: <a href="http://cflibextension.riaforge.org/">http://cflibextension.riaforge.org/</a>
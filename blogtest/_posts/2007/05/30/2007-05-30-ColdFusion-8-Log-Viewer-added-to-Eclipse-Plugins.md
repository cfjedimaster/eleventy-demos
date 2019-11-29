---
layout: post
title: "ColdFusion 8: Log Viewer added to Eclipse Plugins"
date: "2007-05-30T14:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/30/ColdFusion-8-Log-Viewer-added-to-Eclipse-Plugins
guid: 2075
---

When grabbing the new ColdFusion 8 server, don't forget to pick up the plugins for Eclipse. Adobe has had CFML plugins for Eclipse for a little while now (although you had to download Flex Builder 2 to get them). But this new version adds some new cool new tools. One of them is the Log Viewer.
<!--more-->
<a href="http://ray.camdenfamily.com/images/logviewer.png"><img src="http://ray.camdenfamily.com/images/logviewersmall.jpg" alt="Click for Larger Shot" title="Click for Larger Shot"></a>

Mike Nimer created the log viewer a few years back. I'm not sure if Adobe picked up his code or started fresh, but this tool is now bundled in with the rest of the plugins. 

In case you don't know what it does - let me describe it. First you specify a folder to monitor. Typically you will want to monitor your ColdFusion logs folder. Eclipse will list all the log files in the folder. When you select a file, you will see the last few lines displayed. 

What's nice though is that as the log file changes, the display is automatically updated. So if you are using cflog for debugging, you can use Eclipse to visually monitor the file. (For Unix guys, you may recognize this as the Tail command.)
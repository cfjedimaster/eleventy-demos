---
layout: post
title: "Clearing your SnipEx Cache - and CFLib SnipEx Update"
date: "2007-07-16T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/07/16/Clearing-your-SnipEx-Cache-and-CFLib-SnipEx-Update
guid: 2196
---

While working on some bugs in the CFLib SnipEx server, Mark Drew sent me a great tip on how to clear the cache in CFEclipse. Right now it is a manual process, but Mark will be adding a refresh option to the UI soon. So to clear your SnipEx cache, drop down to the command line and....

<ol>
<li>Change to your Eclipse workspace. Mine was at /Users/ray/Documents/workspace
<li>Change to .metadata/.plugins/org.cfeclipse.cfml/snipex
<li>Delete all XML files
<li>Restart Eclipse
</ol>

That's it. During development it makes sense to just keep a window open there so you can do this a bit more quicker. (By development I mean if you are working on your own SnipEx server.)

So CFLib has had some issues with SnipEx, mainly with UDFs that don't work well in the XML feed. I've been removing the UDFs temporarily and this morning I just removed another another one. If you have trouble loading a library, please clear your cache first, then try again, and let me know.

p.s. Now that I've got a nice XML version of CFLib, my next "for fun" project will be an AIR client for CFLib!
---
layout: post
title: "Working with Adobe AIR and Dreamweaver CS 5.5"
date: "2011-06-26T20:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/06/26/Working-with-Adobe-AIR-and-Dreamweaver-CS-55
guid: 4284
---

I decided today to give up on Aptana for writing HTML Adobe AIR applications. With the latest version of Aptana not supporting it, and with me recently discovering how good Dreamweaver CS5.5 is for JavaScript development, I figured I'd take a look at what it's like. It isn't quite as powerful as what I saw in Aptana 2, but it's not bad. Here's the process with some screen shots to make it a bit clearer.
<!--more-->
First - you need to add support for Adobe AIR via a plugin. The plugin can be downloaded here: <a href="http://www.adobe.com/products/air/tools/javascript/">Tools for AIR and JavaScript</a> The download is a "mxp" file which is the standard for DW plugins. On my system running the file automatically loaded the plugin manager and from that moment on I just had to click a few times to get it installed. Be sure to restart Dreamweaver.

Now here is where I got confused. I was certain AIR would be an option under the New menu. Nope. Instead, AIR is a per site setting. Thanks to the Adobe docs (<a href="http://help.adobe.com/en_US/AIR/1.5/devappshtml/WS5b3ccc516d4fbf351e63e3d118666ade46-7f7f.html">Create your first HTML-based AIR application with Dreamweaver</a> - note that that link is for AIR 1.5 - there is probably a link for the newer version but I don't think the actual process in DW has changed). So basically -  you would make a new site and then simply configure the AIR settings.

<img src="https://static.raymondcamden.com/images/ScreenClip127.png" />

Note that the settings menu is also where you generate the AIR file to ship. If you want to run the AIR file while testing, you use the Preview/Debug in Browser icon: 

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip128.png" />

By the way, the ugly red circle is my awesome attempt at making it clear what icon I meant. 

So in general - that's it. One big thing that Aptana does much better is the inclusion of the AIRAliases.js file. I had to manually copy that from the AIR SDK folder. Once I did and included it within my HTML template DW did a darn good job with autocomplete and hinting. I was also very surprised to see that DW supported displaying air.trace statements. It shows up in a panel called "Site Reports" which seems oddly named. Here's an example where I traced the word "ran":

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip129.png" />

All in all, not so bad. I wish the test operation was one click instead of two. I can see that getting a bit annoying as you work. I also wish there was an easier way to 'install' JavaScript files like the aliases file or even jQuery. Any other DW users out there doing HTML AIR development?
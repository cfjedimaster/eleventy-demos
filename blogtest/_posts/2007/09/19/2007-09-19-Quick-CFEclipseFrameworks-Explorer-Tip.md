---
layout: post
title: "Quick CFEclipse/Frameworks Explorer Tip"
date: "2007-09-19T17:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/09/19/Quick-CFEclipseFrameworks-Explorer-Tip
guid: 2357
---

I'm working on a rather large Model-Glue site. The main ModelGlue.xml file contains many includes to break out the functionality.

While this makes the XML a lot easier to read, it confuses the framework explorer a bit. The framework explorer does correctly notice the include. But it doesn't let me explorer the XML and see the controllers and event handlers.

Turns out there is a simple solution. I just needed to right click on my included XML file, select CF Frameworks, and then Set/Unset as Configuration file:

<img src="https://static.raymondcamden.com/images/cfe.png">

In the drop down, select Model-Glue. Then in the frameworks explorer window, hit the Refresh button. Your XML file will now show up as a Model-Glue config file you can browse. 

I want to say I'm very disappointed in CFEclipse. The fact that it can't read my mind and understand what I mean by telepathy is truly a shortcoming of the product. I may have to switch to Visual Studio I suppose. (Hmm, may be a bit hard on the Mac.)
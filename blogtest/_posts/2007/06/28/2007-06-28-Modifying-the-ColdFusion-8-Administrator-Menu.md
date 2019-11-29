---
layout: post
title: "Modifying the ColdFusion 8 Administrator Menu"
date: "2007-06-28T16:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/28/Modifying-the-ColdFusion-8-Administrator-Menu
guid: 2157
---

About a year ago I <a href="http://www.raymondcamden.com/index.cfm/2006/11/13/Adding-your-own-links-in-the-ColdFusion-Administrator">blogged</a> about how you can add your own links to the ColdFusion Administrator. While this isn't something you often need to do - it is handy for integrating third party applications into the Administrator. (<a href="http://spoolmail.riaforge.org">Spoolmail</a> and <a href="http://flogr.riaforge.org">Flogr</a> are two examples of this.)

Jason Delmore of Adobe let me in on a new update to this. While the old extensionscustom.cfm feature still works in ColdFusion 8, there is a new file you can use named custommenu.xml. It exists right now in your CFIDE/Administrator folder. This file lets you add both new sections and links to the Administrator. (The extensionscustom.cfm file only lets you add links to a 'Custom Extensions' node.) 

So while I can't see using this <i>terribly</i> often, it is nice to see. One idea for how to use it: Currently to get to the Service Monitor, you click a link in the left hand menu and then click a button. You could put a direct link in the left hand menu and skip one button push. Ok, so it isn't a huge improvement, but maybe others will have more ideas.
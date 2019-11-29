---
layout: post
title: "ColdFire Guide"
date: "2007-10-02T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/02/ColdFire-Guide
guid: 2385
---

Nathan Mische has <a href="http://www.mischefamily.com/nathan/index.cfm/2007/10/1/How-ColdFire-Works">posted</a> an awesome article on ColdFire and how it works, along with what to check if it isn't working. Last night at the "Meet the CF Team" Birds of a Feather, someone made the comment that default debug template isn't XHTML compliant. Well, one nice thing about <a href="http://coldfire.riaforge.org">ColdFire</a> is that it doesn't output <i>anything</i> onto the visible portions of your page at all. 

As a reminder - the debug templates are all unencrypted CFML. That's how ColdFire was able to take off - I just looked at what was used in the default debugging template and rewrote it for use in Firebug. So if you don't like something about the debug templates - just edit them!
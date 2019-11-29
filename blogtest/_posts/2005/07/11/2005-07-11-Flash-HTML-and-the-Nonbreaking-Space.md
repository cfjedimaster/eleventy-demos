---
layout: post
title: "Flash, HTML, and the Non-breaking Space."
date: "2005-07-11T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/11/Flash-HTML-and-the-Nonbreaking-Space
guid: 619
---

My project manager discovered an interesting issue while I was gone. <a href="http://www.mindseye.com">We</a> are currently working on a project now for a site that uses a Flash application to browse content. The Flash SWF calls a CFC to get the content. The back end is our ColdFusion based CMS <a href="http://www.mindseyeelement.com">Element</a>, which uses a rich text editor. The client was instructed that Flash does not understand all HTML tags, so they needed to keep things simple. That worked fine until the PM noticed something odd. Some sentences were running together. As an example:

Bush is a monkey.No, monkeys have more brains.

Turns out - the content was being pased in from another source like so:

Bush is a monkey.&amp;nbsp;No, monkeys have more brains.

And Flash was ignoring the non-breaking space. Luckily enough it was easy enough to fix. I just added a method to my CFC to change the html entity to a normal space, which Flash respected.

As a related issue - the rich text editor was using liked to use the STRONG tag instead of B. Flash wants B, not STRONG. Luckily, the same method easily fixed that as well.
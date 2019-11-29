---
layout: post
title: "Another Hack Job - Update to classic.cfm debug template"
date: "2008-11-26T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/26/another-hack-job-update-to-classiccfm-debug-template
guid: 3123
---

On a private listserv (the first rule of fight club is...) <a href="http://www.carehart.org">Charlie Arehart</a> brought up some interesting ideas he had in regards to the default debugging template in ColdFusion. One of these actually happened to match perfect something that was included in the latest <a href="http://coldfire.riaforge.org">ColdFire</a> release, specifically a way to see what percent of time was spent doing database queries. (ColdFire will also tell you what percent of the total execution time was spent in CFC methods.) On a whim I decided to quickly add the following. Credit goes to Charlie for the ideas.
<!--more-->
1) You can now see a total query time:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 212.png">

2) If the execution time of a query is over 1k, I added lsNumberFormat to the display. This will change 3448ms to 3,448ms. Charlie thought this might be a bit easier to read. The comma right after ms makes it a bit confusing to me though. I tested this by adding a large number to my query since I was unable to write a slow query. (I've got mad SQL skills.)

3) If the execution time of a query is too slow, flag it like the template list does. If you look in the screen shot above you will see a few red lines. I had set my 'highlight templates' setting in the CF Admin to 2 ms, which is very low of course, but it helps show the issue. If your query takes too long, it is now highlighted.

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 312.png">

It uses the same threshold as the templates do. 

I've attached the template to this blog entry. Since this is replacing a 'core' CF tag, you will want to back your copy up first. I tested this in CF8, but I'm sure it would work in CF7 and probably 6 as well. If it doesn't work, um, too bad.

Also note that I do not want to put words into Charlie's mouth. What I wrote was based on my impression of what he wanted. I'm sure he will chime in if I misunderstood him.<p><a href='/enclosures/classic.cfm.zip'>Download attached file.</a></p>
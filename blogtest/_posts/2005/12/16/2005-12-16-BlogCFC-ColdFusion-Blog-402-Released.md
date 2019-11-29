---
layout: post
title: "BlogCFC (ColdFusion Blog) 4.0.2 Released"
date: "2005-12-16T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/16/BlogCFC-ColdFusion-Blog-402-Released
guid: 975
---

Woohoo! Another Friday, and another update. Today's update includes the following changes:

<ul>
<li>Holy crap. Holy crap. Holy crap. The number of lines in blog.cfc went <b>down</b>. Yes - for the first time in the history of BlogCFC, the giant beast known as the "UberCFC" actually shrunk a little bit. Basically I just moved the ping code out. Speaking of ping, Dave Carabetta added code to ping IceCast. <b>Note</b> - I think I called it IceCast in the docs. It's actually IceRocket. I'll update the doc in the next version. 
<li>Stats.cfm has been updated to use the right SES links when possible. Also no-follow directives were added to the search term and category links.
<li>I found some more offset bugs. They should be all fixed now except one. BlogCFC lets you write an entry in the future. The entry will be hidden (except to those logged on) until it is time for it to be published. There is a caching issue where we only reset the cache once an hour, but this just means your entry will be, at most, an hour late. However - any subscribers to your blog will get the entry immediately. Therefore... future blog entries as a feature just isn't there. I'll address that later.
<li>Comments now use the same spam list as the trackback spam system. Thanks go out to vile, disgusting, stupid, lower-than-poop spammers out there who have nothing better to do then make our lives miserable. Oh, and I updated the TB spam list with my list. 
<li>SimpleContentEditor is shipped to make it easier for folks to edit pods. I updated the version in the zip with the latest version available from the My Tools pod.
</ul>

Enjoy. As always, you can visit my <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wish list</a> or my <a href="http://ipodnanos.freepay.com/?r=22637619">free ipod nano</a> promotion. Or you can just say "Good job!" Of course, you may want to wait a day or two as the bugs shake out. 

This version was sponsored by the Depeche Mode MP3s that blared in my ears. I'm convinced that in 30 years we will have bionic ears. Therefore I am doing my part to damage my ear drums. (Specifically today it was older DM, Black Celebration played about 20 times.)
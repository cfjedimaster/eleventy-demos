---
layout: post
title: "Tip: Viewing Network Requests with the Safari Debugger"
date: "2015-03-27T11:18:31+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/03/27/tip-viewing-network-requests-with-the-safari-debugger
guid: 5895
---

I'm not a heavy Safari user, but I use the heck out of the web tools when testing PhoneGap/Cordova apps. Sometime recently (I believe), the UI changed a bit in terms of the Network request panel and I couldn't see my requests anymore. I finally figured out the issue and I thought I'd share. To be clear, when I say I figured it out, I mean I found the <a href="http://stackoverflow.com/a/27189459/52160">right post on StackOverflow</a> and all credit goes to user <a href="http://stackoverflow.com/users/170851/enyo">enyo</a>. I'm just writing this up and sharing pretty pictures.

<!--more-->

Ok, so what exactly is the issue? I noticed recently that when I go to my debug tools, select Timelines, click Network Requests and record, nothing seemed to show up in the detail panel, specifically:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/wi.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/wi.png" alt="wi" width="850" height="439" class="alignnone size-full wp-image-5896" /></a>

I would click things in my app that I <i>knew</i> were firing XHR calls and nothing would show up in the detail. Turns out, the issue is due to timeline UI:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/wi2a.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/wi2a.png" alt="wi2a" width="850" height="446" class="alignnone size-full wp-image-5898" /></a>

See that section I highlighted above? Look on the far right and see a darker gray "thingy" you can grab on top. Being that this is Apple they probably don't call it a thingy. What isn't obvious (well to me anyway) is that you can click and drag to select a portion of the time line. If you find the timeline moving too quick, just hit stop recording.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/wi3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/wi3.png" alt="wi3" width="850" height="453" class="alignnone size-full wp-image-5899" /></a>

What you will discover is that the Network panel will <strong>only show items within a selected timeframe!</strong> So that makes sense I suppose, but I wish that by default you could select nothing and have everything show up.

Ok - but once you know that you may run into another problem. For me, my timeline was zoomed in such that every inch or so of screen space was about one tenth of a second. Note the timestamps in the screen shot above. I wasn't sure how to zoom, but on the StackOverflow link I shared above, they mentioned that if you scroll up and down it will zoom. I confirmed that scrolling down let me "zoom out" rather high:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/wi4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/wi4.png" alt="wi4" width="850" height="453" class="alignnone size-full wp-image-5900" /></a>

I then selected from time zero to day 92000 or so, and frankly, if that isn't enough, then I don't know what is. ;) 

I asked Apple's Safari evangelist (<a href="http://jonathandavis.io/">Jonathan Davis</a>) if there was some way to always show all items and he said not yet. The zoom level, however, will stick, so in theory you don't have to keep zooming out. It also appears as if the selected range <i>also</i> persists. That means the only thing you need to do is hit the Recording button. 

p.s. As a quick note, the UI for recording versus non-recording may be a bit weird. When you are <strong>not recording</strong>, the UI shows a red flight, which typically means that something is recording:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/wi5.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/wi5.png" alt="wi5" width="450" height="284" class="alignnone size-full wp-image-5901" /></a>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/wi6.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/wi6.png" alt="wi6" width="450" height="282" class="alignnone size-full wp-image-5902" /></a>
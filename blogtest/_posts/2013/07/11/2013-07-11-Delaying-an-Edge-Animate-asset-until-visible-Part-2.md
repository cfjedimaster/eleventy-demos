---
layout: post
title: "Delaying an Edge Animate asset until visible - Part 2"
date: "2013-07-11T16:07:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/07/11/Delaying-an-Edge-Animate-asset-until-visible-Part-2
guid: 4981
---

A few months back I wrote a blog entry (<a href="http://www.raymondcamden.com/index.cfm/2013/4/3/Delaying-an-Edge-Animate-asset-until-visible">Delaying an Edge Animate asset until visible</a>) that discussed how to ensure folks actually <i>saw</i> your Edge Animate animation. It used a bit of code to detect if the asset was available and if not - listened for scroll events to figure out when it should fire off. A reader asked me an interesting side question. Given an animation that may loop, or a user who may scroll up and down, is it possible to just pause the video when not visible and re-enable it when viewed? Yes! Here is my solution.
<!--more-->
First - I wanted an animation that would loop. There isn't a simple button you can click to enable this in Edge Animate, but it isn't terribly difficult either. Read this forum post with a great answer by user dhosford: <a href="http://forums.adobe.com/thread/1085379">Edge Animate questions</a>. Basically you add a label and use the "complete" action to send the playback back to the label. 

The next step was easy. I used the code from my previous demo in a slightly modified form. My last entry would only check for scroll events once. I modified this to <i>always</i> listen for scroll events and see if the asset was in, or out, of the view port. I'm a bit concerned about the performance implications this may have, but... here it is:

<script src="https://gist.github.com/cfjedimaster/5978764.js"></script>

Yeah, not exactly rocket science, but it seems to work well. You can view a complete working demo below. I use a large amount of text to push the asset down, but I recommend making your browser a bit skinnier before you load it.

<a href="https://static.raymondcamden.com/demos/2013/jul/11/delaywhileinvisible/Untitled-1.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

p.s. On a quick note - I <i>seem</i> to remember that Edge Animate would sometimes blow away your modifications. When I used it to load my previous demo and worked on it, it didn't touch my code at all. I don't know if that's new with CC or not, but, that's cool!
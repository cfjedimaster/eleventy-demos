---
layout: post
title: "Users want the control"
date: "2006-02-14T17:02:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/02/14/Users-want-the-control
guid: 1098
---

A friend sent me a link (here, I'll share it, since I know folks will ask: <a href="http://www.trunkmonkeyad.com">trunkmonkeyad.com</a>). It is nothing more than a collection of funny car ads. (Actually, pretty darn funny.) Since I was busy, I loaded up the first clip, switched to another Firefox tab and went back to listening to my too-loud trance music. 

A few seconds later, I heard something interrupting my music. The video was playing by itself. I could have sworn that I had set my preferences in Quicktime to disable auto-play...

<img src="http://ray.camdenfamily.com/images/quicktimepref.jpg">

Yep, there is it. On a whim, I did a quick view source and saw...

<code>
&lt;param name="autoplay" value="true"&gt;
</code>

It looks like Apple decided to overrule the user's preference and auto-play anyway. As a web developer, Apple may think I'd side with them, but I <i>look</i> at more web sites than I develop. And you know what? I think I know better, Apple. If I say I don't want a movie to automatically start, it is probably because I'm in an environment (work) where I don't want video to play. Or maybe I want to listen to music while the video downloads. 

Either way - am I alone in this? Or am I just getting cranky. (I've complained before about how few Flash developers bother to put a freaking pause button on their videos, or a mute. Heaven forbid you want to actually pause a video.)
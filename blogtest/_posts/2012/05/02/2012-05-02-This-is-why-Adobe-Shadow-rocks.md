---
layout: post
title: "This is why Adobe Shadow rocks"
date: "2012-05-02T16:05:00+06:00"
categories: [development,html5,mobile]
tags: []
banner_image: 
permalink: /2012/05/02/This-is-why-Adobe-Shadow-rocks
guid: 4605
---

<img src="https://static.raymondcamden.com/images/shadow_128x128.gif" style="float:left;margin-right: 15px;" /> I've blogged about <a href="http://labs.adobe.com/technologies/shadow/">Adobe Shadow</a> before, and I've played with it, but I don't think I truly appreciated it till just now.

A coworker pinged me about an issue he was having with a jQuery Mobile page and iOS. I got the code from him, dropped it in my local web root, turned on Shadow, and began editing.

The code in question had a bunch of JS libraries in play, and I simply commented them out one by one. My 'process' was...

<ul>
<li>Edit the file</li>
<li>Reload the tab in Chrome</li>
<li>Look at my iPad and see if the issue was fixed</li>
</ul>

This took me about 2-4 minutes to correctly figure out which JavaScript file was causing the issue. Adobe Shadow dramatically increased my testing speed and made the entire process a heck of a lot simpler. 

So I know I'm biased, but damn - I'm sold on Shadow.
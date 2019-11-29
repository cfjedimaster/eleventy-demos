---
layout: post
title: "Infinite Scroll Example with ColdFusion"
date: "2013-05-21T16:05:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2013/05/21/Infinite-Scroll-Example-with-ColdFusion
guid: 4939
---

A few weeks ago a reader asked if I had an example of infinite scroll with a ColdFusion back end. I replied that I did not, and that infinite scroll was the worst thing to happen to the Internet since the rainbow horizontal rule. 

<img src="https://static.raymondcamden.com/images/lirainbw.gif" />

I'm possibly being a bit overly dramatic, but I'm <strong>really</strong> not a fan of it. Maybe it's the OCD in me, but the fact that I can never get to the end of an infinite scroll UI just bugs the hell out of me.

That being said - I figured - why not make a quick example. It can't hurt, right?
<!--more-->
I did some Googling on the topic. Initially the results I found were not very helpful. Many required a bit of configuration and I was really looking for something quick and simple. Finally I came across this <a href="http://stackoverflow.com/a/5059561/52160">great answer</a> on Stack Overflow: 

<script src="https://gist.github.com/cfjedimaster/5622664.js"></script>

4 simple lines. Nice! So I took this and ran with it. I first created a fake service in a ColdFusion component that would return an infinite amount of data. Not exactly real world, but it worked. Note that I added a bit of a delay to the code so that my local testing would <i>feel</i> a bit more realistic.

<script src="https://gist.github.com/cfjedimaster/5622677.js"></script>

The code here is pretty arbitrary. I return an array of structures containing a title and a body. I accept a start parameter, but I don't really even use it. Again, the entire purpose for this was to just send me a lot of data. Now let's look at the front-end code.

<script src="https://gist.github.com/cfjedimaster/5622689.js"></script>

A bit more than 4 lines, but hopefully you will see that I've simply taken the logic from the Stack Overflow answer and wrapped it around a call to a function called loadContent. loadContent handles several things.

<ul>
<li>First, it is intelligent enough to recognize when it is fetching data and prevent you from making multiple XHR requests at once.
<li>Secondly, it handles updating the DOM with a loading message so you know important crap is on the way.
<li>It does the XHR call and handles rendering it out. (Insert reminder about using JavaScript templates here.)
<li>Finally it removes the loading message.
</ul>

Overall, pretty simple. You can demo this here: <a href="http://www.raymondcamden.com/demos/2013/may/21/test.html">http://www.raymondcamden.com/demos/2013/may/21/test.html</a>. If it seems slow, remember that I kept in that sleep() command there. 

I built a second demo that makes use of my actual blog database. For the most part it is the same, but note the use of a Query and limit operations to page the data.

<script src="https://gist.github.com/cfjedimaster/5622720.js"></script>

You can demo this version here: <a href="http://www.raymondcamden.com/demos/2013/may/21/test2.html">http://www.raymondcamden.com/demos/2013/may/21/test2.html</a>

In my testing this downloaded pretty quick (and I'm on VPN now downloading 2 gigs of VMs). There are two things missing from this version. 

One - I need to enable my front-end service to recognize when it is no longer getting rows of data from the back end. I could handle that with a flag in the result object or some other way. 

Second - If I were to add links to the actual blog entries, I'd need to support some way of remembering where you were when you hit the back button.

If folks care, I'll do some updates to add that.
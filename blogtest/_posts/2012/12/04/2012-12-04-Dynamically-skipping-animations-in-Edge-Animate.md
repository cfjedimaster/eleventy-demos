---
layout: post
title: "Dynamically skipping animations in Edge Animate"
date: "2012-12-04T14:12:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/12/04/Dynamically-skipping-animations-in-Edge-Animate
guid: 4799
---

As much as I like animation, sometimes less is more. I know we've all seen cool animations that were, well, cool, but after you've seen it a few times you wish you could simply bypass it. Here's a simple example of how you can modify an <a href="http://html.adobe.com/edge/animate/">Edge Animate</a> project to remember that a user has seen the animation and skip to the end.
<!--more-->
I began by creating an incredibly simple animation. I added a text box that flew in and increased in size. The entire animation stretched out over 3 seconds. Take a gander at the demo here: <a href="http://www.raymondcamden.com/demos/2012/dec/4/welcomeproject2/">http://www.raymondcamden.com/demos/2012/dec/4/welcomeproject2/</a>

Amazing, right? I know, I'm wasting my time as a developer when I should be in the interactive design business. Ok, that aside, the first thing I did was disable autoplay and created a "creationComplete" event handler. I discussed this earlier in another blog post: <a href="http://www.raymondcamden.com/index.cfm/2012/11/7/Datadriven-Edge-Animate-projects">Data-driven Edge Animate Projects</a>.

At this point I've got an animation that won't do anything, so I need to build that logic in. I decided to use window.sessionStorage as a simple way to note that you've already seen the animation. There's many other options I could have used, like cookies, but I figured this was the quickest, simplest way of doing it. Let's take a look at the code.

<script src="https://gist.github.com/4207741.js?file=gistfile1.js"></script>

In a nutshell, the code first checks to see if your browser even supports sessionStorage, and if it does, it looks for the existence of a "seenanimation" variable. Again, we have options here. Instead of a "once a session" flag I could use a counter. Or a date variable that only shows the animation every 5 minutes. You get the idea. 

The else portion is interesting. My animation is 3 seconds long. So at first I tried play(3000) but it didn't work. I then added a label called "End" and tried play("End"). Turns out, the play() API is 0-based. (Documented <a href="http://www.adobe.com/devnet-docs/edgeanimate/api/current/index.html">here</a>.) So I simply used the getDuration() API and substracted one from it. 

Obviously you wouldn't have to go to the end either. Maybe you just want to skip part of the animation or go to some other label. You can play with this demo below.

<a href="http://www.raymondcamden.com/demos/2012/dec/4/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
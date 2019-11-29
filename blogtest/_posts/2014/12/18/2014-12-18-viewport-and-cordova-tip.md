---
layout: post
title: "Viewport and Cordova Tip"
date: "2014-12-18T17:18:11+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/12/18/viewport-and-cordova-tip
guid: 5464
---

Yesterday I ran into an interesting thing with Cordova and I thought I'd share. I assume most folks are aware of the benefits of adding a meta tag specifying viewport when building mobile-friendly websites. If you aren't, here are a <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag">few</a> <a href="http://css-tricks.com/snippets/html/responsive-meta-tag/">examples</a> <a href="https://developers.google.com/web/fundamentals/layouts/rwd-fundamentals/set-the-viewport?hl=en">demonstrating</a> the idea. I created a quick Cordova application yesterday specifically to demonstrate this for the <a href="http://manning.com/camden/">book</a> I'm writing. Using the same base HTML, I made two applications and in one of them I used the meta tag. 

<!--more-->

When I viewed both applications in my mobile simulator, I noticed something odd. They both looked the exact same. I saw the same behavior in both iOS and Android. To make things even more confusing, I then used Mobile Safari to open up the www folders from the applications. The one without the meta tag demonstrated the problem that the tag was meant to solve. So what's going on?

If you look at the <a href="http://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_config.md.html#iOS%20Configuration">iOS configuration</a> guide at the Cordova docs, you will notice this preference: <code>EnableViewportScale</code>. This preference allows you to specify a view port scale with the meta tag. <strong>The default is false.</strong> That explains it right there - <strong>and serves as a reminder to read, and read often</strong> the configuration guides. I tend to focus primarily on the JavaScript of my Cordova apps, but there is quite a bit you can do with the configuration values as well. 

p.s. Someone needs to take the <code>MediaPlaybackRequiresUserAction</code> attribute and apply it to the web as a whole. :\
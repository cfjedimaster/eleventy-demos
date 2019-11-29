---
layout: post
title: "Mashups of CanIUse.com data"
date: "2012-09-04T18:09:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/09/04/Mashups-of-CanIUsecom-data
guid: 4722
---

I would hope, <i>really</i> hope, that my readers are aware of <a href="http://caniuse.com/">When Can I Use</a>. It's a site that gives you quick access to a multitude of HTML5/CSS/etc features and their support over a wide variety of browsers and versions. It is <b>the</b> place I check when I need to see if a particular feature is supported on a particular platform. Towards the end of last week, someone tweeted that it would be cool if you could see a support matrix for multiple features at once. So for example, what if I wanted to see what browsers support both canvas and html5 form features. (Because certainly the browser engineers would focus their time on useful form features over silly graphical drawing surfaces. Oh god, I've gone off on a rant again. Ignore me.) Turns out that <b>all</b> of the data for the site is shared publicly on GitHub: <a href="https://github.com/fyrd/caniuse">https://github.com/fyrd/caniuse</a>

I thought to myself - what if I took that data and used my incredible design skills to build such a tool. And I did. Except my incredible design skills were lost in the last hurricane so you get to deal with my not-so-incredible design skills instead.
<!--more-->
In the first demo, I decided to get fancy and build gradients that represented support. I focused on the current version of the major browsers only. Here's an example that shows three particular CSS features. Notice that the bottom is red in IE and Opera showing that support for the flexible box layout module is missing:

<img src="https://static.raymondcamden.com/images/ScreenClip116.png" />

Here's another example with 8 features selected:

<img src="https://static.raymondcamden.com/images/ScreenClip117.png" />

You get the idea. Want to test it yourself? Check it out here:

<a href="http://www.raymondcamden.com/demos/2012/sep/4/caniusedemo/test1.html">http://www.raymondcamden.com/demos/2012/sep/4/caniusedemo/test1.html</a>

Note that I tested this in Firefox and Chrome. Your results may vary in other browsers.

So after showing this to <a href="http://www.remotesynthesis.com">Brian Rinaldi</a>, he made a simple suggestion. Instead of a gradient of colors, why not simply show the worst case scenario? I.e., given N features, if support for one is lacking, then show red to indicate that you can't use all these features together. I tweaked the code a bit and created this simpler version that does just that:

<a href="http://www.raymondcamden.com/demos/2012/sep/4/caniusedemo/test2.html">http://www.raymondcamden.com/demos/2012/sep/4/caniusedemo/test2.html</a>

Play with it and enjoy seeing how fast you can make IE turn red.

Anyway - view source - check out the code - and let me know what you think. The code isn't optimized nor is it very pretty. But it was fun to play with the data.
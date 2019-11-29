---
layout: post
title: "CSS Regions and Edge Tooling"
date: "2013-09-24T16:09:00+06:00"
categories: [design,development,html5,mobile]
tags: []
banner_image: 
permalink: /2013/09/24/CSS-Regions-and-Edge-Tooling
guid: 5046
---

<p>
Today our web platform team released a very cool article on <a href="http://blogs.adobe.com/webplatform/2013/09/23/design-next-generation-responsive-designs-for-ios7-with-edge-reflow-cc-and-css-regions-a-story-of-collaboration/">CSS Regions and Edge Reflow</a>. CSS Regions, if you don't know, is a specification that Adobe and others have been working on now for nearly two years. Even better, iOS7 landed support for this last week when it was released.
</p>

<p>
While I encourage you to actually read the <a href="http://dev.w3.org/csswg/css-regions/">spec</a> (seriously, reading specs may not be exciting, but the level of detail is incredible), I'll do my best to explain the feature here. In a nutshell, CSS regions allow you to define how text should flow within a "region". You can think of a region as columns in a newspaper that flow naturally around pictures. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/CSS Regions Marquee1.png" />
</p>

<p>
As I said above, regions have landed in iOS7, and they are available now via a flag in Chrome. You can see more detailed information about the support level at the <a href="http://caniuse.com/#feat=css-regions">CanIUse</a> page:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_9_24_13_2_37_PM.jpg" />
</p>

<p>
Both Edge Reflow and Edge Code now have support for CSS Regions. In order to see this in Edge Reflow, be sure you update first (duh), but then check the <strong>View</strong> menu for "Shiny Web Features":
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-09-24 at 2.40.13 PM.png" />
</p>

<p>
You can read more about Edge Reflow's update here: <a href="http://html.adobe.com/edge/reflow/shiny-web-features.html">Shiny Web Features</a>.
</p>

<p>
I also <i>strongly</i> recommend you check out Terry Ryan's article: <a href="http://blog.terrenceryan.com/reflow-gets-support-for-regions/">Reflow Gets Support for Regions</a>. His screen shots are particularly good I think at illustrating the feature. I also like Alan Greenblatt's excellent article on it: <a href="http://blattchat.com/2013/08/29/cross-browser-responsive-content-with-css-regions/">Cross-Browser Responsive Content with CSS Regions</a>.
</p>

<p>
As a reminder - you can download Edge Reflow for <strong>free</strong> when you sign up at the <strong>free</strong> level of the Creative Cloud. If you have any questions about Reflow, or Regions, just let me know!
</p>
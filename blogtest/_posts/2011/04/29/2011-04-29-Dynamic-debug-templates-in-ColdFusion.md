---
layout: post
title: "Dynamic debug templates in ColdFusion?"
date: "2011-04-29T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/29/Dynamic-debug-templates-in-ColdFusion
guid: 4215
---

Robby asked:

<p/>

<blockquote>
<p>
I had read your post about
</p>
<p>
<a href="http://www.raymondcamden.com/index.cfm/2006/7/3/Debug-template-information-in-the-order-of-process">http://www.coldfusionjedi.com/index.cfm/2006/7/3/Debug-template-information-in-the-order-of-process</a>
</p>
<p>
and was already trying to customize another debugging template when a question came to mind.
</p>
<p>
Do you know if the debugging template can be specified in application.cfm?  In other words:
</p>
<p>
if  (some condition)<br/>
  use main debugging template<br/>
else<br/>
  use alternate debugging template<br/>
</p>
<p>
I have server admin access currently and debugging is on for my IP and I can easily switch.  As long as the developer had his IP listed and if he could change the template in code, it could be customized per developer.   That way if I were changing something, it wouldn't affect all the other developers or depending on the page content, we might want to debug differently.
</p>
</blockquote>
<!--more-->
<p>

I was really happy Robby asked this question. ColdFusion debug templates are something I've played with in the past but not recently. How many of my readers are aware that the debugging information you see is actually built from a ColdFusion file? You can edit this to your liking or even build new ones. I've blogged on this a few times before (see the link above), and it's 1/2 of what makes <a href="http://coldfire.riaforge.org">ColdFire</a> awesome. Now certainly this is not something the casual developer will need to mess with, but there are certainly times when there could be a valid reason to poke your head in and tinker a bit.

<p>

That being said - unfortunately - you can't dynamically change the debug template. (Ok, technically you can via the Admin API, but that's going to be server wide and not something you want to toggle with every request.) However, you could easily build a debug template that simply acts as a router. So you could imagine your Application.cfc setting a request variable (request.debugformat="fatstyle") that is then picked up by the template. Depending on the value <i>another</i> CFM is included to handle the display. Simple - and there's nothing wrong with that.

<p>

Is anyone out there mucking with their debug templates? I'd love to hear it if so.
---
layout: post
title: "Project Parfait - PSD Introspection in the Browser"
date: "2014-04-22T18:04:00+06:00"
categories: [design,development]
tags: []
banner_image: 
permalink: /2014/04/22/Project-Parfait-PSD-Introspection-in-the-Browser
guid: 5208
---

<p>
Today Adobe launched a pretty cool new site - <a href="https://projectparfait.adobe.com">Project Parfait</a>. Project Parfait lets you work with PSDs via your web browser. 
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/s0.png" />
</p>

<p>
By default you're presented with a default PSD to work with, but you can quickly upload new PSDs by simply dragging them into the browser. I did multiple tests and the service didn't choke on any of them - even a large 30 megabyte one. Once you've uploaded the PSD the service will then start processing your file to extract data from it.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s19.png" />
</p>

<p>
When done, you can open the PSD in the interface and start working with the various parts of the file. As a test, I grabbed a PSD a designer gave me for an older site of mine. This is a comp for a homepage redesign she did for me.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s9.png" />
</p>

<p>
Lots of interesting information is available. The styles tab, for example, shows all available colors and fonts from the PSD. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/s111.png" />
</p>

<p>
If I select one particular element from my PSD, I get both the specific colors used for it as well as CSS information.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s20.png" />
</p>

<p>
Notice that I can copy the CSS from the right panel, or directly from the blue call-out right below it. See the arrow? This will actually create an asset from the selecting layer. I did this with the logo and it is now available to me from the Assets tab.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s_extract3.png" />
</p>

<p>
You can also extract the text if you have something useful there as opposed to the typical Lorem Ipsum. Another tab gives you access to all the layers with the ability to show/hide items.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s_layers.png" />
</p>

<p>
So yeah, I'm biased, but this is pretty damn nifty. This is <strong>exactly</strong> the kind of tool that is useful for me as a web developer. I have a lot of respect for Photoshop, but I find it hard to use at times as I don't use it very often. Something like Parfait is a heck of a lot simpler for me and I'm willing to bet a lot of developers would think the same. If you try it out, make note of the Chat option in the lower right corner. I found a small bug and reported it via that pod. You can also get support via the <a href="http://www.adobe.com/go/parfait_forum">forums</a> just launched for the project. Finally, check out this video below by my coworker Paul Traini. He covers Parfait as well as some of the other web-related options recently added to Photoshop.
</p>

<iframe width="651" height="366" src="//www.youtube.com/embed/wZUjdNmGZko?rel=0" frameborder="0" allowfullscreen></iframe>
---
layout: post
title: "Quickie Flex2/ColdFusion Application"
date: "2006-07-24T23:07:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2006/07/24/Quickie-Flex2ColdFusion-Application
guid: 1426
---

This morning I demonstrated a quick way to add a simple image browser to a ColdFusion site. Someone suggested Flash Forms, but I thought Flex 2 would make a better example. So with that in mind, here is a simple Flex 2 version of the slide show:
<!--more-->
<blockquote>
<a href="http://ray.camdenfamily.com/demos/slideshow/slideshow.cfm">http://ray.camdenfamily.com/demos/slideshow/slideshow.cfm</a>
</blockquote>

A few quick notes. You will notice that the main fle is a CFM, but I don't use any ColdFusion in it. Instead, I simply load up the SWF I created. The Flex file does make use of a CFM file like so:

<code>
&lt;mx:HTTPService id="imageService" url="imageservice.cfm" result="loadImages(event)" fault="faultHandler(event)"&gt;
</code>

I used the HTTPService for simplicity's sake. Also, if I had used Flash Remoting, it would only work for folks who have ColdFusion 7.0.2. This should work on just about any server. I then modified the ColdFusion script I had used before so that it output XML. Oh, and how difficult was it to use that XML? Here is the code called when the HTTPService is done running. 

<code>
imageList = event.result.images.image;
</code>

That's it. Flex lets me treat the result as an ArrayCollection, and I can then simply use the "path" of the XML data to load the array. 

Normally I'd paste in more code, but why bother? If you right click on the Flex app you will see a "View Source" link. You can take this code, and compile it, and then use it in your file. All you need to do is ensure the SWF/CFM exist in the same folder as your image.

Let me be absolutely clear. This was made just for fun. I don't mind folks using my ColdFusion code, but remember I'm still a Flex newbie. In fact, I'd love some feedback. How do I get that Next button to right align with the image? How can I get rid of the gray border around the app? I used a bgcolor of white, but I still get grey in my display.
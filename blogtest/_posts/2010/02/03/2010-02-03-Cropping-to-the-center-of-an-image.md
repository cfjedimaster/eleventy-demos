---
layout: post
title: "Cropping to the center of an image"
date: "2010-02-03T18:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/03/Cropping-to-the-center-of-an-image
guid: 3707
---

This week a user sent in what I thought was a rather simple request. He needed to find the center of an image. That's pretty trivial math, so I fired back with the following:
<!--more-->
<p>

<code>
&lt;cfset image = "/Users/ray/Pictures/star-wars-stormtroopers-breakfast-cereal.jpg"&gt;
&lt;cfset myImg = imageNew(image)&gt;
&lt;cfset centerX = myimg.width/2&gt;
&lt;cfset centerY = myimg.height/2&gt;
</code>

<p>

Basically, your center is the point defined at half your width and half your height. However, I misunderstood his initial request. He wanted to take an image and crop it to a smaller size. But he wanted the crop to "center" around, well, the center. Let me explain with an example that demonstrates how just finding the center isn't enough. We will begin with our source image - which is not mine and I cannot find the credit.

<p>

<img src="https://static.raymondcamden.com/images/star-wars-stormtroopers-breakfast-cereal.jpg" />

<p>

Pretty snazzy, right? Now let's look at code that finds the center, and then crops at that point:

<p>

<code>
&lt;cfset image = "/Users/ray/Pictures/star-wars-stormtroopers-breakfast-cereal.jpg"&gt;
&lt;cfset myImg = imageNew(image)&gt;

&lt;cfimage action="writeToBrowser" source="#myimg#"&gt;
&lt;p/&gt;

&lt;cfset centerX = myimg.width/2&gt;
&lt;cfset centerY = myimg.height/2&gt;

&lt;cfset imageCrop(myImg, centerX, centerY, 300, 200)&gt;

&lt;cfimage action="writeToBrowser" source="#myImg#"&gt;
</code>

<p>

You can see my math in there (ok, it's division, and it's simple, but it's still math!) and the imageCrop that works with the center. However, this creates a crop that is displayed. It's from the lower right hand size of the image.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ssc1.PNG" />

<p>

In order to correct this, we need to make a slight tweak to our code. Our math formula becomes:

<p>

x=width of image/2 - desiredwidth/2<br/>
y=height of image/2 - desiredheight/2<br/>

<p>

Here is the corrected code:

<p>

<code>
&lt;cfset image = "/Users/ray/Pictures/star-wars-stormtroopers-breakfast-cereal.jpg"&gt;
&lt;cfset myImg = imageNew(image)&gt;

&lt;cfset imageCrop(myImg, (myimg.width/2) - (300/2), (myimg.height/2) - (200/2), 300, 200)&gt;
&lt;cfimage action="writeToBrowser" source="#myImg#"&gt;
</code>

<p>

Which produces the following:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ssc2.PNG" />

<p>

Better, right?
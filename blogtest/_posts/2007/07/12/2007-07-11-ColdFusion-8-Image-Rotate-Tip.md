---
layout: post
title: "ColdFusion 8: Image Rotate Tip"
date: "2007-07-12T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/12/ColdFusion-8-Image-Rotate-Tip
guid: 2190
---

I was playing with image rotation last night (I know, call me Mr. Excitement), and I found an interesting issue. Consider this code:
<!--more-->
<code>
&lt;cfset textImage=ImageNew("",200,200,"rgb","white")&gt;

&lt;cfset ImageSetDrawingColor(textImage,"black")&gt;

&lt;cfset attr=StructNew()&gt;
&lt;cfset attr.size=30&gt;
&lt;cfset attr.style="bold"&gt;
&lt;cfset attr.font="ArialMT"&gt;

&lt;cfset ImageSetAntialiasing(textImage, "on")&gt;
&lt;cfset ImageDrawText(textImage,"Paris",50,75,attr)&gt;
				
&lt;cfset ImageRotate(textImage,30,2,2)&gt;

&lt;cfimage action="writeToBrowser" source="#textImage#"&gt;
</code>

I create a new blank image and then draw some black text and then rotate. I end up with this:

<img src="https://static.raymondcamden.com/images/brorate1.png">

Notice the black background? I tried to fix it by using this for my image:

<code>
&lt;cfset textImage=ImageNew("",200,200,"rgb","white")&gt;
</code>

But it had no impact. Luckily I got some help from Adobe (thank you Hemant!) and he mentioned that if I switch my image type to ARGB instead of RGB, it will work. With that, I got this:


<img src="https://static.raymondcamden.com/images/cfjedi/brotate2.PNG">

Not bad - but a bit ugly. The imageRotate function takes a 5th argument: interpolation. This basically sets the quality of the rotation. Adobe defaulted to the quickest method, "nearest." Switching to the highest, "bicubic", makes a real pretty rotation, but the leaves some "crud" on the sides:


<img src="https://static.raymondcamden.com/images/cfjedi/brotate3.png">

Of course, I could crop that easily enough, but, still, a bit of a problem. The middle ground interpolation, bilinear, also leaves the same.
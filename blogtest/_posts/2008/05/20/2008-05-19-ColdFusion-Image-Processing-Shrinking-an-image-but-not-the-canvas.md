---
layout: post
title: "ColdFusion Image Processing - Shrinking an image, but not the canvas"
date: "2008-05-20T09:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/20/ColdFusion-Image-Processing-Shrinking-an-image-but-not-the-canvas
guid: 2836
---

After my presentation yesterday, someone in the audience asked an interesting question. He wanted to shrink an image, but keep the original size. So imagine taking a large image, shrinking down the visual part of it, but keeping the image at the same size with some form of background now. This is relatively easy to do. First we can read in our source image:

<code>
&lt;cfset source = "presentations/webmaniacs/images_lecture/originals/insp_captkirk.png"&gt;

&lt;!--- read it ---&gt;
&lt;cfset myimage = imageRead(source)&gt;
</code>

Then we can shrink it:

<code>
&lt;!--- shrink it ---&gt;
&lt;cfset imageScaleToFit(myimage,250,250)&gt;
</code>

Now let's create a new canvas. This will be a blank image. I'm picking an arbitrary size here. You could have checked the original images size instead, but for this example, I'll just use 400x400. Also note I intentionally picked a non-white background so I could see it working.

<code>
&lt;!--- new canvas ---&gt;
&lt;cfset img = imageNew("", 400, 400, "rgb", "##c0c0c0")&gt;
</code>

Lastly, all you do is paste the shrunken image over the blank canvas we just made:

<code>
&lt;!--- paste it in ---&gt;
&lt;cfset imagePaste(img, myimage, 0,0)&gt;
</code>

Here is the final result: 

<img src="https://static.raymondcamden.com/images/imgs.png">
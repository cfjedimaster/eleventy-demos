---
layout: post
title: "Looking for comments about pictures, orientation, and ColdFusion"
date: "2013-06-03T13:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/06/03/Looking-for-comments-about-pictures-orientation-and-ColdFusion
guid: 4952
---

This weekend I shared a few emails with Dario (who I imagine to be a Dothraki) concerning something interesting he noticed with images and ColdFusion. He took two images and used ColdFusion to check their height and width. Here are the two images he used. (I got permission to use the pictures. I've got no idea who the subject is but I assume they are ok with it. :)
<!--more-->
<img src="https://static.raymondcamden.com/images/s1.jpg" />
<br/>
<img src="https://static.raymondcamden.com/images/s2.jpg" />

Now, before we go any further, let me clarify that I resized his original images and may have modified things a bit. Keep in mind they aren't 100% the same as his original pics.

As you can see, they are clearly different images. But here is the weird thing. If you use ColdFusion to ask for the metadata you get the <strong>same height and width</strong>.

I bet most of you know why already. The images do have the same dimensions, but the first one was taken sideways. Turns out that the browser (and other applications) will notice this and automatically fix it for you.

So that's cool, but it does present some problems. What if you wanted to know the orientation of a picture? You may need this to better lay out images dynamically on a page. If you used the width and height of the images as a guide then you would be wrong. 

Interestingly enough there is another function that can help - imageGetExifData. This returns a structure of Exif data from JPEG images. One of the keys returned is orientation. (Note - if all you care about is orientation you can use imageGetExifTag to filter to just that one tag.) In theory you could use this and if you detect a rotated image, just rotate it again. 

Another odd aspect that he ran into - and I did as well - if you use HTML to display a rotated image it shows up rotated. Yet right clicking and opening the image in a new tab shows it correct. 

So - any thoughts on this?
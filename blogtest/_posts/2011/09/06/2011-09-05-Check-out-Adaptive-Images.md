---
layout: post
title: "Check out Adaptive Images"
date: "2011-09-06T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/06/Check-out-Adaptive-Images
guid: 4354
---

Last week I discovered a pretty interesting project, <a href="http://adaptive-images.com/">Adaptive Images</a>. Created by Matt Wilcox, the Adaptive Images project is a PHP based solution for optimizing graphics for different devices. What makes it even more interesting is that it is an entirely passive type system. So for example, you can create a blog post with an image optimized for the desktop, and simply by adding in his code, devices with smaller screens will be fed the smaller more optimized images. This is done making use of .htaccess. Any request for an image (and you can customize where it looks for these images) will be redirected to a PHP script. The script handles resizing images and handles caching very well. On the front end you employ a very small JavaScript snippet (the only change you have to make to the front end) to store the devices size in a cookie. 

I thought this was a pretty cool project, so with Matt's permission I went ahead and forked his Github project and rewrote the back end in ColdFusion. You can find this fork <a href="https://github.com/cfjedimaster/Adaptive-Images">here</a>. Matt updated his code very recently so my version is a bit out of date, but it should work for you. Give it a try and let me know.
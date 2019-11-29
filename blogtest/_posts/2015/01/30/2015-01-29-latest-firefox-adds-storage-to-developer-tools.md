---
layout: post
title: "Latest Firefox adds Storage to Developer Tools"
date: "2015-01-30T05:59:53+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/01/30/latest-firefox-adds-storage-to-developer-tools
guid: 5607
---

I try to keep track of what all the browsers add to their developer tools, but somehow I missed this. In a recent Firefox update, they finally added a "Storage" tab to the developer tools. For some reason, this tab was deselected in my Firefox. I only knew it existed when I opened up the options looking for something else.

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/ff1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/ff1.png" alt="ff1" width="616" height="502" class="alignnone size-full wp-image-5608" /></a>

Once added, and selected, you will then get the ability to view cookies, IndexedDB databases, and Local and Session Storage. (No WebSQL since Firefox doesn't support it.)

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/ff2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/ff2.png" alt="ff2" width="440" height="558" class="alignnone size-full wp-image-5609" /></a>

Expanding the IDB section, you can browse the structure of local databases:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/ff3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/ff3.png" alt="ff3" width="750" height="242" class="alignnone size-full wp-image-5610" /></a>

And when you click an object store, you will see a list of data. If you click one row, you get details:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/ff4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/ff4.png" alt="ff4" width="750" height="242" class="alignnone size-full wp-image-5611" /></a>

This will be very handy for folks working with local data. (And reminds me I need to give my presentation on this topic again!)

p.s. The title of this post says it was the "latest" Firefox that added this but honestly I may have missed it from an earlier update.
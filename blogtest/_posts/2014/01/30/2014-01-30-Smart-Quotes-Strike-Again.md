---
layout: post
title: "Smart Quotes Strike Again"
date: "2014-01-30T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/01/30/Smart-Quotes-Strike-Again
guid: 5140
---

<p>
Earlier today I helped a buddy of mine who was trying to get CORS working with ColdFusion. He followed my simple tip (<a href="http://www.raymondcamden.com/index.cfm/2012/10/17/Enable-CORS-for-ColdFusion-Services">Enable CORS for ColdFusion Services</a>) but it didn't work. I did some digging and this is what I found.
</p>
<!--more-->
<p>
The first thing I did was to open up his service directly in my browser. I knew I could use Chrome's DevTools to look at the header responses from his service. This is what I saw.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot14.png" />
</p>

<p>
See the funky crap around the Access-Control-Allow-Origin line? That was my clue. I asked him for the code and this is what I saw:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot24.png" />
</p>

<p>
See it? The quotes around the header name and value are those funky smart quotes (they probably have a more formal name) and not "regular" quotes (compare to the name of the function above). So... yeah. They suck.
</p>
---
layout: post
title: "What the heck is (index) in Chrome Dev Tools?"
date: "2013-12-09T12:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2013/12/09/What-the-heck-is-index-in-Chrome-Dev-Tools
guid: 5094
---

<p>
File this under the "Yet Another Thing Probably Obvious to Everyone But Me" folder, but have you ever seen (index) in the Chrome Dev Tools console and wonder what in the heck it was?
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/ss11.jpg" />
</p>

<p>
I had seen this from time to time but never got around to figuring out exactly what is was. Finally I forced myself to dig into it and it is- as expected - incredibly obvious.
</p>

<p>
If you view a web page without specifying an index document, for example: http://localhost/testingzone/, then the web server will attempt to load an index document for that folder. That index file could be index.html, or anything else actually. Here's the thing though. When Chrome needs to tell you the file name of the code generating an error, or console.log message, it can't, since it doesn't know the <i>real</i> file name. 
</p>

<p>
Therefore: (index)
</p>

<p>
In case you're curious, Firefox does this (note that the last folder in the URL was testindex):
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss2.jpg" />
</p>

<p>
Now you know - and we all know what that means.
</p>

<p>
<img src="https://static.raymondcamden.com/images/knowing.png" />
</p>
---
layout: post
title: "Book Review: Third-Party JavaScript"
date: "2013-06-23T12:06:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/06/23/book-review-thirdparty-javascript
guid: 4970
---

<iframe src="http://rcm-na.amazon-adsystem.com/e/cm?t=raymondcamden-20&o=1&p=8&l=as1&asins=1617290548&nou=1&ref=qf_sp_asin_til&fc1=000000&IS2=1&lt1=_top&m=amazon&lc1=0000FF&bc1=000000&bg1=FFFFFF&f=ifr" style="width:120px;height:240px;float:left;margin-right:10px;margin-bottom:10px" scrolling="no" marginwidth="0" marginheight="0" frameborder="0"></iframe> "Third-Party JavaScript", by <a href="http://benv.ca/">Ben Vinegar</a> and <a href="http://anton.kovalyov.net/">Anton Kovalyov</a> is a fascinating deep dive into the practice of building JavaScript-based services to be used by others. If you have ever made use of Google Adsense, Disqus, or even a simple Twitter widget, then you've been a consumer of a third-party JavaScript application. 

On the surface, you may think that such a book would have limited appeal. Many of us write JavaScript and many of us may even use such third-party tools, but the percentage of those who need to <i>author</i> such things is probably pretty limited. In my years in web development, I've never had a client ask me for one and I've only built one once. (See <a href="http://www.raymondcamden.com/index.cfm/2013/4/5/Quick-Code-Sample--Add-your-Behance-portfolio-to-your-web-site">this blog entry</a> on a Behance widget I built.)

I cannot stress how wrong I was. While certainly the book does focus in on embedding code in other web sites, the level of detail and coverage of various browser quirks makes this book invaluable to <i>anyone</i>. 

Both authors have worked on the Disqus platform, probably the best example there is of third-party JavaScript, and I would have assumed they would have some knowledge of various browser quirks and issues, but my god, I had no idea the level of insanity they had to deal with in terms of supporting multiple browsers. 

This book is an incredible way to learn about how the DOM works, how script loading works, and really how the browser works as well. For every problem discussed multiple solutions are covered as well as a deep explanation of why you may choose one particular solution over another.

If you have no plans ever for building a third-party API, this book is <i>still</i> strongly recommended. Hell, the last two chapters alone on performance and debugging are worth the price of the book alone. This is a book I plan on keeping nearby as I feel like I'll be tapping the knowledge inside again and again.

You can read two samples chapters online now: <a href="http://manning.com/vinegar/TPJS-Sample1.pdf">Chapter 1</a>, <a href="http://manning.com/vinegar/TPJS-Sample4.pdf">Chapter 4</a>.

Here is the table of contents:

<ol>
<li>Introduction to third-party JavaScript</li>
<li>Distributing and loading your application</li>
<li>Rendering HTML and CSS</li>
<li>Communicating with the server</li>
<li>Cross-domain iframe messaging</li>
<li>Authentication and sessions</li>
<li>Security</li>
<li>Developing a third-party JavaScript SDK</li>
<li>Performance</li>
<li>Debugging and testing</li>
</ol>

Finally, the book site itself: <a href="http://thirdpartyjs.com/">http://thirdpartyjs.com/</a>
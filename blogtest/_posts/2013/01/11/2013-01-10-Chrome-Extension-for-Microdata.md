---
layout: post
title: "Chrome Extension for Microdata"
date: "2013-01-11T09:01:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2013/01/11/Chrome-Extension-for-Microdata
guid: 4827
---

A while back I read an interesting blog post on <a href="http://en.wikipedia.org/wiki/Microdata_(HTML)">Microdata</a>. While I encourage you to read the article I just linked to, the basic gist of the feature is that it provides a way to create metadata for your HTML content. By embedding certain properties into your HTML you can create search engine/robot friendly data for your content. I'm not sure how much this is actually being used in the wild (see my resources links at the bottom), but it seemed like a pretty cool thing.
<!--more-->
Back in November I <a href="http://www.raymondcamden.com/index.cfm/2012/11/26/Reading-Microdata-Elements-in-Chrome">posted</a> a blog entry about how you could parse an HTML page for microdata in Chrome. (There is a much clearer API that is - unfortunately - not supported by Chrome yet.) I thought it might be nice to take that code and package it up into a proper extension. The idea being that you could add microdata to your HTML page and then use Chrome Dev Tools to see how a robot might read it. 

Here is a screen shot to give you an idea of what I'm talking about. The site in question is <a href="http://southernafricatravel.com/">Southern African Travel</a>.

<img src="https://static.raymondcamden.com/images/screenshot53.png" />

Here is another example where microdata is used for the reviews at <a href="http://reviews.ctswholesalesunglasses.com/">CTS Wholesale Sunglasses</a>.

<img src="https://static.raymondcamden.com/images/screenshot54.png" />

For now, you have to manually open dev tools and select the tab, but I'm considering adding an icon next to the URL bar that flags when it sees microdata being used. 

If you want to install this extension, simply go <a href="https://chrome.google.com/webstore/detail/schemadump/melmflpcmnoddilkindbepcbcjbjbdin">here</a>. The icon is from The Noun Project, courtesy of Ed Jones. (<a href="http://thenounproject.com/noun/database/#icon-No8859">Original Icon</a>)

Ok, if you don't care how Chrome Extensions are developed, you can stop reading now. What follows is some technical background on the extension and why I almost pulled out all my hair last night. 

I've blogged before about the difficult in handling "communication" in Chrome Extensions before. By that I mean having part A talk to park B. Chrome Extensions have rules related to security and context that can make it extremely difficult to get things working. In this extension, the biggest issue was getting the content script (a JavaScript file which can run in the context of the current page) talking to my "devtools" script (where I'd be able to update the content of my panel). There is documentation at Google on this, but <b>nothing that covers this specific use case</b>. In fact, panels in general are pretty poorly documented. To be honest I don't know who to complain to and figure it wouldn't help much anyway. I'm hoping my extensions help out.

I ended up dropping the content script and instead making use of an evaluation technique shared with me by John J. Barton. It worked perfectly. If you want to read more about his workaround, checkout our <a href="https://groups.google.com/a/chromium.org/forum/?fromgroups=#!topic/chromium-extensions/IAPboo9ZDlM{% raw %}%5B1-25-false%{% endraw %}5D">discussion thread</a> on the Google group.

<b>Resources:</b>
<ul>
<li><a href="https://github.com/LawrenceWoodman/mida/wiki/Sites-Using-Microdata">Sites Using Microdata</a></li>
<li>Darn good article: <a href="http://html5hacks.com/blog/2012/11/21/make-your-page-consumable-by-robots-and-humans-alike-with-microdata/">Make Your Page Consumable by Robots and Humans Alike With Microdata</a></li>
</ul>
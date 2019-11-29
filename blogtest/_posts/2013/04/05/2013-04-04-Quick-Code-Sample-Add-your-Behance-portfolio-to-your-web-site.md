---
layout: post
title: "Quick Code Sample - Add your Behance portfolio to your web site"
date: "2013-04-05T09:04:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/04/05/Quick-Code-Sample-Add-your-Behance-portfolio-to-your-web-site
guid: 4903
---

A few months ago Adobe acquired <a href="http://www.behance.net">Behance</a>, a sort-of "LinkedIn for Artists" (thanks TechChrunch for that description). At the time I didn't really pay attention, but earlier this week I spent some time on the site and was incredibly impressed. I think it is fair to assume that a majority of my visitors here fall more on the developer side than designer, but I'd still recommend you check the site out. Even as a non-designer, I found the site <i>really</i> cool. It is a pleasure to use. You can also use the site as a way to keep up with your favorite designers. Currently there are over one million users so there's a pretty huge community already. For a good example, check out the work from my coworker Greg Wilson: <a href="http://be.net/gwilson">http://be.net/gwilson</a>
<!--more-->
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-05 at 8.09.10 AM.png" />

Cool, right? I was very happy to see that Behance had an <a href="http://www.behance.net/dev">API</a>. I plan on creating a demo of this sometime next week. In the meantime though I noticed that there was no way to embed portfolio data on another site via a simple widget. I thought it might be kind of fun to build that. Every user has a public RSS feed, so I thought there might be a nice little script I could build to allow folks to embed portfolios on their personal site. Turns out, I just started reading a book on this very topic ("Third Party JavaScript"), so what I've written now may be pretty bad. It works of course, but I'm hoping this book gives me some ideas on how to do it better. (And I promise - when I finish the book I'll return to this script and tell you guys what I changed.) 

I began by creating a simple page. 

<script src="https://gist.github.com/cfjedimaster/5319111.js"></script>

You can see the script tag pointing to my behance script. I needed a way to specify a user so in this case I went with a global variable. It's possible to pass in variables via the query string, but this causes problems if you use async/deferred script tags. Now let's look at the actual script.

<script src="https://gist.github.com/cfjedimaster/5319115.js"></script>

This may be a bit complex so let me break it down for you. Start at line 43 (notice - I know the Gist displays are a bit broken lately, sorry). I check for the global variable and if it doesn't exist, I exit immediately. Otherwise, I use JSON/P to open a connection to Google's Feed API. This lets me bypass cross-domain security issues as well as turn the RSS feed at Behance into a <i>much</i> simpler JSON structure. 

One little nit here. Notice that I have to specify a callback function. All of the code on this page is meant to be self-contained. I don't want to leak out into the global variable scope and blow away any code you may have written yourself. But for the callback to work it needed to be visible globally.

So to get around that, I create a randomly named function. You can see that logic in lines 5 to 11. 

Outside of that - the code is relatively simple. Take those results. Draw it into the DOM. And that's it. The CSS portion is a bit messy. You can see it as one ginormous string in line 57. That's probably something I could do better. 

Over all though I'm pretty happy with the result. I want to thank <a href="http://gregsramblings.com/">Greg Wilson</a> for helping me improve the design. You can see the example here:

<a href="http://www.raymondcamden.com/demos/2013/apr/2/test.html">http://www.raymondcamden.com/demos/2013/apr/2/test.html</a>

I've got one little CSS issue I'd love some help with. The last thing I did was add the Behance logo to the top header. This pushed over the name a bit. If anyone has a fix for that, I'd appreciate it.

If anyone makes use of this code, please let me know.
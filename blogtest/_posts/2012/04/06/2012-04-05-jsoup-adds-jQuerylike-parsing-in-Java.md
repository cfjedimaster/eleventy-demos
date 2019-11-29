---
layout: post
title: "jsoup adds jQuery-like parsing in Java"
date: "2012-04-06T10:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2012/04/06/jsoup-adds-jQuerylike-parsing-in-Java
guid: 4583
---

Earlier this week <a href="https://twitter.com/#!/gamesover">James Moberg</a> introduced me to a cool little Java utility - <a href="http://jsoup.org/">jsoup</a>. jsoup provides jQuery-like HTML manipulation to your server. Given a string, or a URL, you can do things like, find all the images, look for links to a PDF, and so on. Basically - jQuery for the server. I thought I'd whip up a quick ColdFusion-based demo of this so I could see how well it works.
<!--more-->
<p>

I began by downloading the jar file and dropping into a folder called jars. Then, using ColdFusion 10, it was trivial to make it available to my code:

<p>

<script src="https://gist.github.com/2319685.js?file=gistfile1.cfm"></script>

<p>

I then whipped up a demo that loaded (and cached) CNN's html. I create an instance of jsoup, parse the HTML, and then run a "select" using my selector, in this case, just 'img':

<p>

<script src="https://gist.github.com/2319699.js?file=index.cfm"></script>

<p>

Notice how I can loop over the matches and grab attributes from each one. Again, very jQuery-like. I wanted to play with this a bit more free form so I created an application that lets me supply any URL and any selector. Here's that code - minus the UI cruft around it:

<p>

<script src="https://gist.github.com/2319712.js?file=tester.cfm"></script>

<p>

You can run this yourself by hitting the demo below. All in all - a very interesting Java library. Sure you could do all of this with regular expressions, but I find this syntax a heck of a lot more friendly. (And that's with me having used regex for the past 15 years.)

<p>


<a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/jsoup/tester.cfm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

Talk about synchronicity - within 10 minutes of each other, both Ben Nadel and I posted on the same topic! <a href="http://www.bennadel.com/blog/2358-Parsing-Traversing-And-Mutating-HTML-With-ColdFusion-And-jSoup.htm">Parsing, Traversing, And Mutating HTML With ColdFusion And jSoup</a>
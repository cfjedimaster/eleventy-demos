---
layout: post
title: "An example of history management in the browser"
date: "2012-12-17T16:12:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/12/17/An-example-of-history-management-in-the-browser
guid: 4811
---

What follows is an example I built to help me learn how to manipulate browser history with JavaScript. <b>Do not consider this a tutorial, an example of best practices, or anything more than a personal learning exercise.</b> This is a topic I've been meaning to learn for months and I finally took the time to wrap my head around it today. I wrote some code that seems to work well and wanted to share it, but keep in mind that I'm probably doing it wrong. Want a good explanation? Try one of the links below.
<!--more-->
<ul>
<li><a href="http://engineering.twitter.com/2012/12/implementing-pushstate-for-twittercom_7.html">Implementing pushState for twitter.com</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/DOM/Manipulating_the_browser_history">MDN: Manipulating the browser history</a></li>
<li><a href="http://html5doctor.com/history-api/">Pushing and Popping with the History API</a>
</ul>

I began by creating a super simple remote service. It simply returns an array of strings along with a 'total' value. The idea being that the front end is going to allow you to view one 'page' of content at a time. This back end is written in ColdFusion and simply returns titles of my blog entries along with a total number of results. You may click <a href="http://www.raymondcamden.com/demos/2012/dec/17/api/service.cfc?method=getdata">here</a> to see a sample of the JSON data.

The first iteration of the application was entirely client side. I wrote a quick and ugly application with simple Previous/Next links. Again, this is ColdFusion-specific, but you could imagine this in any language.

<script src="https://gist.github.com/4322635.js"></script>

You can demo this here: <a href="http://www.raymondcamden.com/demos/2012/dec/17/oldskool/">http://www.raymondcamden.com/demos/2012/dec/17/oldskool/</a>

Obviously this is kind of a lame example, but if you imagine the page using "real" layout, then every page would be a complete reload of header graphics, CSS, etc. 

In the next iteration, I rebuilt the front end using JavaScript. This is also kinda ugly, but it uses XHR to fetch pages of content.

<script src="https://gist.github.com/4322638.js"></script>

You can demo this here: <a href="http://www.raymondcamden.com/demos/2012/dec/17/newskool/">http://www.raymondcamden.com/demos/2012/dec/17/newskool/</a>

Better, right? Now each page is loaded without a full page reload. You can quickly jump back and forth to different pages. But it has two issues that the History API can help with. First, it doesn't allow you to bookmark a page. Second, if you use your browser's back button, you actually end up leaving the page entirely.

Using the History API is - for the most part - pretty simple. You can use pushState to update the URL of the browser (but not the title, all the browser vendors ignore this) as well as push information to the new page. So a simple example may look like this:

<script src="https://gist.github.com/4322701.js"></script>

Note that third argument there - you really can change the URL to anything. So I could switch to index.ruby if I wanted. But here's the crucial bit - if the user bookmarks that URL and returns to it later, your server better respond to it.

The other part that confused me was the first argument. I kept thinking of it as data I was sending to the new page. That isn't exactly right. Rather, you are associating data with that part of your history. I don't think I'm doing a great job explaining this, but think of it as data you want to use when, in the future, you return to this new history item you are creating. So for example, going from page 1 to page 2, I've passed an object. When I go to page 3, and then hit back to page 2, <i>then</i> I make use of that object. 

You make use of that data using the popstate event handler. 

<script src="https://gist.github.com/4322732.js"></script>

Now - here is where things get tricky. In Chrome, if you listen for the popstate event, you get one <b>immediately</b> after the page loads. If you use Firefox, you don't. From what I know, the <i>draft</i> spec says you should get one on page load, so Firefox is wrong here, but it is a draft spec, not a final spec. 

That made things <i>very</i> tricky for me. I essentially had to figure a way to ignore an initial popstate event in Chrome but not in Firefox. I found some possible workarounds, but none that worked well for me.

I finally came to a realization. I only needed to worry about popstate once I've made at least one change. So I simply wrote some simple code that waited until you had loaded your first new page and then registered the event listener.

<script src="https://gist.github.com/4322752.js"></script>

Make sense? Here's the complete new version. It isn't that much different from the earlier version. Also note the support for checking location.search on page load. This allows me to handle a bookmarked version of the application. (That code could be tighter!) 

<script src="https://gist.github.com/4322760.js"></script>

I tested this in Chrome and Firefox and it seems to work reasonably well. Check it out below. 

<a href="http://www.raymondcamden.com/demos/2012/dec/17/newnewskool/index.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
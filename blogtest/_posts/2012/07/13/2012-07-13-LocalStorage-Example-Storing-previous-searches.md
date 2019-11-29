---
layout: post
title: "LocalStorage Example: Storing previous searches"
date: "2012-07-13T15:07:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/07/13/LocalStorage-Example-Storing-previous-searches
guid: 4677
---

I've made it clear that I'm a huge fan of <a href="https://developer.mozilla.org/en/DOM/Storage">LocalStorage</a>. While sitting in the Houston airport for many hours this week, I decided to whip up a little example that demonstrates one of the practical uses for this feature. I built a simple Ajax-based search page and then added LocalStorage as a way to remember your previous searches. This isn't anything special, but I think it's another good example of the feature. Let's begin by taking a look at the application before any use of LocalStorage.
<!--more-->
The application makes use of Bootstrap, jQuery, and Handlebars, but for now, let's just focus on the JavaScript and the template:

<script src="https://gist.github.com/3106374.js?file=gistfile1.js"></script>

You can see that I begin by compiling my Handlebars template (this is used for the results), and then I define my click handler for the search button. All the handler does is grab the search string, pass it to a ColdFusion service that hits the database, and then passes the results to my Handlebars template. 

<img src="https://static.raymondcamden.com/images/ScreenClip103.png" />

Beautiful - and the code is rather simple. You can test this yourself here: <a href="http://www.raymondcamden.com/demos/2012/jul/13/test1.html">http://www.raymondcamden.com/demos/2012/jul/13/test1.html</a> I'd recommend searching for oil, moon, paint, and beer.

Ok, now let's talk about the next version. The updated version will use LocalStorage to remember your last five searches. I decided on five mostly because it just felt right. I thought ten might be a bit much. 

To store the last five values, I'll use an array. You can't store complex variables in LocalStorage, but you can easily serialize them with JSON. So for example:

<script src="https://gist.github.com/3106426.js?file=gistfile1.js"></script>

That isn't too complex, is it? Storing the value isn't too hard either. I do a check to see if the value exists in the array, and if not, put it in the front and pop one off the end if the array is too big.

<script src="https://gist.github.com/3106433.js?file=gistfile1.js"></script>

All that's left then is to simply write out the past searches and listen for click events on them.

<script src="https://gist.github.com/3106443.js?file=gistfile1.js"></script>

And voila - I can now remember your last five searches <i>and</i> provide an easy way for you to quickly rerun them. The code samples above are only the most important bits. I encourage you to View Source on the updated version for the complete example. (The ColdFusion code is just a simple query API. You can view that template <a href="https://gist.github.com/3106450">here</a>.)

<a href="http://www.raymondcamden.com/demos/2012/jul/13/test2.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
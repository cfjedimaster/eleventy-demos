---
layout: post
title: "Ask a Jedi: Figuring out how many rows of data to use with Spry"
date: "2006-12-22T09:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/22/Ask-a-Jedi-Figuring-out-how-many-rows-of-data-to-use-with-Spry
guid: 1730
---

Bob sent in an interesting email to me this morning:

<blockquote>
Ray, we're about to use spry on one of our sites but i was wondering what you
would recommend to be the max records to return in the XML?  We may have 2,000
records returned at a time (in a directory format)? 

Do you have any
performance tips etc.
</blockquote>

When it comes to determining how many rows of data should be returned, you can't just focus on the number of rows. You must also consider the size of each row. So imagine a set of XML that had one column per row:

<code>
&lt;people&gt;
&lt;name&gt;Jack Abbot&lt;/name&gt;
&lt;name&gt;Victor Newman&lt;/name&gt;
&lt;name&gt;Nick Newman&lt;/name&gt;
&lt;/people&gt;
</code>

In the example above the XML only contains the person's name. If it contained other information (gender, age, marital status, salary, etc), then the size of the XML dramatically increases with each row. So the first thing you want to do is get a gut feeling for the size of your rows. 

Next you want to figure out how long its taking for the browser to load your XML. The best tool for that (well, for Firefox users) would be <a href="http://www.getfirebug.com/">Firebug</a>. It lets you trace AJAX requests. This includes the URL, the response, and important to you in this post is the time it took to load. If you can't use Firebug, you should also look at <a href="http://kevinlangdon.com/serviceCapture/">ServiceCapture</a>.  I actually use them both as ServiceCapture is great for monitoring Flash Remoting requests.

One of these days I'm going to get together a simple demo showing how to combine client side paging and server side paging to handle very large data sets in Spry.
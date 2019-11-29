---
layout: post
title: "Reminder - Use the proper jQuery Mobile event handler"
date: "2012-04-01T16:04:00+06:00"
categories: [jquery,mobile]
tags: []
banner_image: 
permalink: /2012/04/01/Reminder-Use-the-proper-jQuery-Mobile-event-handler
guid: 4576
---

I feel like I've got a good handle on <a href="http://jquerymobile.com/demos/1.1.0-rc.1/docs/api/events.html">jQuery Mobile event handlers</a>, but I just found myself making a mistake that led to some pretty severe performance issues. Assuming I'm not the only one to screw this up, I thought a good demo of my bug would be helpful.
<p>
<!--more-->
One of the first things you run into when learning jQuery Mobile is how to replicate the jQuery behavior of $(document).ready. In fact, it's called out in the jQuery Mobile docs immediately:
<p>
<blockquote>
<h2>Important: Use pageInit(), not $(document).ready()</h2>

The first thing you learn in jQuery is to call code inside the $(document).ready() function so everything will execute as soon as the DOM is loaded. However, in jQuery Mobile, Ajax is used to load the contents of each page into the DOM as you navigate, and the DOM ready handler only executes for the first page. To execute code whenever a new page is loaded and created, you can bind to the pageinit event. This event is explained in detail at the bottom of this page.
</blockquote>
<p>
Makes sense, right? However, what if you want something to happen every time a page is shown? The pageinit event fires only when the page is created. If you want to run something everytime a page is displayed, you would use pageshow instead.
<p>
Ok... still simple, right? But let me show you how I screwed up. I needed to dynamically display some text whenever a page was shown. Here's what I did:
<p>

<code>
$("#page2").on("pageshow",function(e) {
	$("#status").html("&lt;p&gt;Ran at "+ new Date() + "&lt;/p&gt;");	

});
</code>

<p>

So far so good. The page also contained a button that, when clicked, would perform an Ajax request. I updated my code to add a click listener. In the code below, I fake an Ajax request by using setTimeout.

<p>

<code>
$("#page2").on("pageshow",function(e) {
	$("#status").html("&lt;p&gt;Ran at "+ new Date() + "&lt;/p&gt;");	

	$("#testButton").on("click", function(e) {
		//fake a ajax hit
		$("#status").html("&lt;p&gt;Loading...&lt;/p&gt;");
		console.log("Running click handler: "+Math.random())
		setTimeout(function() {
			$("#status").html("&lt;p&gt;Done: "+Math.random() + "&lt;/p&gt;");
		},400);
	});

});
</code>

<p>

If you know what's going to happen already - pat yourself on the back. If you don't - notice the console.log message. The first time I visit the page, I get one message in the console:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip61.png" />

<p>

Ok, now I hit the Home button to return to the initial page in my jQuery Mobile app, returned to the page, and hit the button again:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip62.png" />

<p>

I now had 2 console messages (plus the original) shown. If I left and came back a few times, it just got worse and worse. What makes this even more evil is that - without the console messages - you can't tell there's a problem at all. What happened though is that another tester ran the application a while and noticed worse and worse performance. The real code was doing an Ajax call retrieving a lot of data. Now imagine that running 8-10 times and the network traffic will grow incredibly.

<p>

You can demo this yourself here: <a href="http://raymondcamden.com/demos/2012/apr/1/test.html">http://raymondcamden.com/demos/2012/apr/1/test.html</a>. I encourage you to try it without your console being open and see if - like me - you don't see an issue. Then open your console and the bug should then be obvious.

<p>

The solution was to simply use the right event for each of my features. Here's an updated version:

<p>

<code>
$("#page2").on("pageinit",function(e) {

	$("#testButton").on("click", function(e) {
		//fake a ajax hit
		$("#status").html("&lt;p&gt;Loading...&lt;/p&gt;");
		console.log("Running click handler: "+Math.random())
		setTimeout(function() {
			$("#status").html("&lt;p&gt;Done: "+Math.random() + "&lt;/p&gt;");
		},400);
	});

});

$("#page2").on("pageshow",function(e) {
     $("#status").html("&lt;p&gt;Ran at "+ new Date() + "&lt;/p&gt;");  

});
</code>

<p>

You can demo this version here: <a href="http://raymondcamden.com/demos/2012/apr/1/test2.html">http://raymondcamden.com/demos/2012/apr/1/test2.html</a>
---
layout: post
title: "Reminder - there is a maximum number of network connections in your browser"
date: "2011-02-23T10:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/02/23/Reminder-there-is-a-maximum-number-of-network-connections-in-your-browser
guid: 4134
---

This is something I've known for a while but tend to forget until it slaps me across the face. A reader wrote in with something odd she saw on her web site. She had a basic search site where some of the content was a bit slow to render. Instead of delaying the search results she simply used an Ajax call to update the results in real time. I think this is a great idea. Even if the "total" time remains the same (or close to it), the "perceived" time is <b>much</b> lower for the end user. However, in her testing she noticed something odd. She thought she was running N ajax based calls all at once but in her network tools they appeared to come in "chained", ie one after another. She had expected that if each call took about 1 second and she made 30 of them, they should run asynchronously and completely run within 1 second. (Or within a second or two given network latency randomness.) I whipped up a quick example of this so I could see this in action.
<!--more-->
<p>

First, I began with a simple front end client that uses jQuery. This topic isn't jQuery specific of course but all good Ajax posts should mention jQuery at least once.

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	for(var i=1; i&lt;= 20; i++) {
		runCall(i);
	}
})

function runCall(x) {
	console.log('doing call '+x);
	$.post("slow.cfm",{% raw %}{"id":x}{% endraw %}, function(res,code) {
		$("#show"+x).html("Result was "+res);
		console.log("back and res="+res);
	});
}
&lt;/script&gt;


&lt;cfloop index="x" from="1" to="20"&gt;
	&lt;cfoutput&gt;
	&lt;div id="show#x#""&gt;&lt;/div&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

My template has 20 divs, representing search results, and on document load will run 20 calls to fetch data for each div. Warning - I'm using console.log for debugging. This is not a bug. When you click my demo, please do not report this as a bug. <b>Ajax developers should use a browser (or browser+plugin) that supports console!</b> All in all, pretty simple, right? Technically this is not "20 at once" since I have a loop, but I think we agree that it is close enough for our testing. 

<p>

For the back end I wrote a quick ColdFusion script to simulate a slow process and result. It's hard to write slow ColdFusion code so I made use of the sleep command. 

<p>

<code>
&lt;cfset sleep(2000)&gt;
&lt;cfparam name="form.id" default="1"&gt;
&lt;cfoutput&gt;#form.id#=#randRange(1,100)#&lt;/cfoutput&gt;
</code>

<p>

Running this in the browser shows some interesting results. I tested in both Chrome and Firefox. While I prefer Chrome, I thought Firefox (plus Firebug) had the best graphic result:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip30.png" />

<p>

I think you can clearly see that the results are staggered. You can test this yourself by clicking the button below - but have Firebug or Chrome Dev Tools ready to go:

<p>

<a href="http://www.coldfusionjedi.com/demos/feb232011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

For me, I clearly see "spurts" of loading. Typically I saw 2 or 4 results pop in at once. This is not a bug though and is completely normal. The browser has set limits on how many network requests can be made to a server. This is both good for the client as well as the server. We see this every day when loading a web page, especially over mobile. Things 'pop' into view over time. However on a broadband connection it can sometimes be easy to forget. In this very clear cut example we ask the browser to quickly make a bunch of network requests at once and we can see the 'throttle' more clearly.
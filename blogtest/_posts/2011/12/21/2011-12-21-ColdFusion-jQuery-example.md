---
layout: post
title: "ColdFusion + jQuery example"
date: "2011-12-21T17:12:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/12/21/ColdFusion-jQuery-example
guid: 4468
---

As my last act before heading out for vacation (ok, I lie, you know I'm going to blog again, at least 5-6 times), here is an incredibly simple jQuery example involving ColdFusion on the back end. <b>This is not new.</b> But I had a reader write in looking for a very specific example, and I couldn't find a simple blog entry of mine to meet his needs. Basically:
<!--more-->
<p/>
<ol>
<li>Click a button
<li>Tell the user the slow process is begun
<li>Fire off an Ajax request to the server
<li>Show the response
</ol>

<p>

I've done this in most all of my Ajax demos, but a quick little example couldn't hurt. Here is the front end. 

<p>

<pre><code class="language-markup">&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#buttonTest").click(function() {
		//cache the status div
		var status = $("#status");
		
		//First, do a statuc message
		status.html("&lt;i&gt;Loading awesome. Please stand by.&lt;/i&gt;");
		
		//Now hit our slow process...
		$.get("slow.cfm", {}, function(res,code) {
			//Assume the result is basic HTML, so just show it
			status.html(res);
		});

	});

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;input type="button" id="buttonTest" value="Push for Love"&gt;

&lt;div id="status"&gt;&lt;/div&gt;
</code></pre>

<p>

The logic is rather simple. On clicking a button, update a div to tell the user what is going on, then fire off the XHR request. Normally I'd hit a CFC and work with complex results, but in this case we are assuming a nicely formatted result that can be dumped into the div.

<p>

Our server side code....

<p>

<pre><code class="language-markup">&lt;cfset sleep(2000)&gt;

&lt;cfoutput&gt;Hello from awesome. #randRange(1,100)#&lt;/cfoutput&gt;
</code></pre>

<p>

The sleep command there is simply to help simulate a slow process. 

<p>

And that's it. Sorry if this bores folks, but even when I do super simple examples for readers, I've got to turn it into a blog entry. :)
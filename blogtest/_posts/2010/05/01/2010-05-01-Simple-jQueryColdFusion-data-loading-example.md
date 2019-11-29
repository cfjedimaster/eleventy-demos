---
layout: post
title: "Simple jQuery/ColdFusion data loading example"
date: "2010-05-01T23:05:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/05/01/Simple-jQueryColdFusion-data-loading-example
guid: 3800
---

A reader, Andy, was looking for a very simple example of how jQuery can be used to load data from ColdFusion. I've done this many times before, but he wanted the bare bones, simplest demo I could muster. I covered this before, but I thought I'd share the code in case others were looking for simple examples as well.
<!--more-->
<p/>

I'll begin with the initial template - the one that will use jQuery. It's going to have a grand total of one button and clicking that will fire off our request to ColdFusion.

<p/>

<pre><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//I handle supporting the click on the button
	$("#testButton").click(function() {
		//I'm going to make the slow request, but first, tell the user
		$("#status").html("Please stand by. I'm doing important stuff.")
		//Now disable the button cuz I'm working
		$(this).attr("disabled", true)
		//Fire it off!
		$.get("test2.cfm", {},  function(data,status) {
			//This portion is run when all done
			//First clear the status
			$("#status").html("")
			//Set the response
			$("#result").html(data)
			//Re-enable the button
			$("#testButton").removeAttr("disabled")
		})
	})

})
&lt;/script&gt;
&lt;/head&gt;

&lt;h2&gt;Testing a slow AJAX process&lt;/h2&gt;

&lt;p&gt;
Click the button below to start the process. It will call a remote service that will take about 5 seconds to run.
&lt;/p&gt;

&lt;input type="button" id="testButton" value="Click me!"&gt;

&lt;!--- This is the div we use to let the user know what's going on. ---&gt;
&lt;div id="status"&gt;&lt;/div&gt;

&lt;!--- This is the div for the result. ---&gt;
&lt;div id="result"&gt;&lt;/div&gt;
</code></pre>

<p/>

Let's start at the bottom. Notice I've got two divs. One is going to be used as a status area. It will be used by jQuery to let the user know something is going on. (Ajax is not the same as instantaneous.) Moving up, I've got one main block of code all within $(document).ready. This is shorthand in jQuery for "Do this when the page is done." Within it is one core function - an event handler for my button. When clicking we will first update the status div with a loading message and then disable the button. (Sometimes you have to do that or your users may go click crazy.) Next we actually fire off the Ajax request with the $.get command. test2.cfm is where my ColdFusion logic is (and I'll share that code next), but in this example we aren't doing much with it. I don't grab any form data to pass to the script. I simply run it. I've then set up a response function to run. It first clears the status message, then sets the result into my div, and finally re-enables the button. 

<p/>

test2.cfm doesn't do much at all. I simply made it a bit slow so that the loading message would be nice and obvious:

<p/>

<pre><code class="language-markup">&lt;cfset sleep(3000)&gt;
&lt;cfoutput&gt;Hello world, #timeFormat(now(), "long")#&lt;/cfoutput&gt;
</code></pre>

<p/>

Not terribly much to it, but I thought it might be useful for folks who wanted a quick demo of how easy it is do Ajax with jQuery and ColdFusion. I've attached a zip of the two files to this blog entry and you can run the demo yourself.
<p>

<a href='https://static.raymondcamden.com/enclosures/recontactform.zip'>Download attached file.</a></p>
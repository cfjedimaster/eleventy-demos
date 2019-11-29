---
layout: post
title: "GET vs POST for Ajax Requests"
date: "2016-04-21T08:36:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/gpbanner.jpg
permalink: /2016/04/21/get-vs-post-for-ajax-requests
---

I was preparing to work on another blog post when it occurred to me that I'd share a tip that new JavaScript developers may appreciate. For people new to JavaScript and Ajax, one of the things you may not necessarily think about much is what *method* to use when creating a network request to your server.

<!--more-->

Imagine for a moment that you've got a form that you want to send to your server via Ajax instead of a regular form submission. You include jQuery, because why not, it makes working with Ajax incredibly easy, and write up a simple handler to do the request. Here's some pseudo-code for how you may handle it. 

<pre><code class="language-javascript">
$("#someForm").on("submit", function(e) {
	e.preventDefault();
	
	//get the one field value
	var name = $("#name").val();
	
	//pretend we don't need validation
	
	//send to server
	$.get("/savedata", {% raw %}{name: name}{% endraw %}, function(result) {
		//tell the user thank you, maybe clear the form, etc
	});
	
});
</code></pre>

Given that we have an incredibly simple form, our code isn't too complex here. Let's look at how this looks in Chrome's Network panel:

<img src="https://static.raymondcamden.com/images/2016/04/gp1.jpg" class="imgborder">

When making a GET request, your data is passed over the URL. You can see it in devtools. I entered "Raymond" as a value and it was appended to the URL. Both the value and the key for the variable. 

So far so good. But let's modify the form a bit. We'll add a comment field (with a textarea) and modify the JavaScript code to grab the value and include it as well. Here's the updated code.

<pre><code class="language-javascript">
$("#someForm").on("submit", function(e) {
	e.preventDefault();
	
	//get the name field value
	var name = $("#name").val();
	//get the comments
	var comments = $("#comments").val();
				
	//pretend we don't need validation
	
	//send to server
	$.get("./test.html", {% raw %}{name: name, comments:comments}{% endraw %}, function(result) {
		//tell the user thank you, maybe clear the form, etc
	});
	
});
</code></pre>

And here is the result in dev tools:

<img src="https://static.raymondcamden.com/images/2016/04/gp2a.jpg" class="imgborder">

Notice that the text from the comment field was appended to the end of the URL. Again, this is expected, but this is where you can get bit in the rear. What happens when you release this code to the wild and a person enters a lot of text? Bad things. Well, possibly bad things.

In the past, browsers had limits on how long of a URL they would support. So if you tried to send an XHR to a URL that was beyond this limit, the browser would simply trim it. It wouldn't throw an error, and the server would have no idea what happened, but the result you got on the server would not match what the user actually entered.

I ran into this myself when working on the front end to a CMS. I used a simple GET request to send form data to the server and part of that was a big block of text and HTML. In my testing, where I entered just a few quick characters, it always worked, but in 'real' testing, it failed pretty quickly.

Modern browsers, however, seem to have removed this limit. You can read more about it [here](http://stackoverflow.com/a/15090286/52160) on Stack Overflow. However, you can then run into web server issues. Here is how my Apache server responded when I had too much text in the query string:

<img src="https://static.raymondcamden.com/images/2016/04/gp3.jpg" class="imgborder">

That's a 414 error - Request-URI too long.

The fix, of course, is to switch to a POST operation where there is no (practical) limits on the size of the values you send. For jQuery it would be all of two seconds to switch from $.get or $.post, or if you are using $.ajax to set the type to "post". Your server side code, if it cares about the method, will need to change too. (Some languages will let you easily collapse querystring/form variables into one scope. That's convenient for sure.)

Ok, so the summary for all this is rather simple. When building an Ajax application, actually take a few minutes to think about the method you'll use to send data to your server. You can stop reading now if you want.

So... at this point, I know there are some REST purists who want to start the discussion of how a proper API will enforce GET for retrieving data, POST for creating data, and so forth. There is merit to that. (Although what you would consider "sending a contact form" as is beyond me.) I also know that a lot of us aren't necessarily building (or working with) fully REST compliant apps. Heck, your entire server may have a grand total of one "API", that contact form, and it is in that spirit that I hope people find this useful.
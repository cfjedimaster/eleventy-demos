---
layout: post
title: "Spot the error - it may not be what you think"
date: "2011-04-12T13:04:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/04/12/Spot-the-error-it-may-not-be-what-you-think
guid: 4192
---

I just helped a coworker diagnose this issue and it can be <i>incredibly</i> subtle if you aren't paying attention. Consider the following simple form:
<!--more-->
<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#myButton").click(function() {
		$.post("test.cfc?method=whatever&returnformat=json", {}, function(res) {
			console.log('back from cfc');
		},"json");
	});
});


&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
	&lt;form method="post"&gt;	
	&lt;input type="button" id="myButton" value="Click me like you mean it."&gt;
	&lt;/form&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I've got a button that - when clicked -  will fire off an event jQuery is listening to. This event handler fires off a post to a CFC with the result then logged to the console. Works perfectly. Now let's tweak it just a tiny bit...

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#myButton").click(function() {
		$.post("test.cfc?method=whatever&returnformat=json", {}, function(res) {
			console.log('back from cfc');
		},"json");
	});
});


&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
	&lt;form method="post"&gt;	
	&lt;input type="image" src="meatwork.jpg" id="myButton" value="Click me like you mean it." &gt;
	&lt;/form&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Can you guess what happened here? Try to before scrolling down...

<p>

<br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/>

<p>

So - when clicked - if you had your network tools open in Chrome or Firefox, you would see a quick glimpse of a request and then it would go away. Why? The image input type is actually like a submit button. Unlike type=button that does - well - nothing - the image type actually works much like a submit button. What happened was that the entire form posted. Easy to miss especially if you are testing locally. A quick fix is to just prevent the default behavior:

<p>

<code>
$("#myButton").click(function(e) {
	e.preventDefault();
	$.post("test.cfc?method=whatever&returnformat=json", {}, function(res) {
		console.log('back from cfc');
	},"json");
});
</code>

<p>

Anyone else ever get bitten by this?
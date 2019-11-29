---
layout: post
title: "Demo: Using jQuery and perserving UI state"
date: "2009-11-05T10:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/11/05/Demo-Using-jQuery-and-perserving-UI-state
guid: 3591
---

This week I had an interesting (email) conversation with a reader. Jason is a .Net developer using jQuery to build a simple form. On his page he had a UI feature where one of two DIVs were displayed. He had no problem with handling the logic of showing one div or another on the client side, but he was interested in how he could persist that change when he submitted his form. I worked up a simple demo of one way that this could be handled.
<!--more-->
I began by creating a very simple form. 

<code>
&lt;form id="myform" method="post"&gt;
name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
&lt;input type="submit"&gt;

&lt;/form&gt;
</code>

Instead of using two divs, I went with div that could be hidden or shown. The idea is that the div could be used for instructions. 

<code>
&lt;input type="button" id="toggleinstructions" value="Toggle Instructions"&gt;
&lt;div id="instructions" style="display:none"&gt;These are the instructions for the slow people.&lt;/div&gt;
</code>

Next I whipped up some quick jQuery to support the toggle:

<code>
$("#toggleinstructions").click(function() {
	$("#instructions").toggle()
})
</code>

So far so good. How can we help persist the state of the instructions? Well one way would be with cookies. We could modify the click event handler to set a cookie every time the status changed. My problem with this though is that it seems a bit overkill to use a cookie just to remember the status of a UI item on the form. I decided to take another approach. What if we passed the status of the div when the form is submitted? 

The first thing I did was to add a new hidden form field to the form:

<code>
&lt;input type="hidden" name="instruction_status" id="instruction_status"&gt;
</code>

I then added a form submit handler:

<code>
$("#myform").submit(function() {
	status = $("#instructions").is(":visible")
	$("#instruction_status").val(status)
})
</code>

This was my first time making use of the jQuery <a href="http://docs.jquery.com/Traversing/is#expr">IS</a> operator. This was a new one for me. As you can guess, it allows you to run a simple check on the currently selected item. In this case I'm checking for the visible property. This will return a boolean that then gets passed to the hidden form field.

Here is the complete template. You can see that I've added some server side logic to check for the hidden field and set the visibility accordingly.

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#toggleinstructions").click(function() {
		$("#instructions").toggle()
	})
	
	$("#myform").submit(function() {
		status = $("#instructions").is(":visible")
		console.log(status)
		$("#instruction_status").val(status)
	})
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfparam name="form.instruction_status" default="false"&gt;
&lt;input type="button" id="toggleinstructions" value="Toggle Instructions"&gt;
&lt;div id="instructions" &lt;cfif form.instruction_status is false&gt;style="display:none"&lt;/cfif&gt;&gt;These are the instructions for the slow people.&lt;/div&gt;

&lt;form id="myform" method="post"&gt;
&lt;input type="hidden" name="instruction_status" id="instruction_status"&gt;
name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
&lt;input type="submit"&gt;

&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfdump var="#form#"&gt;
</code>

Does it make sense for me to use a hidden form field for this? I don't know. It kind of feels like I'm cluttering up the form with non-essential data. Then again, I do think I prefer this over the cookie approach. Either way - it's just one more way to solve a problem in jQuery!
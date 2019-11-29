---
layout: post
title: "jQuery Quickie: On form change update a div"
date: "2011-05-23T14:05:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2011/05/23/jQuery-Quickie-On-form-change-update-a-div
guid: 4244
---

This question came to me on Saturday and I was pretty surprised by how quick it was to solve. I say that even being an already huge believer in the thinking that jQuery can basically out trump Unicorns for pure magic and awesomeness. Basically the issue was this. The reader had a set of form fields (text boxes, checkboxes, drop downs, etc), and if <i>any</i> of them changed, she wanted to update a div that was driven by the current values of the form. If you get rid of the console.log messages I used in my example, the code takes a grand total of three lines. Here's what I built:
<!--more-->
<p>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#mainForm").change(function() {
		console.log("changed...");
		var data = $(this).serialize();
		console.log(data);
		$("#results").load("test2.cfm?"+data);		
	})
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="mainForm"&gt;
	name: &lt;input type="text" name="name" /&gt;&lt;br/&gt;
	age: &lt;input type="text" name="age" /&gt;&lt;br/&gt;
	gender: 
	&lt;select name="gender"&gt;
		&lt;option value="m"&gt;Male&lt;/option&gt;
		&lt;option value="f"&gt;Female&lt;/option&gt;
	&lt;/select&gt;&lt;br/&gt;
	foo: &lt;input type="radio" name="foo" value="1"&gt;One&lt;br/&gt;
	&lt;input type="radio" name="foo" value="2"&gt;Two&lt;br/&gt;
	&lt;input type="radio" name="foo" value="3"&gt;Three&lt;br/&gt;
	goo: &lt;input type="checkbox" name="goo" value="1"&gt;One&lt;br/&gt;
	&lt;input type="checkbox" name="goo" value="2"&gt;Two&lt;br/&gt;
	&lt;input type="checkbox" name="goo" value="3"&gt;Three&lt;br/&gt;
	&lt;p&gt;
	&lt;input type="submit"&gt;
&lt;/form&gt;

&lt;div id="results"&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The code for my solution basically comes down to 3 parts:

<p>

<ol>
<li>Listen for form changes by simply binding to the form and the change event. jQuery will listen in to all the fields inside the form.
<li>Quickly turn the form into data I can send over the wire using serialize(). 
<li>Tell jQuery to do a quick GET on the URL and load the results into my div.
</ol>

<p>

And that's it. My test2.cfm file just echos back the URL scope, but obviously would need to actually do something with those values. If you want to try this yourself, just hit the big demo button below. And yes - I removed the console.log messages. *grumble* ;)

<p>

<a href="http://www.raymondcamden.com/demos/may232011/test.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
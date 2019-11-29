---
layout: post
title: "Linking Two (or more) jQuery Autocompletes"
date: "2010-04-27T09:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/04/27/Linking-Two-or-more-jQuery-Autocompletes
guid: 3792
---

A few weeks ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2010/4/12/Playing-with-jQuery-UIs-Autocomplete-Control">blog post</a> on jQuery UI's <a href="http://jqueryui.com/demos/autocomplete/">autocomplete</a> control. I found it to be simple and powerful - both pretty typical for jQuery.
<!--more-->
<p>

One of my readers, Srinivas, asked an interesting question in the comments. He wanted to know if it was possible to use the value of one autocomplete control in the source of another. My initial solution was to simply make the source point to the value of that control. However, this had a pretty obvious flaw. Here is the code Srinivas used, and see if you can find the issue:

<p>

<code>
$(function() {
   $("#department").autocomplete({
      source: "test2.cfm"
   });
   $("#location").autocomplete({
      source: "test2.cfm?department="+$("#department").val() 
   });
});
</code>

<p>

This technically works as written, but not as expected. (Well, not to my slow mind at first.) The problem with this code is that it runs once - on start up. So when the document loads, I first create an autocomplete on department and then a second one, immediately, on location. So at the time of the page loading, the department value is probably blank. (It's possible the HTML has a predefined value.) Obviously that isn't what we wanted. Let's look at a modified version.

<p>

<code>
$(function() {
	$("#department").autocomplete({
		source: "test2.cfm?vType=department",
		select:function(event,ui) {
			var sel = ui.item.value
			$("#location").autocomplete("option","source", "test2.cfm?vType=location&department="+escape(sel))
		}
	});
	$("#location").autocomplete({
		source: "test2.cfm?vType=location&"
	});
});
</code>

<p>

In this one we've used the select attribute for the first autocomplete to tell jQuery to run a function when a value is selected. I then use the autocomplete API to update the source option for that control to include the value that was selected. 

<p>

That by itself is probably good enough, but it only works with auto complete selections. You may want to monitor <i>all</i> changes to the control. Here is another modified version that will handle it. It can probably be done even slimmer.

<p>

<code>
$(function() {
	$("#department").change(function(e) {
		$("#location").autocomplete("option","source", "test2.cfm?vType=location&department="+$(this).val())
	})
	$("#department").autocomplete({
		source: "test2.cfm?vType=department",
		select:function(event,ui) {
			var sel = ui.item.value
			$("#location").autocomplete("option","source", "test2.cfm?vType=location&department="+escape(sel))
		}
	});
	$("#location").autocomplete({
		source: "test2.cfm?vType=location&"
	});
});
</code>

<p>

Finally - note that this example makes use of the string value from the initial autocomplete. Don't forget that jQuery UI's autocomplete control allows you to return both a label and a value (like a primary key). So you could modify this code to pass a primary key instead of a string.
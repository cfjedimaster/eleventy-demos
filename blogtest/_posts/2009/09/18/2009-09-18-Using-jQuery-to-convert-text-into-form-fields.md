---
layout: post
title: "Using jQuery to convert text into form fields"
date: "2009-09-18T18:09:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/09/18/Using-jQuery-to-convert-text-into-form-fields
guid: 3531
---

I'm working on a new project now (Picard FTW - Engage!) and it involves converting some existing JavaScript. The "old" JavaScript works fine, but is <i>very</i> difficult to get to and also suffers from the fact that it isn't jQuery. That's a huge problem if you ask me. So as I work through the project I'm slowly converting various dynamic elements into ColdFusion. One of those elements was pretty interesting. A list of fields had an associated piece of metadata. Each piece was represented in simple text. Next to it was an edit link. Clicking edit changed the plain text into a drop down. I reworked this into jQuery and this is what I came up.
<!--more-->
First let's define the data. My form will have a list of movies. For each movie there is a simple rating system based on 4 values: Hated It, Disliked It, Liked It, Loved It. It is assumed that the user has already selected some values which end up being rendered as hidden form fields:

<code>
star wars: &lt;span class="changeable"&gt;&lt;input type="hidden" name="starwars" value="4"&gt;Loved It - &lt;a href="" class="edit"&gt;edit&lt;/a&gt;&lt;/span&gt;&lt;br/&gt;
star trek: &lt;span class="changeable"&gt;&lt;input type="hidden" name="startrek" value="3"&gt;Liked It - &lt;a href="" class="edit"&gt;edit&lt;/a&gt;&lt;/span&gt;&lt;br/&gt;
</code>

This wouldn't normally be hard coded - it would come in dynamically via ColdFusion. But you get the idea. Notice that I've wrapped the hidden field, the current text, and a link within a span. Ok, now for the jQuery:

<code>
$(document).ready(function() {

	//used for our drop downs
	var values = [1,2,3,4]
	var labels = ["Hated It","Disliked It","Liked It","Loved It"]
	
	$(".changeable a.edit").click(function() {
		//find the hidden item
		var hiddenItem = $("input:hidden", $(this).parent())
		//get the current val
		var currentVal = hiddenItem.val()
		//get the name
		var currentName = hiddenItem.attr("name");
		//now we can draw our drop down and select the right val
		var s = "&lt;select name=\""+currentName+"\"&gt;";
		//hard coded values for our drop down
		for(var i=0;i&lt;values.length;i++) {
			s+= "&lt;option value=\"" + values[i] + "\""
			if(currentVal == values[i]) s+= " selected"
			s+= "&gt;" + labels[i] + "&lt;/option&gt;"
		}
		s += "&lt;/select&gt;"
		//now replace
		$(this).parent().html(s)
		return false	
	})

})
</code>

First notice I've got two hard coded values. These represent the values and labels for the drop down I'll build later. Again, this would probably be dynamic. Don't forget ColdFusion provides a nice utility function, toScript, to make it easy to convert ColdFusion variables into JavaScript.

Now let's walk through the main function. My selector looks for links with the class edit with DOM items with the class changeable. I've binded to the click event for the link. This matches the link within the span I used. But I need to get information from the rest of the span. So I grab a pointer to the hidden form field by doing a selector against the parent of the link. Does that make sense? Ie: "jQuery, within the <b>parent</b> of what you just found please look for a hidden input field." Once I have that I can get the value as well as the name.

Once I have the name, and the current value, building the drop down is just a matter of string builder. I use the values/labels variables and just create the select. When done I can replace the link for the span. Remember that $(this) represents the original link so $(this).parent() will be the span. 

You can see a demo of this here: <a href="http://www.raymondcamden.com/demos/changedropdown/test.cfm">http://www.coldfusionjedi.com/demos/changedropdown/test.cfm</a>

And here is the complete script:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

	//used for our drop downs
	var values = [1,2,3,4]
	var labels = ["Hated It","Disliked It","Liked It","Loved It"]
	
	$(".changeable a.edit").click(function() {
		//find the hidden item
		var hiddenItem = $("input:hidden", $(this).parent())
		//get the current val
		var currentVal = hiddenItem.val()
		//get the name
		var currentName = hiddenItem.attr("name");
		//now we can draw our drop down and select the right val
		var s = "&lt;select name=\""+currentName+"\"&gt;";
		//hard coded values for our drop down
		for(var i=0;i&lt;values.length;i++) {
			s+= "&lt;option value=\"" + values[i] + "\""
			if(currentVal == values[i]) s+= " selected"
			s+= "&gt;" + labels[i] + "&lt;/option&gt;"
		}
		s += "&lt;/select&gt;"
		//now replace
		$(this).parent().html(s)
		return false	
	})

})

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form method="post"&gt;

star wars: &lt;span class="changeable"&gt;&lt;input type="hidden" name="starwars" value="4"&gt;Loved It - &lt;a href="" class="edit"&gt;edit&lt;/a&gt;&lt;/span&gt;&lt;br/&gt;
star trek: &lt;span class="changeable"&gt;&lt;input type="hidden" name="startrek" value="3"&gt;Liked It - &lt;a href="" class="edit"&gt;edit&lt;/a&gt;&lt;/span&gt;&lt;br/&gt;

&lt;input type="submit" value="click me like you mean it"&gt;
&lt;/form&gt;

&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfdump var="#form#" label="form"&gt;
&lt;/cfif&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>
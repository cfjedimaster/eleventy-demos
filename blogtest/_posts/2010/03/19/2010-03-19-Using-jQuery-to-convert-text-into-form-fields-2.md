---
layout: post
title: "Using jQuery to convert text into form fields (2)"
date: "2010-03-19T14:03:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/03/19/Using-jQuery-to-convert-text-into-form-fields-2
guid: 3756
---

Many months ago I <a href="http://www.raymondcamden.com/index.cfm/2009/9/18/Using-jQuery-to-convert-text-into-form-fields#c10564176-B748-CDC1-1EA6C99B367722E5">posted</a> a blog entry describing how to use jQuery to turn a text item into a drop down. Read the older entry for more information on what I mean, but the basic gist is - you click an edit link and a piece of text turns into a drop down. This worked fine but a user asked about converting the drop down back into plain text. I worked on it a bit and it turns out it isn't that difficult.
<!--more-->
<p/>
To begin with, I added a new event listener to handle the change event in my drop down. Because the drop downs were created after the document was loaded, I had to use the live() feature. <b>Note</b> - before jQuery 1.4 it was not possible to use live with the change event. If you plan on using my code, be sure you are using the latest jQuery build. Here is the event handler I used:
<p/>
<code>
$(".selector").live("change", function() {
	//first get the value
	var val = $(this).val()
	var name = $(this).attr("name")
	var s = "&lt;input type=\"hidden\" name=\"" + name + "\" value=\"" + val +"\"&gt;"
	s += labels[val-1] + " - "
	s += "&lt;a href=\"\" class=\"edit\"&gt;edit&lt;/a&gt;"
	$(this).parent().html(s)
})
</code>
<p/>
As you can see, I simply grab the value and name from the drop down and recreate the text that was there originally. I had to make one more tweak. Since I was now generating edit links on the fly as well, I changed my original click listener for them to a live as well. So basically, I've got two live events. One to listen for "Edit" clicks, one to listen for "Change" events. You can play with a demo of this <a href="http://www.coldfusionjedi.com/demos/march192010/test2.cfm">here</a>. Here is the complete source.
<p/>
<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

	//used for our drop downs
	var values = [1,2,3,4]
	var labels = ["Hated It","Disliked It","Liked It","Loved It"]
	
	$(".changeable a.edit").live("click",function() {
		//find the hidden item
		var hiddenItem = $("input:hidden", $(this).parent())
		//get the current val
		var currentVal = hiddenItem.val()
		//get the name
		var currentName = hiddenItem.attr("name");
		//now we can draw our drop down and select the right val
		var s = "&lt;select class=\"selector\" name=\""+currentName+"\"&gt;";
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

	$(".selector").live("change", function() {
		//first get the value
		var val = $(this).val()
		var name = $(this).attr("name")
		var s = "&lt;input type=\"hidden\" name=\"" + name + "\" value=\"" + val +"\"&gt;"
		s += labels[val-1] + " - "
		s += "&lt;a href=\"\" class=\"edit\"&gt;edit&lt;/a&gt;"
		$(this).parent().html(s)
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
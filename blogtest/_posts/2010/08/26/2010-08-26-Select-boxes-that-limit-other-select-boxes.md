---
layout: post
title: "Select boxes that limit other select boxes"
date: "2010-08-26T18:08:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/08/26/Select-boxes-that-limit-other-select-boxes
guid: 3924
---

That title probably doesn't do a great job of introducing the topic, but hopefully it will make more sense by the time the entry is done. A reader wrote me this week asking how to create select boxes that all share the same options. However, as soon as you pick an option in one, that option would then be removed from the other ones. A good example of this would be sorting data. Imagine you had N products. For each product you want to assign a ranking to it. Only one product can be 1, only one can be 2, and so on. Imagine that as you selected a particular rank, that rank was then removed from the others. Here's how I solved the problem using a little bit of ColdFusion and jQuery, my peanut butter and chocolate.
<!--more-->
<p/>

To begin, I'm going to mention an excellent jQuery plugin that I use whenever I'm doing SELECT box manipulation: <a href="http://www.texotela.co.uk/code/jquery/select/">Select box manipulation</a>. This plugin supports a variety of nice methods that make it much easier to work with select boxes. Now let's look at the complete template.

<p/>

<code>

&lt;!--- fake data, a list of items and a list of options ---&gt;
&lt;cfset items = "ColdFusion,PHP,Ruby,Beer,Star Wars"&gt;
&lt;!--- Make a list from 1 to N ---&gt;
&lt;cfset ranks = ""&gt;
&lt;cfloop index="x" from="1" to="#listLen(items)#"&gt;
	&lt;cfset ranks = listAppend(ranks, x)&gt;
&lt;/cfloop&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquery/jquery.selectboxes.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//first, listen for any select change
	$("select").change(function(e) {

		//did i have a previous value?
		var previous = $.data(this,'prev');

		//what did i pick?
		var chosen = $(this).val();

		//everyone else
		var everyoneelse = $("select").not($(this));

		//we loop over the rest and remove the option
		everyoneelse.each(function(x, el) {
			//only remove if i didnt pick the blank
			if(chosen != '') $(this).removeOption(chosen);
			//add back in previous
			if(previous) {
				$(this).addOption(previous,previous,false);
				$(this).sortOptions();
			}
		});
		
		//remember last choice
		$.data(this, 'prev', chosen);
		
	});

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form&gt;
	&lt;table&gt;
	&lt;cfloop index="idx" from="1" to="#listLen(items)#"&gt;
		&lt;cfoutput&gt;
		&lt;tr&gt;
			&lt;td&gt;#listGetAt(items, idx)#&lt;/td&gt;
			&lt;td&gt;
			&lt;select name="item_#idx#"&gt;
			&lt;option value=""&gt;--Select One--&lt;/option&gt;
			&lt;cfloop index="r" list="#ranks#"&gt;
				&lt;option value="#r#"&gt;#r#&lt;/option&gt;
			&lt;/cfloop&gt;
			&lt;/select&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
		&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	&lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok, let's tackle this. Normally I work bottom to top, but let's begin at the top just this once. Notice I've got some ColdFusion data there that generates a list. These items would be dynamic normally. Now if we go right back down to the bottom, you can see where I'm rendering them out in a simple table. (Don't hate me.) 

<p>

The core of the page is the select box change handler. It does a few things. First off - we see if we had a previous value. This is important because if a select had previously "taken" rank 2, we need to "release" it back to the others. I'm using jQuery's data support for that. 

<p>

Next I get the current value. After that, I then get the other selects. This is done using a not() function tied to a selector. I loop over the other selects and I do two things. First, if I actually picked something, I remove that option. Secondly, if I had a previous selection I add it back in and sort the options. 

<p>

Finally I store the current selection as my previous value. And that's it. You can play with this yourself by hitting the big Demo button below.

<p>

<a href="http://www.raymondcamden.com/demos/aug262010/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
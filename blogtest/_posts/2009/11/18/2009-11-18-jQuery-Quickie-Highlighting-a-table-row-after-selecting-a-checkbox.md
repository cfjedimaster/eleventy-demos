---
layout: post
title: "jQuery Quickie: Highlighting a table row after selecting a checkbox"
date: "2009-11-18T13:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/11/18/jQuery-Quickie-Highlighting-a-table-row-after-selecting-a-checkbox
guid: 3611
---

One of the nice little UI features in GMail is how it will highlight an entire table row when you check the checkbox for a particular mail message. It's a relatively simple thing to do but I wanted to whip up a quick sample for myself. Here is one way to do it with ColdFusion and jQuery.
<!--more-->
First, our data:

<code>
&lt;cfquery name="art" datasource="cfartgallery"&gt;
select	*
from	art
&lt;/cfquery&gt;
</code>

Yes, I know, select * is evil. I figure as long as I don't drop an entire database in my SQL statement I'm coming out ahead. Next - the output:

<code>
&lt;table id="artTable" border="1"&gt;
	&lt;tr&gt;
		&lt;td&gt; &lt;/td&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="art"&gt;
		&lt;tr&gt;
			&lt;td&gt;&lt;input type="checkbox" name="select" value="#artid#"&gt;&lt;/td&gt;
			&lt;td&gt;#artname#&lt;/td&gt;
			&lt;td&gt;#dollarFormat(price)#&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
</code>

Nothing too fancy here. I display two columns from the query along with a checkbox in the left most column. Now for the JavaScript:

<code>
$(document).ready(function() {

	$("#artTable input:checkbox").click(function() {
		$(this).parent().parent().toggleClass("highlight")
	})
})
</code>

Basically - listen to click events in checkboxes within my art table, and on click, toggle a CSS class named highlight. Not exactly rocket science, but it gets the job done! The entire template is below the screen shot. Enjoy!

<img src="https://static.raymondcamden.com/images/Screen shot 2009-11-18 at 1.00.34 PM.png" />

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#artTable input:checkbox").click(function() {
		$(this).parent().parent().toggleClass("highlight")
	})
})
&lt;/script&gt;
&lt;style&gt;
.highlight {
	background-color:pink;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfquery name="art" datasource="cfartgallery"&gt;
select	*
from	art
&lt;/cfquery&gt;

&lt;table id="artTable" border="1"&gt;
	&lt;tr&gt;
		&lt;td&gt; &lt;/td&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="art"&gt;
		&lt;tr&gt;
			&lt;td&gt;&lt;input type="checkbox" name="select" value="#artid#"&gt;&lt;/td&gt;
			&lt;td&gt;#artname#&lt;/td&gt;
			&lt;td&gt;#dollarFormat(price)#&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>
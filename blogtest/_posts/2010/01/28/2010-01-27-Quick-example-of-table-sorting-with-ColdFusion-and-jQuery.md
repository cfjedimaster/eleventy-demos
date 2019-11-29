---
layout: post
title: "Quick example of table sorting with ColdFusion and jQuery"
date: "2010-01-28T08:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/01/28/Quick-example-of-table-sorting-with-ColdFusion-and-jQuery
guid: 3699
---

For a while now I've been meaning to take a look at table sorting via jQuery. I finally got a chance to play with it last night and write up a quick demo. My example makes use of <a href="http://tablesorter.com/docs/">Tablesorter</a>, a jQuery plugin that adds (wait for it) table sorting to existing tables. Check the plugin's web site for full documentation on options and demos. Here is a quick example of how easy this is to use.

<p>
<!--more-->
I began with a simple ColdFusion query and table display:

<p>

<code>
&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select	artname, description, price, issold
from	art
&lt;/cfquery&gt;

&lt;table border="1"&gt;
	&lt;tr&gt;
		&lt;th&gt;Art&lt;/th&gt;
		&lt;th&gt;Description&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
		&lt;th&gt;Sold&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="getArt"&gt;
		&lt;tr&gt;
			&lt;td&gt;#artname#&lt;/td&gt;
			&lt;td&gt;#description#&lt;/td&gt;
			&lt;td&gt;#dollarFormat(price)#&lt;/td&gt;
			&lt;td&gt;&lt;cfif issold&gt;Yes&lt;cfelse&gt;No&lt;/cfif&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
</code>

<p>

There isn't anything special here. I grab art records from the ColdFusion cfartgallery demo database and display the name, description, price, and sold properties. Now let's look at how easy it is to add in the sort.

<p>

First - you need to separate the header of the table from the rest of the data. This is done with the TBODY and THEAD tags.

<p>

<code>
&lt;table border="1" id="mydata"&gt;
	&lt;thead&gt;
	&lt;tr&gt;
		&lt;th&gt;Art&lt;/th&gt;
		&lt;th&gt;Description&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
		&lt;th&gt;Sold&lt;/th&gt;
	&lt;/tr&gt;
	&lt;/thead&gt;
	&lt;tbody&gt;
	&lt;cfoutput query="getArt"&gt;
		&lt;tr&gt;
			&lt;td&gt;#artname#&lt;/td&gt;
			&lt;td&gt;#description#&lt;/td&gt;
			&lt;td&gt;#dollarFormat(price)#&lt;/td&gt;
			&lt;td&gt;&lt;cfif isBoolean(issold) and issold&gt;Yes&lt;cfelse&gt;No&lt;/cfif&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/cfoutput&gt;
	&lt;/tbody&gt;
&lt;/table&gt;
</code>

<p>

Also note I added an ID to the table. As you know, most jQuery operations will require you to name the items you want to manipulate. Ok, so next up I add in the JavaScript libraries:

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/jquery/jquery.tablesorter.min.js"&gt;&lt;/script&gt;
</code>

<p>

Next - I enable the sorting:

<p>

<code>
&lt;script&gt;
$(document).ready(function() {
        $("#mydata").tablesorter();
});
&lt;/script&gt;
</code>

<p>

And um - that's it! Considering that I normally have jQuery included already, I only needed to a) add tbody, theader, and an ID, b) include one more library, and c) write one line of JavaScript. Sweet. 

<p>

As I said, you should check the <a href="http://tablesorter.com/docs/">web site</a> for more details. One simple change you may want to make is an initial sort. That's as easy as:

<p>

<code>
$("#mydata").tablesorter({% raw %}{sortList:[[0,0]]}{% endraw %})
</code>

<p>

You can add CSS to add pretty arrows to the headers, or keep it simple, as I did:

<p>

<code>
&lt;style&gt;
th {% raw %}{ cursor: pointer; }{% endraw %}
&lt;/style&gt;
</code>

<p>

You can see a full demo of this <a href="http://www.raymondcamden.com/demos/jan282009/test5.cfm">here</a>.
---
layout: post
title: "ColdFusion Quickie: Splitting data into columns"
date: "2011-04-23T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/23/ColdFusion-Quickie-Splitting-data-into-columns
guid: 4204
---

This is something I've done many times in the past, but I thought I'd whip up a quick example and share it. Imagine you have a set of data you need to display in columns. With a table it's trivial. You loop and simply begin a new TR every two cells. But what if you aren't using tables? Imagine a CSS based layout with two columns side by side. The contents of the left column need to be every other item, starting with the first one. The contents of the right column need to be every other item, starting with the second one. Here is a quick snippet of code that demonstrates this.
<!--more-->
<p>

<code>
&lt;cfset data = [1,2,3,4,5,6,7,8,9]&gt;

&lt;cfset col1 = []&gt;
&lt;cfset col2 = []&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(data)#"&gt;
	&lt;cfset item = data[x]&gt;
	&lt;cfif x mod 2 is 1&gt;
		&lt;cfset arrayAppend(col1, item)&gt;
	&lt;cfelse&gt;
		&lt;cfset arrayAppend(col2, item)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

I create an initial set of data with 9 items. I then create two arrays - one for each column. Finally I loop over the data set and if odd, add it to column 1, and if even, add it to column two. So to render this I just output my HTML/CSS and loop over each column.

<p>

<code>

&lt;style&gt;
#left {
	float: left;
	width: 200px;
}
#right {
	float: left;
	width: 200px;
}
&lt;/style&gt;

&lt;div id="left"&gt;
		&lt;b&gt;col1&lt;/b&gt;&lt;br/&gt;
		&lt;cfloop index="i" array="#col1#"&gt;
			&lt;cfoutput&gt;
			#i#&lt;br/&gt;
			&lt;/cfoutput&gt;
		&lt;/cfloop&gt;
&lt;/div&gt;
&lt;div id="right"&gt;
		&lt;b&gt;col2&lt;/b&gt;&lt;br/&gt;
		&lt;cfloop index="i" array="#col2#"&gt;
			&lt;cfoutput&gt;
			#i#&lt;br/&gt;
			&lt;/cfoutput&gt;
		&lt;/cfloop&gt;
&lt;/div&gt;
</code>

<p>

Here is how it looks - fancy, eh?

<p>


<img src="https://static.raymondcamden.com/images/ScreenClip73.png" />
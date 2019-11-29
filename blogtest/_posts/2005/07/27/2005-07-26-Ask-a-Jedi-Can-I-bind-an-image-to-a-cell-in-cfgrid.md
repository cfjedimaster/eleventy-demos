---
layout: post
title: "Ask a Jedi: Can I bind an image to a cell in cfgrid?"
date: "2005-07-27T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/27/Ask-a-Jedi-Can-I-bind-an-image-to-a-cell-in-cfgrid
guid: 647
---

Zach asks, "Is there a way to bind an image to a column in a Flash Grid?" The answer is yes. From the docs for <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=ColdFusion_Documentation&file=00000267.htm">cfgridcolumn</a>, we see that the type attribute for cfgridcolumn allows for "image" as a value. Some notes though:

<ul>
<li>If you use a relative path, i.e., "images/jedi.jpg", CF will assume the image lies under CFIDE/classes. Read on for a way to handle that.
<li>If the image is too big to fit in the column cell, it will be clipped.
<li>The image must be a JPEG file.
</ul>

So, if you are like me, you don't normally store the full path to an image in the database. This means you will have relative image paths in your data and the gridcolumn won't display right. There are a few ways you can fix that. You can actually write your sql so that it returns the data with the proper path. As an example: 

select name, '&lt;img src="/images/"' &amp; img &amp; '&gt;' as imagepath<br>
from foo

(<b>Note - I always forget the proper character to join strings in SQL - it may be + instead of &amp;, but you get the idea.</b>)

You could also use QueryOfQuery to modify the query to contain the full path. You get the idea.
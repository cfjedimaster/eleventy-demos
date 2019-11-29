---
layout: post
title: "Quick demo of accessing XML data with jQuery"
date: "2012-02-16T11:02:00+06:00"
categories: [development,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/02/16/Quick-demo-of-accessing-XML-data-with-jQuery
guid: 4526
---

This blog post is mainly for my own memory - but a user asked about access CDATA values stored in an XML field via JavaScript. I'm using jQuery to work with XML and wrote up a very quick demo. For the most part, it seems like it "just works", but I assume there are going to be some edge cases. I'll update the demo to add more examples if folks would like.
<!--more-->
<p>

First, I created an XML sample and named it data.xml:

<p>

<code>
&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
&lt;root&gt;
&lt;name&gt;Raymond&lt;/name&gt;
&lt;bio&gt;
&lt;![CDATA[
Willy nilly stuff with &lt;b&gt;some html&lt;/b&gt; and crap in it.
]]&gt;
&lt;/bio&gt;
&lt;likes&gt;
    &lt;like&gt;Star Wars&lt;/like&gt;
    &lt;like&gt;Beer&lt;/like&gt;
    &lt;like&gt;Cookies&lt;/like&gt;
&lt;/likes&gt;
&lt;skillshot range="10"&gt;rifle&lt;/skillshot&gt;
&lt;/root&gt;
</code>

<p>

Notice I've got a simple value, a value with CDATA, an collection of items, and one item with an attribute too. Here's the jQuery side:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;


	&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;

    &lt;script type="text/javascript"&gt;


	$(function() {

			$.get("data.xml", {}, function(res) {

				var name = $(res).find("name");
				console.log("name = "+name.text());

				var bio = $(res).find("bio");
				console.log("bio = "+bio.text());

				//notice I ask for the child like tag, not the parent likes
				var likes = $(res).find("like");
				$(likes).each(function(idx,item) {
					console.log("like # "+idx+" = "+$(item).text());
				});

				var sshot = $(res).find("skillshot");
				console.log("skillshot = "+sshot.text());
				console.log("skillshot = "+sshot.attr("range"));

			}, "xml");

	});
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;


&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Stepping through this - notice first that I tipped off jQuery to the data type. I probably didn't need this, but i like being explicit. jQuery automatically converts the result text into a proper XML object. Once I have that, then I can use the find function to grab my nodes. At this point, it almost acts like any other regular DOM item. Notice how I can simply use .text on both name and bio. It just works. 

<p>

The array of items is a bit different. I grab them all and then iterate over it. 

<p>

And finally - look how I handle the skillshot item. I can still do .text to get the text value, but I can also use .attr (again, like a regular DOM item) to get the attribute.

<p>

Hope this is helpful to folks. If you want to run this, hit the demo link below and ensure your console is open.

<p>

<a href="http://www.raymondcamden.com/demos/2012/feb/16/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
---
layout: post
title: "Results of ColdFusion's XMLSearch functions are references"
date: "2011-01-25T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/25/Results-of-ColdFusions-XMLSearch-functions-are-references
guid: 4093
---

Just a quick note. I was talking with <a href="http://nil.checksite.co.uk">Stephen Moretti</a> about working with the results of the XMLSearch function. He wanted to know if the results were references or copies of the XML data. I did a few tests and from what I see - they are references. Here is a quick example.
<!--more-->
<p>

<code>
&lt;cfxml variable="stuff"&gt;
&lt;products&gt;
	&lt;product name="alpha"&gt;
		&lt;price&gt;10&lt;/price&gt;
	&lt;/product&gt;
	&lt;product name="beta"&gt;
		&lt;price&gt;11&lt;/price&gt;
	&lt;/product&gt;
	&lt;product name="gamma"&gt;
		&lt;price&gt;9&lt;/price&gt;
	&lt;/product&gt;
&lt;/products&gt;
&lt;/cfxml&gt;

&lt;cfdump var="#stuff#"&gt;
&lt;cfset b = xmlSearch(stuff, "//product[@name='beta']")&gt;
&lt;cfdump var="#b#"&gt;
&lt;cfset test = b[1]&gt;
&lt;cfset test.xmlchildren[1].xmltext =99&gt;
&lt;cfset test.xmlattributes.name = "boo"&gt;
&lt;cfdump var="#stuff#"&gt;
</code>

<p>

I begin with a simple XML packet of products. Each product has a name and a price child. I do a search to find the Beta product. Once I've got it I manipulate the name and the price. Here are the results of the dumps:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip17.png" />

<p>

Not sure how useful this is - I almost never actually <i>update</i> XML - but hopefully this will help others.
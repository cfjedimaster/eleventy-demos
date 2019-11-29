---
layout: post
title: "Yes, Virginia, you can put HTML into a CFGRID"
date: "2007-08-10T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/10/Yes-Virginia-you-can-put-HTML-into-a-CFGRID
guid: 2270
---

This is pretty good - I didn't realize till I tried but you <b>can</b> put HTML into a CFGRID. Consider the following:

<code>
&lt;cfset foo = queryNew("title,picture,age")&gt;
&lt;cfloop from="1" to="10" index="x"&gt;
	&lt;cfset queryAddRow(foo)&gt;
	&lt;cfset querySetCell(foo, "title", "This is &lt;b&gt;row&lt;/b&gt; #x#")&gt;
	&lt;cfset querySetCell(foo, "picture", "&lt;img src='http://www.raymondcamden.com/images/me.jpg' width='100' height='100'&gt;")&gt;
	&lt;cfset querySetCell(foo, "age", randrange(18,56))&gt;
&lt;/cfloop&gt;

&lt;cfform name="goo"&gt;
&lt;cfgrid name="mydata" format="html" query="foo"&gt;
	&lt;cfgridcolumn name="title" header="Title"&gt;
	&lt;cfgridcolumn name="picture" header="Picture" width="100"&gt;
	&lt;cfgridcolumn name="age" header="Age"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

I used HTML in two columns here. The title column uses a bold tag, and the picture column is an image. I'm sure folks could come up with some interesting users for this. You could use an image to flag a row for example (active versus not active). For a live demo of this, see here:

<a href="http://www.coldfusionjedi.com/demos/gridwithhtml.cfm">http://www.coldfusionjedi.com/demos/gridwithhtml.cfm</a>
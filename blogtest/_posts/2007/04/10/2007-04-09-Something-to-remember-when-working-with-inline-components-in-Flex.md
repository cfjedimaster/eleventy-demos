---
layout: post
title: "Something to remember when working with inline components in Flex"
date: "2007-04-10T10:04:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/04/10/Something-to-remember-when-working-with-inline-components-in-Flex
guid: 1950
---

Last night I ran into an issue I just couldn't understand with some Flex development I was doing. Let me show the code that wasn't working:
<!--more-->
<code>							&lt;mx:DataGridColumn dataField="filename_thumbnail" headerText="Thumbnail" width="250"&gt;
	&lt;mx:itemRenderer&gt;
	&lt;mx:Component&gt;
		&lt;mx:Image height="50" width="50" source="{% raw %}{(data.thumbnail_filename!=null)?baseurl+'/images/spotlight/'+data.thumbnail_filename:baseurl+'/images/spotlight/'+data.filename}{% endraw %}" /&gt;
	&lt;/mx:Component&gt;
	&lt;/mx:itemRenderer&gt;
&lt;/mx:DataGridColumn&gt;
</code>

This code creates an inline component to render an image in a data grid. I use some simple logic to see if the thumbnail column has a value. If it does, I want to show that image. If not, I want to show the value in the image column.

My original code had a hard coded path in it, which of course didn't work when the code was sent to production. (Duh.) So I switched to using a variable baseurl. This was a valid variable (I could Alert it inside my MXML file), but I kept getting an unknown variable error when I tried to compile it. 

Luckily I was able to find help on the cfflex IRC channel. Toby Tremayne found this from the docs:

<blockquote>
The &lt;mx:Component&gt; tag defines a new scope within an MXML file, where the local scope of the item renderer or item editor is defined by the MXML code block delimited by the &lt;mx:Component&gt; and &lt;/mx:Component&gt; tags. To access elements outside of the local scope of the item renderer or item editor, you prefix the element name with the outerDocument keyword.

<a href="http://livedocs.adobe.com/flex/201/langref/mxml/component.html">http://livedocs.adobe.com/flex/201/langref/mxml/component.html</a>
</blockquote>

Turns out - this inline component acted like a whole other MXML file. A bit like how a ColdFusion custom tag would act if we could define one inline. What I don't quite get is why I can access data ok. I'm assuming Flex passes it in automatically since it recognizes I'm in a datagrid. 

As the docs say, it is easy enough to fix. I simply add the outerDocument keyword like so:

<code>
&lt;mx:DataGridColumn dataField="filename_thumbnail" headerText="Thumbnail" width="250"&gt;
	&lt;mx:itemRenderer&gt;
	&lt;mx:Component&gt;
		&lt;mx:Image height="50" width="50" source="{% raw %}{(data.thumbnail_filename!=null)?outerDocument.baseurl+'/images/spotlight/'+data.thumbnail_filename:outerDocument.baseurl+'/images/spotlight/'+data.filename}{% endraw %}" /&gt;
	&lt;/mx:Component&gt;
	&lt;/mx:itemRenderer&gt;
&lt;/mx:DataGridColumn&gt;
</code>
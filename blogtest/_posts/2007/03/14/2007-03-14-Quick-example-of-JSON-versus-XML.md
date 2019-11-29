---
layout: post
title: "Quick example of JSON versus XML"
date: "2007-03-14T13:03:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2007/03/14/Quick-example-of-JSON-versus-XML
guid: 1889
---

If you haven't heard of <a href="http://en.wikipedia.org/wiki/JSON">JSON (JavaScript Object Notation)</a>, I think the simplest way to think of it is as a serialized form of data. Much like the old CFWDDX that few people use anymore, JSON is a way to take some data, <i>any</i> data, and convert it into a string. Like WDDX, you can both serialize and deserialize JSON data. 

One of the benefits of JSON is that it is a lot less weightier than XML. While it isn't nearly as readable, when it comes to AJAX it has the benefit of simply shifting less bits back and forth while passing the same information.

I had not really paid much attention to JSON, but with the size issues cropping up in <a href="http://coldfire.riaforge.org">ColdFire</a>, I took a look and I was really surprised by how much JSON cuts down on the size of the data. Consider the following code:

<code>
&lt;cfset data = queryNew("id,name,age,active","integer,varchar,integer,bit")&gt;

&lt;cfloop index="x" from="1" to="100"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
	&lt;cfset querySetCell(data,"active",false)&gt;
&lt;/cfloop&gt;
</code>

This creates a rather simple query of 100 rows. I'll use my <a href="http://ray.camdenfamily.com/projects/toxml/">toXML</a> CFC to convert this into an XML packet and then report on the size:

<code>
&lt;cfset xmlVersion = queryToXML(data,"people","people")&gt;
&lt;cfoutput&gt;
&lt;h2&gt;XML Version (#len(xmlVersion)# chars)&lt;/h2&gt;
#htmlCodeFormat(xmlVersion)#
&lt;/cfoutput&gt;
</code>

I ended up with a string that was 7939 characters long. Now lets convert that to JSON using <a href="http://www.epiphantastic.com/cfjson/">CFJSON</a> from Thomas Messier. 

<code>
&lt;cfset jsonVersion = encode(data)&gt;
&lt;cfoutput&gt;
&lt;h2&gt;JSON Version (#len(jsonVersion)# chars)&lt;/h2&gt;
#htmlCodeFormat(jsonVersion)#
&lt;/cfoutput&gt;
</code>

Size of the JSON packet? 1881 characters. That's pretty significant. Spry does not yet support JSON, but when/if it does, I certainly plan on switching where appropriate.
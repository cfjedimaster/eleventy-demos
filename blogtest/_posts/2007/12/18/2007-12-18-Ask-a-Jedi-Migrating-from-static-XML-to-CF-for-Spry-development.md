---
layout: post
title: "Ask a Jedi: Migrating from static XML to CF for Spry development"
date: "2007-12-18T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/18/Ask-a-Jedi-Migrating-from-static-XML-to-CF-for-Spry-development
guid: 2549
---

Patrick asks:

<blockquote>
I'm new to Spry, and the examples make sense, but I don't quite get how to hook up Spry to my existing CFCs. I know Spry works with XML and JSON - can I just add a returntype of xml to my methods to make it work?
</blockquote>
<!--more-->
This is an interesting question. I've talked quite a bit about Spry, and serving up data in CF, but I don't think I've quite discussed the shift precisely in one particular blog post. I cover this in my Spry presentation, but I think a blog entry won't hurt. 

If you've gone through the Spry examples, then you've seen quite a few URLs that point directly to XML files. Switching to a ColdFusion powered datasource (or PHP, .Net, etc) is as simple as pointing to the CFM file. Spry doesn't care. As long as you output valid XML (or JSON, CSV, TSV, etc) then the creator of the data isn't important. 

So Patrick has an existing CFC. His first thought was to just change the return type. That won't work. If your method returns a query (which is typically the type of data you get in Ajax calls) and you use returnType="XML", you will get an error. CF won't auto-convert the data. Ditto for JSON. 

So what do you? First - what type of data are you returning? Spry supports more than just XML and JSON, but lets focus on that. If you want to return XML, then you have to create the XML data yourself. You can use a utility like <a href="http://www.raymondcamden.com/projects/toxml/">toXML</a> or just roll your own. I recommend though creating a new CFC method. If you built a CFC method that returns a query, most likely other CFMs are using it. You don't want to convert it to XML and break the rest. Build a new method like, getFooXML, that would wrap an existing getFoo call and convert the data to XML. Or point Spry to a CFM file that calls your CFC and does the conversion there.

The basic point is that for XML, you need to make this conversion, CF won't do it for you. I go into more details about the specifics <a href="http://www.coldfusionjedi.com/index.cfm/2007/2/8/Returning-XML-in-ColdFusion-for-AJAX">here</a>. 

As for JSON, you may be in luck. If you are using ColdFusion 8, a new returnFormat attribute was added (discussed <a href="http://www.coldfusionjedi.com/index.cfm/2007/7/5/ColdFusion-8--Return-Format-for-ColdFusion-Components">here</a>). This <i>does</i> let you call an existing CFC method and have the data autoconverted to JSON. If you are using ColdFusion 8, this is definitely the method I recommend. Not only is it simpler, but JSON is a heck of a lot slimmer than XML.

So to repeat myself unnecessarily - you have a few options available depending on the type of data you want back. XML requires the most work to generate, and you should probably use JSON instead, especially if you are using ColdFusion 8.

Is this helpful? Please let me know if not.
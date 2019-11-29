---
layout: post
title: "Per request debugging in Model-Glue"
date: "2006-09-18T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/18/Per-request-debugging-in-ModelGlue
guid: 1537
---

A few weeks ago I spoke about how I use <a href="http://ray.camdenfamily.com/index.cfm/2006/8/22/Using-AJAX-with-ModelGlue">AJAX with Model-Glue</a>. A reader, Jan Jannek, asked how she could use debugging without it breaking the XML results being returned by Model-Glue. Before I even had a chance to find the answer, she was able to dig it up:

<blockquote>
I just found out by having a look at the MG-Examples of ajaxCFC, that there is the option to get rid of the debugging for a single event by adding:

&lt;cfset request.modelGlueSuppressDebugging = true /&gt;

to the xml.view.cfm and everything works fine!
</blockquote>

I confirmed this and it worked well. However - a note. Let's say you want to turn on debugging, but hide it by default. If you pass in a URL variable you would then want the debugging information to show up. This would be a bad idea for production, but during testing it would let you quickly see debugging information on a per request basis. This is possible, but you should be aware that Model-Glue does not actually check the value of request.modelGlueSupressDebugging. The mere existence of the variable will turn of debugging. Here is a simple way to add this functionality:

<code>
&lt;cfset request.modelGlueSuppressDebugging = true /&gt;
&lt;cfif structKeyExists(url, "showdebug")&gt;
	&lt;cfset structDelete(request, "modelGlueSuppressDebugging")&gt;
&lt;/cfif&gt;
</code>

This code simply looks for "showdebug" in the query string and if it exists, it removes the request variable instead of simply setting it to false. (This should be added to your application.cfm file of course.)
---
layout: post
title: "Ask a Jedi: Getting CFC method names"
date: "2006-04-17T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/17/Ask-a-Jedi-Getting-CFC-method-names
guid: 1216
---

Justice (which sounds like a superhero name) asks:

<blockquote>
Is there a way to parse a list of methods from a .CFC into an array using introspection? I am creating a simple ajax form to do testing of .cfc methods, and I would like to auto-populate a drop down of available methods after the user enters a
component name.  I know I can &lt;cfobject&gt; the component and then dump it, but how would I reference the methods as variable's?
</blockquote>

First off, to get the methods from a CFC instance you would use the <a href="http://www.techfeed.net/cfQuickDocs/?GetMetaData">getMetaData</a> function like so:

<code>
&lt;cfset messageCFC = createObject("component", "forums.cfcs.message")&gt;
&lt;cfset methods = getMetaData(messageCFC).functions&gt;
&lt;cfdump var="#methods#"&gt;
</code>

The getMetaData function will return a lot of information about the CFC, but note that I am just using the functions key. How could you then invoke a method dynamically? The <a href="http://www.techfeed.net/cfQuickDocs/?cfinvoke">cfinvoke</a> tag can be passed a dynamic name:

<code>
&lt;cfinvoke component="messageCFC" method="#someMethod#"&gt;
</code>

It would probably be a bit difficult to handle the arguments like this in a <i>truly</i> 100% dynamic fashion, but this should give you the basics for what you want to do.
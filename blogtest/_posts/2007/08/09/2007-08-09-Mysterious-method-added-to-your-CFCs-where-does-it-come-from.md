---
layout: post
title: "Mysterious method added to your CFCs - where does it come from?"
date: "2007-08-09T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/09/Mysterious-method-added-to-your-CFCs-where-does-it-come-from
guid: 2266
---

If you've been working with CFCs in ColdFusion 8, you may come across a mysterious method. Consider this screen shot from a CFC descriptor:

<img src="https://static.raymondcamden.com/images/Picture%2011.png">

Notice the method, _cffunccfthread_cftest2ecfc6414264711. What the heck is that? As may be able to guess, it has something to do with threading. Check out the source for my CFC:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="sayHi" access="public" returnType="string" output="false"&gt;
	&lt;cfargument name="name" type="string" required="false" default="Nameless"&gt;
	&lt;cfthread name="t"&gt;
	&lt;cfparam name="request.x" default="1"&gt;
	&lt;cfset request.x++&gt;
	&lt;/cfthread&gt;
	&lt;cfreturn arguments.name&gt;	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

See the cfthread call? Whenever threading is used inside a CFC method, a new method is added to the CFC metadata. You will also see this function if you call getComponentMetaData on the CFC. You can even call this method:

<code>
&lt;cfset goo = createObject("component", "test")&gt;
&lt;cfset  goo._cffunccfthread_cftest2ecfc6414264711()&gt;
</code>

When run, the code inside your cfthread tags are executed. Now I would <b>not</b> recommend actually doing that. As a related note - if you put a cfthread inside a normal CFM file and dump the variables scope, you will see a UDF with a similar name.

As a side note - I've always meant to play with the code that generates documentation for CFCs. In case you didn't know, this is open source. It isn't encrypted like the rest of the CFM files Adobe ships. It would be rather trivial to hide this from the documentation. I'd also like to add ways to execute methods by clicking on the event name or create a PDF version of the doc.
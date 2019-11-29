---
layout: post
title: "Ask a Jedi: CFGRID Question and Asynchronous Processes in ColdFusion"
date: "2005-09-28T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/28/Ask-a-Jedi-CFGRID-Question-and-Asynchronous-Processes-in-ColdFusion
guid: 816
---

I've got a deal for you today - two questions answered in one entry! The first question is:

<blockquote>
Is there anyway to disable the count feature on a cfgrid so the column doesn't show up?
</blockquote>

Yes, there is, although for some reason the attribute name just doesn't seem obvious to me. Anyway, to disable the row counter, all you need to do is add rowHeaders=false to your cfgrid tag. Here is a complete example.

<code>
&lt;cfset data = queryNew("id,name,age")&gt;

&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
&lt;/cfloop&gt;

&lt;cfform format="flash"&gt;
	&lt;cfgrid name="data" query="data" rowheaders=false /&gt;
&lt;/cfform&gt;
</code>

This is one of the features that, for some reason, I always have to look up. Now for the next question:

<blockquote>
Is there a way to do an asynchronous process in CFMX? For example, let's say i have a method that spits back XML and then logs a whole bunch of stuff. I'd like it to hand the XML back and then do the logging (this way the requestor doesn't have to wait for the whole log process to finish).
</blockquote>

Actually, this is one of the biggest new features added in ColdFusion MX 7. The Event Gateways allow for this now. It is a rather large topic, so I suggest reading the docs on Event Gateways. I then suggest you go to Sean Corfield's <a href="http://www.corfield.org/blog">blog</a> and search for "asynch". You will find <i>many</i> posts and example code that will get you started.
---
layout: post
title: "Quick RIAForge Update"
date: "2008-03-26T17:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/26/Quick-RIAForge-Update
guid: 2730
---

I just spent five minutes on RIAForge changing the <a href="http://www.riaforge.org/index.cfm?event=page.search">search</a> page to use JSON instead of XML. I know I've said this before, but you got to love the size differences. Before the change, the size of the XML packet downloaded was 152KB. With JSON it's down to 72KB. 

For those who may view source - please note that I didn't really touch much else - so the code could be even better probably (using the Paged Data support instead of my manual paging for example). 

I've blogged about how I integrate Model-Glue with AJAX before, but here is a quick recap. When I make an event that is meant to serve data up to an Ajax client, I first broadcast my message to get my data:

<code>
&lt;message name="GetApprovedProjects"&gt;
	&lt;argument name="mode" value="short" /&gt;
&lt;/message&gt;
</code>

I then broadcast a generic message:

<code>
&lt;message name="ToJSON"&gt;
	&lt;argument name="viewstatekey" value="projects" /&gt;
&lt;/message&gt;
</code>

My controller code for ToJSON does:

<code>
&lt;cffunction name="toJSON" access="public" returnType="void" output="true"&gt;
	&lt;cfargument name="event" type="any"&gt;
	&lt;cfset var viewKey = arguments.event.getArgument("viewstatekey")&gt;
	&lt;cfset var data = ""&gt;
	&lt;cfset var json = ""&gt;
	
	&lt;cfif arguments.event.valueExists(viewkey)&gt;
		&lt;cfset data = arguments.event.getValue(viewkey)&gt;
		&lt;cfset json = serializeJSON(data,true)&gt;
	&lt;/cfif&gt;
	
	&lt;cfset arguments.event.setValue("json", json)&gt;	
&lt;/cffunction&gt;
</code>

So in case that isn't obvious - what it means is I can broadcast <i>any</i> message and just pass the results to a generic JSON converter. (The view just dumps out the JSON string.)
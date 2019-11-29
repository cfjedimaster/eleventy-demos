---
layout: post
title: "Using AJAX with Model-Glue"
date: "2006-08-22T07:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/22/Using-AJAX-with-ModelGlue
guid: 1486
---

I've had to use AJAX (specifically Spry) now with two Model-Glue sites, so I thought I'd share how I've done it. This isn't rocket science per se, but I'm pretty happy with my method and I thought others might like to see it as well. (And the flip side is that if I'm doing something totally stupid, folks will let me know pretty quickly.)

First - let me start with the basics. Any page using Spry will need to:
<!--more-->
<ul>
<li>Include the Spry libraries
<li>Load the XML data
</ul>

Let me first talk about how I included the Spry libraries. I could have simply included the libraries in my layout view. However, the Spry libraries aren't the skinniest files around, so I didn't want to do that. What I've done is simply tell the viewState when to load Spry. So if a page needs Spry, I'll do this:

<code>
&lt;cfset viewState.setValue("useajax", true)&gt;
</code>

My layout view then does:

<code>
&lt;cfset useajax = viewState.getValue("useajax", false)&gt;
.....
&lt;cfif useajax&gt;
&lt;script type="text/javascript" src="/js/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/js/SpryData.js"&gt;&lt;/script&gt;
&lt;/cfif&gt;
</code>

For those who don't quite know Model-Glue, all this means is that by default, the Spry libraries will not be loaded. A view has to be explicitly state that it wants to load them.

The next thing I need to do is load the XML. Here is one sample of doing that using Spry:

<code>
var dsIssues = new Spry.Data.XMLDataSet("#viewState.getValue("myself")#xml.issues", "issues/issue");
</code>

Note the use of Model-Glue syntax to construct the URL. I also decided that all XML based events will be named xml.something. In this case, xml.issues. Now let's look at the event definition:

<code>
&lt;event-handler name="xml.issues"&gt;
	&lt;broadcasts&gt;
		&lt;message name="GetIssues" /&gt;
		&lt;message name="ToXML"&gt;
			&lt;argument name="viewstatekey" value="issues" /&gt;
			&lt;argument name="xmlpath" value="issues/issue" /&gt;
		&lt;/message&gt;
	&lt;/broadcasts&gt;
	&lt;views&gt;
		&lt;include name="body" template="xml.view.cfm" /&gt;
	&lt;/views&gt;
	&lt;results/&gt;
&lt;/event-handler&gt;
</code>

What's going on here? First I have my generic call to get my data. In this case, it is GetIssues. This is going to fetch a query of data. Now for the cool part. The ToXML message is how I convert the query to XML. I pass in the viewstatekey. This is simply telling the method where to look for data. In this case the value is issues, meaning that GetIssues set it's data in a key named issues. Next I pass in the xmlpath that should be used when creating the XML.

What all of this means is - I can use ToXML in multiple places by simply telling it where the data is and how to construct the XML. It is a generic event that can be used for multiple Spry events. The view (xml.view.cfm) simply returns the XML:

<code>
&lt;cfsetting enablecfoutputonly=true&gt;

&lt;cfset xml = viewState.getValue("xml")&gt;

&lt;cfcontent type="text/xml"&gt;&lt;cfoutput&gt;#xml#&lt;/cfoutput&gt;


&lt;cfsetting enablecfoutputonly=false&gt;
</code>

In case you are wondering, the code that creates the XML is simply my ToXML cfc (which will hopefully have a proper project page soon). This is how it was done in the controller:

<code>
&lt;cffunction name="toXML" access="public" returnType="void" output="true"&gt;
	&lt;cfargument name="event" type="any"&gt;
	&lt;cfset var viewKey = arguments.event.getArgument("viewstatekey")&gt;
	&lt;cfset var xmlpath = arguments.event.getArgument("xmlpath")&gt;
	&lt;cfset var xmlroot = listFirst(xmlPath, "/")&gt;
	&lt;cfset var xmlchild = listLast(xmlPath, "/")&gt;
	&lt;cfset var data = ""&gt;
	
	&lt;cfif arguments.event.valueExists(viewkey)&gt;
		&lt;cfset data = arguments.event.getValue(viewkey)&gt;
		&lt;cfset xmlData = variables.xmlCFC.queryToXML(data, xmlroot, xmlchild)&gt;
	&lt;/cfif&gt;
	
	&lt;cfset arguments.event.setValue("xml", xmldata)&gt;	
&lt;/cffunction&gt;
</code>

As you can see, nothing too fancy here. The main thing to note is how it was built in a generic fashion.
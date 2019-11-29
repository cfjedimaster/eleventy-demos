---
layout: post
title: "When is XML not XML?"
date: "2007-11-12T12:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/12/When-is-XML-not-XML
guid: 2469
---

Here is a mystery for folks. I've updated my parsing engine for <a href="http://www.coldfusionbloggers.org">coldfusionbloggers.org</a>. I'm using CFHTTP now so I can check Etag type stuff. I take the result text and save it to a file to be parsed by CFFEED.

But before I do that I check to ensure it's valid XML. Here is where it gets weird. <a href="http://cfblog.griefer.com/">Charlie Griefer's blog</a> works with CFFEED directly, but isXML on the result returns false. But - I can xmlParse the string no problem. Simple example:

<code>
&lt;cfset f= "http://cfblog.griefer.com/feeds/rss2-0.cfm?blogid=30"&gt;
&lt;cfhttp url="#f#"&gt;
&lt;cfset text = cfhttp.filecontent&gt;

&lt;cfif isXml(text)&gt;
yes
&lt;cfelse&gt;
no
&lt;cfset z = xmlParse(text)&gt;
&lt;cfdump var="#z#"&gt;
&lt;/cfif&gt;
</code>

If you run this, you will see "no" output, and than an XML object. If you use CFFEED on the URL directly, that works as well. So it seems like isXML is being strict about something. I can update my code to try/catch an xmlParse obviously, but I'd rather figure out <i>why</i> the above is happening first.
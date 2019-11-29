---
layout: post
title: "Ask a Jedi: Seeing a SOAP Request that ColdFusion sent"
date: "2008-01-23T16:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/23/Ask-a-Jedi-Seeing-a-SOAP-Request-that-ColdFusion-sent
guid: 2612
---

Mike asks:

<blockquote>
<p>
I have a question regarding calling a SOAP web service and cfscript. I need to add some header information so I'm using the addSOAPRequestHeader Function. Anyhow, my question being is there a way I can debug and somehow see the exact SOAP XML request being sent over the wire?
</p>
</blockquote>

Yes, you can do this, but it only works when you create an "instance" of the web service. Here is a simple example:

<code>

&lt;cfset wurl = "http://localhost/test.cfc?WSDL"&gt;

&lt;cfset ws = createObject("webservice", wurl)&gt;
&lt;cfset time = ws.time()&gt;

&lt;cfset req = getSoapRequest(ws)&gt;
&lt;cfdump var="#req#"&gt;
</code>

The important bit is the getSoapRequest function. You pass it the web service object, and you get back the XML-based SOAP request that was last used. Dumping it as I did gives you a formatted XML dump, but 'req' as is will give you the pure XML.
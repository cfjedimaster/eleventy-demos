---
layout: post
title: "Returning XML in ColdFusion for AJAX"
date: "2007-02-08T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/08/Returning-XML-in-ColdFusion-for-AJAX
guid: 1829
---

I've blogged this before, but only as a side point. Since the question came in to me this morning I thought I'd mention it again in a new post. The question is simple - how do you return XML data in ColdFusion to be consumed by AJAX? (Or really any source.)
<!--more-->
First off - if you want to return XML from a CFC method, you have to use returnType="xml". If you do not, the result will be WDDX encoded. Consider this method:

<pre><code class="language-markup">
&lt;cffunction name="test" returnType="string" access="remote" output="false"&gt;
	&lt;cfset var xml = ""&gt;
	&lt;cfxml variable="xml"&gt;
		&lt;root&gt;
		&lt;people&gt;ray&lt;/people&gt;
		&lt;people&gt;jeanne&lt;/people&gt;
		&lt;/root&gt;
	&lt;/cfxml&gt;
	&lt;cfreturn xml&gt;
&lt;/cffunction&gt;
</code></pre>

Viewed in your browser, the result is:

<pre><code class="language-markup">
&lt;wddxPacket version='1.0'&gt;&lt;header/&gt;&lt;data&gt;&lt;string&gt;&lt;?xml version="1.0" encoding="UTF-8"?&gt;&lt;char code='0a'/&gt;&lt;root&gt;&lt;char code='0a'/&gt;&lt;char code='09'/&gt;
&lt;char code='09'/&gt;&lt;people&gt;ray&lt;/people&gt;&lt;char code='0a'/&gt;&lt;char code='09'/&gt;
&lt;char code='09'/&gt;&lt;people&gt;jeanne&lt;/people&gt;&lt;char code='0a'/&gt;&lt;char code='09'/&gt;&lt;char code='09'/&gt;&lt;/root&gt;&lt;/string&gt;&lt;/data&gt;&lt;/wddxPacket&gt;
</code></pre>

(Note, I added a line break or two so it wouldn't break the site layout.)

If you switch the returnType to XML, you then get:

<pre><code class="language-markup">
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;root&gt;
&lt;people&gt;ray&lt;/people&gt;
&lt;people&gt;jeanne&lt;/people&gt;
&lt;/root&gt;
</code></pre>

So far so good. Before I go on - a quick note. You have to actually return an XML string or XML object. You can't just return a query and expect the returnType="xml" to convert it for you. That would be nice probably. 

What if you don't have ColdFusion 7? First - buy it and mention my name! If you must use ColdFusion 6, create a ColdFusion page called proxy.cfm. This CFM file will call your CFC and then return the XML. Here is an example taken from BlogCFC:

<pre><code class="language-markup">
&lt;cfcontent type="text/xml"&gt;	
&lt;cfoutput&gt;#queryToXML(entries, "entries", "entry")#&lt;/cfoutput&gt;
</code></pre>

In this case, I used a UDF to convert a query into an XML string. I use cfcontent to let the browser know XML is being returned. As a last step, I set up my AJAX front end to hit proxy.cfm instead of the CFC.
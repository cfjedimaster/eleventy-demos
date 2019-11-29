---
layout: post
title: "Spry Demo Updated"
date: "2006-06-22T15:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/06/22/Spry-Demo-Updated
guid: 1349
---

I updated my Spry demo, again, this time with a few fixes. First, the URL: 

<blockquote>
<a href="http://ray.camdenfamily.com/spry/blog3.cfm">http://ray.camdenfamily.com/spry/blog3.cfm</a>
</blockquote>

Just in case it isn't obvious, this is an AJAX front end to this blog. The only thing different from the "real" blog is that I limit the total amount of entries per category to 100.
<!--more-->
So what changed? First, there was a bug in paging and sorting. If you sorted, it only applied to the current page, and not the entire set. This was fixed thanks to Adobe. The fix will be in the next release of Spry. (Lucky me, I know all the right people. :)

The second fix was more interesting. I noticed that the HTML data wasn't being rendered right. My HTML was being escaped. Turns out this made sense as my CFC was xmlFormatting the result. Kin Blas of Adobe (one of the Spry folks) pointed out that I need to CDATA wrap my result. Let me show you how I did that in my CFC:

<code>
&lt;cffunction name="queryToXML" returnType="string" access="private" output="false"&gt;
	&lt;cfargument name="data" type="query" required="true"&gt;
	&lt;cfargument name="rootelement" type="string" required="true"&gt;
	&lt;cfargument name="itemelement" type="string" required="true"&gt;
	&lt;cfargument name="cDataCols" type="string" required="false" default=""&gt;
	
	&lt;cfset var s = "&lt;?xml version=""1.0"" encoding=""UTF-8""?&gt;"&gt;
	&lt;cfset var col = ""&gt;
	&lt;cfset var columns = arguments.data.columnlist&gt;
	&lt;cfset var txt = ""&gt;
	
	&lt;cfset s = s & "&lt;" & arguments.rootelement & "&gt;"&gt;
	&lt;cfloop query="arguments.data"&gt;
		&lt;cfset s = s & "&lt;" & arguments.itemelement & "&gt;"&gt;

		&lt;cfloop index="col" list="#columns#"&gt;
			&lt;cfset txt = arguments.data[col][currentRow]&gt;
			&lt;cfif listFindNoCase(arguments.cDataCols, col)&gt;
				&lt;cfset txt = "&lt;![CDATA[" & txt & "]]" & "&gt;"&gt;
			&lt;cfelse&gt;
				&lt;cfset txt = xmlFormat(txt)&gt;
			&lt;/cfif&gt;
			&lt;cfset s = s & "&lt;" & col & "&gt;" & txt & "&lt;/" & col & "&gt;"&gt;

		&lt;/cfloop&gt;
		
		&lt;cfset s = s & "&lt;/" & arguments.itemelement & "&gt;"&gt;
	&lt;/cfloop&gt;
	
	&lt;cfset s = s & "&lt;/" & arguments.rootelement & "&gt;"&gt;
	
	&lt;cfreturn s&gt;
&lt;/cffunction&gt;
</code>

This method, queryToXML, translates a query to XML. (Duh.) There is a method for this already at CFLib, but I wrote mine from scratch because I like doing that. My fix today was to add a new optional argument, cDataCols. This lets me specify which query columns will contain HTML and should be CDATA wrapped instead of xmlFormatted. All I did then was to simply change my call in getEntries:

<code>
&lt;cffunction name="getEntries" returnType="xml" access="remote" output="false"&gt;
	&lt;cfargument name="category" type="uuid" required="true"&gt;
	&lt;cfset var s = structNew()&gt;
	&lt;cfset var q = ""&gt;
	&lt;cfset s.maxEntries = 100&gt;
	&lt;cfset s.byCat = arguments.category&gt;
	
	&lt;cfset q = variables.blog.getEntries(s)&gt;

	&lt;cfcontent type="text/xml"&gt;	
	&lt;cfreturn queryToXML(q, "entries","entry","body")&gt;
&lt;/cffunction&gt;
</code>
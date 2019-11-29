---
layout: post
title: "My solution to the Friday Puzzle"
date: "2008-12-06T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/06/My-solution-to-the-Friday-Puzzle
guid: 3135
---

Based on my <a href="http://www.raymondcamden.com/index.cfm/2008/12/5/Friday-Puzzler-Quick-Stats">post</a> from yesterday, here is my 5 minute 'quick stat' solution to the puzzle. Note, this is not thread safe and it will quickly destroy my server (most likely), but it works!

I added this to Application.cfm, at the bottom, before my last cfsetting.

<code>
&lt;cffunction name="getCurrentURL" output="No" access="public" returnType="string"&gt;
    &lt;cfset var theURL = getPageContext().getRequest().GetRequestUrl().toString()&gt;
    &lt;cfif len( CGI.query_string )&gt;&lt;cfset theURL = theURL & "?" & CGI.query_string&gt;&lt;/cfif&gt;
    &lt;cfreturn theURL&gt;
&lt;/cffunction&gt;
&lt;cfset s = structGet("application.data")&gt;
&lt;cfset p = getCurrentURL()&gt;
&lt;cfif not structKeyExists(s, p)&gt;
	&lt;cfset s[p] = 0&gt;
&lt;/cfif&gt;
&lt;cfset s[p]++&gt;
</code>

The UDF comes from <a href="http://www.cflib.org/udf/getCurrentURL">CFLib</a> of course. It handles both query string and path_info CGI variables so it works well on the blog. 

To display it, I wrote this script:

<code>
&lt;cfset sorted = structSort(application.data,"numeric","desc")&gt;
&lt;table width="100%" border="1" cellpadding="5"&gt;
	&lt;tr&gt;
		&lt;th&gt;Page&lt;/th&gt;
		&lt;th&gt;Count&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfloop index="a" array="#sorted#"&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;#a#&lt;/td&gt;
		&lt;td&gt;#numberFormat(application.data[a])#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
&lt;/table&gt;
</code>

Nothing too complex here outside of the cool structSort function which works perfectly for this example. If you are bored, you can see this in action <a href="http://www.coldfusionjedi.com/test4.cfm">here</a>.
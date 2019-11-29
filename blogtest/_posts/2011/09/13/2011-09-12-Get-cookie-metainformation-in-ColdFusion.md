---
layout: post
title: "Get cookie metadata in ColdFusion"
date: "2011-09-13T09:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/13/Get-cookie-metainformation-in-ColdFusion
guid: 4362
---

<b>EDIT: Unfortunately, I was wrong about this! Please see Jason's comment below.</b>

As you know, ColdFusion makes it pretty easy to get cookies sent to the page in the current request. All cookies are stored in a simple structure that you can either dump or simply loop over.
<!--more-->
<p>

<code>
&lt;cfloop item="c" collection="#cookie#"&gt;
	&lt;cfoutput&gt;cookie[#c#] = #cookie[c]#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

But while this gives you the name and value of all cookies, it doesn't tell you anything else about the cookie, like it's expiration, path, or other values. For that, you have to get into the request at the Java level. Luckily, ColdFusion makes this simple too:

<p>

<code>
&lt;cfset cookies = getPageContext().getRequest().getCookies()&gt;
</code>

<p>

Where did this line of code come from? getPageContext() is a CFML function that returns the underlying Java PageContext object. From some Googling, I found that I could get the Request data from that Page object and then get an array of cookies using getCookies. Pretty simple, right? Each cookie object has all it's values available via simple get methods. You can see the documentation for that <a href="http://download.oracle.com/javaee/1.3/api/javax/servlet/http/Cookie.html">here</a>. Here is a trivial sample that just loops over them and prints out <i>some</i> of the values.

<p>

<code>
&lt;cfset cookies = getPageContext().getRequest().getCookies()&gt;

&lt;cfloop index="c" array="#cookies#"&gt;
	&lt;cfoutput&gt;
	Name=#c.getName()#&lt;br/&gt;
	Value=#c.getValue()#&lt;br/&gt;
	Path=#c.getPath()#&lt;br/&gt;
	Domain=#c.getDomain()#&lt;br/&gt;
	MaxAge=#c.getMaxAge()#&lt;br/&gt;
	&lt;p&gt;
	&lt;/cfoutput&gt;
	&lt;cfdump var="#c#"&gt;
&lt;/cfloop&gt;
</code>
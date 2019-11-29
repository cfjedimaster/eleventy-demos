---
layout: post
title: "Overriding returnFormat at runtime"
date: "2008-07-03T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/03/Overriding-returnFormat-at-runtime
guid: 2912
---

Ok, so this falls in the "Not so sure this is a good idea" department. Stefan Vesterlund posted a comment on my <a href="http://www.raymondcamden.com/index.cfm/2008/6/3/Be-careful-with-returnFormat-and-JSON">last blog entry</a> concerning returnformat. He asked if it was possible to change the returnFormat at runtime. I said that I didn't think it was possible, but that you could simply use returnFormat="plain" and return JSON or WDDX manually. He played around with it and discovered you <i>could</i> override the default behavior. Consider the following code sample.
<!--more-->
<code>
&lt;cffunction name="testMethod" access="remote"&gt;
	&lt;cfset var a = [1,2,4,9]&gt;
	&lt;cfreturn a&gt;
&lt;/cffunction&gt;
</code>

Since I've specified no returnFormat in the cffunction tag, if I hit this via the browser and don't override returnFormat in the query string, the result will be a WDDX string. Now consider this version:

<code>
&lt;cffunction name="testMethod" access="remote"&gt;
	&lt;cfset var a = [1,2,4,9]&gt;
	&lt;cfif a[1] is 1&gt;
		&lt;cfset url.returnFormat="json"&gt;
	&lt;/cfif&gt;
	&lt;cfreturn a&gt;
&lt;/cffunction&gt;
</code>

The code now checks the first entry in the array, and if the value is 1, it sets url.returnFormat. Surprisingly this works. I guess ColdFusion doesn't bother worrying about the returnFormat settings until the end of the method, which kinda makes sense.

I still feel weird about this one, but thought I'd pass it along.
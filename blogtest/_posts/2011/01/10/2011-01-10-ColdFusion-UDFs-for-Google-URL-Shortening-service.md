---
layout: post
title: "ColdFusion UDFs for Google URL Shortening service"
date: "2011-01-10T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/10/ColdFusion-UDFs-for-Google-URL-Shortening-service
guid: 4079
---

I wrote this in about five minutes and it doesn't support auth tokens yet, but here are two UDFs that make use of <a href="http://code.google.com/apis/urlshortener/overview.html">Google's URL Shortening API</a>. First, the shorten call:

<p>

<code>
&lt;cffunction name="googleURLShorten" output="false" returnType="string"&gt;
	&lt;cfargument name="url" type="string" required="true"&gt;
	&lt;cfset var httpResult = ""&gt;
	&lt;cfset var result = ""&gt;

	&lt;cfset var body = {% raw %}{"longUrl"=arguments.url}{% endraw %}&gt;

	&lt;cfset body = serializeJson(body)&gt;
	
	&lt;cfhttp url="https://www.googleapis.com/urlshortener/v1/url" method="post" result="httpResult"&gt;
		&lt;cfhttpparam type="header" name="Content-Type" value="application/json"&gt;
		&lt;cfhttpparam type="body" value="#body#"&gt;
	&lt;/cfhttp&gt;
	&lt;cfset result = httpResult.filecontent.toString()&gt;
	&lt;cfreturn deserializeJSON(result).id&gt;
&lt;/cffunction&gt;
</code>

<p>

And then the reverse:

<p>

<code>
&lt;cffunction name="googleURLExpand" output="false" returnType="string"&gt;
	&lt;cfargument name="url" type="string" required="true"&gt;
	&lt;cfset var httpResult = ""&gt;
	&lt;cfset var result = ""&gt;

	&lt;cfhttp url="https://www.googleapis.com/urlshortener/v1/url?shortUrl=#urlEncodedFormat(arguments.url)#" method="get" result="httpResult"&gt;&lt;/cfhttp&gt;

	&lt;cfset result = httpResult.filecontent.toString()&gt;
	&lt;cfreturn deserializeJSON(result).longUrl&gt;
&lt;/cffunction&gt;
</code>

<p>

And a quick test script:

<p>

<code>
&lt;cfset sampleURL = "http://www.raymondcamden.com/index.cfm/2011/1/10/jQuery-based-example-of-simple-shopping-cart-UI"&gt;
&lt;cfset test = googleURLShorten(sampleURL)&gt;
&lt;cfoutput&gt;
I shorteneded #sampleURL# to #test#.&lt;br/&gt;
&lt;/cfoutput&gt;

&lt;cfset reversed = googleURLExpand(test)&gt;
&lt;cfoutput&gt;
I expanded it to #reversed#.
&lt;/cfoutput&gt;
</code>

<p>

When run, I get:

<p>

<blockquote>
I shorteneded http://www.coldfusionjedi.com/index.cfm/2011/1/10/jQuery-based-example-of-simple-shopping-cart-UI to http://goo.gl/qeDBv.
I expanded it to http://www.coldfusionjedi.com/index.cfm/2011/1/10/jQuery-based-example-of-simple-shopping-cart-UI.
</blockquote>

<p>

Love that typo on the first line. Anyway, the UDFs could be improved with simple error checking and optional token support. But this is the best you get in five minutes. ;)
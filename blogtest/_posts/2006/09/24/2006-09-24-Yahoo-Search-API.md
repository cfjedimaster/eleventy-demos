---
layout: post
title: "Yahoo Search API"
date: "2006-09-24T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/24/Yahoo-Search-API
guid: 1551
---

This weekend I wanted to play a bit with Yahoo's Search API, so I thought I'd share my results here. Yahoo has a pretty big <a href="http://developer.yahoo.com/">developer network</a>, but unfortunately they have no ColdFusion examples. (Hey, Yahoo, lets fix that!)
<!--more-->
I had a bit of trouble finding the actual API however. After a few minutes of searching I found it here: <a href="http://developer.yahoo.com/search/web/V1/webSearch.html">Web Search Documentation</a>. Yahoo uses a simple REST based process. This means you can use CFHTTP and URL parameters instead of a full fledged web service. The result is a nice XML packet you can easily parse.

The next thing you need to test Yahoo's API is an application ID. You can get one using this form: <a href="http://api.search.yahoo.com/webservices/register_application">http://api.search.yahoo.com/webservices/register_application</a>.

One last note. Yahoo's FAQ says:

<blockquote>
<b>Q: Why does ColdFusion keep giving me a "Connection Failure" message?</b><br>
It's an encoding issue. You need to add <cfhttpparam type="Header" name="charset" value="utf-8" /> to your cfhttp call and it should work.
</blockquote>

This did not work for me. Instead I used the charset attribute of the cfhttp itself. Here is a simple example. I changed the appid value though:

<code>
&lt;style&gt;
li {% raw %}{ margin-bottom: 10px; }{% endraw %}
&lt;/style&gt;

&lt;cfset searchTerm = "coldfusion"&gt;
&lt;cfset results = "10"&gt;
&lt;cfset appid = "billgatesisdabomb"&gt;

&lt;cfhttp url="http://api.search.yahoo.com/WebSearchService/V1/webSearch?appid=#appid#&query=#urlEncodedFormat(searchTerm)#&results=#results#" result="result" charset="utf-8"&gt;
&lt;/cfhttp&gt;

&lt;cfif len(result.fileContent) and isXml(result.fileContent)&gt;

	&lt;cfset xmlResult = xmlParse(result.fileContent)&gt;

	&lt;cfoutput&gt;
	Your search for #searchTerm# resulted in #xmlResult.resultSet.xmlAttributes.totalResultsAvailable# matches. You returned #xmlResult.resultSet.xmlAttributes.totalResultsReturned# results.
	
	&lt;ul&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfloop index="x" from="1" to="#xmlResult.resultSet.xmlAttributes.totalResultsReturned#"&gt;
		&lt;cfset node = xmlResult.resultSet.xmlChildren[x]&gt;
		&lt;cfset title = node.title.xmlText&gt;
		&lt;cfset summary = node.summary.xmlText&gt;
		&lt;cfset iUrl = node.url.xmlText&gt;
		&lt;cfset clickurl = node.clickurl.xmlText&gt;
		
		&lt;cfoutput&gt;
		&lt;li&gt;&lt;a href="#clickurl#"&gt;#title#&lt;/a&gt;&lt;br&gt;
		#iURL#&lt;br&gt;
		#summary#
		&lt;/cfoutput&gt;
	&lt;/cfloop&gt;

	&lt;cfoutput&gt;
	&lt;/ul&gt;
	&lt;/cfoutput&gt;
		
&lt;/cfif&gt;
</code>

I'm not sure I even need to explain anything here. The CFHTTP call is pretty standard, again note the charset attribute. Also be sure to check the <a href="http://developer.yahoo.com/search/web/V1/webSearch.html">documentation</a>   for what all the URL parameters mean. The doc also explains the XML result. Honestly I just dumped it and figured it out. The only thing confusing was the "clickURL". Yahoo wants you to use that url for html links to help them track usage of the API. 

Tomorrow I'll write up a somewhat more useful example of this API.
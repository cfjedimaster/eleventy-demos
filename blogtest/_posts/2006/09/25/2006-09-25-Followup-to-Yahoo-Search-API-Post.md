---
layout: post
title: "Followup to Yahoo Search API Post"
date: "2006-09-25T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/25/Followup-to-Yahoo-Search-API-Post
guid: 1553
---

Yesterday I wrote a <a href="http://ray.camdenfamily.com/index.cfm/2006/9/24/Yahoo-Search-API">quick post</a> about using Yahoo's search API. I wanted to follow it up with a slightly more useful example. On of the commenters on my last post noted that Yahoo seemed to respond pretty quickly, and I have to agree. The results take little to no time to return. Anyway, on to the example.
<!--more-->
This example once again uses the search API to return results. However, this time I'm doing something different with the results. Let me show the code first and then I'll explain.

<code>
&lt;cfset searchTerm = "coldfusion blog"&gt;
&lt;cfset mysite = "camdenfamily.com"&gt;
&lt;cfset results = "100"&gt;
&lt;cfset appid = "no_you_cant_have_this"&gt;

&lt;cfset matches = arrayNew(1)&gt;

&lt;cfhttp url="http://api.search.yahoo.com/WebSearchService/V1/webSearch?appid=#appid#&query=#urlEncodedFormat(searchTerm)#&results=#results#" result="result" charset="utf-8" /&gt;

&lt;cfif len(result.fileContent) and isXml(result.fileContent)&gt;

	&lt;cfset xmlResult = xmlParse(result.fileContent)&gt;
	
	&lt;cfloop index="x" from="1" to="#xmlResult.resultSet.xmlAttributes.totalResultsReturned#"&gt;
		&lt;cfset node = xmlResult.resultSet.xmlChildren[x]&gt;
		&lt;cfset title = node.title.xmlText&gt;
		&lt;cfset summary = node.summary.xmlText&gt;
		&lt;cfset iUrl = node.url.xmlText&gt;
		&lt;cfset clickurl = node.clickurl.xmlText&gt;
		
		&lt;cfif findNoCase(mysite, iURL)&gt;
			&lt;cfset match = structNew()&gt;
			&lt;cfset match.title = title&gt;
			&lt;cfset match.summary = summary&gt;
			&lt;cfset match.url = iurl&gt;
			&lt;cfset match.position = x&gt;
			&lt;cfset arrayAppend(matches, match)&gt;
		&lt;/cfif&gt;
		
	&lt;/cfloop&gt;
		
&lt;/cfif&gt;

&lt;cfif arrayLen(matches)&gt;
	&lt;cfmail to="ray@camdenfamily.com" from="egowatcher@egoaddict.com" subject="Your daily ego check."&gt;
	Here is your daily ego match for #dateFormat(now(), "long")#
	
	&lt;cfloop index="x" from="1" to="#arrayLen(matches)#"&gt;
	#matches[x].title# (#matches[x].url#)
	Position: #matches[x].position#
	#matches[x].summary#	
	&lt;/cfloop&gt;
	&lt;/cfmail&gt;
&lt;/cfif&gt;
</code>

The code begins pretty much as yesterday's did, except I added a new variable, "mysite". Yahoo lets you filter search results by site, but that is not what I'm doing. (Jeff posted a perfect example of that in <a href="http://ray.camdenfamily.com/index.cfm/2006/9/24/Yahoo-Search-API#cE56D0301-F519-34FE-FF0D97518EEEC809">this comment</a>.) Instead, scroll down to this line:

<code>
&lt;cfif findNoCase(mysite, iURL)&gt;
</code>

What I've done here is to say that if my site is found in the url then I consider it a match. I add the relevant data to an array of matches. The end of the code block simply checks to see if any matches were found and if so - mails it to me. Here is an example of the output:

<blockquote>
Here is your daily ego match for September 25, 2006<br>
<br> 	
Raymond Camden's ColdFusion Blog: BSG spin off in the works (and a quick note) (http://ray.camdenfamily.com/index.cfm/2006/4/27/BSG-spin-off-in-the-works-and-a-quick-note)<br>
Position: 14<br>
A blog for ColdFusion, Java, and other topics.: BSG spin off in the works (and a ... Subscribe to Raymond Camden's ColdFusion Blog. BSG spin off in the works ...
 	
Raymond Camden's ColdFusion Blog: BlogCFC 5 Beta Announced (http://ray.camdenfamily.com/index.cfm/2006/4/28/BlogCFC-5-Beta-Announced)<br>
Position: 18<br>
A blog for ColdFusion, Java, and other topics.: BlogCFC 5 Beta Announced ... Subscribe to Raymond Camden's ColdFusion Blog. BlogCFC 5 Beta Announced ...
</blockquote>

So what's the point of all this? I can set up this script to run daily and check the position of my site on Yahoo's search engine when people are searching for "coldfusion blog". (And geeze - 14th? What am I doing wrong? :) This can let me monitor my marketing efforts and see what is working and what is not working.

I hope this "real" example helps!
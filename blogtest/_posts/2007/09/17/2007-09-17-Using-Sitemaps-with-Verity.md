---
layout: post
title: "Using Sitemaps with Verity"
date: "2007-09-17T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/17/Using-Sitemaps-with-Verity
guid: 2352
---

Not many people know that ColdFusion ships with a HTTP spider that integrates with Verity. Unfortunately, this spider will only work with localhost as a server. This means if you want to spider multiple sites, you can't. Well, not without playing with your host headers. (More information on the Verity Spider and ColdFusion may be found <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/help.html?content=vspider_01.html">here</a>.)

What I worked on today was a way to work around this limitation. It turns out - if you have a sitemap, you already have a "spider" of your site. BlogCFC supports sitemaps out of the box, and I've <a href="http://www.raymondcamden.com/index.cfm/2006/11/16/Sitemap-Generator">blogged</a> in the past a simple UDF to generate sitemaps. Let's look at how we can convert a sitemap into Verity data.
<!--more-->
To begin with - let's take a look at some very simple sitemap data.

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;
&lt;url&gt;
&lt;loc&gt;http://www.foo.com/index.cfm&lt;/loc&gt;
&lt;/url&gt;
&lt;url&gt;
&lt;loc&gt;http://www.foo.com/index2.cfm&lt;/loc&gt;
&lt;/url&gt;
&lt;url&gt;
&lt;loc&gt;http://www.foo.com/index3.cfm&lt;/loc&gt;
&lt;/url&gt;
&lt;/urlset&gt;
</code>

This sample is missing many of the features that you can include with a sitemap, but it gives you an idea of the structure. As you could guess - a sitemap contains a collection of URLs. So let's look at how we can parse this XML. (Note - I'll be using ColdFusion 8 code throughout this demonstration, but you can easily downgrade this to CF7, 6, or even 5.)

<code>
&lt;!--- read in xml ---&gt;
&lt;cfset myxml = fileRead(expandPath("./sitemap.xml"))&gt;
&lt;!--- convert to xml ---&gt;
&lt;cfset myxml = xmlParse(myxml)&gt;
</code>

The first thing I do is read in my sitemap and convert it to XML. 

<code>
&lt;!--- place to store data ---&gt;
&lt;cfset request.data = structNew()&gt;
</code>

I'm going to be using threading, so I create a Request variable to store my information.

<code>
&lt;!--- now loop through.... ---&gt;
&lt;cfloop index="x" from="1" to="#min(20,arrayLen(myxml.urlset.url))#"&gt;

	&lt;cfset tname = "thread#x#"&gt;
	&lt;cfthread name="#tname#" url="#myxml.urlset.url[x].loc.xmltext#"&gt;
		&lt;cfhttp url="#attributes.url#" result="result"&gt;
		&lt;cfset request.data[attributes.url] = structNew()&gt;
		&lt;cfset request.data[attributes.url].title = getHTMLTitle(result.filecontent)&gt;
		&lt;cfset request.data[attributes.url].body = getHTMLBody(result.filecontent)&gt;
		&lt;!--- remove all html from body ---&gt;
		&lt;cfset request.data[attributes.url].body = rereplace(request.data[attributes.url].body, "&lt;.*?&gt;", "", "all")&gt;
		&lt;cfset headers = getMetaHeaders(result.filecontent)&gt;
		&lt;cfset request.data[attributes.url].keywords = ""&gt;
		&lt;cfset request.data[attributes.url].description = ""&gt;

		&lt;cfset request.data[attributes.url].x = headers&gt;
		
		&lt;!--- find description and keywords ---&gt;
		&lt;cfloop index="x" from="1" to="#arrayLen(headers)#"&gt;
			&lt;cfif structKeyExists(headers[x], "name")&gt;
				&lt;cfif headers[x].name is "description"&gt;
					&lt;cfset request.data[attributes.url].description = headers[x].content&gt;
				&lt;cfelseif headers[x].name is "keywords"&gt;
					&lt;cfset request.data[attributes.url].keywords = headers[x].content&gt;
				&lt;/cfif&gt;	
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
	&lt;/cfthread&gt;

&lt;/cfloop&gt;
</code>

Ok, I have a lot going on here, so let me take it bit by bit. First off - I'm looping over the XML packet by treating the URL tag as an array. Note the use of "min". I did this to simply make my testing run quicker. My current blog's site map is over 2k URLs. (The cool thing is that it only took ColdFusion about 9 minutes to process all 2000 when I tried it.) For each URL, I suck down the content with CFHTTP.

Now for the interesting part. I could simply provide the HTML to Verity. While this "works", it doesn't provide as much information to Verity as I would like. Also - Verity doesn't "get" that is indexing HTML data. It thinks it is just working with simple strings. So in order to make things a bit nicer, I do some cleaning. 

First off I use a few UDFs: getHTMLTitle, getHTMLBody, getMetaHeaders. The first and last are from CFLib and the middle one is a modified version of getHTMLTitle. These simply parse the HTML string for the title, body, and the meta tags. (I provide the full code at the end.) 

I remove all HTML from the body. I then look at the meta tags and specifically try to find a description and keywords meta tag. All of this gets stored into the Request scope Data structure I created.

Now I need to tell ColdFusion to wait for the threads to end:

<code>
&lt;!--- join the threads ---&gt;
&lt;cfthread action="join" name="#structKeyList(cfthread)#" /&gt;
</code>

I then convert my structure into a query:

<code>
&lt;!--- make a query for the data ---&gt;
&lt;cfset info = queryNew("url,body,title,keywords,description")&gt;
&lt;cfloop item="c" collection="#request.data#"&gt;
	&lt;cfset queryAddRow(info)&gt;
	&lt;cfset querySetCell(info, "url", c)&gt;
	&lt;cfset querySetCell(info, "body", request.data[c].body)&gt;
	&lt;cfset querySetCell(info, "title", request.data[c].title)&gt;
	&lt;cfset querySetCell(info, "keywords", request.data[c].keywords)&gt;
	&lt;cfset querySetCell(info, "description", request.data[c].description)&gt;
&lt;/cfloop&gt;
</code>

There isn't anything too fancy there - I'm just copying from the structure into a new query. 

Next I insert into the Verity collection:

<code>
&lt;!--- insert data ---&gt;
&lt;cfindex collection="sitemaptest" action="refresh" query="info" title="title" key="url" body="body" urlpath="url" custom1="keywords" custom2="description" status="status"&gt;
</code>

Note how I tell Verity what column means what. I stored the description and keywords into the custom columns. 

That's it! To make sure things worked, I dumped some information at the end:

<code>
&lt;cfoutput&gt;
&lt;p&gt;
Done indexing. Did #info.recordCount# rows. Took #totaltime# ms.
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;cfdump var="#status#"&gt;
</code>

All in all this worked ok - but it has a few problems/places for improvement:

<ul>
<li>First off - you can really tell that Verity wasn't 100% sure what to do with my data. That's why I removed the HTML. I could have considered taking the data I sucked down, saving it to an HTML file, and then running a file based index. While this would be slower, it could have resulted in better indexing.
<li>Second - my code, ignoring the Mind(), will suck down every URL and index it. As I mentioned, sitemaps can store more than just URLs. They can also store the last time they were modified. If I were reading my XML data once a day, then it would make sense to only suck down URLs that were modified today. This would <b>greatly</b> improve the speed of the indexing.
</ul>

Here is the complete index file:

<code>
&lt;cfsetting requesttimeout="600"&gt;

&lt;cfset thetime = getTickCount()&gt;

&lt;cfscript&gt;
/**
 * Parses an HTML page and returns the title.
 * 
 * @param str 	 The HTML string to check. 
 * @return Returns a string. 
 * @author Raymond Camden (ray@camdenfamily.com) 
 * @version 1, December 3, 2001 
 */
function GetHTMLTitle(str) {
	var matchStruct = reFindNoCase("&lt;[[:space:]]*title[[:space:]]*&gt;([^&lt;]*)&lt;[[:space:]]*/title[[:space:]]*&gt;",str,1,1);
	if(arrayLen(matchStruct.len) lt 2) return ""; 
	return Mid(str,matchStruct.pos[2],matchStruct.len[2]);	
}

function GetHTMLBody(str) {
	var matchStruct = reFindNoCase("&lt;.*?body.*?&gt;(.*?)&lt;[[:space:]]*/body[[:space:]]*&gt;",str,1,1);
	if(arrayLen(matchStruct.len) lt 2) return ""; 
	return Mid(str,matchStruct.pos[2],matchStruct.len[2]);	
}

function GetMetaHeaders(str) {
	var matchStruct = structNew();
	var name = "";
	var content = "";
	var results = arrayNew(1);
	var pos = 1;
	var regex = "&lt;meta[[:space:]]*(name{% raw %}|http-equiv)[[:space:]]*=[[:space:]]*(""|{% endraw %}')([^""]*)(""{% raw %}|')[[:space:]]*content=(""|{% endraw %}')([^""]*)(""{% raw %}|')[[:space:]]*/{0,1}{% endraw %}&gt;"; 	
	
	matchStruct = REFindNoCase(regex,str,pos,1);
	while(matchStruct.pos[1]) {
		results[arrayLen(results)+1] = structNew();
		results[arrayLen(results)][ Mid(str,matchStruct.pos[2],matchStruct.len[2])] = Mid(str,matchStruct.pos[4],matchStruct.len[4]);
		results[arrayLen(results)].content = Mid(str,matchStruct.pos[7],matchStruct.len[7]);
		pos = matchStruct.pos[6] + matchStruct.len[6] + 1;
		matchStruct = REFindNoCase(regex,str,pos,1);
	}
	return results;
}
&lt;/cfscript&gt;

&lt;!--- create collection if needed ---&gt;
&lt;cfcollection action="list" name="mycollections"&gt;

&lt;cfif not listFindNoCase(valueList(mycollections.name), "sitemaptest")&gt;
	&lt;cfoutput&gt;&lt;p&gt;Creating collection.&lt;p&gt;&lt;/cfoutput&gt;
	&lt;cfcollection action="create" collection="sitemaptest" path="#server.coldfusion.rootdir#/collections"&gt;
&lt;/cfif&gt;
					
&lt;!--- read in xml ---&gt;
&lt;cfset myxml = fileRead(expandPath("./sitemap.xml"))&gt;
&lt;!--- convert to xml ---&gt;
&lt;cfset myxml = xmlParse(myxml)&gt;
&lt;!--- place to store data ---&gt;
&lt;cfset request.data = structNew()&gt;

&lt;!--- now loop through.... ---&gt;
&lt;cfloop index="x" from="1" to="#min(20,arrayLen(myxml.urlset.url))#"&gt;

	&lt;cfset tname = "thread#x#"&gt;
	&lt;cfthread name="#tname#" url="#myxml.urlset.url[x].loc.xmltext#"&gt;
		&lt;cfhttp url="#attributes.url#" result="result"&gt;
		&lt;cfset request.data[attributes.url] = structNew()&gt;
		&lt;cfset request.data[attributes.url].title = getHTMLTitle(result.filecontent)&gt;
		&lt;cfset request.data[attributes.url].body = getHTMLBody(result.filecontent)&gt;
		&lt;!--- remove all html from body ---&gt;
		&lt;cfset request.data[attributes.url].body = rereplace(request.data[attributes.url].body, "&lt;.*?&gt;", "", "all")&gt;
		&lt;cfset headers = getMetaHeaders(result.filecontent)&gt;
		&lt;cfset request.data[attributes.url].keywords = ""&gt;
		&lt;cfset request.data[attributes.url].description = ""&gt;

		&lt;cfset request.data[attributes.url].x = headers&gt;
		
		&lt;!--- find description and keywords ---&gt;
		&lt;cfloop index="x" from="1" to="#arrayLen(headers)#"&gt;
			&lt;cfif structKeyExists(headers[x], "name")&gt;
				&lt;cfif headers[x].name is "description"&gt;
					&lt;cfset request.data[attributes.url].description = headers[x].content&gt;
				&lt;cfelseif headers[x].name is "keywords"&gt;
					&lt;cfset request.data[attributes.url].keywords = headers[x].content&gt;
				&lt;/cfif&gt;	
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
	&lt;/cfthread&gt;

&lt;/cfloop&gt;

&lt;!--- join the threads ---&gt;
&lt;cfthread action="join" name="#structKeyList(cfthread)#" /&gt;

&lt;!--- make a query for the data ---&gt;
&lt;cfset info = queryNew("url,body,title,keywords,description")&gt;
&lt;cfloop item="c" collection="#request.data#"&gt;
	&lt;cfset queryAddRow(info)&gt;
	&lt;cfset querySetCell(info, "url", c)&gt;
	&lt;cfset querySetCell(info, "body", request.data[c].body)&gt;
	&lt;cfset querySetCell(info, "title", request.data[c].title)&gt;
	&lt;cfset querySetCell(info, "keywords", request.data[c].keywords)&gt;
	&lt;cfset querySetCell(info, "description", request.data[c].description)&gt;
&lt;/cfloop&gt;

&lt;!--- insert data ---&gt;
&lt;cfindex collection="sitemaptest" action="refresh" query="info" title="title" key="url" body="body" urlpath="url" custom1="keywords" custom2="description" status="status"&gt;

&lt;cfset totaltime = getTickCount() - thetime&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Done indexing. Did #info.recordCount# rows. Took #totaltime# ms.
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;cfdump var="#status#"&gt;
</code>
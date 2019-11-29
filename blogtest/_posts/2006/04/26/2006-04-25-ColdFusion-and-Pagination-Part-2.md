---
layout: post
title: "ColdFusion and Pagination - Part 2"
date: "2006-04-26T07:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/26/ColdFusion-and-Pagination-Part-2
guid: 1234
---

Before getting into this entry, let me share two quick notes about the <a href="http://ray.camdenfamily.com/index.cfm/2006/4/24/ColdFusion-and-Pagination">last entry</a>. First off, if you are a subscriber and only read the emails, I had made a small mistake in my logic. It was corrected on the entry. Thanks to my reader Fernando for pointing it out. Secondly, Rob Gonda made the point that you probably don't want to do pagination in ColdFusion if you are returning a hundred thousand or so results. He is absolutely correct and shows a better alternative <a href="http://www.robgonda.com/blog/index.cfm/2006/4/25/MSSQL-and-Pagination">here</a>.
<!--more-->
In the first entry, I demonstrated how you can use ColdFusion to do simple pagination. I had a query and a variable determining how many records to show per page. I showed how you could make links to let the user go back and forward one page a time. This works fine for a small set of results, but if you have more results, a user will have to hit "Next Page" a few too many times. What if you could simply provide a list of pages so a user could immediately jump to the page? It is really rather simple and I will show you how. Before going on though, be sure you read the <a href="http://ray.camdenfamily.com/index.cfm/2006/4/24/ColdFusion-and-Pagination">last entry</a>. (Boy, I sure wish BlogCFC support related entries. Oh wait, it <a href="http://www.blogcfc.com/index.cfm/2006/4/25/Major-New-Feature">does!</a>.)

Let me start by showing the code, and then explaining what I did. At the end of the entry I'll post the complete code.

<code>
&lt;cfset page = 0&gt;
&lt;cfloop index="x" from="1" to="#data.recordCount#" step="#perpage#"&gt;
	&lt;cfset page = page + 1&gt;
	&lt;cfif url.start is not x&gt;
		&lt;cfset link = cgi.script_name & "?start=" & x&gt;
		&lt;cfoutput&gt;&lt;a href="#link#"&gt;#page#&lt;/a&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;#page#&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

The first thing I do is create a variable that will store the page number. This isn't actually needed as I could use math, but I've learned not to use math before I've had enough coffee. 

Next I do a loop from one to the record count of the query. However, I use a step value of perpage. This makes it easy for me to split up my data into the right segments.

Inside the loop I increment page by one. Then I check to see if our current starting position is equal to X. If it isn't, it means I'm not on that page. I make a link (just like I did for the previous and next links) and just use X for my starting position. If not, I simply output X.

That's it. Now I have both a previous and next link, and between them, a list of pages for direct access to a particular page. Here is the complete code.

<code>
&lt;cfset data = queryNew("id,name,age,active","integer,varchar,integer,bit")&gt;

&lt;cfloop index="x" from="1" to="31"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
	&lt;cfset querySetCell(data,"active",false)&gt;
&lt;/cfloop&gt;

&lt;cfset perpage = 10&gt;
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfif not isNumeric(url.start) or url.start lt 1 or url.start gt data.recordCount or round(url.start) neq url.start&gt;
	&lt;cfset url.start = 1&gt;
&lt;/cfif&gt;

&lt;h2&gt;Random People&lt;/h2&gt;

&lt;cfoutput query="data" startrow="#url.start#" maxrows="#perpage#"&gt;
#currentrow#) #name#&lt;br /&gt;
&lt;/cfoutput&gt;

&lt;p align="right"&gt;
[
&lt;cfif url.start gt 1&gt;
	&lt;cfset link = cgi.script_name & "?start=" & (url.start - perpage)&gt;
	&lt;cfoutput&gt;&lt;a href="#link#"&gt;Previous Page&lt;/a&gt;&lt;/cfoutput&gt;
&lt;cfelse&gt;
	Previous Page
&lt;/cfif&gt;

&lt;cfset page = 0&gt;
&lt;cfloop index="x" from="1" to="#data.recordCount#" step="#perpage#"&gt;
	&lt;cfset page = page + 1&gt;
	&lt;cfif url.start is not x&gt;
		&lt;cfset link = cgi.script_name & "?start=" & x&gt;
		&lt;cfoutput&gt;&lt;a href="#link#"&gt;#page#&lt;/a&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;#page#&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfif (url.start + perpage - 1) lt data.recordCount&gt;
	&lt;cfset link = cgi.script_name & "?start=" & (url.start + perpage)&gt;
	&lt;cfoutput&gt;&lt;a href="#link#"&gt;Next Page&lt;/a&gt;&lt;/cfoutput&gt;
&lt;cfelse&gt;
	Next Page
&lt;/cfif&gt;
]
&lt;/p&gt;
</code>
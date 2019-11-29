---
layout: post
title: "My cheesy non-database ColdFusion Code for Model-Glue.com"
date: "2007-11-19T12:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/19/My-cheesy-nondatabase-ColdFusion-Code-for-ModelGluecom
guid: 2483
---

I've already had a few requests to update the list of <a href="http://www.model-glue.com/sites.cfm">sites</a> over on the Model-Glue site. I thought I'd share the Super Cool code I used to build the page. I didn't want to use the database, so I whipped up the following precious bit of code:
<!--more-->
<code>
&lt;!--- Ray's hack to avoid a DB. Yes, this is the suck. ---&gt;
&lt;cfset sites = queryNew("title,url,description")&gt;
&lt;cfsavecontent variable="data"&gt;
iRovr@http://www.irovr.com@iRovr is a unique social experience developed exclusively for the iPhone. Members can blog, share photos, bookmark urls and link to YouTube videos by sending emails to POP aliases created specifically for their account.
Stavanger2008@http://www.stavanger2008.com@In 2008 Stavanger (norway) will be the European Capital of Culture. This is his official web site.
BPO Pros@http://bpoprosonline.com@MI based Realtor
&lt;/cfsavecontent&gt;
&lt;cfset data = trim(data)&gt;
&lt;cfloop index="line" list="#data#" delimiters="#chr(13)##chr(10)#"&gt;
	&lt;cfset site = listFirst(line,"@")&gt;
	&lt;cfset theurl = listGetAt(line,2,"@")&gt;
	&lt;cfset desc = listLast(line,"@")&gt;
	&lt;cfset queryAddRow(sites)&gt;
	&lt;cfset querySetCell(sites, "title", site)&gt;
	&lt;cfset querySetCell(sites, "url", theurl)&gt;
	&lt;cfset querySetCell(sites, "description", desc)&gt;
&lt;/cfloop&gt;
</code>

I deleted some of the text data - but as you can see - I build a fake query based on a string delimited by @ signs. The first part of each line is the site title, then the URL, and then the description. Later on in the page I just output over the query like it was any other 'real' query. If I ever make a <i>real</i> database application out of this page, I just need to point to a CFC to get the query.
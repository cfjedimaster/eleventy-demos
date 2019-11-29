---
layout: post
title: "Create a RSS Feed out of your Share Files"
date: "2007-11-02T19:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/02/Create-a-RSS-Feed-out-of-your-Share-Files
guid: 2450
---

Adobe's <a href="http://share.adobe.com">Share</a> service doesn't have RSS feeds yet (as far as I know), but there is no reason you can't role your own! Here is a quick example.
<!--more-->
The first piece is <a href="http://sharecfc.riaforge.org">ShareCFC</a>, my open source wrapper for the Share service. Grab the bits - get the required logon bits, and then create an instance:

<code>
&lt;cfapplication name="shareapi"&gt;

&lt;cfset appkey = "harrypotter"&gt;
&lt;cfset sharedsecret = "parishiltonisactuallyreallysmart"&gt;

&lt;cfif not isDefined("application.share")&gt;
	&lt;cfset application.share = createObject("component", "share").init("ray@camdenfamily.com","password-noreally",appkey,sharedsecret)&gt;
&lt;/cfif&gt;
</code>

The initial logon to the Share service can be a bit slow so the cache here is important. Next we grab the files. Now the Share service is still in development and currently has some performance issues (like Lindsey has drinking issues), but I've been assured this will be fixed soon. For my testing I cached the results. To get all of my Share files it is one simple CFC call:

<code>
&lt;cfif not isDefined("application.files")&gt;
	&lt;cfset application.files = application.share.list()&gt;
&lt;/cfif&gt;
&lt;cfset files = application.files&gt;
</code>

I copied from the application scope to save myself some typing. So far so good? We don't want to create an RSS feed that points to items that folks can't use, so let's filter out the non-public stuff (and maybe this is a good idea to add to my code):

<code>
&lt;!--- filter by public ---&gt;
&lt;cfquery name="files" dbtype="query"&gt;
select	*
from	files
where	sharelevel = 'public'
&lt;/cfquery&gt;
</code>

Last but not least - lets make the feed. I create a column map to define columns to CFFEED required items, and create a struct of metadata:

<code>
&lt;cfset cmap = structNew()&gt;
&lt;cfset cmap.publisheddate = "createddate"&gt;
&lt;cfset cmap.title = "name"&gt;
&lt;cfset cmap.rsslink = "recipienturl"&gt;

&lt;cfset meta = structNew()&gt;
&lt;cfset meta.title = "My Public Share Files"&gt;
&lt;cfset meta.description = "All of my public files from Share"&gt;
&lt;cfset meta.link = "http://www.raymondcamden.com"&gt;
&lt;cfset meta.version = "rss_2.0"&gt;
</code>

And finally - serve up the RSS:

<code>
&lt;cffeed action="create" properties="#meta#" query="#files#"
		columnMap="#cmap#" xmlVar="feedXML"&gt;
		
&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#feedxml#&lt;/cfoutput&gt;
</code>

Easy peasy, lemon squeezy as my son would say. I see two potential things I can add to ShareCFC now - an optional share level filter to List(), and perhaps an automatic way to return the data in the RSS form. 

I've saved my RSS here: <a href="feed://www.coldfusionjedi.com/demos/test.xml">feed://www.coldfusionjedi.com/demos/test.xml</a>
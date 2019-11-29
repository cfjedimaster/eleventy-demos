---
layout: post
title: "Update to ColdFusionBloggers.org"
date: "2007-07-29T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/29/Update-to-ColdFusionBloggersorg
guid: 2228
---

I've done some more updates to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>. Here they are in no particular order.

I fixed a bug where you couldn't use the search form from other pages. This bug existed because I used ColdFusion.navigate on the content div. The content div only existed on the main page so that totally broken the form elsewhere. I switched my JavaScript code to this:

<code>
if(document.getElementById("content") != null) ColdFusion.navigate('content.cfm?search_query='+escape(searchvalue),'content');
else document.location.href = 'index.cfm?search_query='+escape(searchvalue);
</code>

This also fixed a bug where the last search term in the stats pod didn't work right. I now simply pass url.search_query into my div. Here is the updated code on index.cfm:

<code>
&lt;cfif structKeyExists(url, "search_query") and len(trim(url.search_query))&gt;
	&lt;cfset append = "&search_query=#urlEncodedFormat(url.search_query)#"&gt;
&lt;cfelse&gt;
	&lt;cfset append = ""&gt;
&lt;/cfif&gt;

&lt;cfdiv bind="url:content.cfm?#append#" id="content" /&gt;
</code>

I suppose I could have just passed cgi.query_string along. If I add more URL variables I'll consider that.

I added a + next to entries so that you can open them in a new window. I wrapped the + with the new cftooltip tag. I swear I just love that tag. It's the ice-cold mug for a good beer. 

I added click through tracking. Now all clicks (from the main list of entries) are logged. I added a new <a href="http://www.coldfusionbloggers.org">stats</a> page that tracks both the top entries (over the past 24 hours) as well as top search terms. I want to thank everyone who is searching for "ray camden is ..." type variations. You guys are truly freaks. ;)

So the code.zip file has been updated and includes the new table schema for the click tracking. I guess now the only thing left to do is preferences. I'm a bit torn as to how much I want to add. I don't want to go into the territory of my (now long dead) rsswatcher project. Anyway, I welcome ideas for what should be allowed. I'd love to do it w/o a real login, which means client variables probably, but then you can't take your preferences elsehwhere.
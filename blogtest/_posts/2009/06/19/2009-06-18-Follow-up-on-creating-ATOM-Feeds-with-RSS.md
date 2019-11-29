---
layout: post
title: "Follow up on creating ATOM Feeds with RSS"
date: "2009-06-19T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/19/Follow-up-on-creating-ATOM-Feeds-with-RSS
guid: 3402
---

A few months ago I posted a quick blog entry on <a href="http://www.raymondcamden.com/index.cfm/2009/2/25/Metadata-properties-for-CFFEED--Atom">metadata properties</a> for creating Atom feeds in ColdFusion. This is not well documented in the ColdFusion docs, so I had to spend time reading the spec to get what I needed to pass to ColdFusion.

I exchanged a few emails with Chris and wanted to share some of what we found.
<!--more-->
The first issue he had was with links for his Atom feed. He tried using a columnMap value of atomLink:

<code>
&lt;cfset columnmap = structNew() /&gt;
&lt;cfset columnmap.title = "title" /&gt;
&lt;cfset columnmap.atomlink = "pub_url" /&gt;
&lt;cfset columnmap.publisheddate = "date_published_utc" /&gt;
&lt;cfset columnmap.content = "description" /&gt;
</code>

This failed with:

<blockquote>
<p>
There is a problem in the column mappings specified in the columnMap structure. The cffeed query does not contain any column by the name of ATOMLINK.
</p>
</blockquote>

This is a <b>bad</b> error. His query certainly did contain the column. However, AtomLink isn't valid for Atom feeds. If you read the docs for <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/Tags_f_01.html#4002452">CFFEED</a>, you will see there is a large table that describes what columns map to both RSS and Atom feeds. From here I found that the column he wants is linkhref.

<code>
&lt;cfset columnmap = structNew() /&gt;
&lt;cfset columnmap.title = "title" /&gt;
&lt;cfset columnmap.linkhref = "link"/&gt;
&lt;cfset columnmap.publisheddate = "posted" /&gt;
</code>

The next problem was weirder. He used the content property to point to his query:

<code>
&lt;cfset columnmap.content = "body" /&gt;
</code>

This worked, but anytime the body column had a comma in it, the data would only render to the comma. So if content was: "Camden, Raymond", then you would see "Camden" in the XML. Checking the Atom reference for <a href="http://www.atomenabled.org//developers/syndication/atom-format-spec.php#element.content">content</a>, all I saw mentioned was that the content type could be text, html, or xhtml. I added a new column to my query called content type, and supplied it first with the value text. This didn't work. I then tried html and xhtml and those didn't work as well. The only thing the Atom spec mentioned (unless I read too quick) was that HTML needed to be escaped, but even simple strings refused to work. 

Chris found another solution though. If you use the summary column than it works just fine. From what I read of the spec, summary is probably a better fit for RSS feeds anyway.

I hope this helps. Frankly I almost feel like Atom feeds are too much trouble. They are more powerful then RSS2 in that they can be more descriptive, but shoot, it seems like a real hassle to actually use them.
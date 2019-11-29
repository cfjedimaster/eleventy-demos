---
layout: post
title: "Metadata properties for CFFEED"
date: "2007-08-22T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/22/Metadata-properties-for-CFFEED
guid: 2297
---

When creating RSS feeds with the CFFEED tag, you can specify metadata properties for the feed that help describe the feed in general. The docs though aren't very clear on <i>what</i> metadata properties you can provide.
<!--more-->
The docs say that for RSS 2.0 feeds the title, link, description, and version properties are required, but all others are optional. What others? I was never able to find documentation that describes what fields you can use. At the same time though CFFEED is smart enough to recognize valid fields. If you pass a field named "ray" for example, it ignores it when creating the feed. So what is available? I did some Googling and I found a specification for RSS 2:

<a href="http://cyber.law.harvard.edu/rss/rss.html">RSS 2.0 at Harvard Law</a>

The docs here listed a bunch of items all of which worked. In general they were all simple to use. For example, here was my initial metadata based on what I had to pass:

<code>
&lt;!--- Struct to contain metadata ---&gt;
&lt;cfset meta = structNew()&gt;
&lt;cfset meta.title = "Orange Whip Studio Films"&gt;
&lt;cfset meta.link = "http://localhost/ows"&gt;
&lt;cfset meta.description = "Latest Films"&gt;
</code>

Next I added additional fields:

<code>
&lt;cfset meta.language = "Klingon"&gt;
&lt;cfset meta.copyright = "I own you."&gt;
&lt;cfset meta.managingEditor = "ray@camdenfamily.com"&gt;
&lt;cfset meta.webmaster = "ray@camdenfamily.com"&gt;
&lt;cfset meta.pubDate = now()&gt;
&lt;cfset meta.lastBuildDate = now()&gt;
</code>

This worked fine until I hit categories. Categories have been an array of a structs:

<code>
&lt;cfset meta.category = []&gt;
&lt;cfset meta.category[1] = structNew()&gt;
&lt;cfset meta.category[1].value = "Boogers"&gt;
</code>

Why? Because categories support an optional domain field. To supply the domain just add it as a key:

<code>
&lt;cfset meta.category = []&gt;
&lt;cfset meta.category[1] = structNew()&gt;
&lt;cfset meta.category[1].domain = "foo"&gt;
&lt;cfset meta.category[1].value = "Boogers"&gt;
</code>

Another complex value is the cloud key. This takes 5 subkeys:

<code>
&lt;cfset meta.cloud = structNew()&gt;
&lt;cfset meta.cloud.domain ="rpc.sys.com"&gt;
&lt;cfset meta.cloud.port = "80"&gt;
&lt;cfset meta.cloud.path = "/rpc2"&gt;
&lt;cfset meta.cloud.registerProcedure="pingMe"&gt;
&lt;cfset meta.cloud.protocol = "soap"&gt;
</code>

Lastly - both the skipdays and skiphours fields require special values - and these are actually documented. The skipdays value is a list of days and skiphours is a list of hours.

<code>
&lt;cfset meta.skipHours = "0,1,2,3,4,5,6"&gt;
&lt;cfset meta.skipDays = "Saturday,Sunday"&gt;
</code>

Another cool metadata field is image. When used, this provides a nice little logo when viewing the feed. (At least it did in Firefox.) 

<code>
&lt;cfset meta.image = structNew()&gt;
&lt;cfset meta.image.title = "Logo"&gt;
&lt;cfset meta.image.url = "http://localhost/ows/images/logo_a.gif"&gt;
&lt;cfset meta.image.link = meta.link&gt;
</code>

One field in particular that was interesting was the textInput field. Form the specs:

<blockquote>
A channel may optionally contain a &lt;textInput&gt; sub-element, which contains four required sub-elements.
</blockquote>

Ok - that's cool - but then the next paragraph reads:

<blockquote>
The purpose of the &lt;textInput&gt; element is something of a mystery. You can use it to specify a search engine box. Or to allow a reader to provide feedback. Most aggregators ignore it.
</blockquote>

Sweet. I love it when specs say something is a mystery. Below is the complete set of metadata I tried, all of which worked (except textInput, it did show up in the xml, but Firefox didn't do anything with it). Tomorrow I'm going to do the same digging for Atom.

<code>
&lt;!--- Struct to contain metadata ---&gt;
&lt;cfset meta = structNew()&gt;
&lt;cfset meta.title = "Orange Whip Studio Films"&gt;
&lt;cfset meta.link = "http://localhost/ows"&gt;
&lt;cfset meta.description = "Latest Films"&gt;

&lt;cfset meta.language = "Klingon"&gt;
&lt;cfset meta.copyright = "I own you."&gt;
&lt;cfset meta.managingEditor = "ray@camdenfamily.com"&gt;
&lt;cfset meta.webmaster = "ray@camdenfamily.com"&gt;
&lt;cfset meta.pubDate = now()&gt;
&lt;cfset meta.lastBuildDate = now()&gt;

&lt;cfset meta.category = []&gt;
&lt;cfset meta.category[1] = structNew()&gt;
&lt;cfset meta.category[1].domain = "foo"&gt;
&lt;cfset meta.category[1].value = "Boogers"&gt;

&lt;cfset meta.generator = "ColdFusion 8, baby"&gt;
&lt;cfset meta.docs = "http://cyber.law.harvard.edu/rss/rss.html"&gt;

&lt;cfset meta.cloud = structNew()&gt;
&lt;cfset meta.cloud.domain ="rpc.sys.com"&gt;
&lt;cfset meta.cloud.port = "80"&gt;
&lt;cfset meta.cloud.path = "/rpc2"&gt;
&lt;cfset meta.cloud.registerProcedure="pingMe"&gt;
&lt;cfset meta.cloud.protocol = "soap"&gt;

&lt;cfset meta.ttl = 60&gt;

&lt;cfset meta.image = structNew()&gt;
&lt;cfset meta.image.title = "Logo"&gt;
&lt;cfset meta.image.url = "http://localhost/ows/images/logo_a.gif"&gt;
&lt;cfset meta.image.link = meta.link&gt;

&lt;cfset meta.rating = "pics rating"&gt;

&lt;cfset meta.textInput = structNew()&gt;
&lt;cfset meta.textInput.title = "Search"&gt;
&lt;cfset meta.textInput.description = "Use this to search our site"&gt;
&lt;cfset meta.textInput.name = "search"&gt;
&lt;cfset meta.textInput.link = "http://localhost/ows/69/_temp.cfm"&gt;

&lt;cfset meta.skipHours = "0,1,2,3,4,5,6"&gt;
&lt;cfset meta.skipDays = "Saturday,Sunday"&gt;

&lt;cfset meta.version = "rss_2.0"&gt;
</code>
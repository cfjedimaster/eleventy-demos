---
layout: post
title: "Bug with CFFEED and iTunes podcasting metadata"
date: "2011-04-28T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/28/Bug-with-CFFEED-and-iTunes-podcasting-metadata
guid: 4213
---

Yesterday morning I tweeted about a CFFEED issue I had run into. I thought at first it was VFS related, but instead it turned out to be related to iTunes-related podcasting XML tags. I was able to figure this out when I took a closer look at the exception:

<p>

java.util.NoSuchElementException at java.util.StringTokenizer.nextToken(StringTokenizer.java:332) at coldfusion.syndication.RSSParser.getItunesCategoryStruct

<p>

I then looked at the feed in question, http://www.2ddu.com/feed/, and examined the XML.

<p>

<code>
&lt;itunes:category text="Technology"&gt; 
  &lt;itunes:category text="Tech News"/&gt; 
&lt;/itunes:category&gt; 
&lt;itunes:category text="Technology"&gt; 
  &lt;itunes:category text="Software How-To"/&gt; 
&lt;/itunes:category&gt;
</code>

<p>

So - see the child category tags within each Technology block? That's valid for iTunes Podcasting specs, but it breaks CFFEED if you try to parse the metadata. If you just parse the entries you won't get an error. The only way around it is to regex the tags out of there. If you need them you can grab them before you remove them from the XML. Of course, if you don't need the metadata from the feed, you can avoid this error as well.

<p>

I was going to file a bug report for this, but the site is currently throwing an error. When it works I'll post a comment with the ID.
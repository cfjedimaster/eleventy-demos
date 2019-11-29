---
layout: post
title: "Did you know - previousCriteria and cfsearch"
date: "2011-04-10T21:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/10/Did-you-know-previousCriteria-and-cfsearch
guid: 4190
---

Here is a little feature I don't see folks use too often, and it wasn't actually working right for Solr in ColdFusion 9.0 (but corrected in 9.0.1), but did you know that it was possible to perform a search within the results of a previous search using ColdFusion's Solr integration? (Technically this is also possible with Verity, but it's best we ignore this as it doesn't have much a life expectancy anymore in ColdFusion.)
<!--more-->
<p/>

In simplest terms, providing previousCriteria to the cfsearch tag will perform a "search within a search", so if searching for food, for example, returned 100 results out a possible 1000, doing a second search for beer and using previousCriteria="food" will return a number smaller. 

<p/>

Here is an incredibly simple example:

<p/>

<code>
&lt;cfsearch collection="cfdocs" criteria="cfsearch" name="results"&gt;
&lt;cfoutput&gt;Search for coldfusion: Returned #results.recordCount#
results.&lt;p/&gt;&lt;/cfoutput&gt;

&lt;cfsearch collection="cfdocs" criteria="solr"
previouscriteria="cfsearch" name="results"&gt;
&lt;cfoutput&gt;Search for cffeed within coldfusion: Returned
#results.recordCount# results.&lt;p/&gt;&lt;/cfoutput&gt;

&lt;cfsearch collection="cfdocs" criteria="solr" name="results"&gt;
&lt;cfoutput&gt;Search for cffeed by itself: Returned #results.recordCount#
results.&lt;p/&gt;&lt;/cfoutput&gt;
</code>

<p/>

In this example my initial search is for cfsearch itself (I'm searching the ColdFusion docs so hopefully that makes sense). I then search for solr and provide cfsearch as the previousCriteria. As a final test, I search for solr by itself. My results were:

<p>

<blockquote>
Search for coldfusion: Returned 39 results.<br/>
Search for cffeed within coldfusion: Returned 7 results.<br/>
Search for cffeed by itself: Returned 24 results.
</blockquote>

<p>

Nice little feature, and interesting to use, but it seems like something you don't encounter in the wild too much. I wonder if it confuses users too much? Either way - hope this little tidbit helps.
---
layout: post
title: "Query of Query bug involving numbers"
date: "2011-08-01T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/01/Query-of-Query-bug-involving-numbers
guid: 4315
---

Thanks for this find comes to me from Victor Yelizarov. He reported to me an odd issue with sorting and query of queries. Consider the following code sample:
<!--more-->
<p/>

<code>
&lt;cfset q = queryNew("number","Decimal")&gt;

&lt;cfset queryAddRow(q,5)&gt;
&lt;cfset q["number"][1] = 10.1&gt;
&lt;cfset q["number"][2] = 0.01&gt;
&lt;cfset q["number"][3] = 22.75&gt;
&lt;cfset q["number"][4] = 21.05&gt;
&lt;cfset q["number"][5] = 8.33&gt;

&lt;cfquery name="q" dbtype="query"&gt;
SELECT number
FROM q
ORDER BY number DESC
&lt;/cfquery&gt;

&lt;cfdump var="#q#"&gt;
</code>

<p/>

We know that ColdFusion looks at the query metadata to figure out how to do sorting. In this case he explicitly set the column type to decimal. That should have been enough. But from the result you can see otherwise...

<p/>
 
<img src="https://static.raymondcamden.com/images/ScreenClip149.png" />

<p/>

So obviously this is a bug - how do we get around it? If you JavaCast when setting the values, that works. If you multiply the values by one, that also works. But an easier solution, and one that may be useful to remember anyway, is to cast in your query of query.

<p/>

<code>
&lt;cfquery name="q3" dbtype="query"&gt;
SELECT cast(number as decimal) as n
FROM q
ORDER BY n DESC
&lt;/cfquery&gt;
</code>

<p/>
---
layout: post
title: "Transfer Query - From Phrase to AND Search"
date: "2008-09-23T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/23/Transfer-Query-From-Phrase-to-AND-Search
guid: 3028
---

Not sure if anyone will find this helpful, but here goes. A user reported some dissatisfaction with the search engine at <a href="http://www.cflib.org">CFLib</a>. Specifically a search for FOO GOO would result in an exact phrase match on foo goo. It would not match a UDF named MyFooMilkshakeBetterThanGoo. 

This was because my search did the rather simple {% raw %}%SEARCH%{% endraw %} style match (ie, match the search term exactly, case insensntive). Here is the original Transfer code I used for the search:
<!--more-->
<code>
&lt;cfsavecontent variable="sql"&gt;
from udf.udf
where (udf.udf.name like :search
or udf.udf.shortdescription like :search
or udf.udf.description like :search)
and udf.udf.released = :active
order by udf.udf.name asc
&lt;/cfsavecontent&gt;

&lt;cfset q = variables.transfer.createQuery(sql)&gt;
&lt;cfset q.setParam("search", "{% raw %}%" & arguments.search & "%{% endraw %}", "string")&gt;
&lt;cfset q.setParam("active", true, "boolean")&gt;
&lt;cfset q.setCacheEvaluation(true)&gt;
</code>

Even if you don't know Transfer, this should be readable to you. I do a match on either name, shortdescription, or description. If you search for FOO, then basically it ends up being a search on {% raw %}%FOO%{% endraw %}. Again though this kind of breaks down when you search for multiple words. 

I wanted to keep things simple, so I decided that any multiword search would be an AND style search (ie, all the words must match), and I'd split on an empty space. I rewrote the TQL like so:

<code>
&lt;cfsavecontent variable="sql"&gt;
from udf.udf
where (
	&lt;cfloop index="idx" from="1" to="#arrayLen(words)#"&gt;
	&lt;cfoutput&gt;
	(udf.udf.name like :word#idx#
	or udf.udf.shortdescription like :word#idx#
	or udf.udf.description like :word#idx#
	) &lt;cfif idx lt arrayLen(words)&gt;and&lt;/cfif&gt;
	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
)
and udf.udf.released = :active
order by udf.udf.name asc
&lt;/cfsavecontent&gt;
	
&lt;cfset q = variables.transfer.createQuery(sql)&gt;
&lt;cfloop index="idx" from="1" to="#arrayLen(words)#"&gt;
	&lt;cfset q.setParam("word#idx#", "{% raw %}%" & words[idx] & "%{% endraw %}", "string")&gt;
&lt;/cfloop&gt;
&lt;cfset q.setParam("active", true, "boolean")&gt;
&lt;cfset q.setCacheEvaluation(true)&gt;
</code>

First off, the variables words comes from this change in the function header:

<code>
&lt;cfset var words = listToArray(arguments.search," ")&gt;
</code>

So a search for FOO GOO results in words being equal to ["FOO","GOO"]. Notice then my loop over the array. I didn't use the new array style cfloop as I wanted a counter variable I could check to see if I needed an AND at the end of each block.

The next change was to have a dynamic set of setParams. This will replace word1, word2, etc, with the proper value from the array.

A good test for this is a search for "host url". Before the change it returned nothing. Now it matches getCurrentURL, getHostFromURL, and getHostFromURLJava.
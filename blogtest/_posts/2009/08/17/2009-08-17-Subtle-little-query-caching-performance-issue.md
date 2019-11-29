---
layout: post
title: "Subtle little query caching performance issue"
date: "2009-08-17T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/17/Subtle-little-query-caching-performance-issue
guid: 3491
---

I'm doing a bit of performance tuning (via CFML) for a client and I ran into a little subtle bug that I thought I'd share with others. One of the methods returned all rows that were within a day based range. By that I mean it allowed you to get entries that were created less than 1 day ago, 2 days ago, 5 days ago, and so forth. The query runs a bit slow but was using query caching. 

I noticed something interesting though. The debugging was the query always said that the cache was <b>not</b> enabled. Looking over the query I didn't see anything wrong - at least not at first. Can you see why the query never cached?
<!--more-->
<code>
&lt;cfquery datasource="#datasource#" cachedWithin="#createTimeSpan(0,0,5,0)#" name="q"&gt;
SELECT
  Post.postId,
  Post.feed
FROM
  Post
WHERE
  dateTimeAggregated &gt; #dateAdd("h", ((arguments.daysBack * 24) * -1), dateConvert("local2utc", now()))#
ORDER BY
  clicks DESC, Post.dateTimeAggregated desc
LIMIT
  #arguments.offset#, #arguments.limit#
&lt;/cfquery&gt;
</code>

I've trimmed the query a bit - but do you see the issue yet? The WHERE clause is the culprit. Remember, the idea was - return records that were made N days ago or sooner. You can do this in SQL completely, but the code did it in ColdFusion with the dateAdd function. Notice how it creates the date value - it subtracts N*24 (N being the number of days) from the current time. So if I run this query at 12:01:01 and then again at 12:01:02, the value of now() has changed. Since the WHERE clause changed, the cached query from before wasn't used. I'm not sure this is the best fix, but I simply tried a hard coded time value:

<code>
dateTimeAggregated &gt; #dateAdd("h", ((arguments.daysBack * 24) * -1), "#dateFormat(now(), 'mm/dd/yyyy')#")#
</code>

It seemed to work fine. I need to double check that it returns the values right - but the point is - when using dynamic queries and caching, be sure to note exactly how the variables can change. While the "daysBack" variable only has a few options, now() is - obviously - pretty varied.
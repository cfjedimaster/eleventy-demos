---
layout: post
title: "Another example of the QofQ Bug"
date: "2009-08-28T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/28/Another-example-of-the-QofQ-Bug
guid: 3503
---

About two months ago I <a href="http://www.raymondcamden.com/index.cfm/2009/7/2/Query-of-query-issue-with-where-clausejoins">blogged</a> about an interesting Query of Query bug. The bug involved a QoQ that changed the sort order of the original data. This week a user sent in another example of a QoQ causing changes to the original query. Consider the following query:
<!--more-->
<code>
&lt;cfset mydata = queryNew("mydate, rannum")&gt;

&lt;cfloop index="loop1" from="1" to="5"&gt;
      &lt;cfset newrow  = queryaddrow(mydata, 1)&gt;
      &lt;cfset temp = querysetcell(mydata, "mydate", #dateformat(now()-loop1,"dd-mmm-yy")#, #loop1#)&gt;
      &lt;cfset temp = querysetcell(mydata, "rannum", 55.65, #loop1#)&gt;
&lt;/cfloop&gt;
</code>

The query contains two columns, mydate and rannum. (I just now noticed the space in his list of columns. ColdFusion appears to auto-trim it. I'd remove that from the code however.) Dumping the query shows:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 183.png" />

Now consider this simple QofQ:

<code>
&lt;cfquery dbtype="query" name="query4graph"&gt;
select mydate, rannum from mydata
&lt;/cfquery&gt;   
</code>

After running this, a new dump of mydata shows:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 255.png" />

The dates in the original query have now been converted into full date/time stamps. This comes from the fact that ColdFusion noticed they were dates and treated them as such. I think that makes sense, but it still bugs me that it changes the original query.

You can kind of fix it by forcing a type on the queryNew:

<code>
&lt;cfset mydata = queryNew("mydate, rannum","varchar,double")&gt;
</code>

Of course, that's kinda sucky as well. I bet if you sort on it you will get inconsistent results. The best fix then would be to duplicate the query before you run the QofQ on it. That way you can go ahead and let ColdFusion convert the column to dates and still get proper sorting.

Oh - and in case you were wondering - the formats of the date in the query were pretty important. He was feeding the query to a chart and needed it to show up correctly.
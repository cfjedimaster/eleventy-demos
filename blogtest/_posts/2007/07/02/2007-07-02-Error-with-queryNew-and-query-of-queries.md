---
layout: post
title: "Error with queryNew and query of queries"
date: "2007-07-02T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/02/Error-with-queryNew-and-query-of-queries
guid: 2166
---

I'm working alongside my client today (well, "alongside" as in virtually on the net) when he pings me with an odd error. His template allows you to sort a set of data by selecting a value from a drop down. Whenever he picks Published Year as the sort, he would get a very odd error:

<blockquote>
Error casting an object of type to an incompatible type. This usually indicates a programming error in Java, although it could also mean you have tried to use a foreign object in a different way than it was designed.
</blockquote>

The SQL in question was extremely simple:

<code>
&lt;cfquery name="foo" dbtype="query"&gt;
select * 
from   tempquery
order by #foter.sorter#
&lt;/cfquery&gt;
</code>

Now ignore for a moment the select * and possibly unsafe order by. Instead note that this is a query of query. One of the first things I check for in cases like this is ColdFusion getting confused by the column type. When you create a query by hand (temp query was made with query new), and you then later perform a query of query on it, ColdFusion has to guess at what your column types are. It looks at the first few rows and makes assumptions based on what it sees. 

However - you can stop ColdFusion from guessing. If you read the <a href="http://www.cfquickdocs.com/?getDoc=QueryNew">docs on QueryNew()</a>, you will see that it takes a second argument. This argument is a list of column types that correspond to the initial list of columns in the first argument.

I had him add this list and the error went away.
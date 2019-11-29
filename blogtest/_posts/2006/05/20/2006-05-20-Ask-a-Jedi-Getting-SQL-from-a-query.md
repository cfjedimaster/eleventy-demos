---
layout: post
title: "Ask a Jedi: Getting SQL from a query"
date: "2006-05-20T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/20/Ask-a-Jedi-Getting-SQL-from-a-query
guid: 1281
---

Matt asks:

<blockquote>
I am looking for a function that will return the SQL of a given query name. Do you know of any?
</blockquote>

While there are hacks to do this, the "official" way, under ColdFusion MX 7, is to simply use the new result attribute:

<code>
&lt;cfset name = "e"&gt;

&lt;cfquery name="getIt" datasource="cfartgallery" result="result"&gt;
select	artistid
from	artists
where	lastname like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#name#%{% endraw %}" maxlength="255"&gt;
&lt;/cfquery&gt;

&lt;cfdump var="#result#"&gt;
</code>

Notice I added a result="result" attribute to the query. The result structure contains these keys:

<ul>
<li>cached: A boolean that indicates if the query was cached.
<li>columnlist: A lit of columns for the query. This is <b>not</b> in the order you specified. If you want that, simply call getMetaData(getIt). This returns an array of structs. You not only get the right order of columns, but the same case that was used in SQL. (If case matters, but to be honest, you probably shouldn't depend on that.)
<li>executionTime: How long it took the query to execute.
<li>recordCount: How many records the query returned.
<li>sql: The SQL that was used in the query. If you had dynamic parts of the sql, you will see the values that were passed to the query.
<li>sqlparameters: If you used cfqueryparam in your query (and if you didn't, you are asking for trouble), then this will be an array of each cfqueryparam item that was used in query.
</ul>

You may notice a ? or two in your sql. This represents the cfqueryparam blocks. To get an idea of the "real" SQL, you would need to replace the first ? with the first item in sqlparameters. And so on and so on. In <a href="http://ray.camdenfamily.com/projects/starfish">Starfish</a>, one of the things I did was write a little tool to replace the ? marks so I wouldn't have to do so in my head. This is especially useful for large queries with lots of queryparams. (If folks want the code, let me know and I'll post it as a followup entry;.)

So obviously none of this works if you are using an earlier version of ColdFusion. If you want, you could write a query where the SQL is generated outside the query. So for example, you may use cfsavecontent to save the sql and then pass that inside the query. Unfortunately this would prevent the use of cfqueryparam.
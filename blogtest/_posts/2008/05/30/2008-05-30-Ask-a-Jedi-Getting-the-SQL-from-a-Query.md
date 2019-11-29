---
layout: post
title: "Ask a Jedi: Getting the SQL from a Query"
date: "2008-05-30T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/30/Ask-a-Jedi-Getting-the-SQL-from-a-Query
guid: 2850
---

This is a dupe, but as it comes up kind of often, I thought I'd blog it anyway. Doug asks:

<blockquote>
<p>
After I perform a cfquery, is there a way to see what the query actually looked like? I'm not asking if there was an
error, I know I can grab that through a cfcatch. But if the query was good (and I'm still not getting the results I expected) I want to see how the query was formed. I know I can great a variable and copy/paste the query contents into
that, but I didn't know if there was some kind of easier way to just look at the query or something.
</p>
</blockquote>
<!--more-->
Absolutely. Since CF7 we've had two ways to introspect ColdFusion queries. To answer your main question, you can get the SQL (along with other bits of info) by using result= in your query:

<code>
&lt;cfquery name="test" datasource="blogdev" result="result"&gt;
select	#limit# id, title
select	id, title
from	tblblogentries
where	title like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%foo%{% endraw %}"&gt;
limit #limit#
&lt;/cfquery&gt;
</code>

This will create a structure named result with these values:

<ul>
<li>Cached: Boolean that tells you if the query was cached
<li>ColumnList: List of columns. This is NOT in the same order as your query. (More on that in a bit.)
<li>ExecutionTime: Time it took to run the query.
<li>RecordCount: Number of rows returned
<li>SQL: The SQL, what you want!
<li>SQLParameters: An array of values used in cfqueryparameter tags. Note that the SQL value will use a ? for each of these.
</ul>

Another function you can use is getMetaData(). If you use it on a query you get an array of structs back for each column. This is in the order specified in your SQL, and even matches the case used in the SQL if you care about that. It contains a type name that tells you what type of column it is as well as a "IsCaseSensitive" flag. So if you do care about what order you selected your columns, this is what you would use.
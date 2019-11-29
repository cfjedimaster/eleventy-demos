---
layout: post
title: "Interesting bug to watch out for involving cfqueryparam and sql"
date: "2010-07-27T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/27/Interesting-bug-to-watch-out-for-involving-cfqueryparam-and-sql
guid: 3890
---

Credit for this find goes to Lance Staples, a coworker of mine who is apparently too cool to blog. He noticed an error today in a ColdFusion script. See if you can spot what the problem is:
<!--more-->
<p>

<code>
&lt;cfquery name="getBeer" datasource="cfunited"&gt;
select type, description, quantity, price
from beer
where 
type like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#arguments.search#%{% endraw %}"&gt;
--and description like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#arguments.search#%{% endraw %}"&gt;
&lt;/cfquery&gt;
</code>

<p>

When run, the error was: <b>Invalid parameter binding(s)</b>

<p>

Spotted it yet? Someone edited the SQL to comment out the second part of the where clause. However, the "comment" was a SQL comment. ColdFusion doesn't know diddly poop about those. ColdFusion Builder recognizes it though and even grays it out, so it can definitely be confusing.  Because ColdFusion doesn't ignore anything outside of it's own CFML comments, it still tries to send the second bound parameter. SQL Server ends up getting two bound params when only one is actually being used.
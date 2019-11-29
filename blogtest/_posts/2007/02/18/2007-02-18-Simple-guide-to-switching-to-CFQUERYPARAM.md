---
layout: post
title: "Simple guide to switching to CFQUERYPARAM"
date: "2007-02-18T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/18/Simple-guide-to-switching-to-CFQUERYPARAM
guid: 1845
---

I've had a few requests to quickly review how to switch a dynamic query not using cfqueryparam to one that <i>is</i> using cfqueryparam. I've covered the reasons for using them many times (basically sql injection and performance). There are also things you lose (like ColdFusion's built in query caching). With that in mind - here is basic rule to consider when figuring out if you need cfqueryparam:

<blockquote>
If any portion of the WHERE/VALUES/SET clause in a query is dynamic, the cfqueryparam tag should be used. 
</blockquote>

So here is a simple example:

<code>
&lt;cfquery name="searchUsers" datasource="data"&gt;
select id, name, email
from   users
where  name like '{% raw %}%#form.name#%{% endraw %}'
&lt;/cfquery&gt;
</code>

Now here is the same query switched to cfqueryparam:

<code>
&lt;cfquery name="searchUsers" datasource="data"&gt;
select id, name, email
from   users
where  name like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#form.name#%{% endraw %}"&gt;
&lt;/cfquery&gt;
</code>

There are two things to note here. First is the cfsqltype value. This value tells the database what type of data is being passed in. There is a whole list of types that you can use. See the table on the cfQuickDocs <a href="http://www.cfquickdocs.com/?getDoc=cfqueryparam">cfqueryparam</a> page. In <i>general</i> you will use:

<ul>
<li>cf_sql_varchar for simple strings, like my example above.
<li>cf_sql_integer for simple numbers, like those used in primary keys
</ul>

Another example of the power of cfqueryparam is lists. Imagine this query:

<code>
&lt;cfquery name="searchUsers" datasource="data"&gt;
select id, name, email
from   users
where  usertype in (#form.categorylist#)
&lt;/cfquery&gt;
</code>

This can be changed to cfqueryparam like so:

<code>
&lt;cfquery name="searchUsers" datasource="data"&gt;
select id, name, email
from   users
where  usertype in (&lt;cfqueryparam cfsqltype="cf_sql_integer" value="#form.categorylist#" list="true"&gt;)
&lt;/cfquery&gt;
</code>

Lastly - I mentioned above in my "rule" (and since I called it that a few hundred of my readers will find exceptions :) that cfqueryparam should be used in the WHERE clause. You can't use it elsewhere. This query would <b>not</b> be a candidate for cfqueryparam usage.

<code>
&lt;cfquery name="getSomething" datasource="data"&gt;
select  #somecol#
from    #sometable#
where   x = 1
</code>
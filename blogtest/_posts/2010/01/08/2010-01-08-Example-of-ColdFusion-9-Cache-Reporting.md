---
layout: post
title: "Example of ColdFusion 9 Cache Reporting"
date: "2010-01-08T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/08/Example-of-ColdFusion-9-Cache-Reporting
guid: 3678
---

About two nights ago I moved <a href="http://www.coldfusionbloggers.org">CFBloggers</a> to my new host. Later that night I noticed a pretty severe performance issue at the database tier. I was reasonably confident I knew what the issue was, but I was also freaking tired as heck. Given that my body was going to overrule my brain in terms of what solution to apply, I decided to apply a quick bit of caching to the code in question.

<p/>
<!--more-->
Now - let me be clear. <b>Caching to fix a performance problem is no fix.</b> Certainly there are times when it is out of your control. Anything loaded via HTTP for example is a prime candidate for caching. But I want folks to be absolutely clear on the fact that what I did here was a practical, expedient patch, not a fix. 

<p>

That being said, screw it, I was tired and it worked. 2 points for me. 

<p>

So let's take a quick look at the method in question, getEntries.

<p>

<code>
&lt;cffunction name="getEntries" access="public" returnType="struct" output="false"&gt;
	&lt;cfargument name="start" type="numeric" required="false" default="1"&gt;
	&lt;cfargument name="total" type="numeric" required="false" default="10"&gt;
	&lt;cfargument name="search" type="string" required="false" default=""&gt;
	&lt;cfargument name="log" type="boolean" required="false" default="false"&gt;
	&lt;cfargument name="dateafter" type="date" required="false"&gt;

	&lt;cfset var s = structNew()&gt;
	&lt;cfset var q = ""&gt;

	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select	SQL_CALC_FOUND_ROWS e.url, e.title, e.posted, e.created, e.content, e.id, b.name as blog, e.categories, b.description as blogdescription, b.url as blogurl
	from	entries e, blogs b
	where	e.blogidfk = b.id
	&lt;cfif len(trim(arguments.search))&gt;
		and (1=0
		&lt;cfloop index="k" list="#arguments.search#"&gt;
			or
			(
			e.title like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#k#%{% endraw %}"&gt;
			or
			e.content like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#k#%{% endraw %}"&gt;
			or
			e.categories like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#k#%{% endraw %}"&gt;
			)
		&lt;/cfloop&gt;
		)
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(arguments,"dateafter")&gt;
	and 	e.created &gt; &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#arguments.dateafter#"&gt;
	&lt;/cfif&gt;

	order by e.created desc
	limit	#arguments.start-1#,#arguments.total#
	&lt;/cfquery&gt;
	&lt;cfset s.entries = q&gt;

	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select found_rows() as total
	&lt;/cfquery&gt;
	&lt;cfset s.total = q.total&gt;

	&lt;!--- log search ---&gt;
	&lt;cfif len(trim(arguments.search)) and arguments.log&gt;
		&lt;cfset logSearch(arguments.search)&gt;
	&lt;/cfif&gt;

	&lt;cfreturn s&gt;
&lt;/cffunction&gt;
</code>

<p>

This is the core function that loads entries up for CFBloggers. It handles the basic data load, the paging, and retrieving searches or date based ranges. (Those of you who are OO nerds will note that the logSearch portion violates SRP. Mea culpa.) My patch took all of 2 minutes to write:

<p>

<code>
&lt;cffunction name="getEntries" access="public" returnType="struct" output="false"&gt;
	&lt;cfargument name="start" type="numeric" required="false" default="1"&gt;
	&lt;cfargument name="total" type="numeric" required="false" default="10"&gt;
	&lt;cfargument name="search" type="string" required="false" default=""&gt;
	&lt;cfargument name="log" type="boolean" required="false" default="false"&gt;
	&lt;cfargument name="dateafter" type="date" required="false"&gt;

	&lt;cfset var s = structNew()&gt;
	&lt;cfset var q = ""&gt;
	&lt;cfset var k = ""&gt;

	&lt;cfset var key = "#arguments.start#_#arguments.total#_#arguments.search#"&gt;
	&lt;cfif structKeyExists(arguments, "dateafter")&gt;
		&lt;cfset key &= "_#arguments.dateafter#"&gt;
	&lt;/cfif&gt;

	&lt;cfset var s = cacheGet(key)&gt;
	&lt;cfif isNull(s)&gt;
		&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
		select	SQL_CALC_FOUND_ROWS e.url, e.title, e.posted, e.created, e.content, e.id, b.name as blog, e.categories, b.description as blogdescription, b.url as blogurl
		from	entries e, blogs b
		where	e.blogidfk = b.id
		&lt;cfif len(trim(arguments.search))&gt;
			and (1=0
			&lt;cfloop index="k" list="#arguments.search#"&gt;
				or
				(
				e.title like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#k#%{% endraw %}"&gt;
				or
				e.content like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#k#%{% endraw %}"&gt;
				or
				e.categories like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#k#%{% endraw %}"&gt;
				)
			&lt;/cfloop&gt;
			)
		&lt;/cfif&gt;
		&lt;cfif structKeyExists(arguments,"dateafter")&gt;
		and 	e.created &gt; &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#arguments.dateafter#"&gt;
		&lt;/cfif&gt;

		order by e.created desc
		limit	#arguments.start-1#,#arguments.total#
		&lt;/cfquery&gt;
		&lt;cfset s.entries = q&gt;

		&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
		select found_rows() as total
		&lt;/cfquery&gt;

		&lt;cfset s.total = q.total&gt;
		&lt;cfset cachePut(key, s)&gt;
	&lt;/cfif&gt;

	&lt;!--- log search ---&gt;
	&lt;cfif len(trim(arguments.search)) and arguments.log&gt;
		&lt;cfset logSearch(arguments.search)&gt;
	&lt;/cfif&gt;

	&lt;cfreturn s&gt;
&lt;/cffunction&gt;
</code>

<p>

As you can see, I generate a cache key based on the relevant arguments (log doesn't count). I then try to fetch the query from the cache. If it doesn't exist, I run the query and stuff it in the query. 

<p>

To handle updates, I simply modified my addEntryIfNew method. As you can guess, this handles adding new blog entries when they don't already exist. I won't post the entire method, but just note that I added this:

<code>
&lt;cfset var ids = cacheGetAllIds()&gt;
&lt;cfset var id = ""&gt;
&lt;cfloop index="id" array="#ids#"&gt;
	&lt;cfset cacheRemove(id, false)&gt;
&lt;/cfloop&gt;
</code>

<p>

Raise your hand if you are <b>real</b> happy that you can var scope anywhere now. 

<p>

So this went live two nights ago. I knew it would be a while before I could update the database (and thanks go to Gary Funk for helping me with that) so I was curious to see how much the cache impacted my server. I wrote up a very quick template that gathered cache data and then logged it:

<code>
&lt;cfset ids = cacheGetAllIds()&gt;
&lt;cfset data = {}&gt;
&lt;cfset data.totalItems = arrayLen(ids)&gt;
&lt;cfset data.totalSize = 0&gt;
&lt;cfloop index="id" array="#ids#"&gt;
	&lt;cfset md = cacheGetMetadata(id)&gt;
	&lt;cfset data.totalSize += md.size&gt;
&lt;/cfloop&gt;
&lt;cfset data.ids = ids&gt;

&lt;cfoutput&gt;
#data.totalItems# items&lt;br/&gt;
size = #data.totalSize#&lt;br/&gt;
#arrayToList(data.ids)#
&lt;/cfoutput&gt;

&lt;cflog file="cfbloggers_cache" text="#serializeJSON(data)#"&gt;
</code>

<p>

Nothing fancy here. I get the IDs, count them and count the size. I serialize the whole thing to JSON and then cflog it. I then added a scheduled task to run this report every 10 minutes. Last night I wrote a quick log parser that reads in the data and creates a query from the serialized data.

<p>

<code>
&lt;cfset cachedata = queryNew("items,size,time", "integer,bigint,timestamp")&gt;

&lt;cfset logFile = "/Users/ray/Downloads/cfbloggers_cache.log"&gt;
&lt;cfset dataSet = 0&gt;
&lt;cfloop index="line" file="#logFile#"&gt;
	&lt;cfset dataSet++&gt;
	&lt;cfset line = listDeleteAt(line, 1)&gt;
	&lt;cfset line = listDeleteAt(line, 1)&gt;
	&lt;cfset date = listGetAt(line, 1)&gt;
	&lt;cfset date = mid(date, 2, len(date)-2)&gt;
	&lt;cfset line = listDeleteAt(line, 1)&gt;
	&lt;cfset time = listGetAt(line, 1)&gt;
	&lt;cfset time = mid(time, 2, len(time)-2)&gt;
	&lt;cfset line = listDeleteAt(line, 1)&gt;
	&lt;cfset line = listDeleteAt(line, 1)&gt;
	&lt;cfset line = mid(line, 2, len(line)-2)&gt;
	&lt;cfset line = replace(line, '""', '"', "all")&gt;
	&lt;cfset d = deserializeJSON(line)&gt;
	&lt;cfset queryAddRow(cachedata)&gt;
	&lt;cfset querySetCell(cachedata, "items", d.totalitems)&gt;
	&lt;cfset querySetCell(cachedata, "size", d.totalsize)&gt;
	&lt;cfset querySetCell(cachedata, "time", date & " " & time)&gt;
&lt;/cfloop&gt;
</code>

<p>

I then took this data and applied it to a chart. Now here is where things get interesting. It is a rather large chart, so please click on it to view the original version.

<p>

<a href="http://www.raymondcamden.com/images/cachereportorig.png"><img src="https://static.raymondcamden.com/images/cfjedi/cachereportsmall.png" title="Go ahead, click, you know you want to..." /></a>

<p>

The chart begins at midnight on the 7th and goes till 11am or so today. The up and down movement represents the cache growing until new content comes in. What's odd is that there is steady growth on the morning of the 7th, then it "calms" down, then at night it begins to grow and not fall, which must represent the lack of people blogging and adding new entries. This morning it seems to be following the afternoon pattern from yesterday. The only change I'm aware of is the database fix, which I did at lunch time yesterday. But while that sped things up, I didn't clear the cache myself, so I'm not sure why the drop would happen then.

<p>

Anyway, I thought folks might find this interesting. I'll run another report on Monday and share the report then.
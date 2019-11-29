---
layout: post
title: "Quick Transfer Tip"
date: "2009-03-19T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/19/Quick-Transfer-Tip
guid: 3282
---

Using an ORM means never having to write SQL. Well, ok, maybe not. As much as I love Transfer (and am beginning to love Hibernate), there are still times when you have to resort to writing SQL. Here is a quick tip.

Using getDatasource() to get access to the datasource configuration? If so, you may have code that looks like this:

<code>
&lt;cffunction name="getFoo" access="public" returnType="numeric" output="false"&gt;
	&lt;cfset var ds = getDatasource()&gt;
	&lt;cfset var foo = ""&gt;
		
	&lt;cfquery name="foo" datasource="#ds.getName()#"&gt;
	select	sum(rabbits) as total
	from	huntinglog
	where	club_no = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#getId()#"&gt;
	&lt;/cfquery&gt;
	&lt;cfreturn val(foo.total)&gt;
		
&lt;/cffunction&gt;
</code>

Notice I pass ds.getName() to load the datasource name. My datasource.xml looks like so:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;datasource&gt;
  &lt;name&gt;romulanale&lt;/name&gt;
  &lt;username&gt;&lt;/username&gt;
  &lt;password&gt;&lt;/password&gt;
&lt;/datasource&gt;
</code>

Notice that I did not specify a username/password. But what happens if the production system needs this? It is trivial to supply it in the XML. Transfer will use it. But my query above will fail. Luckily I can just switch to:

<code>
&lt;cfquery name="foo" datasource="#ds.getName()#" username="#ds.getUsername()#" password="#ds.getPassword()#"&gt;
</code>

What's nice is that this works just fine when the username/password values are blank. Now I'm set no matter what.
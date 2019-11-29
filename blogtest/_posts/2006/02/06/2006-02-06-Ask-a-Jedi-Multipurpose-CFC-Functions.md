---
layout: post
title: "Ask a Jedi: Multi-purpose CFC Functions"
date: "2006-02-06T14:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/06/Ask-a-Jedi-Multipurpose-CFC-Functions
guid: 1077
---

A reader asks:

<blockquote>
I have a form and I am generating the dropdowns via a query in a CFC. Is it acceptable to make the functions sort of multi-purpose to generate both the list for the dropdown and single item from the list? I would basically use an if-then statement to add or remove the where clause in the query based on if I needed the full list of query records or just a specific record. To me it seems like a good timesaver from basicly creating identical functions with the only difference being the addition an argument and the where clause in the query but it is very possible that I'm not seeing some obvious or not so obvious pitfalls.
</blockquote>

Absolutely! Obviously it will depend on a case by case basis, but in general, yes, it is definitely "ok" to do what you are doing. Many times I will build a generic getAll() method that... well... gets all the data. I will then add a set of optional attributes that act as filters for that method. So for example, I may filter out content that has active=false. 

Again - remember that no one answer will cover every situation. Here is an example - you may want to log searches. Your getAll method probably shouldn't be "cluttered" with logging. In that case, I'd maybe build a search method() which does the logging, and <i>then</i> calls getAll, with the appropriate filters. Here is a simple pseudo-code example:

<code>
&lt;cffunction name="getAll" returnType="query" output="false"&gt;
	&lt;cfargument name="searchterms" type="string" required="false"&gt;
	&lt;cfset var q = ""&gt;

	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select	name, body
	from	content
	&lt;cfif structKeyExists(arguments,"searchterms") and len(trim(arguments.searchterms))&gt;
	where	body like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.searchterms#"&gt;
	&lt;/cfif&gt;
	&lt;/cfquery&gt;

	&lt;cfreturn q&gt;
&lt;/cffunction&gt;

&lt;cffunction name="search" returnType="query" output="false"&gt;
	&lt;cfargument name="searchterms" type="string" required="true"&gt;
	&lt;cflog file="myapp" text="Searched for #arguments.searchterms#"&gt;

	&lt;cfreturn getAll(arguments.searchterms)&gt;
&lt;/cffunction&gt;
</code>
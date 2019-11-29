---
layout: post
title: "Example of a custom cache in a ColdFusion Component"
date: "2006-11-13T14:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/13/Example-of-a-custom-cache-in-a-ColdFusion-Component
guid: 1651
---

My friend who is learning ColdFusion recently ran into the issue of not being able to use query caching since he was also using cfqueryparam. Since cfqueryparam is vital to any dynamic query, he wisely chose to lose the the caching and keep the cfqueryparam. I mentioned that he could roll his own caching and wrote up this quick example for him.
<!--more-->
Consider this CFC method:

<code>
&lt;cffunction name="getData" returnType="query" access="public" output="false"&gt;
	&lt;cfargument name="name" type="string" required="false"&gt;
	&lt;cfargument name="age" type="numeric" required="false"&gt;
	&lt;cfargument name="active" type="boolean" required="false"&gt;
	
	&lt;cfset var data = queryNew("id,name,age,active","integer,varchar,integer,bit")&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var q = ""&gt;
	&lt;cfset var go_to = ""&gt;
	
	&lt;cfloop index="x" from="1" to="20"&gt;
		&lt;cfset queryAddRow(data)&gt;
		&lt;cfset querySetCell(data,"id",x)&gt;
		&lt;cfset querySetCell(data,"name","User #x#")&gt;
		&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
		&lt;cfset querySetCell(data,"active",randRange(0,1))&gt;
	&lt;/cfloop&gt;
	
	&lt;cfquery name="q" dbType="query"&gt;
	select	id, name, age, active
	from	data
	where	1=1
	&lt;cfif	structKeyExists(arguments, "name")&gt;
	and		name = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.name#"&gt;
	&lt;/cfif&gt;
	&lt;cfif	structKeyExists(arguments, "age")&gt;
	and		age = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.age#"&gt;
	&lt;/cfif&gt;
	&lt;cfif	structKeyExists(arguments, "active")&gt;
	and		name = &lt;cfqueryparam cfsqltype="cf_sql_bit" value="#arguments.active#"&gt;
	&lt;/cfif&gt;
	&lt;/cfquery&gt;
	
	&lt;cfscript&gt;
	go_to = createObject("java", "java.lang.Thread");
	go_to.sleep(200); //sleep time in milliseconds
	&lt;/cfscript&gt;
	
	&lt;cfreturn q&gt;

&lt;/cffunction&gt;
</code>

Obviously this is a contrived example - but it does show a pretty standard example of requesting data with a few potential filters applied. The "sleep" code is <b>not</b> standard and is just there to force the query to be slow.

Now let's look at a modified version:

<code>
&lt;cffunction name="getDataBetter" returnType="query" access="public" output="false"&gt;
	&lt;cfargument name="name" type="string" required="false"&gt;
	&lt;cfargument name="age" type="numeric" required="false"&gt;
	&lt;cfargument name="active" type="boolean" required="false"&gt;
	
	&lt;cfset var data = queryNew("id,name,age,active","integer,varchar,integer,bit")&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var q = ""&gt;
	&lt;cfset var key = ""&gt;
	
	&lt;cfset var go_to = ""&gt;
	
	&lt;!--- generate key from arguments. ---&gt;
	&lt;cfset key = ""&gt;
	&lt;cfif structKeyExists(arguments, "name")&gt;
		&lt;cfset key = key & "NAME=#arguments.name# "&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(arguments, "age")&gt;
		&lt;cfset key = key & "AGE=#arguments.age# "&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(arguments, "active")&gt;
		&lt;cfset key = key & "ACTIVE=#arguments.active# "&gt;
	&lt;/cfif&gt;
	
	&lt;!--- do we have the cached version? ---&gt;
	&lt;cfif structKeyExists(variables.cache, key)&gt;
		&lt;cfreturn variables.cache[key]&gt;
	&lt;/cfif&gt;

	&lt;!--- continue on then... ---&gt;	
	&lt;cfloop index="x" from="1" to="20"&gt;
		&lt;cfset queryAddRow(data)&gt;
		&lt;cfset querySetCell(data,"id",x)&gt;
		&lt;cfset querySetCell(data,"name","User #x#")&gt;
		&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
		&lt;cfset querySetCell(data,"active",randRange(0,1))&gt;
	&lt;/cfloop&gt;
	
	&lt;cfquery name="q" dbType="query"&gt;
	select	id, name, age, active
	from	data
	where	1=1
	&lt;cfif	structKeyExists(arguments, "name")&gt;
	and		name = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.name#"&gt;
	&lt;/cfif&gt;
	&lt;cfif	structKeyExists(arguments, "age")&gt;
	and		age = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.age#"&gt;
	&lt;/cfif&gt;
	&lt;cfif	structKeyExists(arguments, "active")&gt;
	and		name = &lt;cfqueryparam cfsqltype="cf_sql_bit" value="#arguments.active#"&gt;
	&lt;/cfif&gt;
	&lt;/cfquery&gt;
	
	&lt;cfscript&gt;
	go_to = createObject("java", "java.lang.Thread");
	go_to.sleep(200); //sleep time in milliseconds
	&lt;/cfscript&gt;
	
	&lt;!--- store to cache ---&gt;
	&lt;cfset variables.cache[key] = q&gt;
	&lt;cfreturn q&gt;

&lt;/cffunction&gt;
</code>

Let me focus on what I changed. First - outside of the method my CFC's init method created a structure to store my cache. This was done like so:

<code>
&lt;cfset variables.cache = structNew()&gt;
</code>

Inside my getDataBetter method, I create a key based on the arguments passed in. The point of this is to create a unique key based on the arguments passed in. This unique key is then checked to see if it exists in the structure. If it does - I simply return the query immediately. If not - I continue with creating the query and store the result in the cache.

Run a quick test and you will see it runs well:

<code>
&lt;cftimer label="no arguments" type="inline"&gt;
	&lt;cfset data = mycfc.getDataBetter()&gt;
&lt;/cftimer&gt;
&lt;p /&gt;
&lt;cftimer label="active=true" type="inline"&gt;
	&lt;cfset data = mycfc.getDataBetter(active=true)&gt;
&lt;/cftimer&gt;
&lt;p /&gt;
&lt;cftimer label="no arguments" type="inline"&gt;
	&lt;cfset data = mycfc.getDataBetter()&gt;
&lt;/cftimer&gt;
&lt;p /&gt;
&lt;cftimer label="active=true" type="inline"&gt;
	&lt;cfset data = mycfc.getDataBetter(active=true)&gt;
&lt;/cftimer&gt;
</code>

And the results:

<code>
no arguments: 204ms

active=true: 203ms

no arguments: 0ms

active=true: 0ms 
</code>

There are a lot of problems with this cache though. First off - the number of possible key combinations is huge. Secondly - your typically want to build your API so you can force the method to get new data even if it does exist in the cache. I'd typically have an argument for that, and a completely separate method to re-initialize the cache. 

To handle the size of the cache you can do a few things. You could do a simple structCount and see if the struct is too big. But how do you determine what to remove? You could either pick one by random, or add additional metadata to your cache that includes when the key was created, and how often it was used. 

Anyway - this was just meant to be an example. Once things get complex you would probably want to move away from this solution into something more powerful. Check this blog entry for more suggestions:

<a href="http://ray.camdenfamily.com/index.cfm/2006/7/19/Caching-options-in-ColdFusion">Caching options in ColdFusion</a>
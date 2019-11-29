---
layout: post
title: "Real life Var scope screw up"
date: "2007-07-09T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/09/Real-life-Var-scope-screw-up
guid: 2180
---

I'm a big fan of sharing mistakes as I figure any mistake I make I'm sure others have as well. If you read my blog or have attended any presentation I do on ColdFusion Components, you know I get pretty anal about var scoping. One of the things I mention is how if you <i>don't</i> var scope - some day - some where - a bug is going to bite you in the rear and it may takes days to track it down. Well guess what? It happened to me.
<!--more-->
For about two months now I've gotten daily bug emails from <a href="http://www.riaforge.org">RIAForge</a>. The bug always looked a bit like this: 

<blockquote>
The NAME parameter to the setNAME function is required but was not passed in.
</blockquote>

I was never able to reproduce the bug, and as far as I knew, it wasn't a bug that <i>could</i> exist. Here is the code in question:

<code>
&lt;cfquery name="getit" datasource="#dsn#"&gt;
	select 	stuff,changed,here
	from	users
	where	id = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.id#"&gt;
&lt;/cfquery&gt;
	
&lt;cfif getit.recordCount&gt;
	&lt;cfloop index="col" list="#getit.columnlist#"&gt;
		&lt;cfinvoke component="#bean#" method="set#col#"&gt;
			&lt;cfinvokeargument name="#col#" value="#getit[col][1]#"&gt;
		&lt;/cfinvoke&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

This code is in my DAO CFC in the read method. I use the fact that my database columns has the same names as my bean. This lets me easily set all the values in the bean by just looping over the column list from the query. 

Looking at this code, it seems impossible for me to run setX and not pass X. As you can plainly see, the method name and argument share the exact same value. 

The only thing I figured was that maybe the value in the query was null, and ColdFusion was saying, "Yea, you passed me X, but it was null, so you didn't really pass X."

Turns out - I had forgotten a simple var scope on "col". Under load, it was possible for the col values not to match up and then throw my error. 

So - just consider this a warning!

<b>Edit:</b> I've had a number of people get confused by the code block above. The code block above was merely meant to show the area throwing the bug. The fix (adding a var scope line) was shown because it was just a var scope. But to make it more clear, I've added the entire function below. Again, the <b>only</b> change was to add the var scope line.

p.s. For folks wanting to see the entire RIAForge site, I promise, soon. 

<code>
&lt;cffunction name="read" access="public" returnType="UserBean" output="false"&gt;
	&lt;cfargument name="id" type="numeric" required="true"&gt;
	&lt;cfset var bean = createObject("component","UserBean")&gt;
	&lt;cfset var getit = ""&gt;
	&lt;cfset var col = ""&gt;
		
	&lt;cfquery name="getit" datasource="#dsn#"&gt;
		select 	cols,changed,for,security,reasons
		from	users
		where	id = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.id#"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfif getit.recordCount&gt;
		&lt;cfloop index="col" list="#getit.columnlist#"&gt;
			&lt;cfinvoke component="#bean#" method="set#col#"&gt;
				&lt;cfinvokeargument name="#col#" value="#getit[col][1]#"&gt;
			&lt;/cfinvoke&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
	
	&lt;cfreturn bean&gt;
&lt;/cffunction&gt;
</code>
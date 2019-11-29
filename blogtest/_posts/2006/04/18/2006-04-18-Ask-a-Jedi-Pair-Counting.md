---
layout: post
title: "Ask a Jedi: Pair Counting"
date: "2006-04-18T15:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/04/18/Ask-a-Jedi-Pair-Counting
guid: 1219
---

Steve asks:

<blockquote>
I hate to bug you with a question, but I am at a loss.  I have a 
database with 200K records and one of the columns contains a string 
of 0-30 characters that represent 0-15 pairs.  I need to find a way 
to separate these into some form of list and then count the number 
of instances of a given pair.  I am "sure" there is a way to dump 
this into an Array or Struct, but I still don't have a grasp of how 
to use these.

Can you think of an "easy" way to do this with CF?	
</blockquote>

Hey, everything is easy in ColdFusion! (Ok, so maybe I'm a little bit biased.) This almost seems like a perfect Friday Puzzler, but I already have one in mind, so let's look at a simple solution for this. 

His database contains a column that looks like this:

01333910394828013392948281

Each two characters represents one pair. What he wanted then was a structure containing each pair along with the number of times it shows up in the string. Here is a simple UDF, and test code, to demonstrate this:

<code>
&lt;cfset str = "01333910394828013392948281"&gt;

&lt;cffunction name="getPairStats" returnType="struct" output="true"&gt;
	&lt;cfargument name="pairStr" type="string" required="true"&gt;
	&lt;cfset var result = structNew()&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var pair = ""&gt;
	
	&lt;!--- must be pairs ---&gt;
	&lt;cfif len(arguments.pairStr) mod 2 is not 0&gt;
		&lt;cfthrow message="Avast ye matey! This string is not an even set of pairs!"&gt;
	&lt;/cfif&gt;
	
	&lt;cfloop index="x" from="1" to="#len(arguments.pairStr)#" step="2"&gt;
		&lt;cfset pair = mid(arguments.pairStr, x, 2)&gt;
		&lt;cfif not structKeyExists(result, pair)&gt;
			&lt;cfset result[pair] = 0&gt;
		&lt;/cfif&gt;
		&lt;cfset result[pair] = result[pair] + 1&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;

&lt;cfdump var="#getPairStats(str)#"&gt;
</code>

The UDF, getPairStats, accepts a string and returns a struct. It first does a sanity check to ensure that there is an even number of characters. If not, it throws an error using my special "Pirate-Mode(tm)" brand error handling. (Coming soon to BlogCFC5.) After that it is nothing more than a simple loop using step="2" to tell ColdFusion to skip over every other letter. I use Mid() to grab the pairs and then simply update a structure.
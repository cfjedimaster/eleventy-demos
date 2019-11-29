---
layout: post
title: "Ask a Jedi: Functions and dynamic arguments"
date: "2008-09-22T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/22/Ask-a-Jedi-Functions-and-dynamic-arguments
guid: 3026
---

Shakti Lightfinger asks:

<blockquote>
<p>
I'm trying to pass a few queries into a cfc and the function then takes the data from the queries and returns it in an xml
format which i can use for various purposes, for charting for instance), at least its supposed to do that anyways. What I can't get my head round is how do I tell the function the number of queries being passed into them and their names so that the function can expect them as arguments. The number of queries and their names will be different each time depending on the programmer and the data being queried. Is it even possible to have a dynamic list of arguments for a function and pass them in accordingly??
</p>
</blockquote>

This is a good set of questions Shakti. Let me try to address them one by one. I'll start with your last question - specifically - is it possible to have a dynamic list of arguments. The short answer is absolutely. Consider the following UDF:

<code>
&lt;cffunction name="testarg"&gt;
	&lt;cfargument name="first" required="true"&gt;
	&lt;cfargument name="second" required="true"&gt;
	&lt;cfargument name="third" required="false"&gt;
		
	&lt;cfreturn "I was sent these arguments: #structKeyList(arguments)#"&gt;
&lt;/cffunction&gt;
</code>

This function has three defined arguments. Inside a UDF, you have access to all the arguments passed in via the Arguments struct. Because it is a struct, I can do normal struct functions on them, including structKeyList. So when I run this:

<code>
#testArg(1,2,3)#
</code>

I get

<b>I was sent these arguments: FIRST,SECOND,THIRD</b>

ColdFusion makes no rules about how many arguments you send to a UDF, except in regards to required arguments. Since I said first and second were required, I always have to send them. But there is nothing wrong with me doing this:

<code>
#testarg(1,2,3,4,5,6)#	
</code>

This will return:

<b>I was sent these arguments: FIRST,4,SECOND,THIRD,5,6</b>

Notice what happened here. I sent 3 additional arguments to my UDF. Since I didn't define them in the cffunction tag, they had no name, and were simply named by their <i>position</i> in the call. That's where the 4, 5, and 6 come from. If I were to modify my UDF to add a new argument tag, let's say named fourth, then I'd end up with:

<code>
I was sent these arguments: FIRST,FOURTH,SECOND,THIRD,5,6
</code>

(By the way, if you are wondering why the list of arguments is not in the same order as the UDF, do not forget that struct keys have no inherit order to them.) So on the calling side, you can send any number of additional arguments as you want. Technically you could build your UDF to check for extra arguments and throw an error. That's what CF does with built-in functions. That <i>could</i> be a helpful modification to the UDF to help warn folks that maybe they are using the UDF in a way that wasn't intended, but frankly I've never seen anyone do that and it's probably more trouble then it's worth.

So as you can see, I can pass any number of arguments to a UDF, and by treating the arguments as a structure, I can dynamically handle any number of arguments. Let's try a real world example that is a bit closer to your question. I'm going to write a UDF that will take any number of queries and return the total record count. Ok, it is a bit silly, but it should be a slimmer example than generating XML.

<code>
&lt;cffunction name="countrows" returnType="numeric" output="false"&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var total = 0&gt;
		
	&lt;cfif structIsEmpty(arguments)&gt;
		&lt;cfthrow message="You must pass me at least one query."&gt;
	&lt;/cfif&gt;
	
	&lt;cfloop index="x" from="1" to="#structCount(arguments)#"&gt;
		&lt;cfif not isQuery(arguments[x])&gt;
			&lt;cfthrow message="The #x# argument was not a query."&gt;
		&lt;/cfif&gt;
		&lt;cfset total += arguments[x].recordCount&gt;
	&lt;/cfloop&gt;

	&lt;cfreturn total&gt;
&lt;/cffunction&gt;
</code>

Because this UDF can take any number of arguments, I didn't define any cfargument tags at all. I begin though by checking to see if the argument structure is empty. If it is, I throw an error. I then simply loop over all the arguments. For each one I check to see if it is a query, and if not, I throw an error. Otherwise I simply add to a running total. I tested the UDF like so:

<code>
&lt;cfquery name="a" datasource="blogdev"&gt;
select  *
from	tblblogentries
limit	1,4
&lt;/cfquery&gt;
&lt;cfquery name="b" datasource="blogdev"&gt;
select  *
from	tblblogentries
limit	5,8
&lt;/cfquery&gt;
&lt;cfquery name="c" datasource="blogdev"&gt;
select  *
from	tblblogentries
limit	8,12
&lt;/cfquery&gt;
	
&lt;cfoutput&gt;#countrows(a,b,c)#&lt;/cfoutput&gt;
</code>

Obviously these queries won't run for you, but it gives you some idea. I could change my last line to countrows(a,b) or even countrows(a) and it works just fine. Heck I could even do countrows(a,a,a,a,a,a) and that works as well.

I'll leave you with 3 quick notes/tips.

<ol>
<li>You mentioned that you need to pass a dynamic amount of queries to a UDF and generate XML from them. I will remind you that queries, when passed to a UDF, are passed by reference. What that means if that if you modify the query in the UDF, you are modifying the original query. You are just generating output from the queries, not changing them, but it is something you want to remember. You can change this by using duplicate() when you call the UDF.
<li>Need XML from a query? Consider my <a href="http://www.raymondcamden.com/projects/toxml/">toXML</a> component. It can be yours for only $999.99!
<li>If you need to dynamically pass arguments to a UDF, don't forget that you can use cfinvoke and cfinvokeargument for UDFs as well as CFC methods. It sounded like Shakti was more concerned with the UDF side of processing and didn't need help on this side, but I can show an example of that too if he needs it.
</ol>
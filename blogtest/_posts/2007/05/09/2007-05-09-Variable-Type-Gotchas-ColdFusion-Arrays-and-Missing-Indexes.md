---
layout: post
title: "Variable Type Gotchas - ColdFusion Arrays and Missing Indexes"
date: "2007-05-09T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/09/Variable-Type-Gotchas-ColdFusion-Arrays-and-Missing-Indexes
guid: 2020
---

Following up on my series of blog entries from last week, here is another gotcha you want to look out for when using ColdFusion arrays. When defining an array in ColdFusion, you typically set them starting with 1 and ending with some number:

<code>
&lt;cfset arr = arrayNew(1)&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
  &lt;cfset arr[x] = randRange(1,100)&gt;
&lt;/cfloop&gt;
</code>

This creates an array with items in indexes 1 to 100. But - consider this example:

<code>
&lt;cfset arr = arrayNew(1)&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
  &lt;cfset arr[randRange(1,100)] = x&gt;
&lt;/cfloop&gt;
</code>

Now this is a bit convoluted, but this code example assigns values based on a random index. It will create 10 array values in indexes from 1 to 100 (and it may even do the same index twice). 

What happens if you try to loop over this array? The normal way to loop over an array is to use arrayLen:

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(arr)#"&gt;
</code>

If you run this code on the array we just created, you will get an error because the indexes aren't all defined. What about isDefined()? It won't work on arrays. So what do you do?

One solution is to try/catch:

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(data)#"&gt;
	&lt;cftry&gt;
		&lt;cfoutput&gt;Item #x# is #data[x]#&lt;br /&gt;&lt;/cfoutput&gt;
		&lt;cfcatch&gt;&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;/cfloop&gt;
</code>

Another option is to use a UDF that wraps up the same logic. You can find <a href="http://www.cflib.org/udf.cfm/arraydefinedat">arrayDefinedAt()</a> at CFLib. Here is an example of code that uses it:

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(data)#"&gt;
	&lt;cfif arrayDefinedAt(data,x)&gt;
		&lt;cfoutput&gt;Item #x# is #data[x]#&lt;br /&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

Lastly, you can just wait for Scorpio! One of the announced features is an arrayiIsDefined function. Ok, most likely you can't wait for Scorpio, but it's nice to know Adobe took care of this problem.
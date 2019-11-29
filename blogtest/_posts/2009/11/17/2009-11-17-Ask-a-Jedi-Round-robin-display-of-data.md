---
layout: post
title: "Ask a Jedi: Round robin display of data"
date: "2009-11-17T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/17/Ask-a-Jedi-Round-robin-display-of-data
guid: 3609
---

This came in via my <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=1EA81628-D633-6389-8B472523F011A2DD&page=1">forums</a> today and I thought it was too interesting to not blog about. If you read his post, you can see he needs to support rotating data such that A B C changes to B A C. However, he also has groupings within his data. So imagine now you have ABC in the first group and DE in the second. Your rotation now needs to be "in" group, so on your first iteration you have: A B C D E. On your second you rotate each group to end with: B C A E D. I whipped up the following solution and I'd love to see alternatives.
<!--more-->
I began by creating a data structure. SuperAlly mentioned a query but for now I assume the query data is converted into a 2D array.

<code>
&lt;cfset data = [ 
	["a", "b", "c"],
	["d", "e"]
	]&gt;
</code>

Next I whipped up a quick UDF that would display this data. It assumes you pass in a 2D array and simply loops through each element:

<code>
&lt;cfscript&gt;
function render(arr) {
	for(var i=1; i&lt;=arrayLen(arr); i++) {
		for(var x=1; x&lt;=arrayLen(arr[i]); x++) {
			writeOutput(arr[i][x] & " ");
		}
	}
}
&lt;/cfscript&gt;
</code>

I displayed this to ensure everything was kosher:

<code>
&lt;cfoutput&gt;
#render(data)#
&lt;p/&gt;
&lt;/cfoutput&gt;
</code>

This returned "a b c d e" as I expected. Ok, now for the fun part. In theory, all I have to do is remove the item from the beginning of each array and drop it on top.

<code>
&lt;cfloop index="i" from="1" to="#arrayLen(data)#"&gt;
	&lt;cfset movingItem = data[i][1]&gt;
	&lt;cfset arrayDeleteAt(data[i],1)&gt;
	&lt;cfset arrayAppend(data[i], movingItem)&gt;
&lt;/cfloop&gt;
</code>

As you can see, I loop over data, which is the core data holder. Each element of data is an array itself. I grab the first item, delete it, and then simply add it to the end of the array. Here is a complete script with a few sample runs:

<code>
&lt;cfset data = [ 
	["a", "b", "c"],
	["d", "e"]
	]&gt;
	

&lt;cfscript&gt;
function render(arr) {
	for(var i=1; i&lt;=arrayLen(arr); i++) {
		for(var x=1; x&lt;=arrayLen(arr[i]); x++) {
			writeOutput(arr[i][x] & " ");
		}
	}
}
&lt;/cfscript&gt;

&lt;cfoutput&gt;
#render(data)#
&lt;p/&gt;
&lt;/cfoutput&gt;

&lt;cfloop index="i" from="1" to="#arrayLen(data)#"&gt;
	&lt;cfset movingItem = data[i][1]&gt;
	&lt;cfset arrayDeleteAt(data[i],1)&gt;
	&lt;cfset arrayAppend(data[i], movingItem)&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
#render(data)#
&lt;p/&gt;
&lt;/cfoutput&gt;

&lt;cfloop index="i" from="1" to="#arrayLen(data)#"&gt;
	&lt;cfset movingItem = data[i][1]&gt;
	&lt;cfset arrayDeleteAt(data[i],1)&gt;
	&lt;cfset arrayAppend(data[i], movingItem)&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
#render(data)#
&lt;p/&gt;
&lt;/cfoutput&gt;
</code>

And the output:

a b c d e

b c a e d

c a b d e 

Notice how the second group, D E, correctly works even though it is smaller than the first group, A B C.
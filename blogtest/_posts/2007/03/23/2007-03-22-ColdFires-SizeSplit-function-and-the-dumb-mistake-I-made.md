---
layout: post
title: "ColdFire's SizeSplit function (and the dumb mistake I made)"
date: "2007-03-23T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/23/ColdFires-SizeSplit-function-and-the-dumb-mistake-I-made
guid: 1919
---

When working on <a href="http://coldfire.riaforge.org">ColdFire 0.0.3</a>, I added a new UDF that would take a string and split it into an array. This was used to split the header strings up into more manageable size items. The UDF worked fine (as far as I knew), but then Adam reported he had issues using the values on his side. Check out the UDF and see if you can spot the problem. (No fair looking at the code in the released version.)
<!--more-->
<code>
&lt;cffunction name="sizeSplit" output="false" returnType="array" hint="Splits a string into an array of N chars"&gt;
	&lt;cfargument name="string" type="string" required="true"&gt;
	&lt;cfargument name="size" type="numeric" required="true"&gt;
	&lt;cfset var result = arrayNew(1)&gt;
	
	&lt;cfif len(arguments.string) lt arguments.size&gt;
		&lt;cfset result[1] = arguments.string&gt;
		&lt;cfreturn result&gt;
	&lt;/cfif&gt;

	&lt;cfloop condition="len(arguments.string) gt arguments.size"&gt;
		&lt;cfset arrayAppend(result, left(arguments.string, arguments.size))&gt;
		&lt;cfset arguments.string = right(arguments.string, len(arguments.string)-arguments.size)&gt;
	&lt;/cfloop&gt;

	&lt;cfreturn result&gt;	
&lt;/cffunction&gt;
</code>

The code is rather simple. You pass a string and a size for the sections. The code is smart enough to detect a small string and not bother looping. If it does have to loop, it adds the portion to the array and then cuts down the original string.

Ok, see it yet? 

Well what happens if the size of my string isn't evenly divisible by the size I want? That's right - I have left overs. Adam was having issues because I was returning incomplete arrays back to him. Luckily it was easy enough to solve: 

<code>
&lt;cffunction name="sizeSplit" output="false" returnType="array" hint="Splits a string into an array of N chars"&gt;
	&lt;cfargument name="string" type="string" required="true"&gt;
	&lt;cfargument name="size" type="numeric" required="true"&gt;
	&lt;cfset var result = arrayNew(1)&gt;
	
	&lt;cfif len(arguments.string) lt arguments.size&gt;
		&lt;cfset result[1] = arguments.string&gt;
		&lt;cfreturn result&gt;
	&lt;/cfif&gt;

	&lt;cfloop condition="len(arguments.string) gt arguments.size"&gt;
		&lt;cfset arrayAppend(result, left(arguments.string, arguments.size))&gt;
		&lt;cfset arguments.string = right(arguments.string, len(arguments.string)-arguments.size)&gt;
	&lt;/cfloop&gt;
	&lt;cfif len(arguments.string)&gt;
		&lt;cfset arrayAppend(result,arguments.string)&gt;
	&lt;/cfif&gt;

	&lt;cfreturn result&gt;	
&lt;/cffunction&gt;
</code>

Notice now I check and see if I have anything left over. If so - I simply add it to the end of the array.
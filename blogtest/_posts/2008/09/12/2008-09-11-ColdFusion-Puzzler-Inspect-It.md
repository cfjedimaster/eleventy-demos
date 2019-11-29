---
layout: post
title: "ColdFusion Puzzler - Inspect It!"
date: "2008-09-12T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/12/ColdFusion-Puzzler-Inspect-It
guid: 3011
---

Today's ColdFusion Puzzler is based on a cool Groovy feature. I was surprised to discover that Groovy supports a Dump function. While I don't find it as pretty as ColdFusion's version, it's nice to have when debugging. But Groovy takes it a bit further and adds something similar called the inspect() function. The inspect function will take any arbitrary object and return a string that could be used to create it. Here is an example:

<code>
def s = [
         name:"Raymond",
         age:35,
         rank:"Jedi"
         ]

def a = [0,2,3]
def b = new Date()

s.a = a
s.bornondate = b

println s.inspect()
</code>

This returns:

<blockquote>
<p>
["name":"Raymond", "age":35, "rank":"Jedi", "a":[0, 2, 3], "bornondate":Fri Sep 12 08:48:16 CDT 2008]
</p>
</blockquote>

As you can see, it isn't the code I used but code that would generate the same data. 

Your challege, should you choose to accept it, is to write a similar function for ColdFusion. Your output need not look the exact same of course. I've provided a simple example that only works with arrays to get your started.

<code>

&lt;cfscript&gt;
function inspect(arr) {
	var r = "";
	var i = "";

	r = "[";

	for(i=1; i &lt;= arrayLen(arr); i++) {
		r &= arr[i];
		if(i &lt; arrayLen(arr) ) r&=",";
	}
	
	r &= "]";
	return r;
}
&lt;/cfscript&gt;

&lt;cfset a = [1,2,9,20]&gt;
&lt;cfoutput&gt;#inspect(a)#&lt;/cfoutput&gt;
</code>

Your code should handle arrays, structs, and simple values. For extra credit you can handle queries to by using a bunch of query set sells.

Also note that my test UDF returns a literal value like Groovy. You can also return a series of statements instead:

<blockquote>
<p>
ob = arrayNew(1);
ob[1] = 1;
ob[2] = 2;
etc
</p>
</blockquote>

Note that I used "ob" to represent the top level data. Since I pass the variable, and not the variable name, I chose an arbitrary variable name to store the data.

Enjoy!
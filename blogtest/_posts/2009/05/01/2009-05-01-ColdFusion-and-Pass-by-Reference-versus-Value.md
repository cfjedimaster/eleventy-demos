---
layout: post
title: "ColdFusion and Pass by Reference versus Value"
date: "2009-05-01T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/01/ColdFusion-and-Pass-by-Reference-versus-Value
guid: 3337
---

So this is something I've blogged about before, but as it recently burned a friend of mine, and got some pushback from folks on Twitter, I thought I'd raise the issue again.

When working with ColdFusion, any complex data type (structs, CFCs, queries, COM/JavaObjects, did I miss one?) will be passed by reference, not by value.

For those of you who took English Lit 1 instead of Comp Sci 101, all this means is that these variables are not copied when sent to a function. In other words, when I do:

<code>
&lt;cfset newThing = changeIt(oldThing)&gt;
</code>

Under normal circumstances, if changeIt manipulates values in oldThing and does a return on it, my newThing will have the manipulated values and oldThing will be just fine.

But with complex data, like structures, you are actually passing the exact same object (a reference). That means any changes inside the UDF will be reflected on the original object.

As an example:

<code>
&lt;cfscript&gt;
function fubar(data) {
	arguments.data.name = "Britney";
	return arguments.data;
}
&lt;/cfscript&gt;

&lt;cfset s = {}&gt;
&lt;cfset s.name = "Paris"&gt;
&lt;cfset s2 = fubar(s)&gt;
&lt;cfdump var="#s#" label="S"&gt;
&lt;cfdump var="#s2#" label="S2"&gt;
</code>

I've created a simple structure with one key. I've created a UDF that changes the value and returns a 'new' struct (right?). But look at what the dumps show:

<img src="https://static.raymondcamden.com/images//Picture 410.png">

Fail! Luckily enough it is easy to fix: 

<code>
&lt;cfset s2 = fubar(duplicate(s))&gt;
</code>

The duplicate function will create a deep copy of the structure before sending it to the UDF. 

Now, here is where things get interesting. Did you notice I didn't mention arrays in my list of complex objects? Well, they are indeed copied by value, not by reference, but, if you include a structure as part of the array, the structure portion will be copied by reference. Check this out:

<code>
&lt;cfscript&gt;
function fubar2(data) {
	arguments.data[1] = 9;
	arguments.data[2].gender = "female";
	arguments.data[3] = "Not so goofy";
	return arguments.data;
}
&lt;/cfscript&gt;

&lt;cfset a = []&gt;
&lt;cfset a[1] = "42"&gt;
&lt;cfset a[2] = {}&gt;
&lt;cfset a[2].gender = "male"&gt;
&lt;cfset a[3] = "Goofy"&gt;
&lt;cfset b = fubar2(a)&gt;
&lt;cfdump var="#a#" label="A"&gt;
&lt;cfdump var="#b#" label="B"&gt;
</code>

I've got an array with 3 values. Values 1 and 3 are strings, value 2 is a structure. My new UDF, fubar2, changes all 3 values. And the result?

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 53.png">

As you can see, the simple values weren't changed in the original, but the embedded structure was. As before, using a duplicate around 'a' would solve the problem.

But is it a problem? Well certainly if you aren't expecting it, but the fact that structs and other complex objects pass by reference isn't "wrong" per se, and it can be useful as well. Just don't forget it.
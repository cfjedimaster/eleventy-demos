---
layout: post
title: "Shortening a string by removing text in the middle"
date: "2012-02-11T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/11/Shortening-a-string-by-removing-text-in-the-middle
guid: 4522
---

That as to be most exciting blog title ever. If you are still reading this, I congratulate you. While checking my email on my phone yesterday, I took note of how GMail will shorted labels in the top level display. Instead of using the full label, which wouldn't fit, they include part of the left side of the string and part of the right side of the string. So for example, a label, "Important Stuff / From People Who Think They Are Important" would be shorted to something like, "Important Stuff...They Are Important." Most of the time the shortening is very understandable.
<!--more-->
<p>

Being bored, I thought I'd write up a quick ColdFusion version of this logic. Here's the UDF I came up with:

<p>

<code>
function shrink(str) {
	var maxstr = 25;
	if(arrayLen(arguments) &gt;= 2) maxstr = arguments[2];
	str = trim(str);

	if(len(str) &lt;= maxstr) return str;

	var side = int((maxstr-3)/2);

	return trim(left(str, side)) & "..." & trim(right(str, side));
}
</code>

<p>

The logic is simple. The UDF assumes a max size of 25 for the output, but you can override that by passing in a second argument. The input is trimmed for any extraneous white space and if it is smaller than our max size, we return it as is.

<p>

My result string should be a slice from the left and right side of the strings with ... in the middle. So I simply did a bit of math. I take my max size, minus 3, and divide by 2. The int function simply rounds down the values.

<p>

The final part then is to simply use left, right, and strict concatenation. Here's my test template:

<p>

<code>
&lt;cfscript&gt;
function shrink(str) {
	var maxstr = 25;
	if(arrayLen(arguments) &gt;= 2) maxstr = arguments[2];
	str = trim(str);

	if(len(str) &lt;= maxstr) return str;

	var side = int((maxstr-3)/2);

	return trim(left(str, side)) & "..." & trim(right(str, side));
}
&lt;/cfscript&gt;

&lt;cfset tests = [
"This is my first input string and it has some words.",
"This is a short string.",
"This one has some more words in it."
]&gt;

&lt;cfloop index="s" array="#tests#"&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	input=#s#&lt;br/&gt;
	output=#shrink(s)#&lt;br/&gt;
	output(20)=#shrink(s,20)#&lt;br/&gt;
	output(40)=#shrink(s,40)#&lt;br/&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

And the results...

<p>

<code>
input=This is my first input string and it has some words.
output=This is my...some words.
output(20)=This is...e words.
output(40)=This is my first i...it has some words.

input=This is a short string.
output=This is a short string.
output(20)=This is...string.
output(40)=This is a short string.

input=This one has some more words in it.
output=This one ha...ords in it.
output(20)=This one...s in it.
output(40)=This one has some more words in it. 
</code>
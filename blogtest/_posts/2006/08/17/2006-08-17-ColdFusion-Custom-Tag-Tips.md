---
layout: post
title: "ColdFusion Custom Tag Tips"
date: "2006-08-17T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/17/ColdFusion-Custom-Tag-Tips
guid: 1479
---

Now a days it seems like every one talks about CFCs, or UDFs, and almost no one talks about custom tags. While they are a bit slower than CFCs or UDFs, custom tags are still pretty darn handy. Here are a few tips for people writing custom tags. 

1) Watch your whitespace. 

This is more a general ColdFusion tip, but since custom tags tend to be used inside other documents (otherwise they wouldn't be custom tags), you tend to notice their white space even more, especially if the tag is used inside a loop. I recommend just using cfsetting on top and at the bottom of your file, although be sure to also use cfsetting if you leave your custom tag early.

2) If your custom tag is not meant to be used in "wrapped" mode, then always include this line as your last line of code:

<code>
&lt;cfexit method="exitTag"&gt;
</code>

If you don't, and someone calls your tag like so, &lt;cf_foo/&gt;, then your tag will execute twice.

3) While I may use "cf_" format in my examples, I almost never use cf_ when invoking a custom tag. I use cfmodule. This tends to be a bit more wordy, but it means i don't have to worry about "name" confusion. This is where ColdFusion has to look for your custom tag, and could potentially find the wrong one. Not only that, ColdFusion caches the location of the tag, so if you move it, you need to restart ColdFusion. All of this goes away if you use cfmodule. 

4) If you return a value, do not hard code it like so:

<code>
&lt;cfset caller.foo = 1&gt;
</code>

Rather, make it an attribute so the caller can specify what result to return. For example:

<code>
&lt;cfparam name="attributes.result" default="result" type="variableName"&gt;

&lt;cfset caller[attributes.result] = now()&gt;
</code>

This lets me call the tag like so:

<code>
&lt;cf_foo&gt;
&lt;cf_foo result="result2"&gt;
&lt;cf_foo result="result3"&gt;
</code>

At the end of those lines, I'd have 3 variables created: result, result2, and result3.
---
layout: post
title: "Finding dates in a string using ColdFusion"
date: "2011-08-20T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/20/Finding-dates-in-a-string-using-ColdFusion
guid: 4333
---

A reader of mine had an interesting question. Is it possible to find all the dates in a string? In theory you could parse all the words and attempt to turn each into a date. You would need to check each word and a "reasonable" amount of words after it. Perhaps up to 4. I decided to take an initial stab at a simpler solution - looking just for dates in the form of mm/dd/yyyy. (Note to all of my readers outside of America. The code I'm showing here would actually work fine in your locales as well.)
<!--more-->
<p>

First - let's create a simple string.

<p>

<code>
&lt;cfsavecontent variable="str"&gt;
This is some text. I plan on taking over the world on 12/1/2011. After I 
do that, I plan on establishing the Beer Empire on 1/2/2012. But on 3/3/2013
I'll take a break. But this 13/91/20 is not a valid date.
&lt;/cfsavecontent&gt;
</code>

<p>

Now let's do a regex based on Number/Number/Number.

<p>

<code>
&lt;cfset possibilities = reMatch("\d+/\d+/\d+", str)&gt;
</code>

<p>

This gives us an array of possible matches that we can loop over:

<p>

<code>
&lt;cfloop index="w" array="#possibilities#"&gt;
	&lt;cfif isDate(w)&gt;
		&lt;cfoutput&gt;#w# is a date.&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

Which gives us...

<p>

12/1/2011 is a date.<br/>
1/2/2012 is a date.<br/>
3/3/2013 is a date.<br/>

<p>

Any thoughts on this technique? The entire template is below.

<p>

<code>
&lt;cfsavecontent variable="str"&gt;
This is some text. I plan on taking over the world on 12/1/2011. After I 
do that, I plan on establishing the Beer Empire on 1/2/2012. But on 3/3/2013
I'll take a break. But this 13/91/20 is not a valid date.
&lt;/cfsavecontent&gt;

&lt;cfset possibilities = reMatch("\d+/\d+/\d+", str)&gt;
&lt;cfloop index="w" array="#possibilities#"&gt;
	&lt;cfif isDate(w)&gt;
		&lt;cfoutput&gt;#w# is a date.&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>
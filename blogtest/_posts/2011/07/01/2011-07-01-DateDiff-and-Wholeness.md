---
layout: post
title: "DateDiff and Wholeness"
date: "2011-07-01T13:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/01/DateDiff-and-Wholeness
guid: 4292
---

This surprised a reader of mine recently and while it falls into the "Obvious" category, I bet it's something folks forget - or may not remember when debugging a problem with their application. Without running the code below, can you tell me what the result is?
<!--more-->
<p/>

<code>
&lt;cfset today2 = "2011-06-21 16:09:06"&gt;
&lt;cfset testdiff = datediff("d", today2, "06/22/2011") &gt;

&lt;cfoutput&gt;
The result of the diff is : #testdiff#
&lt;/cfoutput&gt;
</code>

<p/>

If you answered 1, congratulations, you're wrong. Your answer makes sense. The first date is July 21st and the second date is July 22nd. But notice the <i>time</i> value in the first block. That's 4:09 PM. The second date doesn't have a time so it defaults to midnight (or one ms after midnight - I always get confused by that - is midnight the end of the previous day or the start of the new one?)

<p/>

The right answer is 0 and the reason why is made clear from the docs (emphasis mine):

<p/>

<blockquote>
The DateDiff function determines the number of <strong>complete</strong> datepart units between the two dates;
</blockquote>

<p/>

In the example above, a <b>complete</b> day had not passed between the two values, therefore 0 was returned. So what do you do if you want a "practical" or "What humans expect" answer? Drop the times. Here's one way - and there are probably about 10 other ways as well:

<p/>

<code>
&lt;cfset d1 = "2011-06-21 18:09:06"&gt;
&lt;cfset d2 = "2011-06-22 16:20:00"&gt;

&lt;cfset d1 = createDate(year(d1), month(d1), day(d1))&gt;
&lt;cfset d2 = createDate(year(d2), month(d2), day(d2))&gt;
&lt;cfset testdiff = datediff("d", d1, d2) &gt;

&lt;cfoutput&gt;
The result of the diff is : #testdiff#
&lt;/cfoutput&gt;
</code>
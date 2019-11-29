---
layout: post
title: "Incrementing with ++"
date: "2009-06-12T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/12/IncrementingDecrementing-with-
guid: 3393
---

One of the handier recent additions to ColdFusion was the ability to use ++ and -- operators. For example, to add one to x you can either do: x=x+1. Or the quicker: x++. However, don't forget that you can also do ++x. What's the difference? Well it's pretty important. 

When we say x++, the result of that expression would be the original value of x, before 1 is added to it. Consider:

<code>
&lt;cfset x = 1&gt;
&lt;cfoutput&gt;#x++#&lt;/cfoutput&gt;
</code>

This will print out 1 to the screen, but if you follow it up with:

<code>
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

you will see 2. In other words, the expression as a whole "worked" in that it added one to the value, but the returned value was the original value. 

If you want to both add one to a value, and return the result after the addition, you would use the reverse form.

<code>
&lt;cfset x = 1&gt;
&lt;cfoutput&gt;#++x#&lt;/cfoutput&gt;
&lt;br&gt;
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

Why bring this up? I was working with the <a href="http://www.cflib.org/udf/parseExcel">parseExcel</a> function (just released on CFLib) and noticed it returned 2 of my Excel sheets 3 arrays. Why? This one line:

<code>
&lt;cfset loc.numAcross = loc.cols++&gt;
</code>

The fix was to just reverse the plus signs.

<code>
&lt;cfset loc.numAcross = ++loc.cols&gt;
</code>

An easy way to remember this would be to see that the + signs are first, which you can read as "plus first, then return".
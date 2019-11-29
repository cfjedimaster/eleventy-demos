---
layout: post
title: "Interesting change with listToArray from ColdFusion 8 to 9"
date: "2010-06-04T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/04/Interesting-change-with-listToArray-from-ColdFusion-8-to-9
guid: 3838
---

Sorry if I'm late in noticing this - but something odd has happened with listToArray. I was reviewing SVN commits at work today when I noticed a coworker checked in a file where he stated that he had to modify a listToArray call because of "some change" to listToArray in ColdFusion 9. Now - I knew that <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7f0f.html">listToArray</a> changed in CF9. The <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7f0f.html">reference</a> shows that the multiCharacterDelimiter argument was added in CF9. However, in both CF8 and 9, the 3rd argument, includeEmptyFields, defaults to false.

<p>
<!--more-->
So, given the following string:

<p>

<code>
&lt;cfset str = ", A , B , , , 0"&gt;
&lt;cfset arr = listToArray(str)&gt;
&lt;cfdump var="#arr#"&gt;
</code>

<p>

I'd expect an array with 3 items: A, B ,0. However, in ColdFusion 8, the array contains A, B, 2 empty elements, and 0. I then noticed something. The list items weren't empty - they had a space. Technically, that's content. Now practically I can see why it is treated as empty content, but this was a surprising change since - for the most part - Adobe treats backwards compatability as something close to the Prime Directive. Personally I think CF8 is doing the right thing. 

<p>

I can say that when ignoreEmptyFields is set to true, both CF8 and 9 return the exact same array.
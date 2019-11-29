---
layout: post
title: "ColdFusion 101: Dates can be just numbers"
date: "2005-11-03T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/03/ColdFusion-101-Dates-can-be-just-numbers
guid: 896
---

I got an interesting email a little while ago. Here was the problem the reader was having:

<blockquote>
I need create a list of years ie 1999-2005 so that I can use them in a loop list, any ideas on how i can achieve this?  I have tried using dateformat and subtracting 6, 5 4, 3, 2 and 1 from this year but this just looks ridiculous!
</blockquote>

Turns out he had forgotten a simple fact - years are just numbers. What he wanted to do was create a list of years from six years ago to today. You <i>could</i> do this using dateAdd. However, it may be simpler to just use plain old numbers:

<code>
&lt;cfset thisYear = year(now())&gt;
&lt;cfset sixYearsAgo = thisYear - 6&gt;
</code>

The only time this wouldn't work right is around year 1, but even dateAdd stops working at year 100. 

p.s. I haven't done a CF 101 post in a while, but I thought this was a nice and simple post perfect for it. I also hope it tips off my advanced readers that it is something they can probably skip.
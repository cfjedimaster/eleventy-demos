---
layout: post
title: "Variable Type Gotchas - ColdFusion List Delimeters"
date: "2007-05-02T09:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/02/Variable-Type-Gotchas-ColdFusion-List-Delimeters
guid: 1995
---

During my <a href="http://ray.camdenfamily.com/index.cfm/2007/5/1/CFJUG-Recording-and-Materials">presentation</a> earlier this week, I brought up a few 'Gotchas' that ColdFusion developers may not be aware of. Today I'm going to review some of these for those who couldn't make the presentation.

The first item that came up was during my discussion of ColdFusion lists. The one thing I really see trip people up (and it tripped me up when I was building my first ColdFusion application - back in the dinosaur days) is the fact that list delimiters are only single characters - even if you pass multiple delimiters. So what do I mean? Consider this list:

<code>
&lt;cfset monkeys = "King Kong__+__George, Bush__+__Clinton, Hillary__+__Super_Monkey"&gt;
</code>

Looking at this string you might think you could simply tell ColdFusion to use __+__ as a delimiter. Consider this loop:

<code>
&lt;cfloop index="item" list="#monkeys#" delimiters="__+__"&gt;
</code>

Many developers think that ColdFusion will do this: "Ok, take my string, and consider the literal string __+__ as a delimiter." Instead, ColdFusion does this: "Ok, I'll use _ and + as delimiters."

What this means is that our loop will display:

King Kong<br />
George, Bush<br />
Clinton, Hillary<br />
Super<br />
Monkey<br />

The _ inside of Super_Monkey was considered a delimiter and therefore was split up by ColdFusion. In case you do want to split up a string by a set of characters, consider the <a href="http://www.cflib.org/udf.cfm/split">split()</a> UDF at CFLib.
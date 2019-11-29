---
layout: post
title: "Variable Type Gotchas - ColdFusion Lists and Empty Elements"
date: "2007-05-02T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/02/Variable-Type-Gotchas-ColdFusion-Lists-and-Empty-Elements
guid: 1998
---

As a follow up to my <a href="http://ray.camdenfamily.com/index.cfm/2007/5/2/Variable-Type-Gotchas--ColdFusion-List-Delimeters">earlier post</a>, another common 'gotcha' with ColdFusion Lists are empty list items. What's an empty list item? Consider this simple list of names:

<code>
&lt;cfset names="Baltar,Apollo,Starbuck,,Bozo"&gt;
</code>

I think most people, including myself, would look at that and say that the list had 5 items, with the 4th item being a simple empty string. But ColdFusion simply ignores empty list items. If you perform a listLen() on that string, you get 4. 

Now - we can argue about whether or not that makes sense. I'm not quite sure it does - but that's how ColdFusion handles it.  If you want to handle this differently, you need to write your own code, or perhaps replace the empty items with a string that will represent 'null' for your application. Check out <a href="http://www.cflib.org/udf.cfm/ListFix">ListFix()</a> at CFLib.org for a UDF that does this.

Thanks to <a href="http://www.aacr9.com/">Phillip Senn</a> for reminding me of this - I actually forgot it during my presentation.

More Variable Type Gotchas tomorrow - after I arrive at cf.Objective!
---
layout: post
title: "Watch out for functions that return booleans"
date: "2007-01-04T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/04/Whatch-out-for-functions-that-return-booleans
guid: 1750
---

A user reported an error to me that I've seen a few times recently. His code was doing something like this:

<code>
&lt;cfset fleet = arrayAppend(fleet, "Star Destroyer: Wrath of Elmo")&gt;
</code>

Later on he did...

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(fleet)#"&gt;
</code>

His error said that he was trying to use a boolean as an array. Where did the error come from?
<!--more-->
The arrayAppend function, like a few other ColdFusion functions, return true or false, not the changed data structure. Personally I'm not sure why as I don't know a situation where it would return false.

As another reminder - for functions like these you do not need to actually store the result:

<code>
&lt;cfset result = arrayAppend(heroes, "Forge")&gt;
</code>

But can instead simply use a shorthand statement:

<code>
&lt;cfset arrayAppend(heroes, "Forge")&gt;
</code>
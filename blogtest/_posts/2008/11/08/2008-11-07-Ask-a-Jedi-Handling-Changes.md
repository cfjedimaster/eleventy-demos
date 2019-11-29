---
layout: post
title: "Ask a Jedi: Handling Changes"
date: "2008-11-08T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/08/Ask-a-Jedi-Handling-Changes
guid: 3091
---

Patrick Star asks:

<blockquote>
<p>
Just had a problem I thought I would see your thoughts on it. I have a form with numerous checkboxes on it, some of these are pre-checked based on options in the DB. On my "summary" screen I want to show the user how many of those checkboxes stayed the same (as what is in the DB), how many were removed from being checked and how many additional ones were checked. I was curious if this could be done with a single function or if multiple ones. Basically I need to show the user what changed, was added and was removed from the form after they hit submit.
</p>
</blockquote>
<!--more-->
This question is interesting to me because it seems so simple on one hand, but the code side of it can get very complex. Shoot, just consider how text diffs can be hard to manage. In this case it won't be that hard to code at all, but it could quickly get a lot more complex if the needs change. 

To mimic his setup, I created an original and selected list of values:

<code>
&lt;cfset original = "1,2,4,9"&gt;
&lt;cfset selected = "1,2,5,9,10"&gt;
</code>

He wanted to know what items were added and which were removed. As far as I know you can't do it in one line or one function. You could of course write a UDF to make it simpler. What I did was handle each change individually:

<code>
&lt;cfset added = ""&gt;
&lt;cfloop index="i" list="#selected#"&gt;
	&lt;cfif not listFind(original, i)&gt;
		&lt;cfset added = listAppend(added, i)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfset removed = ""&gt;
&lt;cfloop index="i" list="#original#"&gt;
	&lt;cfif not listFind(selected, i)&gt;
		&lt;cfset removed = listAppend(removed, i)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

I begin by noting what was added. This is as simple as seeing what is in the new list that isn't in the old list. If you reverse this you can figure out what was removed. I then printed out a simple report:

<code>
&lt;cfoutput&gt;
These items were added: #added#&lt;br/&gt;
These items were removed: #removed#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

Pretty simple, but again, I think we just got lucky in this regards. Comparing a list of numbers to another list of numbers didn't require much though.
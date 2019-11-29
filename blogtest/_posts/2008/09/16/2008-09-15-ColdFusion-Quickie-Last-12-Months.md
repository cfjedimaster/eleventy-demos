---
layout: post
title: "ColdFusion Quickie - Last 12 Months"
date: "2008-09-16T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/16/ColdFusion-Quickie-Last-12-Months
guid: 3018
---

A reader asked:

<blockquote>
<p>
I'm really bad with programming so finding it very stressful at work. Could you please help me with something? I need to create a strings of months to do some stats and what I need is the previous 12 months. For example if current month is Sept then I need a loop to get all months from Sept last year to Aug this year. I've been scratching my head but couldnt work out a loop to do this. Please help me with this. I really appreciate your help. Thank you very much.
</p>
</blockquote>

This is really simple (hence the quickie title) once you use ColdFusion's <a href="http://www.cfquickdocs.com/cf8/?getDoc=DateAdd">dateAdd</a> function. As you can probably guess, it lets you take a date and then add an arbitrary amount of time to it. We can use this to add (or in our case, substract) from the current month. Here is a simple example:

<more>

<code>
&lt;cfloop from="12" to="1" index="x" step="-1"&gt;
	&lt;cfset theMonth = dateAdd("m", -1 * x, now())&gt;
	&lt;cfoutput&gt;#dateFormat(theMonth,"mmmm yyyy")#&lt;br&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

I looped from 12 to 1, and for each value, simply "added" it by using the negative value. The dateFormat was completely arbitrary. You can output the value anyway you want. 

And a quick personal note to "a reader" (I didn't put her name in as it was rather unique), I feel your pain. If it makes you feel any better, I'm going through it <a href="http://www.raymondcamden.com/index.cfm/2008/8/16/Pardon-me-while-I-have-a-brain-cramp-or-three">as well</a>, but it does get better with practice!
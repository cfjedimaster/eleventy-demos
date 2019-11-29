---
layout: post
title: "Ask a Jedi: List question"
date: "2008-03-12T15:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/12/Asj-a-Jedi-List-question
guid: 2705
---

Kyle asks:

<blockquote>
<p>
I have a scheduling portion of my site, which allows the user to select a start time and duration (maximum of 2 hours) for a meeting. Here is a sample of the code to determine time slots that are available:

&lt;cfset timeTaken = "8.5,9,9.5,10,12,12.5,15.5"&gt;<br>
&lt;cfset time ="8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16">
&lt;cfset availTime = ""&gt;<br>
&lt;cfset notAvail = ""&gt;<br>

&lt;cfloop list="#time#"
index="t"&gt;<br>
	&lt;cfif not listContains(timeTaken,t)&gt;<br>     
		&lt;cfset availTime =
listAppend(availTime,t)&gt;<br>   
	&lt;cfelse&gt;<br>
  	&lt;cfset notAvail =
listAppend(notAvail, t)&gt;<br>
	&lt;/cfif&gt;<br>
&lt;/cfloop&gt;<br>


&lt;cfoutput&gt;<br>
  Time: #time#
&lt;p&gt;<br>
  Time Taken: #timeTaken#
  &lt;p&gt;<br>
  Available Time: #availTime#
  &lt;p&gt;<br>
Not Available: #notAvail#<br>
&lt;/cfoutput&gt;<br>

There is a simple example to show you my problem. For some reason, 8 and 15 are not found in the loop so therefore are
classified as not available, even though they are. Should I be using another list function instead of not listContains() ? 
</p>
</blockquote>

You know that saying about gut instincts? You were right. listContains is indeed the issue. ListContains will tell you if any of the list items contains your match, but you want a full match. If you switch to listFind (or listFindNoCase), your problem goes away. Frankly, I have yet to see a good need for listContains, and every code block I've seen using it really wanted listFind instead!
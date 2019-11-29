---
layout: post
title: "ColdFusion 101: Days Till"
date: "2005-11-09T08:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/09/ColdFusion-101-Days-Till
guid: 907
---

Last night one of my clients asked a question that I thought would be great for a CF 101 posting. The question was - if I have an event on a certain date, how do I show the number of days till that event? Luckily ColdFusion makes this rather simple. You can use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000440.htm#1103187">dateDiff()</a> function to return the number of days between today and the date of the event. Let's look at a simple example:

<code>
&lt;cfoutput&gt;
There are #dateDiff("d", now(), createDate(2005, 11, 22))# days till the XBox 360 is released!
&lt;/cfoutput&gt;
</code>

This code sample returns the number of days between today (using the now function) and November 22. Nice and simple, right? There is one small problem, however. On the actual day of November 22nd, this is what the user will see:

<blockquote>
There are 0 days till the XBox 360 is released!
</blockquote>

So - what can you do? Well certainly you can just logon to your web site that morning and change the code, but I know you would much rather be actually playing the XBox 360 than writing code. Luckily we can handle it easily enough with a bit more code:

<code>
&lt;cfset xbox360Date = createDate(2005, 11, 22)&gt;
&lt;cfset today = createDate(year(now()), month(now()), day(now()))&gt;

&lt;cfset daysTill = dateDiff("d", today, xbox360Date)&gt;

&lt;cfif daysTill gte 1&gt;

	&lt;cfif daysTill is 1&gt;
		There is 1 day
	&lt;cfelse&gt;
		&lt;cfoutput&gt;The are #daysTill# days&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	till the XBox 360 is released!

&lt;cfelseif daysTill is 0&gt;

	The XBox 360 was released today! Go buy it!
	
&lt;cfelse&gt;

	The XBox 360 was released already. I hope you got yours!
	
&lt;/cfif&gt;
</code>

So a few things changed here. Let's take it step by step. On the first line, I create a variable to store the event date. On the second line I create a variable for today. Now you may wonder - why did I use createDate  instead of just now()? Now returns the precise time. Let's pretend today is November 21, 12 PM. At that time, the XBox will be released in one day, but to be more precise, it is actually less than a day. If we use dateDiff between now() and the event date, the value will be 0, since there isn't a full day between them. Using createDate as I have done using a time of midnight. Therefore on November 21st, we will properly get a value of 1.

So once I have my daysTill variable, I simply use a cfif block to determine what message to print. Notice in the "1" block, I get a bit more precise with my message ("There is" compared to "There are").
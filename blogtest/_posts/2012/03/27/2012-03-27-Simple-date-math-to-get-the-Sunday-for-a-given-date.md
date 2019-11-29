---
layout: post
title: "Simple date math to get the Sunday for a given date"
date: "2012-03-27T23:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/03/27/Simple-date-math-to-get-the-Sunday-for-a-given-date
guid: 4571
---

This is something that I struggled with that I guarantee could have been done a lot simpler. I can't figure out what the simpler solution is - but I'm convinced it exists. Given an arbitrary date, like March 27, how would you get the Sunday for that week? Why would you even want to do that? You may want to collapse data points for items in the same week to one value specified by that week's Sunday. You could then display it as: Week of March 25.
<!--more-->
<p/>

To do this, I used the following date math:

<p/>

<code>
&lt;cfset theSunday = dateAdd("d", -1 * (dayOfWeek(theDate)-1),theDate)&gt;
</code>

<p/>

I then wrote up a simple test to demonstrate the logic:

<p/>

<code>
&lt;cfset theDate = now()&gt;
&lt;cfloop index="x" from="1" to="50"&gt;
	&lt;cfset theSunday = dateAdd("d", -1 * (dayOfWeek(theDate)-1),theDate)&gt;
	&lt;cfoutput&gt;The Date is #dateFormat(theDate)#, week of #dateFormat(theSunday)#&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;cfset theDate = dateAdd("d", 2, theDate)&gt;
&lt;/cfloop&gt;
</code>

<p>

Here's part of the output:

<p>

<code>
The Date is 27-Mar-12, week of 25-Mar-12
The Date is 29-Mar-12, week of 25-Mar-12
The Date is 31-Mar-12, week of 25-Mar-12
The Date is 02-Apr-12, week of 01-Apr-12
The Date is 04-Apr-12, week of 01-Apr-12
The Date is 06-Apr-12, week of 01-Apr-12
The Date is 08-Apr-12, week of 08-Apr-12
The Date is 10-Apr-12, week of 08-Apr-12
The Date is 12-Apr-12, week of 08-Apr-12
The Date is 14-Apr-12, week of 08-Apr-12
The Date is 16-Apr-12, week of 15-Apr-12
The Date is 18-Apr-12, week of 15-Apr-12
The Date is 20-Apr-12, week of 15-Apr-12
The Date is 22-Apr-12, week of 22-Apr-12
The Date is 24-Apr-12, week of 22-Apr-12
The Date is 26-Apr-12, week of 22-Apr-12
The Date is 28-Apr-12, week of 22-Apr-12
The Date is 30-Apr-12, week of 29-Apr-12
The Date is 02-May-12, week of 29-Apr-12
The Date is 04-May-12, week of 29-Apr-12
</code>
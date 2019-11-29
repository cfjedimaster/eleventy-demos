---
layout: post
title: "ColdFusion 101: Building a Calendar (2)"
date: "2007-01-23T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/23/ColdFusion-101-Building-a-Calendar-2
guid: 1792
---

One of my most popular posts was one I did almost a year and a half ago: <a href="http://ray.camdenfamily.com/index.cfm/2005/8/31/ColdFusion-101-Building-a-Calendar">Buildig a Calendar</a>. It was a simple post describing how to create a calendar in ColdFusion. I've gotten numerous requests to follow up on it. The main request is to show how to include events on the calendar. I've been avoiding showing that as I was worried any example would be too tied to a particular data model. But after a few more requests, I've decided to get over it and just do it.
<!--more-->
First though I'm going to talk about how I converted the code in the <a href="http://ray.camdenfamily.com/index.cfm/2005/8/31/ColdFusion-101-Building-a-Calendar">previous blog entry</a> into a custom tag. Then I'm going to add a new feature. Most calendars will show the days before and after the current month. My code simply filled these days with an empty cell. 

So first let me cover the "custom tag" conversion. Luckily this was nothing more than taking my old code and saving it as a file named calendar.cfm. (Boy do I like it when things are easy.) The next change I made was to make the date an attribute. My previous code worked on the current month. My custom tag allows you to pass in any month. Again this was simple. I added the following to the beginning of my tag:

<code>
&lt;cfparam name="attributes.month" default="#month(now())#"&gt;
&lt;cfparam name="attributes.year" default="#year(now())#"&gt;
&lt;cfparam name="attributes.today" default="#now()#"&gt;
</code>

I then changed any code that was using now() to use the attribute instead. Note that the custom tag will still default to the current month if you don't specify another date. 

Next I needed to change the empty cells in the previous month to show the days of the month. My original code looked like so (pad was the number of days to create empty cells for):

<code>
&lt;cfif pad gt 0&gt;
   &lt;cfoutput&gt;&lt;td colspan="#pad#"&gt;&nbsp;&lt;/td&gt;&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

I changed it to this:

<code>
&lt;cfif pad gt 0&gt;
	&lt;!--- get previous month ---&gt;
	&lt;cfset lastMonth = dateAdd("m", -1, firstOfTheMonth)&gt;
	&lt;cfset daysInLastMonth = daysInMonth(lastMonth)&gt;
	&lt;cfloop index="x" from="#daysInLastMonth-pad+1#" to="#daysInLastMonth#"&gt;
		&lt;cfoutput&gt;&lt;td class="offMonthCell"&gt;#x#&lt;/td&gt;&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

First I created a date object for last month. I already had a date object for the current month so I just used dateAdd. I then figured out the days in that month. Once I had that I could loop from my starting position (days in the month, minus my pad, plus one) to my ending position (total days in the month). Notice I use a "offMonthCell" class. This is will create a grayish background for the cell.

I used similar code for the end of the month:

<code>
&lt;cfif counter is not 8&gt;
	&lt;cfset endPad = 8 - counter&gt;
	&lt;cfloop index="x" from="1" to="#endPad#"&gt;
		&lt;cfoutput&gt;
		&lt;td class="offMonthCell"&gt;#x#&lt;/td&gt;
		&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

As a reminder, counter represents where I ended looping over the days of the week. So this loop will simply "complete" the table. 

I now have a custom tag for my calendar which now includes the days of the previous and next month. My next post enhance the custom tag to make the style sheets more configurable. (Since my design skills suck.) After that I'll discuss how to add events to the calendar. 

I've attached the custom tag to this entry.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcalendar1%{% endraw %}2Ezip'>Download attached file.</a></p>
---
layout: post
title: "Comparing centuries of dates"
date: "2008-05-29T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/29/Comparing-centuries-of-dates
guid: 2846
---

This is a cross post from something I just posted to the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a>, but since that site gets about a 100 hits a month or so, I figured I'd share it here as well. 

Date comparisons are fairly easy in ColdFusion. One common task is to compare a date value to the current date and check if there is a match on the day, week, month, etc. For this entry we will consider comparing a date's century to the current century. This is a bit more complex. While ColdFusion has functions to retrieve parts of a date (seconds, minutes, day, month, etc) it does not have a function to return the century value. You can get this using a bit of math though. 

Consider the following date:

<code>
&lt;cfset d1 = createDate(2009, 1, 1)&gt;
</code>

To get the century, you can first get the year, and then divide the value by 100, using the \ operator to round the result.

<code>
&lt;cfoutput&gt;
#year(d1) \ 100#
&lt;/cfoutput&gt;
</code>

This results in 20 (technically we would call 2009 the 21st century, but we just need a unique value). You could then simply compare this value to the value you get using year(now()) to see if d1 is in the same century.
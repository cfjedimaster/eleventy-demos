---
layout: post
title: "Fascinating issue with createTimeSpan"
date: "2009-06-18T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/18/Fascinating-issue-with-createTimeSpan
guid: 3401
---

A reader sent in an interesting issue. He was using createTimeSpan to list out 5 minute intervals between two hours. Here is what he used:
<!--more-->
<code>
&lt;cfset dtHour = CreateTimeSpan(
 0, &lt;!--- Days. ---&gt;
 0, &lt;!---
Hours. ---&gt;
 5, &lt;!--- Minutes. ---&gt;
 0 &lt;!--- Seconds. ---&gt;
 ) /&gt;

&lt;cfset thecount = 0&gt;
&lt;cfloop from="9:00 AM" to="10:00 AM" step="#dtHour#" index="i"&gt;
&lt;cfset thecount+=1&gt;
   &lt;cfoutput&gt;#timeformat(i,"short")#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
   #thecount#
&lt;/cfoutput&gt;
</code>

In the code above he creates a 5 minute time span and then loops from 9 AM to 10 AM. I <i>rarely</i> use createTimeSpan, and when I have used it, I only used it with query caching. This worked... until he added another loop:

<code>
&lt;cfset thecount2 = 0&gt;
&lt;cfloop from="10:00 AM" to="11:00 AM" step="#dtHour#" index="i"&gt;
       &lt;cfset thecount2+=1&gt;
   &lt;cfoutput&gt;#timeformat(i,"short")# #i#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;cfoutput&gt;
#thecount2#
&lt;/cfoutput&gt;
</code>

This should show the same results, just a different hour, right? Check out the results:

<img src="https://static.raymondcamden.com/images//Picture 330.png">

What the heck? (Actually when I ran this I said something a bit strong.) There are 13 counts in the first loop and 12 in the second. Also note the second stops at 10:55, not 11. 

I was a bit lost at first, but then I remembered something. The interval value is actually a number. On a whim I modified the code to output the interval and the index within the loop:

<code>
&lt;cfset dtHour = CreateTimeSpan(
 0, &lt;!--- Days. ---&gt;
 0, &lt;!---
Hours. ---&gt;
 5, &lt;!--- Minutes. ---&gt;
 0 &lt;!--- Seconds. ---&gt;
 ) /&gt;
&lt;cfoutput&gt;#dtHour#&lt;p&gt;&lt;/cfoutput&gt;
&lt;cfset thecount = 0&gt;
&lt;cfloop from="9:00 AM" to="10:00 AM" step="#dtHour#" index="i"&gt;
&lt;cfset thecount+=1&gt;
   &lt;cfoutput&gt;#timeformat(i,"short")# #i#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
   #thecount#
&lt;/cfoutput&gt;
&lt;br /&gt;&lt;br /&gt;
&lt;cfset thecount2 = 0&gt;
&lt;cfloop from="10:00 AM" to="11:00 AM" step="#dtHour#" index="i"&gt;
       &lt;cfset thecount2+=1&gt;
   &lt;cfoutput&gt;#timeformat(i,"short")# #i#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;cfoutput&gt;
#thecount2#
&lt;/cfoutput&gt;
</code>

Check out the result:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 414.png">

Ah, floating point numbers. I think you can see here where the issue is coming up - rounding errors. Notice how even the values for 10AM (at the end of the first loop and the first entry of the second loop) don't match. 

Nice, so now we know why, how can we rewrite this? Here is a slightly modified version using a conditional loop:

<code>
&lt;!--- number of minutes ---&gt;
&lt;cfset step = 5&gt;

&lt;cfset theTime = "9:00 AM"&gt;
&lt;cfset toTime = "10:00 AM"&gt;

&lt;cfloop condition="dateCompare(theTime,toTime) lt 1"&gt;
	&lt;cfoutput&gt;thetime=#timeFormat(thetime)#&lt;br&gt;&lt;/cfoutput&gt;
	&lt;cfset theTime = dateAdd("n", step, theTime)&gt;
&lt;/cfloop&gt;

&lt;p/&gt;

&lt;cfset theTime = "10:00 AM"&gt;
&lt;cfset toTime = "11:00 AM"&gt;

&lt;cfloop condition="dateCompare(theTime,toTime) lt 1"&gt;
	&lt;cfoutput&gt;thetime=#timeFormat(thetime)#&lt;br&gt;&lt;/cfoutput&gt;
	&lt;cfset theTime = dateAdd("n", step, theTime)&gt;
&lt;/cfloop&gt;
</code>

This uses a simple numeric value for the number and passes it to the dateAdd function. What's kind of cool about this code is that you could also do non-even steps as well. (Sorry, not even as an even/odd, but a step value that won't fit evenly into the interval.)
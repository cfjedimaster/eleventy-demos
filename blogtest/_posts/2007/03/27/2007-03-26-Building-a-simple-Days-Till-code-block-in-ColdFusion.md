---
layout: post
title: "Building a simple \"Days Till\" code block in ColdFusion"
date: "2007-03-27T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/27/Building-a-simple-Days-Till-code-block-in-ColdFusion
guid: 1923
---

For the past few days I've been meaning to write up a simple example of how one would do a "There are X days till Christmas" type code block. It is <i>mostly</i> simple in ColdFusion so let's look at a quick example.
<!--more-->
First, you have to figure out what you want to do for each of the 3 "states":

<ol>
<li>the days leading up to your event
<li>the day of your event
<li>the day after your event
</ol>

For the days leading up to the event you will typically simply print, "There are X days until Y." For the day of the event you may print something like, "Today is Y!". For the day after the event, you may do nothing. Most of all though you want to be sure not to say "There are -X days until Y." (Another alternative is to count the days until next years event.)

So to handle this in ColdFusion you first want to create a date object. This can be done by simply providing the year, month, and day of your event. For this blog post I'll use April 8. (Yes, my birthday. ;)

<code>
&lt;cfset day = createDate(2007, 4, 8)&gt;
</code>

Next we simply need to figure out how many days away from today that date is. For this we use dateDiff:

<code>
&lt;cfset daystill = dateDiff("d", now(), day)&gt;
</code>

The first argument tells the function what unit to use in figuring out the difference. As an example, we may want to know how many hours until our event. But for now, we just want the days.

This will return 3 things. If it is a positive number, it is the number of days till my birthday. If it is 0, it means that today is my birthday. If it is a negative number, it means my birthday has passed. 

So a real quick check can be done like so:

<code>
&lt;cfif daystill gt 0&gt;
  &lt;cfoutput&gt;There are #daystill# day(s) my birthday. Plenty of time to visit my wishlist!&lt;/cfoutput&gt;
&lt;cfelseif daystill is 0&gt;
  &lt;cfoutput&gt;Happy Birthday to me! Did you visit my wishlist?&lt;/cfoutput&gt;
&lt;cfelse&gt;
  &lt;cfoutput&gt;My birthday passed #abs(daystill)# day(s) ago - did you get my anything?&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

In case you are wondering, the abs function simply takes the absolute value of a number. It is a quick way to turn -X into X.

So this works fine and well, until the day before the event. Try running my code and using 2007, 3, 28 for the values. (Obviously if you are not reading this blog entry on March 27th you need to use another value.) The result you get says that today is my birthday. Why?

Well when the date object is created, ColdFusion has to make assumptions for the <i>time</i> of the date object. What time did ColdFusion use? A quick test will show us:

<code>
&lt;cfoutput&gt;#timeformat(day)#&lt;P&gt;&lt;/cfoutput&gt;
</code>

If you run this code you will see 12:00AM. So when the date is tomorrow, ColdFusion correctly states that it is <b>not</b> more than 24 hours away. 

So there are a few ways we could handle this. One way I found is to simply switch to using the number of hours between the dates:

<code>
&lt;cfset daystill = dateDiff("h", now(), day)&gt;
</code>

Using the example of tomorrow as the event, this will return some number less then 24, but greater then 0. I can divide this by 24 and round up.

<code>
&lt;cfset realdiff = ceiling(daystill/24)&gt;
</code>

This will give me a result of 1 for tomorrow. I then simply use realdiff in my conditional:

<code>
&lt;cfif realdiff gt 0&gt;
  &lt;cfoutput&gt;There are #realdiff# day(s) my birthday. Plenty of time to visit my wishlist!&lt;/cfoutput&gt;
&lt;cfelseif realdiff is 0&gt;
  &lt;cfoutput&gt;Happy Birthday to me! Did you visit my wishlist?&lt;/cfoutput&gt;
&lt;cfelse&gt;
  &lt;cfoutput&gt;My birthday passed #abs(realdiff)# day(s) ago - did you get my anything?&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>
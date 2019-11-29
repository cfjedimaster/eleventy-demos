---
layout: post
title: "Ask a Jedi: What day is Wednesday?"
date: "2007-06-05T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/05/Ask-a-Jedi-What-day-is-Wednesday
guid: 2092
---

The day after Tuesday obviously. All kidding aside, a reader pinged me today with a simple question:

<blockquote>
How do I find the date for this week's Wednesday?
</blockquote>
<!--more-->
This is a bit simple with some math. Every day of the week has a corresponding number. Sunday is 1. Monday 2. Etc. If Wednesday is 4, then we know how many days we are away from Wednesday. So today (the day I'm writing this blog entry) is Tuesday. The day of the week is 3. The difference is 1. So if I wanted to create a date object for Wednesday, I would need to add one to today. If today were Thursday, I'd need to subtract one. 

So lets abstract that a bit. We want to end up with a number that we can add to today to get to Wednesday. If we take the current day of the week (3), subtract Wednesday (4), we end up with -1. If we multiply this value by -1, we get 1. Which is valid. 

Now assume Thursday. Thursday is day 5. 5-4 is 1. 1 times -1 is -1. That also gives us a valid modifier to get to Wednesday. 

So the logic is: (DOW-4) * -1. We can wrap this up nicely like so:

<code>
&lt;cfset thisWednesday = dateAdd("d", (dayOfWeek(now()) - 4) * -1, now())&gt;
</code>

For another version of this, consider <a href="http://www.cflib.org/udf.cfm?ID=177">PrevOccOfDow</a> and <a href="http://www.cflib.org/udf.cfm?ID=175">NextOccOfDow</a> from CFLib. These do not find the current week's Wednesday unless it just so happens Wednesday would be immediately following or before the date in question, but these alternate versions may be exactly what the reader had in mind.
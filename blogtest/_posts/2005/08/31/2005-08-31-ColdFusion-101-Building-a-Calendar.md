---
layout: post
title: "ColdFusion 101: Building a Calendar"
date: "2005-08-31T19:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/31/ColdFusion-101-Building-a-Calendar
guid: 745
---

A reader recently asked me how I did the calendar on the right hand side of the blog, and specifically how I highlighted the current day. Then the reader asked if it was PHP. (The horror, the horror!) Building a calendar in ColdFusion is pretty simple, especially with the handy built-in ColdFusion date functions. In fact, the most difficult part of the entire process is laying out the HTML, as I'll explain later.

So let's start off with the simple stuff. We want to build a calendar for the current month. We can get the current date and time by using the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000590.htm">Now()</a> function. The next thing we need is the number of days in the month. ColdFusion provides the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000447.htm">DaysInMonth()</a> function just for that purpose. It accepts a date object, so we can pass in the result of now(). The last thing we need is the current day of the month. We can get that using using the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000443.htm">Day()</a> function. Here is an example showing all three functions.
<!--more-->
<div class="code"><FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
The current date and time: #now()#<FONT COLOR=NAVY>&lt;br&gt;</FONT><br>
There are #daysInMonth(now())# days in this month.<FONT COLOR=NAVY>&lt;br&gt;</FONT><br>
The current day of the month is #day(now())#.<FONT COLOR=NAVY>&lt;br&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

Guess what - that's really all there is to it. The entire rest of this post will just deal with the HTML, which is a bit tricky. Now that your warned, let's get started.

A typical calendar is displayed using a table structure. Each row will start with Sunday and end with Saturday. Let's begin by creating a header for our calendar. 

<div class="code"><FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT> width=<FONT COLOR=BLUE>"100{% raw %}%"</FONT> height=<FONT COLOR=BLUE>"100%{% endraw %}"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"7"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;th&gt;</FONT>#dayOfWeekAsString(x)#<FONT COLOR=TEAL>&lt;/th&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

I start off with a table tag, and use width and height values of a 100%. This will create a calendar that covers the entire page. This is ugly. I know it. But I can't design, so forgive me. What's really cool here is that I'm not entering “Sunday”, “Monday”, etc. I just use the built-in ColdFusion function <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000445.htm">dayOfWeekAsString</a> function. Not only does this allow me to be lazy, it also will be automatically localized if you run the code on a non-English system. This gives us a header. Now we need to start displaying dates. You might imagine simply looping from 1 to the number of the days in the month, with a new table row starting every 7 days. However, this won't work since the month doesn't always start on Sunday. What we need to do is "pad" the beginning of the calendar (and the end) with some blank days to represent the previous (and next) month. 

There are a few ways we can do this, so the solution I'll provide is just one of them. What I'll do is first figure out what day of the week the first of the month is. For this we will use a few more date functions. First we will need to create a date object for the first of the month. Again, there are multiple ways of doing it, but I'll use <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000422.htm">CreateDate()</a>. This function expects the year, month, and day. To get the current year and month, we use the... wait for it.... can you guess? Yes, the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000675.htm">Year()</a> and <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000588.htm">Month()</a> functions. I <i>really</i> love ColdFusion. So, all together now - to create a date object for the first of the month, all we need is:

<div class="code"><FONT COLOR=MAROON>&lt;cfset firstOfTheMonth = createDate(year(now()), month(now()),<FONT COLOR=BLUE> 1</FONT>)&gt;</FONT></div>

In case that was a bit too hard to read, this is the exact same code, broken down a bit:

<div class="code"><FONT COLOR=MAROON>&lt;cfset thisYear = year(now())&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset thisMonth = month(now())&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset firstOfTheMonth = createDate(thisYear, thisMonth,<FONT COLOR=BLUE> 1</FONT>)&gt;</FONT></div>

So for so good. Now that we have a date object for the first of the month, we can use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000444.htm">DayOfWeek()</a> function to figure out what day of the week it is. 

<div class="code"><FONT COLOR=MAROON>&lt;cfset dow = dayofWeek(firstOfTheMonth)&gt;</FONT></div>

This gives us a number between 1 and 7. Our pad will be the day of the week minus 1. 

<div class="code"><FONT COLOR=MAROON>&lt;cfset pad = dow - 1&gt;</FONT></div>

Now we need to create the first row of the calendar with empty boxes, if any:

<div class="code"><FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif pad gt<FONT COLOR=BLUE> 0</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"#pad#"</FONT>&gt;</FONT><B><I>&amp;nbsp;</I></B><FONT COLOR=TEAL>&lt;/td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

You may notice I'm using cfoutput even though I'm not outputting any dynamic values. I tend to always run my code under the setting that suppresses white space, so this is normally something I need to do - but you can remove it if you want.

So – at this point – we are now ready to output our dates. All we need to do is loop from 1 to to the number of days in the month. However, we have two "gotchas". First, we have to start a new table row after every 7th day. Secondly, since we may not be starting on the Sunday, we need to be sure we start a new row after the first Saturday.

This sounds complex, but it really isn't. We have one main loop, again, going from 1 to the number of days in the month. We also have a counter. This counter simply says, "When I get past 7, create a new row, and start counting from 1 again." Let's take a look at the code for this:

<div class="code"><FONT COLOR=MAROON>&lt;cfset days = daysInMonth(now())&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset counter = pad + 1&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"#days#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#x#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset counter = counter + 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif counter is<FONT COLOR=BLUE> 8</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;/tr&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif x lt days&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset counter = 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT></div>

Starting from the top - we begin by creating a variable, days, that represents the number of days in the month. Next, we create our counter variable. This will represent the day of the week. Since we have already covered "pad" days, we need to add one to pad for our initial counter. Now we begin the loop from 1 to days. For each day, we add one to counter. When counter becomes 8, we reset it to 1 and close the table row. Notice that we only reset the counter and start a new table row if we aren't on the last day. 

If you run this code now, you will see a pretty calendar... except for where the days end. Just as we needed a pad in the front of the calendar, we need a pad at the end. Luckily, we can reuse the counter variable. If the number is anything but 8, we need to pad again. We can get our pad by just taking 8 and subtracting the counter value:

<div class="code"><FONT COLOR=MAROON>&lt;cfif counter is not 8&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset endPad = 8 - counter&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"#endPad#"</FONT>&gt;</FONT><B><I>&amp;nbsp;</I></B><FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

Voila! A calendar. Not a very pretty one, but as Scotty used to say, I'm an engineer, not a beret-wearing designer. Oops, I almost forgot. How do we highlight the current day? All we need to do is check to see if x, our loop counter, is equal to the current day of the month. We can then apply any highlight, design, or whatever. The entire code for the calendar display, including the highlight for the current day, may be found below. If folks are interested, later in the week I'll show how to convert this to a custom tag so you can do things like, a) change the month, and b) pass in events.

<div class="code"><FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;table border=<FONT COLOR=BLUE>"1"</FONT> width=<FONT COLOR=BLUE>"100{% raw %}%"</FONT> height=<FONT COLOR=BLUE>"100%{% endraw %}"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"7"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;th&gt;</FONT>#dayOfWeekAsString(x)#<FONT COLOR=TEAL>&lt;/th&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset firstOfTheMonth = createDate(year(now()), month(now()),<FONT COLOR=BLUE> 1</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset dow = dayofWeek(firstOfTheMonth)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset pad = dow - 1&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif pad gt<FONT COLOR=BLUE> 0</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"#pad#"</FONT>&gt;</FONT><B><I>&amp;nbsp;</I></B><FONT COLOR=TEAL>&lt;/td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset days = daysInMonth(now())&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfset counter = pad + 1&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"#days#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif x is day(now())&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;td bgcolor=<FONT COLOR=BLUE>"yellow"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;td&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;#x#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset counter = counter + 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif counter is<FONT COLOR=BLUE> 8</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;/tr&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif x lt days&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset counter = 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif counter is not 8&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset endPad = 8 - counter&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td colspan=<FONT COLOR=BLUE>"#endPad#"</FONT>&gt;</FONT><B><I>&amp;nbsp;</I></B><FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;/table&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>
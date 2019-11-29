---
layout: post
title: "ColdFusion 101: Day of the Week Formatting"
date: "2006-08-03T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/03/ColdFusion-101-Day-of-the-Week-Formatting
guid: 1446
---

So it has been a while since I've done a CF 101 post, but for those who do not remember, these are entries specifically targeting people brand new to ColdFusion. For most of my readers, this will probably be something you already know, but on the other hand, I've never been surprised by own my lack of knowledge, so maybe it will be helpful as well. 

This was an old question sent to the Ask a Jedi form:

<blockquote>
Hello, I followed the code you have written to the T and thankfully it works. My question is how do you get the daysoftheweek showing as 'Sun' 'Mon' etc. instead of Sunday, Monday...
</blockquote>
<!--more-->
There are a few ways to get the day of the week. The simplest is with the <a href="http://www.techfeed.net/cfQuickDocs/?DayOfWeekAsString">dayOfWeekAsString()</a> function:

<code>
&lt;cfoutput&gt;#dayOfWeekAsString(dayOfWeek(now()))#&lt;/cfoutput&gt;
</code>

This will get the day of the week value (a number from 1 to 7) and pass it to the dayOfWeekAsString function. So how could you get it to be Sun instead of Sunday? Just use the left() function. 

<code>
&lt;cfoutput&gt;#left(dayOfWeekAsString(dayOfWeek(now())),3)#&lt;/cfoutput&gt;
</code>

The only issue with that is that you need to be careful if you aren't using English as your current locale. The dayOfWeekAsString function is automatically localized in CFMX7. In other languages, the first 3 characters may not make sense. 

The other way to format the day of the week is with the <a href="http://www.techfeed.net/cfQuickDocs/?DateFormat">dateFormat()</a> function. It lets you pass several tokens to format a date. Two tokens refer specifically to the day of the week. This code will return just the day of the week:

<code>
&lt;cfoutput&gt;
#dateFormat(now(),"dddd")#
&lt;/cfoutput&gt;
</code>

To get a 3 letter day of the week, you can simply use the "ddd" token instead.

<cfoutput>
#dateFormat(now(),"ddd")#
</cfoutput>

Check the <a href="http://www.techfeed.net/cfQuickDocs/?DateFormat">docs</a> for more information on the tokens you can use in dateFormat, as they changed in MX. 

You will notice on my calendar pod to the right, I use just the first letter. This is done using the left() function as described above. 

One last tip - and this is something that I tend to forget doing most of the time so you will have to pardon me if you notice that you don't actually see it in my code. I suggest folks store their date and time masks as application variables. That way, site wide, you can set what you want to use for a date and time format. Maybe you want "08/03/2006". Maybe you want "August 3, 2006". The point is - if you store the mask as an application setting, it is easy to update in the future. In fact, you can write a simple UDF to do it for you. That way instead of coding:

<code>
#dateFormat(thedate, application.mask)#
</code>

You can do:

<code>
#myDateFormat(thedate)#
</code>

Even better, you can automatically do both date and time formatting:

<code>
#myDTFormat(thedate)#
</code>

So now that I'm seriously off topic from the original post, I'll stop.
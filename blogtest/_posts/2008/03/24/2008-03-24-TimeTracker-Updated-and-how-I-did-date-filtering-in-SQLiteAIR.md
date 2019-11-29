---
layout: post
title: "TimeTracker Updated, and how I did date filtering in SQLite/AIR"
date: "2008-03-24T11:03:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2008/03/24/TimeTracker-Updated-and-how-I-did-date-filtering-in-SQLiteAIR
guid: 2723
---

Sometime ago I began work on a simple AIR tool to help me record my hours. It's been a while since I worked on it, but this weekend I decided to take another look at a nagging issue that I had never resolved. How do I do date filters in SQLite? Specifically, the "Enter Hours" screen should only show the hours you entered for today. (I plan on adding a Reports tab later to let you browse hours and generate reports.)

I worked and worked and worked on this issue before, but figured a fresh look may help. I finally got it working. I used the strftime function, which is really meant to <i>format</i> dates, but I was able to use it in the WHERE clause as well. This is the final code I ended up with:

<code>
hourDataStatement.text = 'select hours.description, hours.hours, hours.date, projects.name as project, clients.name as client from hours, projects, clients where hours.projectidfk = projects.id and projects.clientidfk = clients.id ' + 
		'and strftime("{% raw %}%d",date) = strftime("%{% endraw %}d",date("now")) ' + 
		'and strftime("{% raw %}%m",date) = strftime("%{% endraw %}m",date("now")) ' + 
		'and strftime("{% raw %}%Y",date) = strftime("%{% endraw %}Y",date("now")) ' + 
		'order by date desc';	
</code>

In case that doesn't make sense, what I've done is added where clauses that do:

where 'format the date to show just day == the day of today' AND 'format the date to show just the month == the month of today' AND 'format the date to show just the year == the year of today'

Not incredibly elegant, but it worked! 

During my testing I also ran into another issue. One thing I tell people about Flex development is - it is incredibly easy for the most part. All you have to do is get comfortable with the tag set and have an idea of what you can do in ActionScript. What <b>is</b> difficult is getting used to asynchronous operations. The idea that - I can run some remote function but I have to write a function to handle the result. Maybe it's just me, but time and time again this trips me up.

The problem I ran yesterday involved the start up code for the application. I had deleted my old database so everything was run fresh. I got an error stating that the schema had changed. I think I know why. My old code did this:

<ul>
<li>Open an async connection, when open, run SetUp()
<li>SetUp would create new tables if necessary
<li>Setup used a Synch connection. 
<li>When done, continue on the app 
<li>The rest of the app used the <b>original</b> asynch connection.
</ul>

So my take on the bug was - the original async connection got "confused" when the db was changed underneath it. I edited my code a bit so as we now do:

<ul>
<li>Open synch connection and make tables.
<li>When done, open the new asynch connection.
</ul>

And this corrected the problem. I've included both the source and the AIR installer for the latest version. Now I'm very happy as I get to play with charts and generating reports!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive18%{% endraw %}2Ezip'>Download attached file.</a></p>
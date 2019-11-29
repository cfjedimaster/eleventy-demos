---
layout: post
title: "Ask a Jedi: Abstract date ranges and search"
date: "2008-09-18T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/18/Ask-a-Jedi-Abstract-date-ranges-and-search
guid: 3023
---

For privacy reasons, when folks send a question to me and I respond on the blog, I only use the first name. I'm getting bored with that so I think may start providing completely made up last names. If this offends anyone, speak up. I won't use this an excuse for unbridled frivolity or anything else unbecoming a Jedi developer.

Gareth Supremepizzapants asks:

<blockquote>
<p>
Hoping you can point me in the right direction. I want to be able to mimic the date search facility seen at ticketmaster.co.uk where users can search for events occurring 'next weekend', 'next month', 'this week' etc. Can't seem to find any info. I know how to get the current date with Now() but what about the date after today i.e its Thursday and I want to Return all items from today to the of the week on Sunday. Any ideas?
</p>
</blockquote>

This is an interesting question. Date searches with defined ranges are simple enough. So for example, if you ask the user to provide a start and end date, there isn't much necessary to validate those dates and then restrict the search results. But Gareth wants something a bit more abstract. Users need to be able to search for "This Week" or "This Weekend", etc. While us humans have no problem with this, we have to be a bit more precise when we perform our query. It also becomes more complicated when you consider <i>what</i> you are searching. If you are selling tickets, and the user wants to see tickets for events this week, does it make sense to show results from events earlier in the week? Probably not. If it is Sunday morning and you search for this weekend, do you really want to see a result for the awesome Def Leppard concert last night? Again, the answer is probably not. Here is one way I solved this problem.
<!--more-->
First, I created my sample data. I wanted a large set of data so I ended up caching it. Obviously this wouldn't be necessary for a real application.

<code>
cfif not isDefined("application.tdata")&gt;
	&lt;cfset q = queryNew("id,title,dtevent","integer,varchar,timestamp")&gt;
	&lt;cfloop index="x" from="1" to="500"&gt;
		&lt;cfset queryAddRow(q)&gt;
		&lt;cfset querySetCell(q, "id", x)&gt;
		&lt;cfset querySetCell(q, "title", "Title #x#")&gt;
		&lt;cfset dt = dateAdd("h", x * 3, now())&gt;
		&lt;cfset querySetCell(q, "dtevent", dt)&gt;
	&lt;/cfloop&gt;
	&lt;cfset application.tdata = q&gt;
&lt;/cfif&gt;
</code>

Nothing too complicated here. I create a query of 500 records. Each record has an id, title, and a timestamp for the event. The *3 in the dateAdd helps spread out my events over time.

Now let's build a form. Normally you would have a free form text input and other fields, but in this example I just have my date range filter. Also, I picked 3 arbitrary ranges (This Week, This Weekend, Next Weekend). You could add/remove these as you see fit.

<code>
&lt;cfoutput&gt;
&lt;form action="#cgi.script_name#" method="post"&gt;
&lt;select name="range"&gt;
&lt;option value="thisweek" &lt;cfif form.range is "thisweek"&gt;selected&lt;/cfif&gt;&gt;This Week&lt;/option&gt;
&lt;option value="thisweekend" &lt;cfif form.range is "thisweekend"&gt;selected&lt;/cfif&gt;&gt;This Weekend&lt;/option&gt;
&lt;option value="nextweek" &lt;cfif form.range is "nextweek"&gt;selected&lt;/cfif&gt;&gt;Next Week&lt;/option&gt;
&lt;/select&gt;
&lt;input type="submit" name="search" value="Search"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
</code>

Ok, now for the fun part. How do we convert each of these options into a range of dates? First I'll check to see if the form was submitted, and begin a case statement.

<code>
&lt;cfif structKeyExists(form, "search")&gt;

	&lt;!--- create date/time ranges based on search type ---&gt;
	&lt;cfswitch expression="#form.range#"&gt;
</code>

Now for each type of search I'll use a case block. The first case block is for this week:

<code>
&lt;!--- From now() till end of day saturday ---&gt;
&lt;cfcase value="thisweek"&gt;
	&lt;cfset start = now()&gt;
	&lt;cfset end = dateAdd("d", 7 - dayOfWeek(now()), now())&gt;
	&lt;!--- redo end to be end of day ---&gt;
	&lt;cfset end = dateFormat(end, "m/d/yyyy") & " 11:59 PM"&gt;
&lt;/cfcase&gt;
</code>

Notice that the start value is right now. I don't want results from earlier in the week. My end value should be Saturday, end of day. I did this by using dateAdd. The 7-dayOfWeek() thing basically just 'moves' me up to Saturday. I used ColdFusion lose typing then to create a string for that date, 11:59 PM. This is <b>not</b> the only way I could have done this. Since I know I'm going to eventually use SQL, I could have made a date object for the day after end, with no time value, and use a &lt; in my SQL. But this worked and gave me the warm fuzzies.

The next case block was for this weekend. This one was slightly more complex:

<code>
&lt;!--- this sat, but not before now(), to end of day sunday ---&gt;
&lt;cfcase value="thisweekend"&gt;
	&lt;cfset start = dateAdd("d", 7 - dayOfWeek(now()), now())&gt;
	&lt;!--- redo start to be 12:00 am ---&gt;
	&lt;cfset start = dateFormat(start, "m/d/yyyy") & " 12:00 AM"&gt;
	&lt;!--- if this is before now, reset to now() ---&gt;
	&lt;cfif dateCompare(start, now()) is -1&gt;
		&lt;cfset start = now()&gt;
	&lt;/cfif&gt;

	&lt;cfset end = dateAdd("d", 7 - dayOfWeek(now()) + 1, now())&gt;
	&lt;!--- redo end to be end of day ---&gt;
	&lt;cfset end = dateFormat(end, "m/d/yyyy") & " 11:59 PM"&gt;
			
&lt;/cfcase&gt;
</code>

I begin by creating a date value for Saturday. I then reformat it to drop the time. Note though that I compare this value to now() and use whichever is larger. The end range worked much like the previous case, except this time I want to end at one minute to Monday morning. My previous code worked for Saturday, so I simply added one more date.

The last case handles next week:

<code>
&lt;!--- next sunday, 12am till sat midnight ---&gt;
&lt;cfcase value="nextweek"&gt;

	&lt;cfset start = dateAdd("d", 7 - dayOfWeek(now()) + 1, now())&gt;
	&lt;!--- redo start to be 12:00 am ---&gt;
	&lt;cfset start = dateFormat(start, "m/d/yyyy") & " 12:00 AM"&gt;

	&lt;cfset end = dateAdd("d", 7 - dayOfWeek(now()) + 6, now())&gt;
	&lt;!--- redo end to be end of day ---&gt;
	&lt;cfset end = dateFormat(end, "m/d/yyyy") & " 11:59 PM"&gt;

&lt;/cfcase&gt;
</code>

This is pretty much a repeat of what we had before, just adjusted a bit. Again, there are other ways to get the date values. 

So the final step is to simply uses these values in a query. Here is what I used:

<code>
&lt;cfquery name="results" dbtype="query"&gt;
select	*
from	application.tdata
where	dtevent between 
	&lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#start#"&gt;
	and
	&lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#end#"&gt;
order by dtevent asc
&lt;/cfquery&gt; 
</code>

Obviously your database would be different. And yes, I use cfqueryparam even in 'fake' queries. I've included the full code base below. Some other things to consider: For a ticket seller, you probably don't want to use now() as you minimum range. You probably instead want to only sell tickets for events that are at least one hour away. Even that only applies to events with "Will Call" pick up. For events without them, you probably want an even wider range to handle physical delivery. Another problem would be for a site that sells events over multiple time zones. (Personally I think we should just all use <a href="http://en.wikipedia.org/wiki/Swatch_time">Swatch Time</a>.)

<code>

&lt;cfif not isDefined("application.tdata")&gt;
	&lt;cfset q = queryNew("id,title,dtevent","integer,varchar,timestamp")&gt;
	&lt;cfloop index="x" from="1" to="500"&gt;
		&lt;cfset queryAddRow(q)&gt;
		&lt;cfset querySetCell(q, "id", x)&gt;
		&lt;cfset querySetCell(q, "title", "Title #x#")&gt;
		&lt;cfset dt = dateAdd("h", x * 3, now())&gt;
		&lt;cfset querySetCell(q, "dtevent", dt)&gt;
	&lt;/cfloop&gt;
	&lt;cfset application.tdata = q&gt;
&lt;/cfif&gt;

&lt;cfparam name="form.range" default=""&gt;

&lt;cfoutput&gt;
&lt;form action="#cgi.script_name#" method="post"&gt;
&lt;select name="range"&gt;
&lt;option value="thisweek" &lt;cfif form.range is "thisweek"&gt;selected&lt;/cfif&gt;&gt;This Week&lt;/option&gt;
&lt;option value="thisweekend" &lt;cfif form.range is "thisweekend"&gt;selected&lt;/cfif&gt;&gt;This Weekend&lt;/option&gt;
&lt;option value="nextweek" &lt;cfif form.range is "nextweek"&gt;selected&lt;/cfif&gt;&gt;Next Week&lt;/option&gt;
&lt;/select&gt;
&lt;input type="submit" name="search" value="Search"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;

&lt;cfif structKeyExists(form, "search")&gt;

	&lt;!--- create date/time ranges based on search type ---&gt;
	&lt;cfswitch expression="#form.range#"&gt;

		&lt;!--- From now() till end of day saturday ---&gt;
		&lt;cfcase value="thisweek"&gt;
			&lt;cfset start = now()&gt;
			&lt;cfset end = dateAdd("d", 7 - dayOfWeek(now()), now())&gt;
			&lt;!--- redo end to be end of day ---&gt;
			&lt;cfset end = dateFormat(end, "m/d/yyyy") & " 11:59 PM"&gt;
		&lt;/cfcase&gt;

		&lt;!--- this sat, but not before now(), to end of day sunday ---&gt;
		&lt;cfcase value="thisweekend"&gt;
			&lt;cfset start = dateAdd("d", 7 - dayOfWeek(now()), now())&gt;
			&lt;!--- redo start to be 12:00 am ---&gt;
			&lt;cfset start = dateFormat(start, "m/d/yyyy") & " 12:00 AM"&gt;
			&lt;!--- if this is before now, reset to now() ---&gt;
			&lt;cfif dateCompare(start, now()) is -1&gt;
				&lt;cfset start = now()&gt;
			&lt;/cfif&gt;

			&lt;cfset end = dateAdd("d", 7 - dayOfWeek(now()) + 1, now())&gt;
			&lt;!--- redo end to be end of day ---&gt;
			&lt;cfset end = dateFormat(end, "m/d/yyyy") & " 11:59 PM"&gt;
			
		&lt;/cfcase&gt;
		
		&lt;!--- next sunday, 12am till sat midnight ---&gt;
		&lt;cfcase value="nextweek"&gt;

			&lt;cfset start = dateAdd("d", 7 - dayOfWeek(now()) + 1, now())&gt;
			&lt;!--- redo start to be 12:00 am ---&gt;
			&lt;cfset start = dateFormat(start, "m/d/yyyy") & " 12:00 AM"&gt;

			&lt;cfset end = dateAdd("d", 7 - dayOfWeek(now()) + 6, now())&gt;
			&lt;!--- redo end to be end of day ---&gt;
			&lt;cfset end = dateFormat(end, "m/d/yyyy") & " 11:59 PM"&gt;

		&lt;/cfcase&gt;		
	&lt;/cfswitch&gt;

	&lt;cfquery name="results" dbtype="query"&gt;
	select	*
	from	application.tdata
	where	dtevent between 
			&lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#start#"&gt;
			and
			&lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#end#"&gt;
	order by dtevent asc
	&lt;/cfquery&gt;
	
	&lt;cfdump var="#results#"&gt;		
&lt;/cfif&gt;
</code>
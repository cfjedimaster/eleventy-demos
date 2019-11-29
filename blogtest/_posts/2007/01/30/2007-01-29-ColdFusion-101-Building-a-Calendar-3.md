---
layout: post
title: "ColdFusion 101: Building a Calendar (3)"
date: "2007-01-30T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/30/ColdFusion-101-Building-a-Calendar-3
guid: 1804
---

I've finally gotten around to writing the follow up to my <a href="http://ray.camdenfamily.com/index.cfm/2007/1/23/ColdFusion-101-Building-a-Calendar-2">last entry</a> on building a simple calendar in ColdFusion. I mentioned that the next entry was going to focus on making the CSS a bit more configurable, but that's boring. I'll do that next. What folks really want is an example of sending data to the custom tag. So let's get to it.
<!--more-->
First off - lets talk about calendar data. Our custom tag is meant to be abstract, but as we all know, applications are not (typically) abstract. In fact, this was the main reason why I took so long to write these calendar write ups. (The <a href="http://ray.camdenfamily.com/index.cfm/2005/8/31/ColdFusion-101-Building-a-Calendar">first entry</a> was actually written back in 2005.)

So I decided to just say screw it. My tag will make some basic assumptions if you want to use it and that's that. The assumptions are pretty simple though. 

First off - your event data must be a query. Not a list. Not an array. Not a cow bell. But a query. 

Secondly - your query must have a title, date, and link column. These columns will be what the custom tag will look for when displaying data. 

So I don't think this is <i>too</i> bad. If your events data doesn't look exactly like this, you can always modify your query a bit to rename the columns. Plus, maybe I'll figure out a smart way to make this easier? 

Let's jump into our custom tag. The first thing I'm going to do is add a new cfparam to create a default for our event data:

<code>
&lt;cfparam name="attributes.events" default=""&gt;
</code>

I created a simple string for the events attribute. Later on I'll check to see if events is a query. 

If you remember, we looped over each day of the month. Here was the original code:

<code>
&lt;cfloop index="x" from="1" to="#days#"&gt;
	&lt;cfif x is day(attributes.today) and attributes.month is month(attributes.today) and attributes.year is year(attributes.today)&gt;
		&lt;cfoutput&gt;&lt;td class="cell_today"&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;&lt;td class="cell"&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
   
	&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;

	&lt;cfoutput&gt;&lt;/td&gt;&lt;/cfoutput&gt;
</code>

Now I'm going to add code that will check my query for events. I'll post the complete code, then I'll explain it:

<code>
&lt;!--- check for stuff for today ---&gt;
&lt;cfif isQuery(attributes.events)&gt;
	&lt;cfset thisDate = createDate(attributes.year, attributes.month, x)&gt;
		
	&lt;cfquery name="todaysEvents" dbtype="query"&gt;
	select	title, link
	from	attributes.events
	where	[date] &gt;= &lt;cfqueryparam cfsqltype="cf_sql_date" value="#thisDate#"&gt;
	and		[date] &lt; 	&lt;cfqueryparam cfsqltype="cf_sql_date" value="#dateAdd("d", 1, thisDate)#"&gt;
	&lt;/cfquery&gt;

	&lt;cfif todaysEvents.recordCount&gt;
		&lt;cfoutput&gt;
			&lt;cfloop query="todaysEvents"&gt;
			&lt;cfif len(link)&gt;&lt;a href="#link#"&gt;&lt;/cfif&gt;#title#&lt;cfif len(link)&gt;&lt;/a&gt;&lt;/cfif&gt;&lt;br /&gt;
			&lt;/cfloop&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

The first thing I do is check if attributes.event is actually a query. If it - I then create a date object for the current date. 

Next I use query of query to look for events that occur within that date. Note how I add one to the date value to create the second boundary of my where clause.

Last - I check to see if my query of query returned anything. If it did, I simply output over the events. 

Pretty simple, right? What's nice is that the custom tag will continue to work without event data if you want a simple calendar display. But now it supports passing in events and having them displayed (and linked as well).

Ok - so as I mentioned - your database probably won't match the structure the custom tag will use. What if there was a nice way around that? Turns out there is. 

First I'm going to add 3 new attributes to my custom tag:

<code>
&lt;cfparam name="attributes.datecolumn" default="date"&gt;
&lt;cfparam name="attributes.titlecolumn" default="title"&gt;
&lt;cfparam name="attributes.linkcolumn" default="link"&gt;
</code>

These all define defaults for the date, title, and link columns for my query. Now lets see how we can use this in the code:

<code>
&lt;cfquery name="todaysEvents" dbtype="query"&gt;
select	#attributes.titlecolumn# as title, #attributes.linkcolumn# as link
from	attributes.events
where	[#attributes.datecolumn#] &gt;= &lt;cfqueryparam cfsqltype="cf_sql_date" value="#thisDate#"&gt;
and		[#attributes.datecolumn#] &lt; 	&lt;cfqueryparam cfsqltype="cf_sql_date" value="#dateAdd("d", 1, thisDate)#"&gt;
&lt;/cfquery&gt;
</code>

This is the query we used before to determine if we had any events for today. However - now my column names are dynamic. I use aliases so I end up with the same column names. Now you can pass any query to the tag and simply tell it which columns to use for the title, link, and date columns.

I've attached the latest copy to this blog entry. In the follow up, I'll talk about how we can make the CSS a bit prettier. No, I haven't suddenly sprouted CSS genes. Instead I'll discuss how the custom tag can be told to rely on external CSS items instead. Enjoy.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcalendar2%{% endraw %}2Ezip'>Download attached file.</a></p>
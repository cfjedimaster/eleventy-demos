---
layout: post
title: "FullCalendar jQuery Plugin"
date: "2011-06-17T09:06:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/06/17/FullCalendar-jQuery-Plugin
guid: 4270
---

This isn't going to be a real deep post - more of a "Cool, take a look" type thing. A while back I found the <a href="http://arshaw.com/fullcalendar/">FullCalendar</a> jQuery plugin. As you can probably guess, it's a plugin that provides a full calendar view for dates. I finally made myself take some time to play with it and I'm pretty darn impressed. Some of the features include:

<p/>
<!--more-->
<ul>
<li>Ability to edit events (move them around to reschedule)
<li>Obviously the ability to load events via JSON, but even cooler, the ability to integrate with Google Calendar
<li>Multiple views (from calendar to week to day)
<li>Lots of customization
</ul>

<p/>

I ran into a few issues while working with the code, but nothing too terrible. Here's a simple example with a few customizations:


<pre><code class="language-markup">
&lt;html&gt;

&lt;head&gt;
&lt;link rel="stylesheet" text="text/css" href="fullcalendar-1.5.1/fullcalendar/fullcalendar.css" /&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="fullcalendar-1.5.1/fullcalendar/fullcalendar.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#cal").fullCalendar({
		aspectRatio: 2,
		buttonText: {
			today:"Go to Today"
		},
		events:'events.cfc?method=getevents'
	});
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="cal"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

As you can see, there isn't much going on here. I've got a div that will store my calendar and then I simply point to it with the plugin. All of the options I have there (and I'll explain them in a second) are optional. 

<p/>

So what did I customize and why? Oddly the height of he calendar, by default, was always a bit too tall for the screen in Chrome. Setting an aspectRatio of 2 seemed to work well to keep the calendar on screen. I don't think I full understand yet how best to use it, but in playing around it worked ok.

<p/>

Another minor customization was to the today button. By default the calendar will include a button to return to you the current month and current day. That button's default label was "today". The lowercase bugged me. Luckily you can see how easy it was to customize. (I could easily remove it as well.)

<p/>

Finally it would be nice to include some events, right? I pointed to a CFC called events. The plugin will pass a start/end range to your back end service and then you simply return the data. It requires an array of events and their docs clarify what each event object should contain. Here's the CFC I used:

<p/>

<pre><code class="language-javascript">
component {
	url.returnformat="json";
	
	remote function getEvents(any start, any end) {
		var realStart = epochTimeToDate(start);
		var realEnd = epochTimeToDate(end);
		writelog(file="application", text="Asked for #realstart# to #realend#, orig start=#start#");

		var q = new com.adobe.coldfusion.query();   		     
        q.setDatasource("blogdev");        
        q.setSQL("select id, title, posted from tblblogentries where posted &gt;= :start and posted &lt;= :end");        
        q.addParam(name="start",value=realstart,cfsqltype="cf_sql_date");        
        q.addParam(name="end",value=realend,cfsqltype="cf_sql_date");        
        var dbresults = q.execute().getResult();
        writelog(file="application", text="Result: #dbresults.recordCount#");

        var results = [];
        for(var i=1; i&lt;= dbresults.recordCount; i++) {
        	arrayAppend(results, {
        		"id"=dbresults.id[i],
				"title"=dbresults.title[i],
				"start"=getEpochTime(dbresults.posted[i]),
				"url"="http://www.raymondcamden.com/index.cfm?mode=entry&entry="&dbresults.id[i]
        	});	
        }
        return results;
	}
	
	//Credit Chris Mellon - http://www.cflib.org/udf/EpochTimeToDate
	private function epochTimeToDate(epoch) {
    	return DateAdd("s", epoch, "January 1 1970 00:00:00");
	}

	//Credit Chris Mellon - http://www.cflib.org/udf/GetEpochTime	
	private function getEpochTime() {
	    var datetime = 0;
	    if (ArrayLen(Arguments) is 0) {
	        datetime = Now();
	
	    }
	    else {
	        if (IsDate(Arguments[1])) {
	            datetime = Arguments[1];
	        } else {
	            return NULL;
	        }
	    }
	    return DateDiff("s", "January 1 1970 00:00", datetime);    
	}

}
</code></pre>

<p/>

The plugin sends a date range to you in UNIX time stamps - which are the number of seconds since epoch. Luckily there's a nice UDF at CFLib to make that easy to work with. I noticed that the ranges included a start time of 6AM. When I did my query I wanted to drop that so I used  a cf_sql_date instead of timestamp queryparam. I'll be coming back to this.

<p/>

Once I've got my data, it was a simple matter to convert it to an array of structs. And that's it. Check out the demo:

<p/>

<strong>The old demo has been removed. You can download it here: https://static.raymondcamden.com/enclosures/july162011B.zip</strong>

<p/>

So - the one thing I'm kinda stuck on is the whole time issue. Remember above where I said the plugin would send a time of 6AM along with it's date range? I can't get rid of that. So if I have something at 5AM on the first day of the range it won't show up. Normally the first day is the previous month. On the demo now that is May 29th. But in January, 2012, the first day is the <i>real</i> first day of the month. Even though I return an event for that (in my local testing environment), the plugin wanted to render it for the previous day. It's got to be some timezone issue I don't fully understand. 

<p/>

That's it for now. Overall - it seems like a darn cool little plugin. Fellow ColdFusion-er Jim Leether is also using it. You can see his example <a href="http://www.salisburymarylandkennelclub.org/calendar.cfm">here</a>. Anyone else?

<b>Edit on February 13, 2013:</b> James Moberg noted below that my demo stopped working with the latest jQuery due to curCSS being removed from jQuery. Most likely the latest edition of this jQuery plugin fixes that. In order to make my demo work, I went from using the latest 1.* branch of jQuery to 1.7.1 specifically. I'd urge readers to see if the latest build of the plugin is corrected, and if not, to file a bug with the owner.
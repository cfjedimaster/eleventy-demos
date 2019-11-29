---
layout: post
title: "Session metrics with Application.cfc"
date: "2006-12-19T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/19/Session-metrics-with-Applicationcfc
guid: 1724
---

A few months ago I blogged (<a href="http://ray.camdenfamily.com/index.cfm/2006/10/20/How-ColdFusion-can-save-you-business">How ColdFusion can save your business</a>) about how you can use the onSessionEnd feature of Application.cfc to track the success of your ecommerce site. Today I thought I'd follow up with another example that can be useful for measuring the success of your web site.
<!--more-->
Most web log programs will provide information about user sessions on your site. Each program has it's own voodoo to determine what a "session", but by applying their rules they can tell you things like what pages were used to enter the site - what pages were hit last, and how long the user spent on the site. 

Lets looks at a simple example of how we can provide similar metrics. First off we need a database table to store the information. I created a table with 6 columns:

<ul>
<li>sessionid/varchar/255: This stores the session ID for the user.
<li>entrypage/varchar/255: The URL for the first page the user hit in the session. 255 may be a bit short.
<li>entrytime/datetime: The time when the user first hit the site.
<li>exitpage/varchar/255: The last URL the user hit.
<li>exittime/datetime: The last hit from the user.
<li>hits/int: The number of page hits from the user.
</ul>

I named my table entryexitlog. Now lets look at an Application.cfc file that will use this table. I'll post the entire CFC as a download at the end, but first lets look at each method of the CFC. (Each method with something interesting in it of course!)

<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
	&lt;cfset application.dsn = "test"&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

The first method simply creates the DSN. Nothing too special there so lets just move along.

<code>
&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
	&lt;cfset var thispage = cgi.script_name&gt;
	
	&lt;cfif len(cgi.query_string)&gt;
		&lt;cfset thispage = thispage & "?" & cgi.query_string&gt;
	&lt;/cfif&gt;
	
	&lt;cfset session.hits = 0&gt;
	
	&lt;!--- Log the entry page ---&gt;
	&lt;cfquery datasource="#application.dsn#"&gt;
	insert into entryexitlog(sessionid,entrypage,entrytime)
	values(
		&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#session.urltoken#"&gt;,
		&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#thispage#"&gt;,
		&lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#now()#"&gt;)
	&lt;/cfquery&gt;
	
&lt;/cffunction&gt;
</code>

The onSessionStart code will fire when you first hit the site. The first thing I do is figure out what page you are visiting. This is done by checking cgi.script_name and cgi.query_string. I initialize your hits value to 0. Lastly I insert a new record into the database. Note the use of session.urltoken. This is a value that ColdFusion creates for you and is unique per session.

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var thispage = arguments.thePage&gt;
	
	&lt;cfif len(cgi.query_string)&gt;
		&lt;cfset thispage = thispage & "?" & cgi.query_string&gt;
	&lt;/cfif&gt;

	&lt;!--- store for later ---&gt;
	&lt;cfset session.lastpage = thispage&gt;
	&lt;cfset session.lasthit = now()&gt;
	&lt;cfset session.hits = session.hits + 1&gt;
	
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

The onRequestStart method will fire every time you hit a page. Note that once again I get the page (although this time I don't need to use cgi.script_name as the page is passed to the method automatically). I record the page as your "lastpage" value, store the time, and increase your hits. Do note that this code is not threadsafe. If you had a site with frames (lord forbid!) then it is possible the values will not be 100% correct. I made the call that this was so a) unlikely and b) not mission critical that I didn't bother using the locks. Now lets move on to the last method:

<code>
&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
	&lt;cfargument name="appScope" type="struct" required="false"&gt;
	
	&lt;!--- Log the exit page ---&gt;
	&lt;cfquery datasource="#arguments.appScope.dsn#"&gt;
	update entryexitlog
	set 
	exitpage = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.sessionScope.lastPage#"&gt;,
	exittime = &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#arguments.sessionScope.lastHit#"&gt;,
	hits = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.sessionScope.hits#"&gt;
	where sessionid = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.sessionScope.urltoken#"&gt;
	&lt;/cfquery&gt;

&lt;/cffunction&gt;
</code>

This method will fire when the session ends. All I do is update the database record, but do note that I do not directly access the Application or Session scope. Instead I have to use the copies passed to me in the method itself.

So what can we get from this? A whole heck of a lot of information:

<ul>
<li>Top entry pages (most common way folks enter your site)
<li>Bottom entry pages (least common way folks enter your site)
<li>Top exit pages (the pages that folks end up on - this could be very important as it could reflect a page that is either boring or confusing)
<li>Bottom exist pages (not quite as important)
<li>Average number of hits per use (how many pages do people visit on your site?)
<li>Average time on site (how long do folks stay on your site?) One cool thing is that since I store the actual time of your last page hit, the session end value will be more accurate. The default timeout for sessions is 20 minutes, which means that for most folks their sessions would be 20 minutes or longer, even if they just stayed for one minute. By noting their last hit timestamp your reports will be more accurate.
</ul>

Even nicer - you can provide reports that are more up to date then traditional log processors. Even Google Analytics is a bit behind for the reports it generates.
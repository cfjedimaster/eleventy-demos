---
layout: post
title: "Using ColdFusion to estimate the number of seconds a user spends on a page"
date: "2009-01-26T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/26/Using-ColdFusion-to-estimate-the-number-of-seconds-a-user-spends-on-a-page
guid: 3210
---

This weekend a user <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=0ED97496-19B9-E658-9D38816867345019">posted</a> an interesting question to my forums. He wanted to know if there was a way (in ColdFusion of course) to determine how many seconds a user spent on a page. I decided to give this a try myself to see what I could come up with. Before we look at the code though, there are two things you should consider.
<!--more-->
Number one - there is no ironclad way to actually determine the <b>real</b> amount of time a user spends looking at a web page. Yes, you can estimate it, but if I open your web page and than alt-tab over to my World of Warcraft session, then obviously the stats for my time on that page aren't accurate. So keep in mind that <b>any</b> numbers you get here will simply be estimates.

Number two - when it comes to web stats in general, I've found that it's almost always easier to let someone else worry about it - specifically Google. I remember parsing DeathClock.com logs and waiting 12+ hours for a report. The day I stopped parsing log files and just used Google Analytics was a good day indeed. GA does indeed provide this stat. (By the way, you guys spend, on average, one minute and forty-nine seconds on my site.) 

So with that said, how can we track this in ColdFusion? There are many ways, but here is one simple method. I began by creating a session variable to store the data:

<code>
&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
	&lt;cfset session.pages = []&gt;
&lt;/cffunction&gt;
</code>

The pages array will store the information I'm tracking. I decided on the Session scope as opposed to the Application scope as I wanted to keep it simple and just provide a report for the current user.

Next, in every onRequestStart, I look at the array. For each page request I'm going to log the URL and the current time. I'll then look at your <i>last</i> page and store a duration:

<code>
&lt;!--- Run before the request is processed ---&gt;
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var data = ""&gt;

	&lt;!--- determine if we have a last page. ---&gt;
	&lt;cfif arrayLen(session.pages)&gt;
		&lt;!--- the last page's value is the timestamp, update it with the diff ---&gt;
		&lt;cfset session.pages[arrayLen(session.pages)].duration = dateDiff("s", session.pages[arrayLen(session.pages)].timestamp, now())&gt;
	&lt;/cfif&gt;
	&lt;cfset data = {% raw %}{page=getCurrentURL(),timestamp=now()}{% endraw %}&gt;
	&lt;cfset arrayAppend(session.pages,data)&gt;

	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

Nothing too complex here really. If my session.pages array has <i>any</i> data, I must be on the second (or higher) page request. I do a quick dateDiff and store the result in the duration field. Outside the cfif I do a quick array append of a structure containing the current page url and time. The function getCurrentURL comes from <a href="http://www.cflib.org/udf/getcurrenturl">CFLib</a>. 

The last thing I do with the data is to serialize it and store it when the session end:

<code>
&lt;!--- Runs when session ends ---&gt;
&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
	&lt;cfargument name="appScope" type="struct" required="false"&gt;
		
	&lt;cfset var data = ""&gt;
	&lt;cfset var filename = ""&gt;

	&lt;!--- serialize ---&gt;
	&lt;cfwddx action="cfml2wddx" input="#arguments.sessionScope.pages#" output="data"&gt;
	
	&lt;!--- save it based on the sessionid value ---&gt;
	&lt;cfset filename = expandPath("./" & replace(createUUID(),"-","_","all") & ".txt")&gt;

	&lt;cfset fileWrite(filename, data)&gt;
&lt;/cffunction&gt;
</code>

That's it. There are a few things I'd probably do differently if I were to really deploy this code. First I'd use the database to store the updates. With a nice stored procedure it should run rather quickly. Even if I didn't do a DB call on each page update I'd at least change onSessionEnd. Notice that that you will have a 'hanging' page at the end with no duration. You could simply delete that from the array. Or you could use that last page and store it as another stat - the exit page.

I whipped up a real simple index page that dumps the session data and lists a few quick stats:

<code>
&lt;cfdump var="#session#"&gt;

&lt;cfset times = []&gt;
&lt;cfloop index="p" array="#session.pages#"&gt;
	&lt;cfif structKeyExists(p, "duration")&gt;
		&lt;cfset arrayAppend(times, p.duration)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;cfif arrayLen(times)&gt;
	Average duration: #arrayAvg(times)# seconds.&lt;br/&gt;
&lt;/cfif&gt;
Total number of pages visited: #arrayLen(session.pages)#
&lt;/cfoutput&gt;
</code>

And here is some sample output:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 134.png">

I've attached the code to the blog entry. Not sure how useful this is, but it's not like I've cared about usefulness in my other posts! ;)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fsecondtest%{% endraw %}2Ezip'>Download attached file.</a></p>
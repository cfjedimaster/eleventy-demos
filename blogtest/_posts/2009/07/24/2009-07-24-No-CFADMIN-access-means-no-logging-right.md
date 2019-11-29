---
layout: post
title: "No CFADMIN access means no logging, right?"
date: "2009-07-24T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/24/No-CFADMIN-access-means-no-logging-right
guid: 3463
---

This week seems to be 'Mr Obvious' week for me, and I apologize for that, but hopefully some of these entries are useful to folks. I was looking over email from a reader who commented that she couldn't use CFLOG because she didn't have admin access. While that is technically true, it certainly does not mean you can't use logging style features. 

As long as you have access to CFFILE, it is trivial to append to a file, and you can even create a simple UDF wrapper for it:
<!--more-->
<code>
&lt;cffunction name="mylog" access="public" returnType="void" output="true"&gt;
	&lt;cfargument name="file" type="string" required="true"&gt;
	&lt;cfargument name="message" type="string" required="true"&gt;
	&lt;cfargument name="type" type="string" required="false" default="information"&gt;
	
	&lt;!--- change to your path ---&gt;
	&lt;cfset var rootpath = "/Users/ray/Desktop/"&gt;
	
	&lt;cfset var newlog = "[#dateformat(now(), "mm/dd/yy")# #timeFormat(now(), "h:mm:ss:l tt")#] [#arguments.type#] #arguments.message#"&gt;
	&lt;cffile action="append" file="#rootpath##arguments.file#.log" output="#newlog#" addnewline="true"&gt;
	
&lt;/cffunction&gt;
</code>

This UDF takes in a file, message, and optional type. The file works much like CFLOG, where you specify just the <i>name</i> of the log, not a full path. Notice I've hard coded a root path. That's bad. The OO Police are after me as we speak. So yes, I could write this UDF as a CFC where a root path is passed in during instantiation. I could also make the file argument be a full path, or simply add a new argument. However, I was going for quick and dirty here. Modify it as you see fit.

Anyway - based on rootpath plus the name of the file you want, the code automatically adds to the log file with a date+time stamp, your type value, and then your string. Calling it then becomes as simple as:

<code>
&lt;cfset currentTime = getTickCount()&gt;
&lt;cfset sleep(randRange(1,1000))&gt;
&lt;cfset dur = getTickCount() - currentTime&gt;

&lt;cfset mylog("slowthing", "It took #dur# to run my slow process.")&gt;

Done...
</code>

Notice I didn't call it log. Log is a built in ColdFusion function for math geeks. That's why in CF9 the script version is writeLog. 

Lastly - let's say you know you are deploying to a host where you won't have CFLOG access and you make use of this UDF. If you use ColdFusion Builder, doesn't forget the <b>excellent</b> TailView (which is available elsewhere too of course) which can nicely render your log entries. Check out the video...

<a href="http://www.raymondcamden.com/images/videos/cfb.swf"><img src="https://static.raymondcamden.com/images/cfjedi/Picture 57.png" /></a>
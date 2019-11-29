---
layout: post
title: "Examples of ColdFusion 9 Script Support"
date: "2011-04-25T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/25/Examples-of-ColdFusion-9-Script-Support
guid: 4206
---

A few weeks ago I <a href="http://www.raymondcamden.com/index.cfm/2011/4/7/Workarounds-for-things-not-supported-in-ColdFusion-Script">posted</a> a simple guide to dealing with features you could not use in ColdFusion 9 script based code. While CF9 went a long way to making the scripting form more powerful, there are still some holes that need patching. One of the things that can be a bit confusing though is figuring out all the new script based forms of tags we've used in the past. While not a deep dive, I decided to write up a quick template that ran through all of these new keywords just so I'd have the syntax handy. I hope this helps.
<!--more-->
<p>

<b>Doing a dump...</b><br/>
<code>
&lt;cfscript&gt;
writedump(var=server,top=2,label="You betcha");
&lt;/cfscript&gt;
</code>

<p>

<b>Doing an include...</b><br/>
<code>
&lt;cfscript&gt;
include "foo.cfm";
//a dynamic version...
x = "test2.cfm";
include x;
&lt;/cfscript&gt;
</code>

<p>

<b>Doing a cflocation...</b><br/>
<code>
&lt;cfscript&gt;
location(url="test2.cfm",addtoken=false);
&lt;/cfscript&gt;
</code>

<p>

<b>cfparam</b><br/>
<code>
&lt;cfscript&gt;
param name="y" default=1 min=1;
writeOutput("y is " & y);
&lt;/cfscript&gt;
</code>

<p>

<b>Doing a lock...</b><br/>
<code>
&lt;cfscript&gt;
lock type="exlcusive" name="somelock" timeout="30" {
	//stuff
}
&lt;/cfscript&gt;
</code>

<p>

<b>Doing a log...</b><br/>
<code>
&lt;cfscript&gt;
writelog(file="application", text="beer time?");
&lt;/cfscript&gt;
</code>

<p>

<b>Doing cfsavecontent...</b><br/>
<code>
&lt;cfscript&gt;
savecontent variable="buffer" {
	include "test2.cfm";
}
&lt;/cfscript&gt;
</code>

<p>

<b>Exception handling...</b><br/>
<code>
&lt;cfscript&gt;
try {
	writeoutput("unknown #variablename#");
} catch(any e) {
	//if(e.errnumber == 0) rethrow;
	writedump(var=e);
} finally {
	writeoutput("&lt;p&gt;finally....");
}
&lt;/cfscript&gt;
</code>

<p>

<b>Tracing...</b><br/>
<code>
&lt;cfscript&gt;
trace(category="beer",text="my trace");
&lt;/cfscript&gt;
</code>

<p>

<b>Threading...</b><br/>
<code>
&lt;cfscript&gt;
thread name="slowthing" priority="low" {
	sleep(1000);
}
&lt;/cfscript&gt;
</code>

<p>

<b>transactions...</b><br/>
<code>
&lt;cfscript&gt;
transaction action="begin" {
	
	//query
	
}
&lt;/cfscript&gt;
</code>

<p>

<b>Throwing an exception...</b><br/>
<code>
&lt;cfscript&gt;
throw(message="You smell", detail="No, you REALLY smell");
&lt;/cfscript&gt;
</code>

<p>

<b>Stopping the execution of a request</b><br/>
<code>
&lt;cfscript&gt;
abort;
&lt;/cfscript&gt;
</code>

<p>

I think that covers everything, but if I missed something, let me know.

<p>

Shoot - one more just occurred to me. You can set pagencoding for a CFC at the top of the file - but after the component begins, ala:

<p>

<code>
component car {
pageencoding "Cp1252"
}
</code>

<p>

I've yet to use that syntax.
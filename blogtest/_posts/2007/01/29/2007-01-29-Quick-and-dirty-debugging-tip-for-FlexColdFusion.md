---
layout: post
title: "Quick and dirty debugging tip for Flex/ColdFusion"
date: "2007-01-29T14:01:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/01/29/Quick-and-dirty-debugging-tip-for-FlexColdFusion
guid: 1802
---

There are multiple methods of debugging applications, including the very cool <a href="http://www.fusion-reactor.com/fusiondebug/">FusionDebug</a>, log files, <a href="http://kevinlangdon.com/serviceCapture/">ServiceCapture</a>, and the debugging rolled into Flex Builder 2 itself. Here is a quick tip for another method to use. It's ugly - but effective.

Modify your onError to dump the errors and log to a file like so:

<code>
&lt;cffunction name="onError" returnType="void" output="false"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfset var temp = ""&gt;

	&lt;cflog file="my app" text="#arguments.exception.message#, #arguments.exception.detail#"&gt;
	&lt;cfsavecontent variable="temp"&gt;
	&lt;cfdump var="#arguments#"&gt;
	&lt;/cfsavecontent&gt;
	&lt;cffile action="write" file="c:\myapp.html" output="#temp#"&gt;
	&lt;cfdump var="#arguments#"&gt;&lt;cfabort&gt;
&lt;/cffunction&gt;
</code>

I wrapped a dump of the arguments (which contain my exception) and simply save it to the C drive as an HTML file. I then have this file open in my browser. As I debug, I can simply reload the tab in Firefox to see what the latest error was. 

I find this especially useful when the exception message is a bit too vague. With the dump I get the full trace of files where the error occurred.

Let me be absolutely clear: Do not use this code in production. It isn't nice. It doesn't play well with others. It runs with scissors. You get the idea. But I thought I'd share.
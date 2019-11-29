---
layout: post
title: "Ask a Jedi: Custom Tags, OnRequestStart, UDFs, and Antimatter Engines"
date: "2008-02-07T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/07/Ask-a-Jedi-Custom-Tags-OnRequestStart-UDFs-and-Antimatter-Engines
guid: 2638
---

Asa asks:

<blockquote>
<p>
I have a question for your ColdFusion Holiness. I have a file containing all my UDFs and I'm including it in onRequestStart:

&lt;cffunction name="onRequestStart"&gt;<br>
    &lt;!--- Include Global Functions ---&gt;<br>
        &lt;cfinclude template="/global_functions.cfm"&gt;<br>
&lt;/cffunction&gt;<br>

But the functions are not available inside my Custom Tags. A Google search said something about the wrong variable scope. Doesn't onRequestStart get called for custom tags too? What's the best way to be able to use them in my custom tags? 
</p>
</blockquote>

There are a few things in play here, so let's tackle it one by one. First off, if you cfinclude a file of UDFs via onRequestStart, the UDFs will <b>not</b> be available to your CFM files. It won't be... unless you <b>also</b> have onRequest. The presence of onRequest in Application.cfc has the side effect of copying your Application.cfc methods and variables into your templates Variables scope.
<!--more-->
So I'd be willing to bet you did this - and noticed you could run your UDFs just fine until you ran a custom tag. Custom tags have their own Variables scope. You could access the Variables scope of the parent by using the Caller scope. So to run a UDF named turnBritneyOn, you would use:

<code>
&lt;cfset result = caller.turnBritneyOn()&gt;
</code>

This is icky though. What I recommend instead is a simpler approach. Copy your UDFs into the Request scope. This lets custom tags run the UDFs easier as well. So take this simple, very short UDF library:

<code>
&lt;cfscript&gt;
function doItBritneyStyle() {
	return "Did it again...";
}
&lt;/cfscript&gt;
</code>

I'd modify it like so...

<code>
&lt;cfscript&gt;
req = structGet("request.udfs");
function doItBritneyStyle() {
	return "Did it again...";
}
req.doItBritneyStyle = doItBritneyStyle;
&lt;/cfscript&gt;
</code>

The req=structGet line simply creates a pointer to a structure called request.udfs. If the structure doesn't exist, it is created. If it does exist, I simply get a pointer to it. This lets me then do req.UDF = UDF after each udf as a quick way to copy each UDF into the request scope.

On my templates and custom tags, I can then just do:

<code>
&lt;cfset result = request.udfs.doItBritneyStyle()&gt;
</code>

Lastly - onRequestStart, or any of the other Application.cfc methods, are not called for a custom tag call since a custom tag simply runs more CF code. It doesn't start a new request. The same applies to calling a UDF or cfincluding a file.

Oh... antimatter engines. Yes, I did mention them. This post actually has little to do with antimatter, but after reading this list today, it's definitely on my mind: <a href="http://www.sff.net/paradise/overlord.html#captain">Stupid Plot Tricks</a>

My favorite: 140. If I board a derelict ship, and it appears that the former crew and passengers all died in some horrible fashion, I will immediately leave the ship, destroy it, and toss the wreckage into the nearest stellar object.
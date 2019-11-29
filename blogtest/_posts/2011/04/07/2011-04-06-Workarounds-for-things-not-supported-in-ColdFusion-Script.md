---
layout: post
title: "Workarounds for things not supported in ColdFusion Script"
date: "2011-04-07T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/07/Workarounds-for-things-not-supported-in-ColdFusion-Script
guid: 4187
---

Yesterday a friend on twitter was upset by the fact there was no CFWDDX support within ColdFusion scripting. This got me thinking other things not yet supported and ways that developers can work around them. While scripting has gotten <i>very</i> close to being "100% complete" under ColdFusion 901, there are definitely a few things left you still cannot do (WDDX being one of them) and I thought a discussion about ho to handle that might be nice.
<!--more-->
<p/>

First though - remember that it can sometimes be difficult to see what is supported in scripting because some features aren't listed where you might expect them to be. Consider "try", as in cftry. If you look in the CFML Reference you will find documentation for cftry but see no mention of how to use try within script. You may be included to check the function listing, but it is not there. That's because the try command is a keyword, not a function. You can find a good list of these keywords in the documentation within the Developer's Guide: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSe9cbe5cf462523a02805926a1237efcbfd5-7ffe.html">What is supported in CFScript</a>. Unfortunately this page doesn't tell you <i>how</i> to use these keywords. So for example - consider cflocation. Here is an example of how it is used:

<p/>

<code>
location(url=group.getHomeUrl(),addtoken=false);
</code>

<p/>

That's nice - but on the flip side, include, the script equivalent of cfinclude, works like so:

<p/>

<code>
include "render/blogpaneledit.cfm";
</code>

<p/>

These are kind of documented here: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSE99A664D-44E3-44d1-92A0-5FDF8D82B55C.html#WS759989C6-E44A-4a0f-AFF0-F78A860814BE">Using system level functions</a> But there is no mention of include, or try for that matter.

<p>

So that's keywords, but then you also things that are supported via new components. These components may be found in cfinstall\customtags\com\adobe\coldfusion. A documented list may be found here: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSe9cbe5cf462523a0448733bf1237f04c748-8000.html">Script Functions added in ColdFusion 9</a>. These are detailed in the Reference: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSe9cbe5cf462523a0693d5dae123bcd28f6d-8000.html">Script Functions Implemented as CFCs</a>. Be sure to notice the link to the enhancements in 901: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSd160b5fdf5100e8f-4439fdac128193edfd6-7f7b.html">Script functions implemented as CFCs in ColdFusion 9 Update 1</a>. 

<p>

Speaking of 901, don't forget that support for handling file uploads, via fileUpload, as well as directory commands, were added in 901. These were both things that forced me to use tag based CFCs at times in CF9.

<p>

Ok - so I said this blog entry was about workarounds for things <i>not</i> supported. Hopefully though you check these docs first to ensure that what you want to do is actually impossible. I've used a few different workarounds in my development and at work. Here are a few examples.

<p>

1) What about cfsetting? 

<p>

cfsetting has a few different options in it, but the one we use mostly is showdebugoutput="false". This is critical for pages that may serve up JSON or XML to remote clients. Unfortunately this is not possible to do in scripting. In the past, I've seen this workaround used:

<p>

<code>
include "setting_debug.cfm";
</code>

<p>

The file, setting_debug.cfm, will have a grand total of one line - a tag based cfsetting. That kinda sucks. But it also means the calling CFC can stay in script. Since you typically only need one of these, the one hack by itself isn't so bad.

<p>

2) What about tags like wddx, etc, not supported?

<p>

You have a few options. For something like WDDX, it wouldn't take very long to write a UDF "wrapper" for the tag that handles serializing and deserializing WDDX strings. Once done, you can include this into your script based CFC or inject it like a service via your favorite dependency injection tool. This is the route I took for <a href="http://groups.adobe.com">Adobe Groups</a> and file uploads. I wrote Adobe Groups when CF9 was released. I had a few services that needed file operations, like uploading processing, so I simply wrote one tag based CFC to handle all file operations. It was a simple utility component that other services (fancy script based ones) could easily make use of. This wouldn't be necessary in 901. 

<p>

Another route is to go the component route. Consider that cffeed was added in 901 as a component and not a new function. Unlike WDDX support, RSS parsing is somewhat more complex. Therefore it makes since to have a CFC/object based type approach to handle it. I helped write this component for Adobe. The code in that folder is all unencrypted and follows a standard style that you could mimic yourself. That's exactly what I did. I looked at Adobe's code for the other CFCs, wrote the feed support, and just stored it in the same directory. This gave me feed support in CF9. When 901 was released, I just removed my version. 

<p>

Finally - don't forget you can file an <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html">enhancement request</a> for things like this (script based version of cfwddx). If Adobe doesn't know that this is important to you, it won't be very high on their list of things to work on. The more you document, and <b>vote</b>, the easier it gets for Adobe to prioritize development.
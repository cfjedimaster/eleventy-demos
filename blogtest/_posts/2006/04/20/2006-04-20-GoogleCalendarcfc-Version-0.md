---
layout: post
title: "GoogleCalendar.cfc Version 0"
date: "2006-04-20T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/20/GoogleCalendarcfc-Version-0
guid: 1226
---

I've attached to this entry the first version of the GoogleCalendar.cfc. There is no documentation yet so use at your own risk. What it does:

<ul>
<li>ReadEntries will return a query of events. Most of the columns should be obvious.
<li>ReadMeta returns the meta information about the calendar. What you care about is the title field.
<li>XML is cached so a HTTP call is only done once. I may also add caching of the entry data since it doesn't make sense to parse it N times.
</ul>

What it does not yet do:

<ul>
<li>Translate times to the right timezone. To make this work, I think I'm going to require folks to send to ReadEntries their GMT offset. 
<li>Translate recurrence. This will be done, and will be sweet. It's going to be a nice string like "Daily", "Yearly", etc.
<li>Add entries.
<li>Simple way to force a refresh of the cache. 
</ul>

I've included a test script that read US Holidays. Very, very important note. The Google Calendar API lets you tweak how much data is returned. The default URL for your private calendar ends in "basic". You must change this to "full". Look at my test script for an example. I may end up making a basic check for this so folks don't forget.

Here is an example of how the API is used:

<code>
&lt;cfapplication name="gCal"&gt;

&lt;cfset reload = true&gt;
&lt;cfif not structKeyExists(application, "gCal") or reload&gt;
	&lt;cfset application.gCal = createObject("component", "GoogleCalendar").init("long as heck url here/full")&gt;
&lt;/cfif&gt;

&lt;cfset r = application.gCal.readEntries()&gt;
&lt;cfdump var="#r#"&gt;

&lt;cfset m = application.gCal.readMeta()&gt;
&lt;cfdump var="#m#"&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fgcal%2Ezip'>Download attached file.</a></p>
---
layout: post
title: "Google Calendar API Released"
date: "2006-04-20T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/20/Google-Calendar-API-Released
guid: 1224
---

The <a href="http://code.google.com/apis/gdata/calendar.html">API</a> for Google Calendar has been released, and after a quick initial skimming of the document, I think a CFC could be built to interact with the system. I'm going to start work on a simple reader for now to allow for something like this:

<code>
&lt;cfset gCal = createObject("component", "GoogleCalendar").init("your private url goes here")&gt;
&lt;!--- get entries returns all. Now says only after now ---&gt;
&lt;cfset entries = getCal.getEntries(now())&gt;
&lt;cfloop query="entries"&gt;
etc
&lt;/cfloop&gt;
</code>

Once reading is done then I'll start work on writing as well. This could be an excellent way to integrate a web site with Google calendar. Imagine allowing folks to request meetings by simply adding a form to your site.
---
layout: post
title: "Determining the location of ColdFusion's log files"
date: "2009-02-11T22:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/11/Determining-the-location-of-ColdFusions-log-files
guid: 3234
---

This was asked on cf-talk yesterday but figured it would be a good tip to share here. Is there a way - via code - to determine the location of ColdFusion log files? Yes, via the Admin API:

<code>
&lt;cfscript&gt;
adminObj = createObject("component","cfide.adminapi.administrator");
adminObj.login("admin");

debugger = createObject("component", "cfide.adminapi.debugging");
logfolder = debugger.getLogProperty("logdirectory");
&lt;/cfscript&gt;
&lt;cfoutput&gt;#logfolder#&lt;/cfoutput&gt;
</code>

The first two lines create an instance of the Administrator API CFC and logs in with my password. (And no, 'admin' isn't really my password. It's password.)

The next two lines use the debugging CFC to run getLogProperty("logdirectory"), which as you can guess, gets the log directory value.
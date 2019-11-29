---
layout: post
title: "Application Report - ColdFusion Admin Extension example"
date: "2011-08-15T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/15/Application-Report-ColdFusion-Admin-Extension-example
guid: 4329
---

I was having a discussion on a private list when David McGuigan came up with a very interesting idea. What he proposed is <i>very</i> cool and much more than what I'm going to demo here, but I thought a simple proof of concept might be of interest. The core of his idea involved a ColdFusion Administrator tool that would give a live report of running applications. This tool would provide a wealth of data and features, but I thought I'd quickly write up a proof of concept for something a bit simpler. In this example I'll demonstrate how to make use of the Admin API, and specifically the Server Monitor API, to create such a report.

<p/>
<!--more-->
I wrote my proof of concept within the CF Admin folder which allows me to run all API commands without needing to login. So for example:

<p/>

<code>
&lt;cfset sm = createObject("component", "CFIDE.adminapi.servermonitoring")&gt;

&lt;!---
Figure out what we have enabled.
---&gt;
&lt;cfset settings = sm.getMonitorSettings()&gt;

&lt;!--- 
Get all the active apps as keys, the func below also returns the ram use if we've enabled it.
---&gt;
&lt;cfset appScopeMemory = sm.getAllApplicationScopesMemoryUsed()&gt;
</code>

<p>

The variable appScopeMemory returned a structure of active applications, including an empty one, so I create a list after removing the blank key.

<p>

<code>
&lt;!--- we have a blank scope to remove ---&gt;
&lt;cfset structDelete(appScopeMemory, "")&gt;
&lt;cfset activeApps = listSort(structKeyList(appScopeMemory), "textnocase")&gt;
</code>

<p>

Once I have the list of applications, I loop through it and run a few calls. For this simple proof of concept I just focus on the application and session scope usage.

<p>

<code>
&lt;cfloop index="app" list="#activeApps#"&gt;
	&lt;cfset sessions = sm.getActiveSessions(app)&gt;
	&lt;cfset appvars = sm.getApplicationScopeMemoryUsed(app)&gt;

	&lt;cfoutput&gt;
	&lt;div class="appBlock"&gt;
	&lt;h2&gt;#app#&lt;/h2&gt;
	
	&lt;cfif settings.memoryMonitoringEnabled&gt;
	Application scope usage: #numberFormat(getTotalAppMemoryUsage(appvars))#&lt;br/&gt;
	&lt;/cfif&gt;
	Application Variables:
	&lt;cfdump var="#appvars#" expand="false" label="Application Vars"&gt;
	&lt;cfif settings.memoryMonitoringEnabled&gt;
	Session scope usage: #numberFormat(getTotalSessionMemoryUsageForApp(sessions))#&lt;br/&gt;
	&lt;/cfif&gt;
	Active Session Count: #sm.getActiveSessionCount(app)#&lt;br/&gt;
	&lt;cfdump var="#sessions#" expand="false" label="Sessions"&gt;

	&lt;/div&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p>

Here's an example of the result:

<p>

<a href="http://www.raymondcamden.com/images/ScreenClip154.png"><img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip_small.png" /></a>

<p>

I was going to spend more time to properly format the dumps... but meh. It's a proof of concept and it serves the purpose. You can click to expand and see all the application variables and active sessions.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip155.png" />

<p>

If you want to play with this code yourself, grab the download below. If you haven't played yet with ColdFusion Admin extensions, take a look at my <a href="http://www.coldfusionjedi.com/page.cfm/Guide-to-ColdFusion-Administrator-Extensions">guide</a>.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fapps%{% endraw %}2Ezip'>Download attached file.</a></p>
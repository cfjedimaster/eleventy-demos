---
layout: post
title: "ServerMonitor API Example"
date: "2007-12-06T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/06/ServerMonitor-API-Example
guid: 2519
---

Back in June I wrote a quick <a href="http://www.raymondcamden.com/index.cfm/2007/6/14/ColdFusion-8-Server-Monitor-API">blog entry</a> on using the Server Monitor API. Most folks don't know that the cool Server Monitor in ColdFusion 8 is all driven by an underlying CFC API you can use in your own applications. I wrote up a quick demo of this I thought folks might find interesting.
<!--more-->
One of the API calls you can make is getRequestDetails. This returns a (possibly) large array of data about each and every single request your site has served up. Requests are organized into array items by template. You get quite a bit of information. The last time the request was made. How many times it erred. When the last error occurred. The last, average, min, and max request times. Etc. With this in mind I wrote up a file that would grab all requests that were last run in the past 3 minutes. My server is busy so this gave a good result set. You may have to tweak that number for your own box. Here is the code:

<code>
&lt;cfset password = "parishiltonismylostlovechild"&gt;
&lt;cfinvoke component="CFIDE.adminapi.administrator" method="login" adminpassword="#password#" returnVariable="result"&gt;

&lt;cfif not result&gt;
	&lt;cfabort /&gt;
&lt;/cfif&gt;

&lt;cfinvoke component="CFIDE.adminapi.servermonitoring" method="getRequestDetails" returnVariable="areq"&gt;
&lt;cfset data = queryNew("template,function,timeran,lastresponsetime,avgtime,hitcount,errorcount,lasterror,lasterrorat","varchar,varchar,date,integer,integer,integer,integer,varchar,date")&gt;
&lt;cfloop index="req" array="#areq#"&gt;
	&lt;!--- only use if within past 3 mins ---&gt;
	&lt;cfif dateDiff("n", req.lasttimeexecuted, now()) lte 3&gt;
		&lt;cfset queryAddRow(data)&gt;
		&lt;cfset querySetCell(data, "template", replace(req.templatepath,"\","/","all"))&gt;
		&lt;cfset querySetCell(data, "function", req.functionname)&gt;
		&lt;cfset querySetCell(data, "timeran", req.lasttimeexecuted)&gt;
		&lt;cfset querySetCell(data, "lastresponsetime", req.lastresponsetime)&gt;
		&lt;cfset querySetCell(data, "avgtime", req.avgtime)&gt;
		&lt;cfset querySetCell(data, "hitcount", req.hitcount)&gt;
		&lt;cfset querySetCell(data, "errorcount", req.errorcount)&gt;
		&lt;cfset querySetCell(data, "lasterror", req.lasterror)&gt;
		&lt;cfset querySetCell(data, "lasterrorat", req.lasterrorat)&gt;		
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

I begin by authenticating with the adminapi using my ColdFusion Administrator password. Then I call the ServerMonitor CFC. The result is an array, so I loop over it, and for each item, I check the date of the last hit. If within the last three minutes, I take out some of the values and stuff them into a query. (I'll explain the replace function in a minute.)

Next I sort the items by time:

<code>
&lt;!--- sort by time ---&gt;
&lt;cfquery name="data" dbtype="query"&gt;
select	*
from	data
order by timeran desc
&lt;/cfquery&gt;
</code>

And then I pass to a cool HTML grid:

<code>
&lt;cfform name="throwaway"&gt;
	&lt;cfgrid format="html" query="data" name="requests" width="100%"&gt;
		&lt;cfgridcolumn name="template" header="Name" width="400"&gt;
		&lt;cfgridcolumn name="lastresponsetime" header="Last Response Time" width="200"&gt;
		&lt;cfgridcolumn name="avgtime" header="Avg Response Time" width="200"&gt;
		&lt;cfgridcolumn name="hitcount" header="Times Ran"&gt;
		&lt;cfgridcolumn name="errorcount" header="Error Count"&gt;
		&lt;cfgridcolumn name="lasterror" header="Last Error" width="400"&gt;
		&lt;cfgridcolumn name="lasterrorat" header="Last Error Occured" width="200"&gt;
	&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

Here is a screen shot. Click for a large version. I hid my physical paths:


<a href="http://www.coldfusionjedi.com/images/1206.png">
<img src="https://static.raymondcamden.com/images/cfjedi/1206small.png"></a>

The reason for the replace is to handle the bug I <a href="http://www.coldfusionjedi.com/index.cfm/2007/12/3/Interesting-display-bug-with-CF8-HTML-Grid">blogged</a> about a few days ago. 

Tomorrow I'll demonstrate another example of using the API. Enjoy.
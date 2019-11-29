---
layout: post
title: "ColdFusion 8: Server Monitor API"
date: "2007-06-15T01:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/15/ColdFusion-8-Server-Monitor-API
guid: 2124
---

In an <a href="http://www.raymondcamden.com/index.cfm/2007/6/7/ColdFusion-8-Admin-API-and-Trusted-Cache">earlier post</a> I talked a bit about how the Admin API has been updated in ColdFusion 8. For folks who don't know what this is - it is a way to get into the internals of ColdFusion directly from CFML. It requires the ColdFusion Admin password, which may be a negative for some, but if you have access to it, you can do quite a bit. As an example, I could build an installer for BlogCFC that would prompt the user for the CF Admin password and then handle creating the datasource for you. So it's cool. We know that. But how cool is it in ColdFusion 8?
<!--more-->
Well you know that server monitor that ships with the product? If you haven't seen it, you need to spend some time with it. I spent 5 minutes running it with BlogCFC and saw immediate, serious performance issues I was able to correct. 5 minutes to improve my application in a dramatic way is worth the cost of ColdFusion 8 right there. But did you know that 100% of what you see in the Flex application is available to you via code? 

Added to the Admin API is a new CFC, the Server Monitoring CFC.  This CFC gives you access to everything you see in the Flex app, and maybe a bit more. Now it is important to note that each method has different requirements for server monitoring. Some require that memory tracking is turned on. Some require nothing. Some return data but will return more data if memory tracking is on. You should read the docs carefully to see what each method requires.

What follows is a <b>short</b> list of <b>some</b> of what is available...

<b>Get Active Session Count</b>

This lets you get the total number of active sessions for the server - or you can supply a ColdFusion Application name and get the number just for that application.

<b>Get Average Response Time</b>

This is a great metric. It tells you - on average - how quickly your templates are responding.

<b>Get Heartbeat</b>

This returns a structure of general information. This includes a variety of items like server up time, average request time, current requests, etc. 

<b>Get Memory Utilization Summary</b>

As you can guess - this returns information about your memory usage. It tells you how much data your Application, Server, and Session scope data is using. 

<b>Get Hit Count Stats</b>

Now this one is truly cool. Along with telling you how many normal template hits you have - it can tell you the number of web service hits - the number of Flash Remoting hits - even the number of direct HTTP hits to your CFCs. 

<b>Get Logged In User Count</b>

Returns the number of users logged in via CFLOGINUSER.

<b>Get All Application Scope Memory Used</b>

This returns all your applications and the amount of RAM they are using. Have a machine that is running a bit slow? Run this and it will tell you if one application in particular is being a bad boy. You can follow it up with <b>getApplicationScopeMemoryUsed</b> which returns specific data about one particular application.

Cool stuff, eh? It is important to note that using these features will have an impact on your server performance. I had a demo online, but I could really tell the impact of the monitoring so I turned it off. But if you want to see the code I used (with a different Admin password of course, I trust <i>some</i> of you guys... ;), look here: 

<code>
&lt;cfinvoke component="cfide.adminapi.administrator" method="login" adminPassword="mypasswordcanbeatupyourpassword"&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getActiveSessionCount" returnVariable="result"&gt;

Total session count = &lt;cfdump var="#result#"&gt;

&lt;p&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getActiveSessionCount" returnVariable="result" cfapplicationname="lighthousepro"&gt;

For app lighthousepro = &lt;cfdump var="#result#"&gt;

&lt;p&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getAverageResponseTime" returnVariable="result"&gt;

&lt;cfoutput&gt;Average response time is #result#&lt;/cfoutput&gt;

&lt;p&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getHeartbeat" returnVariable="result"&gt;
&lt;cfdump var="#result#" label="Heart Beat"&gt;

&lt;p&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getMemoryUtilizationSummary" returnVariable="result"&gt;
&lt;cfdump var="#result#" label="Memory Utilization"&gt;

&lt;p&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getHitCountStats" returnVariable="result"&gt;
&lt;cfdump var="#result#" label="Hit Count Stats"&gt;

&lt;p&gt;

&lt;cfinvoke component="cfide.adminapi.servermonitoring" method="getLoggedInUserCount" returnVariable="result"&gt;

Logged in users = &lt;cfdump var="#result#"&gt;

&lt;p&gt;
</code>
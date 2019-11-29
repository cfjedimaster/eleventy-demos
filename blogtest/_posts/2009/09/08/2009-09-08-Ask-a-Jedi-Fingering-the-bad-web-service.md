---
layout: post
title: "Ask a Jedi: Fingering the bad web service"
date: "2009-09-08T22:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/08/Ask-a-Jedi-Fingering-the-bad-web-service
guid: 3517
---

James asks:

<blockquote>
I am currently trying to solve a problem  where our third party vendor's web services are very slow, our pages that invoke the web services are appearing in our log files as slow files.
<br/><br/>
What would be the best way to capture slow response time, to prove that it's not us that is causing the slow pages? I hear ColdFusion 8's monitor adds a significant performance hit, so I was thinking there might be a better way.
<br/><br/>
My thoughts are
<br/><br/>
1) Get the time before and after the web service invocation then figure out the difference then log the time. OR
<br/><br/>
2)      Place a try/catch around the invocation and set a timeout, if the timeout has exceeded then log it and try again without the timeout OR
<br/><br/>
3)      Apache log files???
</blockquote>

I think you have a few good suggestions already, so let's look at them.
<!--more-->
Your first idea is probably the best. I whipped up a quick web service that had this simple method in it:

<code>
&lt;cffunction name="slowascrap" access="remote" returnType="string"&gt;
	&lt;cfset sleep(6000)&gt;
	&lt;cfreturn now()&gt;
&lt;/cffunction&gt;
</code>

I first created a template that wrapped the call to the web service with getTickCounts:

<code>
&lt;cfset ws = createObject("webservice", "http://localhost/test.cfc?wsdl")&gt;

&lt;cfset counter = getTickCount()&gt;
&lt;cfset res = ws.slowascrap()&gt;
&lt;cfset duration = getTickCount() - counter&gt;
&lt;cflog file="slowws" text="duration of web service call: #duration# ms"&gt;

&lt;cfoutput&gt;result is #res#&lt;/cfoutput&gt;
</code>

This will log the execution time of every call to the web service. If the time is consistently 6000+ ms and your page itself executes in 6100ms or so, then it is pretty evident that the web service is taking up the majority of your page execution time. 

Your second suggestion was a bit confusing. I'm not quite sure why you would set a time limit, but then <i>repeat</i> the call again. I assumed (and I could be wrong!) that you didn't really want to repeat it. Here is an example that gives the web service two seconds to run, and if it doesn't complete simply says that the service is not available.

<code>
&lt;cftry&gt;
	&lt;cfinvoke webservice="http://localhost/test.cfc?wsdl" method="slowascrap" returnvariable="res" timeout="2"&gt;
	&lt;cfoutput&gt;result is #res#&lt;/cfoutput&gt;
	&lt;cfcatch&gt;
	Service is not available.
	&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

Lastly - not quite sure what you would use the Apache log files for. Since the web service is a third party solution you can't check their files. My quick scan of the <a href="http://httpd.apache.org/docs/2.0/logs.html">Apache docs</a> for the access logs do not show a 'duration to generate' report. I would, however, recommend the ColdFusion Administrator setting to log slow pages. This is found in the Logging Settings page.
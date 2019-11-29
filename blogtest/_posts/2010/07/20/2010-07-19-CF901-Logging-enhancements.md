---
layout: post
title: "CF901: Logging enhancements"
date: "2010-07-20T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/20/CF901-Logging-enhancements
guid: 3884
---

In the ColdFusion 901 <a href="http://www.adobe.com/support/documentation/en/coldfusion/901/cf901features.pdf">new features guide (pdf)</a>, there are mention of two logging updates. The first concerns log files for "services", and the second is the ability to enable or disable logging "for a particular log type". Those descriptions are about as vague as you can get so I thought a blog entry might help clear things up.
<!--more-->
<p>
Let's begin by talking about the new service level logs. These logs cover: cfhttp, cfftp, web services, cffeed, portlets, and Derby (the embedded database used in ColdFusion for demos as well as what we used for the ColdFusion Web Application Construction Kit). These logs will show up in your administrator once you actually use the feature. The network logs are probably the most interesting. I've had issues with not one, but two sites recently where a network call, a bad one, ended up really harming site performance. Being able to implicitly log these network calls is a really handy feature. Without having to actually write any cflog statements yourself - you get tracing and network data about how these calls run in your application. Let's take a look at them.
<p>

First let's look at the http.log. This monitors your cfhttp calls. Here is some sample output:
<p>

<code>
"Information","jrpp-160","07/20/10","06:47:50",,"Starting HTTP request {% raw %}{URL='http://localhost:80/ows/58/dopostrequest.cfm?url_test=This%{% endraw %}20is{% raw %}%20a%{% endraw %}20URL{% raw %}%20variable%{% endraw %}2E', method='POST'}"
"Information","jrpp-160","07/20/10","06:47:50",,"HTTP request completed  {% raw %}{Status Code=200 ,Time taken=543 ms}{% endraw %}"
"Information","jrpp-154","07/20/10","06:48:35",,"Starting HTTP request {% raw %}{URL='http://www.raymondcamden.com', method='get'}{% endraw %}"
"Information","jrpp-154","07/20/10","06:48:35",,"HTTP request completed  {% raw %}{Status Code=200 ,Time taken=235 ms}{% endraw %}"
"Information","jrpp-152","07/20/10","06:48:47",,"Starting HTTP request {% raw %}{URL='http://localhost:80/ows/58/authors.txt', method='GET'}{% endraw %}"
"Information","jrpp-152","07/20/10","06:48:47",,"HTTP request completed  {% raw %}{Status Code=200 ,Time taken=63 ms}{% endraw %}"
</code>

<p>

As you can see, this log shows both the beginning and end of the request. I get the URL requested and the method, as well as the result and time taken. This log is probably the most useful of the bunch. 

<p>

Now let's look at feed.log. As you can guess, this works with the cffeed tag.

<p>

<code>

"Information","jrpp-136","07/20/10","06:26:21",,"Reading FEED {% raw %}{source='http://feeds.feedburner.com/RaymondCamdensColdfusionBlog'}{% endraw %}"
"Information","jrpp-136","07/20/10","06:26:21",,"FEED reading completed {% raw %}{Time taken=722 ms}{% endraw %}"
"Information","jrpp-128","07/20/10","06:27:09",,"Reading FEED {% raw %}{source='http://blogs.adobe.com/osmf/atom.xml'}{% endraw %}"
"Information","jrpp-128","07/20/10","06:27:10",,"FEED reading completed {% raw %}{Time taken=555 ms}{% endraw %}"
"Information","jrpp-128","07/20/10","06:27:10",,"Reading FEED {% raw %}{source='http://feeds.feedburner.com/RaymondCamdensColdfusionBlog'}{% endraw %}"
"Information","jrpp-128","07/20/10","06:27:10",,"FEED reading completed {% raw %}{Time taken=211 ms}{% endraw %}"
"Information","jrpp-128","07/20/10","06:27:22",,"Generating rss FEED"
"Information","jrpp-128","07/20/10","06:27:22",,"FEED generation completed {% raw %}{Time taken=16 ms}{% endraw %}"
"Information","jrpp-124","07/20/10","06:27:39",,"Generating rss FEED"
"Information","jrpp-124","07/20/10","06:27:39",,"FEED generation completed {% raw %}{Time taken=12 ms}{% endraw %}"
</code>

<p>

This log will cover both reading and creating feeds. For creating I don't think the data is that useful. All you get is the time taken. For reading you get the URL and time taken. I wish it would also log the HTTP status code like the http log. 

<p>

Next up is the FTP log, and as you can guess, it covers cfftp. Here is some sample data.

<p>

<code>

"Information","jrpp-142","07/20/10","06:30:25",,"Starting FTP request {% raw %}{action='open'}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:27",,"FTP request completed {% raw %}{Time taken=1387 ms}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:27",,"Starting FTP request {% raw %}{action='changeDir'}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:27",,"FTP request completed {% raw %}{Time taken=124 ms}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:27",,"Starting FTP request {% raw %}{action='getCurrentDir'}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:27",,"FTP request completed {% raw %}{Time taken=95 ms}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:27",,"Starting FTP request {% raw %}{action='ListDir'}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:29",,"FTP request completed {% raw %}{Time taken=2042 ms}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:29",,"Starting FTP request {% raw %}{action='close'}{% endraw %}"
"Information","jrpp-142","07/20/10","06:30:29",,"FTP request completed {% raw %}{Time taken=162 ms}{% endraw %}"
</code>

<p>

In this log we get both the FTP action requested as well as the amount of time taken. I'd like to see perhaps the amount of data transferred. Outside of that, I guess the timings are enough data to give you some basic performance metrics. (Personally I've never used cfftp in a production application - have you?)

<p>

Now let's talk about the web service log. This feature has a bug in that it only logs web services calls made via cfinvoke. If you create an instance of the web service using createObject, then your method calls are not logged. Oddly, the log also seems to imply the proxy is created for every request, which should <i>not</i> be the case. Anyway, here is a sample.

<p>

<code>

"Information","jrpp-144","07/20/10","06:40:44",,"Starting Web service request."
"Information","jrpp-144","07/20/10","06:40:44",,"Creating Web service proxy {% raw %}{url='http://localhost:80/ows/59/NumericString.cfc?wsdl'}{% endraw %}"
"Information","jrpp-144","07/20/10","06:40:44",,"Web service request completed {% raw %}{Time taken=40 ms}{% endraw %}"
"Information","jrpp-154","07/20/10","06:40:49",,"Starting Web service request."
"Information","jrpp-154","07/20/10","06:40:49",,"Creating Web service proxy {% raw %}{url='http://localhost:80/ows/59/NumericString.cfc?wsdl'}{% endraw %}"
"Information","jrpp-154","07/20/10","06:40:49",,"Web service request completed {% raw %}{Time taken=15 ms}{% endraw %}"
</code>

Once again - all you see is the WSDL URL and the time taken. Why not log the method as well?

<p>

So that leaves the Derby and Portlet system logs. I've yet to do anything with portlets so I can't really comment on that. The Derby log unfortunately didn't seem to do anything. I ran a few queries against a Derby database (via cfquery of course), and it noticed the first call, but didn't log anything interesting. This is the entirety of my log:

<p>

<code>

----------------------------------------------------------------
2010-07-20 12:10:48.510 GMT:
 Booting Derby version The Apache Software Foundation - Apache Derby - 10.5.3.0 - (802917): instance a816c00e-0129-efc3-6900-ffff9ac3cef9
on database directory /Users/ray/Documents/ColdFusion/CFWACK 8/ows  

Database Class Loader started - derby.database.classpath=''
</code>

<p>

Notice too that it is not in the "standard" ColdFusion log setting. I've asked for more details about this log and will post back later what I find.

<p>

So now let's talk about that second enhancement - the ability to disable/enable logging for a "particular log type". So what type of log file do they mean? I thought I knew the answer. I was wrong. 

<p>

Initially I thought they only meant the service level logs described above. Those logs definitely are ones you can stop. However, I was also able to stop: eventgateway.log, mail.log, mailsent.log, and monitor.log. The Administrator Log View will display a little stop sign by these logs. Clicking on it results in disabling the logging. Here is a screen shot:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-20 at 7.13.29 AM.png" title="Log Files" />

<p>

Unfortunately, notice how there are stop signs next to my custom log. Due to a bug in the admin code, the listing places stop signs next to those logs. You can click it all you want, but it will not stop the any custom cflog command you have. Basically just do your best to ignore it. The same applies to cfserver.log as well. You have the stop sign - but you can't really stop the logging there.

<p>

So - all in all - an interesting change. As I mentioned above, I've had two sites come down hard due to networking issues (external networking I mean, one with cffeed and one with cfhttp), so I think this type of logging is great, but it needs a bit of polish to get really useful in future versions.
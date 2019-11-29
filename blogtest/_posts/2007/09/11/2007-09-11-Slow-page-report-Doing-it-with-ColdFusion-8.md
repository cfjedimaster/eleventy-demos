---
layout: post
title: "Slow page report - Doing it with ColdFusion 8"
date: "2007-09-11T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/11/Slow-page-report-Doing-it-with-ColdFusion-8
guid: 2337
---

Many moons ago, I <a href="http://www.raymondcamden.com/index.cfm?mode=entry&entry=E1C4D4BE-AF44-3997-E6F1C507CE21DF5B">reported</a> on how you could write a template to parse your server.log file for slow page reports. In case you didn't know - the ColdFusion Administrator lets you log files that take too long to process. This setting is found in the Logging Settings page as seen in the following screen shot:

<img src="https://static.raymondcamden.com/images/cfjedi/slowstuffsucks.png">

Once enabled, ColdFusion will log any page that takes longer than the specified time. Note that it won't abort the process, it will just log it. If you want to abort a process, you need to use the Timeout Requests setting in the main settings page.

So if you read the <a href="http://www.coldfusionjedi.com/index.cfm?mode=entry&entry=E1C4D4BE-AF44-3997-E6F1C507CE21DF5B">old blog entry</a>, you will note that I hard coded the file name, hard coded the timeout value, and used a loop over a hard coded end of line delimiter. This all becomes quite a bit easier in ColdFusion 8. (But to be fair, some of what I've changed could have been done in CF7 as well.)

First off - there are two ways you can find your server.log file. The best way, if you know your CF Admin password, is via the CF Admin API:

<code>
&lt;cfinvoke component="cfide.adminapi.administrator" method="login" 
		adminPassword="admin" adminUserId="admin"&gt;

&lt;cfinvoke component="cfide.adminapi.debugging" method="getLogProperty" propertyName="logdirectory" returnvariable="logdir"&gt;
</code>

If you don't have access to the CF Admin, you can still make a very good guess. The ColdFusion Server variable, rootdir, points to where CF was installed, but note that it is possible to change where CF stores it's log files. Here is the alternate version:

<code>
&lt;cfset logdir = server.coldfusion.rootdir & "/logs/"&gt;
</code>

Now lets complete the filename and ensure it even exists:

<code>
&lt;cfset filename = logdir & "/server.log"&gt;

&lt;cfif not fileExists(filename)&gt;
	&lt;cfoutput&gt;
	Can't find #filename#
	&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

So far so good. Now we need to read in the file and begin storing our data for the report.

<code>
&lt;cfset fileData = structNew()&gt;
&lt;cfloop file="#filename#" index="line"&gt;
   &lt;cfif findNoCase("second warning limit", line)&gt;
      &lt;cfset template   = rereplace(line, ".*?processing template: (.*?), completed.*", "\1")&gt;
      &lt;cfset time = rereplace(line, ".*?completed in ([0-9,]*?) seconds,.*", "\1")&gt;
      &lt;cfset time = replace(time, ",", "", "all")&gt;
      &lt;cfif not structKeyExists(fileData, template)&gt;
         &lt;cfset fileData[template] = structNew()&gt;
         &lt;cfset fileData[template].hitCount = 0&gt;
         &lt;cfset fileData[template].total = 0&gt;
         &lt;cfset fileData[template].max = 0&gt;
      &lt;/cfif&gt;
      &lt;cfset fileData[template].hitCount = fileData[template].hitCount + 1&gt;
      &lt;cfset fileData[template].total = fileData[template].total + time&gt;
      &lt;cfif time gt fileData[template].max&gt;
         &lt;cfset fileData[template].max = time&gt;
      &lt;/cfif&gt;
   &lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

A lot of the code above is the same as the previous version, but do note the new cfloop:

<code>
&lt;cfloop file="#filename#" index="line"&gt;
</code>

That's it! The complete code listing is below. I removed the cfdocument tags so I could see the result in HTML. I'd show you a sample output, but unfortunately my pages run so fast that they complete in negative time. (Ahem.)

<code>
&lt;cfinvoke component="cfide.adminapi.administrator" method="login" 
		adminPassword="admin" adminUserId="admin"&gt;

&lt;cfinvoke component="cfide.adminapi.debugging" method="getLogProperty" propertyName="logdirectory" returnvariable="logdir"&gt;

&lt;!---
&lt;cfset logdir = server.coldfusion.rootdir & "/logs/"&gt;
---&gt;

&lt;cfset filename = logdir & "/server.log"&gt;

&lt;cfif not fileExists(filename)&gt;
	&lt;cfoutput&gt;
	Can't find #filename#
	&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfset fileData = structNew()&gt;
&lt;cfloop file="#filename#" index="line"&gt;
   &lt;cfif findNoCase("second warning limit", line)&gt;
      &lt;cfset template   = rereplace(line, ".*?processing template: (.*?), completed.*", "\1")&gt;
      &lt;cfset time = rereplace(line, ".*?completed in ([0-9,]*?) seconds,.*", "\1")&gt;
      &lt;cfset time = replace(time, ",", "", "all")&gt;
      &lt;cfif not structKeyExists(fileData, template)&gt;
         &lt;cfset fileData[template] = structNew()&gt;
         &lt;cfset fileData[template].hitCount = 0&gt;
         &lt;cfset fileData[template].total = 0&gt;
         &lt;cfset fileData[template].max = 0&gt;
      &lt;/cfif&gt;
      &lt;cfset fileData[template].hitCount = fileData[template].hitCount + 1&gt;
      &lt;cfset fileData[template].total = fileData[template].total + time&gt;
      &lt;cfif time gt fileData[template].max&gt;
         &lt;cfset fileData[template].max = time&gt;
      &lt;/cfif&gt;
   &lt;/cfif&gt;
&lt;/cfloop&gt;


&lt;cfoutput&gt;&lt;h2&gt;#structCount(fileData)# Total File&lt;/h2&gt;&lt;/cfoutput&gt;

&lt;table width="100%" cellpadding="10" border="1"&gt;
   &lt;tr&gt;
      &lt;th&gt;Template&lt;/th&gt;
      &lt;th&gt;Times in Log&lt;/th&gt;
      &lt;th&gt;Avg Execution Time&lt;/th&gt;
      &lt;th&gt;Max Execution Time&lt;/th&gt;
   &lt;/tr&gt;
&lt;cfloop item="temp" collection="#fileData#"&gt;
   &lt;cfset average = fileData[temp].total / fileData[temp].hitcount&gt;
   &lt;cfif average gt 200&gt;
      &lt;cfset style = "color: red"&gt;
   &lt;cfelse&gt;
      &lt;cfset style = ""&gt;
   &lt;/cfif&gt;
   &lt;cfoutput&gt;
   &lt;tr style="#style#"&gt;
   &lt;td&gt;&lt;b&gt;#temp#&lt;/b&gt;&lt;/td&gt;
   &lt;td&gt;#fileData[temp].hitCount#&lt;/td&gt;
   &lt;td&gt;#numberFormat(average,"9.99")#&lt;/td&gt;
   &lt;td&gt;#fileData[temp].max#&lt;/td&gt;
   &lt;/tr&gt;
   &lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/table&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffindslow%{% endraw %}2Ecfm%2Ezip'>Download attached file.</a></p>
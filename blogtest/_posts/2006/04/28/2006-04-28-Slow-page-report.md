---
layout: post
title: "Slow page report"
date: "2006-04-28T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/28/Slow-page-report
guid: 1237
---

I was working with a client this week who had quite a few entries for slow pages in his server.log file. I decided to see if I could write a quick report based on the log and came up with the following. Ignore the butt-ugly HTML I used:
<!--more-->
<code>
&lt;cfset filename = "C:\Documents and Settings\Raymond Camden\Desktop\doc\server.log"&gt;
&lt;cffile action="read" file="#filename#" variable="buffer"&gt;

&lt;cfset fileData = structNew()&gt;
&lt;cfloop index="line" list="#buffer#" delimiters="#chr(10)#"&gt;
	&lt;cfif findNoCase("exceeding the 45 second warning limit", line)&gt;
		&lt;cfset template	= rereplace(line, ".*?processing template: (.*?), completed.*", "\1")&gt;
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


&lt;cfdocument format="pdf"&gt;
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
&lt;/cfdocument&gt;
</code>

Obviously the hard coded file name would need to be changed, and it is going to be super slow on a large file. All I'm doing is sucking in the file and using some regex on the lines. One very important note. Notice this line:

<code>
&lt;cfif findNoCase("exceeding the 45 second warning limit", line)&gt;
</code>

Notice the use of 45. That was the setting on his server. You could probably get away with just looking for "second warning limit", or you could switch to a reFindNoCase and replace the 45 with [0-9]+. 

Either way, run this and you get a nice report of the files that were logged as being slow. Files taking more than 200 ms on average will be flagged. You could also switch the structure to a query, do QofQ, and then sort by most slowest page.

<a href="http://ray.camdenfamily.com/projects/starfish">Starfish</a> has data like this, but only works on currently executing code, while this code will work on your log file. I've pinged Scott to see if this could be added to his uber cool <a href="http://util.boyzoid.com:816/logreader">Flex-based log reader</a> application.
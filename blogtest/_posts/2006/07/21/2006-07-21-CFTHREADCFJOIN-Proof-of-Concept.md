---
layout: post
title: "CFTHREAD/CFJOIN Proof of Concept"
date: "2006-07-21T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/21/CFTHREADCFJOIN-Proof-of-Concept
guid: 1419
---

Damon Cooper of Adobe has <a href="http://www.dcooper.org/blog/client/index.cfm?mode=entry&entry=916FEFD9-4E22-1671-57A23859C50FFF47">posted</a> a proof of concept for two new tags for the ColdFusion language: CFTHREAD and CFJOIN. These tags let you fire off events and simply forget about them. Right now there is an issue where you can't "completely" forget about them, but you can still run a large set of events asynchronously. Consider this example:
<!--more-->
<code>
&lt;cfif not isDefined("url.slow")&gt;
	&lt;cfset good = true&gt;
&lt;cfelse&gt;
	&lt;cfset good = false&gt;
&lt;/cfif&gt;

&lt;cfhttp url="http://ray.camdenfamily.com/rss.cfm" result="result"&gt;
&lt;cfset myrss = result.filecontent&gt;
&lt;cfset myrssParsed = xmlParse(myrss)&gt;
&lt;cfset myurls = xmlSearch(myrssParsed, "/rss/channel/item/link/text()")&gt;
&lt;cfset links = arrayNew(1)&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(myurls)#"&gt;
	&lt;cfset arrayAppend(links, myurls[x].xmlvalue)&gt;
&lt;/cfloop&gt;

&lt;cfif good&gt;

	&lt;cfloop index="loopcounter" from="1" to="#arrayLen(links)#"&gt; 
		&lt;cfset threadname = "thread_" & loopcounter&gt;
	
		&lt;cfthread name="#threadname#"&gt;
			
			&lt;cfhttp url="#links[loopcounter]#" result="result"&gt;
			&lt;cffile action="write" file="c:\web\url#loopcounter#.txt" output="#result.filecontent#"&gt;
			
		&lt;/cfthread&gt;
	
	&lt;/cfloop&gt;
	
	&lt;cfloop index="loopcounter" from="1" to="#arrayLen(links)#"&gt; 
		&lt;cfset threadname = "thread_" & loopcounter&gt;
		&lt;cfjoin thread="#threadname#"&gt;
	&lt;/cfloop&gt;

&lt;cfelse&gt;

	&lt;cfloop index="loopcounter" from="1" to="#arrayLen(links)#"&gt; 
			&lt;cfhttp url="#links[loopcounter]#" result="result"&gt;
			&lt;cffile action="write" file="c:\web\url#loopcounter#.txt" output="#result.filecontent#"&gt;
			
	
	&lt;/cfloop&gt;
	
&lt;/cfif&gt;

&lt;br&gt;
Work Complete!&lt;br&gt;
</code>

What I've done is written two sets of code. One shows the use of cfthread/cfjoin, and one does not. The code downloads my RSS feed and gets an array of URLs. It then fetches each URL and saves it to a file. If you compare the "good" version versus the "bad" one (load the file with slow=true in the URL), you will see an incredible speed difference, and this is even with the bug. While the threads all run at the same time, you have to wait for the threads to end, whereas in the (hopefully) final version, you would not need to.
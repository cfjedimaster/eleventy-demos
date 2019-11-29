---
layout: post
title: "CFTHREAD - When to join?"
date: "2009-05-18T14:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/18/CFTHREAD-When-to-join
guid: 3359
---

Earlier today I wrote a quick blog entry (<a href="http://www.raymondcamden.com/index.cfm/2009/5/18/CFTHREAD-Names-and-Commas">CFTHREAD, Names, and Commas</a>) about a bug I had with cfthread names. I mentioned that commas were not allowed in the thread name and that - probably - this was due to the use of the JOIN action allowing for a list of thead names to join together. Tony asked me why someone would use the JOIN action at all.
<!--more-->
First off, what happens when you create a thread and don't do anything else?

<code>
&lt;cfthread name="find more cowbell"&gt;
	&lt;cfset sleep(10000)&gt;
	&lt;cflog file="tdemo" text="All done, baby."&gt;
&lt;/cfthread&gt;

&lt;cfdump var="#cfthread#"&gt;
</code>

In this demo I create a thread. It sleeps for 10 seconds and then writes to a log file. Outside of the thread I dump the cfthread scope. (Everyone knows that exists, right? It gives you metadata about threads created during the request.) Running this we can see that even though the page ended, the thread is still running:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 157.png">

If you check your log files a bit later, you will see that the thread eventually did end and write to the log. In essence, this process is a "Fire and Forget" thread. You start the slow process and don't need to worry about waiting for it to end. A real world example could be starting a slow running stored procedure that performs a database backup.

But what about cases where you <i>do</i> need to wait for a result? Imagine an RSS aggregator. You want to hit N RSS feeds and take each result and add it to a large query. (Oh, I've got a <a href="http://paragator.riaforge.org/">CFC</a> for that if you want something like that.) In this case, you want each thread to handle doing the slow process, but you want to wait for them all to finish before proceeding. 

Consider this modified example:

<code>
&lt;cfset threadlist = ""&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset name = "find more cowbell #x#"&gt;
	&lt;cfset threadlist = listAppend(threadlist, name)&gt;
	&lt;cfthread name="#name#"&gt;
		&lt;cfset sleep(10000)&gt;
		&lt;cflog file="tdemo" text="All done with #thread.name#, baby."&gt;
	&lt;/cfthread&gt;
&lt;/cfloop&gt;

&lt;cfthread action="join" name="#threadlist#" /&gt;
&lt;cfdump var="#cfthread#"&gt;
</code>

In this example, I've added a loop so that I can create 10 threads. Notice that I store the name in a list. This lets me run the join action at the end. Now if you run the file you will notice it takes 10 seconds to run. This represents the JOIN line waiting for the threads to end. Because they run in parallel, I don't have to wait 100 seconds, but just 10. Obviously most real world applications won't have a nice precise timeframe like that. Now if you look at the dump, you can see that they completed:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 234.png">

So the short answer is simply - it depends. If you need to work with the result in the same request, then use the join. If not, don't worry about it.
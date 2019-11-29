---
layout: post
title: "Using the CFTHREAD Scope"
date: "2007-07-27T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/27/Using-the-CFTHREAD-Scope
guid: 2224
---

Did you know that ColdFusion 8 has a new scope? The CFTHREAD scope is a special scope that contains information about threads in the current request. Consider this simple example:

<code>
&lt;cfset urls = "http://www.cnn.com,http://www.raymondcamden.com,http://www.yahoo.com"&gt;

&lt;cfset counter = 0&gt;
&lt;cfloop index="u" list="#urls#"&gt;
	&lt;cfset counter++ &gt;
	&lt;cfthread theurl="#u#" name="thread_#counter#"&gt;
		&lt;cfhttp url="#attributes.theurl#"&gt;
	&lt;/cfthread&gt;
&lt;/cfloop&gt;

&lt;cfdump var="#cfthread#"&gt; 
</code>

This code block creates 3 threads, named thread_1, thread_2, and thread_3. (I don't get paid to be creative!) Each thread created will exist as a structure inside the CFTHREAD scope as demonstrated in this screen shot:


<img src="https://static.raymondcamden.com/images/cfjedi/cfthread.png">

You will notice that not all of my threads are finished. That is because I didn't do a join on my threads. If you look at <a href="http://paragator.riaforge.org">Paragator</a>, my ColdFusion RSS Aggregator CFC, you will see I kept a list of all threads so that I could join them. I then used Evalute to create pointers to the data. This can be done a lot easier now. So for example, to join all threads:

<code>
&lt;cfthread action="join" name="#structKeyList(cfthread)#" /&gt;
</code>

And to get access to a thread's data:

<code>
&lt;cfdump var="#cfthread[somethreadname]#"&gt;
</code>

I'll be updating Paragator a bit later in the week.
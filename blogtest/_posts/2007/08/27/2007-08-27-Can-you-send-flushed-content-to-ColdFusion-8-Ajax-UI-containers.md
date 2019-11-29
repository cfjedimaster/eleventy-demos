---
layout: post
title: "Can you send flushed content to ColdFusion 8 Ajax UI containers?"
date: "2007-08-27T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/27/Can-you-send-flushed-content-to-ColdFusion-8-Ajax-UI-containers
guid: 2306
---

No. Ok, so what do I mean? Imagine this simple code:

<code>
&lt;h2&gt;Flush Test&lt;/h2&gt;

&lt;cfdiv bind="url:testi.cfm" &gt;
</code>

This page will load, create the div, and then load testi.cfm into the div. What does testi.cfm do?

<code>
&lt;p&gt;
This is how we start...
&lt;/p&gt;
&lt;cfoutput&gt;#repeatString(" ", 250)#&lt;/cfoutput&gt;

&lt;cfflush&gt;

&lt;cfset sleep(2000)&gt;

&lt;p&gt;
This is how we end later on....
&lt;/p&gt;
</code>

As you can see - I have an intro paragraph, a flush, a pause (the sleep function), and the rest of the text. When you load the file in your browser, ColdFusion will not display the results in the div until the page is completely done.
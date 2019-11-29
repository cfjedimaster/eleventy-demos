---
layout: post
title: "CFTHREAD with a loading message"
date: "2009-05-20T14:05:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2009/05/20/CFTHREAD-with-a-loading-message
guid: 3364
---

As yet another followup to my <a href="http://www.raymondcamden.com/index.cfm/2009/5/18/CFTHREAD--When-to-join">blog entry</a> on CFTHREAD, a user asked about how to present a 'Please stand by' type message while the threads were running. This is fairly trivial with JavaScript and CFFLUSH:
<!--more-->
<code>
&lt;cfset threadlist = ""&gt;
&lt;cfloop index="x" from="1" to="5"&gt;
   &lt;cfset name = "find more cowbell #x#"&gt;
   &lt;cfset threadlist = listAppend(threadlist, name)&gt;
   &lt;cfthread name="#name#"&gt;
      &lt;cfset sleep(3000)&gt;
      &lt;cflog file="tdemo" text="All done with #thread.name#, baby."&gt;
   &lt;/cfthread&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
&lt;span id="loader"&gt;
#repeatString(" ",250)#
Please stand by...
&lt;/span&gt;
&lt;/cfoutput&gt;
&lt;cfflush&gt;

&lt;cfthread action="join" name="#threadlist#" /&gt;
&lt;script&gt;
document.getElementById('loader').innerHTML = ''
&lt;/script&gt;

&lt;cfdump var="#cfthread#"&gt;
</code>

This is a slightly modified version of my previous code entry. Notice that I've added a span called loader with a bit of HTML. (The white space in front is to ensure IE renders the text.) After the cfthread/join action, I then use a bit more JavaScript to get rid of the loader. That's it. I'd normally use jQuery and some fancy loading graphic (like a unicorn, a magical unicorn), but hopefully you get the idea.
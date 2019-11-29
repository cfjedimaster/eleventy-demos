---
layout: post
title: "Ask a Jedi: Send email on long running process"
date: "2006-01-27T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/27/Ask-a-Jedi-Send-email-on-long-running-process
guid: 1064
---

Steve asks:

<blockquote>
I would like to get an email every time that a page runs long enough to get logged as a long-running page. Any suggestions?
</blockquote>
<!--more-->
So - just in case you didn't realize, there is an option in the ColdFusion Administrator that allows you to timeout requests that take too long. If you turn this option on, and a page takes too long to run, an error will be thrown. 

I thought this would be a simple thing to do then - simply modify my onError inside my Application.cfc to notice these errors. However, I noticed something odd. For some reason, my onError code didn't correctly handle the exception. This may be a bug. When I switched to &lt;cferror type="exception" template="exception.cfm"&gt; it worked as expected. 

How can we use the exception template? Here is a simple example:

<code>
This is exception.cfm.

&lt;cfif findNoCase("The request has exceeded the allowable time limit", error.message)&gt;
	send email here
&lt;/cfif&gt;
</code>

I used a findNoCase since I didn't see a nice exception type. How would you know what template? The error.template value shows the file name. You can also find out the tag that causes the problem. The last portion of error.message contains it:

The request has exceeded the allowable time limit Tag: cfoutput

You can also determine the line number by looking at error.rootCause.diagnostics - however - a warning on that. In my initial testing, I used the cferror tag and the onError template. When I did that, the error structure only mentioned a line within my onError method. I had to comment out onError and only use cferror in order to get the real line number. I'm thinking there may be an issue with onError and this particular exception type.
---
layout: post
title: "Warning about ColdFusion 10 and ORM Logging"
date: "2014-01-17T16:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/01/17/Warning-about-ColdFusion-10-and-ORM-Logging
guid: 5130
---

<p>
First off, credit for this post belongs to multiple people. This post stems from a discussion on a private listserv of ColdFusion developers. I'll make a list of folks at the end, but in this case, I'm mainly serving as the 'errand boy' to report the issue and help spread the word. I'll do my best to describe the issue accurately but any screw up is entirely my fault.
</p>
<!--more-->
<p>
In ColdFusion 9 (and in the docs for ColdFusion 10 but not actually implemented), the log settings for ORM (as set in cfhome\lib\log4j.properties) is:
</p>

<pre>log4j.appender.HIBERNATECONSOLE=org.apache.log4j.ConsoleAppender</pre>

<p>
This means ORM-related messages are logged to the console. But in ColdFusion 10, this switched to:
</p>

<pre>log4j.appender.HIBERNATECONSOLE= org.apache.log4j.FileAppender</pre>

<p>
Another issue is that in ColdFusion 9, these two settings...
</p>

<pre>
log4j.appender.HIBERNATECONSOLE.MaxFileSize=500KB
log4j.appender.HIBERNATECONSOLE.MaxBackupIndex=3
</pre>

<p>
are commented out. You can probably guess what the result is - a (potentially!) huge ass log file. Most likely you want to change to a rolling file appender as described here: <a href="http://www.rupeshk.org/blog/index.php/2009/07/coldfusion-orm-how-to-log-sql/">ColdFusion ORM : How to log SQL</a>.
</p>

<p>
If you use ORM, I'd recommend checking your logs now and updating your settings as well.
</p>

<p>
Credit: Sam Farmer, Phill Nacelli, and anyone else I forgot.
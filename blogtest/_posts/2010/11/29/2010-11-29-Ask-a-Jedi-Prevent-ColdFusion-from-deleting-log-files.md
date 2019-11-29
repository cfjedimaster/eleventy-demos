---
layout: post
title: "Ask a Jedi: Prevent ColdFusion from deleting log files"
date: "2010-11-29T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/29/Ask-a-Jedi-Prevent-ColdFusion-from-deleting-log-files
guid: 4030
---

Grant asks:
<p/>
<blockquote>
Is there a way to use cflog to log to a log [lol] that doesn't get deleted by admin?  If so, could it still rollover at a certain size?  If not, what's the best way to accomplish this?
I want to create a log my system can depend on as a valid resource if all other means of finding out what happened fail.
</blockquote>
<!--more-->
<p/>
The short answer is no. As far as I know, once ColdFusion sees N version of a log file, where N is the number specified in your ColdFusion administrator in <b>Log Settings/Maximum number of Archives</b>, then the file will be deleted. You can kinda "cheat" your way around this. For example, I discovered that I could set the maximum number to 100000, which is probably enough to cover a couple decades of log files. (Actually, I tried 999999999999 first and got a fun little max int error.) You could also set the maximum file size higher as well. But technically - both of these do not solve the problem. 

<p/>

If you truly wanted to be sure ColdFusion wouldn't delete your logs you would need to use cffile instead. All cflog does is write, in a standard format, to the ColdFusion log directory. You could easily mimic this yourself. As for handling "rolling" - I actually don't like ColdFusion's way of rolling by size. I prefer rolling by date. If you want a simple day based file pattern you could use code like so...

<p/>

<code>
&lt;cfset name = "base"&gt;
&lt;cfset name &= "." & day(now()) & "." & month(now()) & "." & year(now()) & ".txt"&gt;
&lt;cfoutput&gt;#name#&lt;/cfoutput&gt;
</code>

<p/>

In this snippet, the original value of name simply represents a name for the log. It could be 'security', 'cms', 'beer', etc. I then append the day, month, and year to the file name along with .txt. (And of course, .log would be fine.) This creates a file name of the form, base.29.11.2010.txt. You could add the current hour as well for more granularity.
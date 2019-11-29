---
layout: post
title: "Using ColdFusion Scheduler With Files Based on Dates"
date: "2005-08-05T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/05/Using-ColdFusion-Scheduler-With-Files-Based-on-Dates
guid: 673
---

A user in the ColdFusion IRC room asked how he (I assume he) could use the cfschedule; tag such that when the task executed, it would save a different file per day. 

By default, the output of the task run by cfschedule can only be saved to one file. However, you do not need to use this feature. You could instead simply schedule your page, and have the page itself save the output to a file. Let's look at a complete example and then I'll explain:

<div class="code">&lt;!--- <br>
&nbsp;&nbsp;&nbsp;Today's file:<br>
&nbsp;&nbsp;&nbsp;m_d_yyyy.log<br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;Where m is month number, <br>
&nbsp;&nbsp;&nbsp;d is the day of the month, <br>
&nbsp;&nbsp;&nbsp;and yyyy is - wait for it - year<br>
---&gt;<br>
<br>
<FONT COLOR=MAROON>&lt;cfset filename = dateFormat(now(), <FONT COLOR=BLUE>"m_d_yyyy"</FONT>) & <FONT COLOR=BLUE>".log"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=GRAY><I>&lt;!--- full path is current folder ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfset fullPath = expandPath(<FONT COLOR=BLUE>"./#filename#"</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=GRAY><I>&lt;!--- The content ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"content"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
#now()#<FONT COLOR=NAVY>&lt;br&gt;</FONT><br>
Dell customer support is #randRange(<FONT COLOR=BLUE>99</FONT>,<FONT COLOR=BLUE>100</FONT>)#% bad.<br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cffile action=<FONT COLOR=BLUE>"append"</FONT> file=<FONT COLOR=BLUE>"#fullPath#"</FONT> output=<FONT COLOR=BLUE>"#content#"</FONT>&gt;</FONT></div>

We start by creating a file name. We use the dateFormat function to generate a name based on the current date. We then simply append ".log" to it. Since cffile requires a full path, I create a variable called fullPath. I use expandPath to simply tell it to use the current directory. (As a side note, you should try, as much as possible, to never use "real" paths in your code. It makes your code much more portable if you do not.)

Once I have a filename, I generate the content. Obviously, this portion will be different. I use the cfsavecontent tag to save all the output into a variable.

Then all we do is write the file out. Notice I used "append". This way, if the scheduled event accidently runs twice, you don't overwrite your old output. This isn't the only thing you can do of course. You could overwrite the old file. You could also do a fileExists on fullPath, and throw an error. (Of course, since it is a scheduled event, you would probably want to mail yourself.) You could also generate a new file name by appending a number to the file name. 

p.s. I've been doing a lot of blog entries lately will little tips like this. Some of which are pretty simple, but I assume my lesser-skilled readers will find them helpful. If not, let me know.
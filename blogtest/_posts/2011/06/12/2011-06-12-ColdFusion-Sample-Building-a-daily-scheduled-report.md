---
layout: post
title: "ColdFusion Sample - Building a daily scheduled report"
date: "2011-06-12T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/12/ColdFusion-Sample-Building-a-daily-scheduled-report
guid: 4263
---

A typical ColdFusion web site consists of a set of files that are either directly requested by a browser or run via other CFM files requested by the user. But ColdFusion also includes the ability to run files on a schedule. Within your ColdFusion Administrator you will find a "Scheduled Tasks" page. This tool lets you create, edit, and delete various tasks you can set up to make ColdFusion run files on a certain date or even based on a recurring schedule. In this blog post I'll demonstrate one simple example of how you can use this feature.
<!--more-->
<p/>

For this sample I'm going to use ColdFusion's Scheduled Tasks system to create a "Comments Report" for this blog. The idea being that once a day, perhaps around midnight, my blog will automatically create a report of the comments added to the blog that day and email it to me. (My blog already sends me emails on new comments, but obviously this type of report could apply to any site with user generated content.) ColdFusion Scheduled Tasks are simply requests to CFM files, so to begin, I create a new file with a few of my defaults.

<p/>

<code>
&lt;!--- Create date range ---&gt;
&lt;cfset from = dateAdd("d", -1, now())&gt;
&lt;cfset to = now()&gt;

&lt;!--- who gets the email ---&gt;
&lt;cfset sendTo= "ray@camdenfamily.com"&gt;
</code>

<p/>

I begin by creating a date range. This is something that can be done purely in SQL as well, but I liked having the explicit variables to make it more obvious. Now for the query. Don't get too focused on this. It's specific to our example.

<p/>

<code>
&lt;!--- Now let's get our comments ---&gt;
&lt;cfquery name="getComments" datasource="myblog"&gt;
select c.id as commentid, e.id as entryid, c.name as commentor, c.email as commentoremail, 
c.comment, e.title, c.posted, c.website as commentorurl
from tblblogcomments c
left join tblblogentries e on c.entryidfk = e.id
where c.posted &gt;= &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#from#"&gt;
and c.posted &lt;=  &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#to#"&gt;
order by c.posted desc
&lt;/cfquery&gt;
</code>

<p/>

It's possible that no comments were posted in the past day, so I add a quick exit to end the template.

<p/>

<code>
&lt;cfif getComments.recordCount is 0&gt;
	No comments to email.
	&lt;cfexit&gt;
&lt;/cfif&gt;
</code>

<p/>

Why did I add text? Remember that I'm going to create a Scheduled Task for this. No "real" user will see this. But there's a few reasons why you may want to add information like this. First - during testing you will be running the task manually. Second - ColdFusion's Scheduled Tasks feature allows you to save the results to a file. This is also helpful for debugging once your task is live. Now let's continue down the script.

<p/>

<code>
&lt;cfmail to="#sendTo#" from="#sendTo#" subject="Comment Report" type="html"&gt;
&lt;h2&gt;Comment Report&lt;/h2&gt;

&lt;p&gt;
Here are the comments posted to your blog over the past 24 hours. There were a total 
of #getComments.recordCount# comment(s) posted from #dateFormat(from)# #timeFormat(from)#
to #dateFormat(to)# #timeFormat(to)#.
&lt;/p&gt;

&lt;p&gt;
&lt;table cellpadding="10"&gt;
&lt;cfloop query="getComments"&gt;
	&lt;tr valign="top"&gt;
		&lt;td bgcolor="##80ff00" align="center" style="color:black" width="100"&gt;
		&lt;img src="http://www.gravatar.com/avatar/#lcase(hash(lcase(commentoremail)))#?s=64&amp;r=pg" title="#commentor#'s Gravatar" height="64" width="64" /&gt;&lt;br/&gt;
		&lt;cfif len(commentorurl)&gt;&lt;a href="#commentorurl#" style="color:black"&gt;#commentor#&lt;/a&gt;&lt;cfelse&gt;#commentor#&lt;/cfif&gt;
		&lt;/td&gt;
		&lt;td style="color:black"&gt;
		&lt;b&gt;Post: #title#&lt;/b&gt;&lt;br/&gt;
		&lt;b&gt;Posted: #dateFormat(posted)# #timeFormat(posted)#&lt;/b&gt;&lt;br/&gt;
		&lt;br/&gt;
		#paragraphformat(comment)#
		&lt;/td&gt;
	&lt;/tr&gt;	
&lt;/cfloop&gt;
&lt;/table&gt;
&lt;/p&gt;

&lt;/cfmail&gt;

Comment report email sent.
</code>

<p/>

What we have here is a simple HTML email. I used a lot of inline styling since - unfortunately - HTML email is still stuck back in 1990. Obviously my design skills leave a lot to be desired, but check out this screen shot from my GMail account. (Note - my blog traffic was a bit low yesterday so I extended the range a bit to get some content.)

<p/>

<a href="http://www.raymondcamden.com/images/ScreenClip112.png"><img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip_thumb.png" title="Click for larger image" /></a>

<p/>

I'll paste the entire template at the of this post, but now let's talk about how to actually schedule this report. First, I went to my ColdFusion Administrator and clicked on the Scheduled Tasks link (under Debugging and Logging, which doesn't make much sense)

<p/>

I then clicked the button to create a new task. There's a lot of options here but for the most part it should be self-explanatory. Here's the settings I used for my report.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip113.png" />

<p/>

Once scheduled, you can test it right away. Back in the lists, the first icon will run it right now.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip114.png" />

<p/>

I definitely recommend running the task manually at least once to ensure it will work. And that's it! Here's the template, and as always, I've got some notes at the end.

<p/>

<code>

&lt;!--- Create date range ---&gt;
&lt;cfset from = dateAdd("d", -1, now())&gt;
&lt;cfset to = now()&gt;
&lt;cfset from = dateAdd("d", -2, now())&gt;

&lt;!--- who gets the email ---&gt;
&lt;cfset sendTo= "ray@camdenfamily.com"&gt;

&lt;!--- Now let's get our comments ---&gt;
&lt;cfquery name="getComments" datasource="myblog"&gt;
select c.id as commentid, e.id as entryid, c.name as commentor, c.email as commentoremail, 
c.comment, e.title, c.posted, c.website as commentorurl
from tblblogcomments c
left join tblblogentries e on c.entryidfk = e.id
where c.posted &gt;= &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#from#"&gt;
and c.posted &lt;=  &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#to#"&gt;
order by c.posted desc
&lt;/cfquery&gt;

&lt;cfif getComments.recordCount is 0&gt;
	No comments to email.
	&lt;cfexit&gt;
&lt;/cfif&gt;

&lt;cfmail to="#sendTo#" from="#sendTo#" subject="Comment Report" type="html"&gt;
&lt;h2&gt;Comment Report&lt;/h2&gt;

&lt;p&gt;
Here are the comments posted to your blog over the past 24 hours. There were a total 
of #getComments.recordCount# comment(s) posted from #dateFormat(from)# #timeFormat(from)#
to #dateFormat(to)# #timeFormat(to)#.
&lt;/p&gt;

&lt;p&gt;
&lt;table cellpadding="10"&gt;
&lt;cfloop query="getComments"&gt;
	&lt;tr valign="top"&gt;
		&lt;td bgcolor="##80ff00" align="center" style="color:black" width="100"&gt;
		&lt;img src="http://www.gravatar.com/avatar/#lcase(hash(lcase(commentoremail)))#?s=64&amp;r=pg" title="#commentor#'s Gravatar" height="64" width="64" /&gt;&lt;br/&gt;
		&lt;cfif len(commentorurl)&gt;&lt;a href="#commentorurl#" style="color:black"&gt;#commentor#&lt;/a&gt;&lt;cfelse&gt;#commentor#&lt;/cfif&gt;
		&lt;/td&gt;
		&lt;td style="color:black"&gt;
		&lt;b&gt;Post: #title#&lt;/b&gt;&lt;br/&gt;
		&lt;b&gt;Posted: #dateFormat(posted)# #timeFormat(posted)#&lt;/b&gt;&lt;br/&gt;
		&lt;br/&gt;
		#paragraphformat(comment)#
		&lt;/td&gt;
	&lt;/tr&gt;	
&lt;/cfloop&gt;
&lt;/table&gt;
&lt;/p&gt;

&lt;/cfmail&gt;

Comment report email sent.
</code>

<p/>

<b>Notes:</b>

<p/>

In order for a scheduled task to run, the file it executes has to be under your web root. You can password protect this with your web server, but if do a 'traditional' forms based login system than your task won't be able to bypass that. I'd recommend web server level authentication instead. 

<p/>

Scheduled tasks are sometimes used to generate reports that take a while to process. Don't forget you can specify a higher than normal timeout using the cfsetting tag.
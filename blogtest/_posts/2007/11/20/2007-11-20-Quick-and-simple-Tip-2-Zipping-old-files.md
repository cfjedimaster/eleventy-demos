---
layout: post
title: "Quick (and simple) Tip 2: Zipping old files"
date: "2007-11-20T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/20/Quick-and-simple-Tip-2-Zipping-old-files
guid: 2488
---

As a follow up to my <a href="http://www.raymondcamden.com/index.cfm/2007/11/20/Quick-and-simple-Tip-Deleting-old-files">earlier post</a> on cleaning up old files, here is a modified version that zips and deletes. This would be very handy for log directories.
<!--more-->
<code>
&lt;cfset logdir = "/Applications/ColdFusion8/logs"&gt;

&lt;cfdirectory action="list" directory="#logdir#" name="files" type="file"&gt;

&lt;cfset thirtydaysago = dateAdd("d", -50, now())&gt;

&lt;!--- get older files ---&gt;
&lt;cfquery name="oldfiles" dbtype="query"&gt;
select	name
from	files
where	datelastmodified &lt; &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#thirtydaysago#"&gt;
and		upper(name) not like '%.ZIP'
&lt;/cfquery&gt;

&lt;cfoutput&gt;Out of #files.recordCount# files, there are #oldfiles.recordCount# to zip.&lt;/cfoutput&gt;

&lt;cfif oldfiles.recordCount&gt;
	&lt;cfloop query="oldfiles"&gt;
		&lt;cfzip file="#logdir#/#name#.zip" source="#logdir#/#name#" action="zip"&gt;
		&lt;cffile action="delete" file="#logdir#/#name#"&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

This code is the exact same as the last version except for:

<ul>
<li>I switched the thirtydaysago variable to actually be 50 days ago. This was just to give me a good dataset in my log directory. The date really isn't critical.
<li>My query of queries to get old files now also filters out any zips. Notice the use of upper. This ensures the case doesn't matter.
<li>I added the cfzip tag, a new feature of ColdFusion 8. Nice and easy, right?
</ul>
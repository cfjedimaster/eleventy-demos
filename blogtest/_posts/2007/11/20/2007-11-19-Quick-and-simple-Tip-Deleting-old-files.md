---
layout: post
title: "Quick (and simple) Tip: Deleting old files"
date: "2007-11-20T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/20/Quick-and-simple-Tip-Deleting-old-files
guid: 2487
---

Got a log directory that gets stuffed with files? Want a quick and simple way to clean out old files? Here is a simple code snippet. It will scan one directory and remove any file more than 30 days old.
<!--more-->
<code>
&lt;cfset logdir = "/Applications/ColdFusion8/logs"&gt;

&lt;cfdirectory action="list" directory="#logdir#" name="files" type="file"&gt;

&lt;cfset thirtydaysago = dateAdd("d", -30, now())&gt;

&lt;!--- get older files ---&gt;
&lt;cfquery name="oldfiles" dbtype="query"&gt;
select	name
from	files
where	datelastmodified &lt; &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#thirtydaysago#"&gt;
&lt;/cfquery&gt;

&lt;cfoutput&gt;Out of #files.recordCount# files, there are #oldfiles.recordCount# to delete.&lt;/cfoutput&gt;

&lt;cfif oldfiles.recordCount&gt;
	&lt;cfloop query="oldfiles"&gt;
		&lt;cffile action="delete" file="#logdir#/#name#"&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

Not much going on here. I'll point out the type="file" attribute to cfdirectory. This was added in ColdFusion 8. It tells the tag to only return files, not subdirectories. Outside of that the code just uses query of query to gather files of a certain age (I won't say old, let's be polite) and it then loops over them to delete them.

In my next post I'll show an alternative - archiving to a zip.

<b>Edit: I had my &lt; and &gt; messed up above. It is right now.</b>
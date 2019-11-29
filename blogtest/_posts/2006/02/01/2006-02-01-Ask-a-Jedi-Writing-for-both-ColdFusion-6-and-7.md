---
layout: post
title: "Ask a Jedi: Writing for both ColdFusion 6 and 7"
date: "2006-02-01T18:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/01/Ask-a-Jedi-Writing-for-both-ColdFusion-6-and-7
guid: 1072
---

A reader asks:

<blockquote>
I have a CF app that needs the codebase to be able to run on both CF6.1 and CF7.

The function queryNew() can take 2 params in CF7, but not CF6.1.

How can I code round this?

I have tried this, but it doesn't work:

qMyQuery = false;<br>
iCFMajorRelease	= listFirst(server.ColdFusion.ProductVersion,",");<br>
			
if(iCFMajorRelease LT 7){<br>
 qMyQuery = queryNew("oneColumn,twoColumn");<br>
} else {<br>
 qMyQuery = queryNew("oneColumn,twoColumn","CF_SQL_VARCHAR, CF_SQL_VARCHAR");<br>
}<br>
</blockquote>

So as he probably discovered - this code will throw an error when run on ColdFusion 6, even though, in theory, the code doesn't run. The problem is that the CFML is getting compiled (or interpreted, I always forget the right term) and CF6 simply won't like the syntax used in the second cfif branch. I haven't seen this before with functions, but have seen it in the past when trying to use a tag that didn't exist in a previous version. You can see this for yourself in CFMX7 by doing the following:

<code>
&lt;cfif 0&gt;
	&lt;cfset foo = queryNew("o","cf_sql_varchar", "9")&gt;
&lt;/cfif&gt;
</code>

So how do you get around this? By cfincluding. If you move the code that will only run in CFMX7 to a cfinclude, than CFMX6 will not have a problem. (As long as you don't accidently screw up your cfif conditional.) For an example of this - see how I do charting in <a href="http://ray.camdenfamily.com/projects/galleon">Galleon</a>. In order to support BlueDragon, I moved the charting to it's own include file.
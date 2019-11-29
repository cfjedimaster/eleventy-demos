---
layout: post
title: "Parsing an IIS log file in ColdFusion"
date: "2007-12-20T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/20/Parsing-an-IIS-log-file-in-ColdFusion
guid: 2555
---

Today I wanted to take a look at the logs for <a href="http://www.cfbloggers.org">CFBloggers</a>. I normally just use Google Analytics, but with CFBloggers being so Ajax-heavy, I was curious what the IIS logs would be like compared to Google. I downloaded the logs from the last two months and then realized I had no idea how to parse them. I used to have some decent tools for Windows, but didn't know of anything for OSX.
<!--more-->
So I thought to myself, "Self - ColdFusion 8 reads files super quick, why not do it in CF?" I agreed with myself and decided to give it a go. It reminded me that one of the very first apps I wrote, back in 92ish, was a Perl app to parse web site log files. 

To start off, I decided that I'd just parse one log file. I was going to make the code parse a directory of log files and use CFTHREAD, but shoot, I really just wanted to look at a day and see what it was like compared to Google. So I began with:

<code>
&lt;cfset fileToRead = "/Users/ray/Desktop/cfbloggers logs/ex071219.log"&gt;
</code>

And then I had some coffee and came back two hours later. Next I wrote the meat of the code. First off - ColdFusion 8 makes it super easy to read in a file line by line:

<code>
&lt;cfloop index="line" file="#fileToRead#"&gt;
</code>

Now how do you parse IIS? I looked at the file and noticed it began with a few lines that started with #. One of these lines was a 'header' line that defined the columns. So I began with logic that said: If start with #, ignore unless header line, and create a query otherwise.

<code>
&lt;cfif left(line, 1) is "##"&gt;
	&lt;cfif findNoCase("##Fields:", line) is 1 and not isDefined("data")&gt;
</code>

Data is the name of the query I'm going to create. Why bother checking it? Turns out IIS will rewrite the header info multiple times in the log file. I couldn't understand why my 5k line log file kept saying I had 200 requests. It was the multiple headers causing my query to recreate itself. In theory I'm thinking it's possible for IIS to change format mid-file, but I pretended that I didn't know that.

So once I find the line that begins with #Fields, I had to do some parsing:

<code>
&lt;cfset cols = replace(line, "##Fields: ","")&gt;
&lt;!--- iis has cols with - in it, change to _ ---&gt;
&lt;cfset cols = replace(cols, "-", "_", "all")&gt;
&lt;!--- also may have ...() ---&gt;
&lt;cfset cols = replace(cols, "(","_","all")&gt;
&lt;cfset cols = replace(cols, ")","_","all")&gt;
&lt;cfset colArray = listToArray(cols," ")&gt;
</code>

First off I remove the pretext. Next I change any - to _ since - isn't valid in a query column. Next I replace ( and ) with underscores. I create an array of my column names (even though I'll be using a list again in a bit) to make the code run a bit faster.

<code>
&lt;!--- search for a col with trailing _, not critical, but nice ---&gt;
&lt;cfloop index="x" from="1" to="#arrayLen(colArray)#"&gt;
	&lt;cfif right(colArray[x],1) is "_"&gt;
		&lt;cfset colArray[x] = left(colArray[x], len(colArray[x])-1)&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

This last bit of code simply looks for columns with an _ at the end. This represents an IIS header column named something(foo). I didn't like the dangling underscore so I cleaned it up. If I wanted to, I could also give nicer names to the IIS headers.

Lastly I create the query:

<code>
&lt;cfset data = queryNew(arrayToList(colArray))&gt;	
</code>

Ok, so thats the first branch of the CFIF inside my file loop. The second branch simply parses the line based on the columns:

<code>
&lt;cfset queryAddRow(data)&gt;

&lt;!--- begin parsing ---&gt;
&lt;cfloop index="x" from="1" to="#arrayLen(colArray)#"&gt;
	&lt;cfset value = listGetAt(line, x," ")&gt;
	&lt;cfset col = colArray[x]&gt;
	&lt;cfset querySetCell(data, col,  value)&gt;
&lt;/cfloop&gt;
</code>

And that's it. I wrote a quick query of query to give me a report of my top files:

<code>
&lt;cfoutput&gt;Total number of requests: #data.recordCount#&lt;/cfoutput&gt;

&lt;cfquery name="test" dbtype="query"&gt;
select 	count(cs_uri_stem) as total, cs_uri_stem as page
from	data
group by cs_uri_stem
order by total desc
&lt;/cfquery&gt;
&lt;cfdump var="#test#" top="100"&gt;
</code>

It was here where I discovered that the silly little "stats" pod on CFBloggers got 4k hits yesterday (it auto-reloads). After finding that, I slowed down the reload to 240 seconds. Anyway, enjoy. If folks want to see an example using CFTHREAD, let me know.

<b>Complete Code:</b>
<code>

&lt;cfset fileToRead = "/Users/ray/Desktop/cfbloggers logs/ex071219.log"&gt;

&lt;cfloop index="line" file="#fileToRead#"&gt;
	&lt;!--- ignore lines with # in front ---&gt;
	&lt;!--- except for fields, which will help us define the query, and SHOULD come first ---&gt;
	&lt;!--- also, IIS tends to repeat, so if we have data already, ignore ---&gt;
	&lt;cfif left(line, 1) is "##"&gt;
		&lt;cfif findNoCase("##Fields:", line) is 1 and not isDefined("data")&gt;
			&lt;cfset cols = replace(line, "##Fields: ","")&gt;
			&lt;!--- iis has cols with - in it, change to _ ---&gt;
			&lt;cfset cols = replace(cols, "-", "_", "all")&gt;
			&lt;!--- also may have ...() ---&gt;
			&lt;cfset cols = replace(cols, "(","_","all")&gt;
			&lt;cfset cols = replace(cols, ")","_","all")&gt;
			&lt;cfset colArray = listToArray(cols," ")&gt;
			&lt;!--- search for a col with trailing _, not critical, but nice ---&gt;
			&lt;cfloop index="x" from="1" to="#arrayLen(colArray)#"&gt;
				&lt;cfif right(colArray[x],1) is "_"&gt;
					&lt;cfset colArray[x] = left(colArray[x], len(colArray[x])-1)&gt;
				&lt;/cfif&gt;
			&lt;/cfloop&gt;
			&lt;cfset data = queryNew(arrayToList(colArray))&gt;	
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfif not isDefined("data")&gt;
			&lt;cfthrow message="#fileToRead# seems to be invalid. No Fields line found."&gt;
		&lt;/cfif&gt;
	
		&lt;cfset queryAddRow(data)&gt;

		&lt;!--- begin parsing ---&gt;
		&lt;cfloop index="x" from="1" to="#arrayLen(colArray)#"&gt;
			&lt;cfset value = listGetAt(line, x," ")&gt;
			&lt;cfset col = colArray[x]&gt;
			&lt;cfset querySetCell(data, col,  value)&gt;
		&lt;/cfloop&gt;

	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;Total number of requests: #data.recordCount#&lt;/cfoutput&gt;

&lt;cfquery name="test" dbtype="query"&gt;
select 	count(cs_uri_stem) as total, cs_uri_stem as page
from	data
group by cs_uri_stem
order by total desc
&lt;/cfquery&gt;
&lt;cfdump var="#test#" top="100"&gt;
</code>

p.s. It just occurred to me... I should consider writing an AIR app. :)
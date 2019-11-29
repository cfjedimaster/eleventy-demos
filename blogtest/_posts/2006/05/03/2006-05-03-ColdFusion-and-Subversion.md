---
layout: post
title: "ColdFusion and Subversion"
date: "2006-05-03T14:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/03/ColdFusion-and-Subversion
guid: 1245
---

A few days ago I asked on the <a href="http://www.blogcfc.com/index.cfm/2006/4/29/Changes-on-Saturday-Morning">BlogCFC blog</a> about a way to display a report from Subversion. I knew how to get a report of the latest updates for one file, but not for a project as a whole. A few people recommended Trac, but being the kind of guy I am, I wanted to build something myself. 

Scott P (who has contributed some good changes to BlogCFC) told me what the SVN command was:

<blockquote>
svn log -v svn://199.231.128.19:8000/blogcfc5 --limit 10
</blockquote>

This command will give you a nice report of the last ten changes to the subversion repository. I was about to hook this up to CFEXECUTE and start writing a string parser when I had the brilliant idea of actually checking the documentation. Turns out if you add --xml to the command, you actually get the report back in XML:

<blockquote>
svn log -v svn://199.231.128.19:8000/blogcfc5 --limit 10 --xml
</blockquote>

No string parsing necessary! So I quickly whipped up some code (included below) and added the report to BlogCFC. You can find the SVN info here:

<blockquote>
<a href="http://www.blogcfc.com/blogcfcsvn.cfm">http://www.blogcfc.com/blogcfcsvn.cfm</a>
</blockquote>

Nice design, eh? Hard to believe I'm just a developer. The code is a work in progress, and not encapsulated into a CFC, but for those who want to add this to your site, I've included it below. Some notes:

<ul>
<li>I'm not parsing the dates yet. It's UTC, so I just need to add the offset which I can get from getTimeZoneInfo(). 
<li>You could make the files linkable if you wanted, but you always need to be extra-super-anal-etc when writing code that will dump another file live on the web. In fact, I'd probably just not recommend doing this unless the entire application is very secure.
<li>SVN also reports what happened to the file. So for example, I think it uses M to signify that the file was modified. I bet it uses A for Add and D for Delete, but I haven't confirmed this. I'd like to update my code to not just show the files but what the change was. 
<li>And as I said above, this should be rewritten into a little UDF or CFC.
</ul>

<code>
&lt;!--- path to svn ---&gt;
&lt;cfset svnPath = "svn"&gt;

&lt;!--- whats the url? ---&gt;
&lt;cfset svnURL = "svn://199.231.128.19:8000"&gt;

&lt;!--- how many entries ---&gt;
&lt;cfset top = 10&gt;

&lt;!--- args ---&gt;
&lt;cfset args = "log -v #svnURL# --limit #top# --xml"&gt;

&lt;!--- run it ---&gt;
&lt;cfexecute name="#svnPath#" arguments="#args#" variable="result" timeout="30" /&gt;

&lt;!--- parse to xml ---&gt;
&lt;cfset data = xmlparse(result)&gt;

&lt;!--- get entries ---&gt;
&lt;cfset entries = xmlSearch(data, "//logentry")&gt;

&lt;cfset logEntries = arrayNew(1)&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(entries)#"&gt;
	&lt;cfset entry = entries[x]&gt;
	&lt;cfset logEntry = structNew()&gt;
	&lt;cfset logEntry.revision = entry.xmlAttributes.revision&gt;
	&lt;cfset logEntry.files = arrayNew(1)&gt;
	&lt;cfloop index="y" from="1" to="#arrayLen(entry.xmlChildren)#"&gt;
		&lt;cfset xmlChild = entry.xmlChildren[y]&gt;
		
		&lt;cfswitch expression="#xmlChild.xmlName#"&gt;
			
			&lt;cfcase value="author,msg,date"&gt;
				&lt;cfset logEntry[xmlChild.xmlName] = xmlChild.xmlText&gt;
			&lt;/cfcase&gt;
	
			&lt;cfcase value="paths"&gt;
				&lt;cfloop index="z" from="1" to="#arrayLen(xmlChild.xmlChildren)#"&gt;
					&lt;cfset thisFile = xmlChild.xmlChildren[z].xmlText&gt;
					&lt;cfset arrayAppend(logEntry.files, thisFile)&gt;
				&lt;/cfloop&gt;
			&lt;/cfcase&gt;
					
		&lt;/cfswitch&gt;
		
	&lt;/cfloop&gt;

	&lt;cfset arrayAppend(logEntries, logEntry)&gt;	
	
&lt;/cfloop&gt;

&lt;cfdump var="#logEntries#"&gt;
</code>
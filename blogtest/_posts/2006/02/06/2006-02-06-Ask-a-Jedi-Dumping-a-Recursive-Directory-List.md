---
layout: post
title: "Ask a Jedi: Dumping a Recursive Directory List"
date: "2006-02-06T18:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/06/Ask-a-Jedi-Dumping-a-Recursive-Directory-List
guid: 1078
---

A reader (nicely) asked me something before I left for Boston, and I never got around to answering. He had an interesting problem. He wanted to list directories and files, in a recursive fashion, using HTML's unordered list display to handle the directories and their children.

Now I thought this was a simple thing - just use the recurse=true option in &lt;cfdirectory&gt;. However - the more I thought about it - the more difficult it seemed. You can sort the &lt;cfdirectory&gt; result - but not in an way you can simply output with HTML. 

My first thought was to switch back to a recursive &lt;cfdirectory&gt;, and while that would work, I assumed I'd lose a lot in terms of speed due to all the file operations. So what I came up with was a mix of recursive CFML and the built-in recursive &lt;cfdirectory&gt; tag:

<code>
&lt;cfset initialDir = "c:\apache2\htdocs\testingzone\blogcfc_flex2"&gt;
&lt;cfdirectory directory="#initialDir#" recurse="yes" name="files" sort="directory asc"&gt;

&lt;cfset display(files,initialDir)&gt;

&lt;cffunction name="display" returnType="void" output="true"&gt;
	&lt;cfargument name="files" type="query" required="true"&gt;
	&lt;cfargument name="parent" type="string" required="true"&gt;
	&lt;cfset var justMyKids = ""&gt;
	
	&lt;cfquery name="justMyKids" dbtype="query"&gt;
	select	*
	from	arguments.files
	where	directory = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.parent#"&gt;
	&lt;/cfquery&gt;	
	
	&lt;cfoutput&gt;&lt;ul&gt;&lt;/cfoutput&gt;
	
	&lt;cfoutput query="justMyKids"&gt;
		&lt;li&gt;#directory#\#name#&lt;/li&gt;
		&lt;cfif type is "Dir"&gt;
			#display(arguments.files, directory & "\" & name)#
		&lt;/cfif&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfoutput&gt;&lt;/ul&gt;&lt;/cfoutput&gt;
	
&lt;/cffunction&gt;
</code>

As you can see, I do the initial &lt;cfdirectory&gt; and have it fetch all the files. The UDF simply handles displaying items from the query. I don't normally do output from UDFs, so to be honest, I feel a bit dirty. I'd probably just wrap it up in a cfsavecontent and return that, but this was written in about 5 minutes. Another problem - note I hard code \ as my file delimiter. I could have made this more dynamic by using a Java call:

<code>
&lt;cfset separator = createObject("java","java.io.File").separator&gt;
</code>

In general, the use of "/" will work just fine in any OS, however, since I was doing a string comparison in my query, I'd probably want to use the same separator CF used.
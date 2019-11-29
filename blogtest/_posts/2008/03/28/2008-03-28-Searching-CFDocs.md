---
layout: post
title: "Searching CFDocs"
date: "2008-03-28T12:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/28/Searching-CFDocs
guid: 2736
---

A friend of mine recently pinged me with a question about the ColdFusion docs. She noticed that in version 8, the search capability was removed. Now while you can obviously search the PDF, that can be a bit slow, and if you aren't online and can use <a href="http://www.cfquickdocs.com/cf8">cfQuickDocs</a>, you have to use your local docs. CFEclipse includes the CF docs and also provides a searchable interface. I don't use Dreamweaver but I'm sure it supports it as well.
<!--more-->
Another option is to use Verity. Since the docs are all HTML based, you could quickly index the docs and build a simple search interface to the collection. The benefit to this is you get the power of Verity's search engine, and can do things like offer suggestions in case you misspell a CF tag. I wrote up a quick script that does all of this in one hit. It both looks for and creates a cfdocs collection if it doesn't exist, and then has a simple search interface. You could drop this right in your web root and run it. The only line you would need to modify is the very first line of code. I can't sniff where you install the cfdocs so I hard coded the line. (Technically I could make some guesses, like under CF's webroot, but if you have CF tied to Apache or IIS, it may be under your main web root instead.)

The code itself isn't too interesting. I will point out that there is <i>still</i> an old bug with file based Verity collections and the URL property. If you specify a value like I have:

<code>
&lt;cfindex collection="cfdocs" action="update" type="path" key="#docpath#" recurse="true" urlpath="/cfdocs/htmldocs/" status="s"&gt;
</code>

The result query from a search will be broken. Instead of getting something like this:

/cfdocs/htmldocs/raymond.html

You always get one letter removed:

/cfdocs/htmldocs/aymond.html

So I hacked around this by using the KEY value, which was the full path to the file. Anyway, the file is included below. Enjoy. And if you have any questions about what I did, ask away.

<code>
&lt;!--- physical location of docs ---&gt;
&lt;cfset docpath = "c:/coldfusion8/wwwroot/cfdocs/htmldocs/"&gt;

&lt;!--- Set up collection if we need too ---&gt;
&lt;cfcollection action="list" name="collections"&gt;
&lt;cfif not listFindNoCase(valueList(collections.name), "cfdocs")&gt;

	&lt;!--- makes the collection ---&gt;
	&lt;cfset cdir = server.coldfusion.rootdir & "/verity/collections/"&gt;
	&lt;cfcollection action="create" collection="cfdocs" path="#cdir#"&gt;
	&lt;!--- populate it. ---&gt;
	&lt;cfoutput&gt;
	#repeatString(" ", 250)# &lt;!--- IE Hack ---&gt;
	&lt;p&gt;
	I'm indexing the cfdocs directory. Please stand by...
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	&lt;cfflush&gt;
	
	&lt;cfindex collection="cfdocs" action="update" type="path" key="#docpath#" recurse="true" urlpath="/cfdocs/htmldocs/" status="s"&gt;

&lt;/cfif&gt;

&lt;cfparam name="url.search" default=""&gt;
&lt;cfparam name="form.search" default="#url.search#"&gt;
&lt;cfparam name="url.startrow" default="1"&gt;
&lt;cfset perpage = 10&gt;

&lt;cfoutput&gt;
&lt;form action="#cgi.script_name#" method="post"&gt;
&lt;input type="text" name="search" value="#form.search#"&gt; &lt;input type="submit" value="Search"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;

&lt;cfif len(trim(form.search))&gt;
	&lt;cfsearch collection="cfdocs" name="results" contextPassages="3" maxRows="#perpage#" startrow="#url.startrow#" status="r" suggestions="always" 
				contextHighlightBegin="___999___" contextHighlightEnd="___000___" criteria="#trim(form.search)#"&gt;

	&lt;cfif results.recordCount&gt;
		&lt;cfoutput&gt;
		Your search for '#form.search#' returned #r.found# result(s) out of #r.searched# entries.&lt;br /&gt;
		&lt;cfif structKeyExists(r, "suggestedquery") and len(r.suggestedquery)&gt;
		You may also want to search for &lt;a href="#cgi.script_name#?search=#urlencodedformat(r.suggestedquery)#"&gt;#r.suggestedquery#&lt;/a&gt;.&lt;br /&gt;
		&lt;/cfif&gt;
		&lt;/cfoutput&gt;

		&lt;cfoutput query="results"&gt;
			&lt;!--- fix url ---&gt;
			&lt;cfset newurl = listLast(key, "/\")&gt;
			&lt;p&gt;
			&lt;b&gt;#rank#) &lt;a href="/cfdocs/htmldocs/#newurl#"&gt;#title#&lt;/a&gt;&lt;/b&gt;&lt;br /&gt;
			&lt;!--- fix context ---&gt;
			&lt;cfset newcontext = htmlEditFormat(context)&gt;
			&lt;cfset newcontext = replace(newcontext, "___999___", "&lt;span style='background-color:yellow'&gt;", "all")&gt;
			&lt;cfset newcontext = replace(newcontext, "___000___", "&lt;/span&gt;", "all")&gt;
			#newcontext#
			&lt;/p&gt;
		&lt;/cfoutput&gt;

		&lt;cfif url.startrow gt 1&gt;
			&lt;cfoutput&gt;&lt;a href="#cgi.script_name#?search=#urlencodedformat(form.search)#&startrow=#max(1,url.startrow-perpage)#"&gt;Previous&lt;/a&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
				
		&lt;cfif r.found gt url.startrow + perpage&gt;
			&lt;cfoutput&gt;&lt;a href="#cgi.script_name#?search=#urlencodedformat(form.search)#&startrow=#url.startrow+perpage#"&gt;Next&lt;/a&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		
	&lt;cfelse&gt;

		&lt;cfoutput&gt;
		Your search for '#form.search#' returned no results out of #r.searched# entries.&lt;br /&gt;
		&lt;cfif structKeyExists(r, "suggestedquery") and len(r.suggestedquery)&gt;
		You may want to search for &lt;a href="#cgi.script_name#?search=#urlencodedformat(r.suggestedquery)#"&gt;#r.suggestedquery#&lt;/a&gt; instead.&lt;br /&gt;
		&lt;/cfif&gt;
		&lt;/cfoutput&gt;
		
	
	&lt;/cfif&gt;	
&lt;/cfif&gt;
</code>
---
layout: post
title: "Ask a Jedi: Get the size of a folder (pre-CF7)"
date: "2006-05-30T16:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/30/Ask-a-Jedi-Get-the-size-of-a-folder-preCF7
guid: 1304
---

Blaine the Train asks:

<blockquote>
I need to find the size of a given folder.  In CF7, that's easy enough, but I'm still using 6.1.  Any ideas to get me the size of a specific folder?
</blockquote>

In case you aren't aware, when Blaine says this is easy to do in CFMX7, he is talking about the new recurse=true attribute to cfdirectory. This lets you get a directory and all subdirectories and files. <i>Very</i> handy. I think that a lot of cool code stuff got overlooked (PR wise) in CFMX7, and this is one of them. (Of course, I'm a geek, and while I think Enterprise Gateways are super-cool, I use isValid <b>every single day</b>.)
<!--more-->
So since we don't have the recurse attribute in CF6, what can we do? Simply write our own recursive function. Here is the code I wrote for <a href="http://www.cflib.org/udf.cfm/directorylist">directoryList</a> over at CFLib.

<code>
cffunction name="directoryList" output="false" returnType="query"&gt;
	&lt;cfargument name="directory" type="string" required="true"&gt;
	&lt;cfargument name="filter" type="string" required="false" default=""&gt;
	&lt;cfargument name="sort" type="string" required="false" default=""&gt;
	&lt;cfargument name="recurse" type="boolean" required="false" default="false"&gt;
	&lt;!--- temp vars ---&gt;
	&lt;cfargument name="dirInfo" type="query" required="false"&gt;
	&lt;cfargument name="thisDir" type="query" required="false"&gt;
	&lt;cfset var path=""&gt;
    &lt;cfset var temp=""&gt;
	
	&lt;cfif not recurse&gt;
		&lt;cfdirectory name="temp" directory="#directory#" filter="#filter#" sort="#sort#"&gt;
		&lt;cfreturn temp&gt;
	&lt;cfelse&gt;
		&lt;!--- We loop through until done recursing drive ---&gt;
		&lt;cfif not isDefined("dirInfo")&gt;
			&lt;cfset dirInfo = queryNew("attributes,datelastmodified,mode,name,size,type,directory")&gt;
		&lt;/cfif&gt;
		&lt;cfset thisDir = directoryList(directory,filter,sort,false)&gt;
		&lt;cfif server.os.name contains "Windows"&gt;
			&lt;cfset path = "\"&gt;
		&lt;cfelse&gt;
			&lt;cfset path = "/"&gt;
		&lt;/cfif&gt;
		&lt;cfloop query="thisDir"&gt;
			&lt;cfset queryAddRow(dirInfo)&gt;
			&lt;cfset querySetCell(dirInfo,"attributes",attributes)&gt;
			&lt;cfset querySetCell(dirInfo,"datelastmodified",datelastmodified)&gt;
			&lt;cfset querySetCell(dirInfo,"mode",mode)&gt;
			&lt;cfset querySetCell(dirInfo,"name",name)&gt;
			&lt;cfset querySetCell(dirInfo,"size",size)&gt;
			&lt;cfset querySetCell(dirInfo,"type",type)&gt;
			&lt;cfset querySetCell(dirInfo,"directory",directory)&gt;
			&lt;cfif type is "dir"&gt;
				&lt;!--- go deep! ---&gt;
				&lt;cfset directoryList(directory & path & name,filter,sort,true,dirInfo)&gt;
			&lt;/cfif&gt;
		&lt;/cfloop&gt;
		&lt;cfreturn dirInfo&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

This works well, but probably isn't the best code to run on the root of a drive. Once you have the query, to get the total size, you could simply use query of query to get the sum of the file size.

Now that's the CFML solution. While slow, it will work in all platforms. The quickest solution would be to write up a quick bat file and fire off a cfexecute to run it. Or potentially use a COM object if you are on Windows. (Here is a COM example: <a href="http://www.cflib.org/udf.cfm?ID=120">http://www.cflib.org/udf.cfm?ID=120</a>) These solutions would probably run a heck of a lot faster, but will tie you to one OS. Frankly I don't think that is a big huge deal. While I know people who have switched database types, I don't know many who have switched operating systems. And if you are using proper code encapsulation techniques, you can always replace an OS specific call with a CFML one.
---
layout: post
title: "Seeker updated to support Word docs and Excel files"
date: "2008-06-20T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/20/Seeker-updated-to-support-Word-docs-and-Excel-files
guid: 2891
---

I just pushed up an update to <a href="http://seeker.riaforge.org">Seeker</a>, my ColdFusion Lucene project. I added support for MS Word documents and MS Excel files. This was incredibly easy using <a href="http://javaloader.riaforge.org">JavaLoader</a> from Mark Mandel and the POI project.
<!--more-->
<a href="http://www.cfsilence.com/blog/client">Todd Sharp</a> gets credit for pushing both these ideas to me. He also made a good suggestion for how to use JavaLoader within Seeker. 

Seeker makes use of various "reader" CFCs. Each CFC is responsible for one or more file types. A CFC 'registers' itself using metadata. So here is what plaintext.cfc looks like:

<code>
&lt;cfcomponent output="false" hint="Plain text reader." extensions="xml,txt,html,htm,cfm,cfc" extends="reader"&gt;

&lt;cffunction name="read" access="public" returnType="string" output="false"&gt;
	&lt;cfargument name="file" type="string" required="true"&gt;
	&lt;cfset var result = ""&gt;
	
	&lt;cffile action="read" file="#arguments.file#" variable="result"&gt;
	&lt;cfreturn result&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Note the extensions attribute. This then says that this reader will be used for all the plain text file types. So what Todd suggested was just using a similar method for the Java classes. I'm not terribly happy with the names, but this is what I did.

When you add requires= to your reader CFC, you specify a list of Java classes. Like so:

<code>
&lt;cfcomponent output="false" hint="MS Office format reader." extensions="doc,xls" requires="org.apache.poi.hwpf.HWPFDocument, org.apache.poi.hwpf.extractor.WordExtractor, org.apache.poi.hssf.extractor.ExcelExtractor, org.apache.poi.hssf.usermodel.HSSFWorkbook" extends="reader"&gt;
</code>

(Spaces were added to me.) When Seeker runs, it will notice these requirements and use JavaLoader to load them. There is a JARs file that is autoloaded, and it is expected that if your CFC needs a jar, you will put it in the folder. Since I'm using JavaLoader, all of these JARs are plug and play. No need to restart ColdFusion. Working with the classes is simple as well:

<code>
&lt;cfset var doc = getRequirement("org.apache.poi.hwpf.HWPFDocument")&gt;
</code>

This calls a method in the inherited CFC that gets the class that was loaded by JavaLoader and injected by the core Seeker code. I'm not happy with that method name there, but it works.
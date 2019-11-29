---
layout: post
title: "Lucene Update"
date: "2007-10-24T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/24/Lucene-Update
guid: 2432
---

I had to spend a few minutes on hold today waiting for a client, so I decided to spend a bit more time working on the ColdFusion Lucene code. One of the things I found about Lucene was it had no support for binary files. Basically you are responsible for finding your own plugins to get the text out of various file formats.

So I've updated my code to allow for plugins. What do I mean? The previous version of the code simply used a fileRead() call on the file to read in file contents and pass it to Lucene. Now I call a new CFC, filereader.cfc. This CFC, when created, scans a subdirectory named readers. Each CFC (except the core CFC the others one extend) represents a 'reader' for a type of file. Consider plaintext.cfc:

<code>
&lt;cfcomponent output="false" hint="Plain text reader." extensions="xml,txt,html,cfm,cfc" extends="reader"&gt;

&lt;cffunction name="read" access="public" returnType="string" output="false"&gt;
	&lt;cfargument name="file" type="string" required="true"&gt;
	&lt;cfset var result = ""&gt;
	
	&lt;cffile action="read" file="#arguments.file#" variable="result"&gt;
	&lt;cfreturn result&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

There are two things important going on here. First off - notice the extensions attribute. Don't forget that the cfcomponent tag allows you to add any ole attribute you like. Well, my filereader.cfc makes note of this attribute. If it is reading a file of type X, and there is a reader that says it handles the extension, then the Read method is called. Notice for the plaintext cfc, I simply read in the file and return the result. Easy. So to "plugin" PDF support, I wrote a pdf.cfc. I stole my code from <a href="http://pdfutils.riaforge.org">pdfutils</a>. Now this code only works in ColdFusion 8, but someone else (that's you guys) could write a cf7 PDF reader. Someone else could write a MP3 reader. Etc. 

Make sense? Cool? This change also removes the CF8 requirement for my code. (I mean outside of the PDF reader.)  In theory - it completes the support (although the code is still a bit ugly) of file based indexing. All I would need to add next is support for manual updates so folks can index database information.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive12%{% endraw %}2Ezip'>Download attached file.</a></p>
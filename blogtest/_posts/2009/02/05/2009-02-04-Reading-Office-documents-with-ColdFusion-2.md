---
layout: post
title: "Reading Office documents with ColdFusion (2)"
date: "2009-02-05T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/05/Reading-Office-documents-with-ColdFusion-2
guid: 3223
---

Yesterday I wrote a <a href="http://www.raymondcamden.com/index.cfm/2009/2/4/Reading-Office-documents-with-ColdFusion">blog entry</a> on reading Microsoft Office documents with ColdFusion, Apache POI, and JavaLoader. One of the commenters, Leah, shared some code that made use of the latest beta of POI. This makes the reading quite a bit simpler. I had tried this myself but ran into trouble. Thanks to Leah, I'm now able to demonstrate a new version that is quite a bit simpler.
<!--more-->
First, make sure you have read the <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/4/Reading-Office-documents-with-ColdFusion">previous entry</a>, as some of this won't make sense without the background information. The next thing you want to do is grab POI 3.5 (<a href=">http://www.apache.org/dyn/closer.cgi/poi/dev/">List of Mirror</a>) and unzip it. Copy all the JARs, all the lib contents, and the ooxml-lib files, into a new subfolder called jars2. "jars2" as a name isn't required of course. My previous version of this code used the jars folder for the 3.2 files so I figured I'd use jars2 for the 3.5 code.

Our initialization code is virtually the same as before:

<code>
&lt;!--- where the poi files are ---&gt;
&lt;cfset jarpath = expandPath("./jars2")&gt;
&lt;cfset paths = []&gt;
&lt;cfdirectory action="list" name="files" directory="#jarpath#" filter="*.jar" recurse="true"&gt;

&lt;cfloop query="files"&gt;
	&lt;cfset arrayAppend(paths, directory & "/" & name)&gt;
&lt;/cfloop&gt;

&lt;!--- load javaloader ---&gt;
&lt;cfset loader = createObject("component", "javaloader.JavaLoader").init(paths)&gt;
</code>

Now for the cool part. Remember how we had around 8 or so specific Java classes to do our parsing? This was because each Office type we worked with (Word, Excel, Powerpoint) had their own code and APIs to get at the text. POI 3.5 makes this a bit simpler with a factory called the ExtractorFactory. Here is the rest of the file:

<code>
&lt;!--- generic file reader doohicky ---&gt;
&lt;cfset myfile = createObject("java","java.io.File")&gt;
	
&lt;!--- get our required things loaded ---&gt;
&lt;cfset extractorFactory = loader.create("org.apache.poi.extractor.ExtractorFactory")&gt;

&lt;!--- get files ---&gt;
&lt;cfset filePath = expandPath("./testdocs")&gt;
&lt;cfdirectory action="list" name="files" directory="#filePath#" filter="*.doc*{% raw %}|*.ppt*|{% endraw %}*.xls*"&gt;

&lt;cfloop query="files"&gt;
	&lt;cfset theFile = filePath & "/" & name&gt;
	&lt;cfset myfile.init(theFile)&gt;


	&lt;cfoutput&gt;Reading: #theFile#&lt;br/&gt;&lt;/cfoutput&gt;

	&lt;cfset extractor = extractorFactory.createExtractor(myFile)&gt;
	&lt;cfoutput&gt;&lt;pre&gt;#extractor.getText()#&lt;/pre&gt;&lt;/cfoutput&gt;
	
	&lt;p&gt;&lt;hr/&gt;&lt;/p&gt;
	
&lt;/cfloop&gt;
</code>

I made one File object and one instance of the ExtractorFactory. Once I've done that, look how darn simple the code is! 

<code>
&lt;cfset extractor = extractorFactory.createExtractor(myFile)&gt;
</code>

The factory takes care of all the sniffing and ensuring the right extractor is returned. I then just run getText() and we're done. Simpler than a debate with Lindsey Lohan!

I've attached the code to the blog entry. Later today I'll talk about how to get at some of the metadata for Office documents. (Note, the attached zip does not have the jars from POI 3.5, they were a bit too big.)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fpoi1%{% endraw %}2Ezip'>Download attached file.</a></p>
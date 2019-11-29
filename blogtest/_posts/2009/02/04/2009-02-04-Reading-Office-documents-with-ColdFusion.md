---
layout: post
title: "Reading Office documents with ColdFusion"
date: "2009-02-04T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/04/Reading-Office-documents-with-ColdFusion
guid: 3222
---

Have you ever needed to get information about Office documents with ColdFusion? In this blog entry I'll talk about how we can use some open source tools along with ColdFusion to read from various types of Microsoft Office documents. I'll be focusing on retrieving the text of the documents only. You can use this code to allow users to upload Word documents and provide basic search features against the actual contents of the documents.

Now you may ask - doesn't the built in Verity engine do this? It does, but if you have any other need for the text, you are out of luck. Verity sucks in the text and stores it in it's own format. You can't ask Verity to make a copy of the complete text. Let's get started!
<!--more-->
Our code will make use of two open source products. The first is the <a href="http://poi.apache.org/">Apache POI</a> product. This is a set of Java libraries that allow deep integration into Office documents, both reading and writing. Our use of the library will be fairly simple - just reading. I <a href="http://www.apache.org/dyn/closer.cgi/poi/release/">downloaded</a> the latest 3.2 version which provides support for Office formats from the old 97 versions up to the Office 2007 release. For OOXML you can use POI 3.5, which is in beta. I had trouble playing with this so decided to focus on the non-OOXML version. 

After you download the zip, open up the archive and copy the 3 JAR files you find in the root. I copied these to a folder called 'jars' under my web root.

The next thing we need is <a href="http://javaloader.riaforge.org">JavaLoader</a>. JavaLoader is a ColdFusion project created by Mark Mandel (the creator of Transfer). This code lets you load any random JAR file on the fly. Normally you have to copy new JARs to a specific location under your ColdFusion install <b>and</b> you have to follow this up with a server restart. JavaLoader is a <i>much</i> simpler way to handle this. It also helps with another problem - class conflicts. ColdFusion itself makes use of POI (you can see a few POI jar files in the lib folder) but the version bundled is older than what we need to use to extra our text. By using JavaLoader, we can make sure everything comes directly from the JARs in play. I downloaded JavaLoader and extracted the code to a folder named javaloader under my web root.

Alright, so let's look at some code. The first thing I want to do is get JavaLoader initialized with the JAR files from POI. When you initialize JavaLoader you pass in an array of JAR files. Since I put everything in a folder, I wrote some code to simply iterate over the directory and create a list of all the JARs. I then pass this to JavaLoader:

<code>
&lt;!--- where the poi files are ---&gt;
&lt;cfset jarpath = expandPath("./jars")&gt;
&lt;cfset paths = []&gt;
&lt;cfdirectory action="list" name="files" directory="#jarpath#" filter="*.jar" recurse="true"&gt;

&lt;cfloop query="files"&gt;
	&lt;cfset arrayAppend(paths, directory & "/" & name)&gt;
&lt;/cfloop&gt;

&lt;!--- load javaloader ---&gt;
&lt;cfset variables.loader = createObject("component", "javaloader.JavaLoader").init(paths)&gt;
</code>

Now I'm going to create a set of Java classes. This will be used by the extraction code and comes from my reading of the POI docs. Each extraction will typically involve one Java object for the file itself and one for the extractor:

<code>
&lt;!--- generic file reader doohicky ---&gt;
&lt;cfset myfile = createObject("java","java.io.FileInputStream")&gt;
	
&lt;!--- get our required things loaded ---&gt;

&lt;!--- Word ---&gt;
&lt;cfset doc = loader.create("org.apache.poi.hwpf.HWPFDocument")&gt;
&lt;cfset wordext =  loader.create("org.apache.poi.hwpf.extractor.WordExtractor")&gt;

&lt;!--- Excel ---&gt;
&lt;cfset excel =  loader.create("org.apache.poi.hssf.usermodel.HSSFWorkbook")&gt;
&lt;cfset xlsext =  loader.create("org.apache.poi.hssf.extractor.ExcelExtractor")&gt;

&lt;!--- Powerpoint ---&gt;
&lt;cfset ppt = loader.create("org.apache.poi.hslf.HSLFSlideShow")&gt;
&lt;cfset pptext = loader.create("org.apache.poi.hslf.extractor.PowerPointExtractor")&gt;	
</code>

Ok, now to get parsing. I created a new folder called testdocs and dumped a few Word, Excel, and Powerpoint files inside. Our code will now loop over each file and attempt to extract it based on the extension:

<code>
&lt;!--- get files ---&gt;
&lt;cfset filePath = expandPath("./testdocs")&gt;
&lt;cfdirectory action="list" name="files" directory="#filePath#"&gt;


&lt;cfoutput query="files"&gt;
	&lt;cfset theFile = filePath & "/" & name&gt;
	&lt;cfset myfile.init(theFile)&gt;

	Reading: #theFile#&lt;br/&gt;

	&lt;cfswitch expression="#listLast(name,".")#"&gt;
	
		&lt;cfcase value="doc"&gt;	
			&lt;cfset doc = doc.init(myfile)&gt;
			&lt;cfset wordext.init(doc)&gt;
			&lt;cfoutput&gt;
&lt;pre&gt;
#wordext.getText()#
&lt;/pre&gt;
			&lt;/cfoutput&gt;
		&lt;/cfcase&gt;
		
		&lt;cfcase value="xls"&gt;	
			&lt;cfset excel = excel.init(myfile)&gt;
			&lt;cfset xlsext = xlsext.init(excel)&gt;
			&lt;cfoutput&gt;
&lt;pre&gt;
#xlsext.getText()#
&lt;/pre&gt;
			&lt;/cfoutput&gt;
		&lt;/cfcase&gt;

		&lt;cfcase value="ppt"&gt;	
			&lt;cfset ppt = ppt.init(myfile)&gt;
			&lt;cfset pptext = pptext.init(ppt)&gt;
			&lt;cfoutput&gt;
&lt;pre&gt;
#pptext.getText(true,true)#
&lt;/pre&gt;
			&lt;/cfoutput&gt;
		&lt;/cfcase&gt;		
	&lt;/cfswitch&gt;

	&lt;p&gt;&lt;hr/&gt;&lt;/p&gt;
	
&lt;/cfoutput&gt;
</code>

As before we use cfdirectory and then we loop over each file. Notice that I'm initializing a FileInputStream object, myfile, which will be used to seed the specific object representations of the Office documents.

For each file we check the extension, and based on the extension, use the appropriate extractor object to get the text.

That's it! If you download the zip attached to this blog entry and then run the code, you will see that the code does a reasonable good job of representing the text. For example, the text from the Excel document is laid out much like how you see it visually in MS Excel. 

<b>Sample output from an Excel sheet</b><br/>
<img src="https://static.raymondcamden.com/images//Picture 138.png">

Once you have the text you can store it in a database, email it, or do anything else you would like with it.

Pretty simple and powerful! Also note that you can get other data then just the text. Each extractor has it's own options and each Office object itself can do it's own unique thing. For example, with the Powerpoint support you can choose to get the text of slides or the notes, or both. Check the docs at Apache for more information.

How are people using POI in the wild? Ben Nadel has his <a href="http://www.bennadel.com/projects/poi-utility.htm">POI Utility</a> which enables for reading/writing Excel docs. Todd Sharp <i>used</i> to use it for <a href="http://www.slidesix.com">SlideSix</a> but has since moved on to using OpenOffice.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fpoi%{% endraw %}2Ezip'>Download attached file.</a></p>
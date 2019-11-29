---
layout: post
title: "Working with Office Metadata"
date: "2009-02-06T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/06/Working-with-Office-Metadata
guid: 3225
---

I've had a chance to play a bit more with the Apache POI project and I thought I'd share a bit of code demonstrating how to read Office document metadata. Unfortunately I was not able to get this working with Office 2007, but maybe I'll get lucky with reader Leah again!
<!--more-->
Anyway, the code:

<code>
&lt;!--- where the poi files are ---&gt;
&lt;cfset jarpath = expandPath("./jars2")&gt;
&lt;cfset paths = []&gt;
&lt;cfdirectory action="list" name="files" directory="#jarpath#" filter="*.jar" recurse="true"&gt;

&lt;cfloop query="files"&gt;
	&lt;cfset arrayAppend(paths, directory & "/" & name)&gt;
&lt;/cfloop&gt;

&lt;!--- load javaloader ---&gt;
&lt;cfset variables.loader = createObject("component", "javaloader.JavaLoader").init(paths)&gt;
</code>

This is the exact same code I've used in my previous two blog entries so I won't explain it again. 

<code>
&lt;!--- read in my Word doc ---&gt;
&lt;cfset myfile = createObject("java","java.io.FileInputStream").init(expandPath("./testdocs/Testing Reading Word Docs.doc"))&gt;
</code>

Unlike my previous entries where I looped over a folder of documents, in this example I'm just using one specific Word document.

<code>
&lt;!--- Word Support ---&gt;
&lt;cfset doc = loader.create("org.apache.poi.hwpf.HWPFDocument")&gt;
&lt;!--- init it with my java file input stream set to my test file ---&gt;
&lt;cfset doc = doc.init(myfile)&gt;
</code>

Next we create an instance of HWPFDocument. This is the specific class used for Word documents. You would use something different for PPT or Excel files. Once I create the class I pass in the file I specified earlier.

Ok, now for the fun part:

<code>
&lt;cfset summary = doc.getSummaryInformation()&gt;
</code>

This code retrieves a set of summary data from the document. This is another Java object itself with a set of methods to get, set, and remove document metadata. As an example:

<code>
&lt;cfoutput&gt;
Title=#summary.getTitle()#&lt;br/&gt;
Page Count=#summary.getPageCount()#&lt;br/&gt;
Word Count=#summary.getWordCount()#&lt;br/&gt;
Application=#summary.getApplicationName()#&lt;br/&gt;
Author=#summary.getAuthor()#&lt;br/&gt;
Comments=#summary.getComments()#&lt;br/&gt;
CreateDateTime=#summary.getCreateDateTime()#&lt;br/&gt;
Edit Time=#summary.getEditTime()#&lt;br/&gt;
Keywords=#summary.getKeywords()#&lt;br/&gt;
Last Author=#summary.getLastAuthor()#&lt;br/&gt;
Last Printed=#summary.getLastPrinted()#&lt;br/&gt;
Last SaveDateTime=#summary.getLastSaveDateTime()#&lt;br/&gt;
Revision Number=#summary.getRevNumber()#&lt;br/&gt;
Security=#summary.getSecurity()#&lt;br/&gt;
Subject=#summary.getSubject()#&lt;br/&gt;
Template=#summary.getTemplate()#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

Pretty much all of those methods should be self-explanatory, but I'll point out some interesting ones. The getEditTime() function actually returns how long the document has been edited. I assume that is related to how long I have the document open in my application. Not sure how I'd use that but it's cool nonetheless. getSecurity returns an integer that defines what type of security the document has (duh), and is documented in the POI API docs. (I've copied the values to my test CFM file attached to this entry.) Another method that I didn't actually demonstrate above is getThumbnail(). This returns binary data for a thumbnail. The data is either in WMF or BMP format. CF can work with BMP, but my test document must have had a WMF thumbnail. I was able to save the bits to the file system but wasn't able to actually do anything with it. My Mac wanted to use Adobe Illustrator to view it, but AI complained that the file wasn't valid. If we can get that working, it would be cool!

So how hard is it to update the metadata?

<code>
&lt;cfset summary.setTitle("Ray changed this doc #randRange(1,100)#")&gt;
	
&lt;!--- read in my Word doc ---&gt;
&lt;cfset myfile2 = createObject("java","java.io.FileOutputStream").init(expandPath("./testdocs/Testing Reading Word Docs.doc"))&gt;
&lt;cfset doc.write(myfile2)&gt;
</code>

I set a new, random title. I then create a FileOutputStream using the same file name and then simply ran the write method of the doc object. This works because the summary object pointed back to the original document, so even though I modified summary, it updated the doc object as well.

Pretty simple I think. One could wrap this up into a nice CFC and make it even simpler of course.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftest4%{% endraw %}2Ecfm%2Ezip'>Download attached file.</a></p>
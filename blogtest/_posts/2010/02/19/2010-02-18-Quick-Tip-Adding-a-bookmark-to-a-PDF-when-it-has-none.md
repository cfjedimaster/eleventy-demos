---
layout: post
title: "Quick Tip: Adding a bookmark to a PDF when it has none"
date: "2010-02-19T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/19/Quick-Tip-Adding-a-bookmark-to-a-PDF-when-it-has-none
guid: 3726
---

A reader wrote in to me with an interesting question yesterday. He was using ColdFusion 9's nice new ability to work with Office documents to create a merged PDF of various sources. His application let people drag and drop different documents into the browser (using HTML5) and then make use of cfdocument to convert them all into PDFs. Once done, all the PDFs would then be merged into one PDF.
<!--more-->
<p>
This worked fine, but he ran into a problem when PDFs were part of the bunch of files that were to be merged. Obviously he didn't need to convert PDFs to PDFs, but because he wasn't using cfdocument to create the result, the PDF sources didn't have bookmarks. His final merged PDF would have a bookmark for all the bits except inner PDFs. 
<p>
I double checked the docs and saw no way to add a bookmark to an existing PDF. You can't source cfdocument with a PDF. You can't do it with cfpdf either. Luckily though DDX once again came to the rescue. I noticed that the DDX example in the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7995.html">docs</a> made use of the PDF tag to do a merge. (Which isn't necessary anymore since we can do merges with CFPDF.) 
<p>
<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt; 
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt; 
&lt;PDF result="Out1"&gt; 
    &lt;PDF source="Title"/&gt; 
    &lt;TableOfContents/&gt; 
    &lt;PDF source="Doc1"/&gt; 
    &lt;PDF source="Doc2"/&gt; 
    &lt;PDF source="Doc3"/&gt; 
&lt;/PDF&gt; 
&lt;/DDX&gt;
</code>
<p>
On a whim I looked up the reference for the <a href="http://livedocs.adobe.com/livecycle/es/sdkHelp/programmer/sdkHelp/wwhelp/wwhimpl/js/html/wwhelp.htm?href=ddxRefBookMarks.166.1.html#1548277">PDF</a> tag in DDX and discovered that it includes a "bookmarkTitle" attribute. Here is a sample script I used:
<p>
<code>
&lt;cfsavecontent variable="ddx"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;PDF result="Out1"&gt;
&lt;PDF source="Doc1" bookmarkTitle="TESTING!!" /&gt;
&lt;/PDF&gt;
&lt;/DDX&gt;
&lt;/cfsavecontent&gt;
</code>
<p>
And it worked like a charm. I took a random PDF as my source and when I checked the output, the "inner" PDF had a bookmark called "TESTING!!".
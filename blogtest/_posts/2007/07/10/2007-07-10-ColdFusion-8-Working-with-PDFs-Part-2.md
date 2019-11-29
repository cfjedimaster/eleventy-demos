---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 2)"
date: "2007-07-10T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/10/ColdFusion-8-Working-with-PDFs-Part-2
guid: 2185
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/7/9/ColdFusion-8-Working-with-PDFs-Part-1">blogged</a> about new PDF functions added in ColdFusion 8: isPDFFile and isPDFObject. Today I'm going to continue my discussion of the new PDF tools in ColdFusion 8 by introducing the CFPDF tag. This is one of the 5 new PDF related tags added to ColdFusion 8. This one tag can do many things:
<!--more-->
<ul>
<li>It can add or remove a watermark to a PDF.
<li>It can remove pages from a PDF. (Ever wanted to remove the legal crap from in front of a PDF? Or an ad?)
<li>It can return information about a PDF.
<li>It can merge multiple PDFs into one.
<li>It can add/remove security from a PDF.
<li>It can read a PDF. (Duh.)
<li>It can set metadata to a PDF.
<li>It can create thumbnails from a PDF.
<li>It can write out to a PDF.
</ul>

Lets start off with a simple example of reading a PDF. Consider the following example:

<code>
&lt;cfif isPDFFile("book.pdf")&gt;

	&lt;cfpdf action="read" source="book.pdf" name="mypdf"&gt;

	&lt;cfdump var="#mypdf#"&gt;
	
&lt;/cfif&gt;
</code>

I begin by checking to see if a file is a proper PDF. If it is, I then use the CFPDF tag to read the PDF into a variable named mypdf. At that point I can dump the PDF and see information about it. By the way, the same trick (reading and dumping) works for images as well.

<img src="https://static.raymondcamden.com/images/cfjedi/pdf1.png" align="left">

I've displayed the dump to the left, and you can see it reveals quite a bit of information about my PDF. The PDF I had used was one made from scratch using CFDOCUMENT, so somethings like Author and Keywoard are blank. But it did pick up the page size and security settings. It is too bad that CFDOCUMENT doesn't easily allow us to set the metadata, but guess what? We can use the CFPDF tag to correct that!

The setInfo command lets you pass in a struct of information. You can change the author, the subject, the title, and the keywords for a PDF. Let's look at a simple example:

<code>
&lt;cfif isPDFFile("book.pdf")&gt;

	&lt;cfset data = {% raw %}{author="Raymond Camden", Subject="Paris Hilton", Title="The Wit and Wison of Paris Hilton", KeyWords="paris hilton,wisdom,wit"}{% endraw %}&gt;
	
	&lt;cfpdf action="setinfo" source="book.pdf" info="#data#"&gt;

	&lt;cfpdf action="getinfo" source="book.pdf" name="mdata"&gt;

	&lt;cfdump var="#mdata#"&gt;	
	
&lt;/cfif&gt;
</code>

I first create a simple struct of data. I then pass this struct to the CFPDF tag, noting the action of setinfo, the source for my PDF, and the struct of data. I then use getInfo to get the information back, and dump it. Now my PDF created from CFDOCUMENT has proper metadata in it. 

Tomorrow I'll demonstrate adding and removing watermarks from your PDF documents.

<br clear="left">
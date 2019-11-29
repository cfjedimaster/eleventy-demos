---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 5)"
date: "2007-07-17T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/17/ColdFusion-8-Working-with-PDFs-Part-5
guid: 2198
---

Today's PDF entry is all about merging. ColdFusion 8 allows us to merge any number of PDFs, whether from files or directly in memory. What are some usage examples? Your site could have a standard disclaimer that you want added to the front of each PDF you create. You may have a standard credits page you want to add to the end. Whatever the need - ColdFusion makes it pretty simple, so let's take a look.
<!--more-->
As I mentioned above, you can work with PDFs on the file system or with PDFs in memory. Let's first take a look at PDFs on the file system. The CFPDF tag takes a directory attribute. This directory consists of the PDF files you want to merge. By default ColdFusion will merge all files in the folder. There are three things to consider when working with a folder:

<ol>
<li>CFPDF will sort your PDFs by timestamp first. You can supply the order attribute to change this to name. 
<li>CFPDF will sort your PDFs in reverse order. So if you use name, PDFs will be sorted Z to A. You can change this by using the ascending attribute. The default value is no.
<li>CFPDF will try to merge every file in a folder. If a folder contains non-PDF files, ColdFusion will ignore it. If you do not want ColdFusion to ignore non-PDF files, use stopOnError=true. 
</ol>

So let's look at a simple example:

<code>
&lt;cfdocument name="pdf1" format="pdf"&gt;
&lt;cfoutput&gt;
This is PDF 1 at #timeFormat(now())#
&lt;/cfoutput&gt;
&lt;/cfdocument&gt;

&lt;cfdocument name="pdf2" format="pdf"&gt;
&lt;cfoutput&gt;
This is PDF 2 at #timeFormat(now())#
&lt;/cfoutput&gt;
&lt;/cfdocument&gt;

&lt;cfset savedFolder = expandPath("./pdfs")&gt;

&lt;cffile action="write" file="#savedFolder#/pdf1.pdf" output="#pdf1#"&gt;
&lt;cffile action="write" file="#savedFolder#/pdf2.pdf" output="#pdf2#"&gt;

&lt;cfpdf action="merge" directory="#savedFolder#" name="mergedpdf"&gt;

&lt;cfcontent type="application/pdf" reset="true" variable="#toBinary(mergedpdf)#"&gt;
</code>

The code begins by simply creating two PDFs. These PDFs are stored to the file system in a subfolder named pdfs. The important line is here:

<code>
&lt;cfpdf action="merge" directory="#savedFolder#" name="mergedpdf"&gt;
</code>

I simply specify a directory and in my case, a name variable to store the result in memory. Lastly I serve up the PDF with the cfcontent tag. If you run this you will notice that the PDF seems backwards. PDF2 is on page 1, and PDF1 is on page 2. This makes sense if you remember the above notes. The default order is by time, descending, and PDF2 was written out first. 

Now let's take it up a notch and introduce a new tag, cfpdfparam. The cfpdfparam tag is <b>only</b> used with merging PDFs. It lets you do all kinds of fun things. It gives you the power to provide more control over the order. It lets you specify a page range for each PDF. (So for example, merge pages 1-10 in pdf 1, pages 13-19 in pdf 2, and pages 90-100 in pdf 3.) You can also supply passwords for individual PDFs that need them. Pretty cool, eh? Here is a simple example:

<code>
&lt;cfdocument name="pdf1" format="pdf"&gt;
&lt;cfoutput&gt;
This is PDF 1 at #timeFormat(now())#
&lt;/cfoutput&gt;
&lt;/cfdocument&gt;

&lt;cfdocument name="pdf2" format="pdf"&gt;
&lt;cfoutput&gt;
This is PDF 2 at #timeFormat(now())#
&lt;/cfoutput&gt;
&lt;/cfdocument&gt;

&lt;cfpdf action="merge" name="mergedpdf"&gt;
	&lt;cfpdfparam source="pdf1"&gt;
	&lt;cfpdfparam source="pdf2"&gt;
&lt;/cfpdf&gt;

&lt;cfcontent type="application/pdf" reset="true" variable="#toBinary(mergedpdf)#"&gt;
</code>

This example is much like the first one. I create two PDFs with cfdocument. This time though I don't bother saving them to the file system. I then do the merge operation, but note the use of cfpdfparam. Now my order will work correctly because I explicitly specified the proper order. I could have used filenames as well. (And let me thank Adobe again for supporting relative paths!)

One final note - another option for merging PDFs is "keepBookmark". This tells CFPDF to keep the bookmarks in the source PDF files. I'll be talking about bookmarks more in the next entry.

Please let me know if you are enjoying this series. The last entry didn't get any comments so I want to make sure folks are still getting it. :)
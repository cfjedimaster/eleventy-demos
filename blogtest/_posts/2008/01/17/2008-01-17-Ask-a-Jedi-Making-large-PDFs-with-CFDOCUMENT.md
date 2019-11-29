---
layout: post
title: "Ask a Jedi: Making large PDFs with CFDOCUMENT"
date: "2008-01-17T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/17/Ask-a-Jedi-Making-large-PDFs-with-CFDOCUMENT
guid: 2599
---

Curt asks:

<blockquote>
<p>
I am wondering what you do if you are creating a large pdf.  I am using &lt;cfdocument&gt; to create a pdf that ends up being about 1500 pages.  The file size is about 150MB and it obviously takes forever to create the document.  Is there some other better way to create large pdf files.  The application creates statements for the customer on a monthly basis.
</p>
</blockquote>

Wow, 1500?? As much as I love ColdFusion, I would have assumed that would have brought down the server. If you are only making the PDF once a month, then you probably want to ensure that a web site user isn't the one making it. By that I mean, don't punish some poor user and make him wait the many minutes (hours?) it would take to make the PDF. Use something like the ColdFusion Schedular to generate the PDF, and I'd highly recommend doing it during off hours.

Another tip I'd recommend, and something I did at the <a href="http://www.coldfusioncookbook.org">ColdFusion Cookbook</a>, was to find parts of the PDF that don't change, like title pages, legal notices, that kind of junk. Generate those pages and save them forever. Generate the rest of the document, and use CFPDF to merge the old PDFs and the new PDFs together into a final PDF.

Is anyone else pushing CFDOCUMENT this far?
---
layout: post
title: "Getting a page from a PDF Document in ColdFusion 8"
date: "2007-07-26T15:07:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2007/07/26/Getting-a-page-from-a-PDF-Document-in-ColdFusion-8
guid: 2222
---

Every needed to extract a page from a PDF document? Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/7/25/Reading-text-from-a-PDF-in-ColdFusion-8">blogged</a> my new little CFC called PDFUtils. The idea was to take the power of CFPDF and wrap up some utility functions. The first function contained a simple getText() utility that would return all the text in a PDF.

Today I added getPage(). As you can guess, it grabs one page from a PDF. How? Well CFPDF doesn't support getting one page, but it does support deleting pages. All I did was add logic to "flip" a page number into a delete order. This then lets you do:

<code>
&lt;cfset pdf = createObject("component", "pdfutils")&gt;

&lt;cfset mypdf = expandPath("./paristoberead.pdf")&gt;

&lt;cfset page2 = pdf.getPage(mypdf, 2)&gt;
&lt;cfdump var="#page2#"&gt;

&lt;cfpdf action="write" source="page2" destination="page2.pdf" overwrite="true"&gt;
</code>

Running this gets you a dump of the PDF object and a new file named page2.pdf that is just - you guessed it - page 2.

I've reattached the code plus sample files and PDFs.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive8%{% endraw %}2Ezip'>Download attached file.</a></p>
---
layout: post
title: "Update to pdfUtils Component"
date: "2008-04-04T20:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/04/Udate-to-pdfUtils-Component
guid: 2754
---

I'm happy to announce an update to my <a href="http://pdfutils.riaforge.org">pdfUtils</a> component. For folks who don't remember, the pdfUtils component was simply meant to help folks further build upon the awesome PDF support in ColdFusion 8. Todays update comes from Edward EG. Griffiths. He added a new method, readXMP. This allows you to read the XMP data from a PDF. He is currently working on writeXMP.

Now what is XMP? I had no idea until Edward explained it to me. XMP is a way to embed metadata within PDFs. Not the metadata you normally see (and the metadata you can access with CFPDF) but <i>any</i> arbitrary metadata. You can see how this would be useful for document handling, workflow, etc.

Turns out that DDX supports working with XMP, but it is on the list of 'banned' DDX keywords in ColdFusion 8. Now with this method you have a way around that.

To be honest, I'm really surprised by the PDF format. I didn't think it was all that interesting until ColdFusion 8 let me dig into it so much.
---
layout: post
title: "Ask a Jedi: CFC Results to PDF/Flash Paper"
date: "2005-11-05T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/05/Ask-a-Jedi-CFC-Results-to-PDFFlash-Paper
guid: 899
---

Thinman asks:

<blockquote>
Can a CFC be coded to to save query results in FlahsPaper and PDF Format?
</blockquote>

This question can be read multiple ways, so I'm not exactly sure how to answer, but I'll do my best. First off - unrelated to CFCs - when you use cfdocument you can store the results instead of actually displaying it. All you need to do is use the name attribute. This stores the binary data in a variable. So can a CFC do this, sure? You could also have the CFC output the data as well, so for example, you could have a dynamic link to a PDF version of a page by linking to:

someCFC.cfc?method=displayPageAsPDF&id=whatever

I don't normally output directly from a CFC, but you certainly could if you wanted.
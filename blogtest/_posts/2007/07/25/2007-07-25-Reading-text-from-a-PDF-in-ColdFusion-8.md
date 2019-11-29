---
layout: post
title: "Reading text from a PDF in ColdFusion 8"
date: "2007-07-25T15:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/25/Reading-text-from-a-PDF-in-ColdFusion-8
guid: 2220
---

Yesterday I <a href="/2007/07/24/ColdFusion-8-Working-with-PDFs-Part-7">blogged</a> about ColdFusion and DDX, a way to some fancy-pants neato transformations of PDF documents. One of the cooler examples was that DDX could be used to grab the text from a PDF file. For those who thought it might be too difficult to use the DDX, I've wrapped up the code in a new ColdFusion Component I'm calling <b>PDF Utils</b>. (Coming to a RIAForge near you soon. Watch the skies...) 

Right now the CFC has one method, getText. You pass in the path to a PDF and you get an array of pages. Each item in the array is the text on that particular page. I've included on this blog post two sample PDFs. One is a normal PDF with simple text. As you can imagine, the function works great with it. The other one is a highly graphical, wacky looking PDF. Ok it isn't wacky looking per se, but it isn't a simple letter. When the method is run on this PDF, the text does come back, but it is a bit crazy looking. I think this is to be expected though. And what's cool is that if your intent is to get the text out for searching/indexing purposes, you can still find it useful.

Anyway, here is a sample:

<pre><code class="language-javascript">
&lt;cfset pdf = createObject("component", "pdfutils")&gt;

&lt;cfset mypdf = expandPath("./paristoberead.pdf")&gt;

&lt;cfset results = pdf.getText(mypdf)&gt;
&lt;cfdump var="#results#"&gt;
</code></pre>

Which gives this result:

<img src="https://static.raymondcamden.com/images/cfjedi/pdftotext.png">

The zip includes 2 PDFs, the component, and my test script.

<a href="https://static.raymondcamden.com/enclosures/Archive7%2Ezip">Download attached file.</a>
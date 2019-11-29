---
layout: post
title: "Extracting bookmarks from a PDF with ColdFusion"
date: "2011-05-24T21:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/24/Extracting-bookmarks-from-a-PDF-with-ColdFusion
guid: 4246
---

Sid asked:

<p/>

<blockquote>
Hey Ray is there any code using jquery/coldfusion/java, a way we can extract the bookmarks in a PDF.
</blockquote>

<p/>
<!--more-->
<p>

Via CFPDF, this is not possible. As you know, CFPDF supports DDX, which talks to an embedded LCDS instance. But the DDX support is a bit limited. That's not terrible considering how much LCSD costs. One thing I'm fairly sure LCDS can do is extract bookmarks, but this is not possible within ColdFusion. On a whim though I decided to look at iText. I <a href="http://www.raymondcamden.com/index.cfm/2011/5/6/Anyone-playing-with-iText-and-ColdFusion">blogged</a> about this a few weeks ago and thought I'd check to see if it was possible. Turns out - it was incredibly easy. Check it out:

<p>

<code>
&lt;cfset reader = CreateObject("java", "com.lowagie.text.pdf.PdfReader").init("C:\Users\Raymond\Documents\My Dropbox\ColdFusion\coldfusion_9_admin.pdf")&gt;
&lt;cfset simpleBookmark = createObject("java","com.lowagie.text.pdf.SimpleBookmark")&gt;
&lt;cfset bookmarks = simpleBookmark.getBookmark(reader)&gt;
&lt;cfif isNull(bookmarks)&gt;
	&lt;cfoutput&gt;
	No bookmarks.
	&lt;/cfoutput&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfset iterator = bookmarks.listIterator()&gt;
&lt;cfloop condition="iterator.hasNext()"&gt;
	&lt;cfset bm = iterator.next()&gt;
	&lt;cfdump var="#bm#"&gt;
&lt;/cfloop&gt;
</code>

<p>

As with my previous example, I begin by creating a 'reader' object pointing to my PDF. At that point I created an instance of iText's SimpleBookmark object and called the getBookmark method. And that's it. The results are Hashmaps which cfdump handles for you. If you want to use the keys manually though use a get method like so:

<p>

<code>
&lt;cfoutput&gt;#bm.get("Title")#&lt;/cfoutput&gt;
</code>
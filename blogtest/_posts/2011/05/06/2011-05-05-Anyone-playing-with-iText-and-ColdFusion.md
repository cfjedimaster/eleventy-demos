---
layout: post
title: "Anyone playing with iText and ColdFusion?"
date: "2011-05-06T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/06/Anyone-playing-with-iText-and-ColdFusion
guid: 4222
---

Anyone out there playing with <a href="http://www.itextpdf.com/">iText</a>? iText is an open source library that allows for the creation and manipulation of PDFs via Java. I've heard of it before but have never really played with it. I find cfdocument and cfpdf to be good enough for most of my needs, but earlier this week a user wrote in asking about how to use iText to get comments from a PDF. While cfpdf supports DDX, an XML based language that does PDF magic via an embedded Livecycle engine in ColdFusion, it specifically blocks you from running DDX to get comments. I'm not going to complain about this as I'm still surprised as to how much you <i>can</i> do via DDX, but it would be nice to have a work around. iText itself is also bunded within ColdFusion. That means you can use it without installing any additional Jars or using JavaLoader. So an example:
<!--more-->
<p>

<code>
&lt;cfset reader = createObject("java", "com.lowagie.text.pdf.PdfReader").init(expandPath("testa.pdf"))&gt;
</code>

<p>

I know (or knew, before this week) next to zip about iText but even I can tell what this does. There are full API docs, but a Google search turned up this perfect blog entry: <a href="http://vajahatalee.blogspot.com/2010/04/how-to-extract-comments-from-pdf-using.html">How to extract comments from pdf using Itext</a>. Before going on - read that entry and check out the Java code. Now let's look at a version in ColdFusion:

<p>

<code>
&lt;cfset reader = CreateObject("java", "com.lowagie.text.pdf.PdfReader").init(expandPath("testa.pdf"))&gt;
&lt;cfset pageDict = reader.getPageN(1)&gt;

&lt;cfdump var="#pageDict#" expand="false"&gt;
&lt;cfset pdfname = createObject("java","com.lowagie.text.pdf.PdfName")&gt;

&lt;cfset annots = pageDict.getAsArray(pdfname.ANNOTS)&gt;
&lt;cfset iterator = annots.listIterator()&gt;
&lt;cfloop condition="iterator.hasNext()"&gt;
	&lt;cfset annot = reader.getPdfObject(iterator.next())&gt;
	&lt;cfset content = reader.getPdfObject(annot.get(pdfname.CONTENTS))&gt;
	&lt;cfif not isNull(content)&gt;
		&lt;cfoutput&gt;
		content=#content#
		&lt;p&gt;
		&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		it was null
		&lt;p&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;p&gt;
done
</code>

<p>

Again - even if you've never seen iText before, you can take some guesses as to what is going on. I specifically ask for annotations and then iterate over them. It's interesting to note - and I'm again surprised by how complex PDFs are - that comments are merely one type of annotation. The code above works fine (*) for comments, but not for other things like "Pop Up Notes" (which I didn't know existed until I looked at the sample PDF the reader sent me). 

<p>

Anyway - interesting stuff here. I'm considering perhaps adding to my <a href="http://pdfutils.riaforge.org/">pdfUtils</a> CFC wrapper. I can imagine a getComments method could be useful?

<p>

* One note on the CFML code. Unlike the Java code demonstrated in the other blog entry, this code only gets one page. That's a trivial enough change to fix though.
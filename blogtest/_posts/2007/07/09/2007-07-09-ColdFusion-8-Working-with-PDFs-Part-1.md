---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 1)"
date: "2007-07-09T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/09/ColdFusion-8-Working-with-PDFs-Part-1
guid: 2181
---

Ok, time for a little revelation. This may prevent me from ever working for Adobe, but I have to be honest. 

PDFs are boring.
<!--more-->
Ok, ok, I get it. They look nice. They are powerful. But... outside of that, when I hear folks talk about PDF as a technology, I have to stifle a yawn. Not because I don't like PDFs. I like them just fine. But to me they are about as exciting as, well, other file formats. As long as they work, I'm not too bothered to really care about the internals. 

That's one reason why when I discovered all the new PDF stuff in ColdFusion 8 I didn't really pay much attention. But as I started to play around with the new tags, something odd occurred. I actually got <i>excited</i> about PDFs again! The amount of customization/modification/etc that you can do with PDFs in ColdFusion 8 is incredible. (See my article on <a href="http://www.raymondcamden.com/index.cfm/2007/6/13/ColdFusion-8-URL-Thumbnails">URL Thumbnails</a> for an example.)

So with that in mind, this week I'm going to take a look at some of the new PDF-related features in ColdFusion 8. Today I'm going to start with the simplest of features - checking to see if a file is a valid PDF.

For that feature ColdFusion 8 adds two simple functions: isPDFFile and isPDFObject. Let's start with the first one. As you can probably guess, isPDFFile tells you if a file is a PDF. Consider this example:

<code>
&lt;cfif isPDFFile("menu.cfm")&gt;
	menu.cfm is a PDF!&lt;br/&gt;
&lt;/cfif&gt;

&lt;cfif isPDFFile("book.pdf")&gt;
	book.pdf is a PDF!&lt;br/&gt;
&lt;/cfif&gt;
</code>

I have two checks here. The first checks a CFM file and the second checks a PDF. When run, you will only see: book.pdf is a PDF!. Like some of the other new ColdFusion 8 functions, you <b>finally</b> are allowed to use relative file paths. No more expandPath to convert a file in the same folder to a full path. (Thank you Adobe!) You can use a full path if you want, but you do not need to.

If you already have a variable and want to see if it contains a PDF, then you use isPDFObject. I'm not sure why they didn't use isPDF, but the function to use is isPDFObject. An example:

<code>
&lt;cfif isPDFObject(mypdf)&gt;
	mypdf is a PDF&lt;br /&gt;
&lt;/cfif&gt;

&lt;cfif isPDFObject(request)&gt;
	the request scope is a pdf.&lt;br /&gt;
&lt;/cfif&gt;
</code>

Tomorrow I'll be talking about the CFPDF tag, but for now, assume mypdf is a native PDF variable. Running this code you will only see "mypdf is a PDF". 

Pretty simple stuff. As I said, my next entry will expand on this and start talking about the powerful CFPDF tag.
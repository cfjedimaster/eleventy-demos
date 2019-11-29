---
layout: post
title: "Proof of Concept - Working with Remote PDF Data"
date: "2011-12-10T08:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/10/Proof-of-Concept-Working-with-Remote-PDF-Data
guid: 4458
---

I'm not sure how useful this will be to others, but it was an interesting question from a reader so I thought I'd share the result. Michael works with a remote service that returns PDF data as base64 encoded text. He wanted to know if it was possible to add a watermark to the PDF before serving it to the user. Here's what I came up with.
<!--more-->
<p>

First, I create a simple service that would read in a PDF file and return it as base64. This would fake the remote service Michael was working with. Note - this code was written "just to work", in a real application I'd add some caching to reduce the amount of file i/o.

<p>

<code>
component {

	remote string function getpdf() returnformat="plain" { 
		var pdffile = "c:\users\raymond\desktop\the test.pdf";
		var bits = fileReadBinary(pdffile);
		return toBase64(bits);
	}
	
		
}
</code>

<p>

Ok, so how do we use this as a consumer and work with the bits. First, we write code to get the data from the service.

<p>

<code>
&lt;!--- get my pdf from the 'remote' server ---&gt;
&lt;cfhttp url="http://localhost/test.cfc?method=getpdf"&gt;
&lt;cfset pdfdata = cfhttp.filecontent&gt;
</code>

<p>

Just to be super anal here and make sure it's clear - no - you would never cfhttp to a local server. Again - I'm just trying to replicate Michael's environment. 

<p>

Once you have the bits, how do you work with it? ColdFusion let's you manipulate PDF data very easily, but, it must start from one of two sources - either a real file (which doesn't necessarily need to be a PDF, Office docs work too) or the result of a cfdocument call. We have the data, but ColdFusion isn't going to be able to use it as is. So - we must save the file.

<p>

<code>
&lt;cfset binary = toBinary(pdfdata)&gt;

&lt;cfset tmpFile = getTempFile(getTempDirectory(),"pdf")&gt;
&lt;cfset fileWrite(tmpFile, binary)&gt;
</code>

<p>

Now, at this point, if we don't care about keeping a clean original, we can just manipulate it as is.

<p>

<code>
&lt;cfpdf source="#tmpFile#" action="addwatermark" text="Property of Raymond"&gt;
</code>

<p>

And then finally, serve it to the user:

<p>

<code>
&lt;cfheader name="Content-disposition"  value="attachment;filename=new.pdf" /&gt;
&lt;cfcontent type="application/pdf" file="#tmpFile#" deletefile="no"&gt;
</code>

<p>

Note the use of filename in the cfheader tag. Even though my PDF had some temporary name, I can give it  a nicer name before sending it over.
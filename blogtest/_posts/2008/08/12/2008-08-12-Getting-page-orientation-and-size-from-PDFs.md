---
layout: post
title: "Getting page orientation and size from PDFs"
date: "2008-08-12T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/12/Getting-page-orientation-and-size-from-PDFs
guid: 2970
---

I had an interesting conversation today with Josh Knutson. He noticed that the getInfo action of CFPDF did not return either the page orientation (landscape versus portrait). Nor does it say anything about the page size. He needed to put a watermark in a PDF but the position depended on the orientation of the PDF.
<!--more-->
I didn't believe him at first, but a quick test showed that he was right. This information is not returned. So we both looked into DDX. Turns out there is a DDX operation called DocumentInformation. This DDX can be used to return information about the PDF. It returns some, but not all, of the same things getInfo returns, but it also returns information that getInfo does not. Included in this information is both a page size (for all the pages, so you could have multiple sizes) and an orientation. (Although they call it rotate90. It will be 0 for portrait and 90 for landscape.) The DDX is fairly simple: 

<pre><code class="language-markup">
&lt;DocumentInformation result="Out1" source="doc1" /&gt;
</code></pre>

I had a lot of trouble getting this working though. When I first tried this, I had:

<pre><code class="language-markup">
&lt;DocumentInformation result="Out1" source="doc1"&gt;
&lt;/DocumentInformation&gt;
</code></pre>

This kept giving me an invalid DDX error. I knew DocumentInformation was supported. I even did an isXML test on the DDX and it returned true. Yet an immediate call to isDDX always returned false. Then I tried this:

<pre><code class="language-markup">
&lt;DocumentInformation result="Out1" source="doc1"&gt;&lt;/DocumentInformation&gt;
</code></pre>

And it worked! For some reason, DDX isn't happy with the line break after the end of the tag, which is odd since it's certainly valid XML. Of course, the shorthand version (../&gt;) works and is the shortest form. 

So anyway - I took this code and added it to <a href="http://pdfutils.riaforge.org">PDFUtils</a>, my CFC wrapper for complex PDF actions. You can now do this:

<pre><code class="language-markup">
&lt;cfset pdf = createObject("component", "pdfutils")&gt;

&lt;cfset mypdf = expandPath("../test.pdf")&gt;
&lt;cfset eInfo = pdf.getExtraInfo(mypdf)&gt;
&lt;cfdump var="#eInfo#"&gt;
</code></pre>

The result struct will contain all the information returned by the DDX action.
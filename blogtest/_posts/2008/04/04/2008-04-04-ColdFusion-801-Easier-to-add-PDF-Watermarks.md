---
layout: post
title: "ColdFusion 8.0.1 - Easier to add PDF Watermarks"
date: "2008-04-04T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/04/ColdFusion-801-Easier-to-add-PDF-Watermarks
guid: 2753
---

ColdFusion 8.0.1 makes it much easier to add watermarks to PDF documents. In the past you had to either use an image or another PDF, but now you can simply pass in text. You can even pass in styled text. Here is a simple example.

First we generate a PDF dynamically.
<!--more-->
<code>
&lt;cfdocument format="pdf" name="mypdf"&gt;
&lt;cfloop index="x" from="1" to="9"&gt;
&lt;p&gt;
Lorem impsum delorem battlestar galactica begins tonight and it kicks butt.
Lorem impsum delorem battlestar galactica begins tonight and it kicks butt.
Lorem impsum delorem battlestar galactica begins tonight and it kicks butt.
Lorem impsum delorem battlestar galactica begins tonight and it kicks butt.
&lt;/p&gt;
&lt;/cfloop&gt;
&lt;/cfdocument&gt;
</code>

Now let's add the watermark:

<code>
&lt;cfpdf action="addWatermark" text="&lt;b&gt;TOP SECRET!&lt;/b&gt;" source="mypdf" foreground="true"&gt;
</code>

The foreground attribute is critical for PDFs made with cfdocument. If you don't use it - your watermark will be behind the text.

Now I can serve the PDF to the user:

<code>
&lt;cfheader name="content-disposition" value="attachment; filename=""test.pdf"""/&gt;
&lt;cfcontent type="application/pdf" variable="#toBinary(mypdf)#"&gt;
</code>

Note the toBinary thing. This is an bug that was not fixed in CF8. Even though "mypdf" is a PDF document, when I performed the addWatermark action, I converted what was pure binary data into a PDF object recognized by ColdFusion. If I had used destinaiton= in the cfpdf tag, it would have worked fine, but I wanted to serve the document directly to the user, so I had to wrap it with toBinary.

Anyway - even with that little hitch at the end, it's far easier now to add watermarks to PDFs!
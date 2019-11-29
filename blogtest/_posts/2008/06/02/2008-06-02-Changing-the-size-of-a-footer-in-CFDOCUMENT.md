---
layout: post
title: "Changing the size of a footer in CFDOCUMENT"
date: "2008-06-02T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/02/Changing-the-size-of-a-footer-in-CFDOCUMENT
guid: 2853
---

Over on the <a href="www.bacfug.org">BACFUG</a> mailing list, a user asked:

<blockquote>
<p>
Is there a way to adjust the size of the footer in a PDF created with cfdocument? I'd like to put a table in the footer but it needs to be taller than the default size.  I can put the table in the content of the document but it needs to be at the bottom of the page anyway, so I'm hoping there's some sneaky way to change the footer size that I haven't found yet.
</p>
</blockquote>
<!--more-->
I double checked the docs and didn't see anything that directly addressed this, so my first instinct was to look at DDX. I've <a href="http://www.raymondcamden.com/index.cfm/2007/7/24/ColdFusion-8-Working-with-PDFs-Part-7">blogged</a> about how cool DDX is so it's one of the first things I check when working on a cfdocument/cfpdf issue. I did some digging and it looks like you can simply specify a larger size for the font of the footer. As an example:

<code>
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;StyleProfile name="bookFooter"&gt; &lt;Footer&gt; &lt;Right&gt; &lt;StyledText&gt; &lt;p
color="blue" font-size="28pt"&gt;Page &lt;_PageNumber/&gt; of &lt;_LastPageNumber/&gt;&lt;/p&gt;
&lt;/StyledText&gt; &lt;/Right&gt; &lt;/Footer&gt; &lt;/StyleProfile&gt;

     &lt;PDF result="preview"&gt;
        &lt;PDF source="doc1"&gt;
           &lt;Footer styleReference="bookFooter" /&gt;
        &lt;/PDF&gt;
     &lt;/PDF&gt;
&lt;/DDX&gt;
</code>

I specified a font-size of 28, which is rather large. You could modify that though until you get the desired effect. You can also specify the margin on the footer to give it more space.

DDX - bringing the sexy back to PDF (if that is even possible ;).
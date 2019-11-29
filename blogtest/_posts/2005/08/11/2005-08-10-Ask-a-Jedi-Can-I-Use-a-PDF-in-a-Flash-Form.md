---
layout: post
title: "Ask a Jedi: Can I Use a PDF in a Flash Form?"
date: "2005-08-11T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/11/Ask-a-Jedi-Can-I-Use-a-PDF-in-a-Flash-Form
guid: 690
---

Ryan asks:

<blockquote>
Okay jedi, how about a slightly harder question.  Can I embed a pdf inside a flashform?  using something similar to the way I embed a pdf in an html page:<br>
&lt;OBJECT ID="PDF" CLASSID="clsid:CA8A9780-280D-11CF-A24D-444553540000" WIDTH="800" HEIGHT="450"&gt;
 &lt;PARAM NAME="SRC" VALUE="/testing/testpdf.pdf"&gt;
&lt;OBJECT&gt;

I have tried wraping it in a &lt;cfformitem type="html"&gt; but it doesnt seem to work.  It doesnt throw an error, just nothing shows up.  Any ideas?
</blockquote>

The short answer is no. Flash's HTML support is pretty limited. From the documentation:

<blockquote>
For Flash forms, you can use the following text formatting tags, most of which correspond to HTML tags, in the text: a, b, br, font, i, img, li, p, textformat, and u. For details on using these formatting tags, see the Flash documentation. 
</blockquote>

You could, of course, link to a PDF file, even with a popup, so a click on the link in the Flash Grid would pop up a window containing the PDF.
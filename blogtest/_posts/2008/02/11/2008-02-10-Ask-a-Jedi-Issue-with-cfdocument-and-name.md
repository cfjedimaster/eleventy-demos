---
layout: post
title: "Ask a Jedi: Issue with cfdocument and name"
date: "2008-02-11T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/11/Ask-a-Jedi-Issue-with-cfdocument-and-name
guid: 2645
---

Eugene asks:

<blockquote>
<p>
Hi, I am learning from you article and havea a requirement to create and email/print PDF file out of an online html report.
I am trying the code bellow, but it doesn't work. What am I doing wrong? Would you let me know, please, how to make it work?
</p>
</blockquote>

Let's take a look at his code:

<code>
&lt;cfdocument format="PDF" name="c:\temp\myReport"&gt; 
&lt;html&gt; 
... my html report is here ... 
&lt;/html&gt;
&lt;/cfdocument&gt; 

&lt;cfpdf action="write" source="c:\temp\myReport"
destination="c:\temp\myPDF.pdf"&gt; 
</code>

I hate to say RTFM, but this is a perfect case where it would have helped. The docs for CFDOCUMENT state that the name attribute allows you to specify a variable to store the PDF created. It isn't a filename, but rather a variable name. If you run the code, the error makes mention of it: The string c:\temp\myReport is not a valid ColdFusion variable name. 

The solution is simple - switch to filename.
---
layout: post
title: "Ask a Jedi/Stump the Chump: CFDOCUMENT PDFs with Forms"
date: "2008-01-25T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/25/Ask-a-JediStump-the-Chump-CFDOCUMENT-PDFs-with-Forms
guid: 2616
---

Jay asks:

<blockquote>
<p>
I am tryin gto add a button, specifically an email button, to pdf created in CF8. I am not sure how to do this. I thought in CF8 you could create a pdf with CFDocument and in this process add buttons to do whatever. Is this possible? If so how?
</p>
</blockquote>

I marked this both as a "Ask a Jedi" and "Stump the Chump" because I'm not sure I have the exact right answer. I believe the answer is no though. From what I know - CF8 does let you work with PDF forms that were created in Acrobat/LiveCycle. So it can handle existing forms. It can even put an existing PDF Form inside a PDF made with CFDOCUMENT. But you can't create an interactive form from scratch with CFDOCUMENT. 

Now - if you want to get a bit down and dirty - you can use iText. They have a tutorial on creating <a href="http://itextdocs.lowagie.com/tutorial/forms/index.php">interactive forms</a>. For an excellent set of examples of using iText in ColdFusion, check out the <a href="http://cfsearching.blogspot.com/search/label/iText">iText category</a> over at cfSearching.
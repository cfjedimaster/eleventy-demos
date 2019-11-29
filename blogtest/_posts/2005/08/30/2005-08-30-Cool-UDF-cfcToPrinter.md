---
layout: post
title: "Cool UDF: cfcToPrinter"
date: "2005-08-30T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/30/Cool-UDF-cfcToPrinter
guid: 741
---

I don't normally highlight <a href="http://www.cflib.org">CFLib</a> resources, but I just thought this one was so cool it deserved special mention. Today I released <a href="http://www.cflib.org/udf.cfm?id=1332">cfcToPrinter</a>, a UDF by Jared Rypka-Hauer. What does it do? Well, as you know, CFCs have their own "pretty" view when you open them directly in the browser. The problem with this is that it is protected by RDS security. This makes sense, of course, but makes it difficult to share CFC documentation with others. This UDF removes that problem. It uses the same code as the "built-in" viewer to generate the documentation. It then returns either the HTML, or the binary data for the PDF or FlashPaper version. Here is an example from <a href="http://ray.camdenfamily.com/downloads/test.pdf">blog.cfc</a>.

Something interesting you should note in the UDF. It makes use of the fact that cfdocument can return it's data into a variable. That data could be written to a file, or cfoutput using a cfcontent tag first. The cfchart tag can also do this. I used this feature in my <a href="http://ray.camdenfamily.com/index.cfm/2005/7/23/Embedded-CFCHART-in-Flash-Forms--Part-3">CFCHART in Flash Forms</a> postings.
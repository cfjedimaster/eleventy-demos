---
layout: post
title: "getAllTheTexts - simple Apache Tika wrapper"
date: "2012-08-16T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/08/16/getAllTheTexts-simple-Apache-Tika-wrapper
guid: 4703
---

A few days ago a reader asked me if I had code that could handle extracting text from various document formats. There are multiple tools in ColdFusion that can do this. My first thought was to build a CFC that used a large switch block to shell out to the various different utilities. For some, this would be easy. CFPDF, for example, has a text extraction feature. Others would be a bit more work. You can convert PPTs and Word docs to PDF using CFDOCUMENT and then use CFPDF to extract text. Excel files can be parsed using CFSPREADSHEET. You get the idea.
<!--more-->
Before going down that route, however, I took a look at <a href="http://tika.apache.org/">Apache Tika</a>. Tika supports extracting metadata and text from numerous different text formats. (<a href="http://tika.apache.org/1.2/formats.html">Complete list of supported formats.</a>) 

Turns out Tika has a pretty simple API. How simple? I was able to get the code down to both extract text and return metadata in fewer than 50 lines. Here's the complete code for the CFC:

<script src="https://gist.github.com/3372326.js?file=gistfile1.cfm"></script>

As you can see, I make use of the excellent JavaLoader library (the development branch to be clear). Once you have an instance of the CFC, it is a simple matter of passing a filename to the read method. The metadata is <i>very</i> deep. For a PPTX I parsed I got info on the number of slides as well as the presentation template. It even returned a large amount of information on an MP3.

You can download the code plus a small example at the github repo: <a href="https://github.com/cfjedimaster/getallthetexts">https://github.com/cfjedimaster/getallthetexts</a>

Special thanks to Mark Mandel for help with a class loader issue I ran into and Jeff Coughlin as well.
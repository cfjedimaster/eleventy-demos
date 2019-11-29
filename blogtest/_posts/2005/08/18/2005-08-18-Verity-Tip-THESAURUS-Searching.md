---
layout: post
title: "Verity Tip: THESAURUS Searching"
date: "2005-08-18T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/18/Verity-Tip-THESAURUS-Searching
guid: 712
---

One of the cooler features of Verity and ColdFusion is the THESAURUS tool. This lets you search for documents and match words that have the same meaning as your original word.

As an example, searching CFLib UDF content with:

<div class="code"><FONT COLOR=TEAL>&lt;THESAURUS&gt;</FONT> cold</div>

returns UDFs with Cold Fusion in them as well as the <a href="http://www.cflib.org/udf.cfm?id=167">CalculateWindChill</a> UDF. Pretty sweet. It isn't exactly perfect though. For some reason it thought <b>black</b> was a match as well. 

One thing to note. The <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=ColdFusion_Documentation&file=00001328.htm">docs</a> imply that you must set up the thesaurus before using it. That isn't true. What you can't do with the OEMed version of Verity in ColdFusion is manipulate the thesaurus. The retail product does allow for it however.
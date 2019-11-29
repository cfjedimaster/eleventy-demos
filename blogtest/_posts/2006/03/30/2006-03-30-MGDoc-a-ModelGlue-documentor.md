---
layout: post
title: "MGDoc, a Model-Glue documentor"
date: "2006-03-30T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/30/MGDoc-a-ModelGlue-documentor
guid: 1180
---

<img src="http://ray.camdenfamily.com/images/mg.jpg" align="left" border="1" hspace="5"> If you haven't guessed it yet, I'm all about the <a href="http://www.model-glue.com">Model-Glue</a>. If I wasn't married, I'd ask Model-Glue to marry me. We would settle down in a small, ranch style house in the mid-west. I'd gladly stay at home so Model-Glue could go out into the work place, quickly and efficiently helping ColdFusion developers create better applications. Alas, it is a forbidden love...

As much as I love Model-Glue, one thing that bugs me is large XML config files. I've worked on a few sites now where the ModelGlue.xml files gets to be so huge, it's hard to navigate. That's why I've created <a href="http://ray.camdenfamily.com/downloads/mgdoc.zip">MGDoc</a>, a CFC that will parse your ModelGlue.xml file and create documentation from it.

This documentation is <i>heavily</i> based on the documentation you get with CFCs. So, um, Adobe, don't sue me, ok? I love Photoshop! By default the documentation is generated in HTML, but you can use PDF and Flash Paper as well. (For the Flash Paper I cribbed some code from Jared Rypka-Hauer's excellent <a href="http://www.cflib.org/udf.cfm?ID=1332">cfcToPrinter</a> UDF.) For an example in PDF, here is the config file from the ColdFusion Cookbook:

<a href="http://ray.camdenfamily.com/downloads/mg.pdf">http://ray.camdenfamily.com/downloads/mg.pdf</a>

The code is not quite done yet. It is missing a few of the optional things you can supply to views and broadcasts. But - play with it - and let me know. I think the text is a bit big in PDF format, but in general, I think the layout is nice. (Although again I can't take credit for the table styles.)
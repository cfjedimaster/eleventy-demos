---
layout: post
title: "How do you do X in CFScript?"
date: "2010-03-17T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/17/How-do-you-do-X-in-CFScript
guid: 3752
---

With ColdFusion 9 allowing for script-based CFCs, a lot more people (I assume!) are making use of CFScript. Adobe expanded support for many (but not yet all) of ColdFusion tags into script. You may, however, forget exactly how things are implemented. For example, the cfdump tag is writeDump in CFScript. If you want a handy reference to this, you need to use the ColdFusion Developer's Guide, not the CFML Reference. In the chapter/section, "The CFML Programming Language / Extending ColdFusion Pages with CFML Scripting" you will find the following table:

<a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSe9cbe5cf462523a02805926a1237efcbfd5-7ffe.html">What is supported in CFScript</a>

It gives you a nice tag to script comparison to help you remember how things are implemented. 

For the items implemented as CFCs, you can then look at <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSe9cbe5cf462523a0693d5dae123bcd28f6d-8000.html">Script Functions Implemented as CFCs</a>, which oddly goes back to the CFML Reference.
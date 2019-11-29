---
layout: post
title: "MAX:  Advanced ColdFusion MX 7 Printing and Reporting"
date: "2005-10-17T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/17/Max-Advanced-ColdFusion-MX-7-Printing-and-Reporting
guid: 853
---

Notes from Dean Harmon's presentation on CFDOCUMENT/CFREPORT:

<b>cfdocument</b><br>
Stressed the importance of "complete" HTML documents.
Each cfdocumentsection needs to be a complete HTML doc.
Well formced CSS works file. Border Collapse and Float-Left do not.
cfdcoument src attribute is BETTER than using cfhttp to suck down the contents.
Multiple header/footers will not work. Only the last one will win.
Therefore, use documentsection. But it forces a page break.
It's a CF bug that will hopefully be fixed.

<b>cfreport</b><br>
Most things in CFR are expressions.
Use same logic as what you could put in Evaluate().
Cant use tags, but could use IIF(), with DE().
You can use tag syntax in a cfr using Report Functions.

<b>Richer and conditional formatting</b><br>
7.0 - not optimal.
7.01 - things are a bit better. basic html support, must be xhtml compliant, does not work in FP.
Support will be improved in the future.

<b>Making decent excel files</b><br>
Spaces are very important.
Use zoom.
Simpler layout is best.
"Fancy formatting makes for funky files"
Don't use number formatting as excel will treat them as strings, not numbers.

<b>parameters</b>,br>
Params are uni-directional.
Data can go from cfm to cfr.
From master report to child report.
You CANT pass from cfr to cfm.
You cANT pass from child to master.
You can use the shared scopes to get around this, ie, child report can set request variable.

<b>how to force a page break</b><br>
Make a cfr called cfreport_pagebreak.cfr - see his preso for more notes on the fix. (It's involved.)
---
layout: post
title: "ColdFusion Spreadsheet Bug with Formulas"
date: "2011-06-03T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/03/ColdFusion-Spreadsheet-Bug-with-Formulas
guid: 4256
---

A few days ago a reader asked me how to use ColdFusion to read the value of a spreadsheet cell that was defined by a value. I quickly created a spreadsheet where I used a sum formula to give the total of a number in the first two columns. ColdFusion allows you then to get both the actual value and the formula which is kinda cool. Consider:
<!--more-->
<p>

<code>
&lt;cfset f = expandPath("./book1.xlsx")&gt;
&lt;cfset s = spreadsheetRead(f)&gt;
&lt;cfset value = spreadsheetGetCellValue(s, 1,3)&gt;
&lt;cfoutput&gt;Value in C1 is ...#value#&lt;/cfoutput&gt;
&lt;p&gt;
&lt;cfset formula = spreadsheetGetCellFormula(s, 1,3)&gt;
&lt;cfoutput&gt;Based on formula... #formula#&lt;/cfoutput&gt;
&lt;p&gt;
</code>

<p>

What's cool is that the spreadsheet object is "live" - if you change the value of one one of the numbers and run spreadsheetGetCellValue again, you will see the updated result. The reader took my code and tried it on his spreadsheet but something weird happened. The exact same code (except for what row/cell he used) returns <b>the formula for both calls!</b> I thought perhaps it was a file issue. But when I replaced his formula with a simple Sum it worked correctly again. I have no idea why his formula 'broke' ColdFusion's getCellValue call. He has already logged a bug report for it. For those who are curious, here is the formula. It's not simple - but it seems like it should be work (note - I added a few spaces to make it wrap nicely):

<p>

=(IF($B$3>=$B16,0, MIN(((1-$B$7)*$B$6*((1+$B$11)^(((YEAR(EOMONTH($B16,0))- YEAR(EOMONTH($B$3,0)))*12)+ MONTH(EOMONTH($B16,0))- MONTH(EOMONTH($B$3,0)))-1)),$B$8))- IF($B$3>=$B16,0,MIN(((1-$B$7)*$B$6* ((1+$B$11)^(((YEAR(EOMONTH($B16,-1))- YEAR(EOMONTH($B$3,0)))*12)+ MONTH(EOMONTH($B16,-1))-MONTH(EOMONTH($B$3,0)))-1)),$B$8)))* (1/DAY(EOMONTH(B16,0)))
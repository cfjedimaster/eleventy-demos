---
layout: post
title: "Ask a Jedi: Working with Excel"
date: "2005-09-12T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/12/Ask-a-Jedi-Working-with-Excel
guid: 766
---

A reader asks:

<blockquote>
I'm having trouble creating excel spreadsheets. can't get the line feeds to work right. it's all one blob.
</blockquote>

Generating Excel files from ColdFusion, in general, is simple enough. Getting Excel to properly render the data, however, can be a real pain in the rear. Luckily, modern versions of Excel (Excel 2000 and higher) allow you to generate Excel files in simple HTML. This makes Excel reports about as simple as they can be. You can even include formulas and conditional formatting. Let's take a quick look at a simple example:

<div class="code"><FONT COLOR=MAROON>&lt;cfsetting showdebugoutput=false&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset data = queryNew(<FONT COLOR=BLUE>"name,age,gender"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"50"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset queryAddRow(data)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"name"</FONT>,<FONT COLOR=BLUE>"Name #x#"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"age"</FONT>,randRange(<FONT COLOR=BLUE>20</FONT>,<FONT COLOR=BLUE>40</FONT>))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif randRange(<FONT COLOR=BLUE>0</FONT>,<FONT COLOR=BLUE>1</FONT>) is<FONT COLOR=BLUE> 1</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"gender"</FONT>,<FONT COLOR=BLUE>"Male"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"gender"</FONT>,<FONT COLOR=BLUE>"Female"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfcontent TYPE=<FONT COLOR=BLUE>"application/msexcel"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfheader name=<FONT COLOR=BLUE>"content-disposition"</FONT> value=<FONT COLOR=BLUE>"attachment;filename=report.xls"</FONT>&gt;</FONT>  <br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;table width=<FONT COLOR=BLUE>"100%"</FONT> border=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;th&gt;</FONT>Name<FONT COLOR=TEAL>&lt;/th&gt;</FONT><FONT COLOR=TEAL>&lt;th&gt;</FONT>Gender<FONT COLOR=TEAL>&lt;/th&gt;</FONT><FONT COLOR=TEAL>&lt;th&gt;</FONT>Age<FONT COLOR=TEAL>&lt;/th&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput query=<FONT COLOR=BLUE>"data"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;tr<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif currentRow mod 2&gt;</FONT></FONT>bgcolor=<FONT COLOR=BLUE>"##ffff80"</FONT><FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&gt;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#name#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>#gender#<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif age gte 30&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;b&gt;</FONT>#age#<FONT COLOR=NAVY>&lt;/b&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#age#<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td align=<FONT COLOR=BLUE>"right"</FONT> colspan=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT><FONT COLOR=NAVY>&lt;b&gt;</FONT>Average:<FONT COLOR=NAVY>&lt;/b&gt;</FONT><FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>=AVERAGE(c2:c#data.recordCount+1#)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;/tr&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=TEAL>&lt;/table&gt;</FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

I'll skip over the first few lines as all it is doing is creating my data. The important lines begin with the cfcontent and cfheader tags. These are the tags that tell the browser to expect Excel data from the response. 

The rest of the code, in general, is nothing more than a simple HTML tag. I create a header. I loop over my query. I even do a bit of conditional formatting. You will notice that I change the bgcolor every other row, which makes things a bit easier to read. For the heck of it, I bolded the age of anyone over 30 (Logan's Run anyone?). The only real "special" code I included was this bit:

<div class="code"><FONT COLOR=TEAL>&lt;tr&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td align=<FONT COLOR=BLUE>"right"</FONT> colspan=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT><FONT COLOR=NAVY>&lt;b&gt;</FONT>Average:<FONT COLOR=NAVY>&lt;/b&gt;</FONT><FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=TEAL>&lt;td&gt;</FONT>=AVERAGE(c2:c#data.recordCount+1#)<FONT COLOR=TEAL>&lt;/td&gt;</FONT><br>
<FONT COLOR=TEAL>&lt;/tr&gt;</FONT></div>

The =AVERAGE line is a simple Excel formula that generates an average on the age of the people in my data. I knew that my age values were in column C, and that they started on the second line (the first line is the header). I then used data.recordCount+1 to ensure the average covered all the values from my data.

What is cool about this result is that, like any other Excel sheet, you can change the data and see the average update automatically.

Now - there is a lot more you can do with Excel then just averages, and do not forget that using this syntax requires a more modern version of Excel (although I think requiring a version from five years ago isn't so bad), but it is certainly a heck of a lot easier to generate the output. 

One more tip. Sometimes waiting for Excel to launch, even on a zippy system, can be a pain. Especially if you are just trying to modify the formatting a bit. One nice thing about the "HTML option" for generating Excel is - you can simply comment out the cfcontent/cfheader tags and render your table on screen. Once you get it perfect there, you can return the lines back in and double check to make sure it is still good in Excel.

<b>Edited:</b> Readers of my blog made multiple mentions of the POI project. Dave Ross has two good URLs in the comments section of this entry!
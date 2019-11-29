---
layout: post
title: "Is this a bug with ColdFusion Spreadsheet functionality?"
date: "2011-10-14T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/14/Is-this-a-bug-with-ColdFusion-Spreadsheet-functionality
guid: 4393
---

A user reported an odd bug to me, and as I've not done a lot with cfspreadsheet, I thought I'd share what we both saw and see if others agree that it is a bug. Take a simple Excel file with a few sheets in it.

<p/>

<code>
&lt;cfset source = "c:\users\raymond\desktop\book1.xlsx"&gt;
</code>

<p/>

Then read in sheet 2 only...

<p/>

<code>
&lt;cfscript&gt;
       sObj = SpreadSheetRead(source, 2);
       writedump(sobj);
</code>

<p/>

Which gives you:

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip202.png" />

<p/>

Right away - I notice something odd. The values are right - but note the summary info section. Apparently when you get sheet N, ColdFusion also returns high level info on the file as a whole. Ok... I can see that being useful. Let's carry on though.

<p/>

<code>
       SpreadSheetWrite(sObj, "c:\users\raymond\desktop\updatedFile.xlsx", "yes");
&lt;/cfscript&gt;
</code>

<p/>

We wrap the code with a write operation. From the docs for SpreadSheetWrite, we see:

<p/>

<blockquote>
Writes single sheet to a new XLS file from a ColdFusion spreadsheet object.
</blockquote>

<p/>

Which implies, very strongly, it is going to write a <b>single sheet</b>. However, in our testing, it actually wrote all the sheets to the next file. Actually, I just noticed further down in the docs for SpreadSheetWrite:

<p/>

<blockquote>
Write multiple sheets to a single file
</blockquote>

<p/>

And I see there is a function to set an <i>active</i> sheet in a spreadsheet object. This to me implies that even when we read in sheet N of file X, we have an object that contains <b>all</b> the sheets. We just work with one at a time. Therefore, the only way to 'rip out' a sheet would be to create a whole new object and copy the data cell by cell. Is there a better way?
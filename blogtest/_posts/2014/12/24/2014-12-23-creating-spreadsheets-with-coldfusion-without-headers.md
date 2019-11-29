---
layout: post
title: "Creating Spreadsheets with ColdFusion without headers"
date: "2014-12-24T06:27:22+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/12/24/creating-spreadsheets-with-coldfusion-without-headers
guid: 5483
---

This question came in yesterday and I thought I'd share it. Paul asked a simple question - he had a query and wanted to write it to a spreadsheet <strong>without</strong> having the query columns being used as headers. There is an excludeHeaderRow attribute in cfspreadsheet, but it applies to <i>reading</i> only.

<!--more-->

To properly handle this, you have to skip using cfspreadsheet completely. Instead, simply use the various spreadsheet functions to write out the query row by row. Here is an example minus the fake query created earlier.

<pre><code class="language-javascript">ss = spreadsheetNew(&quot;Main&quot;);
colList = parametersQuery.columnList;
for(i=1; i&lt;=parametersQuery.recordCount;i++) {
	rowStr = &quot;&quot;;
	row = [];
	for(x=1; x&lt;listLen(colList); x++) {
		col = listGetAt(colList, x);
		arrayAppend(row, parametersQuery[col][i]);
	}
	//writedump(row);
	rowStr = arrayToList(row);
	writeoutput(&quot;writing #rowStr#&lt;br&gt;&quot;);
	spreadsheetAddRow(ss, rowStr);
}
spreadsheetWrite(ss, expandPath('./' &amp; spreadsheetname),true);</code></pre>

In case you're wondering why I create an array and then turn it back into a list, that was done to ensure the empty cells are preserved in the spreadsheet row. 

So as I wrote this, I decided to look at the docs a bit more. It bugged me that all the functions seemed to require either a query or a list. Specifically, it bugged me that I couldn't pass an array. Using a list in this example is inherently dangerous because a query cell value could include a comma. I then noticed that <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/SpreadsheetAddRows">spreadsheetAddRows</a> <i>does</i> support using an array. Unfortunately the function is broken. Like, seriously - try the sample code at the link I just shared. First fix the typo of course (if I have time I'll edit the wiki page). You get this error trying to add rows: <code>Invalid row number (-1) outside allowable range (0..65535)</code>. I'll file a bug report and add the link as a comment.
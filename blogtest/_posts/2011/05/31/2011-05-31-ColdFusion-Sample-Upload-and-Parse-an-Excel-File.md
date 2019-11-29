---
layout: post
title: "ColdFusion Sample - Upload and Parse an Excel File"
date: "2011-05-31T22:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/31/ColdFusion-Sample-Upload-and-Parse-an-Excel-File
guid: 4252
---

In this ColdFusion sample I'm going to demonstrate how to allow users to upload Excel files and use ColdFusion to both validate and read the content within. Let's begin by designing a simple upload form.
<!--more-->
<p>

<pre><code class="language-markup">
&lt;cfif structKeyExists(variables, "errors")&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	&lt;b&gt;Error: #variables.errors#&lt;/b&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;
	
&lt;form action="test.cfm" enctype="multipart/form-data" method="post"&gt;
		  
	  &lt;input type="file" name="xlsfile" required&gt;
	  &lt;input type="submit" value="Upload XLS File"&gt;
		  
&lt;/form&gt;
</code></pre>

<p>

Nothing too complex here. The form has a grand total of one field - the file field named xlsfile. Note above the form is a simple set of ColdFusion logic to notice an errors variable and output it. In case you're curious, this value will be created a bit later in our example. So - let's process the upload. Here's the code that handles that.

<p>

<pre><code class="language-markup">
&lt;cfif structKeyExists(form, "xlsfile") and len(form.xlsfile)&gt;

	&lt;!--- Destination outside of web root ---&gt;
	&lt;cfset dest = getTempDirectory()&gt;

	&lt;cffile action="upload" destination="#dest#" filefield="xlsfile" result="upload" nameconflict="makeunique"&gt;

	&lt;cfif upload.fileWasSaved&gt;
		&lt;cfset theFile = upload.serverDirectory & "/" & upload.serverFile&gt;
		&lt;cfif isSpreadsheetFile(theFile)&gt;
			&lt;cfspreadsheet action="read" src="#theFile#" query="data" headerrow="1"&gt;
			&lt;cffile action="delete" file="#theFile#"&gt;
			&lt;cfset showForm = false&gt;
		&lt;cfelse&gt;
			&lt;cfset errors = "The file was not an Excel file."&gt;
			&lt;cffile action="delete" file="#theFile#"&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset errors = "The file was not properly uploaded."&gt;	
	&lt;/cfif&gt;
		
&lt;/cfif&gt;
</code></pre>

<p>

This code block begins with the field check used for our upload. If it exists, and has a value, we have to do some processing. We need a place to store the upload, and as we all know, <b>you never upload files to a directory under web root</b>. Therefore I used the temp directory as a quick storage place. I upload the file using cffile/action=upload. If the file was successfully uploaded, I use isSpreadsheetFile() to determine if the file was a valid spreadsheet. This covers XLS, XLSX, and even OpenOffice documents. If it is a valid spreadsheet, I read it in using the cfspreadsheet tag. Notice the last two arguments.

<p>

The query argument tells ColdFusion to parse the spreadsheet data into a query. This assumes we only want the first sheet. If you want to work with other sheets, that's definitely possible. 

<p>

The last argument, headerrow, tells ColdFusion to consider the first row to be column headers. It may not always be advisable to assume this. But for now, we will. 

<p>

The rest of that block simply handles errors and specifying if we should show the form again. If the user uploaded a valid spreadsheet we don't want to show the form. Instead, we want to display the contents. Let's look at how I did this.

<p>

<pre><code class="language-markup">
&lt;style&gt;
.ssTable {% raw %}{ width: 100%{% endraw %}; 
		   border-style:solid;
		   border-width:thin;
}
.ssHeader {% raw %}{ background-color: #ffff00; }{% endraw %}
.ssTable td, .ssTable th { 
	padding: 10px; 
	border-style:solid;
	border-width:thin;
}
&lt;/style&gt;

&lt;p&gt;
Here is the data in your Excel sheet (assuming first row as headers):
&lt;/p&gt;

&lt;cfset metadata = getMetadata(data)&gt;
&lt;cfset colList = ""&gt;
&lt;cfloop index="col" array="#metadata#"&gt;
	&lt;cfset colList = listAppend(colList, col.name)&gt;
&lt;/cfloop&gt;

&lt;cfif data.recordCount is 1&gt;
	&lt;p&gt;
	This spreadsheet appeared to have no data.
	&lt;/p&gt;
&lt;cfelse&gt;
	&lt;table class="ssTable"&gt;
		&lt;tr class="ssHeader"&gt;
			&lt;cfloop index="c" list="#colList#"&gt;
				&lt;cfoutput&gt;&lt;th&gt;#c#&lt;/th&gt;&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
		&lt;/tr&gt;
		&lt;cfoutput query="data" startRow="2"&gt;
			&lt;tr&gt;
			&lt;cfloop index="c" list="#colList#"&gt;
				&lt;td&gt;#data[c][currentRow]#&lt;/td&gt;
			&lt;/cfloop&gt;
			&lt;/tr&gt;					
		&lt;/cfoutput&gt;
	&lt;/table&gt;
&lt;/cfif&gt;
</code></pre>

<p>

So skipping over the CSS, the real meat of the work begins when we get the metadata. Why do we do this? ColdFusion's query object does not maintain the same order of columns that our spreadsheet had. I can use the getMetadata function on the query to get the proper column order. That's the array list you see there.

<p>

Next - we do a quick check of the size of the query. We are assuming our spreadsheet has a first row being used as headers. So if we assume that, and there is only one row, then we really don't have any data. Notice then in the next block of the conditional, we use startRow=2 to begin with where we figure the real data starts. After that it's a simple matter of outputting the query dynamically. (For an example of working with dynamic ColdFusion queries, see <a href="http://www.raymondcamden.com/index.cfm/2011/3/15/Outputting-a-ColdFusion-query-dynamically">this blog entry</a>.) 

<p>

How does it look? Here's the result of uploading a sample XLS sheet.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip102.png" />

<p>

And below is the complete template. Read on though for more...

<p>

<pre><code class="language-markup">
&lt;cfset showForm = true&gt;
&lt;cfif structKeyExists(form, "xlsfile") and len(form.xlsfile)&gt;

	&lt;!--- Destination outside of web root ---&gt;
	&lt;cfset dest = getTempDirectory()&gt;

	&lt;cffile action="upload" destination="#dest#" filefield="xlsfile" result="upload" nameconflict="makeunique"&gt;

	&lt;cfif upload.fileWasSaved&gt;
		&lt;cfset theFile = upload.serverDirectory & "/" & upload.serverFile&gt;
		&lt;cfif isSpreadsheetFile(theFile)&gt;
			&lt;cfspreadsheet action="read" src="#theFile#" query="data" headerrow="1"&gt;
			&lt;cffile action="delete" file="#theFile#"&gt;
			&lt;cfset showForm = false&gt;
		&lt;cfelse&gt;
			&lt;cfset errors = "The file was not an Excel file."&gt;
			&lt;cffile action="delete" file="#theFile#"&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset errors = "The file was not properly uploaded."&gt;	
	&lt;/cfif&gt;
		
&lt;/cfif&gt;

&lt;cfif showForm&gt;
	&lt;cfif structKeyExists(variables, "errors")&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		&lt;b&gt;Error: #variables.errors#&lt;/b&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	
	&lt;form action="test.cfm" enctype="multipart/form-data" method="post"&gt;
		  
		  &lt;input type="file" name="xlsfile" required&gt;
		  &lt;input type="submit" value="Upload XLS File"&gt;
		  
	&lt;/form&gt;
&lt;cfelse&gt;

	&lt;style&gt;
	.ssTable {% raw %}{ width: 100%{% endraw %}; 
			   border-style:solid;
			   border-width:thin;
	}
	.ssHeader {% raw %}{ background-color: #ffff00; }{% endraw %}
	.ssTable td, .ssTable th { 
		padding: 10px; 
		border-style:solid;
		border-width:thin;
	}
	&lt;/style&gt;
	
	&lt;p&gt;
	Here is the data in your Excel sheet (assuming first row as headers):
	&lt;/p&gt;
	
	&lt;cfset metadata = getMetadata(data)&gt;
	&lt;cfset colList = ""&gt;
	&lt;cfloop index="col" array="#metadata#"&gt;
		&lt;cfset colList = listAppend(colList, col.name)&gt;
	&lt;/cfloop&gt;
	
	&lt;cfif data.recordCount is 1&gt;
		&lt;p&gt;
		This spreadsheet appeared to have no data.
		&lt;/p&gt;
	&lt;cfelse&gt;
		&lt;table class="ssTable"&gt;
			&lt;tr class="ssHeader"&gt;
				&lt;cfloop index="c" list="#colList#"&gt;
					&lt;cfoutput&gt;&lt;th&gt;#c#&lt;/th&gt;&lt;/cfoutput&gt;
				&lt;/cfloop&gt;
			&lt;/tr&gt;
			&lt;cfoutput query="data" startRow="2"&gt;
				&lt;tr&gt;
				&lt;cfloop index="c" list="#colList#"&gt;
					&lt;td&gt;#data[c][currentRow]#&lt;/td&gt;
				&lt;/cfloop&gt;
				&lt;/tr&gt;					
			&lt;/cfoutput&gt;
		&lt;/table&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;	
</code></pre>

<p>

<b>Your Homework!</b>

<p>

Your homework, if you chose to accept it, is to simply take the template and add a checkbox to toggle if the code should assume the first row is the header. It's not as simple as you think. Sure you can just get rid of that attribute, but you also have to update the display as well. Post your code to Pastebin and then share the url.

<p>

<b>Notes</b>

<p>

Why didn't I use the VFS to store the file? I did - but isSpreadsheetFile() always returns false on an XLS file in the VFS. Boo!

<p>

Like the style of this blog entry? (Simple example with a homework assignment.) If so - I'm thinking of doing more like it.
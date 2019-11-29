---
layout: post
title: "Quick followup to my CFSpreadSheet Samples"
date: "2011-07-11T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/11/Quick-followup-to-my-CFSpreadSheet-Samples
guid: 4301
---

A few weeks ago I blogged a few quick and simple CFSpreadSheet examples. (You can find links to them at the bottom of this blog post.) I was having an email conversation with a reader when an interesting technique came up. Given that you might want to generate random Excel files for different users, how would you ensure that one user doesn't get another user's file? For example, if you follow my <a href="http://www.raymondcamden.com/index.cfm/2011/6/1/ColdFusion-Sample--Create-an-Excel-File">first sample</a> you can see that the resultant Excel is saved to a file called myexcel.xls. Great, now what happens when two people run the application at the same time?
<!--more-->
<p>

If you guessed mass chaos and destruction, you win. You can get around it by using a random name, maybe something like this:

<p/>

<pre><code class="language-javascript">
&lt;cfset filename = createUUID() & ".xls"&gt;
</code></pre>

<p/>

But then you've got the job of cleaning up the files later on. (Not too difficult with a scheduled task.) But is there an even simpler way? If you don't need to save the Excel file on the server, then just pass it to the user via cfcontent. Given my first example uses a variable called S, you can just do this:

<p/>

<pre><code class="language-javascript">
&lt;cfcontent type="application/msexcel" variable="#s#" reset="true"&gt;
</code></pre>

<p/>

Right? Nope. It gives you:

<p/>

<blockquote>
<h2>Attribute validation error for tag cfcontent.</h2>

coldfusion.excel.ExcelInfo is not a supported variable type. The variable is expected to contain binary data.
</blockquote>

<p/>

Ugh. This <i>should</i> just work. Luckily you can just wrap the variable with SpreadSheetReadBinary:

<p/>

<pre><code class="language-javascript">
&lt;cfcontent type="application/msexcel" variable="#spreadsheetReadBinary(s)#" reset="true"&gt;
</code></pre>

<p/>

Here's the entire modified version of app. It now  sends the Excel sheet directly to the user.  Note I also added a cfheader to give it a proper name.

<p/>

<pre><code class="language-javascript">
&lt;cfif not structKeyExists(form, "doit")&gt;
	
	&lt;form action="test.cfm" method="post"&gt;
		&lt;table&gt;
			&lt;tr&gt;
				&lt;th&gt;Name&lt;/th&gt;
				&lt;th&gt;Beers&lt;/th&gt;
				&lt;th&gt;Vegetables&lt;/th&gt;
				&lt;th&gt;Fruits&lt;/th&gt;
				&lt;th&gt;Meats&lt;/th&gt;
			&lt;/tr&gt;
		&lt;cfloop index="x" from="1" to="10"&gt;
			&lt;cfoutput&gt;
			&lt;tr&gt;
				&lt;td&gt;&lt;input type="text" name="name_#x#"&gt;&lt;/td&gt;
				&lt;td&gt;&lt;input type="text" name="beers_#x#"&gt;&lt;/td&gt;
				&lt;td&gt;&lt;input type="text" name="veggies_#x#"&gt;&lt;/td&gt;	
				&lt;td&gt;&lt;input type="text" name="fruits_#x#"&gt;&lt;/td&gt;	
				&lt;td&gt;&lt;input type="text" name="meats_#x#"&gt;&lt;/td&gt;
			&lt;/tr&gt;
			&lt;/cfoutput&gt;
		&lt;/cfloop&gt;
		&lt;/table&gt;
		&lt;input type="submit" name="doit" value="Create Excel File"&gt;
	&lt;/form&gt;
		
&lt;cfelse&gt;
	
	&lt;cfset q = queryNew("Name,Beers,Vegetables,Fruits,Meats", "cf_sql_varchar,cf_sql_integer,cf_sql_integer,cf_sql_integer,cf_sql_integer")&gt; 
	&lt;cfloop index="x" from="1" to="10"&gt;
		&lt;cfset queryAddRow(q)&gt;
		&lt;cfset querySetCell(q, "Name", form["name_#x#"])&gt;
		&lt;cfset querySetCell(q, "Beers", form["beers_#x#"])&gt;
		&lt;cfset querySetCell(q, "Vegetables", form["veggies_#x#"])&gt;
		&lt;cfset querySetCell(q, "Fruits", form["fruits_#x#"])&gt;
		&lt;cfset querySetCell(q, "Meats", form["meats_#x#"])&gt;
	&lt;/cfloop&gt;
	
	&lt;cfset filename = expandPath("./myexcel.xls")&gt;
	&lt;!---
	&lt;cfspreadsheet action="write" query="q" filename="#filename#" overwrite="true"&gt;
	---&gt;
	&lt;!--- Make a spreadsheet object ---&gt;
	&lt;cfset s = spreadsheetNew()&gt;
	&lt;!--- Add header row ---&gt;
	&lt;cfset spreadsheetAddRow(s, "Name,Beers,Vegetables,Fruits,Meats")&gt;
	&lt;!--- format header ---&gt;	
	&lt;cfset spreadsheetFormatRow(s,
			{
				bold=true,
				fgcolor="lemon_chiffon",
				fontsize=14
			}, 
			1)&gt;
	
	&lt;!--- Add query ---&gt;
	&lt;cfset spreadsheetAddRows(s, q)&gt;
&lt;!---
	&lt;cfset spreadsheetWrite(s, filename, true)&gt;
		
	Your spreadsheet is ready. You may download it &lt;a href="myexcel.xls"&gt;here&lt;/a&gt;.
---&gt;

	&lt;cfheader name="content-disposition" value="attachment; filename=myexcel.xls"&gt;
	&lt;cfcontent type="application/msexcel" variable="#spreadsheetReadBinary(s)#" reset="true"&gt;
&lt;/cfif&gt;
</code></pre>
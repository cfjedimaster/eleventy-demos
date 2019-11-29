---
layout: post
title: "ColdFusion Sample - Create an Excel File"
date: "2011-06-01T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/01/ColdFusion-Sample-Create-an-Excel-File
guid: 4253
---

In this ColdFusion sample, I'll demonstrate a simple way to take form input and generate an Excel spreadsheet file. This is a simple example with a very basic form, but hopefully it will give you enough to go by to create your own similar application.
<!--more-->
<p>

Let's begin by creating a simple form. This form is going to ask for 10 rows of data that mimics the Excel sheet I uploaded in my <a href="http://www.raymondcamden.com/index.cfm/2011/5/31/ColdFusion-Sample--Upload-and-Parse-an-Excel-File">previous blog entry</a>. It will ask for a name and the number of beers, vegetables, fruits, and meats consumed. 

<p>

<code>
&lt;form action="test2.cfm" method="post"&gt;
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
</code>

<p>

This form could be more dynamic of course. You could present 3 rows and use jQuery (or another less capable JavaScript framework) to easily add additional rows for input. But to keep things simple the form will just create 10 rows. Here's how it looks - and again - more work could be done to make this friendlier to the end user.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip103.png" />

<p>

Ok - now to generate the spreadsheet. Let's look at an example.

<p>

<code>
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
&lt;cfspreadsheet action="write" query="q" filename="#filename#" overwrite="true"&gt;
</code>

<p>

We begin by turning the form data into a query. This is done by looping from 1 to 10 and grabbing the relevant values from the Form struct. You could do a trim and other checks here as well. The real magic of this code block is the last line. All it takes to create a spreadsheet in ColdFusion is one line. You pass in the query, filename, and... that's it! While this works, the output is a bit plain. Let's now look at a slight modification.

<p>

<code>
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
&lt;cfset spreadsheetWrite(s, filename, true)&gt;
</code>

<p>

This version is a bit more complex. We begin creating a blank spreadsheet object. Next we add the header row. We can format both cells and rows, and in this example I've gone ahead and formatted the header. You have many options but I used just bold, fgcolor, and fontsize. (No one make any comments about lemon chiffon, it rocks.) 

<p>

Next I add the data using spreadsheetAddRows and write out the data. Here's a quick example of the result.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip104.png" />

<p>

Here's the entire code template.

<p>

<code>
&lt;cfif not structKeyExists(form, "doit")&gt;
	
	&lt;form action="test2.cfm" method="post"&gt;
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
	&lt;cfset spreadsheetWrite(s, filename, true)&gt;
		
	Your spreadsheet is ready. You may download it &lt;a href="myexcel.xls"&gt;here&lt;/a&gt;.

&lt;/cfif&gt;
</code>

<p>

<b>Your Homework!</b>

<p>

In the code template above, I save the file and use HTML to link to it. Modify this template to instead serve the content to the user immediately. Also - use another ColdFusion function to specify a numeric formatting for the columns (all of the ones but name).
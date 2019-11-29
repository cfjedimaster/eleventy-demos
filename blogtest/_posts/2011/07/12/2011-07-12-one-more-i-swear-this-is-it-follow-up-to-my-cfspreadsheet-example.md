---
layout: post
title: "One more (I swear this is it) follow up to my CFSpreadSheet Example"
date: "2011-07-12T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/12/one-more-i-swear-this-is-it-follow-up-to-my-cfspreadsheet-example
guid: 4302
---

Ok, I promise, pinky swear, etc, that this is the last version of the little Excel generator I've now mentioned in two blog posts. Yesterday's <a href="http://www.raymondcamden.com/index.cfm/2011/7/11/Quick-followup-to-my-CFSpreadSheet-Samples">blog post</a> demonstrated a modification to the application that dynamically generated the Excel data instead of saving it to a hard coded file. This worked great - but than a reader asked for one more slight modification - a preview.
<!--more-->
<p/>

In the original script, the file is basically split into two parts. In the top portion, a form with ten rows of columns allows for basic user input. When the form is submitted the second half simply converts the form data into a query and passes it to the relevant spreadsheet functions.

<p/>

I modified the script not to act in three parts. It isn't terribly long so I'll paste the entire script and explain the difference.

<p/>

<pre><code class="language-markup">
&lt;cfif structIsEmpty(form)&gt;
	
	&lt;form method="post"&gt;
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
		&lt;input type="submit" name="preview" value="Preview Excel File"&gt;
	&lt;/form&gt;
		
&lt;cfelseif not structKeyExists(form, "doit")&gt;
	
	&lt;cfset q = queryNew("Name,Beers,Vegetables,Fruits,Meats", "cf_sql_varchar,cf_sql_integer,cf_sql_integer,cf_sql_integer,cf_sql_integer")&gt; 
	&lt;cfloop index="x" from="1" to="10"&gt;
		&lt;cfif len(trim(form["name_#x#"]))&gt;
			&lt;cfset queryAddRow(q)&gt;
			&lt;cfset querySetCell(q, "Name", form["name_#x#"])&gt;
			&lt;cfset querySetCell(q, "Beers", form["beers_#x#"])&gt;
			&lt;cfset querySetCell(q, "Vegetables", form["veggies_#x#"])&gt;
			&lt;cfset querySetCell(q, "Fruits", form["fruits_#x#"])&gt;
			&lt;cfset querySetCell(q, "Meats", form["meats_#x#"])&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;

	&lt;h2&gt;Preview&lt;/h2&gt;
	&lt;table border="1"&gt;
		&lt;tr&gt;
			&lt;th&gt;Name&lt;/th&gt;
			&lt;th&gt;Beers&lt;/th&gt;
			&lt;th&gt;Vegetables&lt;/th&gt;
			&lt;th&gt;Fruits&lt;/th&gt;
			&lt;th&gt;Meats&lt;/th&gt;
		&lt;/tr&gt;
		&lt;cfoutput query="q"&gt;
		&lt;tr&gt;
			&lt;td&gt;#name#&lt;/td&gt;
			&lt;td&gt;#beers#&lt;/td&gt;
			&lt;td&gt;#vegetables#&lt;/td&gt;
			&lt;td&gt;#fruits#&lt;/td&gt;
			&lt;td&gt;#meats#&lt;/td&gt;
		&lt;/tr&gt;
		&lt;/cfoutput&gt;
	&lt;/table&gt;

	&lt;cfoutput&gt;	
	&lt;form method="post"&gt;
	&lt;input type="hidden" name="q" value="#htmlEditFormat(serializeJSON(q,true))#"&gt;
	&lt;input type="submit" name="doit" value="Generate Excel"&gt;
	&lt;/form&gt;
	&lt;/cfoutput&gt;

&lt;cfelse&gt;

	&lt;cfset q = deserializeJSON(form.q,false)&gt;

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

	&lt;cfheader name="content-disposition" value="attachment; filename=myexcel.xls"&gt;
	&lt;cfcontent type="application/msexcel" variable="#spreadsheetReadBinary(s)#" reset="true"&gt;


&lt;/cfif&gt;
</code></pre>

<p/>

So the top portion is pretty much the same as before, except now we've changed the submit button to explicitly say it's a Preview. The second branch converts the form data into a query. I modified it a bit to require a name to exist before a row is added to the query. I then use a simple (and somewhat ugly) table to render the preview.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip138.png" />

<p/>

To handle the third and final part, I used JSON to serialize the query and place it in a hidden form field. This then let's me just deserialize it in the final step and pass it right on to the ColdFusion spreadsheet functions. That's it. No more blog posts on spreadsheets. Not this week anyway.
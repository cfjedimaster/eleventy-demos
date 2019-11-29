---
layout: post
title: "Using CFDBINFO and CFZIP for quick database backups"
date: "2007-11-28T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/28/Using-CFDBINFO-and-CFZIP-for-quick-database-backups
guid: 2502
---

All major database products have tools to let you backup their databases. MySQL makes it super simple with their command line tools. But what if you want to do it with ColdFusion? Doesn't everyone want to do everything with ColdFusion? I know I do! So let's look at a quick example.
<!--more-->
My database backup code will work like so:

<ol>
<li>Get a list of tables from a datasource.
<li>Select all rows from the table.
<li>Convert the query into WDDX.
<li>Zip the giant XML string and store the result.
</ol>

The code for all this is incredibly simple:

<code>
&lt;cfset datasource="blogdev"&gt;

&lt;cfdbinfo datasource="#datasource#" name="tables" type="tables"&gt;
</code>

This code simply uses the new cfdbinfo tag to query the tables from the datasource.

<code>
&lt;!--- One struct to rule them all... ---&gt;
&lt;cfset data = structNew()&gt;
</code>

I'm going to store all my queries in one struct.

<code>
&lt;cfloop query="tables"&gt;
	&lt;!--- grab all data from table ---&gt;
	&lt;cfquery name="getData" datasource="#datasource#"&gt;
	select	*
	from	#table_name#
	&lt;/cfquery&gt;
	
	&lt;cfset data[table_name] = getData&gt;
&lt;/cfloop&gt;
</code>

Then I loop over each table and select *. Notice I store the query into the struct. By the way - the cfdbinfo tag also lets you get the columns from a database table. But since this is a "quickie" script, I don't mind using the select *.

<code>
&lt;!--- Now serialize into one ginormous string ---&gt;
&lt;cfwddx action="cfml2wddx" input="#data#" output="packet"&gt;
</code>

Then we convert the structure into one XML packet.

<code>
&lt;!--- file to store zip ---&gt;
&lt;cfset zfile = expandPath("./data.zip")&gt;

&lt;!--- Now zip this baby up ---&gt;
&lt;cfzip action="zip" file="#zfile#" overwrite="true"&gt;
	&lt;cfzipparam content="#packet#" entrypath="data.packet"&gt;
&lt;/cfzip&gt;
</code>

Next I store the string into a zip using the new cfzip and cfzipparam tags. Notice how I feed the string data to the zip using cfzipparam. I don't have to store the text into a temporary file. 

<code>
&lt;cfoutput&gt;
I retrieved #tables.recordCount# tables from datasource #datasource# and saved it to #zfile#.
&lt;/cfoutput&gt;
</code>

The last thing I do is output a simple result message so you know how much data was backed up. Here is the complete source in one listing:

<code>
&lt;cfset datasource="blogdev"&gt;

&lt;cfdbinfo datasource="#datasource#" name="tables" type="tables"&gt;

&lt;!--- One struct to rule them all... ---&gt;
&lt;cfset data = structNew()&gt;

&lt;cfloop query="tables"&gt;
	&lt;!--- grab all data from table ---&gt;
	&lt;cfquery name="getData" datasource="#datasource#"&gt;
	select	*
	from	#table_name#
	&lt;/cfquery&gt;
	
	&lt;cfset data[table_name] = getData&gt;
&lt;/cfloop&gt;

&lt;!--- Now serialize into one ginormous string ---&gt;
&lt;cfwddx action="cfml2wddx" input="#data#" output="packet"&gt;

&lt;!--- file to store zip ---&gt;
&lt;cfset zfile = expandPath("./data.zip")&gt;

&lt;!--- Now zip this baby up ---&gt;
&lt;cfzip action="zip" file="#zfile#" overwrite="true"&gt;
	&lt;cfzipparam content="#packet#" entrypath="data.packet"&gt;
&lt;/cfzip&gt;

&lt;cfoutput&gt;
I retrieved #tables.recordCount# tables from datasource #datasource# and saved it to #zfile#.
&lt;/cfoutput&gt;
</code>
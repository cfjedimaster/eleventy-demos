---
layout: post
title: "Interesting WDDX Bug with nulls"
date: "2007-11-21T12:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/21/Interesting-WDDX-Bug-with-nulls
guid: 2490
---

This is probably an old issue, but I thought I'd share it. I'm writing code to support exporting BlogCFC data into WDDX packets. The flip side of this is code to import the WDDX packets.

The export works just fine - but I ran into a weird issue when importing. I have some columns that are BIT type and allow nulls. When doing the database inserts, I got error saying it couldn't convert the bit value to a null.

Well, I figured - no big deal - I'll check to see if my value is boolean, and if not, I'll use null="true" in my cfqueryparam.

But get this - the CFIF threw an error! That was insane. How can I check if X is a boolean if the actual check throws 'X is not boolean' itself! 

I ended up having to use try/catch to rewrite the data:

<code>
&lt;cftry&gt;
	&lt;cfif not isBoolean(moderated)&gt;
		&lt;!--- nothing ---&gt;
	&lt;/cfif&gt;
	&lt;cfcatch&gt;
		&lt;cfset querySetCell(data, "moderated", "", currentRow)&gt;
	&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

Then I do this in my query:

<code>
&lt;cfif not isBoolean(moderated)&gt;
	&lt;cfqueryparam cfsqltype="cf_sql_bit" null="true"&gt;
&lt;cfelse&gt;
	&lt;cfqueryparam cfsqltype="cf_sql_bit" value="#moderated#"&gt;
&lt;/cfif&gt;
</code>

For a simple test script (and this is what I'll provide to Adobe), create a table with two columns, name and cool, where cool is a bit. Then insert a few rows and make cool null for one row. Then run this:

<code>
&lt;cfquery name="getit" datasource="test"&gt;
select	*
from	test
&lt;/cfquery&gt;

&lt;cfdump var="#getit#"&gt;

&lt;cfwddx action="cfml2wddx" input="#getit#" output="packet"&gt;

&lt;cfoutput&gt;#htmlcodeformat(packet)#&lt;/cfoutput&gt;

&lt;cfwddx action="wddx2cfml" input="#packet#" output="gigo"&gt;

&lt;cfoutput query="gigo"&gt;
	#name#
		&lt;cfif isBoolean(cool)&gt;
		#yesnoformat(cool)#
		&lt;/cfif&gt;
	&lt;br&gt;
&lt;/cfoutput&gt;
</code>

You will then get:

<b>cannot convert the value "''" to a boolean</b>

As a side note - it also appears to apply to ints as well. I wonder if it is an issue with any non-varchar column?
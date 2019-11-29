---
layout: post
title: "Ask a Jedi: Working with One Row from a Query"
date: "2005-11-02T14:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/02/Ask-a-Jedi-Working-with-One-Row-from-a-Query
guid: 891
---

A reader asks:

<blockquote>
How do you access the entire row when looping over a query?  When I pass the query name to a DAO object that loads a bean from a single record I always get the 1st record. Any ideas are greatly appreciated.
</blockquote>

There is no way to deal with just one row from a query, however, you can easily access any column and any row from a query using array notation. So to get the 5th row, column name, from query data, you could use:

&lt;cfset value = data.name[5]&gt;

If you leave off the row number, ColdFusion will assume you mean row 1, unless you are actively looping over a query in a cfloop or cfoutput. 

While there is no native way to deal with just a "row", you can use a UDF - <a href="http://www.cflib.org/udf.cfm?ID=358">QueryRowToStruct</a>. This UDF will take a row from a query and convert it to a structure. Here is an example:

<code>
&lt;cfset data = queryNew("id,name,aGe")&gt;

&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"aGe",randRange(20,90))&gt;
&lt;/cfloop&gt;

&lt;cfscript&gt;
/**
 * Makes a row of a query into a structure.
 * 
 * @param query 	 The query to work with. 
 * @param row 	 Row number to check. Defaults to row 1. 
 * @return Returns a structure. 
 * @author Nathan Dintenfass (nathan@changemedia.com) 
 * @version 1, December 11, 2001 
 */
function queryRowToStruct(query){
	//by default, do this to the first row of the query
	var row = 1;
	//a var for looping
	var ii = 1;
	//the cols to loop over
	var cols = listToArray(query.columnList);
	//the struct to return
	var stReturn = structnew();
	//if there is a second argument, use that for the row number
	if(arrayLen(arguments) GT 1)
		row = arguments[2];
	//loop over the cols and build the struct from the query row
	for(ii = 1; ii lte arraylen(cols); ii = ii + 1){
		stReturn[cols[ii]] = query[cols[ii]][row];
	}		
	//return the struct
	return stReturn;
}
&lt;/cfscript&gt;

&lt;cfset row5 = queryRowToStruct(data,5)&gt;
&lt;cfdump var="#row5#" label="Fifth Row"&gt;
</code>
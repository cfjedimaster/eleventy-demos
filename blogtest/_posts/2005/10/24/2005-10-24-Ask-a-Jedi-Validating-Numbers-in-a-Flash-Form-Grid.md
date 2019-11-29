---
layout: post
title: "Ask a Jedi: Validating Numbers in a Flash Form Grid"
date: "2005-10-24T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/24/Ask-a-Jedi-Validating-Numbers-in-a-Flash-Form-Grid
guid: 867
---

A reader asks:

<blockquote>
If you have an updatable grid, how do you validate a field numeric before it is submitted?
</blockquote>

This is one of those things that is pretty simple if you know ActionScript well. I don't, but have friends who do. Here is a simple example of it in action, and it can <i>definitely</i> be done better:

<code>
&lt;cfset data = queryNew("id,name,age")&gt;

&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
&lt;/cfloop&gt;


&lt;cfform format="flash" name="test" onSubmit="return checkNumbers()"&gt;
	&lt;cfformitem type="script"&gt;
	function checkNumbers() {
		for(var i=0; i &lt; people.dataProvider.length; i++) {
			var theValue = people.dataProvider[i].age;
			if(isNaN(theValue)) {
				outputarea.text = theValue + " is not a number.";
				return false;
			}
		}
		return true;

	}
	&lt;/cfformitem&gt;
	
	&lt;cfgrid name="people" query="data" selectMode="edit" /&gt;
	&lt;cfformitem type="text" id="outputarea" /&gt;
	&lt;cfinput type="submit" name="submit" value="Submit" /&gt;
&lt;/cfform&gt;
</code>

The beginning of the code simply creates a fake query for us to use. That query is passed to the cfgrid tag. Notice that I have turned on editing with selectMode="edit". To validate, I decided to use onSubmit. It may be possible to validate on change, but I had trouble getting it to work right. We use the new cfformitem type="script" to write a function that will check the values of our grid. I loop over every row in the grids dataProvider (just consider this the query behind the grid), and check the age column. (Technically I should check the ID as well.) I'm using isNaN which is short for "Is Not A Number" to check each value. If the value is bad, I write out an error and abort the form submission. You could even make this more intelligent and verify age is over 0, and below some sensible number like 130.
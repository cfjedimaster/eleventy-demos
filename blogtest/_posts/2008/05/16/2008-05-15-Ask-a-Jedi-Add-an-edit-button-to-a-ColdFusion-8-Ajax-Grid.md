---
layout: post
title: "Ask a Jedi: Add an edit button to a ColdFusion 8 Ajax Grid"
date: "2008-05-16T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/16/Ask-a-Jedi-Add-an-edit-button-to-a-ColdFusion-8-Ajax-Grid
guid: 2832
---

Kyle asks:

<blockquote>
<p>
In my application I currently have a table that is created from a cfoutput query, and for each row I have an edit button that links to an edit page passing an id as a url variable. I would like to change this table to a coldfusion 8 cfgrid (html
format), but I'm not seeing how you can do this in html format (from what U've read, it can only be done in flash format). Have you come across a way to do this in html?
</p>
</blockquote>
<!--more-->
This is something I've mentioned before, but don't forget you can include arbitrary HTML in your data passed to the grid. I'm not sure how far you can push it, but consider this sample:

<code>
&lt;cfquery name="entries" datasource="blogdev"&gt;
select   *
from   tblblogentries
limit 0,10
&lt;/cfquery&gt;

&lt;cfset queryAddColumn(entries,"editlink","varchar",arrayNew(1))&gt;

&lt;cfloop query="entries"&gt;
	&lt;cfsavecontent variable="edittext"&gt;
&lt;form action="test4.cfm" method="post"&gt;
&lt;cfoutput&gt;&lt;input type="hidden" name="id" value="#id#"&gt;&lt;/cfoutput&gt;
&lt;input type="submit" value="Edit"&gt;
&lt;/form&gt;
	&lt;/cfsavecontent&gt;
	&lt;cfset querySetCell(entries, "editlink", edittext, currentRow)&gt;
&lt;/cfloop&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" query="entries" width="600"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
   &lt;cfgridcolumn name="editlink" header=""&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfdump var="#form#"&gt;
</code>

I begin by doing a normal query. This grid isn't Ajax based, but that doesn't really matter. Note that I add a custom column named editlink. I then loop over the query. For each row, I create a form that simply has a hidden ID variable and a submit button. I then take this form (using the handy cfsavecontent tag) and store it into the query. 

I added the query column to the display, and that was it. I added a dump to the page so I could confirm the right ID was being passed. That's it really. Here is how the grid now renders:

<img src="https://static.raymondcamden.com/images/grid.jpg">

Again, I'm not quite sure this is "proper" usage of the grid, but it works!
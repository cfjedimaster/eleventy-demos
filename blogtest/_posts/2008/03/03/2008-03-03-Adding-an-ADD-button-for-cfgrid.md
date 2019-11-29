---
layout: post
title: "Adding an ADD button for cfgrid"
date: "2008-03-03T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/03/Adding-an-ADD-button-for-cfgrid
guid: 2686
---

Here is a question forwarded to me from Ben Forta. He thought I could take a stab at it so here is my answer.

<blockquote>
<p>
I am putting a query result set into a <cfgrid> from a cfc bind
statement (which works with no problem).  What I want to be able to do is have one grid column with an "ADD" button in it. When the button/cell is clicked it invokes another function that writes some data to a database.  Everything I have read only addresses the edit/delete mode of the grid data itself.  I want to "click" the item and have it add to another list/container/database.
</p>
</blockquote>
<!--more-->
This is something I <i>kind</i> of touched on before. When you pass a query to a cfgrid, you can include HTML in the query data. This HTML will render in the grid. So consider the following code.

<code>
&lt;cfquery name="entries" datasource="cfartgallery" maxrows="12"&gt;
select   *
from   art
&lt;/cfquery&gt;

&lt;cfset queryAddColumn(entries, "add", arrayNew(1))&gt;

&lt;cfloop query="entries"&gt;
	&lt;cfset querySetCell(entries, "add", "&lt;input value='Add' type='button' onclick='javascript:testit(#artid#)'&gt;", currentrow)&gt;
&lt;/cfloop&gt;
</code>

I took a simple query and added a new column, "add". I looped over the query and for each row, added an HTML button that calls a JavaScript function and passes the primary key of the row.

Just to ensure it works, here is the rest of the code:

<code>
&lt;script&gt;
function testit(x) {% raw %}{ alert(x);}{% endraw %}
&lt;/script&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" query="entries" width="600"&gt;
   &lt;cfgridcolumn name="artid" display="false"&gt;

   &lt;cfgridcolumn name="artname" header="Name"&gt;
   &lt;cfgridcolumn name="price" header="Price"&gt;
   &lt;cfgridcolumn name="add" header="Add"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

If you run this in your browser, you can click on any button and see the JavaScript called. So that's the difficult part really. If you want to pass this 'add action' to the server, you can use cfajaxproxy. I assume this part is easy, if folks want to see that part of the code, I can work that up as well.
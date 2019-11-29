---
layout: post
title: "Quick CFGRID Tip - disable sorting"
date: "2008-09-19T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/19/Quick-CFGRID-Tip-disable-sorting
guid: 3024
---

I really feel like this is something I've blogged before, or someone else, but Google is failing to find the result for me so I figure a quick blog entry is in order. How do you disable sorting for one column using the new HTML-based grids in ColdFusion 8?
<!--more-->
The answer involves going into the Ext docs and using their API. Let's start with a simple grid using inline data:

<code>
&lt;cfquery name="entries" datasource="blogdev"&gt;
select   *
from   tblblogentries
limit 0,10
&lt;/cfquery&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" query="entries" width="600"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

Now let's run some code on startup:

<code>
&lt;cfset ajaxonload("fixgrid")&gt;
</code>

This code will run JavaScript to handle our modification:

<code>
&lt;script&gt;
function fixgrid() {
	g = ColdFusion.Grid.getGridObject('entries');
//	console.dir(g);
	cols = g.getColumnModel();
	for(var i=0; i &lt; cols.getColumnCount(); i++) {
		var thisid = cols.getColumnId(i);
		var thiscol = cols.getColumnById(thisid);
		if(thiscol.header == "Title") thiscol.sortable = false;
	}
}
&lt;/script&gt;
</code>

All this code does is ask for the Ext Grid object that CF uses behind the scenes. I get the column model (an API to the columns), and then search for the proper column. Ext provides a clean getColumnById API, but since you can't set the IDs yourself, you have to search as I did above. Note that I disabled sorting where the header was Title. 

That's it. Enjoy.
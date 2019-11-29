---
layout: post
title: "Can you search a CFGRID?"
date: "2010-04-29T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/29/Can-you-search-a-CFGRID
guid: 3796
---

Here is an interesting question brought to me by Daniel F. Given a CFGRID on a page, is there a way to search through the data? He isn't talking about searching against the database and showing the results in the grid, but rather, simply searching through the client side data within the grid itself. I did some digging, and this is what I came up with. Please remember that ColdFusion 9 shipped with a much newer version of Ext than ColdFusion 8. So if you are still on the previous version of ColdFusion, the following code may not work.
<!--more-->
<p>

Let's begin by looking at the basic GRID code. I won't explain everything here as I assume most folks already know how the grid works. I've added a simple text field as well that will be used for our client side searching.

<p>

<code>
&lt;cfform name="test"&gt;

&lt;b&gt;Search:&lt;/b&gt; &lt;input type="text" id="search"&gt;&lt;br/&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" width="600" bind="url:getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

As a quick aside, getentries.cfm is a simple CFM that performs queries against a <a href="http://www.blogcfc.com">BlogCFC</a> database. Note that I'm asking ColdFusion to run a JavaScript function called init on load. Let's take a look at that now.

<p>

<code>
&lt;script&gt;
var grid;
function init() {
	grid = ColdFusion.Grid.getGridObject('entries')

	$("#search").change(function() {
		var val = $(this).val().toLowerCase()
		var sel = grid.getSelectionModel()
		var data = grid.getStore()
		var count = -1
		for(var i=0; i &lt; data.getCount(); i++) {
			var r = data.getAt(i)
			if(r.get("TITLE").toLowerCase().indexOf(val) &gt;= 0) {
				sel.selectRow(i)
				return
			}
		}
	})

}
&lt;/script&gt;
</code>

<p>

Ok, so lets take this line by line. I grab an pointer to the CFGRID object by using ColdFusion.Grid.getGridObject. This is done one time. I'm using jQuery (included earlier in the script but not shown here) so I can write a quick change handler on the form field. (And again, I probably should have used keyup instead. Doesn't really matter for this demo however.) 

<p>

I begin by lowercasing the value from the search field. Next, I ask the grid for it's selection model. This is an abstract object that will let me work with selections and the grid. As another aside, I didn't just make all this stuff up - but rather spent my time digging at the <a href="http://www.extjs.com/deploy/dev/docs/">Ext Docs</a>. Anyway, next I ask for the data store. Like the selection model, this result is tool that lets me interact with the data on the grid. 

<p>

Once I have that, it then becomes pretty trivial. I loop over the data and use getAt to return record objects. Once there, I use get("TITLE") to get the value in the title column. Obviously that would be data dependent. Also note I convert it to lower case and check to see if my match term matches anywhere in there. You can use a "complete" match for searching as well. Finally if a match is found, I use the selection model object to select it.

<p>

Here is a quick example of what the grid looks like on start:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-29 at 6.25.14 AM.png" title="Grid before searching" />

<p>

And here it is after I entered a search term:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-29 at 6.25.27 AM.png" title="Search and selected" />

<p>

Exciting stuff, right? I should point out that the Ext API is <i>very</i> powerful. There were other related things I could have done as well. For example, the data API contains an each function. It would let me run an anonymous function for each row. I didn't use that though as I wanted to be able to leave right away on a match. There is also a cool filter that, well, filters. That wouldn't select of course, but would do the search very nicely as well. Anyway, I've posted the complete source below, minus the source for getentries.cfm. If someone needs that, speak up.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var grid;
function init() {
	grid = ColdFusion.Grid.getGridObject('entries')

	$("#search").change(function() {
		var val = $(this).val().toLowerCase()
		var sel = grid.getSelectionModel()
		var data = grid.getStore()
		var count = -1
		for(var i=0; i &lt; data.getCount(); i++) {
			var r = data.getAt(i)
			if(r.get("TITLE").toLowerCase().indexOf(val) &gt;= 0) {
				sel.selectRow(i)
				return
			}
		}
	})

}

&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;cfform name="test"&gt;

&lt;b&gt;Search:&lt;/b&gt; &lt;input type="text" id="search"&gt;&lt;br/&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" width="600" bind="url:getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfset ajaxOnLoad("init")&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>
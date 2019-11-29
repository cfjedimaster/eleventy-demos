---
layout: post
title: "Ask a Jedi: Noticing an empty CFGRID"
date: "2009-04-09T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/09/Ask-a-Jedi-Noticing-an-empty-CFGRID
guid: 3309
---

Brett asked:

<blockquote>
<p>
I have a CFM with a CFGrid that uses a Bind to a CFC. On the CFM page a I have a few CFSelects that allow users to filter down the results being displayed in the CFGrid. I have also included a text input for keywords that uses a vertiy search
to filter the results down even more. However is there a way to display to the user that no records were found from their search, the only thing that I get now is an empty grid.
</p>
</blockquote>
<!--more-->
To get an idea of what Brett was talking about, I created a simple grid example that used a text box to filter results.

<code>
&lt;cfform name="test"&gt;
&lt;input type="text" name="filter"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" bind="cfc:test.getEntries({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %},{% raw %}{filter@keyup}{% endraw %})" width="600"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

The CFC method in the back end is a simple query against my blog database. I added an additional argument, filter, that will limit the results when something is typed in the filter. You can see an example of this <a href="http://www.raymondcamden.com/demos/emptygrid/m1/test.cfm">here</a>. Type something wacky (like dflkldfk) in the field and the grid will empty out. There is no real simple visual cue that the results were filtered to an empty set. (Well, ok, it is obvious to me, but I can see some users getting confused.)

I began to dig into the grid to see if there was a nice way to handle this. I started off by setting up a function to run when everything was loaded:

<code>
&lt;cfset ajaxOnLoad('init')&gt;
</code>

In my init() function, I began by grabbing a reference to the grid:

<code>
var mygrid = ColdFusion.Grid.getGridObject('entries')
</code>

I jumped over to the Ext docs and began to dig. I knew that I could get access to the datasource with the following:

<code>
var ds = mygrid.getDataSource()
</code>

Then I checked to see if there was an event I could listen for that involved data. Yep, a nicely named "load" event.

<code>
ds.addListener('load', function() {
</code>

The addListener function takes the name of an event to listen to and an inline function. 

So what next? The ds object represents the data. But here's the weird thing. Even when you see nothing in the grid, you still have 10 rows of data in the grid. I'm guessing this is something on the ColdFusion side, or perhaps just how Ext works. What you can do - though - is look at the data. This is what I used:

<code>
var count = 0;
ds.each(function() { 
	if(this.data.ID != null) count++
})
</code>

Basically, loop over the data, and check the field (ID comes from one of my columns) to see if it is null. This worked perfectly. I brought it all together by using jQuery to update a div when count was 0. It may be overkill to use jQuery for one line of code, but, meh, I'm a fan boy. So here is the entire CFM:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;
function init() {
	console.log('Ran')
	var mygrid = ColdFusion.Grid.getGridObject('entries')
	//console.dir(mygrid)
	var ds = mygrid.getDataSource()
	ds.addListener('load', function() {
		//console.dir(ds)
		var count = 0;
		ds.each(function() { 
			if(this.data.ID != null) count++
		})
		if(count == 0) $("#msg").text('Sorry, but there are no records to display.')
		else $("#msg").text('')
	})

};
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cfform name="test"&gt;
&lt;input type="text" name="filter"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" bind="cfc:test.getEntries({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %},{% raw %}{filter@keyup}{% endraw %})" width="600"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;div id="msg"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad('init')&gt;
</code>

Notice the new DIV at the bottom. That's just there for the message. You could use an alert or some other way to warn the user. You can play with this code <a href="http://www.coldfusionjedi.com/demos/emptygrid/m2/test.cfm">here</a>.
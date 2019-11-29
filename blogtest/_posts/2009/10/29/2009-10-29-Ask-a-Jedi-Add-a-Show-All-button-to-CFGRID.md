---
layout: post
title: "Ask a Jedi: Add a \"Show All\" button to CFGRID"
date: "2009-10-29T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/29/Ask-a-Jedi-Add-a-Show-All-button-to-CFGRID
guid: 3581
---

Brett asks:

<blockquote>
I was wondering if you have come across anything that would allow me to
have a "Show All" feature on a cfgrid. Basically I want to set the page size
equal to the recordcount. I have seen some options on the web, but nothing
that works for a CF8 html grid that binds to a cfc. Any info you can give me
would be great.
</blockquote>

Before I answer this - a quick warning. Don't forget that ColdFusion 9 has an entirely updated version of the embedded Ext controls. The code I show here works fine in ColdFusion 9, but has not been tested in ColdFusion 8. Ok, with that out of the way, here is the solution I found.
<!--more-->
First, a quick Google search turned up this gem: <a href="http://www.extjs.com/forum/archive/index.php/t-5524.html">Grid Page Size Refresh</a>. In this forum posting, the user uses the Datasource object from the Grid to update the size and refresh the data. Using his code as a sample, I whipped up the following simple example:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function showall() {
	console.log('hello')
	var theGrid = ColdFusion.Grid.getGridObject('entries')
	var ds = theGrid.getDataSource()
	ds.reload({% raw %}{params:{start:0,limit:ds.totalLength}}{% endraw %})
	theGrid.getView().refresh()
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" bind="url:getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title" width="600"&gt;
   &lt;cfgridcolumn name="posted" header="Posted" width="100"&gt;
&lt;/cfgrid&gt;
&lt;cfinput type="button" name="showallbtn" value="Show All" onclick="showall()"&gt;
&lt;/cfform&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

The bottom portion of the code block is a simple cfgrid bound to a CFM that returns blog entries. I've added a button below it that runs the function showall.

That function uses the ColdFusion Ajax API to get the native grid object and at that point, it's nothing more than figuring out the total size of the real data (i.e., ds.totalLenth) and passing that in as new parameters to the dataSource. Finally you do a quick resize and your golden. Here is a screen shot of the grid before the button is clicked:

<img src="https://static.raymondcamden.com/images/Screen shot 2009-10-29 at 12.05.22 PM.png" />

And here is a (slightly shrunk) version of it after clicking:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-10-29 at 12.05.56 PM.png" />

Obviously you don't want to do this on a very large set of data.
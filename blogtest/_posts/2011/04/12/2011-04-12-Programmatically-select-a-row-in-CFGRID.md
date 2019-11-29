---
layout: post
title: "Programmatically select a row in CFGRID"
date: "2011-04-12T19:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/12/Programmatically-select-a-row-in-CFGRID
guid: 4193
---

Ernie asked me if it was possible to select a row in CFGRID via JavaScript. I coulda sworn I had covered this before, but my search-fu failed to turn it up. Anyway, here is a super quick example of how to do it. It's works with ColdFusion 9 only - not ColdFusion 8. (Not as far as I know since the Ext API changed.)
<!--more-->
<p>

<code>
&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html"  width="600"
bind="url:getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"
height="150"&gt;
  &lt;cfgridcolumn name="id" display="false"&gt;
  &lt;cfgridcolumn name="body" display="false"&gt;

  &lt;cfgridcolumn name="title" header="Title"&gt;
  &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

<p>

This is a code sample from an old presentation I did on CF Ajax features. It uses a BlogCFC database on the back end and a file that serves up blog entry data to the grid. Since the data isn't relevant to the discussion I'm going to skip posting that. I began by adding a button and whipped up some code to select a row:

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function pickrow() {
       console.log("ran");
       g = ColdFusion.Grid.getGridObject("entries");
       console.dir(g);
       var sm = g.getSelectionModel();
       console.dir(sm);
       sm.selectRow(2);
       console.log("done");
}
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;
&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html"  width="600"
bind="url:getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"
height="150"&gt;
  &lt;cfgridcolumn name="id" display="false"&gt;
  &lt;cfgridcolumn name="body" display="false"&gt;

  &lt;cfgridcolumn name="title" header="Title"&gt;
  &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;input type="button" onclick="pickrow()" value="pickrow"&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The button is at the bottom and runs pickrow up top. pickrow simply grabs the Grid object, grabs the "SelectionModel" (think of it as an API to get/modify selections in the grid), and then just runs selectRow. I've hard coded it to 2 which will be the 3rd row. As a reminder - don't forget you can always check the Ext docs for deeper integration into ColdFusion's UI objects. Just be sure to check the version # of the API versus what ColdFusion is using natively.
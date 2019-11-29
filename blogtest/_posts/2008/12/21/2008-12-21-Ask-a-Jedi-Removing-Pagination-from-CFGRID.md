---
layout: post
title: "Ask a Jedi: Removing Pagination from CFGRID"
date: "2008-12-21T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/21/Ask-a-Jedi-Removing-Pagination-from-CFGRID
guid: 3156
---

Nathan asks:

<blockquote>
<p>
I am recently getting into CF8 and Ajax features and for doing so building a small application to add items to a cart. I have it setup currently that items are in a select box and a cfgrid shows some item information of the item selected. Since, at a time only one item can be selected, I want to remove the pagination that comes by default with cfgrid. I am able to do that if I get a result query and use the cfgrid with a query attribute, but if I go for a dynamic bind, the pagination controls are present.
</p>
</blockquote>
<!--more-->
This was an interesting problem. First, let's be sure we are clear on what Nathan is seeing. The sexy new CFGRID added in ColdFusion 8 allows you to either directly pass a query to the grid itself (with a query defined on the same page, or loaded via CFC, UDF, etc) or load it via Ajax. This is done with the bind attribute. 

If you pass the query to the grid then the pagination controls are not displayed. For example:

<img src="https://static.raymondcamden.com/images//Picture 128.png">

Even if you set a pagesize attribute, it will be ignored and the entire query will be displayed in the grid. Now compare this a grid that loads it's data via the bind attribute:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 213.png">

So how do you get rid of the bar? I knew that ColdFusion provided a function, ColdFusion.Grid.getGridObject, that would give me direct access to the grid. I figured then it would be a simple matter of checking the Ext API docs to see if there was a method to hide the panel.

I dug... and I dug... but I was unable to find anything that made sense to me. Using Firebug and the console.dir command (think of it as a ColdFusion dump), I finally found this:

<code>
var myGrid = ColdFusion.Grid.getGridObject('entries');
myGrid.view.getFooterPanel().setVisible(false);
myGrid.view.refresh();
</code>

This seemed to work well. I then added an ajaxOnLoad() call to run the code on load. Here is the complete example:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function testit() {
var myGrid = ColdFusion.Grid.getGridObject('entries');
myGrid.view.getFooterPanel().setVisible(false);
myGrid.view.refresh();
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html"  width="600" bind="url:getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
&lt;cfset ajaxOnLoad("testit")&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I'm not sure this is the best way to do it (I've actually got an Ext book on the way to me for review purposes), but it seems to work ok. Another solution would have been to use the drop down to drive a bound cfdiv tag. That cfdiv then could have loaded both an inline query and cfgrid.
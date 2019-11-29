---
layout: post
title: "Updating a drop down based on an HTML Grid Selection"
date: "2007-08-31T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/31/Updating-a-drop-down-based-on-an-HTML-Grid-Selection
guid: 2319
---

A user on cf-talk today asked if you could bind a drop down to an HTML grid. I tried it and got an error. The drop down expects a query or 2d array for it's source. Too bad. But - there is a solution. I blogged a few weeks ago about noting grid changes (<a href="http://www.raymondcamden.com/index.cfm/2007/8/9/Reacting-to-grid-row-selection">Reacting to a grid row selection</a>). This technique uses the CFAJAXPROXY tag to monitor the grid. In my previous blog entry, I just did an alert, but it's trivial to update a drop down as well. Consider the following example:

<more>

<code>
&lt;cfajaxproxy bind="javascript:fixCat({% raw %}{entries.category}{% endraw %})"&gt;

&lt;script&gt;
function fixCat(c) {
	var dd = document.getElementById('mycat');
	console.log(dd.options.length);
	for(var i=0; i&lt;dd.options.length;i++) {
		if(dd.options[i].value==c) dd.selectedIndex=i;
	}
}
&lt;/script&gt;
&lt;cfset q = queryNew("category,title")&gt;
&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(q)&gt;
	&lt;cfset rcat = listGetAt("Cat1,Cat2,Cat3", randRange(1,3))&gt;
	&lt;cfset querySetCell(q,"category", rcat)&gt;
	&lt;cfset querySetCell(q,"title", "Title #x#")&gt;
&lt;/cfloop&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" query="q" width="600" bindOnLoad="true"&gt;
   &lt;cfgridcolumn name="category" display="true"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
&lt;/cfgrid&gt;

&lt;cfinput type="text" name="thetitle" bind="{% raw %}{entries.title}{% endraw %}"&gt;
&lt;cfselect name="mycat" id="mycat"&gt;
&lt;option value="Cat1"&gt;Cat1
&lt;option value="Cat2"&gt;Cat2
&lt;option value="Cat3"&gt;Cat3
&lt;/cfselect&gt;
&lt;/cfform&gt;
</code>

So a good part of the code is my fake query and grid. You can pretty much ignore that. Note the first line uses cfajaxproxy with a bind attribute. This is what will fire and pass the proper column value to my function. I then just check the drop down option values and select it when I find a match. 

In the grid - why did I have display="true"? Well normally this would be a hidden column, but I wanted to double check my work and ensure that the code was working. Not that I make mistakes of course.

Off Topic P.S.: Today I discovered "Apocalpso" by Mew. Dang what a good song. I've played it about 10 times now. Of course, every time I hear a really cool song - the first thing I want to do is try to play it in Guitar Hero II!
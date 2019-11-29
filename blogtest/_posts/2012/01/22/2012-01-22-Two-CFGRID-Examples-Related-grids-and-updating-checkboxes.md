---
layout: post
title: "Two CFGRID Examples: Related grids and updating checkboxes"
date: "2012-01-22T14:01:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2012/01/22/Two-CFGRID-Examples-Related-grids-and-updating-checkboxes
guid: 4503
---

I've had a simple CFGRID demo sitting in my local web server for a few months now and never got around to sharing it on the blog. Today I responded to user with another CFGRID question and figured it would be good to share them both in one example. (Plus, the code has been sitting in my test.cfm file all that time and I want to get rid of it. ;) So let's start with the first example - relating one cfgrid to another.
<!--more-->
<p/>

I've got two simple cfgrids tied to the cfartgallery database. The first cfgrid is bound to the Media database table:

<p/>

<code>
&lt;cfgrid bind="cfc:test.getMedia({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %})" name="mediaGrid"
		format="html" width="400"&gt;
	&lt;cfgridcolumn name="mediaid" display="false"&gt;
	&lt;cfgridcolumn name="mediatype"&gt;
&lt;/cfgrid&gt;
</code>

<p/>

The CFC, test, has a basic query to grab the media info. Notice we have to support the 4 required arguments gridpage, pagesize, sortcolumn, and sortdirection, when binding with grids.

<p/>

<code>
component {

	remote struct function getMedia(page,size,col,dir) {
		var q = new com.adobe.coldfusion.query();
		q.setDatasource("cfartgallery");
		q.setSQL("select mediaid, mediatype from media");
		return queryConvertForGrid(q.execute().getResult(),page,size);
	}

}
</code>

<p/>

So far so good, right? Ok, how do I bind another grid to this one? 

<p/>

<code>
&lt;cfgrid bind="cfc:test.getArt({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %},{% raw %}{mediaGrid.mediaid}{% endraw %})" name="artGrid"
		format="html" width="400" bindonload="false"
		&gt;
	&lt;cfgridcolumn name="artname"&gt;
	&lt;cfgridcolumn name="price"&gt;
&lt;/cfgrid&gt;
</code>

<p/>

I've taken a normal bound cfgrid, and simply appended additional arguments to the end of the required list. In this case, I've bound to the first grid's mediaid column. Now all I need is a CFC method that handles this:

<p/>

<code>
remote struct function getArt(page,size,col,dir,media) {
	var q = new com.adobe.coldfusion.query();
	q.setDatasource("cfartgallery");
	q.setSQL("select artname, price, issold from art where mediaid = :mediaid");
	q.addParam(name="mediaid",value="#arguments.media#",cfsqltype="cf_sql_integer");
	return queryConvertForGrid(q.execute().getResult(),page,size);
}
</code>

</p>

Pretty simple, right? I don't really make use of ColdFusion's Ajax UI stuff any more, but it certainly does a good job of simplifying things. 

<p/>

Now let's take it a step further. What if we wanted to bind a checkbox to a grid? Turns out - there isn't a simple way to do this. Binding a text box is simple enough. If we add the issold property to the grid (to "listen" to data in a grid, it has to be a grid column) we can then work with it:

<p/>

<code>
&lt;cfgrid bind="cfc:test.getArt({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %},{% raw %}{mediaGrid.mediaid}{% endraw %})" name="artGrid"
		format="html" width="400" bindonload="false"
		&gt;
	&lt;cfgridcolumn name="artname"&gt;
	&lt;cfgridcolumn name="price"&gt;
	&lt;cfgridcolumn name="issold" display="false" &gt;
&lt;/cfgrid&gt;
</code>

<p/>

For my first test, I used a text field, just to ensure it was binding ok:

<p/>

<code>
&lt;cfinput type="text" name="issold" bind="{% raw %}{artGrid.issold}{% endraw %}"&gt;
</code>

<p/>

This worked, but wasn't the checkbox we wanted. What we really want is - bind to the grid's issold value and set or clear the checked attribute. cfinput does support a bindAttribute argument, but it only works with text fields, which seems truly odd. There's a simple enough workaround though. You can bind to a change in a grid by attaching it to a JavaScript function.

<p/>

<code>
&lt;cfajaxproxy bind="javascript:noteChange({% raw %}{artGrid.issold}{% endraw %})"&gt;
</code>

<p/>

This little gem here just says - when the grid changes, specifically the issold value, run a JavaScript function. We can then do:

<p/>

<code>
&lt;script&gt;
function noteChange(sold){
	var b = false;
	if (sold == 1) {
		b = true;
	} 
	document.getElementById("issoldcb").checked=b;
}
&lt;/script&gt;
</code>

<p/>

In case you're wondering, the logic there around sold was because it was being treated as a string. 

<p>

If you want to test this, try the demo here: <a href="http://www.raymondcamden.com/demos/2012/jan/22/test.cfm">http://www.raymondcamden.com/demos/2012/jan/22/test.cfm</a>
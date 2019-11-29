---
layout: post
title: "Preventing resizes in CFGRID Columns"
date: "2009-05-22T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/22/Preventing-resizes-in-CFGRID-Columns
guid: 3366
---

Ever want to stop the ability to resize columns in a CFGRID? There isn't a way to do this via tags, but as with other CFGRID hacks, you can do it once you get access to the underlying grid object. Let's look at an example.
<!--more-->
First, here is a simple grid using a hand-made query.

<code>
&lt;cfset data = queryNew("price,product")&gt;
&lt;cfloop from=1 to=10 index="x"&gt;
   &lt;cfset total = randRange(20,100) & "." & randRange(1,99)&gt;
   &lt;cfset product = "Product #X#"&gt;
   &lt;cfset queryAddRow(data)&gt;
   &lt;cfset querySetCell(data, "price", total+0, x)&gt;
   &lt;cfset querySetCell(data, "product", product, x)&gt;
&lt;/cfloop&gt;

&lt;p/&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="data" format="html" query="data" width="400"&gt;
&lt;cfgridcolumn name="price" header="Price"&gt;
&lt;cfgridcolumn name="product" header="Product"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

If you view this in your browser you will see that bother columns are resizable. To block resizing, we need to write code that will run page load, grab the column model, and modify the columns.

First, add the ajaxOnLoad:

<code>
&lt;cfset ajaxOnLoad("fixgrid")&gt;
</code>

and then we will use the following simple JavaScript:

<code>
fixgrid = function() {
	mygrid = ColdFusion.Grid.getGridObject('data')
	cm = mygrid.getColumnModel();

	for(var i=0; i&lt;cm.getColumnCount();i++) {
		col = cm.getColumnById(i)
		col.resizable=false
	}
	
	mygrid.reconfigure(mygrid.getDataSource(),cm);
}
</code>

In the code above, cm represents all our columns. We can grab each one by their index and simply set the resizable property. The reconfigure option resets the grid and now our columns aren't resizable. I created a quick Jing video (no audio) that demonstrates this.

<object width="627" height="467"> <param name="movie" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/bootstrap.swf"></param> <param name="quality" value="high"></param> <param name="bgcolor" value="#FFFFFF"></param> <param name="flashVars" value="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/FirstFrame.jpg&containerwidth=627&containerheight=467&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/00000004.swf"></param> <param name="allowFullScreen" value="true"></param> <param name="scale" value="showall"></param> <param name="allowScriptAccess" value="always"></param> <param name="base" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/"></param> <embed src="http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/bootstrap.swf" quality="high" bgcolor="#FFFFFF" width="627" height="467" type="application/x-shockwave-flash" allowScriptAccess="always" flashVars="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/FirstFrame.jpg&containerwidth=627&containerheight=467&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/00000004.swf" allowFullScreen="true" base="http://content.screencast.com/users/jedimaster/folders/Jing/media/368597e2-a4fc-4d4d-b25e-83fcd86b952f/" scale="showall"></embed> </object>
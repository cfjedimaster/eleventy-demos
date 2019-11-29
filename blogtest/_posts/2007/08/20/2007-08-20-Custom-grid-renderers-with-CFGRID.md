---
layout: post
title: "Custom grid renderers with CFGRID"
date: "2007-08-20T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/20/Custom-grid-renderers-with-CFGRID
guid: 2293
---

I've been playing a bit with CFGRID lately (as have others) and I found that by taking a look at <a href="http://extjs.com/">Ext's</a> documentation, there are some <b>very</b> powerful features hiding within the CFGRID tag. ColdFusion provides a function, ColdFusion.Grid.getGridObject, that when used gives you a handler to the underling Ext Grid object. By looking at the <a href="http://extjs.com/deploy/ext/docs/">documentation</a>, you can see which methods are available with the grid. One in particular I thought was pretty neat was the ability to add custom column renderers. What is that?

Well imagine you have data being fed into the grid that you do not have control over. For example - perhaps you have price information that isn't formatted nicely. Turns out Ext has a set of built in formatters that you can apply to grid columns, one of them being a money formatter. What if you have some other logic? Maybe you want to flag a price that is lower than 10 dollars? Again, using the Ext API, you can write your own formatter just for this purpose.

I've only just begun to scratch the surface of Ext, but here is a quick and dirty example to give you an idea of what is possible.
<!--more-->
First lets create a simple grid:

<code>
&lt;cfset data = queryNew("price,product")&gt;
&lt;cfloop from=1 to=10 index="x"&gt;
	&lt;cfset total = randRange(20,100) & "." & randRange(1,99)&gt;
	&lt;cfset product = "Product #X#"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data, "price", total+0, x)&gt;
	&lt;cfset querySetCell(data, "product", product, x)&gt;
&lt;/cfloop&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="data" format="html" query="data" width="600"&gt;
   &lt;cfgridcolumn name="price" header="Price"&gt;
   &lt;cfgridcolumn name="product" header="Product"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

I'm using a hard coded query with products and prices. This is then fed directly into the grid. Note that I'm not using Ajax here.

Now let's look at how we can add a custom column renderer. The first thing we need to do is to set up the page to call a function when the grid is done loading. We do this with ajaxOnLoad:

<code>
&lt;cfset ajaxOnLoad("testgrid")&gt;
</code>

Because I'm not "properly" using Ajax on my page, I also added an import:

<code>
&lt;cfajaximport/&gt;
</code>

I've mentioned this hack before, and credit goes to <a href="http://cfsilence.com/blog/client/">Todd Sharp</a> for discovering. Now let's look at the JavaScript:

<code>
myf = function(data,cellmd,record,row,col,store) {
	if(data == "Product 4") return "&lt;b&gt;" + data + "&lt;/b&gt;";
	else return data;
}
testgrid = function() {
	mygrid = ColdFusion.Grid.getGridObject('data');
	cm = mygrid.getColumnModel();
	cm.setRenderer(0, Ext.util.Format.usMoney);
	cm.setRenderer(1,myf);
	mygrid.reconfigure(mygrid.getDataSource(),cm);
}
</code>

Skip the first function and focus in on testgrid. Testgrid is a horrible name but I was just playing around with the code so forgive me. I grab the grid using the ColdFusion.Grid.getGridObject API mentioned before. Everything after this is based on my reading of the Ext docs. I grab the columns using the getColumnModel function. I apply a renderer to columns 0 and 1 (you will never convince me that 0 based indexes make sense). The first renderer is a built one named usMoney. The second one is a custom function named "myf". usMoney will do what you imagine - format money. The second was hard coded to look for Product 4, and when found, bold it. I then use reconfigure to apply the column model back to my grid.

You can see an example of this <a href="http://www.raymondcamden.com/demos/gridc.cfm">here</a>. Full source code is below.

<code>
&lt;cfajaximport/&gt;
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
		
myf = function(data,cellmd,record,row,col,store) {
	if(data == "Product 4") return "&lt;b&gt;" + data + "&lt;/b&gt;";
	else return data;
}
testgrid = function() {
	mygrid = ColdFusion.Grid.getGridObject('data');
	cm = mygrid.getColumnModel();
	cm.setRenderer(0, Ext.util.Format.usMoney);
	cm.setRenderer(1,myf);
	mygrid.reconfigure(mygrid.getDataSource(),cm);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfset data = queryNew("price,product")&gt;
&lt;cfloop from=1 to=10 index="x"&gt;
	&lt;cfset total = randRange(20,100) & "." & randRange(1,99)&gt;
	&lt;cfset product = "Product #X#"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data, "price", total+0, x)&gt;
	&lt;cfset querySetCell(data, "product", product, x)&gt;
&lt;/cfloop&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="data" format="html" query="data" width="600"&gt;
   &lt;cfgridcolumn name="price" header="Price"&gt;
   &lt;cfgridcolumn name="product" header="Product"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfset ajaxOnLoad("testgrid")&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>
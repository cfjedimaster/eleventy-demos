---
layout: post
title: "Custom grid renderers with CFGRID (2)"
date: "2010-07-20T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/20/Custom-grid-renderers-with-CFGRID-2
guid: 3885
---

Almost three years ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2007/8/20/Custom-grid-renderers-with-CFGRID">blog entry</a> on doing custom grid renderers with CFGRID and the Ext grid for ColdFusion 8. This week a reader and I went back and forth in the comments concerning how to build a renderer that would modify a column but check <i>other</i> column values for the logic. So for example, in that previous blog entry my logic for a custom product column was to check to see if the product was "Product 4". What if I wanted to check the price for example? Here is an updated version that works with ColdFusion 9 and does just that.
<p>
<!--more-->
<p>
<code>
&lt;cfajaximport/&gt;
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
		
myf = function(data,cellmd,record,row,col,store) {
	console.dir(record.data);
	//old logic, prod 4 only
	//if(data == "Product 4") return "&lt;b style='color:red'&gt;" + data + "&lt;/b&gt;";
	//new logic, price &gt; 50 and type is weapon
	if(record.data.TYPE == 'weapon' && record.data.PRICE &gt; 50) return "&lt;b style='color:red'&gt;" + data + "&lt;/b&gt;";
	else return data;
}
testgrid = function() {
	mygrid = ColdFusion.Grid.getGridObject('data');
	cm = mygrid.getColumnModel();
	cm.setRenderer(0, Ext.util.Format.usMoney);
	cm.setRenderer(1,myf);
	mygrid.reconfigure(mygrid.getStore(),cm);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfset data = queryNew("price,product,type")&gt;
&lt;cfloop from=1 to=10 index="x"&gt;
	&lt;cfset total = randRange(20,100) & "." & randRange(1,99)&gt;
	&lt;cfset product = "Product #X#"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data, "price", total+0, x)&gt;
	&lt;cfset querySetCell(data, "product", product, x)&gt;
	&lt;cfset querySetCell(data, "type", "#randRange(0,1)?'weapon':'fruit'#")&gt;
&lt;/cfloop&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="data" format="html" query="data" width="600"&gt;
   &lt;cfgridcolumn name="price" header="Price"&gt;
   &lt;cfgridcolumn name="product" header="Product"&gt;
   &lt;cfgridcolumn name="type" header="Type"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfset ajaxOnLoad("testgrid")&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

If you compare this code to the older entry, the changes are:

<p>

<ul>
<li>In my fake query, I added a new type column. All my products are either weapons or fruits. (Although one could argue that you could turn some weapons into fruits. I mean turn some fruits into weapons. Yeah, that's it.)
<li>Next look at the myf function. I kept the old logic in there commented out. You can see it made use of the data argument which is the cell being formatted. I ignore that though and check the rest of the row. This is passed in the record object. As you see, I check the TYPE and PRICE, and based on my business rule, I color the item red. 
<li>One small other change - back in the testgrid function (which remember is run when the application starts up), I changed getDataSource to getStore. This reflects the fact that the Grid used in CF9 has a different API then the one run in CF8.
</ul>

<p>

If you want to see a demo of this, just hit the button below. You may need to reload once or twice since the values are random.

<p>

<a href="http://www.coldfusionjedi.com/demos/july202010/test2.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
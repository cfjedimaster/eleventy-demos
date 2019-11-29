---
layout: post
title: "ColdFusion Ajax Grid - and POST"
date: "2008-08-18T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/18/ColdFusion-Ajax-Grid-and-POST
guid: 2975
---

On another listserv (sorry, can't say where, would have to kill you), a user brought up an interesting problem. He was using CFGRID (the Ajax variety) and had bound it to a CFC. No big deal, right? Well his API was somewhat complex. How complex? His method took 61 different arguments. Now frankly I think that is a bit too much (like Paris Hilton doing political ads too much), but it's what he needs and he wants it to work. The problem he is running into though is the size of the URL. You can probably imagine that a URL with 61 different arguments is going to get a bit long, and at some point, it stops working. The solution is simple. Switch to POST. But how do we do that with cfgrid?
<!--more-->
Unfortunately there is no simple "usePost" attribute you can add to cfgrid. But do not forget that bindings in ColdFusion 8 can use 3 forms: CFC, URL, and JavaScript. The grid can work with any of these forms as long as you return the right type of object. If you want to use JavaScript, it's actually very well documented in the CF Developer's Guide:

<blockquote>
<p>
If you manually create a JavaScript object or its JSON representation, it must have two top-level keys:
<ul>
<li>TOTALROWCOUNT: The total number of rows in the query data set being returned. This value is the total number
of rows of data in all pages in the grid, and not the number of rows in the current page.
<li>QUERY: The contents of the query being returned. The QUERY value must also be an object with two keys:
<li>COLUMNS: An array of the column names.
<li>DATA: A two-dimensional array, where the first dimension corresponds to the rows and the second
dimension corresponds to the field values, in the same order as the COLUMNS array.
</ul>
</p>
</blockquote>

So you could, if you wanted to, manually create the data in JavaScript and return it in your bind function. We don't have to do that though. ColdFusion already provides a way for me to hook up JavaScript to a CFC: cfajaxproxy. So let's break this down and see how it works. First, here is my initial grid. I'm using a URL, not a CFC, and I obviously don't have 61 arguments, but it gives us a base to start with:

<code>
&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html"  width="600" bind="url:presentations/cfajaxjune5/getentries.cfm?page={% raw %}{cfgridpage}{% endraw %}&pagesize={% raw %}{cfgridpagesize}{% endraw %}&sort={% raw %}{cfgridsortcolumn}{% endraw %}&dir={% raw %}{cfgridsortdirection}{% endraw %}"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
</code>

The first thing I'm going to do is switch to JavaScript for the bind:

<code>
&lt;cfgrid autowidth="true" name="entries" format="html"  width="600" bind="javascript:getData({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %})"&gt;
</code>

I'll then write a basic function:

<code>
function getData(page,pagesize,sort,sortdir) {
}
</code>

At this point, I need to talk to my CFC. I had a URL before, but I quickly changed it to a basic CFC. Note readers - this CFC is incomplete. It ignores the sort. It's just enough to give you the idea:

<code>
&lt;cfcomponent&gt;
	
&lt;cffunction name="getData" access="remote" returnType="any" output="false"&gt;
	&lt;cfargument name="page"&gt;
	&lt;cfargument name="pagesize"&gt;
	&lt;cfargument name="sort"&gt;
	&lt;cfargument name="sortdir"&gt;
		
	&lt;cfset var entries = ""&gt;
	&lt;cfset var data = ""&gt;
		
	&lt;cfquery name="entries" datasource="blogdev"&gt;
	select   *
	from   tblblogentries
	&lt;/cfquery&gt;

	&lt;cfset data = queryConvertForGrid(entries, arguments.page, arguments.pagesize)&gt;
	&lt;cfreturn data&gt;
&lt;/cffunction&gt;

		
&lt;/cfcomponent&gt;
</code>

Now that I have the CFC, let's make a proxy back to it:

<code>
&lt;cfajaxproxy cfc="getdata" jsclassname="dataproxy"&gt;
</code>

Wow, that was pretty hard. I better take a good 2 hour lunch to make up for all the time it took me to hook up client side code and server side code. Why can't ColdFusion make this even easier? I mean it must have taken me 10 seconds to type all this out? Ok, sarcasm aside, we aren't quite done yet. We need to make an instance of the proxy, and most importantly, we need to ensure it uses POST, not GET:

<code>
myproxy = new dataproxy();
myproxy.setHTTPMethod("POST");
</code>

Now that we have the proxy, let's use it in our function:

<code>
function getData(page,pagesize,sort,sortdir) {
	result = myproxy.getData(page,pagesize,sort,sortdir);
	return result;
}
</code>

I don't need that result value, I could just do it in one line, but I like to be verbose. 

So let's go over what we did here. We told the grid to bind to a JavaScript function. Whenever a sort is called (by the user clicking on a column) or a page is changed, the javaScript function getData will be called. This function is passed the current state information (page, page size, sort, sortdir). This function uses a proxy (a connection to my CFC) and calls the method. I told it earlier to use POST, so if I did have 61 arguments, it will work just fine. It then returns the data to the grid for display.

Make sense? Here is the entire client side code I used for testing. 

<code>
&lt;cfajaxproxy cfc="getdata" jsclassname="dataproxy"&gt;
	
&lt;script&gt;
myproxy = new dataproxy();
myproxy.setHTTPMethod("POST");

function getData(page,pagesize,sort,sortdir) {
	result = myproxy.getData(page,pagesize,sort,sortdir);
	return result;
}
&lt;/script&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html"  width="600" bind="javascript:getData({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %})"&gt;
   &lt;cfgridcolumn name="id" display="false"&gt;
   &lt;cfgridcolumn name="body" display="false"&gt;

   &lt;cfgridcolumn name="title" header="Title"&gt;
   &lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>
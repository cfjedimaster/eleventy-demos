---
layout: post
title: "Spry and Server Side Paging"
date: "2007-02-23T12:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/23/Spry-and-Server-Side-Paging
guid: 1857
---

A while ago I promised a demo showing how to use Spry's new PagedView feature to combine client and server side paging. Taking the "walk before you run" lesson to heart - I decided to first show a demo of how to do server side paging with Spry. This would be useful for huge datasets.
<!--more-->
Let's first start with the server side code. I wanted something you guys could download and play with, so the server side code is <i>not</i> using a database. Anyway - here is the code:

<code>
&lt;cfsetting enablecfoutputonly="true" showdebugoutput="false"&gt;
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfparam name="url.end" default="100"&gt;

&lt;cfset total = 1000&gt;

&lt;cfif url.start gt total&gt;
	&lt;cfset url.start = total&gt;
&lt;/cfif&gt;

&lt;cfif url.end gt total&gt;
	&lt;cfset url.end = total&gt;
&lt;/cfif&gt;

&lt;cfcontent type="text/xml"&gt;&lt;cfoutput&gt;&lt;?xml version="1.0" encoding="UTF-8"?&gt;&lt;people&gt;&lt;cfloop index="x" from="#url.start#" to="#url.end#"&gt;&lt;person&gt;&lt;id&gt;#x#&lt;/id&gt;&lt;name&gt;Name #x#&lt;/name&gt;&lt;/person&gt;&lt;/cfloop&gt;&lt;/people&gt;&lt;/cfoutput&gt;
</code>

I begin with a cfsetting to reduce the whitespace. This is important when returning XML. I then have two cfparams. One for the start row and one for the end row. I default these to sensible values. 

Next I have a "total" value. This wouldn't be hard coded but would rather come from the database. (Don't forget my <a href="http://ray.camdenfamily.com/index.cfm/2007/1/24/MySQL-Tip--Finding-total-rows-for-a-query-that-uses-Limit">MySQL</a> tip on how you can get a total and a page all in one query.) 

Since I know how many rows of data I have - I can then do sanity checks on start and end. Now I'm ready to generate my XML. Since I'm not using a database I've done a simple cfloop that "fakes" my data. I'm assuming folks have no questions on this so I'll move on.

The client side is a bit more complex than a simple Spry dataview. As before I'll show you the code than walk through what I did:

<code>
&lt;script type="text/javascript" src="/spry/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spry/SpryData.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript" &gt;
var start = 1;
var perdatapage = 20;
var end = start + perdatapage;

var baseurl = "testdata.cfm?";

function getURL() {
	var s = baseurl;
	s+="start="+start;
	s+="&end="+end;
	return s;
}

var mydata = new Spry.Data.XMLDataSet(getURL(),"//people/person"); 

Spry.Data.Region.debug=false;

function goBack() {
	start=start-perdatapage;
	if(start &lt; 1) start=1;
	end = start+perdatapage;
	mydata.setURL(getURL());
	mydata.loadData();	
}

function goForward() {
	start=start+perdatapage;
	end = start+perdatapage;
	mydata.setURL(getURL());
	mydata.loadData();	
}
&lt;/script&gt;

&lt;div id="mydata" spry:region="mydata"&gt;
	
	&lt;table border="1" width="500"&gt;
		&lt;tbody spry:repeat="mydata"&gt;
			&lt;tr&gt;
				&lt;td&gt;ds_RowID={% raw %}{ds_RowID}{% endraw %}&lt;/td&gt;
				&lt;td&gt;id from db={% raw %}{id}{% endraw %}&lt;/td&gt;
				&lt;td&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/tbody&gt;
		&lt;tr align="right"&gt;
			&lt;td colspan="3"&gt;
			&lt;a href="javaScript:goBack()"&gt;&lt;&lt; Previous&lt;/a&gt; | 
			&lt;a href="javaScript:goForward()"&gt;Next &gt;&gt;&lt;/a&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
&lt;/div&gt;
</code>

Ok, lots to cover here. I'm going to skip over the things that I assume most folks know - like the first two script tags that include the main Spry libraries. Let's begin by looking at how we track where we are in the dataset:

<code>
var start = 1;
var perdatapage = 20;
var end = start + perdatapage;

var baseurl = "testdata.cfm?";

function getURL() {
	var s = baseurl;
	s+="start="+start;
	s+="&end="+end;
	return s;
}
</code>

These lines initialize my start, end, and page size variables. Because my server side code accepts a start and end value, I created a helper function, getURL(), that will generate my URL for me. This was just for convenience. I use this in my dataset creation line:

<code>
var mydata = new Spry.Data.XMLDataSet(getURL(),"//people/person"); 
</code>

So skipping ahead a bit - you can see where I use a simple table to output the values from the XML. Notice I show both the ID, which comes from the data, and Spry's ds_RowID value. I do this just to show you the difference between the row in the dataset on the client side and the server side's row ID. 

To enable paging, I added two links at the bottom of the table that call JavaScript functions. Let's now take a look at these - first the code to move to the next page:

<code>
function goForward() {
	start=start+perdatapage;
	end = start+perdatapage;
	mydata.setURL(getURL());
	mydata.loadData();	
}
</code>

I begin with some simple arithmetic. Then I use setURL() on the dataset. This lets me update the URL, again I use my getURL function. Then loadData() is called which refreshes the dataset. That's it. The code to handle moving backwards is the same - except for some logic to ensure we don't go below 1. 

For a demo of this, go here: <a href="http://ray.camdenfamily.com/demos/spryserverpaging/">http://ray.camdenfamily.com/demos/spryserverpaging/</a>

You may also download the code attached to this entry. This code isn't perfect though. It will gladly let you go past the 1k limit. How can we fix that? I'll answer that in the next post.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftestingzone%{% endraw %}2Ezip'>Download attached file.</a></p>
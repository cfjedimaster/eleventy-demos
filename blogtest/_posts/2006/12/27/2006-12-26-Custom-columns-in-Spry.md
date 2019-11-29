---
layout: post
title: "Custom columns in Spry"
date: "2006-12-27T10:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/27/Custom-columns-in-Spry
guid: 1736
---

A few days ago I <a href="http://ray.camdenfamily.com/index.cfm/2006/12/22/New-Spry-Code-Paged-Datasets">posted</a> a link to a few new Spry demos including one that shows how to build <a href="http://labs.adobe.com/technologies/spry/samples/data_region/CustomColumnsSample.html">custom columns</a> in Spry. This is a pretty cool feature so I thought I'd whip up another demo so folks can really appreciate how handy this is. The idea is simple: You tell Spry to run code after the data is loaded and simply manipulate the data structure to add the new column. The new column can contain anything you want. This is great if you don't have control over the XML that your Spry page is using.
<!--more-->
Consider an XML document that returns a ColdFusion date:

<code>
&lt;cfsetting enablecfoutputonly="true" showdebugoutput="false"&gt;

&lt;cfcontent type="text/xml"&gt;
&lt;cfoutput&gt;&lt;people&gt;
	&lt;person&gt;
		&lt;name&gt;Raymond Camden&lt;/name&gt;
		&lt;date&gt;#now()#&lt;/date&gt;
	&lt;/person&gt;
	&lt;person&gt;
		&lt;name&gt;Jacob Camden&lt;/name&gt;
		&lt;date&gt;#now()#&lt;/date&gt;
	&lt;/person&gt;
&lt;/people&gt;&lt;/cfoutput&gt;
</code>

This simple XML file will return two people. The date value for each will be set to the current time. If used as is, the date would look like this:

{% raw %}{ts '2006-12-27 09:20:35'}{% endraw %}

Pretty ugly, eh?  So lets make it nicer. First lets add an "Observer" to the Spry dataset. This tells Spry to run a function on any type of change in the data set:

<code>
data.addObserver(processData);
</code>

Now lets look at the processData function:

<code>
function processData(notificationType, notifier, thisdata) {
	if (notificationType != "onPostLoad") return;

	var rows = data.getData();
	var numRows = rows.length;

	for (var i = 0; i &lt; numRows; i++) {
		var row = rows[i];
		row.datepretty = myDateFormat(cfToDate(row.date));
	}	
}
</code>

First note that we check the event type with the notificationType variable. (I based my function on the <a href="http://labs.adobe.com/technologies/spry/samples/data_region/CustomColumnsSample.html">Adobe sample</a>, so thanks go to them.) We get the data and the number of rows and then simply loop over the rows of data.

To add my custom column, I simply set a new value in the row. If I did:

<code>
row.goober = "foo";
</code>

Then the dataset would have a new column named goober with a static value of foo. 

In my sample code, I wrote two custom functions, cfToDate, and myDateFormat. These are ugly functions that parse the date sent from ColdFusion and handle the formatting of the date. This could probably be done better, but you get the idea. I've included them in the zip (see Download link below). 

Anyway - this is a very handy feature! Obviously you want to correct the XML server side if at all possible, but if you can't, this is a great way to handle it.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcustomcolumns%{% endraw %}2Ezip'>Download attached file.</a></p>
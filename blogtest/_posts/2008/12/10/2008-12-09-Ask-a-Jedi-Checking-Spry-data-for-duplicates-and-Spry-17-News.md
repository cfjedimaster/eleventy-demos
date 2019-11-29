---
layout: post
title: "Ask a Jedi: Checking Spry data for duplicates (and Spry 1.7 News)"
date: "2008-12-10T08:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/12/10/Ask-a-Jedi-Checking-Spry-data-for-duplicates-and-Spry-17-News
guid: 3142
---

Deli asked an interesting question. He wanted to know if there was a way to compare form data to data loaded in via Spry. My initial reaction was to show him this <a href="http://www.raymondcamden.com/index.cfm/2006/8/25/Spry-Example-Check-it-user-exists">old blog entry</a> that performs an AJAX request to see if a username exists. He wanted something that would work with a dataset though. Here is what I came up with.
<!--more-->
I began with a simple XML data set:

<code>
&lt;kids&gt;
	&lt;kid&gt;
		&lt;name&gt;Jacob&lt;/name&gt;
		&lt;age&gt;8&lt;/age&gt;
	&lt;/kid&gt;
	&lt;kid&gt;
		&lt;name&gt;Lynn&lt;/name&gt;
		&lt;age&gt;7&lt;/age&gt;
	&lt;/kid&gt;
	&lt;kid&gt;
		&lt;name&gt;Noah&lt;/name&gt;
		&lt;age&gt;6&lt;/age&gt;
	&lt;/kid&gt;
&lt;/kids&gt;
</code>

And then used this in an HTML page like so:

<code>
var dsRows = new Spry.Data.XMLDataSet("test.xml", "/kids/kid");
</code>

I printed out the kids names:

<code>
&lt;div spry:region="dsRows"&gt;
	&lt;div spry:state="loading"&gt;Loading - Please stand by...&lt;/div&gt;
	&lt;div spry:state="error"&gt;Oh crap, something went wrong!&lt;/div&gt;
	&lt;div spry:state="ready"&gt;
	
    &lt;span spry:repeat="dsRows"&gt;
    {% raw %}{name}{% endraw %} is {% raw %}{age}{% endraw %} years old&lt;br/&gt;
    &lt;/span&gt;

	&lt;/div&gt;
       
&lt;/div&gt;
</code>

And finally, I followed this up with a form to allow someone to add a new kid (if only it were that easy):

<code>
&lt;form&gt;
New Kid: &lt;input type="text" name="newname" id="newname" /&gt; &lt;input type="button" value="Add" onClick="checkName()" /&gt;
&lt;/form&gt;
</code>

Notice the onClick to run checkName. Let's look at that:

<code>
function checkName() {
	var name = Spry.$("newname").value;	
	if(dsRows.getDataWasLoaded()) {
		data = dsRows.getData();
		for(var i=0; i &lt; data.length; i++) {
			if(data[i].name.toLowerCase() == name.toLowerCase()) {
				alert('This name already exists. Going to block form submission.');
				return;
			}
			alert('This is a new name. Going to allow form submission!');
			return;
		}
	} else {
		alert('Data not done loading. Please try again.');
	}
}
</code>

There are two main things in play here. I begin with a getDataWasLoaded call. This ensures that data was fully loaded. If it was, I run getData(). This returns a simple array of data based on my dataset. At that point, it's just a quick loop and string comparison.

Note - I would not use this form of checking if you were not displaying the data on the page. If you really just wanted to check for duplicate data, than I'd use the method I described in the <a href="http://www.coldfusionjedi.com/index.cfm/2006/8/25/Spry-Example-Check-it-user-exists">other blog entry</a>. Certainly if you had 10 million kids, you don't want to load that into the client.

Note for Spry 1,7 news - the Spry team released a small <a href="http://labs.adobe.com/technologies/spry/preview/">1.7 preview</a>. This update removes the necessity (in most cases) to load the xpath library.
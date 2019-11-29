---
layout: post
title: "Ask a Jedi: ColdFusion Ajax example of retrieving fields of data (2)"
date: "2009-10-19T00:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/18/Ask-a-Jedi-ColdFusion-Ajax-example-of-retrieving-fields-of-data-2
guid: 3566
---

Earlier today I <a href="http://www.raymondcamden.com/index.cfm/2009/10/18/Ask-a-Jedi-ColdFusion-Ajax-example-of-retrieving-fields-of-data">blogged</a> a simple example of using ColdFusion Ajax controls to load detail information based on a primary key. The reader who asked the question sent me a followup asking if it was possible to change the form to use a button instead of a keypress to load the data.
<!--more-->
Using the second code sample from my previous entry, I added a button next to the ID field.

<code>
&lt;cfform&gt;
id: &lt;cfinput type="text" name="artid" id="artid"&gt; &lt;cfinput type="button" name="mybutton" value="Lookup"&gt;&lt;br/&gt;
name: &lt;cfinput type="text" name="artname" id="artname" readonly="true"&gt;&lt;br/&gt;
description: &lt;cftextarea name="description" id="description" readonly="true"&gt;&lt;/cftextarea&gt;&lt;br/&gt;
price: &lt;cfinput type="text" name="price" id="price" readonly="true"&gt;&lt;br/&gt;
&lt;/cfform&gt;
</code>

Now for the weird part. It's easy enough to bind to a button. I'd just use {% raw %}{mybutton@click}{% endraw %}. However, I still need the ID value. So in order to bind to the CFC, I'd have to use:

<code>
&lt;cfajaxproxy bind="cfc:test.getData({% raw %}{artid@none}{% endraw %},{% raw %}{mybutton@click}{% endraw %})" onsuccess="showData"&gt;
</code>

Unfortunately, this then requires that the getData method have a second argument. I <i>could</i> just add a dummy argument to the method, but that felt wrong. I decided to take another approach.

The cfajaxproxy tag allows you to bind to JavaScript functions as well. I switched my tag to the following:

<code>
&lt;cfajaxproxy bind="javascript:getData({% raw %}{mybutton@click}{% endraw %})"&gt;
</code>

Next, I knew I still needed a way to communicate to the CFC. I added another cfajaxproxy:

<code>
&lt;cfajaxproxy cfc="test" jsclassname="dataproxy"&gt;
</code>

The next change was to add the getData function:

<code>
function getData() {
	var artid = ColdFusion.getElementValue("artid")
	if(isNaN(artid)) return
	dataService.getData(artid)
}
</code>

I have to get the artid value manually so I made use of ColdFusion.getElmentValue. As before, I check for a valid number. Lastly I make use of dataService. What is that? I've added these two lines of JavaScript that make use of the new cfajaxproxy tag I added:

<code>
var dataService = new dataproxy()
dataService.setCallbackHandler(showData)
</code>

Basically, dataService becomes a proxy to my remote methods in the CFC. This is probably a bit confusing now so let me paste in the entire template:

<code>
&lt;cfajaxproxy bind="javascript:getData({% raw %}{mybutton@click}{% endraw %})"&gt;
&lt;cfajaxproxy cfc="test" jsclassname="dataproxy"&gt;

&lt;script&gt;
function getData() {
	var artid = ColdFusion.getElementValue("artid")
	if(isNaN(artid)) return
	dataService.getData(artid)
}

function showData(d) {
	//convert into a struct
	var data = {}
	for(var i=0; i &lt; d.COLUMNS.length; i++) {
		data[d.COLUMNS[i]] = d.DATA[0][i]
	}
	document.getElementById('artname').value = data["ARTNAME"]
	document.getElementById('description').value = data["DESCRIPTION"]
	document.getElementById('price').value = data["PRICE"]
	
}

var dataService = new dataproxy()
dataService.setCallbackHandler(showData)
&lt;/script&gt;

&lt;cfform&gt;
id: &lt;cfinput type="text" name="artid" id="artid"&gt; &lt;cfinput type="button" name="mybutton" value="Lookup"&gt;&lt;br/&gt;
name: &lt;cfinput type="text" name="artname" id="artname" readonly="true"&gt;&lt;br/&gt;
description: &lt;cftextarea name="description" id="description" readonly="true"&gt;&lt;/cftextarea&gt;&lt;br/&gt;
price: &lt;cfinput type="text" name="price" id="price" readonly="true"&gt;&lt;br/&gt;
&lt;/cfform&gt;
</code>

I hope this helps and shows yet another variation on the theme from earlier today.
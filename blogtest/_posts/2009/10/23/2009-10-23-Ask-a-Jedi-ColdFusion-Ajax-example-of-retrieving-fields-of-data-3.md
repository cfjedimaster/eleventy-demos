---
layout: post
title: "Ask a Jedi: ColdFusion Ajax example of retrieving fields of data (3)"
date: "2009-10-23T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/23/Ask-a-Jedi-ColdFusion-Ajax-example-of-retrieving-fields-of-data-3
guid: 3575
---

This is the third in a short series of blog entries demonstrating one way to use ColdFusion's built in Ajax code to load detail information into a form. I've written two previous entries (linked to below) and I recommend checking them out first if you have not done so already. The <a href="http://www.raymondcamden.com/index.cfm/2009/10/18/Ask-a-Jedi-ColdFusion-Ajax-example-of-retrieving-fields-of-data">first entry</a> simply bound a text field to a back end CFC. When you typed in a number the code would attempt to retrieve the complete record from the server. The <a href="http://www.coldfusionjedi.com/index.cfm/2009/10/18/Ask-a-Jedi-ColdFusion-Ajax-example-of-retrieving-fields-of-data-2">second entry</a> modified the code to use a button to perform the database lookup. This final entry (heh, I hope, the original author keeps asking for interesting tweaks!) modifies the code yet again. Now it provides a loading message while the data is being retrieved. The code isn't terribly different from before so I'll paste in the entire thing and then explain the modifications.
<!--more-->
<code>
&lt;cfajaxproxy bind="javascript:getData({% raw %}{mybutton@click}{% endraw %})"&gt;
&lt;cfajaxproxy cfc="test" jsclassname="dataproxy"&gt;

&lt;script&gt;
function getData() {
	document.getElementById("loading").innerHTML="Loading..."
	var artid = ColdFusion.getElementValue("artid")
	if(isNaN(artid)) return
	dataService.getData(artid)
}

function showData(d) {
	document.getElementById("loading").innerHTML=""
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

&lt;div id="loading"&gt;&lt;/div&gt;

&lt;cfform&gt;
id: &lt;cfinput type="text" name="artid" id="artid"&gt; &lt;cfinput type="button" name="mybutton" value="Lookup"&gt;&lt;br/&gt;
name: &lt;cfinput type="text" name="artname" id="artname" readonly="true"&gt;&lt;br/&gt;
description: &lt;cftextarea name="description" id="description" readonly="true"&gt;&lt;/cftextarea&gt;&lt;br/&gt;
price: &lt;cfinput type="text" name="price" id="price" readonly="true"&gt;&lt;br/&gt;
&lt;/cfform&gt;
</code>

The first modification is a simple one - adding a loading div. It will only be used for status messages as data is being fetched. The getData() method was then modified to change the innerHTML of the div and place a loading message. You could easily use one of those fancy animated gear-type GIFs as well. Lastly, showData was modified to remove the loading message. 

That's it - and I hope these examples are helpful. I've been using jQuery so much I feel pretty rusty with the ColdFusion built-in Ajax stuff.
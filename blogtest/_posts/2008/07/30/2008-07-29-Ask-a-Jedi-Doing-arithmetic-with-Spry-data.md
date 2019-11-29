---
layout: post
title: "Ask a Jedi: Doing arithmetic with Spry data"
date: "2008-07-30T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/07/30/Ask-a-Jedi-Doing-arithmetic-with-Spry-data
guid: 2945
---

Rey asks:

<blockquote>
<p>
Hi, I'm trying to do some arithmetic with Spry the data is coming from a dataset. Now how can I loop through the dataset and then add to get a total. For example in ColdFusion I can do this:

&lt;cfset totalA = 0&gt;<br>
&lt;cfset totalB = 0&gt;<br>
&lt;cfloop query="test"&gt;<br>
&lt;cfset totalA = totalA + amountA&gt;<br>
&lt;cfset totalB = totalB + amountB&gt;<br>
&lt;/cfloop&gt;<br>

and this will give me the totals, but in Spry I can't seem to find a way to do this. Any help you can give me will be appreciated. Thanks!
</p>
</blockquote>
<!--more-->
This can be done by using an observer on the dataset. An observer is basically a way to monitor the life cycle of a dataset. One thing you can monitor is when the data is done loading. Once the data is done, we can then look at it and make our own totals. First let's look at a simple example without the observer:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Spry Test&lt;/title&gt;
&lt;script type="text/javascript" src="/spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryData.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript"&gt;
var mydata = new Spry.Data.XMLDataSet("people.cfm","/people/person"); 
mydata.setColumnType("age","numeric");
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div spry:region="mydata"&gt;

	
	&lt;p&gt;
	&lt;table width="500" border="1"&gt;
		&lt;tr&gt;
			&lt;th onclick="mydata.sort('name','toggle');" style="cursor: pointer;"&gt;Name&lt;/th&gt;
			&lt;th onclick="mydata.sort('age','toggle');" style="cursor: pointer;"&gt;Age&lt;/th&gt;
			&lt;th onclick="mydata.sort('gender','toggle');" style="cursor: pointer;"&gt;Gender&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr spry:repeat="mydata"&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
	&lt;/p&gt;
	
&lt;/div&gt;
	

&lt;/body&gt;
&lt;/html&gt;
</code>

This file loads a simple XML file (which I won't bother showing, it just has a name, gender, and an age value) and displays the result in a table. Now let's add our observer:

<code>
var myObserver = new Object;
myObserver.onPostLoad = function(dataSet, data) {
	var data = dataSet.getData();
	var totalAge = 0;
	for(var i=0; i&lt; data.length;i++) {
		totalAge += parseInt(data[i].age);
	}
	Spry.$("totalDiv").innerHTML = "Total age of my kids: " + totalAge;
};
mydata.addObserver(myObserver);
</code>

The observer is an object with the particular method (onPostLoad) as a property. Skip over the function code and notice how it is added to my dataset. So basically I've said: "When you are done loading, run this function and pass in the dataset." The meat of the function is just a simple loop. I get the raw data. Loop over it. (Note the parseInt to treat the age as a number.) Finally I update a div with the result. The complete code is below.

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Spry Test&lt;/title&gt;
&lt;script type="text/javascript" src="/spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryData.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript"&gt;
var mydata = new Spry.Data.XMLDataSet("people.cfm","/people/person"); 
mydata.setColumnType("age","numeric");

var myObserver = new Object;
myObserver.onPostLoad = function(dataSet, data) {
	var data = dataSet.getData();
	var totalAge = 0;
	for(var i=0; i&lt; data.length;i++) {
		totalAge += parseInt(data[i].age);
	}
	Spry.$("totalDiv").innerHTML = "Total age of my kids: " + totalAge;
};
mydata.addObserver(myObserver);
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div spry:region="mydata"&gt;

	
	&lt;p&gt;
	&lt;table width="500" border="1"&gt;
		&lt;tr&gt;
			&lt;th onclick="mydata.sort('name','toggle');" style="cursor: pointer;"&gt;Name&lt;/th&gt;
			&lt;th onclick="mydata.sort('age','toggle');" style="cursor: pointer;"&gt;Age&lt;/th&gt;
			&lt;th onclick="mydata.sort('gender','toggle');" style="cursor: pointer;"&gt;Gender&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr spry:repeat="mydata"&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
	&lt;/p&gt;
	
&lt;/div&gt;
	
&lt;div id="totalDiv"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>
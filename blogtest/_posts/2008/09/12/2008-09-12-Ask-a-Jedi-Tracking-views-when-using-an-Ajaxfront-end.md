---
layout: post
title: "Ask a Jedi: Tracking views when using an Ajax-front end"
date: "2008-09-12T18:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/09/12/Ask-a-Jedi-Tracking-views-when-using-an-Ajaxfront-end
guid: 3013
---

Paul asks:

<blockquote>
<p>
Hi Raymond, I have a Spry JSON master-detail arrangement on my website. I want to keep track of clicks on the listings in the top master part of the master-detail. Clicking a listing displays a summary of a particular sale in the lower detail panel. All I want at this stage is to increment a database field called "Clicks" in a table called "Sales" each time a
listing in the top master panel is clicked. It sounds easy, but I've agonised over it because of the Spry/JSON, which I'm still learning my way around.
</p>
</blockquote>
<!--more-->
This is really interesting question because it helps remind us that the traditional forms of stats and reporting really need to change to support Ajax. My buddy Nico at <a href="http://www.broadchoice.com">Broadchoice</a> is pretty intelligent about this kind of stuff, but I can hopefully answer the question adequately. Spry makes this rather easy. First let me share a simple demo. This uses XML, not JSON, but the solution I'll show will work the exact same with any type of dataset. First, the front end:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Spry Test&lt;/title&gt;
&lt;script type="text/javascript" src="/spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryData.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript"&gt;
var mydata = new Spry.Data.XMLDataSet("sprydata.cfm","/people/person"); 
mydata.setColumnType("age","numeric");
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div spry:region="mydata"&gt;

	&lt;div spry:state="loading"&gt;Loading - Please stand by...&lt;/div&gt;
	&lt;div spry:state="error"&gt;Oh crap, something went wrong!&lt;/div&gt;
	&lt;div spry:state="ready"&gt;
	
	&lt;p&gt;
	&lt;table width="500" border="1"&gt;
		&lt;tr&gt;
			&lt;th spry:sort="name" style="cursor: pointer;"&gt;Name&lt;/th&gt;
			&lt;th spry:sort="age" style="cursor: pointer;"&gt;Age&lt;/th&gt;
			&lt;th spry:sort="gender" style="cursor: pointer;"&gt;Gender&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr spry:repeat="mydata" spry:setrow="mydata" &gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
	&lt;/p&gt;
	&lt;/div&gt;
	
&lt;/div&gt;
	
&lt;span spry:detailregion="mydata" id="dataregion"&gt;
&lt;h2&gt;{% raw %}{name}{% endraw %}&lt;/h2&gt;
{% raw %}{name}{% endraw %} is {% raw %}{age}{% endraw %} years old and is a {% raw %}{gender}{% endraw %}
&lt;/span&gt;
	

&lt;/body&gt;
&lt;/html&gt;
</code>

If you know the basics of Spry, nothing here should be surprising. The CFM behind the scenes is just outputting a static XML file. Ok, so how can we handle detecting that the user has picked a row? Well remember that Spry has two types of event handlers. You can notice events on the data itself, and yes, Spry has an event for the current row changing, and Spry notices events for the region. I.e., it knows when it's writing the data out to the page.

Now here is the interesting thing. You can use an event handler on the data and easily detect the current row changing. This works perfect, <i>except</i> when the page loads. When Spry automatically selects the first row, it doesn't consider it a row change, so you can't handle that very first load. 

It's different on the region though. If you use onPostUpdate event for the region, it will fire each and every time that region is updated, including when the page first loads. 

Here is how I added the handler:

<code>
var myObserver = new Object;
myObserver.onPostUpdate = function(notifier, data) {
	console.log('current row changed to '+mydata.getCurrentRow().name);
};
Spry.Data.Region.addObserver("dataregion", myObserver);
</code>

All I did was use my Firebug console to log an event. My XML has a name attribute, that's where the .name comes from. Paul would probably want to get the ID field for his data or some other unique identifier. I ran this file and confirmed it worked fine, and it did. Now I just needed the actual server-side logging part. Once again, Spry makes this easy. I added one line:

<code>
Spry.Utils.loadURL("GET","/saveview.cfm?name=" + escape(mydata.getCurrentRow().name),true);
</code>

This fires off an HTTP request to a CFM. I passed along the name (again, this was just an arbitrary value from my XML data). I don't need to wait for the response (the last argument, true, specifies asynch), so this is all I need. The server side code would just handle the database update, or log, or whatever makes sense.
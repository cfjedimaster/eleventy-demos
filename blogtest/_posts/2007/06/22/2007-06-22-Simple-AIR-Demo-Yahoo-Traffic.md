---
layout: post
title: "Simple AIR Demo - Yahoo Traffic"
date: "2007-06-22T19:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/06/22/Simple-AIR-Demo-Yahoo-Traffic
guid: 2145
---

Don't ask me why I'm so obsessed with Yahoo's APIs - maybe because they are so darn easy when compared to Google or UPS. It's almost as if Google went out of their way to make an API that would be a pain in the rear to use - whereas Yahoo's services are a model of simplicity. Well, most of the time anyway.

Today I worked on a new HTML based AIR demo that works with Yahoo's Traffic service API. It is rather simple. Enter a zip code and it will give you a traffic report. Yahoo's data isn't too intensive, but any major city should have data. (-sigh-, not good old Lafayette, LA)
<!--more-->
The code is rather simple. The form calls loadData which does this:

<code>
function loadData() { 
	var zipfield = document.getElementById('zip');
	var zip = zipfield.value;
	zipfield.disabled=true;
	Spry.Utils.loadURL("GET", baseurl + "&zip="+zip, true, trafficHandler, {% raw %}{errorCallback:errorHandler}{% endraw %});	
}
</code>

As you can see - I'm using Spry. Handling the result is really simply a matter of working with the XML. Spry provides a nice <a href="http://www.raymondcamden.com/index.cfm/2006/12/17/Spry-14-documentToObject-makes-XML-handling-easy">documentToObject</a> function which lets me translate the XML response into an object:

<code>
var xmlresult = Spry.XML.documentToObject(Spry.Utils.stringToXMLDoc(result));
</code>

I then grabbed the results:

<code>
var trafficResults = xmlresult.ResultSet._getPropertyAsArray("Result");
</code>

And looped over them. Here is the main code used to process the results:

<code>
if(trafficResults.length &gt; 0) {
	resultHTML = "&lt;table border=1&gt;&lt;tr&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;Problem&lt;/th&gt;&lt;/tr&gt;";
	for(var i=0; i &lt; trafficResults.length; i++) {
		var resultOb = trafficResults[i];
		var type = resultOb["@type"];
		var title= resultOb.Title["#text"];
		var description = resultOb.Description["#text"];
		var imgurl = resultOb.ImageUrl["#text"];
		resultHTML+=  "&lt;tr&gt;&lt;td&gt;" + type + "&lt;/td&gt;&lt;td&gt;" + title + "&lt;/td&gt;&lt;/tr&gt;";
		//resultHTML += "&lt;tr&gt;&lt;td colspan=2&gt;" + description + " &lt;a href='" + imgurl + "' target='_new'&gt;[Map]&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;";
		resultHTML += "&lt;tr&gt;&lt;td colspan=2&gt;" + description + "&lt;/td&gt;&lt;/tr&gt;";
	}
	resultHTML += "&lt;/table&gt;";	
} else {
	resultHTML = "Sorry, but no results were returned for your zip code.";
}
</code>

The result isn't terribly pretty. But it works. Here are some issues I ran into that I'd love to get some advice on.

<ul>
<li>First off - it is really difficult to debug JavaScript errors. I'm used to Firebug and having a nice UI to view my JavaScript errors. When I tested with AIR, I never saw an error. I'm assuming the embedded browser just swallowed them. I know JavaScript allows for a global error handler, so in the future I'll have to look into that. I could have also built a prototype that did not hit Yahoo and simply loaded the XML locally.
<li>For some reason, I couldn't open a new window and point it to the image URL returned from Yahoo. When I tried, I got a popup window with the remote image spit out as text. I'm assuming this is a dumb error on my side.
</ul>

Lastly - I can't recommend Aptana enough. The AIR Eclipse plugin I reviewed <a href="http://www.coldfusionjedi.com/index.cfm/2007/6/12/Aptana-adds-AIR-Support">here</a> made the development very easy. My only problem was the JavaScript issues described above. The actual build process (edit/run/etc) was incredibly simple. 

Source and AIR file included in the zip attached to the blog entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FYahoo%{% endraw %}20Traffic%2Ezip'>Download attached file.</a></p>
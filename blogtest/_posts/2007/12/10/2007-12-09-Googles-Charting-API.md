---
layout: post
title: "Google's Charting API"
date: "2007-12-10T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/10/Googles-Charting-API
guid: 2527
---

A few blogs have reported this over the weekend, but the Big G (as I like to call Google) has released a new <a href="http://code.google.com/apis/chart/">charting API</a>. The API lets you create charts simply by constructing a URL. Why bother when we have charts in ColdFusion already?
<!--more-->
Well first off - I think the Flash charts in ColdFusion looks <i>real</i> swell. But you can't always use Flash. What if you want to embed a chart in a PDF? CFCHART lets you output PNG or JPG, but frankly, these versions look pretty bad. Check this screen shot which has both a Flash and PNG version side by side:


<img src="https://static.raymondcamden.com/images/Picture 14.png">

As you can see - the text is especially bad when compared to the Flash version. Now compare this to a Google version (and this is a 'live' example of the API, right click on the chart to see the URL):

<img src="http://chart.apis.google.com/chart?cht=bvs&chs=400x240&chbh=70&chd=s:9nb16&chtt=Products{% raw %}%20and%{% endraw %}20Sales&chxt=x,y&chxl=0:{% raw %}|ColdFusion%{% endraw %}208{% raw %}|Flash%{% endraw %}20CS3{% raw %}|Flex%{% endraw %}202{% raw %}|Rubber%{% endraw %}20Chicken{% raw %}|Cream%{% endraw %}20Pie{% raw %}|1:|{% endraw %}|49K">

The second reason you may wish to use the Google charts is the chart types. Now a lot of folks don't know that ColdFusion has more chart types then documented. If you use the Java application webcharts.bat, you can play with other types, and modify the display more than what you have available via cfchart. Google supports less types than ColdFusion does, but supports types not available in ColdFusion, like Venn diagrams.

You are limited to 50000 API requests per day, but don't forget that the built in ColdFusion function, imageNew(), lets you specify a URL for the source. You could use this to suck down and cache the Google chart. 

Using the Google Chart API is a bit complex. Your data has to be remappped to line up correctly on the charts. Google offers 3 ways of doing so - and includes some sample JavaScript code. I've rewritten their JS code into CF Script, and made it a bit easier (you don't need to know your max data before hand). I'll paste that code into the very end of the blog entry. 

You also have to spend a bit more time thinking about your data. So for example - imagine you want labels for your values. Imagine your data is sales figures that range from 20k to 100k or so. So what should your labels be? 25/50/75/100? 0/50/100? Google doesn't help you here. You have to figure out what labels, and how many, you want to display. It certainly isn't impossible, but it does mean a bit more work on your side. 

My simpleEncode UDF - based on Google's original work:

<code>
&lt;cfscript&gt;
function simpleEncode(data) {
	var maxdata = 0;
	var i = 0;
	var currentvalue = "";
	var str = "s:";
	var simpleEncoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var thepos = "";
	var thechar = "";

	for(i=1;i &lt;= arrayLen(data); i++) {
		if(data[i] gt maxdata) maxdata = data[i];
	}

	for(i=1; i &lt;= arrayLen(data); i++) {
		currentvalue = data[i];
		if (isNumeric(currentValue) && currentValue &gt;= 0) {
			thepos = round((len(simpleEncoding)-1) * currentvalue/maxdata);
			thechar = mid(simpleEncoding,thepos+1,1);
			str &= thechar;
		} else {
			str &= "_";
		}
	}
	
	return str;
}
&lt;/cfscript&gt;
</code>
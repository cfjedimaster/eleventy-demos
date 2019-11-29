---
layout: post
title: "Adding click support in ColdFusion 10 Charting"
date: "2012-03-14T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/03/14/Adding-click-support-in-ColdFusion-10-Charting
guid: 4561
---

If you read the release notes for the new charting support in ColdFusion 10, you may come across this little gem:

<p/>

<blockquote>
The following server-side charting features are not available with client-side charting:<br/>
Linking charts to URL<br/>
Writing charts to a variable<br/>
</blockquote>

<p/>

While technically correct, it is possible to add support for this with a little bit of code. Here's a demonstration of one way you can add this support back in.

<p/>
<!--more-->
First, let's create a simple static chart. My technique will work for dynamic charts as well, but for the time being, let's keep things simple:

<p/>

<code>
&lt;cfchart id="main" chartheight="500" chartwidth="500" title="Test Chart" format="html" scalefrom="50" scaleto="150" &gt;

	&lt;cfchartseries type="bar" serieslabel="Sales"&gt;
		&lt;cfchartdata item="Apples"  value="120"&gt;
		&lt;cfchartdata item="Bananas" value="84"&gt;
		&lt;cfchartdata item="Cherries" value="72"&gt;
		&lt;cfchartdata item="Donuts" value="109"&gt;
	&lt;/cfchartseries&gt;

&lt;/cfchart&gt;
</code>

<p/>

To add our click handler, we're going to begin by adding ajaxOnLoad to the script. This is a ColdFusion function that handles the process of firing an event handler when client-side "stuff" is done. Yes, I know "stuff" is a bit vague. If you use jQuery, then you are familiar with $(document).ready. Since ColdFusion does a lot of front-end stuff for you when using client-side charting (and other things like cfgrid for example), you need a way to say, "Fire my JavaScript function when you're done, buddy." The ajaxOnLoad function is how that's done. Here's an updated template showing this in action:

<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script&gt;
function init() {

}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfchart id="main" chartheight="500" chartwidth="500" title="Test Chart" format="html" scalefrom="50" scaleto="150" &gt;

	&lt;cfchartseries type="bar" serieslabel="Sales"&gt;
		&lt;cfchartdata item="Apples"  value="120"&gt;
		&lt;cfchartdata item="Bananas" value="84"&gt;
		&lt;cfchartdata item="Cherries" value="72"&gt;
		&lt;cfchartdata item="Donuts" value="109"&gt;
	&lt;/cfchartseries&gt;

&lt;/cfchart&gt;

&lt;div id="data"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

So far so good. To work with the chart, ColdFusion 10 provides us with an API to get a handle on the actual object. I began by creating that handle and storing it in a variable. 

<p>

<code>
var handle;
function init() {
	handle = ColdFusion.Chart.getChartHandle();

}
</code>

<p>

Now we need to add the click handler. The ColdFusion 10 Beta docs show an example of the click handler, but it isn't helpful for us. The click handler tells us where the user clicked, but isn't very specific. Luckily there is a better event we can use - node_click. (For a full list of events, see <a href="http://www.zingchart.com/learn/api/events.php">this doc.</a>)

<p>

The node_click event will fire <i>only</i> when a person actually clicks on one of your chart items. I began by simply dumping out the value of the event so I could see what was in it:

<p>

<code>
handle.node_click = function(dataOb) {
	console.dir(dataOb);
}
</code>

<p>

This is the result:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip43.png" />

<p>

A few things you should note here. First off - note that you get a nodeindex and value property. Secondly - the nodeindex is 0 based. In the screen shot above, I had clicked on the 4th bar, so the nodeindex returned 3.

<p>

So this raises a question. Assuming you want to "drill down" into details, how do we go from a simple index to the detail we want? Interestingly enough you have the same issue with "old" cfcharts too. (See this <a href="http://www.raymondcamden.com/index.cfm/2009/5/15/Simple-CFCHARTjQuery-Demo">blog entry</a> as an example.) 

<p>

In order to correctly handle the click, you need to ensure that you can associate a nodeindex with the Nth (well, Nth+1) record from your chart. Given a query, that would be simple. You could repeat your query on the detail page and simply work with the Nth+1 row. (Of course, that's also a bit sloppy. If you use MySQL, you can pretty easily grab a particular row without returning the entire result set.) 

<p>

If you are working with static data, then you would simply ensure that you handle the look up manually. I updated my JavaScript code to handle the "push" to the new location:

<p>

<code>
handle.node_click = function(dataOb) {
	location.href='detail.cfm?datakey='+dataOb.key;
}
</code>

<p>

And then wrote code to handle the lookup:

<p>

<code>

&lt;cfparam name="url.datakey" default=""&gt;
&lt;cfswitch expression="#url.datakey#"&gt;
	&lt;cfcase value="0"&gt;
		&lt;cfset detail = "Apples"&gt;
	&lt;/cfcase&gt;
	&lt;cfcase value="1"&gt;
   		&lt;cfset detail = "Bananas"&gt;
   	&lt;/cfcase&gt;
	&lt;cfcase value="2"&gt;
		&lt;cfset detail = "Cherries"&gt;
	&lt;/cfcase&gt;
	&lt;cfcase value="3"&gt;
		&lt;cfset detail = "Donuts"&gt;
	&lt;/cfcase&gt;
	&lt;cfdefaultcase&gt;
		&lt;cfset detail = "Apples"&gt;
	&lt;/cfdefaultcase&gt;
&lt;/cfswitch&gt;

&lt;cfoutput&gt;
Here are the details on #detail#
&lt;/cfoutput&gt;
</code>

<p>

You can demo this yourself by clicking the lovely demo button below. I've also included the entire source for the chart demo at the bottom.

<p>


<a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/charting/test8.cfm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<code>

&lt;html&gt;
&lt;head&gt;
&lt;script&gt;
var handle;
function init() {
	handle = ColdFusion.Chart.getChartHandle();

	handle.node_click = function(dataOb) {
		console.dir(dataOb);
		location.href='detail.cfm?datakey='+dataOb.key;
	}
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfchart id="main" chartheight="500" chartwidth="500" title="Test Chart" format="html" scalefrom="50" scaleto="150" &gt;

	&lt;cfchartseries type="bar" serieslabel="Sales"&gt;
		&lt;cfchartdata item="Apples"  value="120"&gt;
		&lt;cfchartdata item="Bananas" value="84"&gt;
		&lt;cfchartdata item="Cherries" value="72"&gt;
		&lt;cfchartdata item="Donuts" value="109"&gt;
	&lt;/cfchartseries&gt;

&lt;/cfchart&gt;

&lt;div id="data"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code>
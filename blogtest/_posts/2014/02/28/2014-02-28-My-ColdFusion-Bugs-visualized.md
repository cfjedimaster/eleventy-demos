---
layout: post
title: "My ColdFusion Bugs - visualized"
date: "2014-02-28T17:02:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2014/02/28/My-ColdFusion-Bugs-visualized
guid: 5169
---

<p>
One last blog entry before I enter Mardi Gras oblivion. Earlier this week I had logged into the <a href="https://bugbase.adobe.com/index.cfm">ColdFusion bugbase</a> and noticed that I had over 500 bugs in the system. I thought this was kinda cool and I was wondering if I could see aggregate data about my bug reports.
</p>
<!--more-->
<p>
Knowing that this was an Ajax application, I opened my dev tools and looked at the request. Here is the URL (I added some spaces so it would wrap):
</p>

<p>
https://bugbase.adobe.com/index.cfm? event=qHome&page=1&pageSize=25&gridsortcolumn=&gridsortdirection=ASC& _cf_nodebug=true&_cf_nocache=true&_cf_clientid=89DF20803129085712725A599228C03B&_cf_rc=0
</p>

<p>
Notice the page size variable? On a whim I changed that to 600 and it worked. Note to developers: When you let the client specify a page size, you probably want to include a sensible maximum. I took the JSON packet and stored it locally. 
</p>

<p>
The next part was simple. I wrote some quick jQuery to hit the JSON and loop over all the values. For now, I was just curious about the status of my bugs, so my code created a count for each status value.
</p>

<pre><code class="language-javascript">
$.getJSON("./mybugs.json", function(res) {

	var statusStats = {};

	var data = res.QUERY;
	var cols = {};
	for(var i=0;i&lt;data.COLUMNS.length;i++) {
		cols[data.COLUMNS[i]] = i;
	}
	for(var i=0; i&lt;data.DATA.length; i++) {
		var status = data.DATA[i][cols["AD_S_STATUS"]];
		if(statusStats[status]) {
			statusStats[status]++;
		} else {
			statusStats[status]=1;	
			}
	}

</code></pre>

<p>
I then decided - let's make it pretty. I added some <a href="http://www.highcharts.com/">Highcharts</a> code to display the results in a pie chart. I had to do a minor bit of wrangling with the data, but outside of that I literally just cut and pasted from their sample code. The result:
</p>

<iframe src="http://www.raymondcamden.com/demos/2014/feb/28/test2.html" style="width:600px;height:600px"></iframe>

<p>
You can view it (and view the source) here: <a href="http://www.raymondcamden.com/demos/2014/feb/28/test2.html">http://www.raymondcamden.com/demos/2014/feb/28/test2.html</a>
</p>

<p>
Enjoy. Now I'm off to catch some cheap beads.
</p>
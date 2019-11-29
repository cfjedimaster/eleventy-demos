---
layout: post
title: "Follow up to CFMAP/jQuery/911 Demo"
date: "2010-01-20T18:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/01/20/Follow-up-to-CFMAPjQuery911-Demo
guid: 3690
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2010/1/19/Proof-of-Concept-911-Viewer">blogged</a> about a proof of concept 911 viewer I built using CFMap and jQuery. The first example simply retrieved all of the 911 reports and mapped them at once. The second demo was more complex. This demo actually showed you map data from the beginning of the collection to the most recent report. Watch the <a href="http://www.coldfusionjedi.com/demos/traffic.swf">video</a> if that doesn't make sense. Let's look at how I built that demo. (Warning: I'm going to jump around a bit code wise but at the end I'll paste the entire template.)
<!--more-->
<p>

I began with a map centered on my home town:

<p>

<code>
&lt;cfmap centeraddress="Lafayette, LA" width="500" height="500" zoomlevel="12" showcentermarker="false" name="mainMap"&gt;
&lt;/cfmap&gt;
</code>

<p>

I then created a DIV that would store the current time:

<p>

<code>
&lt;div id="clock"&gt;&lt;/div&gt;
</code>

<p>

Next - I needed to tell ColdFusion to run a JavaScript function when everything (in this case, the map) was loaded. The last line of my script was:

<p>

<code>
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

This ran my init function. It's main purpose was to just set things up and run my main (and repeatable) function to display data.

<p>

<code>
function init() {
	map = ColdFusion.Map.getMapObject("mainMap")
	doMarkers()
}
</code>

<p>

I'm using map there as a global variable. Remember that this is the "real" Google Map API object. When I have that I can do anything Google allows via their API. Let's look at doMarkers now.

<p>

<code>
function doMarkers() {

	if(prevMarkers.length) {
		for(var i=0;i&lt;prevMarkers.length;i++) {
			map.removeOverlay(prevMarkers[i])
		}
		prevMarkers = []
	}

	current++
	var thisDate = bucketArray[current]["date"]
	console.log(thisDate + ' has '+bucketArray[current].records.length +' items')
	$("#clock").text(thisDate)
	for(var i=0; i&lt;bucketArray[current]["records"].length;i++) {
		var point = new GLatLng(bucketArray[current].records[i]["latitude"],bucketArray[current].records[i]["longitude"])
		var icon = getIcon(bucketArray[current].records[i]["type"])

		var iconOb = new GIcon(G_DEFAULT_ICON);
		if(icon != "") iconOb.image = icon;
		var marker = new GMarker(point, {% raw %}{icon:iconOb}{% endraw %})
		prevMarkers[prevMarkers.length]=marker
		map.addOverlay(marker)
	}

	if(current+1 &lt; bucketArray.length) window.setTimeout("doMarkers()", 1000)

}
</code>

<p>

Ok, a lot going on here. I begin by seeing if I have previous markers to delete. This will be true on the second iteration and will be true until the "viewer" is done. I'll end up storing my pointers in an array so I simply loop over that and run removeOverlay(). 

<p>

Next I work with a data structure called bucketArray. I'm going to explain how that is built later, but for now, just know it stores a date/time value and a list of 911 data. This is already ordered by time already, so as we go through the array we are going through time. You can see where I update the time div. Then I loop through my data. For each I figure out if I need a custom icon, and if so, I set it up. I then add the marker to the map being sure to store the result in my prevMarkers array. The last line simply calls out to itself to run the next block of data. 

<p>

My getIcon function just translates the 911 "type" into a custom icon:

<p>

<code>
function getIcon(s) {
	s = s.toLowerCase()
	if(s.indexOf("vehicle accident") &gt;= 0) return "icons/car.png";
	if(s.indexOf("stalled vehicle") &gt;= 0) return "icons/car.png";
	if(s.indexOf("traffic control") &gt;= 0) return "icons/stop.png";
	if(s.indexOf("traffic signal") &gt;= 0) return "icons/stop.png";
	if(s.indexOf("fire") &gt;= 0) return "icons/fire.png";
	if(s.indexOf("hazard") &gt;= 0) return "icons/hazard.png";
	return "";
}
</code>

<p>

I could update this as more types of emergencies occur. I'm still waiting for "Giant Monster" or "Alien Invasion." For the most part, that's the gist of the JavaScript. So how did I create my data? I began with a query:

<p>

<code>
&lt;cfquery name="getdata"&gt;
select	longitude, latitude, type, incidenttime
from data
where
	(longitude !='' and latitude != '')
	&lt;!--- fixes one bad row ---&gt;
	and longitude &lt; -88
	and incidenttime is not null
	order by incidenttime asc
&lt;/cfquery&gt;
</code>

<p>

I then figure out the range of my data:

<p>

<code>
&lt;!--- generate range of buckets ---&gt;
&lt;cfset earliest = getdata.incidenttime[1]&gt;
&lt;cfset latest = getdata.incidenttime[getdata.recordcount]&gt;
&lt;cfset earliest = dateFormat(earliest, "m/d/yy") & " " & timeFormat(earliest, "H") & ":00"&gt;
&lt;cfset latest = dateFormat(latest, "m/d/yy") & " " & timeFormat(latest, "H") & ":00"&gt;
</code>

<p>

Next I initialize my bucketArray:

<p>

<code>
&lt;cfset bucketArray = []&gt;
&lt;cfloop from="#earliest#" to="#latest#" index="x" step="#createTimeSpan(0,1,0,0)#"&gt;
	&lt;cfset arrayAppend(bucketArray, {% raw %}{date="#dateformat(x)# #timeformat(x)#"}{% endraw %})&gt;
&lt;/cfloop&gt;
&lt;!--- add one to top ---&gt;
&lt;cfset toAppend = dateAdd("h", 1, bucketArray[arrayLen(bucketArray)].date)&gt;
&lt;cfset arrayAppend(bucketArray, {% raw %}{date="#dateFormat(toAppend)# #timeFormat(toAppend)#"}{% endraw %})&gt;
&lt;!--- i'm pretty sure it is safe to do this ---&gt;
&lt;cfset arrayDeleteAt(bucketArray, 1)&gt;
</code>

<p>

So what's with the 'add one to top' and 'delete the bottom'? My thinking here was - if my last 911 report was for 5:14PM, I wanted to have this reported as 6PM. Every time value you see represents all the values for the last hour. By the same token, if my first bucket item is 1PM, it really means an item for 1:Something PM. Therefore I can drop that as well.

<p>

The final step was to populate the data:

<p>

<code>
&lt;cfloop index="b" array="#bucketArray#"&gt;
	&lt;cfset prev = dateAdd("h", -1, b.date)&gt;
	&lt;cfquery name="getInBucket" dbtype="query"&gt;
	select	*
	from	getdata
	where	incidenttime &gt;= &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#prev#"&gt;
	and		incidenttime &lt; &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#b.date#"&gt;
	&lt;/cfquery&gt;
	&lt;cfset b.records = getInBucket&gt;
&lt;/cfloop&gt;
</code>

<p>

To be honest, I bet I could do this all in one cfquery, probably by simply reformatting the date. Either way - it worked. So how did I get this bucketArray into JavaScript? It was incredibly difficult:

<p>

<code>
&lt;cfoutput&gt;
var #toScript(bucketArray,"bucketArray",false)#;
&lt;/cfoutput&gt;
</code>

<p>

Yeah, cry over that PHP boys. Anyway, here is the complete CFM file. I'll remind folks that I wrote this <i>very</i> quickly, so please forgive any obvious dumb mistakes.

<p>

<code>
&lt;cfquery name="getdata"&gt;
select	longitude, latitude, type, incidenttime
from data
where
	(longitude !='' and latitude != '')
	&lt;!--- fixes one bad row ---&gt;
	and longitude &lt; -88
	and incidenttime is not null
	order by incidenttime asc
&lt;/cfquery&gt;


&lt;!--- generate range of buckets ---&gt;
&lt;cfset earliest = getdata.incidenttime[1]&gt;
&lt;cfset latest = getdata.incidenttime[getdata.recordcount]&gt;
&lt;cfset earliest = dateFormat(earliest, "m/d/yy") & " " & timeFormat(earliest, "H") & ":00"&gt;
&lt;cfset latest = dateFormat(latest, "m/d/yy") & " " & timeFormat(latest, "H") & ":00"&gt;

&lt;cfset bucketArray = []&gt;
&lt;cfloop from="#earliest#" to="#latest#" index="x" step="#createTimeSpan(0,1,0,0)#"&gt;
	&lt;cfset arrayAppend(bucketArray, {% raw %}{date="#dateformat(x)# #timeformat(x)#"}{% endraw %})&gt;
&lt;/cfloop&gt;
&lt;!--- add one to top ---&gt;
&lt;cfset toAppend = dateAdd("h", 1, bucketArray[arrayLen(bucketArray)].date)&gt;
&lt;cfset arrayAppend(bucketArray, {% raw %}{date="#dateFormat(toAppend)# #timeFormat(toAppend)#"}{% endraw %})&gt;
&lt;!--- i'm pretty sure it is safe to do this ---&gt;
&lt;cfset arrayDeleteAt(bucketArray, 1)&gt;

&lt;!---
&lt;cfloop index="index" from="1" to="#arrayLen(bucketArray)#"&gt;
---&gt;
&lt;cfloop index="b" array="#bucketArray#"&gt;
	&lt;cfset prev = dateAdd("h", -1, b.date)&gt;
	&lt;cfquery name="getInBucket" dbtype="query"&gt;
	select	*
	from	getdata
	where	incidenttime &gt;= &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#prev#"&gt;
	and		incidenttime &lt; &lt;cfqueryparam cfsqltype="cf_sql_timestamp" value="#b.date#"&gt;
	&lt;/cfquery&gt;
	&lt;cfset b.records = getInBucket&gt;
&lt;/cfloop&gt;
&lt;!---
&lt;cfdump var="#bucketarray#"&gt;
---&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
&lt;cfoutput&gt;
var #toScript(bucketArray,"bucketArray",false)#;
&lt;/cfoutput&gt;

var current = -1;
var mainHB;
var prevMarkers = []
var map;

function getIcon(s) {
	s = s.toLowerCase()
	if(s.indexOf("vehicle accident") &gt;= 0) return "icons/car.png";
	if(s.indexOf("stalled vehicle") &gt;= 0) return "icons/car.png";
	if(s.indexOf("traffic control") &gt;= 0) return "icons/stop.png";
	if(s.indexOf("traffic signal") &gt;= 0) return "icons/stop.png";
	if(s.indexOf("fire") &gt;= 0) return "icons/fire.png";
	if(s.indexOf("hazard") &gt;= 0) return "icons/hazard.png";
	return "";
}

function doMarkers() {

	if(prevMarkers.length) {
		for(var i=0;i&lt;prevMarkers.length;i++) {
			map.removeOverlay(prevMarkers[i])
		}
		prevMarkers = []
	}

	current++
	var thisDate = bucketArray[current]["date"]
	console.log(thisDate + ' has '+bucketArray[current].records.length +' items')
	$("#clock").text(thisDate)
	for(var i=0; i&lt;bucketArray[current]["records"].length;i++) {
		var point = new GLatLng(bucketArray[current].records[i]["latitude"],bucketArray[current].records[i]["longitude"])
		var icon = getIcon(bucketArray[current].records[i]["type"])

		var iconOb = new GIcon(G_DEFAULT_ICON);
		if(icon != "") iconOb.image = icon;
		var marker = new GMarker(point, {% raw %}{icon:iconOb}{% endraw %})
		prevMarkers[prevMarkers.length]=marker
		map.addOverlay(marker)
	}

	if(current+1 &lt; bucketArray.length) window.setTimeout("doMarkers()", 1000)

}

function init() {
	map = ColdFusion.Map.getMapObject("mainMap")
	doMarkers()
}
&lt;/script&gt;
&lt;style&gt;
#clock {
	font-weight:bold;
	font-size: 40px;
	font-family: "Courier New", Courier, monospace;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfmap centeraddress="Lafayette, LA" width="500" height="500" zoomlevel="12" showcentermarker="false" name="mainMap"&gt;
&lt;/cfmap&gt;

&lt;div id="clock"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad("init")&gt;
</code>
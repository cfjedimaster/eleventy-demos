---
layout: post
title: "Yet another CFMAP Demo - Bird Report App"
date: "2010-03-25T21:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/03/25/Yet-another-CFMAP-Demo-Bird-Report-App
guid: 3763
---

Last week I wrote a <a href="http://www.raymondcamden.com/index.cfm/2010/3/16/Ask-a-Jedi-Click-a-CFMAP-to-get-LongitudeLatitude">blog entry</a> on how one could get the longitude and latitude of a position clicked on in a map. In my example, I built a simple "Bird Sighting Report" application. Every time you clicked on the map it got the longitude and latitude and create a form element from it. This worked for a simple demo, but I thought I could expand a bit on it and make it more "real world". Here is what I came up with.
<!--more-->
<p/>

I decided I needed two main changes to my demo. First, I wanted it so that when you clicked on the map, the form created both a hidden text field (to store the longitude and latitude) and a text area so the user could write about the bird they saw. (Or whatever - I actually have no interest in bird watching. Don't ask me why I used that as a demo.) The second change I wanted was the ability to remove a report. That way you can change your mind if you accidentally create an invalid report. The first change was trivial, the second change was, um, "Non Trivial" (and I'm sure my fellow developers know exactly how bad that can be). 

<p/>

Before I go any further, you can view the demo here: <a href="http://www.coldfusionjedi.com/demos/mar252010/test.cfm">http://www.coldfusionjedi.com/demos/mar252010/test.cfm</a> <b>Notice - it uses console.log - I'm sorry to you IE users out there! :)</b>

<p/>

If you remember from the previous demo, the code began by grabbing a pointer to the Google Map object and then adding a listener for the click event. That listener created the text field and little else. My first modification was to create a marker. I also updated the click handler to support clicking on <i>existing</i> markers. For those clicks it simply centered the map:

<p/>

<code>
GEvent.addListener(map, "click", function(overlay,latlng) {
	if(latlng) {
		//add the marker
		options = {% raw %}{title:"Bird Sighting Report"}{% endraw %}
		map.addOverlay(new GMarker(latlng,options))
		map.setCenter(latlng)
	} else if(overlay instanceof GMarker) {
		map.setCenter(overlay.getLatLng())
	}
})
</code>

<p/>

So where did I move the form creation? Overlays like markers are actually added asynchronously. I added a new event handler for marker creation - technically it is the "addoverly" event so I need to ensure that it is a marker being added.

<p/>

<code>
GEvent.addListener(map, "addoverlay", function(overlay) {
	if(overlay instanceof GMarker) {
		markers[markers.length]=overlay
		index = markers.length
		var s = ''
		s += '&lt;div class="sitereportdiv" id="sitereportdiv_' + index + '"&gt;'
		s += '&lt;b&gt;Bird Sighting Report&lt;/b&gt;: '
		s += '&lt;input type="hidden" name="sitereport_' + index + '" value="'+overlay.getLatLng()+'" size="50"&gt;&lt;br/&gt;'
		s += '&lt;textarea class="sitereportbody" name="sitereportbody_' + index + '"&gt;&lt;/textarea&gt;&lt;br/&gt;'
		s += 'Enter details about the bird sighting, including, um, bird stuff.&lt;br/&gt;'
		s += '&lt;a href="'+(markers.length-1)+'" class="killmarker"&gt;Remove this Report&lt;/a&gt;'
		s += '&lt;/div&gt;'
		console.log(s)
		$("#submitButton").before(s)
		$("#submitButton").show()
	}
})
</code>

<p/>

So theres a bit going on here. First off, I'm recording the markers in an array. Back in December I <a href="http://www.coldfusionjedi.com/index.cfm/2009/12/12/Working-with-Dynamic-Map-Markers-in-ColdFusion-9">blogged</a> about a way to handle adding and removing markers. Because ColdFusion's addMarker didn't return the marker object, I used this technique to store the markers in an array I could manipulate later. (See note at the end of the blog entry on a thought I just had on how I could simplify this.) For the most part, I'm just creating a big old text block. I store the longitude and latitude in the hidden field and create a textarea for the report. 

<p/>

The next piece to the application was supporting removing markers on clicking the special link added below each form field. Now here is where I lost the most time. Originally I had each report numbered. Report 1, Report 2, etc. This meant that when I deleted report 1, I needed to renumber the rest of the reports. I actually got that working, but I then discovered something odd. Google's API does not let you change the title (hover text) of a marker. -boggle-. It let you change other aspects, but not the title. I tried a few things, but eventually gave up. As you see, I now just have a basic text title. I did want to have nicely numbered form fields though. I didn't want the server side code to handle to handle stuff like, Report 1 + Report 4. So I've got two functions here to handle it. First, the 'kill marker' code:

<p/>

<code>
$(".killmarker").live("click", function() {
	//get the array pos which gives us a pointer to the marker
	var pos = $(this).attr('href')
	map.removeOverlay(markers[pos]) 
	$(this).parent().remove()
	//update reports so they report the right num
	updateReports()
	return false
})
</code>

<p/>

This isn't anything new (if you read the earlier blog entry), but the updateReports is what I wrote to handle renaming the form fields:

<p/>

<code>
function updateReports() {

	var divcounter = 0
	$(".sitereportdiv").each(function() {
		divcounter++
		thisid = $(this).attr("id").split("_")[1]
		if(divcounter != thisid) {
			console.log("it is "+thisid+" but should be "+divcounter)
			//Fix the ID
			$(this).attr("id","sitereportdiv_"+divcounter)
			//Fix the hidden form field
			$("input", this).attr("name","sitereport_"+divcounter)
			//Fix the text area
			$("textarea", this).attr("name","sitereportbody_"+divcounter)
		}
	})
}
</code>

<p/>

It should be pretty self-explanatory. I get the ID of each div and if it's numeric values don't match it's order, then I do an update. 

<p/>

This left me with one last problem. I've got markers on the map, but they have generic titles. How does one correlate the Nth form field with the markers on the map. I decided I'd add a click event to the div. This was done like so:

<p/>

<code>
$(".sitereportdiv").live("click", function() {
	//get the array pos which gives us a pointer to the marker
	console.log('clicked in text area')
	var markerpos = $("a", this).attr("href")
	map.setCenter(markers[markerpos].getLatLng())
	return false
})
</code>

<p/>

As you can see, I use the 'delete' link in the div to figure out the marker, and once I have that, I can use it to center my map. 

<p/>

All in all, I think it is a pretty cool little application, but it reminds me yet again how quickly a simple Ajax/JS application can go from "simple" to "scary/non trivial." I'll be leading a session/group discussion on this at <a href="http://www.scotch-on-the-rocks.co.uk/">Scotch on the Rocks</a>. The complete code of the demo is below.

<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;

&lt;script&gt;
var counter
var markers = []

function init() {
	counter = 0
	map = ColdFusion.Map.getMapObject('mainMap')

	GEvent.addListener(map, "addoverlay", function(overlay) {
		if(overlay instanceof GMarker) {
			markers[markers.length]=overlay
			index = markers.length
			var s = ''
			s += '&lt;div class="sitereportdiv" id="sitereportdiv_' + index + '"&gt;'
			s += '&lt;b&gt;Bird Sighting Report&lt;/b&gt;: '
			s += '&lt;input type="hidden" name="sitereport_' + index + '" value="'+overlay.getLatLng()+'" size="50"&gt;&lt;br/&gt;'
			s += '&lt;textarea class="sitereportbody" name="sitereportbody_' + index + '"&gt;&lt;/textarea&gt;&lt;br/&gt;'
			s += 'Enter details about the bird sighting, including, um, bird stuff.&lt;br/&gt;'
			s += '&lt;a href="'+(markers.length-1)+'" class="killmarker"&gt;Remove this Report&lt;/a&gt;'
			s += '&lt;/div&gt;'
			console.log(s)
			$("#submitButton").before(s)
			$("#submitButton").show()
		}
	})
	
	GEvent.addListener(map, "click", function(overlay,latlng) {
		if(latlng) {
			//add the marker
			options = {% raw %}{title:"Bird Sighting Report"}{% endraw %}
			map.addOverlay(new GMarker(latlng,options))
			map.setCenter(latlng)
		} else if(overlay instanceof GMarker) {
			map.setCenter(overlay.getLatLng())
		}
	})

	$(".killmarker").live("click", function() {
		//get the array pos which gives us a pointer to the marker
		var pos = $(this).attr('href')
		map.removeOverlay(markers[pos]) 
		$(this).parent().remove()
		//update reports so they report the right num
		updateReports()
		return false
	})

	$(".sitereportdiv").live("click", function() {
		//get the array pos which gives us a pointer to the marker
		console.log('clicked in text area')
		var markerpos = $("a", this).attr("href")
		map.setCenter(markers[markerpos].getLatLng())
		return false
	})
	
}

function updateReports() {

	var divcounter = 0
	$(".sitereportdiv").each(function() {
		divcounter++
		thisid = $(this).attr("id").split("_")[1]
		if(divcounter != thisid) {
			console.log("it is "+thisid+" but should be "+divcounter)
			//Fix the ID
			$(this).attr("id","sitereportdiv_"+divcounter)
			//Fix the hidden form field
			$("input", this).attr("name","sitereport_"+divcounter)
			//Fix the text area
			$("textarea", this).attr("name","sitereportbody_"+divcounter)
		}
	})
}

&lt;/script&gt;

&lt;style&gt;
.sitereportdiv {
	background-color: #93cdff;
	margin-bottom:5px;	
	padding: 5px;
	width: 500px;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Bird Spotting Form&lt;/h2&gt;

&lt;cfmap name="mainMap" centeraddress="Lafayette, LA" showcentermarker="false" zoomlevel="13"&gt;
&lt;p&gt;
Click on the map to record where you saw a bird.
&lt;/p&gt;

&lt;form id="mainForm" method="post"&gt;
	&lt;input type="submit" value="Send Report" id="submitButton" style="display:none"&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;

&lt;cfif not structIsEmpty(form)&gt;
	&lt;cfdump var="#form#" label="form"&gt;
&lt;/cfif&gt;
</code>
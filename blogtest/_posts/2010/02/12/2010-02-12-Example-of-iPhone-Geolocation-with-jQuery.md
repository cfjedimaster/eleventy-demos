---
layout: post
title: "Example of iPhone Geolocation with jQuery"
date: "2010-02-12T17:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/02/12/Example-of-iPhone-Geolocation-with-jQuery
guid: 3721
---

At lunch today I took a quick look at how Safari on the iPhone handles Geolocation. If you have an iPhone (you know, that device that doesn't play Flash?) then you've probably seen applications that ask permission to locate your position. The hardware supports it both for applications but web pages as well. I was curious to see a) how difficult it would be to use and b) if it could degrade nicely for other clients.
<!--more-->
So to begin, I found an excellent blog post that demonstrated a simple example of the code: <a href="http://mapscripting.com/how-to-use-geolocation-in-mobile-safari">How to Use Geolocation in Mobile Safari</a>. 
<p>
His code sample was simple and to the point:
<p>
<code>
navigator.geolocation.getCurrentPosition(foundLocation, noLocation);

function foundLocation(position)
{
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  alert('Found location: ' + lat + ', ' + long);
}
function noLocation()
{
  alert('Could not find location');
}
</code>
<p>
Basically - run a getCurrentPosition and pass it a pass/fail operator. I tested this just to ensure it worked and it did perfectly. Using that as a base I began to work on a simple application.
<p>
My idea was simple - I'd tie onto Yahoo's <a href="http://developer.yahoo.com/local/">Local Search</a> API. I'd have a form where you could enter "pizza", and because we knew your longitude/latitude, we could pass that to Yahoo. To support browsers/clients that couldn't use this, I'd use jQuery to simply <i>ask</i> the user for their location. This works because Yahoo's APIs supports both a precise location, or a precise street/city/state, as well as a loose "location" argument. Kudos to Yahoo for being so flexible. 
<p>
Before I go further - one thing I don't like about JavaScript based blog entries is that it's sometimes difficult to explain the process. The code I'm going to show was done over multiple iterations, but since I didn't save each and every edit, your only going to see the final result. Do know that I certainly didn't write it out like this - it took more than one try to get it right. 
<p>
That being said - let's begin with the view area:
<p>
<code>
&lt;form id="searchForm"&gt;
Search for: &lt;input type="text" id="term" value="pizza"&gt;
&lt;/form&gt;
&lt;input type="button" id="searchBtn" value="Search" disabled="true"&gt;

&lt;div id="results"&gt;&lt;/div&gt;
</code>
<p>
Nothing too fancy here. You can see a form with a search field, a button (I'll explain why I put it outside the form in a PS), and a div for my results. Now let's go up to my JavaScript. 
<p>
<code>
&lt;script&gt;
var lat = "";
var long = "";

function foundLocation(position) {
	lat = position.coords.latitude
	long = position.coords.longitude
	$("#searchBtn").attr("disabled", false)	
	$("#results").html("")
}

function noLocation() {
	$("#results").html("")
	$("#searchBtn").attr("disabled", false)
	$("#searchForm").append(" Location: &lt;input type='text' id='location'&gt;")
}

$(document).ready(function() {
	if(navigator.geolocation == null) noLocation()
	else {
		$("#results").html("&lt;i&gt;Locating you...&lt;/i&gt;")
		navigator.geolocation.getCurrentPosition(foundLocation, noLocation) 
	}

	$("#searchBtn").click(function() {
		$("#results").html("&lt;i&gt;Searching...&lt;/i&gt;")
		var theURL = "http://local.yahooapis.com/LocalSearchService/V3/localSearch?callback=?"
		var data = {
			appid:"5rJLaITV34GaU8t05tz.MIYQfRol9PBL51PyK3KAhmRiFa0FEAtvFyD36r4xTns_VRP1",
			output:"json",
			query:$("#term").val()
		}
		if(lat != "" && long != "") {
			data.latitude = lat
			data.longitude = long
		} else {
			data.location = $("#location").val()
		}

		$.getJSON(theURL,data, function(d,s) {
			var result = ""
			for(var i=0; i&lt;d.ResultSet.Result.length;i++) {
				var node = d.ResultSet.Result[i]
				result += "&lt;p&gt;&lt;b&gt;" + node.Title + "&lt;/b&gt;&lt;br/&gt;"
				result += "&lt;a href='" + node.ClickUrl + "'&gt;"+node.Url+"&lt;/a&gt;&lt;br/&gt;"
				result += node.Address + ", "+node.City+", "+node.State+"&lt;/p&gt;"
			}
			$("#results").html(result)
		})
	})
})

&lt;/script&gt;
</code>
<p>
Ok, there's a lot going on here. Let's focus first on the document.ready block. I begin by checking to see if the navigator.geolocation object exists. If it doesn't, it means we are on a browser where we can't get the user's location. That runs the noLocation function. It enables the search button for my form (which I disabled while I was working) and adds a field for the user's location. 
<p>
If the geolocation object exists, we fire off the request. Now notice - if for some reason the lookup fails, we still run the noLocation function. So we've got support for both non-supported clients and the user saying no to the location request. (Or some other error happening.) If the location works right, we have access to the user's longitude and latitude. We store those values and enable the button. (Notice I made use of the results area to tell the user I was looking up his location.) 
<p>
Ok, so the final bit of code handles the Yahoo API stuff. I've got a click event listener for the search button. It can tell if it currently knows the long/lat value and will use it if so. Otherwise it uses the freeform location field. I construct my data and fire it off to Yahoo. The result handler simply outputs the result. 
<p>
You can demo this here: <a href="http://www.raymondcamden.com/demos/feb1210/test4b.cfm">http://www.coldfusionjedi.com/demos/feb1210/test4b.cfm</a>
<p>
I tested it in Chrome, my iPhone Simulator (which uses a California location) and my actual iPhone, and it seems to work well.
<p>
p.s. So why did I put the button outside of the form? Probably a dumb reason, but I had trouble getting jQuery to add my location field before the search button. When I did a prepend, it just didn't show up. When I append to the search term field, it didn't work. When I appended to the form tag - it worked perfectly - but added it after the search button. Probably something silly I did wrong there - but I went with a quick fix.
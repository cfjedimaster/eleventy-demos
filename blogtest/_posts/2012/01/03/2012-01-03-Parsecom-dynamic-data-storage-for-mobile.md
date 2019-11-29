---
layout: post
title: "Parse.com - dynamic data storage for mobile"
date: "2012-01-03T13:01:00+06:00"
categories: [jquery,mobile]
tags: []
banner_image: 
permalink: /2012/01/03/Parsecom-dynamic-data-storage-for-mobile
guid: 4479
---

<b>Updated September 3, 2012: As just an FYI, since I wrote this post Parse launched a JavaScript API. I'd recommend using that instead of the REST-based API if you are using JavaScript. You can still use the REST-based API, but using their JS API let's you skip some of the authorization issues I had below.</b>

During the Christmas break, I had the chance to look at, and play with, <a href="https://www.parse.com/">Parse</a>. While you can check the site for the marketing description, the basic idea behind the service is a way to store data for mobile applications without the need for a server. I played with their API and was incredibly impressed by what I saw. Here's why you should consider them:
<!--more-->
<p/>

<ul>
<li>First off - you can skip setting up a server. Now, I know that may sound crazy. I use ColdFusion everywhere. Most of us have a web server we can use. But having an ad hoc back end system for your mobile apps is a powerful incentive. 
<li>Their storage system allows you to store any data. Basically, you can take your JavaScript object, JSON serialize it, and store. While not explicitly called out on their site (or maybe it is, I didn't check every page), they are obviously using some form of NoSQL on the back end.
<li>They automatically handle basic metadata for your objects. So no need to worry about a created or updated field. It's a small thing, but darn useful.
</ul>

 <p/>

Parse has full SDKs for Android and iOS, but even better, they've got a URL based API. You can use this API to create, update, delete, and search your data. 

<p>

Just to reiterate to make sure this is clear - your mobile applications can make use of a dynamic database without any setup on your web server. Just sign up, get your keys, and get cranking.

<p>

Even better, they provide some real good benefits on top of what I already said.

<p>

First - any objects you create will have metadata (date+ID) added to them automatically. Yeah you could do that yourself, but it's a handy addition. 

<p>

Second - they have special support for users. Basically, they recognize that user objects are probably something almost every application has, so they go out of their way to handle them better and make it part of your model.

<p>

Third - they also support geolocation searches. I'm not sure how often I'd use this, but if you tag data with a location, they make it trivial to later search for objects within a certain range. I've done this manually a few times in SQL and I can tell you - it's not fun. (Even when cutting and pasting a solution.) 

<p>

Four - they have a nice web based data browser. This allows you to do some basic CRUD type operations and is real useful while testing:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip7.png" />

<p>

You can read more about their REST API <a href="https://www.parse.com/docs/rest">here</a>. I decided to give their API a try with PhoneGap and jQuery. While Parse is a paid service, they do <a href="https://www.parse.com/pricing">offer a free</a> version in their pricing plans. 

<p>

Hitting their API with jQuery proved to be a bit difficult. You need to include a username and password (which corresponds with two of your keys). That parts easy enough if you use $.ajax. What proved more difficult was the Authorization header. This header needs to be the combination of the username/password strings and has to be Base64 encoded. 

<p>

I found a JavaScript library for this here: <a href="http://www.webtoolkit.info/javascript-base64.html">http://www.webtoolkit.info/javascript-base64.html</a>. 

<p>

This worked, but I also discovered that some modern browsers include it natively via window.btoa. I combined this with a <a href="http://coderseye.com/2007/how-to-do-http-basic-auth-in-ajax.html">blog post</a> by Bruce Kroez to come up with this method:

<p>

<code>
function make_base_auth(user, password) {
	  var hash = window.btoa(tok);
	  return "Basic " + hash;
	}
</code>

<p>

I believe, stress, believe, window.btoa may not work in iOS. If so, switch to the JavaScript library version listed above. So given that, a basic hit to Parse via jQuery could look like so:

<p>

<code>
var note = {
		title:"Test title",
		body:"Test body"
};

$.ajax({
	contentType:"application/json",
	dataType:"json",
	url:ROOT+"classes/note",
	username:appId,
	password:masterKey,
	processData:false,
	headers:{
		"Authorization": make_base_auth(appId,masterKey)
	},
	type:"POST",
	data:JSON.stringify(note),
	error:function(e) {% raw %}{ alert('error: '+e);}{% endraw %}
}).done(function(e,status) {
	alert('Done');
});
</code>

<p>

In this case, I'm adding an object by doing a POST. Notice how I can just make a note object, serialize it, and send it. <b>I love that.</b> You get a JSON object back containing the ID of the new object. How about listing objects?

<p>

<code>
$.ajax({
	contentType:"application/json",
	dataType:"json",
	url:ROOT+"classes/note",
	username:appId,
	password:masterKey,
	processData:false,
	headers:{
		"Authorization": make_base_auth(appId,masterKey)
	},
	type:"GET",
	error:function(e) {% raw %}{ alert('error: '+e);}{% endraw %}
}).done(function(e,status) {
	var s = "";
	for(var i=0; i&lt;e.results.length; i++) {
		var note = e.results[i];
		s+= "&lt;p&gt;&lt;b&gt;id:&lt;/b&gt;"+note.objectId+"&lt;br/&gt;";
		s+= "&lt;b&gt;created:&lt;/b&gt;"+note.createdAt+"&lt;br/&gt;";
		s+= "&lt;b&gt;title:&lt;/b&gt;"+note.title+"&lt;br/&gt;";
		s+= "&lt;/p&gt;";
	}
	$("#result").html(s);
});
</code>

<p>

Note that the significant change here was from POST to GET. It's as simple as that. I can then loop over my results and display them how I choose. Note that they support both pagination and getting the total number of results too. 

<p>

So, how about an application? I wrote a super simple application that let's me add an object by clicking a button and then generate a list. It isn't dynamic at all, but demonstrates the API. jQuery supports an ajaxSetup function which lets me default a lot of the stuff you saw above. First, I built up a super simple HTML page:

<p>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;

&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;PhoneGap&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/phonegap-1.3.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/jquery-1.7.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/jquery.parse.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/main.js"&gt;&lt;/script&gt;
&lt;style&gt;
input[type=button] {
	width: 100%;
	padding: 10px;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;

&lt;input type="button" id="addBtn" value="Add Item"&gt;&lt;br/&gt;
&lt;input type="button" id="listBtn" value="List Items"&gt;&lt;br/&gt;
&lt;div id="result"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And then whipped up this JavaScript:

<p>

<code>
var appId = "f4yClrICW58n0IbryPbFFBC99cZvHUaVI0muEH7d";
var clientKey = "ameusdLfx4Kl4nV316lzMX8Wb0lli4NEpb5GgDXN";
var masterKey = "PiRAKmRtMIaexl4uBlvMDyo6gEUvCpLHpYqOIuJo";
var ROOT = "https://api.parse.com/1/";

$.ajaxSetup({
	contentType:"application/json",
	dataType:"json",
	username:appId,
	password:masterKey,
	processData:false,
	headers:{
		"Authorization": make_base_auth(appId,masterKey)
	},
	error:function(e) {% raw %}{ alert('error: '+e);}{% endraw %}
});

function init() {
	document.addEventListener("deviceready", deviceready, true);
}

function make_base_auth(user, password) {
	  var tok = user + ':' + password;
//	  var hash = Base64.encode(tok);
	  var hash = window.btoa(tok);
	  return "Basic " + hash;
	}

function deviceready() {
	
	$("#addBtn").on("click", function() {
		//demo adding an item
		var note = {
				title:"Test title",
				body:"Test body"
		};
		
		$.ajax({
			url:ROOT+"classes/note",
			type:"POST",
			data:JSON.stringify(note)
		}).done(function(e,status) {
			alert('Done');
		});
	});

	$("#listBtn").on("click", function() {
		//demo getting items
		$.ajax({
			url:ROOT+"classes/note",
			type:"GET"
		}).done(function(e,status) {
			var s = "";
			for(var i=0; i&lt;e.results.length; i++) {
				var note = e.results[i];
				s+= "&lt;p&gt;&lt;b&gt;id:&lt;/b&gt;"+note.objectId+"&lt;br/&gt;";
				s+= "&lt;b&gt;created:&lt;/b&gt;"+note.createdAt+"&lt;br/&gt;";
				s+= "&lt;b&gt;title:&lt;/b&gt;"+note.title+"&lt;br/&gt;";
				s+= "&lt;/p&gt;";
			}
			$("#result").html(s);
		});
	});

}
</code>

<p>

Here's a quick screen shot:

<p>

<img src="https://static.raymondcamden.com/images/device-2012-01-03-132751.png" />

<p>

As I said, I think this is an incredibly impressive service. The only negative I can see so far is that it seems a bit slow, but, I only tested with the Android Emulator, and that tends to make <i>everything</i> look a bit slow. I've yet to test it on a real device over WiFi yet. 

<p>

Also - note that their REST API will also work great with your server applications. Now, I know I just said you don't need a server, but if you want to offload data storage and traffic to Parse, you can use another server to handle things like reporting or management. I tried calling Parse via ColdFusion and it worked well.
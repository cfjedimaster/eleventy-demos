---
layout: post
title: "Working with dates and SQLite in PhoneGap"
date: "2012-01-06T10:01:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/01/06/Working-with-dates-and-SQLite-in-PhoneGap
guid: 4484
---

One of my favorite features of Adobe AIR, and in HTML5, is the ability to make use of a local SQLite database. For mobile or desktop applications, having a little mini-database is incredibly useful. While SQLite can't replace SQL Server, as a single user embedded database it's a great feature to have. One thing that can be difficult though is dealing with types in SQLite. SQLite only has a few basic types, one of which is <i>not</i> a native date type. It does support date style functions and can do basic parsing. Getting dates working correctly in your PhoneGap application can be a bit tricky. Here's what I came up - and as always - if folks have a better solution, please share!
<!--more-->
<p>

First off, I recommend quickly reading over the <a href="http://www.sqlite.org/datatype3.html">SQLite docs on types</a>. It talks about the core types they support and how other types are mapped. While you can use a DATE type for your column, it's going to map to NUMERIC. I setup my JavaScript code to prepare a simple table.

<p>

<code>

function init() {
	document.addEventListener("deviceready", deviceready, true);
}

var db;

function deviceready() {
	db = window.openDatabase("test", "1.0", "test", 1000000);
	db.transaction(setup, errorHandler, dbReady);
}

function setup(tx) {
	tx.executeSql('create table if not exists log(id INTEGER PRIMARY KEY AUTOINCREMENT, '+
				  'log TEXT, created DATE)');
}
</code>

<p>

Hopefully this makes sense. The important part is the table definition. To be clear, yes, I'm using DATE as a column type, but it's going to map to numeric in SQLite. 

<p>

So given this, I decided I'd add some simple logic to make it very quick to add test data as well as list out my current data. So my HTML looks like so:

<p>

<code>
&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;

&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;PhoneGap&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/phonegap-1.2.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/jquery-1.7.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="js/main.js"&gt;&lt;/script&gt;

&lt;/head&gt;

&lt;body onload="init()"&gt;

&lt;input type="button" id="addButton" value="Click to Add"&gt;

&lt;input type="button" id="testButton" value="Test Data"&gt;

&lt;div id="result"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Not very realistic, but simple. One button to add stuff, one to list stuff out. Let's first take a look at the addButton click logic.

<p>

<code>
$("#addButton").on("touchstart", function(e) {
	db.transaction(function(tx) {
		var msg = "Log it...";
		var d = new Date();
		d.setDate(d.getDate() - randRange(1,30));
		tx.executeSql("insert into log(log,created) values(?,?)",[msg,d.getTime()]);
	}, errorHandler, function() {% raw %}{ alert('added row'); }{% endraw %});
});
</code>

<p>

Since this is just a proof of concept, the code here isn't working with user-created data, but rather using a static string and a random date. (The function randRange is defined later in the file.) This function lets me click a few times to enter some random data. The dates will fall in a range of one day ago to 30 days ago. 

<p>

The critical part here is how I store the dates. I tried storing them as is - but what happens is that the date is converted into a string. SQLite let's you define column types, but you can stick anything you want in them. I switched to getTime(), which returns the number of milliseconds since 1970. This will be a nice numeric value that will be easier to work with.

<p>

Ok, so now let's look at the display logic.

<p>

<code>
$("#testButton").on("touchstart", function(e) {
	db.transaction(function(tx) {
		tx.executeSql("select * from log order by created desc",[], gotLog,errorHandler);
	},errorHandler, function() {});
});


function gotLog(tx, results) {
	if(results.rows.length == 0) {
		alert("No data.");
		return false;
	}

	var s = "";
	for(var i=0; i&lt;results.rows.length; i++) {
		var d = new Date();
		d.setTime(results.rows.item(i).created);
		s += d.toDateString() + " "+d.toTimeString() + " (original="+results.rows.item(i).created+")&lt;br/&gt;";
	}
	$("#result").html(s);
}
</code>

<p>

The first block is the click handler for the button. It handles running my simple SQL. Note the order by clause. Since we are storing are dates as numbers, this is all we need to do - treat it like a number. How would you handle a date range search? For example, just the last week? Simple - make a JavaScript date object for today. One for 7 days ago. And then convert both to numbers using getTime(). 

<p>

The display logic is simple - if a bit ugly. I create new JavaScript date objects from the numbers stored in the database. I render that - and the original - just so I can see how things looked. Here's a screen shot:

<p>

<img src="https://static.raymondcamden.com/images/device-2012-01-06-094833.png" />

<p>

Over all - pretty simple once you realize how you have to store the data and work with it on the client side. I've attached a zip of the entire project for folks who want to download and try it yourself.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FDBDate%{% endraw %}2Ezip'>Download attached file.</a></p>
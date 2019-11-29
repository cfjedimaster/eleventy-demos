---
layout: post
title: "Serverless iCal Parsing"
date: "2017-08-24T09:00:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/08/24/serverless-ical-parsing
---

Today's post isn't necessarily too interesting code-wise, but it touches upon some greater, more broad, serverless topics that I'd like to bring up. A few weeks ago I discovered an interesting GitHub repository: https://github.com/gadael/icsdb. 

This repository contains iCal files (think plain text calendar data) for non-working days for all 50 US states and various European countries. This could be useful in a number of ways, if, of course, you can parse the iCal data. I thought it might be interesting to build a simple service that would take a URL pointing to iCal data and return the information in JSON form.

There are multiple different ways of parsing iCal, but I felt [ical.js](https://github.com/mozilla-comm/ical.js/) by Mozilla was good enough. The ical.js library is pretty complex, letting you work with iCal data like a component, calling different methods to find data, but it can also just return a simple parsed version of the text. Here is the code I came up with:

<pre><code class="language-javascript">const rp = require(&#x27;request-promise&#x27;);
const ical = require(&#x27;ical.js&#x27;);

function flattenEvent(e) {
	let event = {};
	for(let i=0;i&lt;e[1].length;i++) {
		let prop = e[1][i];
		event[prop[0]] = prop[3];
		&#x2F;&#x2F;console.log(&#x27;e&#x27;,prop);
	} 
	return event;
}

exports.main = (args) =&gt; {

	return new Promise((resolve, reject) =&gt; {
		rp(args.url).then((txt) =&gt; {
			try {
				let parsed = ical.parse(txt);
				let events = parsed[2];

				let result = [];
				events.forEach(e =&gt; result.push(flattenEvent(e)));
				resolve({% raw %}{events:result}{% endraw %});
			} catch(e) {
				console.log(e);
				reject(e.message);
			}
		})
		.catch((e) =&gt; {
			reject(e);	
		});
	});
}
</code></pre>

Basically - suck down the remote URL and parse using the library. As I said, there is a nice "object based" API that the library provides, but I found I could work with the initial data a bit easier. You can see where I just grab the third item in the array to get the actual events. I then "flatten" the data using `flattenEvent`. If your curious, the data is in a form called jCal, which has a specification: https://tools.ietf.org/html/draft-ietf-jcardcal-jcal-10. My `flattenEvent` function makes some assumptions that may not necessarily always work out well, but so far it's done ok. 

I tested it by asking for Louisiana holidays:

	wsk action invoke ical/get --param url 
	https://raw.githubusercontent.com/gadael/icsdb/master/build/en-US/us-louisiana-nonworkingdays.ics
	-r

And here are the top five results.

<pre><code class="language-javascript">
{
	"class": "PUBLIC",
	"created": "2014-01-09T00:47:56Z",
	"description": "",
	"dtend": "1970-01-02",
	"dtstamp": "2017-06-23T13:53:48Z",
	"dtstart": "1970-01-01",
	"last-modified": "2017-06-23T13:53:48Z",
	"rrule": {
		"freq": "YEARLY"
	},
	"sequence": 0,
	"status": "CONFIRMED",
	"summary": "New Year's Day",
	"transp": "TRANSPARENT",
	"uid": "b901ca08-d924-43c3-9166-1d215c9453d6"
},
{
	"class": "PUBLIC",
	"created": "2014-01-09T00:47:56Z",
	"description": "",
	"dtend": "1983-01-02",
	"dtstamp": "2017-06-23T13:53:48Z",
	"dtstart": "1983-01-01",
	"last-modified": "2017-06-23T13:53:48Z",
	"rrule": {
		"byday": "3MO",
		"freq": "YEARLY"
	},
	"sequence": 0,
	"status": "CONFIRMED",
	"summary": "Marthin Luther King day/Robert E. Lee day",
	"transp": "TRANSPARENT",
	"uid": "0ae8128a-e360-492c-b2bd-52ed0d6d06fd"
},
{
	"categories": "-New Mexico",
	"class": "PUBLIC",
	"created": "2014-01-09T00:47:56Z",
	"description": "",
	"dtend": "1970-02-01",
	"dtstamp": "2017-06-23T13:53:48Z",
	"dtstart": "1970-02-01",
	"last-modified": "2017-06-23T13:53:48Z",
	"rrule": {
		"byday": "3MO",
		"freq": "YEARLY"
	},
	"sequence": 0,
	"status": "CONFIRMED",
	"summary": "Presidents Day",
	"transp": "TRANSPARENT",
	"uid": "17425d41-9ed3-4088-adad-4693d1bd44c9"
},
{
	"categories": "Louisiana",
	"class": "PUBLIC",
	"created": "2014-01-09T00:47:56Z",
	"description": "",
	"dtend": "1970-04-02",
	"dtstamp": "2017-06-23T13:53:48Z",
	"dtstart": "1970-04-01",
	"last-modified": "2017-06-23T13:53:48Z",
	"rdate": "1970-02-10",
	"sequence": 0,
	"status": "CONFIRMED",
	"summary": "Mardi gras",
	"transp": "TRANSPARENT",
	"uid": "7ac45e93-a684-4061-a0c7-948a89e358b0"
},
{
	"categories": "Connecticut",
	"class": "PUBLIC",
	"created": "2014-01-09T00:47:56Z",
	"description": "",
	"dtend": "1970-04-09",
	"dtstamp": "2017-06-23T13:53:48Z",
	"dtstart": "1970-04-08",
	"last-modified": "2017-06-23T13:53:48Z",
	"rdate": "1970-03-26",
	"sequence": 0,
	"status": "CONFIRMED",
	"summary": "Good Friday",
	"transp": "TRANSPARENT",
	"uid": "3c46243f-00f8-418f-94cf-4eda72ae7cb2"
}
</code></pre>

So... that's some data. Cool. What would I do next? When I first started thinking about this data, my first thought is that it could be a useful API for web apps. I'm a web developer so *everything* looks like a web-related source for me. Of course, why would I need serverless for that? I could run the iCal library in the browser - the only issue I'd run into is CORS - maybe. And I could always copy the iCal files to the same server as the app. But that's really limited thinking.

By creating this as a serverless action, I've opened it up to *any* event source, web or not. How about an example of something completely non-web based?

Imagine a support service where every day, my process gets a list of employees responsible for IT work in case of emergencies. I could imagine a process by which after getting a list of employees, I could check each one's home state against a list of holidays for that state and determine if that person is off today. It's the exact same code, but I'm simply using it in a different context.

And this is something important to keep in mind here. Serverless isn't just about building NodeJS apps simpler. Instead I'm creating a resource that can be used in multiple situations, both direct (web app making a request) and indirect (a process run on a timed schedule).

This is something I've talked about before, but I feel like it's something that's possibly not quite as evident. 

p.s. You can find the source code for this demo here: https://github.com/cfjedimaster/Serverless-Examples/blob/master/ical/get.js
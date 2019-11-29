---
layout: post
title: "Hackin' the MAX Scheduler"
date: "2010-06-30T21:07:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/06/30/Hackin-the-MAX-Scheduler
guid: 3866
---

Ok, "hacking" may be too strong a word, but I thought I'd share a fun little diversion I tried at lunch. I noticed that the <a href="http://max.adobe.com/schedule/by-session/">MAX 2010 Scheduler</a> oddly did not list session times. You could browse by day of course, but I prefer to browse by session title. I was also curious to see when my session was. Unfortunately, the date and times for each session were not available in that view. 
<p>
<!--more-->
I then decided to do what any self-respecting web developer would do. I opened up the Developer tools in Chrome (think Firebug) and became to monitor what was going on. I noticed that the data for the scheduler came from a few JSON requests. I took a look at them and found that the JSON data for sessions actually contained the date and times - the front end just wasn't using it. So I quickly decided to play with this data myself. I began by creating a simple ColdFusion file that would proxy the JSON requests for me. An AIR app wouldn't need this - but I wanted something done <i>super</i> quick. I came up with the following:
<p>
<code>
&lt;cfparam name="url.u" default=""&gt;

&lt;cfset safeurls = "http://max.adobe.com/v1/events/ebdabc28-aab4-479f-86f3-6bd9d97b4cc7/speakers.json,http://max.adobe.com/v1/events/ebdabc28-aab4-479f-86f3-6bd9d97b4cc7/sessions.json"&gt;

&lt;cfif url.u is "" or not isValid("url", url.u) or not listFindNoCase(variables.safeurls, url.u)&gt;
	&lt;cfabort/&gt;
&lt;/cfif&gt;

&lt;cfif isNull(cacheGet("urlcache_#url.u#"))&gt;
	&lt;cfhttp url="#url.u#" timeout="20"&gt;
	&lt;cfset cachePut("urlcache_#url.u#", cfhttp.filecontent,1)&gt;
&lt;/cfif&gt;

&lt;cfset data = cacheGet("urlcache_#url.u#")&gt;
&lt;cfcontent type="application/json" reset="true"&gt;&lt;cfoutput&gt;#data#&lt;/cfoutput&gt;
</code>

<p>

There isn't a lot here. Basically look for a URL to request in the URL scope (sorry if that sounds confusing) and validate the value against a list of URLs. Next - see if I have the request in the cache. If not, fetch it with cfhttp and store it for a day. Finally, get the data from the cache and output it to the screen. My front end was a bit more complex:

<p>

<code>
&lt;html&gt; 
 
&lt;head&gt; 
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt; 
&lt;script&gt; 
var speakers = []
var sessions = []
var searchReady = false
 
function renderSession(session) {
	var res = ""
	res += "&lt;div class='session'&gt;"
	res += "&lt;h2&gt;"+session.name+"&lt;/h2&gt;"
	res += "&lt;b&gt;Times:&lt;/b&gt; "
	if(session.instances.length == 0) res += "None Scheduled&lt;br/&gt;"
	else {
		for(var i=0; i&lt;session.instances.length;i++) {
			res += session.instances[i].date + " " + session.instances[i].time
			if(i+1 &lt; session.instances.length) res+= " and "
		}
		res += "&lt;br/&gt;"
 
	}
	res += "&lt;b&gt;Speakers:&lt;/b&gt; "
	if(session.speakers.length == 0) res += "None Assigned&lt;br/&gt;"
	else {
		for(var i=0; i&lt;session.speakers.length;i++) {
			res += speakers[session.speakers[i]].name
			if(i+1 &lt; session.speakers.length) res+= " and "
		}
		res += "&lt;br/&gt;"
	}
	res += session.description
	
	res += "&lt;/div&gt;"
	return res
}
 
function renderSessions() {
	var totalSessions = 0
 
	var filterTerm = $("#search").val()
	filterTerm = $.trim(filterTerm.toLowerCase())
	var s = ""
	for(var i=0; i&lt;sessions.length; i++) {
		if(filterTerm == '' || 
			(sessions[i].name.toLowerCase().indexOf(filterTerm) &gt;= 0 || sessions[i].description.toLowerCase().indexOf(filterTerm) &gt;= 0 )
		) {
			totalSessions++
			s += renderSession(sessions[i])
		}
	}
	s = "&lt;h2&gt;Sessions ("+totalSessions+")&lt;/h2&gt;" + s
	$("#sessions").html(s)
 
}
 
function loadSpeakers() {
 
	var speakerurl = "http://max.adobe.com/v1/events/ebdabc28-aab4-479f-86f3-6bd9d97b4cc7/speakers.json"
	$.getJSON('load.cfm?u='+speakerurl, {}, function(res,code) {
		for(var i=0; i&lt;res.length; i++) {
			var speaker = {% raw %}{"name":res[i].lastname +", "+res[i].firstname}{% endraw %}
			speakers[res[i].id] = speaker
		}
		loadSessions()
	})
 
}
 
function loadSessions() {
 
	var sessionurl = "http://max.adobe.com/v1/events/ebdabc28-aab4-479f-86f3-6bd9d97b4cc7/sessions.json"
	$.getJSON('load.cfm?u='+sessionurl, {}, function(res,code) {
		sessions = res
		renderSessions()
		$("#status").text("")
		searchReady = true
	})
	
}
 
$(document).ready(function() {
	$("#status").text("Please stand by. I'm loading a lot of data and doing really important, technical 'computer' stuff.")
	//begin by loading speakers
	loadSpeakers()
	
	$("#search").keyup(function() {
		var val = $(this).val()
		renderSessions()
	})
})
 
&lt;/script&gt; 
&lt;style&gt; 
#status {
	font-style: italic;
}
.session {
	width: 500px;
	background-color: #ffff80;
	padding-top: 0px;
	padding-left: 5px;
	padding-right: 5px;
	margin-bottom: 10px;
}
 
#menu {
	float: left;
	width: 300px;
	background-color: #c0c0c0;
	border: 0.1em solid #000000;
	padding: 0px;
	margin-top: 18px;
	margin-right: 5px;
}
#sessions {
	overflow:auto;
}
 
&lt;/style&gt; 
 
&lt;/head&gt; 
 
&lt;body&gt; 
&lt;span id="status"&gt;&lt;/span&gt; 
 
&lt;div id="menu"&gt; 
Search:&lt;br/&gt; 
&lt;input type="text" id="search"&gt;&lt;br/&gt; 
&lt;/div&gt; 
 
&lt;div id="sessions"&gt; 
&lt;/div&gt; 
 
 
&lt;/body&gt; 
&lt;/html&gt;
</code>

<p>

If you start looking in the document.ready block, you can see I begin by fetching my speakers. I store that result in a global variable. Once that's done, I then fetch my sessions. Once I have all my data, I can then render them. I wrote both a renderSessions() method and a renderSession() method. That may be overkill - but it worked out ok. 

<p>

At that point - the only left was a simple search. I didn't bother with all the options the real system had. I just used a simple keyword search that matched against the title and the description. You can play with this here:

<p>

<a href="http://www.raymondcamden.com/demos/maxfix/">http://www.coldfusionjedi.com/demos/maxfix/</a>

<p>

Obviously this was just built for fun. I wouldn't count on it working forever, nor would I be surprised if Adobe fixes the missing times in their next push. I mainly just wanted to show an example of how you could repurpose someone else's AJAX data for your own benefit. (And yes, now I know when I'm speaking - 3:30 on October 27th.)
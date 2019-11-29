---
layout: post
title: "Proof of Concept 911 Viewer"
date: "2010-01-19T17:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/01/19/proof-of-concept-911-viewer
guid: 3687
---

About two weeks ago a fellow techie in town clued me in a web page run by my local government that <a href="http://67.32.159.27/webcad/webcad.asp">posted</a> the latest 911 information. This is filtered to just traffic information but still it was pretty fascinating to watch. I contacted them to see if they had a non-HTML version but, of course, I never heard back. (Is it just me or do most sites just freaking ignore contacts??) I decided to see if I could play with this data a bit and get a 'clean' view of the data. Here is what I came up with.

<p>
<!--more-->
First I needed a way to parse the data on the page. It seemed to follow a pretty standard format. The table always had four columns and the data seemed to be published in a consistent manner. For the heck of it I decided to create a Yahoo Pipe to parse the HTML. This was completely unnecessary, but it was fun, and that's all that matters. Unfortunately I seem to have lost the pipe online, but the URL still works. You can view it in your browser <a href="http://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20*%{% endraw %}20from{% raw %}%20html%{% endraw %}20where{% raw %}%20(url%{% endraw %}3D"http://67.32.159.27/webcad/webcad.asp"{% raw %}%20and%{% endraw %}20xpath{% raw %}%3D'//table[@border%{% endraw %}3D"0"]/tr[@bgcolor{% raw %}%3D"%{% endraw %}23FFFF99"]'){% raw %}%20or%{% endraw %}20(url{% raw %}%3D"http://67.32.159.27/webcad/webcad.asp"%{% endraw %}20and{% raw %}%20xpath%{% endraw %}3D'//table[@border{% raw %}%3D"0"]/tr[@bgcolor%{% endraw %}3D"{% raw %}%2399FF99"]')%{% endraw %}0A&format=json">here</a>. The only interesting part really is the YQL:

<p>

<code>
	select * from html where (url="http://67.32.159.27/webcad/webcad.asp" and xpath='//table[@border="0"]/tr[@bgcolor="#FFFF99"]') or (url="http://67.32.159.27/webcad/webcad.asp" and xpath='//table[@border="0"]/tr[@bgcolor="#99FF99"]'
</code>

<p>

As you can see, I use the core URL for the page and then grab the table rows. Since the table rows alternate colors I check for both. Again, this is a bit silly. ColdFusion can easily XPath too. But I figured, what the heck?

<p>

The next step was to loop over the JSON result and parse out the data. For the most part this was trivial - I just had to account for - and remove - a few weird high ASCII characters that got in there somehow. Once that was done, I checked my database to see if a report with the same time, address, and type already existed. If not, I did an insert. As all of this is pretty rudimentary I assume folks don't want to see the code. Let me know if otherwise. I set that up as a scheduled task to run every 5 minutes. I also wrote a quick CFM that made use of my Google Geolocator CFC. This parses addresses with no longitude/latitude information, looks it up, and updates the database.

<p>

So I let this run for a week or so and then created my first report using CFMAP. My first report simply got <b>all</b> the data and mapped it:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/map1.png"  title="Lots of death and mayhem..." />

<p>

As you would expect, everything occurs over a street, and occur over streets I can promise you are pretty busy. The code for this is rather simple - get all the data (with a mild bit of cleanup) and select a custom icon based on the 911 incident type:

<p>

<pre><code class="language-javascript">
&lt;cfquery name="getdata"&gt;
select	longitude, latitude, type, incidenttime
from data
where
	(longitude !='' and latitude != '')
	&lt;!--- fixes one bad row ---&gt;
	and longitude &lt; -88
	and incidenttime is not null
&lt;/cfquery&gt;

&lt;cfoutput&gt;#getdata.recordcount# items.&lt;/cfoutput&gt;

&lt;cfmap centeraddress="Lafayette, LA" width="900" height="900" zoomlevel="12" showcentermarker="false"&gt;

	&lt;cfloop query="getdata"&gt;
		&lt;cfif findNoCase("vehicle accident", type)
		or
			  findNoCase("stalled vehicle", type)&gt;
			&lt;cfset icon = "icons/car.png"&gt;
		&lt;cfelseif findNoCase("traffic control", type)
		or
				  findNoCase("traffic signal", type)&gt;
			&lt;cfset icon = "icons/stop.png"&gt;
		&lt;cfelseif findNoCase("fire", type)&gt;
			&lt;cfset icon = "icons/fire.png"&gt;
		&lt;cfelseif findNoCase("hazard", type)&gt;
			&lt;cfset icon = "icons/hazard.png"&gt;
		&lt;cfelse&gt;
			&lt;cfset icon =""&gt;
		&lt;/cfif&gt;

		&lt;cfmapitem latitude="#latitude#" longitude="#longitude#" markerwindowcontent="#type#&lt;br/&gt;#dateFormat(incidenttime)# #timeFormat(incidenttime)#" markericon="#icon#"&gt;
	&lt;/cfloop&gt;

&lt;/cfmap&gt;
</code></pre>

<p>

So this was kinda neat... but I wanted to see something else. I thought - what if we could take this data, and plot it over time. I took a look at the Google Map API and reviewed how to add, and remove, markers. I then whipped up jQuery and ColdFusion code to "group" my reports into hours. I then set it up so that it would run a block of data every second or two. The result? A "movie" of 911 activity:

<p>
<a href="http://www.raymondcamden.com/demos/2015/traffic.swf">http://www.raymondcamden.com/demos/2015/traffic.swf (warning, large Flash movie)</a>

<p>

I stopped the Jing recording after a few days, but obviously it goes on to today. You can see, sometimes, some obvious upswings at rush hour. Not surprising, of course, but fun as heck to watch. Unfortunately I've run out of time so I'll post the code to this demo tomorrow.
---
layout: post
title: "Collecting 911 Data with OpenWhisk Cron Triggers"
date: "2017-02-14T12:56:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/911ow.jpg
permalink: /2017/02/14/collecting-911-data-openwhisk-cron-triggers
---

Today I'm sharing probably the most complex thing I've built with [OpenWhisk](https://developer.ibm.com/openwhisk/). While I'm proud of it, I will remind people I'm still the newbie to this world, so keep that in mind as I explain what I did.

Many years ago, like seven (holy crap), I built a ColdFusion demo that parsed local 911 data and persisted it locally to a database: [Proof of Concept 911 Viewer](https://www.raymondcamden.com/2010/01/19/proof-of-concept-911-viewer).

I used a Yahoo Pipe to suck in the HTML data provided by a local police web site and convert into something I could store. It wasn't necessarily rocket science, but it was fun to build. It was even more fun when I forgot I had automated it and came back months later to look at all the data I collected: [Update to my 911 Viewer](https://www.raymondcamden.com/2010/09/03/Update-to-my-911-Viewer)

That demo was on my mind recently and I thought it would be an excellent thing to try building with OpenWhisk. With that in mind, I built the following:

* First, an action that parses the data.
* Second, an action that takes input data, sees if the data exists in a Cloudant data store, and then if not, adds it.
* A sequence to connect the two.
* A Cron-based schedule to periodically check the data.

That sounds like a lot, and pretty complex, but breaking it down into component parts/features 
made it simpler to work with and let me try some parts of OpenWhisk that I had not played with yet, specifically the Cron-trigger aspect. Let's take it step by step.

Parsing Raw HTML Data
---

The data I'm parsing lives at http://lafayette911.org. As you can see, it is a table of incident reports:

![Web site](https://static.raymondcamden.com/images/2017/2/cow1.png)

I began by doing a quick view source to see how the HTML was created. Turned out the table was driven by an iframe pointing to http://apps.lafayettela.gov/L911/default.aspx. Looking at the source code there I saw that the data was driven by an Ajax call to http://apps.lafayettela.gov/L911/Service2.svc/getTrafficIncidents. I got excited because I thought - for a moment - that I wouldn't have to parse anything. Turns out, the JSON was actually formatted HTML (I slimmed it down a bit):

<pre><code class="language-javascript">
{% raw %}{&quot;d&quot;:&quot; &lt;center&gt;&lt;a href=\&quot;#KEY\&quot;&gt;KEY&lt;\&#x2F;a&gt;&lt;table border=0 bgcolor=\&quot;white\&quot;&gt;&lt;tr bgcolor=\&quot;#99FF99\&quot;&gt;&lt;td&gt;&lt;b&gt;&amp;nbsp;&lt;a href=&#x27;http:\&#x2F;\&#x2F;maps.google.com\&#x2F;maps?q=2909+NW+EVANGELINE+THROUGHWAY+,LAFAYETTE+LA&#x27; target=&#x27;_new&#x27;&gt;2909 NW EVANGELINE TW&lt;\&#x2F;a&gt;&amp;nbsp;&lt;BR&gt;&amp;nbsp;LAFAYETTE,LA&amp;nbsp;&lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;td&gt;&lt;b&gt;Vehicle Accident w\&#x2F; Injuries&lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;td&gt;&lt;b&gt;02\&#x2F;14\&#x2F;2017 - 11:59 AM&lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;td&gt;&lt;b&gt;P F M &lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;\&#x2F;tr&gt;&lt;tr bgcolor=\&quot;#FFFF99\&quot;&gt;&lt;td&gt;&lt;b&gt;&amp;nbsp;&lt;a href=&#x27;http:\&#x2F;\&#x2F;maps.google.com\&#x2F;maps?q=1100+SE+EVANGELINE+THROUGHWAY+,LAFAYETTE+LA&#x27; target=&#x27;_new&#x27;&gt;1100 SE EVANGELINE TW&lt;\&#x2F;a&gt;&amp;nbsp;&lt;BR&gt;&amp;nbsp;LAFAYETTE,LA&amp;nbsp;&lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;td&gt;&lt;b&gt;Vehicle Accident w\&#x2F; Injuries&lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;td&gt;&lt;b&gt;02\&#x2F;14\&#x2F;2017 - 11:40 AM&lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;td&gt;&lt;b&gt;P F M &lt;\&#x2F;b&gt;&lt;\&#x2F;td&gt;&lt;\&#x2F;tr&gt;&lt;\&#x2F;table&gt;&lt;small&gt;Data Updated at 02\&#x2F;14\&#x2F;2017 - 1:12:38 PM &lt;\&#x2F;small&gt;&lt;\&#x2F;center&gt;&lt;script&gt;$(&#x27;dateline&#x27;).innerHTML = &#x27;02\&#x2F;14\&#x2F;2017 - 1:12:38 PM&#x27;; &lt;\&#x2F;script&gt;&quot;}{% endraw %}
</code></pre>

*Sigh*

Ok, so luckily, I knew how to work with this. I did a demo last year involving web scraping with Cheerio ([Scraping a web page in Node with Cheerio](https://www.raymondcamden.com/2016/11/30/scraping-a-web-page-in-node-with-cheerio)) and I knew that worked well, so my action focused around working with that. Remember, to include random npm packaged with OpenWhisk, you have to use a zipped action that includes the package.json and node_modules directory. It's a bit more work, but marginally so.

The other slightly complex aspect was that I wanted to geocode the addresses. For that I used Google's excellent [Geocode](https://developers.google.com/maps/documentation/geocoding/start) API that is part of the Maps SDK. Here is the entire action.

<pre><code class="language-javascript">
let cheerio = require(&#x27;cheerio&#x27;);
let request = require(&#x27;request&#x27;);

function main(args) {

	return new Promise((resolve, reject) =&gt; {

		request(&#x27;http:&#x2F;&#x2F;apps.lafayettela.gov&#x2F;L911&#x2F;Service2.svc&#x2F;getTrafficIncidents&#x27;, {% raw %}{method:&#x27;post&#x27;}{% endraw %}, function(err, response, body) {

			if(err) reject(err);

			let results = [];
			&#x2F;&#x2F; body is a json packet, html is in d
			let $ = cheerio.load(JSON.parse(body).d);
			let channels = $(&#x27;tr&#x27;);
			&#x2F;&#x2F;channel 0 is the header
			for(let i=1;i&lt;channels.length;i++) {
				let channelRow = channels.get(i);
				let cells = $(channelRow).children();
				&#x2F;&#x2F;console.log(channelRow);
				let loc = $(cells.get(0)).text().trim();
				let reason = $(cells.get(1)).text().trim();
				let timestamp = $(cells.get(2)).text().trim();
				let [daypart,timepart] = timestamp.split(&#x27; - &#x27;);
				let incidentDate = new Date(daypart + &#x27; &#x27;+timepart);
				let assisting = $(cells.get(3)).text().trim().split(&#x27; &#x27;);
				&#x2F;&#x2F;package it up
				results.push({% raw %}{location:loc, reason:reason, timestamp:incidentDate, assisting: assisting}{% endraw %});
			}

			&#x2F;*
			New logic - for each, geocode
			*&#x2F;
			let promises = [];
			results.forEach(function(res) {

				console.log(&#x27;need to work on &#x27;+res.location);
				promises.push(new Promise( (resolve, reject) =&gt; {
					let geourl = &#x27;https:&#x2F;&#x2F;maps.googleapis.com&#x2F;maps&#x2F;api&#x2F;geocode&#x2F;json?address=&#x27;+encodeURIComponent(res.location);
					console.log(geourl);
					request(geourl, function(err, response, body) {
						if(err) reject(err);
						let geoResult = {};
						let geodata = JSON.parse(body);
						if(geodata.status === &#x27;OK&#x27;) {
							geoResult.geostatus = true;
							geoResult.geo = geodata.results[0].geometry.location;
						} else {
							geoResult.geostatus = false;
						}
						resolve(geoResult);
						&#x2F;&#x2F;console.log(body);
					});

				}));

			});
			Promise.all(promises).then(function(geodata) {
				console.log(&#x27;done with all promises&#x27;);
				&#x2F;&#x2F;brittle code here, geodata len != results
				for(var i=0;i&lt;geodata.length;i++) {
					results[i].geo = geodata[i];
				}
				resolve({% raw %}{ traffic:results }{% endraw %});
			});


		});

	});

}

exports.main = main;
</code></pre>

So from the top - we begin with a generic request for the data. Once we've got that, we can ask Cheerio to turn into a DOM, just like HTML in the browser. I then grab all the table rows, and then fetch the cells inside each row. I do a bit of manipulation of the time to turn it into a JavaScript data and convert the "assisting" cell into an array.

The next part is a bit complex. I need to geocode all the addresses and this involves N async processes. So I use an array of promises to get all the results and then update the original data. Unfortunately, it looks like the service has an issue with intersections. So for example, an accident at "Johnston and Camelia" isn't properly geocoded even though the map links from the site seem to work well. This could be my fault. Sometimes it worked, sometimes it didn't. 

In the end, I get a nice set of data:

<pre><code class="language-javascript">
{
        "traffic": [
                {
                        "location": "LEE AV & E CYPRESS ST  LAFAYETTE,LA",
                        "reason": "Vehicle Accident",
                        "timestamp": "2017-02-14T19:08:00.000Z",
                        "assisting": [
                                "P",
                                "M"
                        ],
                        "geo": {
                                "geostatus": true,
                                "geo": {
                                        "lat": 30.2256757,
                                        "lng": -92.0149277
                                }
                        }
                },
                {
                        "location": "E UNIVERSITY AV & W PINHOOK RD  LAFAYETTE,LA",
                        "reason": "Vehicle Accident",
                        "timestamp": "2017-02-14T19:02:00.000Z",
                        "assisting": [
                                "S",
                                "P"
                        ],
                        "geo": {
                                "geostatus": true,
                                "geo": {
                                        "lat": 30.21055,
                                        "lng": -92.0097742
                                }
                        }
                },
                {
                        "location": "6801  JOHNSTON ST  LAFAYETTE,LA",
                        "reason": "Vehicle Accident",
                        "timestamp": "2017-02-14T19:00:00.000Z",
                        "assisting": [
                                "P"
                        ],
                        "geo": {
                                "geostatus": true,
                                "geo": {
                                        "lat": 30.150066,
                                        "lng": -92.0934762
                                }
                        }
                },
                {
                        "location": "W PINHOOK RD &  BENDEL RD  LAFAYETTE,LA",
                        "reason": "Vehicle Accident",
                        "timestamp": "2017-02-14T18:44:00.000Z",
                        "assisting": [
                                "P"
                        ],
                        "geo": {
                                "geostatus": true,
                                "geo": {
                                        "lat": 30.1990935,
                                        "lng": -92.0163944
                                }
                        }
                }
        ]
}
</code></pre>

Not bad! Ok, on to step two - storing the data.

Persisting the Data with Cloudant
---

To store the data, I provisioned a new [Cloudant](https://console.ng.bluemix.net/catalog/cloudant-nosql-db) service with Bluemix. OpenWhisk can automatically pick up new Cloudant services and add a package to your account with actions/triggers to interact with that service. To work with those actions, I built my own action tasked with handling an input of data, checking to see if it's new, and then adding it. Here is that action.

<pre><code class="language-javascript">
var openWhisk = require(&#x27;openwhisk&#x27;);
var ow = openWhisk({
	apihost:&#x27;openwhisk.ng.bluemix.net&#x27;,
    api_key:&#x27;my secret is so secret it doesnt know it is a secret&#x27;
});

var actionBase = &#x27;&#x2F;rcamden@us.ibm.com_My Space&#x2F;Bluemix_Cloudant Traffic_Credentials-1&#x27;;

function main(args) {

	&#x2F;*
	hard coded for now
	args.traffic = [
		{
			location:&quot;W CONGRESS ST &amp;  CAJUNDOME BL  LAFAYETTE,LA&quot;,
			reason:&quot;Flood&quot;,
			timestamp:&quot;2017-02-08T20:59:00.000Z&quot;
		},
		{
			location:&quot;ssss W CONGRESS ST &amp;  CAJUNDOME BL  LAFAYETTE,LA&quot;,
			reason:&quot;Vehicle Accident&quot;,
			timestamp:&quot;2017-02-08T20:59:00.000Z&quot;
		},
		{
			location:&quot;W CONGRESS ST &amp;  CAJUNDOME BL  LAFAYETTE,LA&quot;,
			reason:&quot;Monster&quot;,
			timestamp:&quot;2017-02-08T20:59:00.000Z&quot;
		},

	];
	*&#x2F;

	if(!args.traffic) args.traffic = [];
	
	return new Promise((resolve, reject) =&gt; {

		let promises = [];
		args.traffic.forEach(function(d) {
			promises.push(addIfNew(d));
		});
		Promise.all(promises).then((results) =&gt; {
			console.log(&#x27;all done like a boss&#x27;);
			resolve({% raw %}{results:results}{% endraw %});
		});

	});

}

function addIfNew(d) {

	return new Promise((resolve, reject) =&gt; {
		
		ow.actions.invoke({
            actionName:actionBase+&#x27;&#x2F;exec-query-find&#x27;,
			blocking:true,
            params:{
                &quot;dbname&quot;:&quot;traffic&quot;,
                &quot;query&quot;:
					{
					&quot;selector&quot;: {
						&quot;location&quot;: {
						&quot;$eq&quot;: d.location
						},
						&quot;reason&quot;:{
						&quot;$eq&quot;:d.reason
						},
						&quot;timestamp&quot;:{
						&quot;$eq&quot;:d.timestamp
						}
					},
					&quot;fields&quot;: [
						&quot;_id&quot;
					]
					}
            }
        }).then(function(res) {
			let numMatches = res.response.result.docs.length;
			if(numMatches === 0) {
				console.log(&#x27;data is new, so add it&#x27;);
				ow.actions.invoke({
        		    actionName:actionBase+&#x27;&#x2F;write&#x27;,
					blocking:true,
		            params:{
        		        &quot;dbname&quot;:&quot;traffic&quot;,
		                &quot;doc&quot;:d
					}
				}).then(function(res) {
					resolve({% raw %}{result:1}{% endraw %});
				});	
			} else {
				resolve({% raw %}{result:0}{% endraw %});
			}
        });
		
	});
	
}

exports.main = main;
</code></pre>

From the top - notice I'm using the OpenWhisk package. It basically lets me use OpenWhisk from my action much like I use it from the CLI. This still feels... wrong to me a bit, but I honestly don't know another way to do it. In theory, I could just make REST calls directly to my Cloudant service, but for now, I'm going to use the package. I definitely think I'll probably be doing things differently here in the future.

In the main section, note I've got some hard coded data there commented out. During testing, this is how I handled getting sample data into the action. In the end, it all comes down to the `addIfNew` block. My Cloudant skills are somewhat weak, but my logic seemed to work well. I query on location, reason, and timestamp, but not the assisting data as I wasn't sure if I could query on array values like that. On the off chance that two accidents happen at the same time at the same location but with different responders I'll just assume the entire multiverse is breaking down and life, as we know it, is pretty much over. (Hey, I won't have to write unit tests!)

If no matches are returned, I then simply pass the data to the write action and - that's it!

Connecting the Dots
---

Let's recap. I've got an action that can suck down the HTML string and turn it into data. I've got a second action that can take that input and store it, if it is new. Now we need to get this together, scheduled, and run with it.

First, connecting them is trivial - just use a sequence! I called mine handleTraffic and I simply passed it the name of my two actions - getTraffic and addTraffic. The command looks like so:

	wsk action create handleTraffic --sequence getTraffic,addTrafic


I then fired off a call to the sequence to make sure that was working. Remember, baby steps.

Alright - here is where things get a bit tricky. I began by creating an [Alarm-based](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_catalog.html#openwhisk_catalog_alarm_fire) trigger. This is a trigger available on the Bluemix OpenWhisk platform that lets you define a Cron-based time to fire. I created mine like so:

	wsk trigger create checkTraffic --feed /whisk.system/alarms/alarm --param cron "5 * * * *" 

I always find Cron to be an incomprehensible syntax, so I used http://crontab-generator.org to generate the string for me.

All this does is make an alarm clock - even 5 minutes the trigger will fire. But by itself, that does nothing. In order to make it do something, I then made a rule. The rule simply said, when checkTraffic fires, run my sequence. I called my rule newTrafficRule because I have no imagination. 

The OpenWhisk UI does a nice job of representing this - although for the life of me I can't figure out how to get the original Cron setting out. I guess it's something you want to make sure you don't forget. 

![Visual Representation](https://static.raymondcamden.com/images/2017/2/cow2.png)

I plan on covering the OpenWhisk UI stuff in more detail later, but I want to point out that the monitor was *extremely* helpful while I was working on this demo. It let me see my actions fire in real time and watch their results.

![UI](https://static.raymondcamden.com/images/2017/2/cow3.png )

Wrap Up
---

All in all, it is working pretty good. I've discovered there is a limit to the amount of queries I can do per second with the free tier of Cloudant, but a paid account wouldn't have this issue of course. I've had this running for a few days now (although initially I didn't have geocoding) and I'm nearing 400 data points. I plan to let this be for a while and come back once I've got a good thousand or so entries and do some fun charting/analyzing of the data. 

If anyone has any questions, or suggestions for improvement, let me know below!
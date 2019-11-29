---
layout: post
title: "Scraping a web page in Node with Cheerio"
date: "2016-11-30T07:03:00-07:00"
categories: [javascript]
tags: [nodejs]
banner_image: /images/banners/cheerio.jpg
permalink: /2016/11/30/scraping-a-web-page-in-node-with-cheerio
---

In yet another example of "I will build the most stupid crap ever if bored", this week I worked on a Node script for the sole purpose of gathering data about SiriusXM. I'm a huge fan of the radio service (mostly because 99% of my local radio stations are absolute garbage, except for [KRZS](http://krvs.org/)), and I was curious if the service had an API of some sorts. I was not able to find one, but I did find this page:

http://xmfan.com/guide.php

Which had a constantly updating list of what's playing. I reached out to the site to ask how they were getting their data, but I never heard back from them. Therefore I figured why not simply scrape the data myself locally?

In order to do this I decided to try [Cheerio](https://cheerio.js.org/), a jQuery library specifically built for the server. It lets you perform jQuery-like operations against HTML in your Node apps. I first heard about this from one of my new coworkers, [Erin McKean](https://twitter.com/emckean), who joined us on the LoopBack team at IBM a few weeks back. 

My script was rather simple, so here is the entire module I built.

<pre><code class="language-javascript">
let cheerio = require(&#x27;cheerio&#x27;);
let request = require(&#x27;request&#x27;);

function getData() {
    return new Promise(function(resolve, reject) {
        request(&#x27;http:&#x2F;&#x2F;xmfan.com&#x2F;guide.php&#x27;, function(err, response, body) {
            if(err) reject(err);
            if(response.statusCode !== 200) {
                reject(&#x27;Invalid status code: &#x27;+response.statusCode);
            }
            let $ = cheerio.load(body);
            let channelList = $(&#x27;td[width=140]&#x27;);

            let channels = [];

            for(let i=0;i&lt;channelList.length;i++) {
                let t = channelList.get(i);
                let channel = $(t).text();
                let artistNode = $(t).next();
                let artist = $(artistNode).text();
                let title = $(artistNode).next().text();
                &#x2F;&#x2F;console.log(channel +&#x27;-&#x27;+ artist +&#x27;-&#x27;+ title);
                channels.push({% raw %}{channel:channel, artist:artist, title:title}{% endraw %});
            }

            resolve(channels);

        });
    });
}

module.exports = getData;
</code></pre> 

Essentially - I suck down the contents of the HTML and then use a selector to get the left hand column of the tables used to represent the music data. This is - obviously - brittle. But let's carry on. After I have those nodes, I can then iterate over them and find the nodes next to them in the table row. This is all very much like any other jQuery demo, but I'm running this completely server-side. The end result is an array of objects containing a channel, artist, and title. 

To use this, I set up a simple script to run my module and then insert the data into Mongo. In order to ensure I don't get duplicate data, I store a timestamp with each record, and first see if a matching record within five minutes was stored. Here's my code:

<pre><code class="language-javascript">
var sucker = require(&#x27;.&#x2F;sucker.js&#x27;);
var MongoClient = require(&#x27;mongodb&#x27;).MongoClient;


let url = &#x27;mongodb:&#x2F;&#x2F;localhost:27017&#x2F;siriusxm&#x27;;

MongoClient.connect(url).then(function(db) {
	console.log(&#x27;connected like a boss&#x27;);

	var data = db.collection(&#x27;data&#x27;);

	sucker().then(function(channels) {
		let toProcess = channels.length;
		let done = 0;
		let inserted = 0;
		console.log(&#x27;got my result, size is &#x27;+toProcess);

		&#x2F;*
		so the logic is as follows: 
			iterate over each result
			look for a match w&#x2F;n a 3 minute time frame
		*&#x2F;
		let dateFilter = new Date(new Date().getTime() - 5*60000);
		
		channels.forEach(function(channel) {
			channel.timestamp = new Date();
			&#x2F;&#x2F;console.log(channel);

			data.find({
				&#x27;title&#x27;:channel.title,
				&#x27;channel&#x27;:channel.channel,
				&#x27;artist&#x27;:channel.artist,
				&#x27;timestamp&#x27;:{
					&#x27;$gte&#x27;:dateFilter
				}
			}).toArray(function(err, docs) {
				if(err) console.log(&#x27;Err&#x27;, err);
				if(docs &amp;&amp; docs.length === 0) {
					data.insert(channel, function(err, result) {
						if(err) throw(err);
						if(!err) {
							inserted++;
							done++;
							if(done === toProcess) {
								db.close();
								console.log(&#x27;Total inserted: &#x27;,inserted);
							}
						}
					});
				} else {
					&#x2F;&#x2F;console.log(&#x27;not inserting&#x27;);
					done++;
					if(done === toProcess) {
						db.close();
						console.log(&#x27;Total inserted: &#x27;,inserted);
					}
				}
			});

		});
	}).catch(function(err) {
		console.log(&#x27;unhandled error&#x27;, err);
		db.close();	
	});


}).catch(function(err) {
	console.log(&#x27;mongodb err&#x27;, err);
});
</code></pre>

I figure this isn't too interesting, but I will point out one bit I don't like. I'm not running this as a server, just a script, and I needed a way to close down the connection when done. Since everything is async, I could have used Promises, but I decided to go the lame way out and simply keep track of how many results I had processed. This means I've got a bit of duplication in the two blocks that handle closing the connection.

I'm thinking that the next step will be to add Node Cron, which is fairly easy to install, but always takes me forever to figure out the right syntax. I'll then let it run for a month or so and see if I can get some interesting analytics. For example, how often is the Cure played? This is important stuff, people!

Here's an example of it working - and you can see where on the second run it ignored a bunch of songs that had been recorded before:

![Da Script](https://static.raymondcamden.com/images/2016/11/cheerio.PNG)

And here are a few rows in the database:

![Da data](https://static.raymondcamden.com/images/2016/11/cheerio2.PNG)

You can take a look at the full code (currently anyway) here: https://github.com/cfjedimaster/NodeDemos/tree/master/siriusxmparser
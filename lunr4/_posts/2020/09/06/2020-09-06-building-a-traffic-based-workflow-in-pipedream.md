---
layout: post
title: "Building a Traffic-Based Workflow in Pipedream"
date: "2020-09-06"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/accident.jpg
permalink: /2020/09/06/building-a-traffic-based-workflow-in-pipedream
description: Building a Pipedream event source for traffic data
---

A few months ago I [wrote](https://www.raymondcamden.com/2020/05/07/looking-at-pipedreams-event-sources) about working with event sources in Pipedream. The folks at Pipedream have continued to work on the feature and have been making it easier to build them with a new command line tool. At the time I'm writing this, unfortunately, Windows support is not ready yet. While typically a show stopper for me, I was given a temporary build of the command line tool for Windows to help test. (You can follow [this issue](https://github.com/PipedreamHQ/pipedream/issues/89) for more information.) Normally I don't like to blog about stuff that isn't generally available to all, but as it *will* be available sometime soon, I decided to go ahead anyway. And I built something really cool I want to share so that's another reason to talk about this now!

To begin, take a look at the [Quickstart](https://github.com/PipedreamHQ/pipedream/blob/master/QUICKSTART.md) guide for using the CLI. You can use the CLI to deploy and update code for event sources which lets you use your [preferred editor](https://code.visualstudio.com) for development. At a high level, an event source kinda looks like this:

```js
module.exports = {
	name: 'name of the event source', 
	props: {
		// things the ES will need, also how you set how it runs
	}, 
	async run() {
		// the actual logic of the thing
	}
}
```

Essentially metadata and your logic in one file. It gets a bit more complex than that depending on what you're doing, but after writing a few samples it began to make sense to me. The CLI process is a bit clunky now in terms of what you use to deploy versus update versus other items and I've passed this feedback on to the team, but it's still Alpha so you can expect this to change. 

I thought I'd take a stab at building something real. My local city has a website, <http://lafayette911.org/>, that publishes "live" traffic incidents. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/laf1.jpg" alt="View of traffic reports" class="lazyload imgborder imgcenter">
</p>

It's an old site, one I've built demos on in the past past, but it works. Using devtools, I was able to see that it's making a POST request to https://apps.lafayettela.gov/L911/Service2.svc/getTrafficIncidents. The result is:

```js
{"d":" <center><a href=\"#KEY\">KEY<\/a><table border=0 bgcolor=\"white\"><tr bgcolor=\"blue\"><td><font color=\"white\"><b>Located At<\/font><\/b><\/td><td><font color=\"white\"><b>Due To<\/font><\/b><\/td><td><b><font color=\"white\">Reported At<\/font><\/b><\/td><td><font color=\"white\"><b>Assisting<\/b><\/font><\/td><\/tr><tr bgcolor=\"#FFFF99\"><td><b>&nbsp;<a href='http:\/\/maps.google.com\/maps?q=103++SHADYSIDE+AVE+,LAFAYETTE+LA' target='_new'>103  SHADYSIDE AV<\/a>&nbsp;<BR>&nbsp;LAFAYETTE,LA&nbsp;<\/b><\/td><td><b>Vehicle Accident<\/b><\/td><td><b>09\/08\/2020 - 10:21 AM<\/b><\/td><td><b>P <\/b><\/td><\/tr><tr bgcolor=\"#99FF99\"><td><b>&nbsp;<a href='http:\/\/maps.google.com\/maps?q=611++LINDEN+LEWIS+ROAD+,LAFAYETTE+LA' target='_new'>611  LINDEN LEWIS RD<\/a>&nbsp;<BR>&nbsp;LAFAYETTE,LA&nbsp;<\/b><\/td><td><b>Road Hazard<\/b><\/td><td><b>09\/08\/2020 - 10:07 AM<\/b><\/td><td><b>S <\/b><\/td><\/tr><tr bgcolor=\"#FFFF99\"><td><b>&nbsp;<a href='http:\/\/maps.google.com\/maps?q=+BONIN+ROAD+%26+E+MILTON+AVE+,YOUNGSVILLE+LA' target='_new'>BONIN RD & E MILTON AV<\/a>&nbsp;<BR>&nbsp;YOUNGSVILLE,LA&nbsp;<\/b><\/td><td><b>Traffic Control<\/b><\/td><td><b>09\/08\/2020 - 09:24 AM<\/b><\/td><td><b>S <\/b><\/td><\/tr><tr bgcolor=\"#99FF99\"><td><b>&nbsp;<a href='http:\/\/maps.google.com\/maps?q=254++EDGEWOOD+DR+,LAFAYETTE+LA' target='_new'>254  EDGEWOOD DR<\/a>&nbsp;<BR>&nbsp;LAFAYETTE,LA&nbsp;<\/b><\/td><td><b>Vehicle Accident<\/b><\/td><td><b>09\/08\/2020 - 09:14 AM<\/b><\/td><td><b>P <\/b><\/td><\/tr><\/table><small>Data Updated at 09\/08\/2020 - 10:27:37 AM <\/small><\/center><script>$('dateline').innerHTML = '09\/08\/2020 - 10:27:37 AM'; <\/script>"}
```

Basically an object of one key, `d`, that is HTML which is just then dropped on the page. I knew that I could use [Cheerio](https://www.npmjs.com/package/cheerio) to parse this HTML so I began by working on a test script to see how well it could be done. Cheerio is, for all intents and purposes, jQuery for Node.js. It's really powerful, but I had a bit of trouble as I don't really use jQuery anymore! Here is that initial script:

```js
const cheerio = require('cheerio');
const $ = cheerio.load(" <center><a href=\"#KEY\">KEY</a><table border=0 bgcolor=\"white\"><tr bgcolor=\"blue\"><td><font color=\"white\"><b>Located At</font></b></td><td><font color=\"white\"><b>Due To</font></b></td><td><b><font color=\"white\">Reported At</font></b></td><td><font color=\"white\"><b>Assisting</b></font></td></tr><tr bgcolor=\"#FFFF99\"><td><b>&nbsp;<a href='http://maps.google.com/maps?q=101++I10+WESTBOUND+MM101+HIGHWAY+,LAFAYETTE+LA' target='_new'>101  I10 WESTBOUND MM101 HW</a>&nbsp;<BR>&nbsp;LAFAYETTE,LA&nbsp;</b></td><td><b>Stalled Vehicle</b></td><td><b>09/05/2020 - 1:24 PM</b></td><td><b>P </b></td></tr><tr bgcolor=\"#99FF99\"><td><b>&nbsp;<a href='http://maps.google.com/maps?q=+ERASTE+LANDRY+ROAD+%26++AMBASSADOR+CAFFERY+PKWY+,LAFAYETTE+LA' target='_new'>ERASTE LANDRY RD &  AMBASSADOR CAFFERY PW</a>&nbsp;<BR>&nbsp;LAFAYETTE,LA&nbsp;</b></td><td><b>Vehicle Accident</b></td><td><b>09/05/2020 - 12:49 PM</b></td><td><b>P </b></td></tr></table><small>Data Updated at 09/05/2020 - 1:34:34 PM </small></center><script>$('dateline').innerHTML = '09/05/2020 - 1:34:34 PM'; </script>");

let rows = $('table tr');

// calling this events and not incidents cuz i dont like spelling it :)
let events = [];

if(rows.length > 1) {
	for(let i=1;i<rows.length;i++) {
		let row = $(rows.get(i));
		console.log(i+' === ' +row.text());
		console.log('\n');
		let cells = $('td', row);
		/*
		cell[0] should be street, 
		cell[1] what
		cell[2] when
		cell[3] = who, F-Fire M-Medical S-Sheriff/Local Police P-Lafayette Police
		*/
		if(cells.length === 4) {
			events.push({
				address:$(cells[0]).text().trim(),
				what:$(cells[1]).text().trim(),
				when:$(cells[2]).text().trim(),
				who: $(cells[3]).text().trim()
			});
		}
	}
}

console.log('EVENTS\n', events);
```

To let it run quicker and be more consistent, I used one hard coded result of the API and just got to work parsing it. I knew the shape of the table an what each column represented, so from this I was able to get an array of objects representing the traffic incidents being reported by the API. 

Ok, so with that working, I then began working on the Pipedream version. It needed to be rewritten in the right "form" for Pipedream and obviously switch to using a network call instead of hard coded data. Here's that event stream:

```js
const cheerio = require('cheerio');
const fetch = require('node-fetch');

module.exports = {
  name: "Lafayette Traffic Incidents",
  description: "Based on API at http://lafayette911.org/",
  props: {
	timer: {
		type:"$.interface.timer",
		default: {
			intervalSeconds: 60 * 10
		}
	}
  },
  dedupe: "unique",
  async run() {
	console.log('run on laffy traffic called');
	let resp = await fetch('https://apps.lafayettela.gov/L911/Service2.svc/getTrafficIncidents', { method: 'POST' });
	let data = await resp.json();
	let $ = cheerio.load(data.d);
	console.log('data.d', data.d);

	let rows = $('table tr');

	if(rows.length > 1) {
		for(let i=1;i<rows.length;i++) {
			let row = $(rows.get(i));
			let cells = $('td', row);
			/*
			cell[0] should be street, 
			cell[1] what
			cell[2] when
			cell[3] = who, F-Fire M-Medical S-Sheriff/Local Police P-Lafayette Police
			*/
			if(cells.length === 4) {
				let event = {
					address:$(cells[0]).text().trim(),
					what:$(cells[1]).text().trim(),
					when:$(cells[2]).text().trim(),
					who: $(cells[3]).text().trim()
				};

				//construct id based on address and when
				let id = event.address + ' ' + event.when;

				this.$emit(event, {
					summary:event.what + ' at ' + event.address,
					id:id
				});
			}
		}
	}

  }
}
```

While most of this is the same, there's some crucial differences. First, note the use of the timer on top. That sets up how often the event source will run and should be set whatever makes sense for your data. While the website refreshes every fifteen seconds, I didn't think it was necessary to run this code that quickly. Ten minutes seemed sensible so I went with that. 

The next important change is how the code reports data. So in my test script, I just output an array of events. For Pipedream, you need to use `this.$emit` instead. Now for the truly cool part. How do we know a new traffic incident versus an existing one? Pipedream has built in for support with this using 2 settings. 

First, I added `dedupe: "unique",`. This tells Pipedream to filter out any output from the code and ensure it's unique. How does it determine uniqueness? Via the `id` value. You can see me emit that towards the end of the file. I generate an id by using the traffic incident address and time. It's absolutely possible to have multiple accidents at the same location, but probably very rarely will they be at the same time. I could make this a better perhaps by looking at the `what` and `who` values but that felt like overkill. 

I deployed this and then started testing. On the Pipedream website, I can see my events as well as a graph over time:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/laf2.jpg" alt="Pipedream event report" class="lazyload imgborder imgcenter">
</p>

What may not be terribly obvious is that you can see a "spike" in the incidents. I'm writing this at around 10 in the morning so it makes sense that more reports would come in with the morning traffic. 

What's truly cool though - and I feel like a bit of a broken record when it comes to Pipedream - is that all of this complexity (and honestly it wasn't too complex) is *completely* hidden from anyone who wants to use it. So for example, want to get an email everytime an accident happens? 

Make a workflow - select this event source - and then add the email step:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/laf3.jpg" alt="Traffic email workflow" class="lazyload imgborder imgcenter">
</p>

As you can see, this one's already disabled as it got too noisy too quickly, but with zero code, I've got a working notifier about accidents in my city. 

Don't want email? I can send an SMS instead using a variety of options:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/laf4.jpg" alt="SMS options" class="lazyload imgborder imgcenter">
</p>

It really doesn't matter. If you just want to do X when there's a new accident, the support is there. What you actually do with the data is up to you. And this is why I love Pipedream. By making it easy to build the event source, it then makes it easier to build multiple different workflows. I took what was basically a simple API endpoint and turned it into an entirely new feature. (Although honestly I didn't actually ask anyone if I could do this so be sure to use with caution!) 

Take it for a spin yourself and let me know if you build anything fun with it!

<span>Photo by <a href="https://unsplash.com/@michaeljinphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Michael Jin</a> on <a href="https://unsplash.com/s/photos/accident?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
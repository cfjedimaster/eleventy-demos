---
layout: post
title: "Adding Google Calendar to your JAMStack"
date: "2019-11-18"
categories: ["javascript","static sites"]
tags: ["eleventy"]
banner_image: /images/banners/calendar.jpg
permalink: /2019/11/18/adding-google-calendar-to-your-jamstack
description: A look at using Google APIs to add events to your static site. 
---

This is something I've had on my "To Write" list for a very long time. The plan changed over time but it never actually got done because I couldn't get what I wanted to do actually working, which as you can imagine put something of a crimp on getting this post done.

I'm a huge Google Calendar user and I know many other people are as well. I thought it might be interesting to see if you could add upcoming events, driven by a Google Calendar, to a static website. Of course, you already have a simple way of doing this. If you go into your calendar settings, "Integrate calendar", you'll find an "Embed code":

<img src="https://static.raymondcamden.com/images/2019/11/gcal1.png" alt="Screenshot of embed UI" class="imgborder imgcenter">

If you click "Customize", you can turn on or off various things, but the end result is a bit... meh.

<img src="https://static.raymondcamden.com/images/2019/11/gcal2.png" alt="Demo" class="imgborder imgcenter">

This is an example of the calendar embedded in a simple Bootstrap-driven site. The calendar is fully interactive in read-only mode. I just don't find it terribly pretty. You can find the online version here: <https://site.raymondcamden.now.sh/> Go to December 2019 to see an example of an event.

That's the super easy, get it done in one minute solution. But we don't like easy solutions, right?

<img src="https://static.raymondcamden.com/images/2019/11/gcal3.jpg" alt="Cat learning node" class="imgborder imgcenter">

Alright - so before I even started thinking about integrating events into a static site, I tried to write a simple Node script that would get my events. This is the part that took a year.

To be clear, it wasn't a year straight of working on it. I've got a job, yo. But I'd take a stab at it. Fail. And then try again a few months later. Why did I fail?

Google provides a Node library for all of their services and they even have a [quickstart](https://developers.google.com/calendar/quickstart/nodejs) for integrating with the Calendar API in Node. However, the documentation assumes an OAuth flow. So basically, a solution that would work for the scenario where you want a website visitor to login via OAth and then you can display their information on your site. 

But that's not what I wanted. I wanted access to one specific calendar. I knew Google supported "service accounts", which let you create a virtual (may not be the right word) access for their APIs. Jackie Han (either a fellow GDE or Google employee) pointed me to this StackOverflow post: [Inserting Google Calendar Entries with Service Account](https://stackoverflow.com/questions/26064095/inserting-google-calendar-entries-with-service-account/26067547#26067547)

This was a good post, but it was PHP based. And unfortunately, outside of the Node quickstart which used OAth, I found the rest of the docs to be really, really freaking hard. Here's the script I got working that I'll do my best to try to explain.

```js
const {google} = require('googleapis');
let creds = require('./credentials2.json');

async function main() {

	const auth = new google.auth.GoogleAuth({
		credentials:creds,
		scopes: ['https://www.googleapis.com/auth/calendar']
	});

	const calendar = google.calendar({
		version:'v3',
		auth:auth
	});

	calendar.events.list({
		calendarId: '4p6qtp2jeu40piuul6bklfra94@group.calendar.google.com',
		timeMin: (new Date()).toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const events = res.data.items;
		if (events.length) {
			console.log('Upcoming 10 events:');
			events.map((event, i) => {
			const start = event.start.dateTime || event.start.date;
			const loc = event.location || '(none)';
			console.log(`${start} - ${event.summary} Location: ${loc}`);
			});
		} else {
			console.log('No upcoming events found.');
		}
	});
	
}

main().catch(console.error);
```

I start off loading in the Google API package. Then I load in my credentials. That comes from Google's Service Account panel where I generated a key and selected the JSON output format. If we go into the `main` function, I create an auth object that makes use of that JSON data and defines the scope of my use, in this case just Google Calendar. 

So that part was like half a year to figure out. Maybe I'm being overly dramatic, but I literally had to guess at it for the most part. 

Next I make an instance of the Calendar library and I can use the same code as the quick start (except I added a display of the location part of the event). The calendar ID part was a pain. If you go to the same part of the calendar settings you would use to get the embed code and look at the various URLs, you will see they all include an email address in them. For example: 

	<iframe src="https://calendar.google.com/calendar/embed?src=4p6qtp2jeu40piuul6bklfra94%40group.calendar.google.com&ctz=America%2FChicago" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>

The email address is `4p6qtp2jeu40piuul6bklfra94%40group.calendar.google.com`. Change the `%40` to `@` and you've got your calendar ID. 

I ran this little script and got the following:

<img src="https://static.raymondcamden.com/images/2019/11/gcal4.jpg" alt="terminal output of node script" class="imgborder imgcenter">

Woot! Ok, so we've got code that can suck down events. The quick start demo code was already filtering on future events, sorted properly, and limited to ten, which is actually exactly what I want, but obviously you could tweak that to meet your needs. I decided to use [Eleventy](https://www.11ty.io/) to build my demo as it would let me set up a script to load events and display them on my page. To give you an idea of what I mean, let's look at the final result. First a screen shot:

<img src="https://static.raymondcamden.com/images/2019/11/gcal5.png" alt="List of events" class="imgborder imgcenter">

And here's the template behind this:

```html
---
layout: layout
title: Advanced Calendar
---

## Upcoming Events

Here's our upcoming events:

<ul>
{% raw %}{% for event in events %}
<li>{{ event.summary }} at {{ event.startValue }}
{% if event.location %}<br/>Located at {{ event.location }}{% endif %}
{% endfor %}
{% endraw %}
</ul>
```

Note that this isn't terribly creative, but it gets the job done. I'm looping over `events` which is driven by a file called `events.js` in my Eleventy's `_data` folder:

```js
const {google} = require('googleapis');
let creds = require('./credentials.json');

module.exports = async function() {

	const auth = new google.auth.GoogleAuth({
		credentials:creds,
		scopes: ['https://www.googleapis.com/auth/calendar']
	});

	const calendar = google.calendar({
		version:'v3',
		auth:auth
	});

	return new Promise((resolve, reject) => {

		calendar.events.list({
			calendarId: '4p6qtp2jeu40piuul6bklfra94@group.calendar.google.com',
			timeMin: (new Date()).toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			let events = res.data.items;
			events = events.map(event => {
				const start = event.start.dateTime || event.start.date;
				event.startValue = start;
				return event;
			});

			resolve(events);
		});

	});

}
```

This is - essentially - the same logic as before with some minor tweaks. I have to return a promise since the Google API wrapper is using a callback. I also take the `start` value the original code used and write it to a new key, `startValue`, that I use in my template. I could further massage the event data here if I wanted. 

And that's it. You can see it live here: <https://site.raymondcamden.now.sh/test>

## Considerations

So, this solution isn't perfect. If you add, edit, or delete an event, it won't be reflected on the site. However, you could simply do daily builds of your site via a CRON job let it be updated at that point. Or do a manual update if you want.

Another solution would be to use a serverless function with similar logic and JavaScript on the front end. To me, that seems like overkill for most organizations who may be changing their events only every couple of days, but if you absolutely need the most up to date list of events without needing to fire off a build, that would be an option as well. 

If you want to build this yourself, you can find my GitHub repo for the Eleventy site here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/gcal>

 <i>Header photo by <a href="https://unsplash.com/@adders?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Adam Tinworth</a> on Unsplash</i>

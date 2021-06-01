---
layout: post
title: "Adding Google Calendar to Your Jamstack - with Pipedream"
date: "2020-12-08"
categories: ["javascript","static sites"]
tags: ["eleventy","pipedream"]
banner_image: /images/banners/calendar.jpg
permalink: /2020/12/08/adding-google-calendar-to-your-jamstack-with-pipedream
description: An updated demonstration of integration calendar data into your Jamstack site - with Pipedream
---

Late last year (remember last year - sigh) I wrote up a post demonstrating how to integrate Google Calendar into your static web site: ["Adding Google Calendar to your JAMStack"](https://www.raymondcamden.com/2019/11/18/adding-google-calendar-to-your-jamstack). In that article, I describe how I used Google's Node libraries to read my event data. While it was mostly painless, authentication was a bit difficult to figure out. Also, I ended the post with this warning:

<blockquote>
So, this solution isn't perfect. If you add, edit, or delete an event, it won't be reflected on the site. However, you could simply do daily builds of your site via a CRON job let it be updated at that point. Or do a manual update if you want.
</blockquote>

A few days I was thinking about this usecase and realized I could probably do it a lot easier making use of [Pipedream](https://www.pipedream.com). How so? Don't forget that Nelify lets you create a build hook. This is a unique URL that when hit with a POST request will trigger a new build. In theory, all I have to do is create a Pipedream workflow that's fired on new events. How is that done?

After logging into Pipedream and going to my "Source" panel, I created a new source and selected Google Calendar. Pipedream lets you select from a few different types of events (to be clear, I mean programatic events, not calendar events, sorry for the confusion!) including one named, "New Or Updated Event (Instant)". As the name says, this will run instantly based on *any* particular edit done to a calendar. I authenticated with Google via Pipedream, selected my calendar (a custom one I made for this blog post), and then took the defaults for the rest. I did specify a name for the source though so it would be easier to find later. (I do a lot of testing!)

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/cal2-1.jpg" alt="Screen shot of Event Source UI" class="lazyload imgborder imgcenter">
</p>

Once this was created, I then made a few edits to my calendar. As I did, I was able to see, instantly, new events. Note that in the screenshot below, the event source code is smart enough to use the calendar event title as a label. That's cool!

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/gcal2-2.jpg" alt="Screen shot of Event Source events" class="lazyload imgborder imgcenter">
</p>

Now that I have an event source that fires when I edit a calendar, the next step was to use it in a workflow. I created a new Pipedream workflow, used my event source as the source. Do *not* forget that there is a boolean trigger for event sources that "enables" it. Your event source is running, but in the context of the workflow, you must enable it there. This is different from the "active" toggle of the workflow itself and every time I use an event source like this, I forgot to hit the toggle:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/gcal2-3.jpg" alt="Enable the source in the workflow" class="lazyload imgborder imgcenter">
</p>

Then I had add a second step. Remember that the idea is to trigger a build. While this is pretty simple code in Node, Pipedream actually has a built in action for performing HTTP requests. I added it, totally did <strong>not</strong> forget to change them ethod to POST, and pasted in the URL I got from the Netlify site settings so I can trigger a build.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/gcal2-4.jpg" alt="Workflow" class="lazyload imgborder imgcenter">
</p>

This just left testing. I created an event in Google Calendar, which automatically triggered my event source, which automatically triggered my Netlify build, which then triggers happiness!

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/gcal2-5.jpg" alt="Netlify Builds triggered by calendar events" class="lazyload imgborder imgcenter">
</p>

Woot! So in theory I could stop there, but then I thought, if Pipedream makes Google Calendar so easy to use, could I use it in my [Eleventy](https://www.11ty.dev/) site instead of the Google Node library I had? Turns out - I certainly could.

I built a new Pipedream workflow with a HTTP trigger. I then added the action, "Google Calendar - Get All Future Events". Note that there is also a "Get Events" action and that even the "future events" action lets you configure a minimum time, effectively allowing you to get past events too. 

This action requires you to paste in the ID of your calendar which you will need to get from your calendar settings. (The event source has a nice dropdown of your available calendars and I've already aksed if the action can be updated to suppor this as well.) Also, there is a default setting, "Single Events", which takes recurrring events and "collapses" them into one. For my use case, I did <strong>not</strong> want this behavior so I set it to false. 

The final step was to simply return the data so I could use this workflow as an API. I added a Node step and wrote this code:

```js
$respond({
  status:200,
  body:steps.get_all_future_events.$return_value.items
});
```

And that was it, literally. In two minutes, I had an end point I could hit to return Google Calendar events in structured JSON. All the auth was handled by Pipedream. 

I went to my Eleventy site and created a new file in my `_data` folder to use this API:

```js
const PD_EVENTS = 'https://enbfnzb6d0dzhfd.m.pipedream.net';
const fetch = require('node-fetch');

module.exports = async function() {

	return new Promise((resolve, reject) => {

		fetch(PD_EVENTS)
		.then(res => res.json())
		.then(res => {
			//console.log(res[1]);
			let events = res.map(e => fixEvent(e));
			resolve(events);
		});

	});

}

function fixEvent(e) {
	let event = {};

	event.title = e.summary;
	if(e.start.date) event.start = e.start.date;
	if(e.start.dateTime) event.start = e.start.dateTime;
	if(e.end.date) event.end = e.end.date;
	if(e.end.dateTime) event.end = e.end.dateTime;
	if(e.description) event.description = e.description;
	if(e.location) event.location = e.location;

	if(event.start) event.start = new Date(event.start);
	if(event.end) event.end = new Date(event.end);
	return event;
}
```

A few things to note here. I could obscure my Pipedream URL by using an evironment variable set by Netlify. I also did some basic data wrangling on the event structure to make it easier to use in my templates. As an example, here's the event's page:

```html
## Upcoming Events

{% raw %}Here's our upcoming events:

<ul>
{% for event in events %}
<li>{{ event.title }} at {{ event.start | dtFormat }}
{% if event.description %}<br/>{{ event.description }}{% endif %}
{% if event.location %}<br/>Located at {{ event.location }}{% endif %}
{% endfor %}
</ul>
{% endraw %}
```

I could absolutely display my evevents nicer. Heck, I don't even display the end time for events that have it, but you get the basic idea. You can see this yourself here: <https://calendar-eleventy-pd.netlify.app/events/>. You can see the source code for this Eleventy site here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/gcal2>. If you've got any questions, let me know!
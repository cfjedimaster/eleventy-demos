---
layout: post
title: "An Example of a Static Site with a Dynamic Calendar"
date: "2017-02-24T17:25:00-07:00"
categories: [static sites]
tags: [jekyll]
banner_image: 
permalink: /2017/02/24/an-example-of-a-static-site-with-a-dynamic-calendar
---

Forgive the somewhat clunky title - I wanted to share a little demo I built for my presentation this week at [DevNexus](https://www.devnexus.com/). The idea behind the demo was whether or not I could create a simple dynamic calendar system with a static web site. My presentation was all about adding dynamic aspects back into a static site, so this fit right in. 

For the demo, I made use of [FullCalendar](https://fullcalendar.io/). FullCalendar is a simple little jQuery plugin that renders a nice full screen (well, "as big as you want it") calendar. It can be driven by Google Calendar which is one simple way of adding a dynamic calendar to a static site, but I wanted to try something a bit different. 

I began by creating a new [Jekyll](http://jekyllrb.com/) site (which is a bit of a pain on Windows). Jekyll has a feature called [Collections](http://jekyllrb.com/docs/collections/) which allow you to define a basic "content type" for your site. By default, Jekyll has a "Post" collection already built in. Jekyll is primarily used for blogs. But you can create your own collections for whatever makes sense for your site. 

I began by defining a collection called events. This is done in _config.yml

<pre><code class="language-markup">collections:
  events:
    output: true
    permalink: /events/:path/
    title: Events
</code></pre>

I specified that I wanted my events to be published as pages and that they should use a URL path of /events/X, where X is based on the file name.

I added a new directory called `_events` and wrote my first piece of content:

<pre><code class="language-markup">---
layout: event
title:  "Ray's Birthday"
event_date:   2017-4-8
---

Let's gather together to celebrate Raymond's birthday!
</code></pre>

In a real page I'd have a lot more content about the event (possibly) but pay attention to the front matter. I've got a layout and title which is pretty standard, but `event_date` is custom. As you can probably guess, this represents the date of the event itself. I made a second page and then verified that they were rendering ok in my site.

<img src="https://static.raymondcamden.com/images/2017/2/ssge1.png" class="imgborder">

I didn't spend a lot of time on the template, but it works, so I'm down with it. 

Now came the interesting part. How do I get these random event pages available in FullCalendar? Here is where some static site generators shine - and some drop the ball. The SSG I used for my blog, Hugo, makes it *incredibly* difficult (imo) to add ad hoq pages with custom logic. You have to make a page with next to no input, tell it to use a layout that has the code, and then work over there instead of the page itself. I've seen multiple SSGs do this whereas both Jekyll and Harp are much more open in this regard.

I created my JSON data by adding a new file, calendar.data.html, with this code:

<pre><code class="language-markup">---
layout: 
title: 
permalink: /calendar-data/
---

[
{% raw %}{% for event in site.events %}{% endraw %}
	{
		"title":"{% raw %}{{event.title}}{% endraw %}",
		"start": "{% raw %}{{event.event_date}}{% endraw %}",
		"allDay":true,
		"url":"{% raw %}{{event.url}}{% endraw %}"
	}
	{% raw %}{%unless forloop.last %}{% endraw %},{% raw %}{%endunless%}{% endraw %}
{% raw %}{% endfor %}{% endraw %}
]
</code></pre>

I've specified no layout and title. This keeps the output clean and the "page" invisible from the top header. I then output over my collection data which Jekyll makes available via `site.events`. The only kind weird part is the `{% raw %}{%unless%}{% endraw %}` block. That's how I handle including a comma between each event item and *not* after the last one. The end result was a JSON feed available at `/calendar-data/` that looked like this:

<pre><code class="language-javascript">[

	{
		"title":"Carol's Birthday",
		"start": "2017-3-07",
		"allDay":true,
		"url":"/events/carol_bday/"
	}
	,

	{
		"title":"Ray's Birthday",
		"start": "2017-4-8",
		"allDay":true,
		"url":"/events/ray_bday/"
	}
	

]
</code></pre>

It could be formatted a bit nicer, but it works. I then added a new page to render the FullCalendar:

<pre><code class="language-markup">---
layout: page
title: Event Calendar
permalink: &#x2F;calendar&#x2F;
---

&lt;script src=&quot;https:&#x2F;&#x2F;code.jquery.com&#x2F;jquery-3.1.1.min.js&quot;   
integrity=&quot;sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=&quot;  crossorigin=&quot;anonymous&quot;&gt;&lt;&#x2F;script&gt;
&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;&#x2F;scripts&#x2F;moment.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script src=&quot;&#x2F;&#x2F;cdnjs.cloudflare.com&#x2F;ajax&#x2F;libs&#x2F;fullcalendar&#x2F;3.2.0&#x2F;fullcalendar.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;link rel=&quot;stylesheet&quot; href=&quot;&#x2F;&#x2F;cdnjs.cloudflare.com&#x2F;ajax&#x2F;libs&#x2F;fullcalendar&#x2F;3.2.0&#x2F;fullcalendar.min.css&quot;&gt;
&lt;link rel=&quot;stylesheet&quot; media=&quot;print&quot; href=&quot;&#x2F;&#x2F;cdnjs.cloudflare.com&#x2F;ajax&#x2F;libs&#x2F;fullcalendar&#x2F;3.2.0&#x2F;fullcalendar.print.css&quot;&gt;

&lt;script&gt;
$(document).ready(function() {

	$(&#x27;#calendar&#x27;).fullCalendar({
		events:&#x27;&#x2F;calendar-data&#x27;
	})

});

&lt;&#x2F;script&gt;

&lt;div id=&quot;calendar&quot;&gt;&lt;&#x2F;div&gt;
</code></pre>

FullCalendar supports a *lot* of customizations, but all I did was specify the URL where the event data could be found. Here it is in action:

<img src="https://static.raymondcamden.com/images/2017/2/ssge2.png" class="imgborder">

So yeah, not exactly rocket science, but I've been wanting to build this for a while. This approach would not scale to a huge amount of events, but you could build out events in a "per month" or "per year" file to keep things sensible. FullCalendar can use a function to define how to load data, so you could dynamically create a URL path to the proper data feed based on what month is being requested. 

You can find the full source for this demo here: https://github.com/cfjedimaster/Static-Site-Examples/tree/master/jekyll_fullcalendar
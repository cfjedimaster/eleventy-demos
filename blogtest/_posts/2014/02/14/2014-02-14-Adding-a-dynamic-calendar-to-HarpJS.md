---
layout: post
title: "Adding a dynamic calendar to HarpJS"
date: "2014-02-14T13:02:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/02/14/Adding-a-dynamic-calendar-to-HarpJS
guid: 5152
---

<p>
Another day, another <a href="http://harpjs.com">HarpJS</a> recipe. Can you tell what I'm excited about lately? For today's demo, I've built a simple dynamic calendar for HarpJS. There are probably many different ways to handle this (you could simply embed a Google Calendar as I describe <a href="http://flippinawesome.org/2013/12/16/moving-to-static-and-keeping-your-toys/">here</a>), but here is how I solved it.
</p>
<!--more-->
<p>
I decided that I'd use the <a href="http://arshaw.com/fullcalendar/">FullCalendar jQuery plugin</a> for the display of the calendar. I've used it before with a ColdFusion demo and I like how easy it is use. I also knew it supported loading events from an Ajax source. HarpJS lets you build more than just dynamic HTML pages. You can build dynamic XML and JSON files as well. This <a href="http://harpjs.com/recipes/blog-rss-feed">recipe</a> describes how you can generate XML for a RSS feed. A similar method could be used to generate JSON as well. 
</p>

<p>
I began by creating an events folder. Inside of this folder I created a few files to represent my events. I'm not doing anything fancy with that so I won't bother sharing the code. I then created a _data.json file. This is what will drive the JSON feed.
</p>

<pre><code class="language-javascript">{
	"a":{
		"title":"Event A",
		"date":"2/14/2014",
		"allDay":true
	},
	"b":{
		"title":"Event B",
		"date":"2/13/2014 2:00 PM"
	},
	"events":{
		"layout":false
	}
}</code></pre>

<p>
The first two items represent my events. Title and date should make sense. I'll explain allDay in a second. The final item represents the file that will generate my JSON feed. By default Harp wraps your pages in layout templates. But for a JSON feed that layout would break the code that parses it. By adding layout:false I'm telling Harp to not wrap that file with the regular site layout. (This causes another small problem and I'll discuss that more at the end.) 
</p>

<p>
Next - I created my front end. This is taken straight from the FullCalendar sample files so it isn't too exciting, but here it is:
</p>

<pre><code class="language-markup">&lt;link href=&#x27;&#x2F;fullcalendar&#x2F;fullcalendar.css&#x27; rel=&#x27;stylesheet&#x27; &#x2F;&gt;
&lt;link href=&#x27;&#x2F;fullcalendar&#x2F;fullcalendar.print.css&#x27; rel=&#x27;stylesheet&#x27; media=&#x27;print&#x27; &#x2F;&gt;
&lt;script src=&#x27;&#x2F;lib&#x2F;moment.min.js&#x27;&gt;&lt;&#x2F;script&gt;
&lt;script src=&#x27;&#x2F;lib&#x2F;jquery.min.js&#x27;&gt;&lt;&#x2F;script&gt;
&lt;script src=&#x27;&#x2F;lib&#x2F;jquery-ui.custom.min.js&#x27;&gt;&lt;&#x2F;script&gt;
&lt;script src=&#x27;&#x2F;fullcalendar&#x2F;fullcalendar.min.js&#x27;&gt;&lt;&#x2F;script&gt;
&lt;script&gt;

	$(document).ready(function() {
	
		$(&#x27;#calendar&#x27;).fullCalendar({
			header: {
				left: &#x27;prev,next today&#x27;,
				center: &#x27;title&#x27;,
				right: &#x27;month,agendaWeek,agendaDay&#x27;
			},
			editable: true,
			timezone:&quot;America&#x2F;Chicago&quot;,
			events: {
				url: &#x27;&#x2F;events&#x2F;events.json&#x27;,
				error: function() {
					$(&#x27;#script-warning&#x27;).show();
				}
			},
			loading: function(bool) {
				$(&#x27;#loading&#x27;).toggle(bool);
			}
		});
		
	});

&lt;&#x2F;script&gt;


&lt;div id=&#x27;script-warning&#x27;&gt;
	crap broke.
&lt;&#x2F;div&gt;

&lt;div id=&#x27;loading&#x27;&gt;loading...&lt;&#x2F;div&gt;

&lt;div id=&#x27;calendar&#x27;&gt;&lt;&#x2F;div&gt;
</code></pre>

<p>
The only thing here really interesting is the url option in full calendar. Note that I'm pointing to /events/events.json. My real file is events/events.json.ejs. Harp will serve it up without the EJS extension and even automatically use the right content type based on the JSON extension. Cool! Now let's look at the code.
</p>

<pre><code class="language-markup">[
	&lt;% 
	var events = Object.keys(public.events._data);
	for(var i=0; i&lt;events.length; i++) { 
		if(events[i] !== &quot;events&quot;) {
			event = public.events._data[events[i]];
	%&gt;
		{
			&quot;title&quot;:&quot;&lt;{% raw %}%- event.title %{% endraw %}&gt;&quot;,
			&quot;start&quot;:&quot;&lt;{% raw %}%- event.date %{% endraw %}&gt;&quot;,
			&quot;url&quot;:&quot;&#x2F;events&#x2F;&lt;{% raw %}%- events[i] %{% endraw %}&gt;.html&quot;
			&lt;{% raw %}% if(event.allDay) { %{% endraw %}&gt;
			,&quot;allDay&quot;:&lt;{% raw %}%- event.allDay %{% endraw %}&gt;
			&lt;{% raw %}% }{% endraw %} %&gt;
		}
			&lt;{% raw %}% if(i+2 &lt; events.length) { %{% endraw %}&gt;,&lt;{% raw %}% }{% endraw %} %&gt;
	&lt;% 
		}
	} 
	%&gt;
]
</code></pre>

<p>
Ok, not the prettiest code, but let's break it down. I begin by getting the keys from my data and looping over it. I skip the events key - remember, it is there only so that I can disable layout. For each event I output the title and date. The start label is used there because that's what FullCalendar wants. Speaking of - FullCalendar also requires that you tell it when an event is over the entire day. If you don't, it makes a guess as to a time. That's why I included allDay in my JSON data and you can see me using it here. Finally, I use a bit of logic to determine if I'm at the end of my loop. If I'm not, I output a comma.
</p>

<p>
So yeah - this is ugly - and it was pretty easy for me to break it. The output was pretty - but the code was gross. I then figured out that it was silly for me to create JSON when the server could do it instead. Here is version two:
</p>

<pre><code class="language-markup">&lt;%
var eventData = [];
var events = Object.keys(public.events._data);
for(var i=0; i&lt;events.length;i++) {
	if(events[i] !== &quot;events&quot;) {
		var eventOb = {};
		event = public.events._data[events[i]];
		eventOb.title = event.title;
		eventOb.start = event.date;
		eventOb.url = &quot;&#x2F;events&#x2F;&quot; + events[i] + &quot;.html&quot;;
		if(event.allDay) {
			eventOb.allDay = event.allDay;	
		}
		eventData.push(eventOb);
	}
}

%&gt;

&lt;{% raw %}%- JSON.stringify(eventData) %{% endraw %}&gt;
</code></pre>

<p>
A heck of a lot cleaner, right? And then I end with a simple call to JSON.stringify. Much simpler. And that's it! Here is a screen shot of the calendar displaying the events powered by HarpJS and the dynamic JSON feed.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_14_14__3_23_PM.png" />
</p>

<p>
I've attached a copy of the source code to this, and a compiled version of it, as an attachment to this blog entry. One small little note. I really didn't like that I had to include the layout disable thing inside of my _data.json. I tried moving my events.json.ejs to the root of my project but found that I couldn't disable the layout there. I filed a <a href="https://github.com/sintaxi/harp/issues/247">bug report</a> for the issue and once it is fixed (or maybe <strong>I</strong> did something wrong) I'll probably move that script to root and leave my data a bit more "pure". I'm being picky, but you get the idea. An alternative would be to use a substructure in the data file, but then I'd lose the "you are on this page I'll automatically copy these values" feature of Harp. I could live with that as well.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcalendar3%{% endraw %}2Ezip'>Download attached file.</a></p>
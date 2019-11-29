---
layout: post
title: "Using JavaScript to integrate with the EventBrite API"
date: "2015-07-22T13:44:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/07/22/using-javascript-to-integrate-with-the-eventbrite-api
guid: 6449
---

Almost a year ago I <a href="http://www.raymondcamden.com/2014/08/15/Eventbrite-API-Demos">blogged</a> about using the EventBrite API with ColdFusion. At that time, I was under the impression that all uses of the EventBrite API required a private OAuth token. This means it would not be possible to use the data on the client-side. (Unless you used a server to proxy the API calls for you of course.) But after speaking to Mitch Colleran from EventBrite, I was happy to discover I was wrong.

<!--more-->

Turns out, when you create an app on the EventBrite developer portal, you actually get both a regular OAuth token and secret as well as an anonymous oauth token:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot17.png" alt="shot1" width="857" height="563" class="aligncenter size-full wp-image-6450 imgborder" />

By using the anonymous oath token, you can read <i>any</i> public data you want, all without having to use a secure key. This means you can use the EventBrite API in a JavaScript app (desktop, mobile, hybrid, etc.) without worrying about keeping your key secret. In fact, their API is so easy to use you can actually pass in the anon key right in the URL. 

As an example, given that <code>token</code> represents your anon oath token, this will get all public events:

<pre><code class="language-javascript">https://www.eventbriteapi.com/v3/events/search/?token='+token</code></pre>

Obviously you probably want your <i>own</i> events, not the entire worlds. While it is trivial to restrict the results to your own organization, oddly it is still a bit awkward to get your organizer id. As I said in the old post, go to your profile and then your organization settings. You'll see your organizer URL with the ID at the end:

<img src="https://static.raymondcamden.com/images/s215.png" class="aligncenter size-full imgborder" />

You can then pass it to the URL:

<pre><code class="language-javascript">https://www.eventbriteapi.com/v3/events/search/?token='+token+'&organizer.id=8231868522&expand=venue'</code></pre>

In case you're curious, the expand=venue option there just tells the API to return venue information. Without it, you get the ID of the venue and could do more HTTP calls to get it, but returning it all at once is simpler.

Ok, so why bother? EventBrite already has embed options, right? Well they do - and those are nice - but if you want more control over the embed experience then you'll want the ability to write out the data as you see fit.

Here's an incredibly simple example that fetches events and displays them in a list.

<pre><code class="language-javascript">&lt;html&gt;
&lt;head&gt;
	&lt;script src=&quot;https://code.jquery.com/jquery-2.1.4.min.js&quot;&gt;&lt;/script&gt;
	&lt;script&gt;
	$(document).ready(function() {
		
		var token = 'GGAQ2BUKIRGJMZMU55YZ';
		var $events = $(&quot;#events&quot;);
		
		$.get('https://www.eventbriteapi.com/v3/events/search/?token='+token+'&amp;organizer.id=8231868522&amp;expand=venue', function(res) {
			if(res.events.length) {
				var s = &quot;&lt;ul class='eventList'&gt;&quot;;
				for(var i=0;i&lt;res.events.length;i++) {
					var event = res.events[i];
					console.dir(event);
					s += &quot;&lt;li&gt;&lt;a href='&quot; + event.url + &quot;'&gt;&quot; + event.name.text + &quot;&lt;/a&gt; - &quot; + event.description.text + &quot;&lt;/li&gt;&quot;;
				}
				s += &quot;&lt;/ul&gt;&quot;;
				$events.html(s);
			} else {
				$events.html(&quot;&lt;p&gt;Sorry, there are no upcoming events.&lt;/p&gt;&quot;);
			}
		});
		
		
	});
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
	
&lt;h2&gt;Upcoming Events!&lt;/h2&gt;
&lt;div id=&quot;events&quot;&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

As I said, this is simple, so simple I assume it just makes sense, but if not, let me know in the comments below. After building this for an organization, I then worked on making it a bit nicer. For example, I formatted the Date using Moment.js:

<pre><code class="language-javascript">&lt;html&gt;
&lt;head&gt;
	&lt;script src=&quot;https://code.jquery.com/jquery-2.1.4.min.js&quot;&gt;&lt;/script&gt;
	&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.js&quot;&gt;&lt;/script&gt;
	&lt;script&gt;
	$(document).ready(function() {
		
		//anon oauth token
		var token = 'GGAQ2BUKIRGJMZMU55YZ';
		//org id
		var organizer = '8231868522';

		var $events = $(&quot;#events&quot;);
		
		$events.html(&quot;&lt;i&gt;Loading events, please stand by...&lt;/i&gt;&quot;);
		$.get('https://www.eventbriteapi.com/v3/events/search/?token='+token+'&amp;organizer.id='+organizer+'&amp;expand=venue', function(res) {
			if(res.events.length) {
				var s = &quot;&quot;;
				for(var i=0;i&lt;res.events.length;i++) {
					var event = res.events[i];
					var eventTime = moment(event.start.local).format('M/D/YYYY h:mm A');
					console.dir(event);
					s += &quot;&lt;div class='eventList'&gt;&quot;;
					s += &quot;&lt;h2&gt;&lt;a href='&quot; + event.url + &quot;'&gt;&quot; + event.name.text + &quot;&lt;/a&gt;&lt;/h2&gt;&quot;;
					s += &quot;&lt;p&gt;&lt;b&gt;Location: &quot; + event.venue.address.address_1 + &quot;&lt;/b&gt;&lt;br/&gt;&quot;;
					s += &quot;&lt;b&gt;Date/Time: &quot; + eventTime + &quot;&lt;/b&gt;&lt;/p&gt;&quot;;
					
					s += &quot;&lt;p&gt;&quot; + event.description.text + &quot;&lt;/p&gt;&quot;;
					s += &quot;&lt;/div&gt;&quot;;
				}
				$events.html(s);
			} else {
				$events.html(&quot;&lt;p&gt;Sorry, there are no upcoming events.&lt;/p&gt;&quot;);
			}
		});
		

		
	});
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
	
&lt;h2&gt;Upcoming Events!&lt;/h2&gt;
&lt;div id=&quot;events&quot;&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

I <i>love</i> Moment.js. By the way, that code to display the event is a bit brittle. For example, it assumes a venue exists when it may not have that data. It could also show more of the venue too. Basically, remember that EventBrite events are complex so you'll want to use conditionals and the like to determine what to display. And yeah, generating the layout in JavaScript like that is ugly. Check out my <a href="http://shop.oreilly.com/product/0636920034971.do">video series on JavaScript templating</a> for ways to make this nicer.

I then kicked this up a notch. The person who had asked for help mentioned they wanted to display events from multiple organizations. So I built a method that lets you pass in either an org, or an array of orgs, and your key, and then use a promise to return a sorted array of events when done:

<pre><code class="language-javascript">function getEvents(organizers,token) {
	var def = $.Deferred();
	if(organizers.constructor !== Array) {
		organizers = [organizers];
	}
	
	var defs = [];
	for(var i=0;i&lt;organizers.length;i++) {
		defs.push($.get('https://www.eventbriteapi.com/v3/events/search/?token='+token+'&amp;organizer.id='+organizers[i]+'&amp;expand=venue'));
	}
	var data = [];
	$.when.apply($, defs).done(function() {
		// when we had one deferred, arguments is 'normal'
		// when we have 2+, its one argument array per result
		if(organizers.length === 1) {
			def.resolve(arguments[0].events);
		} else {
			for(var i=0;i&lt;arguments.length;i++) {
				data.push.apply(data, arguments[i][0].events);
			}
			data.sort(function(a,b) {
				var aDate = new Date(a.start.utc);
				var bDate = new Date(b.start.utc);
				return aDate &gt; bDate;
			});
			def.resolve(data);
		}
	});
	return def.promise();

}</code></pre>

And to use it, you can do code like this:

<pre><code class="language-javascript">
var token = 'NG6HEAKRAAXCL4ZGB2YV';
var org1 = '8231868522';
var org2 = '1504496266';

getEvents([org1,org2], token).then(function(res) {
</code></pre>

Of course, I don't have any error handling in there, but if you don't tell anyone, I won't. What's nice is you could take this code and easily use it with something like <a href="http://fullcalendar.io/">FullCalendar</a> to create a nice, large calendar on your site. 

Ok, so I was going ot go ahead and post the blog, but then I figured, why not go ahead and build a FullCalendar demo. All I had to do was modify the array of events to match what FullCalendar wanted:

<pre><code class="language-javascript">var token = 'NG6HEAKRAAXCL4ZGB2YV';
var org1 = '8231868522';
var org2 = '1504496266';

var $events = $(&quot;#events&quot;);


getEvents([org1,org2], token).then(function(res) {
	console.log(&quot;Result&quot;);
	//convert res to something FC can use
	for(var i=0;i&lt;res.length;i++) {
		res[i].title = res[i].name.text;
		res[i].startOrig = res[i].start;
		res[i].start = res[i].startOrig.utc;
		res[i].endOrig = res[i].end;
		res[i].end = res[i].endOrig.utc;
	}
	console.dir(res);
	
	if(res.length) {

		$events.fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			timezone:'local',
			events:res
		});
		
	} else {
	}			
});</code></pre>

You can run that demo here: <a href="https://static.raymondcamden.com/demos/2015/jul/22/test7.html">https://static.raymondcamden.com/demos/2015/jul/22/test7.html</a>. 

Enjoy!
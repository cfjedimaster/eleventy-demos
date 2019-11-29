---
layout: post
title: "Note to self about Server-Sent Events"
date: "2011-08-29T11:08:00+06:00"
categories: [coldfusion,html5]
tags: []
banner_image: 
permalink: /2011/08/29/Note-to-self-about-ServerSent-Events
guid: 4345
---

This morning I took a look over the <a href="http://hacks.mozilla.org/2011/08/firefox6/?utm_source=html5weekly&utm_medium=email">Firefox 6</a> release notes. Before I go any further - wow - kudos to the Firefox devs for such a good, detailed, and informative set of release notes. I was really impressed. Anyway, while reading them I noticed they mentioned support for <a href="http://dev.w3.org/html5/eventsource/">Server-Sent Events</a>. This is one of the more interesting HTML5 specs as it allows for push notifications. In my simple testing though it seemed to fall back to simple polling, which is actually kind of cool. So for example, here is the HTML:

<p/>

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
   $(document).ready(function() {

		var source = new EventSource('test2.cfm');
		source.onmessage = function (event) {
		  console.log(event.data);
		};
		
   });
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Note - the jQuery here is completely unrelated. Note the EventSource object. Once create, you can listen to a few events (see the spec I linked to above), including an onmessage one. I built a simple CFM page to respond to the requests. According to the spec you have a few options on what you return, but the simplest is to just send data back. Data values must be prepended with data:. So to send back two lines of text, you would do:

<p>

<code>
data: Foo
data: 9
data: beer
</code>

<p>

I began with this in ColdFusion:

<p>

<code>
data: &lt;cfoutput&gt;#randRange(1,100)#&lt;/cfoutput&gt;
</code>

<p>

Which didn't work. Luckily, Chrome was <b>very</b> clear on why:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip168.png" />

<p>

Maybe I'm jaded (ok, I <i>am</i>), but I don't expect the browsers to be this helpful. In fact, look at what Firefox will report:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip169.png" />

<p>

Useless. Less then useless in fact as it may lead you to think ColdFusion is down. Any way, now that we know the content type is the issue, it is trivial to solve:

<p>

<code>
&lt;cfcontent type="text/event-stream"&gt;data: &lt;cfoutput&gt;#randRange(1,100)#&lt;/cfoutput&gt;
</code>

<p>

Any way, this is an interesting feature. If you follow me on Twitter you know I've been railing against HTML5 demos that aren't practical. (How many times has a client asked you to draw something that Canvas would help you with? How many times has a client asked for better form validation?) This one looks like it could be very interesting. Any of my readers using this in production yet?

<p>

Oh - and yeah - don't bother trying this in IE9.
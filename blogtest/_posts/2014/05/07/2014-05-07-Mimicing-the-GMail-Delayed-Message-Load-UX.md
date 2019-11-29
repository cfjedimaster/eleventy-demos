---
layout: post
title: "Mimicking the GMail Delayed Message Load UX"
date: "2014-05-07T14:05:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/05/07/Mimicing-the-GMail-Delayed-Message-Load-UX
guid: 5218
---

<p>
Before I begin, I want to point out that the title of this blog is far more complex-sounding than what I'm actually going to demonstrate here. GMail has an interesting way to handle large mail threads. When you view it, only the most recent few emails will be visible. The rest will be collapsed and are loaded as you click them.
</p>
<!--more-->
<p>
Here is a screen shot showing a thread from a public listserv I'm on.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s113.png" />
</p>

<p>
They also do a bit more collapsing in the middle of the thread as well. Overall though the idea is to show you the most up to date content first and then let you decide if you need the older information. You can also click a button to expand all the messages at once. I thought it might be fun to rebuild this myself. Just because. This isn't necessarily rocket science but I thought it might be fun to share. Note that this code could be refactored, made more impressive, etc. As I said - I just built this for fun.
</p>

<p>
So, let's start with the HTML. As this is a one page demo, I've got one page of HTML.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;GMail Test Thingy&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link type=&quot;text&#x2F;css&quot; rel=&quot;stylesheet&quot; href=&quot;styles.css&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;content&quot;&gt;&lt;&#x2F;div&gt;
		
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;

	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>
<p>
There is absolutely nothing here worth our time discussing, but I will point out the content div where I'll be laying out my data. Now let's take a look at app.js.
</p>

<pre><code class="language-javascript">&#x2F;* global $,document *&#x2F;
$(document).ready(function() {
	
	&#x2F;&#x2F;used to store current set of messages
	var messages;
	
	&#x2F;&#x2F;where I&#x27;ll be rendering content
	var $div = $(&quot;#content&quot;);

	&#x2F;&#x2F;Fetch the thread content
	$.get(&quot;.&#x2F;thread.cfc?method=getThread&quot;, function(res) {
	
		var html = &quot;&quot;;
		for(var i=0, len=res.length; i&lt;len; i++) {
			var message = res[i];
			html += &quot;&lt;div class=&#x27;message&#x27; data-message-id=&#x27;&quot; + message.id + &quot;&#x27;&gt;&quot;;
			html += &quot;&lt;div class=&#x27;messageTitle&#x27;&gt;&quot;+message.title+&quot;&lt;&#x2F;div&gt;&quot;;
			if(message.body) {
				html += &quot;&lt;div class=&#x27;messageBody&#x27;&gt;&quot;+message.body+&quot;&lt;&#x2F;div&gt;&quot;;	
			} else {
				html += &quot;&lt;div class=&#x27;messageBody&#x27;&gt;&lt;&#x2F;div&gt;&quot;;	
			}
			html += &quot;&lt;&#x2F;div&gt;&quot;;
		}
		
		$div.html(html);
		
		&#x2F;&#x2F;copy so we can look em later
		messages = res;
		
	},&quot;json&quot;);
	
	&#x2F;&#x2F;listen for click events to (potentially) load a message
	$(&quot;body&quot;).on(&quot;click&quot;, &quot;.messageTitle&quot;, function(e) {
		var messageId = $(this).parent().data(&quot;message-id&quot;);
		var $body = $(this).next();
		&#x2F;&#x2F;Simple logic - if we already have the message, don&#x27;t do anything, otherwse load it
		for(var i=0, len=messages.length; i&lt;len; i++) {
			var m = messages[i];
			if(m.id === messageId &amp;&amp; !m.body) {
				$.get(&quot;.&#x2F;thread.cfc?method=getMessage&quot;, {% raw %}{messageId:m.id}{% endraw %}, function(res) {
					$body.html(res.body);
					messages[i].body = res.body;
				},&quot;json&quot;);
				break;
			}
		}
	});
});</code></pre>

<p>
OK, let's break this down bit by bit. My first real piece of functionality is the $.get call to fetch my email thread. I'm using ColdFusion on the back end but the data is completely static. I'm going to return an array of Message objects where each has an ID and a Title. But - the server recognizes that it is a big thread and will only fill the Body property for the last few. So the front end has to recognize this. You can see where I loop over the array and generate my content. I'm using a few div classes that will come into play in a bit. Also note how I embed the message ID in a data attribute. This is valid HTML and is an easy way to embed metadata into the DOM.
</p>

<p>
So the end result of this is a rendered list of messages:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-05-07 at 13.03.46.png" />
</p>

<p>
Don't hate me for my epic CSS design skills. The next part of the demo is handling click events on the titles. You can see my click handler there based on the class I used for the title. I fetch the message ID and then look into my message's data to see if I've loaded the body already. If I haven't, I call the server again, fetch the body, display it, and cache it.  Here is a screen shot with a few messages loaded.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-05-07 at 13.06.07.png" />
</p>

<p>
And that's it. Not exactly rocket science, but, practical I suppose, and something folks may want to rip into their own code. You can demo this yourself below.
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2014/may/7/test.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>   
</p>
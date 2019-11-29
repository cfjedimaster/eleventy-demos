---
layout: post
title: "Simple Trick - Adding a Play Indicator to the Browser Tab"
date: "2014-02-04T10:02:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/02/04/Simple-Trick-Adding-a-Play-Indicator-to-the-Browser-Tab
guid: 5145
---

<p>
I'm a Soundcloud user and a while ago I noticed they did something cool with their interface - a "Play" icon when you are playing music.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/s18.png" />
</p>

<p>
If you've ever been jamming out and needed to quickly mute your computer then this is a nice way to see which browser tab is making sound. In fact, the most recent Chrome now makes this built in:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s210.png" />
</p>

<p>
In this case the native indicator is on the right. This is especially handy for cases where a site feels that their users are too stupid to know how to play video and use autoplay. (And let's be clear, if you use autoplay, you think your users are idiots. Either that or you are just a rude jerk who feels the need to .... ok sorry I'll stop my rant now. ;) 
</p>

<p>
So I knew this was trivial code but I wanted to build my own little example of this - just for the heck of it.
</p>

<pre><code class="language-javascript">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;Some Page&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;
		
		&lt;button id=&quot;playButton&quot;&gt;Play&lt;&#x2F;button&gt;

		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.0.3&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
		$(document).ready(function() {
			var $button = $(&quot;#playButton&quot;);
			var playing = false;
			var origTitle = document.title;
			
			$button.on(&quot;click&quot;, function() {
				if(!playing) {
					playing = true;	
					$button.text(&quot;Pause&quot;);
					document.title = &#x27;\u25B6 &#x27; + origTitle;
				} else {
					playing = false;
					$button.text(&quot;Play&quot;);
					document.title = origTitle;
				}
			});
			
		});
		&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
The example above consists of one DOM item - a button. On the page load event, I grab a jQuery-wrapped pointer to it and a copy of the current page title. Then all I need to do is listen for click events to handle playing (or pausing) the audio. To be clear, I didn't bother adding real audio here. To add the play indicator, you simply use the Unicode character for it and prepend it to the title. In case you're curious, I Googled for "unicode for play symbol" to find the <a href="http://www.fileformat.info/info/unicode/char/25B6/index.htm">right one</a>. 
</p>

<p>
If you are incredibly bored and want to see this in action, hit the demo link below.
</p>

<p>
<a href="http://raymondcamden.com/demos/2014/feb/4/nowplaying.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>  
</p>
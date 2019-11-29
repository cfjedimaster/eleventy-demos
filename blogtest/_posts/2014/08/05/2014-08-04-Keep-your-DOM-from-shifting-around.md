---
layout: post
title: "Keep your DOM from shifting around..."
date: "2014-08-05T10:08:00+06:00"
categories: [development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/08/05/Keep-your-DOM-from-shifting-around
guid: 5282
---

<p>
I've been meaning to write this up for a while now, but I never got around to it till today when a meeting got cancelled suddenly. It was this or get on the treadmill, and unfortunately, the treadmill lost. Lately I've noticed a common problem with both web apps and native apps. The problem is this: The application renders some sort of dynamic content. In that content are various UI elements you can click. At the same time, the app is fetching additional content asynchronously. When that content comes in, it is displayed then and the layout of the content is adjusted as the new stuff comes in. The problem is that the user may have been just about to click on a button, link, or whatever, and now finds that their click action has done nothing. Or worse - has activated <i>another</i> action that they didn't want. TweetDeck is <b>especially</b> bad about this. Facebook, surprisingly, is actually pretty darn good about this. Let's look at a simple example in case I'm not making sense.
</p>
<!--more-->
<p>
I've built a simple application that lets you view, and like, pictures of cats. Let me be clear, this is just a proof of concept, but if someone builds this site I'll be hitting that every five minutes or so. When the application loads, you get a picture of the cat, and some, but not all, of the UI.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s12.jpg" />
</p>

<p>
As you move your mouse, or finger, over the Like button, all of sudden the UI updates to show stats about the picture. The original developer thought it would be cool to load this <i>after</i> the rest of the page. Not a terribly bad idea, right? If the main focus is to show pictures of cats then loading the stats later makes a bit of sense. But see how the DOM changes after the stats were loaded:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s22.jpg" />
</p>

<p>
As you can see, the Like button was shifted down. In this case the worst you get is a click event that didn't trigger anything, but it is still annoying. You can demo this yourself here: <a href="http://www.raymondcamden.com/demos/2014/aug/5/test1.html">http://www.raymondcamden.com/demos/2014/aug/5/test1.html</a>. Let's quickly look at the code so you can see how the original version was built. First, the HTML.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app1.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;content&quot;&gt;
			&lt;img src=&quot;http:&#x2F;&#x2F;placekitten.com&#x2F;300&#x2F;300&quot;&gt;
			&lt;div id=&quot;stats&quot;&gt;&lt;&#x2F;div&gt;
			&lt;button&gt;Like!&lt;&#x2F;button&gt;
		&lt;&#x2F;div&gt;
		
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
And here is the JavaScript. I used a simple setTimeout to fake a slow AJAX request.
</p>

<pre><code class="language-javascript">$(document).ready(function() {

	&#x2F;&#x2F;fake a delayed update
	window.setTimeout(function() {
		$(&quot;#stats&quot;).html(&quot;&lt;b&gt;Likes:&lt;&#x2F;b&gt; 912&quot;);
	},2000);
	
});</code></pre>

<p>
Ok, so how can we fix this? One approach may be to simply specify a set height for the DOM item we are updating. That way there won't be a "shift" when the content is uploaded. For example:
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app2.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;style&gt;
			#stats {
				height: 30px;
				background-color: #c0c0c0;
			}
		&lt;&#x2F;style&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;content&quot;&gt;
			&lt;img src=&quot;http:&#x2F;&#x2F;placekitten.com&#x2F;300&#x2F;300&quot;&gt;
			&lt;div id=&quot;stats&quot;&gt;&lt;&#x2F;div&gt;
			&lt;button&gt;Like!&lt;&#x2F;button&gt;
		&lt;&#x2F;div&gt;
		
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
Notice I added both a height and a background-color. The color change was simply to ensure that my height was working right. It also gives the user a bit of a clue that <i>something</i> is going to be there. (I won't pretend this is pretty, but hopefully you get the idea.) You can try this version here: <a href="http://www.raymondcamden.com/demos/2014/aug/5/test2.html">http://www.raymondcamden.com/demos/2014/aug/5/test2.html</a>.
</p>

<p>
But we can do even better, right? I don't like the big empty box. Let's modify the stats area to include the labels for our stats (well, our stat), so that the update is a bit less jarring. While we're at it, our image service (in this case, the epic <a href="http://placekitten.com/">placekitten.com</a>) can also be a source of DOM shifting as the image loads. I should have added specific height and width to the image.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app3.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;style&gt;
			#stats {
				height: 30px;
			}
		&lt;&#x2F;style&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;content&quot;&gt;
			&lt;img src=&quot;http:&#x2F;&#x2F;placekitten.com&#x2F;300&#x2F;300&quot; width=&quot;300&quot; height=&quot;300&quot;&gt;
			&lt;div id=&quot;stats&quot;&gt;Likes: &lt;span id=&quot;likes&quot;&gt;&lt;&#x2F;span&gt;&lt;&#x2F;div&gt;
			&lt;button&gt;Like!&lt;&#x2F;button&gt;
		&lt;&#x2F;div&gt;
		
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
I modified the JavaScript now to both add a loading message and to just change the span.
</p>

<pre><code class="language-javascript">$(document).ready(function() {

	$(&quot;#likes&quot;).html(&quot;&lt;i&gt;Fetching&lt;&#x2F;i&gt;&quot;);

	&#x2F;&#x2F;fake a delayed update
	window.setTimeout(function() {
		$(&quot;#likes&quot;).html(&quot;912&quot;);
	},2000);
	
});</code></pre>

<p>
You can run this version here: <a href="http://www.raymondcamden.com/demos/2014/aug/5/test3.html">http://www.raymondcamden.com/demos/2014/aug/5/test3.html</a>.
</p>

<p>
This isn't rocket science, but as I said in the beginning, I find myself surprised by how many sites and apps seem to have this problem. Keep it in mind when working on your next project.
</p>
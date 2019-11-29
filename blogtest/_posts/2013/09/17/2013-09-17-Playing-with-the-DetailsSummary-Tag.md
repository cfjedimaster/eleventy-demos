---
layout: post
title: "Playing with the Details/Summary Tag"
date: "2013-09-17T22:09:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/09/17/Playing-with-the-DetailsSummary-Tag
guid: 5041
---

<p>
One of the more interesting things I've found lately in HTML5 are features that replicate things developers have used JavaScript for in the past. For example, I love that you can do basic form validation with just HTML tags and attributes. Another one I've found recently is the &lt;details&gt; tag.
</p>

<p>
Both <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details">MDN</a> and the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-details-element">official spec</a> have this to say about the tag:
</p>

<blockquote>
The details element represents a disclosure widget from which the user can obtain additional information or controls.
</blockquote>

<p>
"Disclosure widget" - wtf is that? Turns out it makes a lot more sense if you actually see it. Here is an example of the widget:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss11.png" />
</p>

<p>
See the little arrow? Clicking it opens content beneath it:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss21.png" />
</p>

<p>
Simple enough, and as I said, I'm sure you've seen this done in JavaScript many times before. So how is it done with the details tag?
</p>

<pre><code class="language-markup">&lt;details&gt;
	&lt;summary&gt;This is the Title&lt;/summary&gt;
	&lt;p&gt;
	This is my content.
	&lt;/p&gt;
&lt;/details&gt;</code></pre>

<p>
Pretty simple, right? The complete content is wrapped within the details tag. The browser used the content in the summary tag as the title. That's it. In case you're curious, you can default the block to being open by adding an open attribute: <code class="language-markup">&lt;details open&gt;.</code> 

<div class="alert alert-info">
Notice that the mere presence of the open attribute will set the dialog to open at default. If you try to get fancy and use open="false", it still opens the dialog.
</div>

<p>
<strong>(Edit in Feb 2018 - I had to update some links here and you should note the text around this image is not out of date - support is pretty good!)</strong> So how well is this supported? Currently not terribly well:
</p>

![CanIUse](https://static.raymondcamden.com/images/2013/09/details.jpg)

<p>
On mobile, support is pretty good. On desktop, IE and Firefox are the big ones missing. But here's the great thing. When it "breaks", you still have the exact same content. Here is a screen shot from Firefox of the past example. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss31.png" />
</p>

<p>
Works perfectly well even when it doesn't work - which to me is a great thing. Here is a slightly more full example. I think a FAQ is a great way to make use of this tag. Instead of a huge page of content, you can use the summary tag for questions and the end user can choose which questions they want to display. I built the following by making use of my incredible design skills and some content from the PhoneGap FAQ:
</p>

<pre><code class="language-markup">&lt;style&gt;
	summary {
		font-weight: bold;
		font-size: 2em;
		font-family: 'adobe-clean','HelveticaNeue',Helvetica,Arial,sans-serif;
	}
	
	p {
		font-family: 'adobe-clean','HelveticaNeue',Helvetica,Arial,sans-serif;		
	}
	
	details {
		margin-bottom: 10px;	
	}
&lt;/style&gt;

&lt;details&gt;
	&lt;summary&gt;Q: What is PhoneGap?&lt;/summary&gt;
	&lt;p&gt;
	A: PhoneGap is an open source solution for building cross-platform mobile apps with standards-based Web technologies like HTML, JavaScript, CSS.
	&lt;/p&gt;
&lt;/details&gt;

&lt;details&gt;
	&lt;summary&gt;Q: How much does PhoneGap cost?&lt;/summary&gt;
	&lt;p&gt;
		A: PhoneGap is an open source implementation of open standards and FREE. That means developers and companies can use PhoneGap for mobile applications that are free, commercial, open source, or any combination of these.
	&lt;/p&gt;
&lt;/details&gt;

&lt;details&gt;
	&lt;summary&gt;Q: What is the difference between PhoneGap and Cordova?&lt;/summary&gt;
	&lt;p&gt;
	In October 2011, PhoneGap was donated to the Apache Software Foundation (ASF) under the name Apache Cordova. Through the ASF, future PhoneGap development will ensure open stewardship of the project. It will remain free and open source under the Apache License, Version 2.0.
	&lt;/p&gt;
	&lt;p&gt;
	PhoneGap is an open source distribution of Cordova. Think about Cordova&#x2019;s relationship to PhoneGap like WebKit&#x2019;s relationship to Safari or Chrome.
	&lt;/p&gt;
&lt;/details&gt;</code></pre>

<p>
You can run this code <a href="https://static.raymondcamden.com/demos/2013/sep/17/faq.html">here</a>, and as I said, no matter what browser you use you will be able to read the content. 
</p>

<p>
In the previous example I did a bit of styling to the textual content, but what about the "control", i.e. the arrow? StackOverflow <a href="http://stackoverflow.com/questions/6195329/how-can-you-hide-the-arrow-that-is-displayed-by-default-on-the-html5-details-e">came to the rescue</a> with this suggestion for styling the arrow (or in this case, hiding it):
</p>

<pre><code class="language-css">details summary::-webkit-details-marker { 
	display:none; 
}</code></pre>

<p>
I also didn't like the "focus" border around the summary so you can remove it too:
</p>

<pre><code class="language-css">details summary:focus {
	display: none;	
}</code></pre>

<p>
Finally - you may notice the there is no cursor change when you mouseover the arrow. You can fix that too:
</p>

<pre><code class="language-css">details summary {
	cursor:pointer;
	background-color: #0c9837;
}</code></pre>

<p>
If you want to see an example of this, check out my demo here: <a href="https://static.raymondcamden.com/demos/2013/sep/17/test2.html">https://static.raymondcamden.com/demos/2013/sep/17/test2.html</a> Forgive me for the color choices - I should have used Kuler.
</p>

<p>
So, what if you <i>do</i> want to use some JavaScript with the tags? I built a simple example that simply reports if the detail block is open or closed. Here is the complete template:
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;/title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;/head&gt;
	&lt;body&gt;
		
		&lt;details id=&quot;testDetails&quot;&gt;
			&lt;summary&gt;This is the Title&lt;/summary&gt;
			&lt;p&gt;
			This is my content.
			&lt;/p&gt;
		&lt;/details&gt;
		
		&lt;script&gt;
			document.addEventListener(&quot;DOMContentLoaded&quot;, init, false);
			
			var testD; 
			
			function init() {
				testD = document.querySelector(&quot;#testDetails&quot;);
				var summary = document.querySelector(&quot;#testDetails summary&quot;);

				summary.addEventListener(&quot;click&quot;, function(e) {
					var open = !testD.hasAttribute(&quot;open&quot;);
					console.log(open);
				}, false);
				
			}
		&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>
I assume most of this makes sense. I have pointers towards both the details block as a whole as well as the summary. On the actual click event, I see if the open attribute is present. I negate the value as - from what I can tell - the event fired <i>before</i> the detail block either opened or closed. You can run this yourself in my demo here: <a href="https://static.raymondcamden.com/demos/2013/sep/17/test3.html">https://static.raymondcamden.com/demos/2013/sep/17/test3.html</a>
</p>

<p>
Finally, I thought it would be kinda cool to add in support for delayed loading of the detail content. This demo is <i>not</i> very robust (it assumes a data-url attribute always) but it gives you an idea of how it could be done.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;/title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;script src=&quot;//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js&quot;&gt;&lt;/script&gt;		
	&lt;/head&gt;
	&lt;body&gt;
		
		&lt;details id=&quot;testDetails&quot; data-details=&quot;foo.html&quot;&gt;
			&lt;summary&gt;This is the Title&lt;/summary&gt;
		&lt;/details&gt;
		
		&lt;script&gt;
			var testD; 
			var loaded = false;
			
			$(document).ready(function() {
				
				testD = $(&quot;#testDetails&quot;);
				$(&quot;#testDetails summary&quot;).on(&quot;click&quot;, function(e) {
					var that = this;
					var open = !testD.attr(&quot;open&quot;);
					if(open &amp;&amp; !loaded) {
						/*
						Techincally we may NOT be loaded yet, but I only want the first one to start the request
						*/
						loaded = true;
						var url = testD.data(&quot;details&quot;);
						$.get(url).then(function(res) {
							$(that).after(res);
							console.dir(that);
						});
					}
				});
				
			});
		&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>
You can view this demo here: <a href="https://static.raymondcamden.com/demos/2013/sep/17/test4.html">https://static.raymondcamden.com/demos/2013/sep/17/test4.html</a>
</p>
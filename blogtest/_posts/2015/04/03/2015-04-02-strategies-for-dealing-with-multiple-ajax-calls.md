---
layout: post
title: "Strategies for dealing with multiple Ajax calls"
date: "2015-04-03T09:21:32+06:00"
categories: [development,javascript,jquery]
tags: []
banner_image: 
permalink: /2015/04/03/strategies-for-dealing-with-multiple-ajax-calls
guid: 5949
---

Let's consider a fairly trivial, but probably typical, Ajax-based application. I've got a series of buttons:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot1.png" alt="shot1" width="418" height="404" class="alignnone size-full wp-image-5950" style="border: solid black 1px" />

Each button, when clicked, hits a service on my application server and fetches some data. In my case, just a simple name:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot2.png" alt="shot2" width="418" height="404" class="alignnone size-full wp-image-5951" style="border: solid black 1px" />

<!--more-->

The code for this is rather simple. (And note - for the purposes of this blog entry I'm keeping things very simple and including my JavaScript in the HTML page. Please keep your HTML and JavaScript in different files!)

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;button data-prodid=&quot;1&quot; class=&quot;loadButton&quot;&gt;Load One&lt;&#x2F;button&gt;
&lt;button data-prodid=&quot;2&quot; class=&quot;loadButton&quot;&gt;Load Two&lt;&#x2F;button&gt;

&lt;div id=&quot;resultDiv&quot;&gt;&lt;&#x2F;div&gt;

&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script&gt;
$(document).ready(function() {
	$result = $(&quot;#resultDiv&quot;);
	
	$(&quot;.loadButton&quot;).on(&quot;click&quot;, function(e) {
		var thisId = $(this).data(&quot;prodid&quot;);
		console.log(&quot;going to load product id &quot;+thisId);
		$result.text(&quot;&quot;);
		$.getJSON(&quot;service.cfc?method=getData&quot;,{% raw %}{id:thisId}{% endraw %}, function(res) {
			console.log(&quot;back with &quot;+JSON.stringify(res));
			$result.text(&quot;Product &quot;+res.name);
		});
	});
});
&lt;&#x2F;script&gt;
&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

I assume this makes sense to everyone as it is pretty boiler-plate Ajax with jQuery, but if it doesn't, just chime in below in a comment. Ok, so this <i>works</i>, but we have a small problem. What happens in the user clicks both buttons at nearly the same time? Well, you would probably say the last one wins, right? But are you sure? What if something goes wrong (database gremlin - always blame the database) and the last hit is the <i>first</i> one to return?

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Untitled2.gif" alt="Untitled2" width="443" height="438" class="alignnone size-full wp-image-5952" />

What you can see (hopefully - still kinda new at making animated gifs) is that the user clicks the first button, then the second, and sees first the result from the second button and then the first one flashes in. 

Now to be fair, you could just blame the user. I'm <i>all</i> for blaming the user. But what are some ways we can prevent this from happening?

One strategy is to disable all the buttons that call this particular Ajax request until the request has completed. Let's look at that version.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;button data-prodid=&quot;1&quot; class=&quot;loadButton&quot;&gt;Load One&lt;&#x2F;button&gt;
&lt;button data-prodid=&quot;2&quot; class=&quot;loadButton&quot;&gt;Load Two&lt;&#x2F;button&gt;

&lt;div id=&quot;resultDiv&quot;&gt;&lt;&#x2F;div&gt;

&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script&gt;
$(document).ready(function() {
	$result = $(&quot;#resultDiv&quot;);
	
	$(&quot;.loadButton&quot;).on(&quot;click&quot;, function(e) {
		&#x2F;&#x2F;disable the rest
		$(&quot;.loadButton&quot;).attr(&quot;disabled&quot;,&quot;disabled&quot;);
		var thisId = $(this).data(&quot;prodid&quot;);
		console.log(&quot;going to load product id &quot;+thisId);
		$result.text(&quot;Loading info...&quot;);
		$.getJSON(&quot;service.cfc?method=getData&quot;,{% raw %}{id:thisId}{% endraw %}, function(res) {
			console.log(&quot;back with &quot;+JSON.stringify(res));
			$(&quot;.loadButton&quot;).removeAttr(&quot;disabled&quot;);
			$result.text(&quot;Product &quot;+res.name);
		});
	});
});
&lt;&#x2F;script&gt;
&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

I've added a simple call to disable all the buttons based on class. I then simple remove that attribute when the Ajax request is done. Furthermore, I also include some text to let the user know that - yes - something is happening - and maybe you should just calm the heck down and wait for it. The result makes it more obvious that something is happening and actively prevents the user from clicking the other buttons.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Untitled3.gif" alt="Untitled3" width="443" height="438" class="alignnone size-full wp-image-5953" />

Another strategy would be to actually kill the existing Ajax request. This is rather simple. The native XHR object has an abort method that will kill it, and jQuery's Ajax methods returns a wrapped XHR object that gives us access to the same method.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;button data-prodid=&quot;1&quot; class=&quot;loadButton&quot;&gt;Load One&lt;&#x2F;button&gt;
&lt;button data-prodid=&quot;2&quot; class=&quot;loadButton&quot;&gt;Load Two&lt;&#x2F;button&gt;

&lt;div id=&quot;resultDiv&quot;&gt;&lt;&#x2F;div&gt;

&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script&gt;

$(document).ready(function() {
	$result = $(&quot;#resultDiv&quot;);

	var xhr;
	var active=false;

	$(&quot;.loadButton&quot;).on(&quot;click&quot;, function(e) {
		var thisId = $(this).data(&quot;prodid&quot;);
		console.log(&quot;going to load product id &quot;+thisId);
		$result.text(&quot;Loading info...&quot;);
		
		if(active) {% raw %}{ console.log(&quot;killing active&quot;); xhr.abort(); }{% endraw %}
		active=true;
		xhr = $.getJSON(&quot;service.cfc?method=getData&quot;,{% raw %}{id:thisId}{% endraw %}, function(res) {
			console.log(&quot;back with &quot;+JSON.stringify(res));
			$result.text(&quot;Product &quot;+res.name);
			active=false;
		});
	});
});
&lt;&#x2F;script&gt;
&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

I use two variables, xhr and active, so that I can track active xhr requests. There are other ways to track the status of the XHR object - for example, via readyState - but a simple flag seemed to work best. Obviously you could do it differently but the main idea ("If active, kill it"), provides an alternative to the first method.

When using this, you can actually see the requests killed in dev tools:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Untitled4.gif" alt="Untitled4" width="750" height="567" class="alignnone size-full wp-image-5954" />

Any comments on this? How are you handling this yourself in your Ajax-based applications?

p.s. As a quick aside, <a href="http://remotesynthesis.com/">Brian Rinaldi</a> shared with me a cool little UI library that turns buttons themselves into loading indicators: <a href="http://lab.hakim.se/ladda/">Ladda</a>
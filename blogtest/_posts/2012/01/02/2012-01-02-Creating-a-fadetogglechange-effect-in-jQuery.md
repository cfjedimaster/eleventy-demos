---
layout: post
title: "Creating a fade/toggle/change effect in jQuery"
date: "2012-01-02T15:01:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2012/01/02/Creating-a-fadetogglechange-effect-in-jQuery
guid: 4477
---

While watching the Saints completely devastate the Panthers this weekend, I noticed something interesting in the "info ticker" (or whatever they call it) at the bottom of the screen. Whenever an important score occurred in one of the other games, there would be a "Score Alert". You would see the previous score, like ATL: 0, NO: 43, and the team that scored would fade in and out, repeat, and come back with the new score. It is a great way to highlight what changed. I thought I'd try to duplicate the effect in jQuery. I'm sure this has probably already been done (a lot), but I figured it would be a good excuse to write code on vacation. Here's what I did:

<p/>
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#score").fadeOut(800)
			   .fadeIn(800)
			   .fadeOut(800, function() {
					$(this).html("14");
					$(this).fadeIn(800);
				});
})
&lt;/script&gt;
&lt;style&gt;
.scoreVal {
	font-size: 40px;
	font-weight: bold;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="score" class="scoreVal"&gt;7&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

The template above has just one real part of the page, the score. When my page loads, I do a few animations. I fade out, in, out, and then change the value in the call back and fade it back in. Oddly, this did not work:

<p/>

<code>
$("something").fadeOut().fadeIn().fadeOut().html("14").fadeIn()
</code>

<p/>

When I tried it like this, the html() call happened immediately while the animations properly went in order. If anyone knows why, let me know, but the solution I used above worked well enough and was pretty simple. You can demo this version below:

<p/>

<a href="http://www.raymondcamden.com/demos/2012/jan/2/test1.html">http://www.raymondcamden.com/demos/2012/jan/2/test1.html</a>

<p/>

This worked, but if I wanted to run it multiple times, or perhaps configure the speed, it would be a lot of duplication. I decided to quickly turn it into a jQuery Plugin. I haven't done one of these in a while, so, I googled, found a doc, and - I'll admit it - did a bit of cut and paste. Here's the plugin:

<p/>

<code>
(function($) {
	
	$.fn.fadeChange = function(options) {

		var settings = $.extend({
	      'newVal'         : '',
	      'duration' : '800'
	    }, options);

		return this.each(function() {
			
			var $this = $(this);
			$this.fadeOut(settings.duration)
			   .fadeIn(settings.duration)
			   .fadeOut(settings.duration, function() {
					$this.html(settings.newVal);
					$this.fadeIn(settings.duration);
				});
		});
		
	};
	
})(jQuery);
</code>

<p/>

The plugin allows you to specify the new value and change the duration. If the duration is not specified, it will default to 800ms. Here's a new version demonstrating this.

<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="fadechange.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#score").fadeChange({% raw %}{newVal:24}{% endraw %});
	$("#score2").fadeChange({% raw %}{newVal:3,duration:1200}{% endraw %});
})
&lt;/script&gt;
&lt;style&gt;
.scoreVal {
	font-size: 40px;
	font-weight: bold;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

Saints: &lt;div id="score" class="scoreVal"&gt;7&lt;/div&gt;
Cantlanta Falcons: &lt;div id="score2" class="scoreVal"&gt;0&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

You can demo this version by clicking the big button below. 

<p/>


<a href="http://www.raymondcamden.com/demos/2012/jan/2/test2.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
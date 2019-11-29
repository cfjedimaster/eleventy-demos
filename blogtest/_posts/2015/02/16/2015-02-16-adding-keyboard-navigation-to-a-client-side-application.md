---
layout: post
title: "Adding keyboard navigation to a client-side application"
date: "2015-02-16T15:24:09+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2015/02/16/adding-keyboard-navigation-to-a-client-side-application
guid: 5694
---

Ok, so warning, this isn't exactly rocket science level JavaScript here. For a while now I've been wanting to build a simple demo of adding keyboard navigation to a client-side application and today I finally got off my lazy rear and wrote one up. As I said, this isn't exactly difficult to do, but I thought it might be helpful for others to see a simple example of how it can be used.

<!--more-->

To begin, I create an incredibly simple slide show demo. I began by simply defining slides in div tags:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;link type=&quot;text&#x2F;css&quot; rel=&quot;stylesheet&quot; href=&quot;app.css&quot;&gt;&lt;&#x2F;link&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;div id=&quot;slideshow&quot; class=&quot;slideshow&quot;&gt;
	&lt;h2&gt;Slides&lt;&#x2F;h2&gt;
    &lt;div&gt;
        Slide one
    &lt;&#x2F;div&gt;
    &lt;div&gt;
        Slide two
    &lt;&#x2F;div&gt;
    &lt;div&gt;
        Slide three
    &lt;&#x2F;div&gt;
	&lt;p&gt;
	&lt;a id=&quot;prevLink&quot; href=&quot;&quot;&gt;Previous&lt;&#x2F;a&gt; &#x2F; &lt;a id=&quot;nextLink&quot; href=&quot;&quot;&gt;Next&lt;&#x2F;a&gt;
	&lt;&#x2F;p&gt;
&lt;&#x2F;div&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

I used a bit of CSS to hide the divs initially: 

<pre><code class="language-css">.slideshow div {
	display:none;
}</code></pre>

And super simple JavaScript to handle responding to the Previous/Next clicks:

<pre><code class="language-javascript">$(document).ready(function() {
	&quot;use strict&quot;;
	
	&#x2F;&#x2F;first, cache the div holding our slide show
	var $slideshow = $(&quot;#slideshow&quot;);
	
	&#x2F;&#x2F;now, let&#x27;s get our slides, represented by divs
	var $slides = $(&quot;div&quot;, $slideshow);

	&#x2F;&#x2F;current slide
	var currentSlide = 0;
	&#x2F;&#x2F;max
	var maxSlides = $slides.length;
	
	&#x2F;&#x2F;now, show the first one
	$slides.eq(0).show();
	
	&#x2F;&#x2F;respond to clicks on the links
	$(&quot;#nextLink&quot;).on(&quot;click&quot;, function(e) {
		e.preventDefault();
		if(currentSlide+1 === maxSlides) return false;
		$slides.eq(currentSlide).hide();
		currentSlide++;
		$slides.eq(currentSlide).show();
	});

	$(&quot;#prevLink&quot;).on(&quot;click&quot;, function(e) {
		e.preventDefault();
		if(currentSlide === 0) return false;
		$slides.eq(currentSlide).hide();
		currentSlide--;
		$slides.eq(currentSlide).show();
	});

});</code></pre>

Just to be absolutely clear, there are approximately 932 thousand jQuery plugins out there that handle slide shows better than this. I just wanted something simple to start off. (And I was spurred to finally write this post after looking at someone's slide deck embedded in a web page recently.) Since it is simple, I assume the code all makes sense so far. (If not, ask me in the comments below and I'll explain anything that isn't clear.)

Ok, so, how can we add keyboard navigation? The simplest way is to listen for a keyboard related events. There's keydown, keypress, and keyup. Keyup "felt" appropriate to me so I used that. Since we want to respond to the event at the page level, I added my listener to the document object. (Would window have been more appropriate? Let me know below.)

<pre><code class="language-javascript">$(document).on("keyup", function(e) {

});</code></pre>

The next step is to respond intelligently to the event. What keys you care about depends on what you're building. For a slide show, it seemed to make sense to respond to the left and right arrows and move the current slide accordingly. (Maybe an up arrow could be used to return to slide 1 and down to the end.) All I had to do then was figure out <i>what</i> key code represented those values. According to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">MDN docs</a> for keyboard events, keyCode is deprecated and key should be used instead, but in my testing, key did not work in Chrome and keyCode worked in both Chrome and Firefox. Instead of Googling for a table of keyCode values, I quickly added a console.log and just typed left and right. This gave me a value of 37 for the left arrow and 39 for the right.

To make those work, I needed to decouple my "go back" and "go forward" code from the event handlers I had used before. Here is how I did that:

<pre><code class="language-javascript">function prevSlide() {
	if(currentSlide === 0) return false;
	$slides.eq(currentSlide).hide();
	currentSlide--;
	$slides.eq(currentSlide).show();		
}
	
function nextSlide() {
	if(currentSlide+1 === maxSlides) return false;
	$slides.eq(currentSlide).hide();
	currentSlide++;
	$slides.eq(currentSlide).show();		
}
	
&#x2F;&#x2F;respond to clicks on the links
$(&quot;#nextLink&quot;).on(&quot;click&quot;, function(e) {
	e.preventDefault();
	nextSlide();
});

$(&quot;#prevLink&quot;).on(&quot;click&quot;, function(e) {
	e.preventDefault();
	prevSlide();
});</code></pre>

And then I simply added calls to these new functions within my keyboard listening code.

<pre><code class="language-javascript">	&#x2F;&#x2F;listen for keyboard events
$(document).on(&quot;keyup&quot;, function(e) {
	if(e.keyCode === 37) {
		prevSlide();
	} else if(e.keyCode === 39) {
		nextSlide();
	}

});</code></pre>

This <i>seems</i> to work well, and is relatively simple, but I haven't tested with Internet Explorer yet. Want to take it for a spin? Hit up the demo here: <a href="https://static.raymondcamden.com/demos/2015/feb/16/test2.html">https://static.raymondcamden.com/demos/2015/feb/16/test2.html</a>.
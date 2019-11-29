---
layout: post
title: "Syncing Edge Animate with Window Scroll"
date: "2014-09-29T08:09:00+06:00"
categories: [design,development,javascript]
tags: []
banner_image: 
permalink: /2014/09/29/syncing-edge-animate-with-window-scroll
guid: 5319
---

<p>
Recently I've come across a few sites that will tie window scrolling with animation. When used in a subtle, small fashion, this is kind of cool. When used to change large portions of the view or really screw with scrolling, I detect it. Like most things, it all comes down to how you use it I suppose. But I was thinking recently - how can we do this with Edge Animate? Turns out it is rather simple.
</p>
<!--more-->
<p>
I began by creating a simple animation of a box moving from left to right. That is - unfortunately - the best I can design. Don't blame Edge Animate. Blame me. Next, I disabled autoplay for the animation. If you can't find this, be sure the Stage is selected and uncheck the box.
</p>

<p>
<img src="https://static.raymondcamden.com/images/sho11.png" />
</p>

<p>
With autoplay turned off, I then figured out what I needed to do to tie scrolling to animation.
</p>

<ul>
<li>First, I need to ensure the animation stays visible.
<li>Second, I need to detect a scroll event.
<li>Third, I then need to figure out how much the person has scrolled against the total amount they <i>can</i> scroll. Basically, what percentage?
<li>Finally, I need to set the animation's current position to that percentage.
</ul>

<p>
Let's break this down. I began by working in the animation's creationComplete event. I added an onscroll event first.
</p>


<pre><code class="language-javascript">window.onscroll = function(e) {
    var perc = getScrollPerc();
    var animPos = (perc/100) * animSize;
    sym.stop(animPos);
}
</code></pre>

<p>
So, the first thing I do is get the scrolled percentage. That comes from this function:
</p>


<pre><code class="language-javascript">//scroll perc - http://www.sitepoint.com/jquery-capture-vertical-scroll-percentage/
	  function getScrollPerc() {
		var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
		return (wintop/(docheight-winheight))*100;
	  }
</code></pre>

<p>
Thankfully Sam Deering had figured this out for me already and posted it <a href="http://www.sitepoint.com/jquery-capture-vertical-scroll-percentage/">here</a>.  Next, I figured out where I was, percentage wise, in my animation's timeline. The value animSize is simply the size (timewise) of my animation:
</p>


<pre><code class="language-javascript">var animSize = sym.getDuration();</code></pre>

<p>
Finally, that last line is what moves the animation to a specific point. I was stuck on this for a while as the <a href="http://www.adobe.com/devnet-docs/edgeanimate/api/current/index.html">JavaScript API</a> for Edge Animate does not specifically call out how to do this. My coworker <a href="https://twitter.com/elainefinnell">Elaine Finnell</a> pointed out that the stop() method lets you move to a particular position. This is documented but I had not even considered looking at stop() as an option!
</p>

<p>
This worked great, but I wanted to add one more thing. If I had scrolled down a bit on my test page and reloaded, I wanted the application to recognize this on load and animate accordingly. I added some code to run <i>immediately</i> on load:
</p>


<pre><code class="language-javascript">//handle initial scroll
if(getScrollPerc() > 0) {
	  console.log('do initial move');
	  var perc = getScrollPerc();
 	  var animPos = (perc/100) * animSize;
	  //timeout is from bugs with the DOM not being 100% ready
	  setTimeout(function() {% raw %}{ sym.stop(animPos);}{% endraw %}, 0);
}
</code></pre>

<p>
Basically this is a repeat of my other code, which is kinda bad, but notice the setTimeout. Edge Animate has a bug - or quirk - with working with the DOM in creationComplete. I've run into this before and setTimeout, while lame, works around it. Here is my creationComplete code then as a whole.

<pre><code class="language-javascript">(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; &#x2F;&#x2F; aliases for commonly used Edge classes

   &#x2F;&#x2F;Edge symbol: &#x27;stage&#x27;
   (function(symbolName) {
      
      &#x2F;&#x2F;scroll perc - http:&#x2F;&#x2F;www.sitepoint.com&#x2F;jquery-capture-vertical-scroll-percentage&#x2F;
	  function getScrollPerc() {
		var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
		return (wintop&#x2F;(docheight-winheight))*100;
	  }
	  	   
      Symbol.bindSymbolAction(compId, symbolName, &quot;creationComplete&quot;, function(sym, e) {
		  
		  var animSize = sym.getDuration();

		  &#x2F;&#x2F;handle initial scroll
		  if(getScrollPerc() &gt; 0) {
			  console.log(&#x27;do initial move&#x27;);
			  var perc = getScrollPerc();
 			  var animPos = (perc&#x2F;100) * animSize;
			  &#x2F;&#x2F;timeout is from bugs with the DOM not being 100% ready
			  setTimeout(function() {% raw %}{ sym.stop(animPos);}{% endraw %}, 0);
		  }
		  
		  window.onscroll = function(e) {
			  var perc = getScrollPerc();
 			  var animPos = (perc&#x2F;100) * animSize;
			  sym.stop(animPos);
		  }
		  

      });
      &#x2F;&#x2F;Edge binding end

   })(&quot;stage&quot;);
   &#x2F;&#x2F;Edge symbol end:&#x27;stage&#x27;

})(jQuery, AdobeEdge, &quot;EDGE-257179350&quot;);</code></pre>

<p>
And it works awesome! Well, to me anyway. Check it out here: <a href="https://static.raymondcamden.com/demos/2014/sep/29/stickandscroll/Untitled-2.html">https://static.raymondcamden.com/demos/2014/sep/29/stickandscroll/Untitled-2.html</a>.
</p>

<p>
Of course, that's my ugly version. Imagine if someone with some decent design skills tried it. Elaine did so - and with help from other Adobians (<a href="https://twitter.com/mvujovic">Max Vujovic</a> and
 <a href="https://twitter.com/bemjb">Bem Jones-Bey</a>) came up with this <i>much</i> cooler version: <a href="https://static.raymondcamden.com/demos/2014/sep/29/elainesample/scroll.html">https://static.raymondcamden.com/demos/2014/sep/29/elainesample/scroll.html</a>. Check it out!
</p>
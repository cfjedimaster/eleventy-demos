---
layout: post
title: "Delaying an Edge Animate asset until visible - Part 4"
date: "2013-12-06T09:12:00+06:00"
categories: [design,html5,javascript]
tags: []
banner_image: 
permalink: /2013/12/06/Delaying-an-Edge-Animate-asset-until-visible-Part-4
guid: 5093
---

<p>
Welcome to the <b>final</b> blog post on delaying Edge Animate animations. I'm saying final just because I can't believe how such a simple thing has turned into so many different blog posts, so many different variations, and so many different fun diversions. Most likely because I said this will be the final post, someone will discover some other interesting opportunity and I'll have to write a part 5. But hey - that's the fun part about being a developer, right? Before we start though, please be sure you've read the earlier posts. I'll link to them at the bottom.
</p>
<!--more-->
<p>
I had an interesting discussion with Felix in the comments on my <a href="http://www.raymondcamden.com/index.cfm/2013/7/11/Delaying-an-Edge-Animate-asset-until-visible--Part-2">second blog entry</a> on this topic. He discovered an interesting bug. If the animation was scrolled into view, it would play. If the animation completed, and you scrolled it a bit, but just a tiny bit so it never left the view, it would start over. 
</p>

<p>
The issue was simple. My code didn't know that the asset had stayed visible during the scroll event. To fix this, I simply keep track of the asset becoming visible.
</p>

<pre><code class="language-javascript">&#x2F;***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with &#x27;Edge&#x27; to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************&#x2F;
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; &#x2F;&#x2F; aliases for commonly used Edge classes

   &#x2F;&#x2F;Edge symbol: &#x27;stage&#x27;
   (function(symbolName) {
      
      
      Symbol.bindSymbolAction(compId, symbolName, &quot;creationComplete&quot;, function(sym, e) {
         &#x2F;&#x2F; insert code to be run when the symbol is created here
		var wasHidden = true;

		&#x2F;&#x2F;http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;488073&#x2F;52160
		function isScrolledIntoView(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();

			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();
	
			return ((elemBottom &gt;= docViewTop) &amp;&amp; (elemTop &lt;= docViewBottom)
			  &amp;&amp; (elemBottom &lt;= docViewBottom) &amp;&amp;  (elemTop &gt;= docViewTop) );
		}		  
		
		&#x2F;&#x2F;Immedidately see if visible
		if(isScrolledIntoView(sym.element)) {
			console.log(&#x27;on load vis&#x27;);
			wasHidden=false;
			sym.play();
		}
		  
		function doStart() {
            if(isScrolledIntoView(sym.element)) {
				if(wasHidden) {
					console.log(&#x27;Start me up&#x27;);	
					sym.play();
				}
				wasHidden = false;
            } else {
                console.log(&#x27;stop&#x27;);
                sym.stop();
				wasHidden = true;
            }
            
		}
		  
        $(window).on(&quot;scroll&quot;, doStart);
        

      });
      &#x2F;&#x2F;Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, &quot;Default Timeline&quot;, &quot;complete&quot;, function(sym, e) {
         &#x2F;&#x2F;sym.play(&quot;Loop&quot;)

      });
      &#x2F;&#x2F;Edge binding end

   })(&quot;stage&quot;);
   &#x2F;&#x2F;Edge symbol end:&#x27;stage&#x27;

})(jQuery, AdobeEdge, &quot;EDGE-62515662&quot;);</code></pre>

<p>
If you've read the other posts then most of this should make sense already. To see this in action try the demo below.
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2013/dec/4/Untitled-1.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>   
</p>
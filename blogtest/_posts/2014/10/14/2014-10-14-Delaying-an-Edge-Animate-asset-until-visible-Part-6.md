---
layout: post
title: "Delaying an Edge Animate asset until visible - Part 6"
date: "2014-10-14T17:10:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/10/14/Delaying-an-Edge-Animate-asset-until-visible-Part-6
guid: 5333
---

<p>
Welcome back to the thread that won't die. I've blogged (see related links below) about this topic six times now. It started off as something simple - making an Edge Animate animation wait to run until visible - but it has turned into a pretty complex set of entries discussing not only how to do it but alternatives and other modifications. Today's entry is rather simple though as it just covers updates for the October 2014 release of Edge Animate.
</p>
<!--more-->
<p>
Reader @jdesi posted a <a href="http://www.raymondcamden.com/2013/4/3/Delaying-an-Edge-Animate-asset-until-visible#c9FBA8DC2-F548-DC59-EDC16C433355BF07">comment</a> this morning about an issue he was having with my code in the latest release of Edge Animate. (You can read details about that update here: <a href="http://blogs.adobe.com/edge/2014/10/06/the-new-edge-animate-is-here/">Edge Animate reduces runtime size by 55%, "Save to Custom Folders" feature, new Preloader options, and more!</a>) I did some digging and discovered a few different issues with my code.
</p>

<div class="alert alert-success">
Before I go any further, please note that I worked on a modified form of the <strong>first</strong> demo I built for this feature. My later entries in this thread made the behavior a bit more complex. I'm assuming people can apply the updates I describe below to those versions as well.
</div>

<p>
The first thing I discovered is that jQuery is no longer included by default in the HTML template. This is discussed in the blog entry I linked to above and while I could have certainly worked around needing jQuery, it was simpler to just add it back in. I did so in the index.html file and included it <strong>before</strong> the Edge JavaScript include.
</p>

<p>
The next thing I noticed was that <code>sym.element</code> wasn't available. I checked the (updated) <a href="http://www.adobe.com/devnet-docs/edgeanimate/api/current/index.html#Use_symbol_elements">JavaScript API</a> and saw that a new API existed: <code>sym.getSymbolElement</code>
</p>

<p>
The next change was a bit more subtle (but still documented!) - the element will now be wrapped in jQuery, <strong>if</strong> you have included it. From the docs:
</p>

<p>
"Note: If you have added jQuery as an external dependency in the Edge Composition, then sym.getSymbolElement() will return a jQuery wrapper, as AdobeEdge.$ gets redefined to jQuery in such cases. You can use any of the jQuery APIs on the result in this case."
</p>

<p>
So with that being the case, the method I wrote to check if the element was in view was able to remove the $ wrappers. Here is the updated version of the code.
</p>

<pre><code class="language-javascript">      Symbol.bindSymbolAction(compId, symbolName, &quot;creationComplete&quot;, function(sym, e) {

		function isScrolledIntoView(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();

			var elemTop = elem.offset().top;
			var elemBottom = elemTop + elem.height();
		
			return ((elemBottom &gt;= docViewTop) &amp;&amp; (elemTop &lt;= docViewBottom)
			  &amp;&amp; (elemBottom &lt;= docViewBottom) &amp;&amp;  (elemTop &gt;= docViewTop) );
		}		  

		var element = sym.getSymbolElement();
		if(isScrolledIntoView(element)) {
			sym.play(0) 
		} else {
			$(window).on(&quot;scroll&quot;, function(e) {
				if(isScrolledIntoView(element)) {
					console.log(&#x27;Start me up&#x27;);	
					sym.play(0);
					$(window).off(&quot;scroll&quot;);
				}
			});
			
		}
		  
		  
      });
</code></pre>

<p>
You can test this version here: <a href="http://www.raymondcamden.com/demos/2014/oct/14/test.html">http://www.raymondcamden.com/demos/2014/oct/14/test.html</a>. As a reminder, this one won't pause if you scroll out and won't restart if you scroll back in. That's covered by later versions of my demo and can be used if you simply apply the fixes described here to them. Enjoy!
</p>
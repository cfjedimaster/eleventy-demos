---
layout: post
title: "Want help with Snap.svg? (And a few more examples...)"
date: "2013-11-06T15:11:00+06:00"
categories: [design,development,javascript]
tags: []
banner_image: 
permalink: /2013/11/06/Want-help-with-Snapsvg-And-a-few-more-examples
guid: 5080
---

<p>
Just a quick note that if you are digging <a href="http://www.snapsvg.io">Snap.svg</a> and want some support, you can post to the Google group that was set up: <a href="https://groups.google.com/forum/#!forum/snapsvg">https://groups.google.com/forum/#!forum/snapsvg</a>.
</p>

<p>
Obviously you can ask me as well (grin), and in fact, someone on the group already asked for a few small examples that I thought I'd share here. Nothing too exciting, but here we go.
</p>
<!--more-->
<p>
First - I was asked about how to handle click events using Snap.svg. Snap.svg provides a click handler for your fragments (think parts of your SVG) that makes this easy.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;Ray1&lt;&#x2F;title&gt;
        &lt;script src=&quot;snap.svg-min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
			window.onload = function () {
            	var s = Snap(&quot;100%&quot;, 600);
				Snap.load(&quot;first.svg&quot;, function(f) {
					
					redSomething = f.select(&quot;#red&quot;);

					redSomething.click(function() {
						console.log(&quot;You clicked the red thing!&quot;);	
					});
					
					s.append(f);
				});
				
			};
		
		&lt;&#x2F;script&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;
		
		&lt;div id=&quot;graphic&quot;&gt;&lt;&#x2F;div&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
You can run a demo of this here: <a href="http://www.raymondcamden.com/demos/2013/nov/1/test.html">http://www.raymondcamden.com/demos/2013/nov/1/test.html</a>. Be sure to open your console of course and click the red thing. Thrilling.
</p>

<p>
Next I was asked to make the fragment animate to half its size.  Animating a size difference is pretty easy too:
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;Ray1&lt;&#x2F;title&gt;
        &lt;script src=&quot;snap.svg-min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
			window.onload = function () {
            	var s = Snap(&quot;100%&quot;, 600);
				Snap.load(&quot;first.svg&quot;, function(f) {
					
					redSomething = f.select(&quot;#red&quot;);

					redSomething.click(function() {
						console.dir(redSomething);
						var width = redSomething.attr(&quot;width&quot;);
						var height = redSomething.attr(&quot;height&quot;);
						redSomething.animate({% raw %}{width:width&#x2F;2,height:height&#x2F;2}{% endraw %}, 2000);
					});
					
					s.append(f);
				});
				
			};
		
		&lt;&#x2F;script&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;
		
		&lt;div id=&quot;graphic&quot;&gt;&lt;&#x2F;div&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
Again, not terribly thrilling, but easy to do. You can try this yourself here: <a href="http://www.raymondcamden.com/demos/2013/nov/1/test2.html">http://www.raymondcamden.com/demos/2013/nov/1/test2.html</a>.
</p>

<p>
For something that <i>is</i> thrilling, check out this article on animating icons with Snap.svg: <a href="http://tympanus.net/codrops/2013/11/05/animated-svg-icons-with-snap-svg/">Animated SVG Icons with Snap.svg</a>. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_11_6_13__2_22_PM.jpg" />
</p>
---
layout: post
title: "Creating simple comparative bars with JavaScript and CSS"
date: "2015-03-19T09:27:30+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2015/03/19/creating-simple-comparative-bars-with-javascript-and-css
guid: 5839
---

Back a few months ago I <a href="http://www.raymondcamden.com/2014/12/07/quick-review-of-sumall-com">reviewed</a> the excellent <a href="http://sumall.com">SumAll</a> service. One of the cooler parts of their service is a daily/weekly email summary of your stats. Here is a screen shot from my email this morning.

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot11.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot11.png" alt="shot1" width="800" height="926" class="alignnone size-full wp-image-5840" /></a>

What I like about this are the simple bars between each number. They give you a real quick way to see your relative growth/drop from one day to the next. Like any good web developer, I was curious as to how they built this, so I right clicked, selected Inspect Element, and took a look at the code.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot21.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot21.png" alt="shot2" width="800" height="726" class="alignnone size-full wp-image-5841" /></a>

So - first off - there's a <i>lot</i> of markup to make this work. That isn't because the SumAll developers suck, it's simply  a matter of life when dealing with HTML email. But the base mechanism isn't that difficult - a simple div with CSS. Obviously you could use one of the hundred or so different JS charting libraries out there, or Canvas, but why do all that when a bit of CSS is all you need.

I thought it would be interesting to try to replicate the look for a web page outside of email where I could use JavaScript to make it more dynamic. I began by creating a simple HTML page to represent a particular metric - the number of page views from last week and this week.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;h2&gt;Scores&lt;&#x2F;h2&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;&lt;&#x2F;th&gt;
		&lt;th&gt;Last Week&lt;&#x2F;th&gt;
		&lt;th&gt;&lt;&#x2F;th&gt;
		&lt;th&gt;This Week&lt;&#x2F;th&gt;
	&lt;&#x2F;tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Page Views&lt;&#x2F;td&gt;
		&lt;td&gt;&lt;span id=&quot;pageviews_lw&quot; data-raw=&quot;490121&quot;&gt;490K&lt;&#x2F;span&gt;&lt;&#x2F;td&gt;
		&lt;td&gt;&lt;span id=&quot;dobar&quot;&gt;&lt;&#x2F;span&gt;&lt;&#x2F;td&gt;
		&lt;td&gt;&lt;span id=&quot;pageviews_tw&quot; data-raw=&quot;361902&quot;&gt;362K&lt;&#x2F;span&gt;&lt;&#x2F;td&gt;
	&lt;&#x2F;tr&gt;
&lt;&#x2F;table&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

There isn't anything particularly special about this layout, but note that I'm using a formatted number (490K) versus the real number (490121). I wanted it to be simpler to read for the end user. However, I know I'm going to need the real number, so I embed it in the HTML using a data property. (Off topic aside - but I freaking love data attributes. So simple, so <i>practical</i>!) 

You can view this version of the page here: <a href="http://www.raymondcamden.com/demos/2015/mar/19/test1.html">http://www.raymondcamden.com/demos/2015/mar/19/test1.html</a>. Before we go any further - please actually view that link. It isn't pretty, but guess what? It works in every single browser known to humankind. Everything I do from now on will simply <i>enhance</i> the experience for people with JavaScript and more modern browsers. That's something we should all consider when adding interactivity/fancy UI/etc to our pages! (And to be fair, I'm guilty of not doing proper progressive enhancement as well.)

Ok, so let's build the next version. I began by modifying the <code>dobar</code> span to include a table to hold my bars. That may not be necessary, but I was mimicking what SumAll had built. I also included the CSS for each bar minus the portion that determined the height and the color. SumAll used black for the left side only, but I decided to use black for the 100% value and a different color for the other one. That just made more sense to me. This is the new HTML for the span:

<pre><code class="language-markup">&lt;span id=&quot;dobar&quot;&gt;

	&lt;table&gt;&lt;tr style=&quot;vertical-align:bottom&quot;&gt;
		&lt;td&gt;
			&lt;div style=&quot;margin-right:3px!important;width:4px;&quot;&gt;&amp;nbsp;&lt;&#x2F;div&gt;
		&lt;&#x2F;td&gt;&lt;td&gt;
			&lt;div style=&quot;margin-right:3px!important;width:4px;&quot;&gt;&amp;nbsp;&lt;&#x2F;div&gt;
		&lt;&#x2F;td&gt;
	&lt;&#x2F;tr&gt;&lt;&#x2F;table&gt;
&lt;&#x2F;span&gt;</code></pre>
 
And now let's look at the JavaScript.

<pre><code class="language-javascript">var BIG_COLOR = &quot;#000&quot;;
var SMALL_COLOR = &quot;#3cb4e7&quot;;

$(document).ready(function() {
	
	&#x2F;&#x2F;get our numbers
	var pv_lw = $(&quot;#pageviews_lw&quot;).data(&quot;raw&quot;);
	var pv_tw = $(&quot;#pageviews_tw&quot;).data(&quot;raw&quot;);
	
	var biggest = Math.max(pv_lw, pv_tw);
	var smallest = Math.min(pv_lw, pv_tw);
	&#x2F;&#x2F;so what perc of biggest is smallest?
	
	var perc = Math.floor((smallest &#x2F; biggest)*100);
	&#x2F;&#x2F;so biggest uses 30, perc determines other
	var smallerBar = Math.floor((perc&#x2F;100)*30);
	
	&#x2F;&#x2F;do left side
	var css_lw, css_nw;
	if(pv_lw == biggest) {
		css_lw = &quot;30px solid &quot;+BIG_COLOR;
		css_nw = smallerBar+&quot;px solid &quot;+SMALL_COLOR;
	} else {
		css_nw = &quot;30px solid &quot;+BIG_COLOR;
		css_lw = smallerBar+&quot;px solid &quot;+SMALL_COLOR;		
	}

	$(&quot;span#dobar td:first-child div&quot;).css(&quot;border-top&quot;, css_lw);
	$(&quot;span#dobar td:last-child div&quot;).css(&quot;border-top&quot;, css_nw);

});</code></pre>

So really - it just comes down to math. Figure out the highest value, then the percentage difference for the other value. I used "30" to represent the highest bar so the other bar is a percentage of that. Then it is a simple matter of updating the CSS. Let me quickly thank <a href="http://iandevlin.com/">Ian Devlin</a> for his help finding a rookie mistake I made using jQuery.css. I had included a semicolon in the CSS value which totally broke the update. I'm sure I'll never make that mistake again.

Here's a screen shot of the result:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot31.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot31.png" alt="shot3" width="400" height="150" class="alignnone size-full wp-image-5842" /></a>

You can see this version in all its glory here: <a href="http://www.raymondcamden.com/demos/2015/mar/19/test2.html">http://www.raymondcamden.com/demos/2015/mar/19/test2.html</a>

So not rocket science, but nice I think. For the hell of it, and because I'm easily amused, I made a third version. I added some range fields to the bottom of the page:

<pre><code class="language-markup">&lt;p&gt;
Last Week: 0 &lt;input type=&quot;range&quot; min=&quot;0&quot; max=&quot;200&quot; value=&quot;99&quot; id=&quot;leftRange&quot;&gt; 200&lt;br&#x2F;&gt;
This Week: 0 &lt;input type=&quot;range&quot; min=&quot;0&quot; max=&quot;200&quot; value=&quot;32&quot; id=&quot;rightRange&quot;&gt; 200&lt;br&#x2F;&gt;
&lt;&#x2F;p&gt;</code></pre>

I was kinda surprised by how well these are supported now (<a href="http://caniuse.com/#feat=input-range">CanIUse data</a>) but as this version is just for fun, I don't really care about what happens in older browsers. I then wrote a simple event listener for change on them and had them update the data when used.

<pre><code class="language-javascript">var BIG_COLOR = &quot;#000&quot;;
var SMALL_COLOR = &quot;#3cb4e7&quot;;

function renderBar() {
	&#x2F;&#x2F;get our numbers
	var pv_lw = $(&quot;#pageviews_lw&quot;).data(&quot;raw&quot;);
	var pv_tw = $(&quot;#pageviews_tw&quot;).data(&quot;raw&quot;);

	var biggest = Math.max(pv_lw, pv_tw);
	var smallest = Math.min(pv_lw, pv_tw);
	&#x2F;&#x2F;so what perc of biggest is smallest?
	
	var perc = Math.floor((smallest &#x2F; biggest)*100);
	&#x2F;&#x2F;so biggest uses 30, perc determines other
	var smallerBar = Math.floor((perc&#x2F;100)*30);
	
	var css_lw, css_nw;
	if(pv_lw == biggest) {
		css_lw = &quot;30px solid &quot;+BIG_COLOR;
		css_nw = smallerBar+&quot;px solid &quot;+SMALL_COLOR;
	} else {
		css_nw = &quot;30px solid &quot;+BIG_COLOR;
		css_lw = smallerBar+&quot;px solid &quot;+SMALL_COLOR;		
	}
	
	$(&quot;span#dobar td:first-child div&quot;).css(&quot;border-top&quot;, css_lw);
	$(&quot;span#dobar td:last-child div&quot;).css(&quot;border-top&quot;, css_nw);
};

$(document).ready(function() {

	renderBar();

	var $leftRange = $(&quot;#leftRange&quot;);
	var $rightRange = $(&quot;#rightRange&quot;);
	var $leftSpan = $(&quot;#pageviews_lw&quot;);
	var $rightSpan = $(&quot;#pageviews_tw&quot;);
	
	$(&quot;input[type=range]&quot;).on(&quot;input&quot;, function(e) {
		$leftSpan.text($leftRange.val());
		$leftSpan.data(&quot;raw&quot;, $leftRange.val());
		$rightSpan.text($rightRange.val());
		$rightSpan.data(&quot;raw&quot;, $rightRange.val());
		renderBar();
	});
	
});</code></pre>

You can then play around with the data and see the bars go up and down. Because... I don't know. It's fun.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot41.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot41.png" alt="shot4" width="400" height="232" class="alignnone size-full wp-image-5843" /></a>

You can test this version here: <a href="http://www.raymondcamden.com/demos/2015/mar/19/test3.html">http://www.raymondcamden.com/demos/2015/mar/19/test3.html</a>
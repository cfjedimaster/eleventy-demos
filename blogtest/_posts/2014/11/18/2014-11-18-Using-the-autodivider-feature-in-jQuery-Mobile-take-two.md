---
layout: post
title: "Using the autodivider feature in jQuery Mobile (take two)"
date: "2014-11-18T16:11:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2014/11/18/Using-the-autodivider-feature-in-jQuery-Mobile-take-two
guid: 5352
---

<p>
Almost a year ago I <a href="http://www.raymondcamden.com/2013/12/17/Using-the-autodivider-feature-in-jQuery-Mobile">blogged</a> about using the autodivider feature in jQuery Mobile. This is a simple feature that enhances list views with dividers. It makes content a bit easier to parse when working with a large list. 
</p>

<p>
One of my readers, Fher (who has a cool name - I kind of imagine her/him as a fire-breathing wolf), asked if there was a way to add a bubble count to the dividers. You can see an example of this on the <a href="http://api.jquerymobile.com/listview/">docs for listview</a>, but this is what the feature looks like:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot20.png" />
</p>

<p>
So, the short answer is no, you can't do this with autodividers. Why? While the feature allows you to build a function to create dynamic dividers, it only lets you specify the <i>text</i> for the divider, not random HTML. However, if you are willing to give up having the "pretty bubble" effect, you can simply use it as part of the label. To make that work, I modified my code a bit from the previous demo (and again, you can read that <a href="http://www.raymondcamden.com/2013/12/17/Using-the-autodivider-feature-in-jQuery-Mobile">here</a>, I'd suggest checking it out just so you can see the context). Here is the complete JavaScript code. (The HTML didn't change.)
</p>

<pre><code class="language-javascript">$(document).ready(function() {

	var dates = [
		&quot;12&#x2F;16&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;16&#x2F;2013 14:00:00&quot;,		
		&quot;12&#x2F;17&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;18&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;19&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;19&#x2F;2013 16:00:00&quot;
	];

	var dateList = $(&quot;#dates&quot;);
	for(var i=0, len=dates.length; i&lt;len; i++) {
		dateList.append(&quot;&lt;li&gt;&quot;+dates[i]+&quot;&lt;&#x2F;li&gt;&quot;);	
	}

	&#x2F;*
	Create a generic func to return the label
	*&#x2F;
	var getLabel = function(d) {
		return (d.getMonth()+1)+ &quot;&#x2F;&quot; + d.getDate() + &quot;&#x2F;&quot; + d.getFullYear();
	}
			
	&#x2F;*
	Now that we have a func, use it to generate a label to count hash
	*&#x2F;
	var dateCount = {};
	for(var i=0, len=dates.length; i&lt;len; i++) {
		var l = getLabel(new Date(dates[i]));
		if(dateCount.hasOwnProperty(l)) {
			dateCount[l]++;
		} else {
			dateCount[l] = 1;
		}
	}
			
	dateList.listview({
		autodividers:true,
		autodividersSelector: function ( li ) {
			var d = new Date(li.text());
			var label = getLabel(d);
			
			return label + &quot; (&quot; +dateCount[label] +&quot;)&quot;;
		}
	}).listview(&quot;refresh&quot;);

});</code></pre>

<p>
The first change was to abstract out the code used to generate the divider - basically turning the date value into a label. Once I have that, I iterate over my data to figure out how many unique date labels I have. This is done with a simple object and a counter. Finally, my autodividersSelector function is modified to make use of this count. Here is the result.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot213.png" />
</p>

<p>
There you go. Not exactly rocket science, but hopefully helpful. It <i>is</i> possible to create dividers with list bubbles, just not quite as simply as this entry demonstrates. I'll show that tomorrow.
</p>
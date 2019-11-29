---
layout: post
title: "Creating a highlight/fadeout text effect on a tag cloud"
date: "2012-02-02T17:02:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2012/02/02/Creating-a-highlightfadeout-text-effect-on-a-tag-cloud
guid: 4516
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2012/2/1/Generate-a-tag-cloud-from-an-RSS-feed-with-ColdFusion">blogged</a> a simple example of how to turn an RSS feed into a tag cloud. Today reader JP <a href="http://www.raymondcamden.com/index.cfm/2012/2/1/Generate-a-tag-cloud-from-an-RSS-feed-with-ColdFusion#c8079B8DB-C5F3-1EEF-FC1B1A8B73029B38">commented</a> that it would be cool if I could mimic an effect he saw in a Flash based tag cloud. Basically, as you mouse over each word, they light up. Here's what I came up with.
<!--more-->
<p>

First off - I tweaked my data a bit. Instead of working with an RSS feed, I decided to hit my copy of CFBloggers and scan <i>all</i> the category data. My local database is a good 6 months old, but still has 48 thousand entries. This gave me a nice set of data. If you remember, Pete's tag cloud code already wraps every word with a span. The class on the span is based on the word's relative "score" compared to other words. I decided then to simply append to that:

<p>

<code>
&lt;cfoutput&gt;&lt;span class="tagcloudword #class#"&gt;#w#&lt;/span&gt;&lt;/cfoutput&gt;
</code>

<p>

I then added a CSS style for tagcloudword to make it a bit light by default:

<p>

<code>
.tagcloudword {% raw %}{ opacity: 0.5; }{% endraw %}
</code>

<p>

And then it was time for the jQuery. Turned out - it was pretty damn trivial:

<p>

<code>
$(function() {
	$(".tagcloudword").mouseover(function(e) {
		$(this).animate({% raw %}{opacity:1.0}{% endraw %},400);
	});
	$(".tagcloudword").mouseout(function(e) {
		$(this).animate({% raw %}{opacity:0.5}{% endraw %},400);
	});
});	
</code>

<p>

As you can see, I'm simply using the animate API to change opacity when you mouse over and out of the word. And that's it. You can even make it simpler with the hover event:

<p>

<code>
$(".tagcloudword").hover(function(e) {
	$(this).animate({% raw %}{opacity:1.0}{% endraw %},400);
},function(e) {
	$(this).animate({% raw %}{opacity:0.5}{% endraw %},400);
});
</code>

<p>

You can see a demo of this yourself by clicking the big demo button below. Note that I saved out the result as an HTML, so it's not "live". 

<p>


<a href="http://www.raymondcamden.com/demos/2012/feb/2/cfbtagcloud.htm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
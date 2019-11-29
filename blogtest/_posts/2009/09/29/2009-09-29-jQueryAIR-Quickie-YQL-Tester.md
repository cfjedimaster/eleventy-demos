---
layout: post
title: "jQuery/AIR Quickie - YQL Tester"
date: "2009-09-29T19:09:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/09/29/jQueryAIR-Quickie-YQL-Tester
guid: 3546
---

This is absolutely pointless, but I love the fact that it took all of five minutes to write. I've been playing quite a bit with YQL lately (I wrote about it <a href="http://www.raymondcamden.com/index.cfm/2009/9/10/Yahoo-Query-Language">here</a>) and even wrote a simple ColdFusion wrapper for it. I thought I'd take a look at how difficult it would be to write a jQuery based "tester". Ie, something I could write basic YQL text in and then see the results. I began with a few building HTML building blocks:
<!--more-->
<code>
&lt;form&gt;
&lt;textarea id="yql" style="width:100%;height:75px"&gt;SELECT * FROM flickr.photos.search WHERE text="cat"&lt;/textarea&gt;
&lt;input type="button" id="btn" value="Run"&gt;
&lt;/form&gt;

&lt;div id="result"&gt;&lt;/div&gt;
</code>

As you can see, I've got a textarea, a button, and a div for my results. Why the hard coded YQL? During testing, I hate having to enter things in. I decided to leave this in so folks can immediately see some sample YQL. I then whipped up some jQuery:

<code>
$(document).ready(function() {

	$("#btn").click(function() {
		var yql = $("#yql").val()
		yql = $.trim(yql)
		//air.trace('yql: '+yql)
		if(yql == "") return
		$("#result").html("&lt;i&gt;Loading...&lt;/i&gt;")
		$.getJSON("http://query.yahooapis.com/v1/public/yql?q="+escape(yql)+"&format=json",function(data) {
			$("#result").html($.dump(data.query.results))			
		})
	})
})
</code>

So basically - get the value from the textarea and then pass it to Yahoo. I then dump the results. How? I modified the free code from this <a href="http://www.netgrow.com.au/files/javascript_dump.cfm">site</a>. The author created a basic JavaScript equivalent of dump and another contribute created a jQuery plugin version. Unfortunately, the code automatically used a new window for the dump. I modified this to just return the output. (I need to get the click events working, but for now, I'm satisfied.) With that simple mod, well, you can see then it just took one line. 

And um, that's it. I wish there was more, but it just plain works. Really goes to show how nice jQuery is and how simple the YQL API is to work with. Here is a screen shot:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-09-29 at 5.03.26 PM.png" />

And finally, a quick installer badge if you want to play with it.

<b>Removed the badge. Need more time to figure out the bug on my blog. Just download below.</b>

p.s. If the badge fails to load (my preview isn't showing) you can download it below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FYQLTester%{% endraw %}2Ezip'>Download attached file.</a></p>
---
layout: post
title: "Using the Meetup API in Client-Side Applications"
date: "2015-11-20T13:06:04+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/11/20/using-the-meetup-api-in-client-side-applications
guid: 7117
---

This isn't new, but was something I discovered a few weeks ago and I'm finally making the time to blog about it. I've used the  <a href="https://secure.meetup.com/meetup_api">Meetup API</a> in the past with ColdFusion and for the most part, it just works, but like many APIs today it requires authenticated calls to get data. Unfortunately, even a simple search against public data also required an authenticated call. This means using the API in a purely client-side application won't be secure because your code will contain your secret keys.

<!--more-->

Or so you would think. It isn't obvious at first (or wasn't to me), but the API actually supports <a href="http://www.meetup.com/meetup_api/auth/#keysign">"Key signatures"</a>. What this means is that you can design an API call, like, find me the meetups around area X that use the word "kitten" in the description and Meetup will give you a "signed" version of the URL to use in your application. Now here's the killer part. That URL is 100% safe to use because it will <strong>only</strong> do precisely what you told it to: Search for groups around area X with kitten in the name. Even better, this "lock" on the URL does not apply to anything related to paging or JSON/P callbacks. So outside of not being terribly obvious (at least in my opinion), this is a killer feature of the API and one worth considering for your next application.

In order to test this, you will need to have an account with Meetup and be logged in. Then simply go to the <a href="https://secure.meetup.com/meetup_api/console/">API Console</a> and begin testing. Here is a screen shot of that in action:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot13.png" alt="shot1" width="750" height="593" class="aligncenter size-full wp-image-7119 imgborder" />

You'll want to use the console to get your API calls down exactly as you want them and once you're satisfied, just copy and paste that URL into your code. I went ahead and whipped up a quick demo that performs a search for Ionic meetups around the world. Here's the code - and to be clear - this was quick and dirty, not nice.

<pre><code class="language-javascript">function fetchGroups(url, cb, data) {
	if(!data) data = [];
	
	$.ajax({
		
		dataType:'jsonp',
		method:'get',
		url:url,
		success:function(result) {
			console.log('back with ' + result.data.length +' results');
			console.dir(result);
			//add to data
			data.push.apply(data, result.data);
			if(result.meta.next_link) {
				var nextUrl = result.meta.next_link;
				fetchGroups(nextUrl, cb, data);
			} else {
				cb(data);	
			}
		}
	});	
	
}

$(document).ready(function() {
	
	var $results = $(&quot;#results&quot;);

	$results.html(&quot;&lt;p&gt;Finding meetups with Ionic in the description.&lt;/p&gt;&quot;);

	fetchGroups(&quot;https://api.meetup.com/find/groups?&amp;photo-host=public&amp;page=50&amp;text=ionic&amp;sig_id=2109318&amp;radius=global&amp;order=newest&amp;sig=ad335a79ccce2b1bb65b27fe10ea6836305e5533&amp;callback=?&quot;, function(res) {
		console.log(&quot;totally done&quot;);
		console.dir(res);	

		var s = &quot;&quot;;
		for(var i=0;i&lt;res.length; i++) {
			var group = res[i];
			s += &quot;&lt;h2&gt;&quot;+(i+1)+&quot; &lt;a href='&quot;+group.link+&quot;'&gt;&quot;+group.name+&quot;&lt;/a&gt;&lt;/h2&gt;&quot;;
			if(group.group_photo &amp;&amp; group.group_photo.thumb_link) {
				s += &quot;&lt;img src=\&quot;&quot; + group.group_photo.thumb_link + &quot;\&quot; align=\&quot;left\&quot;&gt;&quot;;
			}
			s += &quot;&lt;p&gt;Location: &quot;+group.city + &quot;, &quot; + group.state + &quot; &quot; + group.country + &quot;&lt;/p&gt;&lt;br clear=\&quot;left\&quot;&gt;&quot;;
		}
		$results.html(s);
		
		
	});
		
});</code></pre>

I created a simple recursive function, fetchGroups, that lets me pass the initial signed URL in and deal with aggregating multiple pages of results. When finished, it then calls a callback function with the results. I should have used Promises perhaps, but, I was being lazy. The results are rendered out somewhat simply, but that could be improved of course.

You can view a live demo of this here: <a href="https://static.raymondcamden.com/demos/2015/nov/20/index.html">https://static.raymondcamden.com/demos/2015/nov/20/</a>. Let me know what you think!
---
layout: post
title: "Dealing with remote resources in ColdFusion and HTML/JS"
date: "2010-10-01T11:10:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2010/10/01/Dealing-with-remote-resources-in-ColdFusion-and-HTMLJS
guid: 3957
---

Christian asks:

<p>

<blockquote>
This is slightly related to the AJAX discussion you've blogged about this month. And so I ask this question in hopes you might address it on your blog. Yesterday, we saw a number of client sites stumble due to the issues that Facebook was having. Slow page loading or even error messages within the Facebook display areas were common. In one case, the client has the Facebook "Like" button deployed by using the Facebook Javascript SDK and in the iframe that Facebook writes out, the error "DNS Error - Service Unavailable" was displayed.
<br/><br/>
For Coldfusion developers who are asked to deploys these sorts of interconnected solutions, what are some methods to protect the client site when the service you are calling goes awry? Facebook isn't the only case, but it has high-visibility today and I imagine other readers saw the same issue and took the same sorts of calls from clients yesterday.
</blockquote>
<!--more-->
<p>

Good question. I responded back to him by asking if we could split this into two concerns: 

<p>

1) Handling remote sites from ColdFusion (like when you use cfhttp or cffeed)

<p>

2) Handling remote sites from JavaScript

<p>

Each of the above allow you to embed remote resources and tools into your site and each requires a totally different way of handling it. Let's begin with the first type. I know I ran into issues with this a few times this year. First I had a few sites brought down by a bad cffeed call. Then my own blog had issues with a cfhttp call. While one of the issues I ran into involved RSS feeds that required authentication, my biggest problem was forgetting the simple timeout attribute. In all cases you want to at least do the following:

<p>

1) Wrap your call in a try/catch.

<p>

2) Use a timeout to ensure the network call doesn't spend too long trying to get the request.

<p>

3) Cache the result if your business rules allow. (And with caching being ridiculously easy in ColdFusion you really have no excuse not to.) 

<p>

It wouldn't hurt to add some logging to that logic above too - especially if you aren't sure how stable your remote resource is. 

<p>

Now let's go to the client side - and here I'm going to have to ask for help from my readers. In terms of JavaScript you may embed into your code, let's say a library that adds a widget or somesuch, don't forget you can make use of error handling at the window level. I've yet to actually do this in a real project but it seems like something I should consider:

<p>

<code>
&lt;script&gt;
window.onerror = function(e) {
	alert('error');
	console.dir(e);
	return false;
}
&lt;/script&gt;
</code>

<p>

In a simple test this seemed to work well for me. (Well, you would want to do a bit more than just alert probably.) I then tried the same with a bad iframe:

<p>

<code>
&lt;iframe src="http://www.gdfgdgdfgdfgoogle.com" id="remote"&gt;&lt;/iframe&gt;	
</code>

<p>

But this did not fire my main onerror handler. I tried using an onerror on the iframe tag itself, but I didn't have any luck in that regards. Perhaps one of my readers would know? Perhaps we could listen for a loaded event and if it doesn't happen within 10 seconds simply hide the iframe completely. Thoughts?
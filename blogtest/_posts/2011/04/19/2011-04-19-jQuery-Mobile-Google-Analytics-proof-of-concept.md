---
layout: post
title: "jQuery Mobile + Google Analytics proof of concept"
date: "2011-04-19T14:04:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/04/19/jQuery-Mobile-Google-Analytics-proof-of-concept
guid: 4199
---

Here is my first experiment in integrating Google Analytics and jQuery Mobile. I've been trying to get this working off and on the last week or so, but I finally figured out my mistake this morning. <i>Please</i> consider this a proof of concept. It seems to be working ok now, but I bet there are about ten different ways to do this better. That being said - let's look at the code.
<!--more-->
<p>

First, here is the page without any analytics code at all.

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Analytics Demo&lt;/title&gt; 
&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.css" /&gt;
&lt;script src="http://code.jquery.com/jquery-1.5.2.min.js"&gt;&lt;/script&gt;
&lt;script src="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Home&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;li data-role="list-divider"&gt;Options&lt;/li&gt;
			&lt;li&gt;&lt;a href="products.html"&gt;Products&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="members.html"&gt;Members&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="#about"&gt;About&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;div data-role="page" id="about"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;About&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;p&gt;
		This is demo content.
		&lt;/p&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

It's a simple page with 3 links. As you can see, the About page is included in the same source, and products and members are separate pages. As they are very similar, I'll show one of them:

<p>

<code>
&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Products&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview" data-inset="true"&gt;    
	    	&lt;li&gt;&lt;a href="apples.html"&gt;Apples&lt;/a&gt;&lt;/li&gt;    
	    	&lt;li&gt;&lt;a href="oranges.html"&gt;Oranges&lt;/a&gt;&lt;/li&gt;    
	    	&lt;li&gt;&lt;a href="cherries.html"&gt;Cherries&lt;/a&gt;&lt;/li&gt;    
	    &lt;/ul&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

This page leads to 3 more - all of which are the same except for their names. Here is apples.html:

<p>

<code>
&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Apples&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
	&lt;p&gt;
	This is for apples.
	&lt;/p&gt;
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;
</code>

<p>

Ok - so now to the analytics. I knew I was going to use asynchronous tracking which is described in Google's docs here: <a href="http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html">Tracking Site Activity</a>. This involves placing the core tracking code in the head of your document. So in my initial file I did so:

<p>

<code>
&lt;script type="text/javascript"&gt;

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-70863-15']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

&lt;/script&gt;
</code>

<p>

Now for the tricky part - and the part I screwed up on. According to the docs, I needed to make use of <a href="http://code.google.com/apis/analytics/docs/gaJS/gaJSApiBasicConfiguration.html#_gat.GA_Tracker_._trackPageview">trackPageview</a>, a function that allows you to asynchronously register a page view event. jQuery Mobile fires an event when pages are loaded. I made use of that event to wrap a call to trackPageview:

<p>

<code>
$("div").live("pagebeforeshow",function(event,ui) {
	var header = $("div[data-role='header'] h1",$(this));
	var title = $.trim(header.text());
	modtitle = "/" + title + ".html";
	console.log(modtitle);
	_gaq.push(["_trackPageview",modtitle]);
});
</code>

<p>

What this code does is listen for the pagebeforeshow event. This is one of many events you can listen to. (More information on events may be <a href="http://jquerymobile.com/demos/1.0a4.1/#docs/api/events.html">found in the docs</a>.) When a page is shown, I use jQuery to grab the text out of the header. If you look at the page example above, you can see I include a title there that represents the page. With that I create a URL of the form: "/" + title + ".html." Here is where I screwed up. See the push event? It takes an array. My eyes missed that the first 10 times I looked at the code. Simply add [ and ] around the arguments seemed to fix everything:

<p>
 
<img src="https://static.raymondcamden.com/images/ScreenClip71.png" />

<p>

Any comments on this technique? You can see the full code here: <a href="http://www.coldfusionjedi.com/demos/gajqm/">http://www.coldfusionjedi.com/demos/gajqm/</a> Although obviously you won't be able to view my analytics.
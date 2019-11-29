---
layout: post
title: "Another experiment in jQuery Mobile swipe navigation"
date: "2011-03-26T18:03:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/03/26/Another-experiment-in-jQuery-Mobile-swipe-navigation
guid: 4172
---

About a week or so ago I whipped up a simple demo that showed using swipe-based navigation within jQuery Mobile (<a href="http://www.raymondcamden.com/index.cfm/2011/3/14/Using-swipe-gestures-for-navigation-in-jQuery-Mobile">Using swipe gestures for navigation in jQuery Mobile</a>). The idea was simple - look at how jQuery Mobile could listen for swipe events and then use them to navigate to the next page instead of using the traditional button click. I don't know about you, but it's amazing how quickly the swipes seem to be becoming a standard way to work with an application. A few weeks back I found myself about to reach out to my desktop monitor to do a swipe against the screen. My daughter, all of 9, already learned that swipes work on an iPhone, and when I handed her my Nook, she just knew a swipe would work in a book. So I think there's a good reason to work with this type of user interaction. Today's blog entry is another example of this - an Art Browser.
<!--more-->
<p>

What follows is the complete code for my application. It's a one page application that handles getting art work from the database and displaying one image at a time. Swipe events can be used to go to the next piece of art, or return to the previous entry. Let's look at the code.

<p>

<code>
&lt;!--- load up our index of art if we don't have it already ---&gt;
&lt;cfset artdata = cacheGet("artdata")&gt;
&lt;cfif isNull(artdata)&gt;
	&lt;cfquery name="getart"&gt;
	select	artname, largeimage
	from	art
	&lt;/cfquery&gt;
	&lt;!--- quickly filter to art we have a picture for, in a real app this wouldn't be an issue ---&gt;
	&lt;cfset artdata = []&gt;
	&lt;cfloop query="getart"&gt;
		&lt;cfif fileExists(expandPath("./artgallery/#largeimage#"))&gt;
			&lt;cfset arrayAppend(artdata, {% raw %}{name=artname, image=largeimage}{% endraw %})&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	&lt;cfset cachePut("artdata", artdata, createTimeSpan(0,0,1,0))&gt;
&lt;/cfif&gt;
&lt;cfparam name="url.index" default="1"&gt;
&lt;cfif not isNumeric(url.index) or url.index lte 0 or round(url.index) neq url.index or url.index gt arrayLen(artdata)&gt;
	&lt;cfset url.index = 1&gt;
&lt;/cfif&gt;
&lt;cfset previndex = nextindex = ""&gt;
&lt;cfif url.index gte 2&gt;
	&lt;cfset previndex = url.index-1&gt;
&lt;/cfif&gt;
&lt;cfif url.index lt arrayLen(artdata)&gt;
	&lt;cfset nextindex = url.index+1&gt;
&lt;/cfif&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Art Browser&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.5.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$('.artbrowserPage').live('swipeleft swiperight',function(event){
		if (event.type == "swiperight") {
			var prev = $("#previndex",$.mobile.activePage);
			var previndex = $(prev).data("index");
			if(previndex != '') {
				$.mobile.changePage({% raw %}{url:"index.cfm",type:"get",data:"index="+previndex}{% endraw %},"slide",true);
			}
		}
		if (event.type == "swipeleft") {
			var next = $("#nextindex",$.mobile.activePage);
			var nextindex = $(next).data("index");
			if(nextindex != '') {
				$.mobile.changePage({% raw %}{url:"index.cfm",type:"get",data:"index="+nextindex}{% endraw %});
			}
		}
		event.preventDefault();
	});
});
&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;cfoutput&gt;
&lt;div data-role="page" data-theme="e" class="artbrowserPage"&gt;

	&lt;div data-role="header" data-backbtn="false"&gt;
		&lt;h1&gt;#artdata[url.index].name#&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;p&gt;
		&lt;img src="artgallery/#artdata[url.index].image#" title="#artdata[url.index].name#"&gt;&lt;br/&gt;
		&lt;br/&gt;
		Item #url.index# out of #arrayLen(artdata)#&lt;br/&gt;
		Swipe left and right to browse.
		&lt;/p&gt;
	&lt;/div&gt;

	&lt;span id="previndex" data-index="#previndex#"&gt;&lt;/span&gt;
	&lt;span id="nextindex" data-index="#nextindex#"&gt;&lt;/span&gt;
	
&lt;/div&gt;
&lt;/cfoutput&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Before we dive in - you should definitely read the <a href="http://www.coldfusionjedi.com/index.cfm/2011/3/14/Using-swipe-gestures-for-navigation-in-jQuery-Mobile">previous entry</a> to get up to speed with the basics. The first 16 lines or so represent my business logic. Normally this would <i>not</i> be in the page at all. For simplicity sake though I've got it included here. If you don't know ColdFusion (and I expect I'm getting visitors to the site lately who don't), the basic gist is - "Check the cache for an array of art data, and if it doesn't exist, query the database and check the file system for available images to store into my cache." At the end of this block we've got an array of art names and image urls. 

<p>

The next block is also ColdFusion specific. It simply looks for a URL parameter to indicate which piece of art we are viewing. I do a basic bit of validation (we all validate our URL parameters, right?) and then create variables to represent the previous and next index. Note they will be blank at the beginning or end of the art list.

<p>

Ok, now for the JavaScript. I begin with a jQuery selector based on the class of my page. Again, if you've read my <a href="http://www.coldfusionjedi.com/index.cfm/2011/3/14/Using-swipe-gestures-for-navigation-in-jQuery-Mobile">previous entry</a>, you will remember that I need my event listener to pick up new 'pages' as they come into the DOM. Since I have the same page being loaded with different data inside, the class based listener is going to pick up on the changes. (<b>I really think that this particular method is something I'm going to change later on. It just doesn't feel... 100% solid. Please keep that in mind. jQuery Mobile is new to me as well</b>)

<p>

Inside this event handler is code very similar to my previous example. I'm storing my data a bit differently (as we will see later in the code) so I have to fetch it differently, but the concept is the same. Based on the direction I'm swiping, I need to possibly change pages. Pay particular attention to the swiperight section. For that event, I want to reverse my transition. So I have to specify the second attribute ("slide") as well as the 3rd "false" to signify the <i>reversed</i> version of the normal slide transition. This took me a little bit to figure out. The short version is - this is how I reverse the page transition. The example in the next IF block uses all the defaults. 

<p>

So - the HTML is rather simple. I output a dynamic record from my cache. I then use two spans to store data values for my index. These will either be a number or a blank string, and my jQuery code will handle them accordingly. 

<p>

You can play with this here:

<p>

<a href="http://www.coldfusionjedi.com/demos/artbrowse"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

It works - and works well I think - but I'd like to change two things:

<p>

<ul>
<li>The art image is a bit small on the device. Not unsuable of course, but I'd like to make the image bigger. 
<li><a href="http://www.cfsilence.com">Todd Sharp</a> suggested  preloading the images. I haven't done image preloaders since the last time I wrote a simple rollover, but I think that would be a good idea. If we expect a user to possibly sit there and stare at the art for a few seconds, we should have enough time to fetch the next image. Since jQuery Mobile loads the next page via Ajax, we could actually fire off an immediate process to start fetching all the images in order. That's it - I've decided - I'm going to do a follow up and try that.
</ul>

<p>

That's all I've got. Any comments on the implementation?
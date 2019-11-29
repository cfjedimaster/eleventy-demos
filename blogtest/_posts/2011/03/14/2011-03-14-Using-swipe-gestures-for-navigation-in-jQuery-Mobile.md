---
layout: post
title: "Using swipe gestures for navigation in jQuery Mobile"
date: "2011-03-14T14:03:00+06:00"
categories: [coldfusion,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/03/14/Using-swipe-gestures-for-navigation-in-jQuery-Mobile
guid: 4156
---

A few weeks back I posted a simple jQuery Mobile demo that demonstrated <a href="http://www.raymondcamden.com/index.cfm/2011/2/25/jQuery-Mobile-Example--Paged-Search-Results">paged search results</a>. The idea was simple - present an input field to the user to search against a database of art and allow for paged results. Be sure to review that <a href="http://www.coldfusionjedi.com/index.cfm/2011/2/25/jQuery-Mobile-Example--Paged-Search-Results">entry</a> on the particulars. I thought it would be interesting to look into a cooler way of paging through the results - using swipe gestures.
<!--more-->
<p>

Swipe gestures are simply the act of dragging your finger across the mobile device. jQuery Mobile supports listening in to both a left and right swipe event. I thought it would be cool to use a right swipe to move forward and a left swipe to go back. In theory - this should be simple. I've got navigation links already. If I listen in to my swipeleft/swiperight events I can fetch the URL and then perform the load myself. I <i>thought</i> it would be easy,  but my first attempt failed. Let's look at what I did and then I'll explain why it failed.

<p>

<code>
$(document).ready(function() {

	 $('#searchPage').live('swipeleft swiperight',function(event){
 		console.log(event.type);
 		if (event.type == "swipeleft") {
 			var prev = $("#prevlink");
			 if (prev.length) {
				 var prevurl = $(prev).attr("href");
				 console.log(prevurl);
			 }
		 }
		 if (event.type == "swiperight") {
			 var next = $("#nextlink");
			 if (next.length) {
				 var nexturl = $(next).attr("href");
				 console.log(nexturl);
			 }
		 }
	 });
});
</code>

<p>

I began by creating a listener for swipeleft and swiperight. The event details will tell me which one was called and since the logic is very similar for both it made sense to just use one handler. I'm listening in on "searhPage", which if you look at the previous entry, is the page that displayed search results. I had <i>not</i> included an ID on that page so I simply added it to this version:

<p>

<code>
&lt;div id="searchPage" data-role="page" data-theme="e"&gt;
</code>

<p>

Now we branch out based on the swipe action. I use a selector to get either the previous or next link. These links were used for buttons and contain the URL we need for the relevant page to load. Now it's possible that you may try to swipe left on the first page of results. I check the length of the selector result to see if we actually have something before I try to get the URL. Finally, I log the URL to see if it works. 

<p>

Here is where things got odd. I began to test this and noticed that my links were all based on the first match. What I mean is, when I would do a swipe right, I'd always get the link for page 2, no matter what page I was on. When I would swipe left, I'd first get nothing (if I was on page one), but then I'd get the link for page 1 if I was on page 2 or any other page. It's like jQuery was caching the result of the selector and not refetching it on a swipe. Then I realized my problem.

<p>

As you navigate from page to page, jQuery Mobile will make an XHR request to load the page. But - notice the previous code block had an ID of searchPage. I was - basically - loading pages into my DOM that had the same ID. If I understand things right, I was basically making multiple pages with the same ID. On a whim I made a quick change. First - I made my page use a unique ID based on the starting position of the results. I then added a static class.

<p>

<code>
&lt;div id="search#url.start#" data-role="page" data-theme="e" class="searchPage"&gt;
</code>

<p>

I then modified my event handler to listen in to the class, not the ID:

<p>

<code>
$('.searchPage').live('swipeleft swiperight',function(event){
</code>

<p>

This seemed to work well, but then I had a problem with my selectors. I could now possibly have multiple prevLink and nextLink items in my DOM. I remembered that jQuery let's you look for something inside another item. I also remembered jQuery Mobile provides a pointer to the current page. I tried this modification:

<p>

<code>
var prev = $("#prevlink",$.mobile.activePage);
</code>

<p>

And it worked! Here is the complete JavaScript block. Notice too I also actually added the navigation part as well:

<p>

<code>

&lt;script&gt;
$(document).ready(function() {

	$('.searchPage').live('swipeleft swiperight',function(event){
		console.log(event.type);
		if (event.type == "swipeleft") {
			var prev = $("#prevlink",$.mobile.activePage);
			if (prev.length) {
				var prevurl = $(prev).attr("href");
				console.log(prevurl);
				$.mobile.changePage(prevurl);
			}
		}
		if (event.type == "swiperight") {
			var next = $("#nextlink",$.mobile.activePage);
			if (next.length) {
				var nexturl = $(next).attr("href");
				console.log(nexturl);
				$.mobile.changePage(nexturl);
			}
		}
		event.preventDefault();
	});
});
&lt;/script&gt;
</code>

<p>

You can test this yourself below. Any comments?

<p>

<a href="http://www.coldfusionjedi.com/demos/march132011/index2.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
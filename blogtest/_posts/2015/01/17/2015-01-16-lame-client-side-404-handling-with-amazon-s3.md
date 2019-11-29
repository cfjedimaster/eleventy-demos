---
layout: post
title: "Lame, client-side 404 handling with Amazon S3"
date: "2015-01-17T09:18:30+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2015/01/17/lame-client-side-404-handling-with-amazon-s3
guid: 5563
---

Yes, I'm calling this lame, consider that a warning. About a year or so ago I migrated <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> to a static site using <a href="http://www.harpjs.com">HarpJS</a>. While doing this conversion, I changed my URL for entries from:

<!--more-->

/entry/XX/NNNN (where XX is a database primary key and NNNN is a URL friendly text version of the title)

to

/entries/NNNN (where NNNN is the URL friendly text version of the title)

Unfortunately, I could not create a redirect for this because Amazon S3 only supports <strong>static</strong> redirects and maxes out at 50. You can't use a regex at all with their system. I kinda figured Google would take care of (and from what I can see, searches definitely turn up the right URLs) but this doesn't handle existing links. A reader emailed me about just that issue yesterday. I told him what I said here - I couldn't really do anything about it<sup>*</sup> but I wondered if I could write some simple JavaScript code to attempt to help out with this.

I added the following code snippet to my 404 page:

<pre><code class="language-javascript">
document.addEventListener("DOMContentLoaded", function(){
	var path = window.location.pathname;
	if(path.indexOf("/entry/") === 0) {
		var parts = path.split("/");
		//why 4? cuz first part is blank
		if(parts.length === 4) {
			var intro = document.querySelector("#intro");
			var next = intro.nextSibling;
			var newUrl = "http://www.coldfusioncookbook.com/entries/" + parts[3] +".html";
			var p = document.createElement("p");
			p.innerHTML = "<p>The URL you attempted to load may possibly be found here: <a href='"+newUrl+"'>"+newUrl+"</a>.</p>";
			intro.parentNode.insertBefore(p, next);
		}
	} 
},false);
</code></pre>

Taking it piece by piece, I begin by checking the current URL location, specifically the pathname. If I see /entry in the request, I then split it and count the pieces. My old URL syntax should return four pieces, and if so, I assume it is of the old format. I could be more anal here and check the second part to see if it is a number, but that felt like overkill. 

I then simply generate a new URL and append it to the 404 page as a suggestion. I specifically decided against auto-redirecting as I thought the 'flash' of the 404 page would be annoying and seem like a bug. My code could also check to see if document.querySelector actually exists, or even simpler, use document.getElementById.

You can see an example of this here: <a href="http://www.coldfusioncookbook.com/entry/53/How-do-I-determine-if-a-number-is-even-or-odd">http://www.coldfusioncookbook.com/entry/53/How-do-I-determine-if-a-number-is-even-or-odd</a>. 

As I said, this is lame, but I figure it is better than nothing. I wish S3 would support regex URLs, but for the price I pay (I'm averaging about 4 cents a month for my static sites there) I really can't complain.
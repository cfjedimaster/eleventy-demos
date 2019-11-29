---
layout: post
title: "jQuery Mobile Beta 2 released (and a small demo)"
date: "2011-08-04T16:08:00+06:00"
categories: [coldfusion,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/08/04/jQuery-Mobile-Beta-2-released-and-a-small-demo
guid: 4317
---

Today the jQuery Mobile team released their second beta. You can read up on the details here: <a href="http://jquerymobile.com/blog/2011/08/03/jquery-mobile-beta-2-released/">jQuery Mobile Beta 2 Released</a>. There are a bunch of exciting new changes in this release (and over the last few releases if you haven't been keeping it up!) but I thought one in particular was really neat - page prefetching.
<!--more-->
<p/>

Page pre-fetching is exactly what it sounds like - the ability for jQuery Mobile to recognize that you're going to (probably) load some other page. You can flag this to jQuery Mobile and it will handle preloading the page for you. When the user clicks, they get a better experience since the content is already loaded. The blog post talks about a photo gallery as an example so I thought I'd write one real quick just so I can demo this change. Here's my application so far:

<p/>

<code>
&lt;cfinclude template="../prepareart.cfm"&gt;
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;	
	&lt;title&gt;Browse Art&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.2.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Art Browser&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;cfoutput&gt;
		&lt;p&gt;
		&lt;img src="artgallery/#getFileFromPath(files[url.index])#"&gt;
		&lt;/p&gt;		
		
		&lt;cfif hasPrevious&gt;
			&lt;a href="index.cfm?index=#url.index-1#" data-role="button" data-icon="arrow-l"&gt;Previous&lt;/a&gt;
		&lt;/cfif&gt;
		&lt;cfif hasNext&gt;
			&lt;a href="index.cfm?index=#url.index+1#" data-role="button" data-icon="arrow-r" data-iconpos="right"&gt;Next&lt;/a&gt;
		&lt;/cfif&gt;
		&lt;/cfoutput&gt;		
	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;cfoutput&gt;
		&lt;h4&gt;Piece #url.index# out of #arrayLen(files)#&lt;/h4&gt;
		&lt;/cfoutput&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Notice I'm using ColdFusion to do some of the grunt work behind the scenes. I'll share that file in the zip, but for now, just know that it is scanning a directory of images and figuring out which one to show based on a query string parameter. You can see me then making use of a few variables this sets up:

<p>

<ul>
<li>files - An array of image files
<li>hasPrevious - boolean if we aren't on the first image
<li>hasNext - boolean if we aren't at the end
</ul>

<p>

Since application logic isn't crucial to the demo I'm not going to focus on it. You can view this demo now - and I recommend trying it in your mobile device. Try to get a feel for how quickly it loads/runs.

<p>

<a href="http://www.raymondcamden.com/demos/aug42011/jqg1/">http://www.coldfusionjedi.com/demos/aug42011/jqg1/</a>

<p>

Ok - so how do we enabled pre-fetching? It's pretty involved. Here's my change:

<p>

<code>
&lt;cfif hasPrevious&gt;
	&lt;a href="index.cfm?index=#url.index-1#" data-role="button" data-icon="arrow-l" data-prefetch&gt;Previous&lt;/a&gt;
&lt;/cfif&gt;
&lt;cfif hasNext&gt;
	&lt;a href="index.cfm?index=#url.index+1#" data-role="button" data-icon="arrow-r" data-iconpos="right" data-prefetch&gt;Next&lt;/a&gt;
&lt;/cfif&gt;
</code>

<p>

Wow, that was exhausting. To be clear, we added "data-prefetch" to the links. That's it. You can view this version here:

<p>

<a href="http://www.coldfusionjedi.com/demos/aug42011/jqg2">http://www.coldfusionjedi.com/demos/aug42011/jqg2</a>

<p>

If you try this version, it should be a bit snappier. If you run it in your browser with Firebug or Chrome Dev tools, you can see the XHR requests being made automatically. It isn't an <i>incredible</i> difference, but as I said, it did seem a bit quicker.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdemo1%{% endraw %}2Ezip'>Download attached file.</a></p>
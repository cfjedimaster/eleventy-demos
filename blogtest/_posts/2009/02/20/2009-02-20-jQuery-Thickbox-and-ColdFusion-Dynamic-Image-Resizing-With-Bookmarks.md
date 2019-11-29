---
layout: post
title: "jQuery Thickbox and ColdFusion Dynamic Image Resizing - With Bookmarks"
date: "2009-02-20T13:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/02/20/jQuery-Thickbox-and-ColdFusion-Dynamic-Image-Resizing-With-Bookmarks
guid: 3247
---

Earlier this week I did a blog entry <a href="http://www.raymondcamden.com/index.cfm/2009/2/17/jQuery-Thickbox-and-ColdFusion-Dynamic-Image-Resizing">jQuery Thickbox and ColdFusion</a>. In the entry I described how I used ColdFusion to automatically list images, and create thumbnails, to be used with the jQuery <a href="http://jquery.com/demo/thickbox/">Thickbox</a> plugin. I began my entry with a bit of a mini-rant about how I'm tired of image gallery that <i>aren't</i> AJAX based. Reader Bilgehan made the <a href="http://www.coldfusionjedi.com/index.cfm/2009/2/17/jQuery-Thickbox-and-ColdFusion-Dynamic-Image-Resizing#c8FF40626-19B9-E658-9D173F0A354DE386">comment</a> that one thing lacking from my AJAX-based gallery was the ability to bookmark one particular image. I took that as a challenge to see if it was possible to allow for directly linking to one image within the gallery. Turns out that - yet again - jQuery made this trivial. Here is how I attacked the problem.
<!--more-->
The first thing I figured was that I would need to use a location hash for the bookmarks. By that I mean a unique value after the # character in the URL. This is something I did for <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. If you go to page 2 (or 3, etc), you will notice that the # portion of the URL changes. So with that in mind, my first job was to recognize when someone clicked on an image:

<code>
$(document).ready(function() {
	console.log('init')
	$(".thickbox").click(handleClick);	
});
</code>

(By the way, a few people have run into issues with my console.log statements. For folks who don't know - this is a way to do debugging with Firebug. I recommend everyone install Firebug as it is the absolute best tool in the world for doing any type of JavaScript work. My code samples will show various console.log messages. These are just in place to help me ensure things are working. On the live demo I'll link to later, I'll remove them.)

This code simply says, when the page loads, monitor the click event on any item with a thickbox class. I was worried this would interfere with Thickbox, but it didn't have any problems at all. My handleClick does this:

<code>
function handleClick(e) {
	if(e.originalTarget!=null) {
		console.log('clicked on my image')
		console.log(e.originalTarget.id)
		document.location.href = '#'+e.originalTarget.id
	}
}
</code>

Ok, so this wasn't my first version of the function. I initially did console.dir(e), which is the same as ColdFusion's dump command essentially. I discovered that originalTarget represented the image. I was able to get the ID of the image easily enough and use that for the document.location.href value. Ignoring the debug stuff, the logic is really just one condition and one statement. Easy! (Why do I check for originalTarget!=null? I'll explain that later.) 

By the way, I modified my CFML code to dynamically set the ID of the image:

<code>
&lt;cfoutput&gt;	
&lt;a href="#imageFolder#/#name#" title="#name#" class="thickbox" rel="gallery-ss" id="aimg#currentRow#"&gt;&lt;img src="#imageFolder#/thumbs/#name#" alt="#name#" id="img#currentRow#" /&gt;&lt;/a&gt;
&lt;/cfoutput&gt;
</code>

As you can guess, if you add an image to your gallery, it will mess up the bookmarks. I could have used the img src itself in the URL, but I felt that was a bit too messy. Just keep this in mind if you actually use my code. (People don't actually use my code, do they?)

Ok, so I stopped there, reloaded, and clicked around. I saw my URL change in the browser as I clicked. So that part of the problem was done. Now I needed a way to say, "If I load this page with #imgN in the URL, load the Nth picture." 

I modified my document.ready to notice the URL:

<code>
$(document).ready(function() {
	console.log('init')
	$(".thickbox").click(handleClick);	
	//do we have a bookmark?
	if(document.location.hash!='') {
		//get the id
		idToLoad = document.location.hash.substr(1,document.location.hash.length)
		console.log('load '+idToLoad)
	}
});
</code>

If the hash isn't blank, I grav the value. I confirmed this was working, and then had to figure out my next issue. The Thickbox API doesn't provide a way for you to force an image to open as if the user had clicked it. Or maybe it does - I just didn't see it documented. It occurred to me - is there a way in jQuery to 'fake' an event? Yes! By using the trigger() function:

<code>
$("#a"+idToLoad).trigger('click')
</code>

The 'a' portion comes from the IDs I used for the links. When I forced a click on the image it didn't work. I had to force a click on the link, which I guess makes sense, but I had thought the image was what I needed to trigger. My images use IDs of the form: imgN. My links use IDs of the form: aimgN. Hopefully that makes sense.

So this worked, but threw a JavaScript error in my click event. For some reason, when I forced the click, e.originalTarget didn't exist. I'm not exactly sure why, but since this was just for the initial page load, it was ok. I added my condition and the job was done.

You can demo this here - it should open the 3rd image automatically: <a href="http://www.coldfusionjedi.com/demos/tboxtest/index2.cfm#img3">http://www.coldfusionjedi.com/demos/tboxtest/index2.cfm#img3</a>

I've included a zip of the CFM file.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Findex2%{% endraw %}2Ecfm%2Ezip'>Download attached file.</a></p>
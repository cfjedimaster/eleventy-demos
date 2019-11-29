---
layout: post
title: "Good example of a jQuery demo with two rewrites"
date: "2011-04-22T23:04:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2011/04/22/Good-example-of-a-jQuery-demo-with-two-rewrites
guid: 4203
---

Whenever I see something interesting, UX wise, I consider writing it myself with jQuery, just to see if I can. Last night I did this, posted the code, and got some great rewrites from other folks in the jQuery community. I thought it would be fun to share both my version and theirs so folks can see how differently problems can be solved. I've said this many times in ColdFusion sessions. There's multiple ways to get things done. I guess it's no surprise the same applies to jQuery as well. The ... effect... widget... user experience I wanted to mimic is something I've seen on <a href="http://slashdot.org">Slashdot</a>. Slashdot's home page consists of a set of articles. I assume most of my readers have visited Slashdot but if you haven't, notice how the articles are either expanded or opened up. If you click on the title of an opened article, you are taken to the detail page with comments. If you click on the title of a closed article, first the summary opens up, and on a second click you are sent to the detail page.

<p>

Ok, so it's not rocket science. But I thought it was interesting and decided to whip up a quick demo:
<!--more-->
<p>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$(".collapsed").each(function(idx) {
		console.log("found one");
		//find all the children and hide them
		var kids = $(this).children();
		//hide everything
		$(kids).hide();
		//assumes top level item is our title
		$(kids[0]).show();
		//add click handler
		$(kids[0]).click(function(e) {
			console.log("click");
			//so - if our parent's children are hidden, show them
			//if they are visible, follow the link
			var parent = $(this).parent();
			var kids = parent.children();
			if($(kids[1]).is(":visible")) {
				var link = $("a",kids[0]).attr("href");
				window.location.href = link;
			} else {
				$(kids).show();
			}
		});
	});
})
&lt;/script&gt;
&lt;style&gt;
.collapsed {
	background-color: #f0f0f0;
	padding: 0px;	
}
.collapsed h2 {
	border-style:solid;
	border-width:thin;
	cursor:pointer;
	background-color: #d0d0d0;
	padding: 6px;
}
.collapsed h2 a {
	text-decoration: none;
	color: black;	
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div class="collapsed"&gt; 
	&lt;h2&gt;&lt;a href="http://slashdot.org"&gt;Test Title&lt;/a&gt;&lt;/h2&gt;
	&lt;p&gt;
	Summary content
	&lt;/p&gt;
&lt;/div&gt;

&lt;div class="collapsed"&gt;
	&lt;h2&gt;&lt;a href="http://slashdot.org"&gt;Test Title2&lt;/a&gt;&lt;/h2&gt;
	&lt;p&gt;
	Summary content2
	&lt;/p&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

If you look at the bottom, you can see two divs with a collapsed class. I've got an h2 on top representing a title and the summary as a paragraph beneath it. Now jump up to the code.

<p>

I begin by finding all my items with the collapsed class. I grab a pointer to all the kids via the children() operator. I then hide all of them and show the first one. This code basically assumes the first child is a title and all the rest are simply paragraphs. 

<p>

Next I add a click handler to that top item. When clicked we do two things. We go up to get the parent and then grab the kids again. The <i>second</i> child is a paragraph. If hidden, it means we need to show all of them. If visible, we follow the link. 

<p>

Test it out below...

<p>

<a href="http://www.raymondcamden.com/demos/april212011/test.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

So I tweeted demo last night and got replies from Doug Neiner and Jeremy Battle. First let's look at Doug's. This is my first time doing a jsfiddle.net embed, so forgive me if it doesn't work right:

<p>

<iframe style="width: 100%; height: 300px" src="http://jsfiddle.net/dougneiner/vkG93/1/embedded/"></iframe>

<p>

This is pretty different. For the most part it makes sense to me, but this line threw me:

<p>

<code>
document.documentElement.className += " js";
</code>

<p>

It looks like it applies the "js" class name to <i>everything</i> in the document. I assume this wouldn't work if you had other DOM items you didn't want to use this behavior. Now let's look at Jeremy's:

<p>

<iframe style="width: 100%; height: 300px" src="http://jsfiddle.net/wEVTa/2/embedded/"></iframe>

<p>

This one's even smaller. It's much more direct then my version as well.

<p>

Anyway - I hope sharing three versions of the same code is interesting to folks. I really feel like I can do <i>anything</i> with jQuery now - but I really want to learn nicer ways of doing thing. "Nicer" is in the eye of the beholder of course, but I like both of these versions better than mine.
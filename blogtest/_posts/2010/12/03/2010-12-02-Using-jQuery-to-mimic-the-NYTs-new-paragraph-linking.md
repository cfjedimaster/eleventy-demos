---
layout: post
title: "Using jQuery to mimic the NYT's new paragraph linking"
date: "2010-12-03T07:12:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2010/12/03/Using-jQuery-to-mimic-the-NYTs-new-paragraph-linking
guid: 4039
---

Yesterday I <a href="http://thenextweb.com/media/2010/12/02/the-new-york-times-introduces-the-evolution-of-the-hyperlink/">read</a> about a new paragraph linking system the New York Times has added to their site. The article linked to in the previous sentence describes it, but the gist is that you can add hash marks to focus in to a specific paragraph or sentence and do highlighting as well. This is really cool as it lets people linking to a story specifically call out a certain section. During lunch I decided to see if I could build something similar in jQuery. I specifically wanted to build a completely client side solution that did not - in any way - impact the textual data being served up from the CMS. I assume the NYT did the same. Here is what I came up with. It currently only supports paragraph selecting and highlighting, but I've got an idea on how to handle sentences as well. I wrote this <i>very</i> quickly so I'm sure it could be done much better. 

<p/>
<!--more-->
<code>

&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//get anchor
	console.log('loaded');
	if(document.location.hash != '') {
		var hash = document.location.hash.substr(1,document.location.hash.length);
		var type = hash.substr(0,1).toLowerCase();
		
		//ok, so if hash is PN, go to paragraph N
		if(type == "p" || type == "h" ) {
			var pindex = hash.substr(1, hash.length);
			pindex = parseInt(pindex);
			if(isNaN(pindex)) return;
			console.log('going to load paragraph '+pindex);
			//now find it
			var para = $("p:nth-child("+pindex+")");
			var top = para.position().top;
			console.log(top);
			window.scrollTo(0, top);
			if(type == "h") para.addClass("highlight");
			console.log('done');
		}

	}
})
&lt;/script&gt;
&lt;style&gt;
.highlight {
	background-color: yellow;
	font-weight: bold;
	color: red;
}
&lt;/style&gt;
</code>

<p/>

The code begins by checking to see if we even have a hash in the URL. If we do, we get the value. Notice that I remove the first character since document.location.hash includes the # within it. (Seems a bit silly, but oh well.) Next I get the first character. A "p" implies we are just going to scroll to a particular paragraph while "h" implies scrolling and highlighting as well. I do a bit of parsing to get the value after the first letter and call it my pindex. This is the Nth paragraph I want to use. 

<p/>

Once we have that - we can then easily use the nth-child selector in jQuery to find that particular paragraph. I don't have logic to check to see if the paragraph requested is more than the actual number of paragraphs, but I figure that's ok. I grab it's Y value by calling position() on the item and getting the top value. Then I simply use the scrollTo function of the window. The final piece to this is to use an addClass() if we were doing a highlight and not just a scroll. So how well does it work? Here are a few examples.

<p/>

<a href="http://www.raymondcamden.com/demos/dec32010/test.html#p2">Paragraph 2</a><br/>

<a href="http://www.coldfusionjedi.com/demos/dec32010/test.html#p4">Paragraph 4</a><br/>

<a href="http://www.coldfusionjedi.com/demos/dec32010/test.html#h3">Highlight Paragraph 3</a><br/>

<p/>

As I said - I wrote this very quickly - and I'm sure the NYT's system is much better, but it was pretty fun to create this myself in jQuery. Tomorrow I'm going to try attacking the sentence specific selecting/highlighting.
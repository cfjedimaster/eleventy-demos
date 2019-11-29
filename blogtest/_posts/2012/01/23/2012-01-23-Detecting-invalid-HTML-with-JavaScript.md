---
layout: post
title: "Detecting invalid HTML with JavaScript"
date: "2012-01-23T14:01:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2012/01/23/Detecting-invalid-HTML-with-JavaScript
guid: 4505
---

As a blogger, I write quite a few blog posts. I hate RTEs (Rich Text Editors) so I'll typically do most of any desired HTML by hand. Normally this isn't a big deal. My blogware can handle paragraphs and code formatting. I typically just worry about <b>bold</b> and <i>italics</i>. However, because I'm entering HTML manually, there's always a chance I could screw up. I've got a Preview feature on my blog but I rarely use it.
<!--more-->
<p/>

For a while now I've wondered if there was some way to possible detect bad HTML via JavaScript. I decided today to take a crack at it using some simple regex. I figured if we could detect all tags, maybe we could use a simple counter to keep track of opening and closing tags. Obviously that's not terribly precise, but for the types of mistakes I make, it would actually work out ok most of the time. I worked on it a bit and came up with the following little demo:

<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#testBtn").click(function(e) {
		var code = $.trim($("#code").val());
		if(code == '') return;
		
		var regex = /&lt;.*?&gt;/g;
		var matches = code.match(regex);
		if(!matches.length) return;
		
		var tags = {};
		
		$.each(matches, function(idx,itm) {
			console.log("Raw tag: "+itm);

			//if the tag is, &lt;..../&gt;, it's self closing
			if (itm.substr(itm.length - 2, itm.length) != "/&gt;") {
			
				//strip out any attributes
				var tag = itm.replace(/[&lt;&gt;]/g, "").split(" ")[0];
				console.log("Tag : " + tag);
				//start or end tag?
				if (tag.charAt(0) != "/") {
					if (tags.hasOwnProperty(tag)) 
						tags[tag]++;
					else 
						tags[tag] = 1;
				}
				else {
					var realTag = tag.substr(1, tag.length);
					console.log("Real tag is -" + realTag);
					if (tags.hasOwnProperty(realTag)) 
						tags[realTag]--;
					else 
						tags[realTag] = -1;
				}
			}
		});

		console.dir(tags);
		
		var possibles = [];
		for (tag in tags) {
			if(tags[tag] != 0) possibles.push(tag);
		}
		if (possibles.length) {
			$("#status").text("There appear to be some hanging tags in your textarea: "+possibles.join(","));
		}
	});
	

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="status"&gt;&lt;/div&gt;

&lt;form&gt;
	&lt;textarea name="code" id="code" cols="70" rows="30"&gt;&lt;/textarea&gt;&lt;br/&gt;
	&lt;input type="button" id="testBtn" value="Test"&gt;
&lt;/form&gt;	
&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

Basically, I used a simple regex to find any HTML tag:

<p/>

<code>
var regex = /&lt;.*?&gt;/g;
</code>

<p/>

And from that, I loop over the matches and figure out a) the real tag (so I ignore attributes for example) and if it is closing or not. I use a simple numeric value to either increment/decrement a counter of tags. I also try to support self closing tags like &lt;p/&gt;. 

<p/>

It's not the most scientific method, but it seems to work well in my testing. Check it out at the demo below.

<p/>

<a href="http://www.raymondcamden.com/demos/2012/jan/23/test.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>
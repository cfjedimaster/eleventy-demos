---
layout: post
title: "Working with HTML5's multiple file upload support"
date: "2012-02-28T16:02:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2012/02/28/Working-with-HTML5s-multiple-file-upload-support
guid: 4543
---

This won't be a terribly long post, nor one that is probably informative to a lot of people, but I finally got around to looking at the HTML5 specification for multiple file uploads (by that I mean allowing a user to pick multiple files from one file form field). I knew it existed I just never got around to actually looking at it. Turns out it is incredibly simple.
<!--more-->
<p>

You take a file form field:

<p>

<code>
&lt;input type="file" name="myfile"&gt;
</code>

<p>

And you add multiple to it (or multiple="multiple").

<p>

<code>
&lt;input type="file" name="myfiles" multiple="multiple"&gt;
</code>

<p>

And... yeah, that's it. Even better, it degrades perfectly. So in Chrome it works, and your label switches from...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip31.png" />

<p>

to...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip33.png" />

<p>

I kept waiting for the "But, wait" moment and it never came. In IE where it fails to work, it simply remains a file upload control that works with one file, not many. Because it's so simple and fallback is so good, I can't see really bothering to use another solution, like a Flash uploader, but you could do a bit of massaging for it. So for example, consider if my form had the following label:

<p>

<code>
Multiple File: &lt;input type="file" name="files" multiple="multiple"&gt;&lt;br/&gt;
</code>

<p>

In IE, the user won't be able to select multiple files. While not the end of the world, it kind of bugs me that the label may mislead the user into trying something they can't do. (And as we know, the user will blame us, not IE.) So what to do?

<p>

I did some basic research into how to use JavaScript to detect features. I found a few good examples that basically suggested creating a temporary DOM item like so:

<p>

<code>
var el = document.createElement("input");
</code>

<p>

But here's where I had issues. Most of the links I found discussed how to detect new HTML form <i>types</i>, like range for example. These techniques worked by setting the type on the new element to the type you want to test and then immediately checking to see if the type still has the same value. But what about attributes?

<p>

Turns out Dive Into HTML5 has a great <a href="http://diveintohtml5.info/detect.html#input-types">article</a> on this. When you have your DOM item, you can simply ask if the item exists. Here is an example:

<p>

<code>
function supportMultiple() {
	//do I support input type=file/multiple
	var el = document.createElement("input");

	return ("multiple" in el);

}
</code>

<p>

So given that, I modified my mark up a bit. I changed the label in front of my form and hid the word "Multiple":

<p>

<code>
&lt;span id="multipleFileLabel" style="display:none"&gt;Multiple &lt;/span&gt;File: &lt;input type="file" name="files" multiple="multiple"&gt;&lt;br/&gt;
</code>

<p>

I then added an init method to my body tag and used the following code:

<p>

<code>
function supportMultiple() {
	//do I support input type=file/multiple
	var el = document.createElement("input");

	return ("multiple" in el);
}

function init() {
	if(supportMultiple()) {
		document.querySelector("#multipleFileLabel").setAttribute("style","");
	}
}
</code>

<p>

And that worked like a charm. IE say just "File" whereas Chrome and Firefox had the new hotness.

<p>

So yeah - that's a lot of writing about a simple little thing, but... dare I say it... I'm really getting jazzed up about HTML again!

<p>

Here's my entire test template if you want to cut and paste:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;

&lt;script&gt;
	function supportMultiple() {
		//do I support input type=file/multiple
		var el = document.createElement("input");

		return ("multiple" in el);
	}

	function init() {
		if(supportMultiple()) {
			document.querySelector("#multipleFileLabel").setAttribute("style","");
		}
	}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;

	&lt;form action="" method="post" enctype="multipart/form-data"&gt;
	Normal Text: &lt;input type="text" name="name"&gt;&lt;br/&gt;
	&lt;span id="multipleFileLabel" style="display:none"&gt;Multiple &lt;/span&gt;File: &lt;input type="file" name="files" multiple="multiple"&gt;&lt;br/&gt;
	&lt;input type="submit"&gt;
	&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

p.s. So how you actually <i>process</i> the upload depends on your server. My ColdFusion readers are probably wondering how it handles this. Good news, bad news. The bad news is that ColdFusion can't (as far as I and other smarter peoiple know) handle this at all. If you want to do this in ColdFusion 9, use the Flash based multifile uploader instead. The good news is that ColdFusion 10 handles it just file. Be sure to use action value of "uploadall" of your cffile tag.
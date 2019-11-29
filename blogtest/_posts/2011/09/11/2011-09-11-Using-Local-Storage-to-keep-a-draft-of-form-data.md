---
layout: post
title: "Using Local Storage to keep a draft of form data"
date: "2011-09-11T19:09:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/09/11/Using-Local-Storage-to-keep-a-draft-of-form-data
guid: 4360
---

As a blogger, one of the things I'm well aware of is how unstable a browser can be. You probably don't think of how often your browser crashes (and to be fair, it's probably been a good month since mine crashed and I run a bleeding edge Chrome install), but if you were ever 500 or so words into a blog entry (or forum posting, or comment) and your browser crashes - you become pretty aware of how nice Word's Auto Save feature is. I first blogged about this back in 2007 (<a href="http://www.raymondcamden.com/index.cfm/2007/1/1/Saving-data-in-case-of-brower-crashes">Saving data in case of brower crashes</a>). Back then I used cookies to store a temporary copy of form data while the user was editing. I thought it might be nice to update the idea using HTML 5's Local Storage feature.
<!--more-->
<p>

HTML Local Storage is one of those darn nice HTML features that doesn't get as much press as it deserves. Unlike it's sexier cousin Canvas, though, Local Storage is actually useful. (Yes, I said it. Canvas is the hot cheerleader in high school. It's getting a lot of attention now but in five years it's going to be pregnant with it's 3rd child and working at Walmart.) I won't go into detail on how it works here (check out the excellent <a href="http://diveintohtml5.org/storage.html">tutorial</a> over at Dive Into HTML5). 

<p>

The minimum you need to know that is you can treat the local storage feature like a persistent scope within JavaScript. Setting localStorage[somekey] = somevlaue is enough to store the value on the browser. There's size limits of course but for our values (strings) we won't come close to the limit. Best of all, we won't run into the "Evil Too Many Cookies" error. I once spent 2 days diagnosing an issue on a site that came down to the server simply setting one too many cookies. Did the browser bother to tell me? Of course not. It just silently ignored the cookie. (Which to be fair is fine for 99% of the world out there, but for those of who develop web sites, that type of warning would be useful. Unlike Canvas. Ok I'll stop now.) 

<p>

My basic plan of attack will be this:

<p>

<ol>
<li>When the browser loads, look for values in the local storage object and restore them.
<li>Every N seconds, store a copy.
<li>When the form posts, clear the local storage. (We assume nothing goes wrong server side. Maybe not a safe assumption, but I'm going with it for now.)
</ol>

<p>

Before we do anything, we need to ensure our browser supports local storage. For that, I'm taking a nice function right from the Dive into HTML site:

<p>

<code>
//Credit: http://diveintohtml5.org/storage.html
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
</code>

<p>

The first thing we do is check for existing values. This will be done when the page loads so I've got it inside my $(document) block:

<p>

<code>
$(document).ready(function() {
	if (supports_html5_storage()) {
		//load in old data
		loadOld();
</code>

<p>

That's the loading snipping, and here's loadOld (which is a horrible name, sorry):

<p>

<code>
function loadOld() {
	console.log("Running loadOld");
	if(localStorage["blogentry.title"]) $("#title").val(localStorage["blogentry.title"]);
	if(localStorage["blogentry.abstract"]) $("#abstract").val(localStorage["blogentry.abstract"]);
	if(localStorage["blogentry.body"]) $("#body").val(localStorage["blogentry.body"]);
	if(localStorage["blogentry.category"]) $("#category").val(localStorage["blogentry.category"]);
}
</code>

<p>

Each of these lines are exactly the same except for the key and DOM item they use. Notice that I'm using keys named blogentry.something. Local Storage is unique per site and my blog may be only one small part of a larger application. Using "title" would be too vague so I used a more verbose, but potentially safer naming system. 

<p>

Next we need to set up our code to store the data. I've got an interval defined first:

<p>

<code>
window.setInterval(saveData, 5 * 1000);
</code>

<p>

That 5 second duration there is pretty arbitrary. I type pretty quickly so 5 seconds seems like a reasonable interval. Now for the actual function:

<p>

<code>
function saveData(){
	localStorage["blogentry.title"] = $("#title").val();
	localStorage["blogentry.abstract"] = $("#abstract").val();
	localStorage["blogentry.body"] = $("#body").val();
	localStorage["blogentry.category"] = $("#category").val();
}
</code>

<p>

Really complex, right? I love how simple this feature is! The final part is handling form submission. We want to clear out the values:

<p>

<code>
$("#blogEntry").submit(function() {
	//could do validation here as well
	localStorage["blogentry.title"] = "";
	localStorage["blogentry.abstract"] = "";
	localStorage["blogentry.body"] = "";
	localStorage["blogentry.category"] = "";
});
</code>

<p>

Notice I'm not actually removing the value but setting it to an empty string. You can also use removeItem(key) to actually delete the entire value.  An example of that would be:

<p>

<code>
localStorage.removeItem("blogentry.title");
</code>

<p>

As I expect folks to be running this code again and again, it seems ok to keep the key there with an empty value. Ok, so let's not put it all together.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
//Credit: http://diveintohtml5.org/storage.html
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function loadOld() {
	console.log("Running loadOld");
	if(localStorage["blogentry.title"]) $("#title").val(localStorage["blogentry.title"]);
	if(localStorage["blogentry.abstract"]) $("#abstract").val(localStorage["blogentry.abstract"]);
	if(localStorage["blogentry.body"]) $("#body").val(localStorage["blogentry.body"]);
	if(localStorage["blogentry.category"]) $("#category").val(localStorage["blogentry.category"]);
}

function saveData(){
	console.log("Running saveData");
	localStorage["blogentry.title"] = $("#title").val();
	localStorage["blogentry.abstract"] = $("#abstract").val();
	localStorage["blogentry.body"] = $("#body").val();
	localStorage["blogentry.category"] = $("#category").val();
}

$(document).ready(function() {
	console.log('init');
	if (supports_html5_storage()) {
		//load in old data
		loadOld();
		//start storing 
		window.setInterval(saveData, 5 * 1000);
		//handle the form
		$("#blogEntry").submit(function() {
			//could do validation here as well
			localStorage["blogentry.title"] = "";
			localStorage["blogentry.abstract"] = "";
			localStorage["blogentry.body"] = "";
			localStorage["blogentry.category"] = "";
		});
	}
	
});
&lt;/script&gt;
&lt;style&gt;
fieldset { 
	width: 400px;
	margin-bottom: 10px;
}
input[type=text] {
	width: 100%;
}
textarea {
	width: 100%;
	height: 50px;
}
&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;


&lt;form id="blogEntry" method="post"&gt;

&lt;fieldset&gt;
&lt;label for="title"&gt;Title&lt;/label&gt;
&lt;input type="text" name="title" id="title"&gt;
&lt;/fieldset&gt;

&lt;fieldset&gt;
&lt;label for="abstract"&gt;Abstract&lt;/label&gt;
&lt;textarea name="abstract" id="abstract"&gt;&lt;/textarea&gt;
&lt;/fieldset&gt;

&lt;fieldset&gt;
&lt;label for="body"&gt;Body&lt;/label&gt;
&lt;textarea name="body" id="body"&gt;&lt;/textarea&gt;
&lt;/fieldset&gt;

&lt;fieldset&gt;
&lt;label for="category"&gt;Category&lt;/label&gt;
&lt;select name="category" id="category"&gt;
&lt;option value="1"&gt;ColdFusion&lt;/option&gt;
&lt;option value="2"&gt;jQuery&lt;/option&gt;
&lt;option value="3"&gt;Flex&lt;/option&gt;
&lt;option value="4"&gt;Star Wars&lt;/option&gt;
&lt;/select&gt;
&lt;/fieldset&gt;

&lt;input type="submit"&gt;

&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Check out the demo of this here. And before you ask - yes - Local Storage does work in IE. However I used console messages while testing. If you want to try this on IE, just copy and paste the code and remove the console statements. 

<p>

<a href="http://www.coldfusionjedi.com/demos/sep112011/test3.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
---
layout: post
title: "Example of Autocomplete in jQuery Mobile"
date: "2012-03-27T13:03:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/03/27/Example-of-Autocomplete-in-jQuery-Mobile
guid: 4570
---

A while back a reader (Bobby Tuck) asked me about how to do autocomplete in a jQuery Mobile application. He tried using jQuery UI's <a href="http://jqueryui.com/demos/autocomplete/">autocomplete</a> control but found it didn't integrate well on a mobile device with the keyboard popped up. I suggested an alternative and (finally!) got around to building a mockup. Here's my take on it - feel free to rip it apart and suggest alternatives and improvements.
<!--more-->
<p>

Let's begin with a simple jQuery Mobile template. 

<p>

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Autocomplete Example&lt;/title&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
&lt;script src="http://code.jquery.com/jquery-1.7.1.min.js"&gt;&lt;/script&gt;
&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div data-role="page" id="mainPage"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Autocomplete Example&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;

		&lt;p&gt;
		&lt;input type="text" id="searchField" placeholder="Search"&gt;
		&lt;/p&gt;

	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;script&gt;
$("#mainPage").on("pageshow", function(e) {
	console.log("Ready to bring the awesome.");

});
&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>


I've got a few things going on here to prepare for the autocomplete control. I've got a text field that will accept the user input. I've got a page event handler (this is jQuery Mobile specific) that will fire when the page loads. Now let's talk about my proposed solution.


I thought it might be handy to use a jQuery Mobile listview to render the suggestions. So I began by adding an empty list view beneath my form field:


<pre><code class="language-javascript">
&lt;p&gt;
&lt;input type="text" id="searchField" placeholder="Search"&gt;
&lt;ul id="suggestions" data-role="listview" data-inset="true"&gt;&lt;/ul&gt;
&lt;/p&gt;
</code></pre>

I then wrote some simple code to handle changes to the input field. 

<pre><code class="language-javascript">
$("#mainPage").on("pageshow", function(e) {
	console.log("Ready to bring the awesome.");
	var sugList = $("#suggestions");

	$("#searchField").on("input", function(e) {
		var text = $(this).val();
		if(text.length &lt; 1) {
			sugList.html("");
			sugList.listview("refresh");
		} else {
			$.get("service.cfc?method=getSuggestions", {% raw %}{search:text}{% endraw %}, function(res,code) {
				var str = "";
				for(var i=0, len=res.length; i&lt;len; i++) {
					str += "&lt;li&gt;"+res[i]+"&lt;/li&gt;";
				}
				sugList.html(str);
				sugList.listview("refresh");
				console.dir(res);
			},"json");
		}
	});

});
</code></pre>

The code is rather simple I think. We bind to the "input" event for the text field and check the value. Now - most autosuggest controls make a determination on whether or not it makes sense to fire off a request. You may - for example - decide you only want to ask for autocomplete results when the user has entered 3 or 4 characters. Mine will <i>always</i> fire as long as you have at least one character. I did that because my data (a list of names) was a bit short and I wanted to ensure that the demo was easy to use. Obviously you can alter that to your liking. 

If the user entered something, we fire off a request to the server. (In this case to a ColdFusion script that performs a search against a list of names. It's trivial enough that I won't include it in this blog entry, but if anyone wants it, you can view it here: <a href="http://pastebin.com/pFGggRc3">http://pastebin.com/pFGggRc3</a>) The server responds with an array of names. We can then take that array and create a simple HTML string out of it. This string is inserted into our empty list and then we simply call the jQuery Mobile refresh method to ensure it is marked up correctly.

And that's it. I tested it on my mobile device and while the keyboard will cover some of the results, it seems to work well:

<img src="https://static.raymondcamden.com/images/forblog.png" />

Obviously this demo needs a bit more work to be complete. Your list options would probably link to the detail for your search results. You can find the demo below as well as the complete code.

Demo is removed as I no longer run ColdFusion on my server. Here is a link to a zip: <a href="https://static.raymondcamden.com/enclosures/27.zip">https://static.raymondcamden.com/enclosures/27.zip</a>

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Autocomplete Example&lt;/title&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" /&gt;
&lt;script src="http://code.jquery.com/jquery-1.7.1.min.js"&gt;&lt;/script&gt;
&lt;script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div data-role="page" id="mainPage"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Autocomplete Example&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;

		&lt;p&gt;
		&lt;input type="text" id="searchField" placeholder="Search"&gt;
		&lt;ul id="suggestions" data-role="listview" data-inset="true"&gt;&lt;/ul&gt;
		&lt;/p&gt;

	&lt;/div&gt;

	&lt;div data-role="footer"&gt;
		&lt;h4&gt;&lt;/h4&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;script&gt;
$("#mainPage").on("pageshow", function(e) {
	console.log("Ready to bring the awesome.");
	var sugList = $("#suggestions");

	$("#searchField").on("input", function(e) {
		var text = $(this).val();
		if(text.length &lt; 1) {
			sugList.html("");
			sugList.listview("refresh");
		} else {
			$.get("service.cfc?method=getSuggestions", {% raw %}{search:text}{% endraw %}, function(res,code) {
				var str = "";
				for(var i=0, len=res.length; i&lt;len; i++) {
					str += "&lt;li&gt;"+res[i]+"&lt;/li&gt;";
				}
				sugList.html(str);
				sugList.listview("refresh");
				console.dir(res);
			},"json");
		}
	});

});
&lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>


P.S. So hey - what about the HTML5 Datalist option? Unfortunately on mobile it is only supported in Opera. You can find details on support here: <a href="http://caniuse.com/#feat=datalist">http://caniuse.com/#feat=datalist</a>
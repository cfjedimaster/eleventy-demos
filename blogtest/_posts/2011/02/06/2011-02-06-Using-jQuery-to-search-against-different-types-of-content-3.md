---
layout: post
title: "Using jQuery to search against different types of content (3)"
date: "2011-02-06T15:02:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/02/06/Using-jQuery-to-search-against-different-types-of-content-3
guid: 4108
---

I don't normally take blog entries into so many iterations, but after my <a href="http://www.raymondcamden.com/index.cfm/2011/2/3/Using-jQuery-to-search-against-different-types-of-content-2">last blog</a> post I got some really cool feedback from Dan Switzer and Kevin Marino. 

<p/>

Dan mentioned an <i>excellent</i> bit of code called debounce. You should read Dan's <a href="http://blog.pengoworks.com/index.cfm/2009/3/24/Managing-JavaScript-eventsfunctions-using-debouncing">post</a> to learn more about it or check out the <a href="http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/">original author's post</a> on the concept. The basic idea is that given some user interaction you want to ensure you don't "react" to it more than one in a period of time. This isn't throttling where you "back up" the calls so you only get one 1 every N seconds. Rather, the additional calls are essentially ignored. If you look at my search (here is a link to the <a href="http://www.coldfusionjedi.com/demos/feb32011/test.cfm">second demo</a>) with a network monitor enabled, you will see one search for every key press. While I wanted that, it may make sense to do things a bit slower, especially on a high traffic server. Debounce allows for that. I can still have 'search as you type' but slowed down a bit. I plan on putting the entire code base up with my changes, but here is an shortened version of how I added it to my application:

<p/>
<!--more-->
<code>
$("#searchField").keyup(debounce(function() {
....
	},250));
</code>

<p/>

What I've done here is slightly modified the normal jQuery event handler syntax by wrapping the inline function with a call to debounce. 250 is the value by which things will be blocked. I go this value from Dan and it seemed like a good idea. In my testing this tiny little change worked <i>very</i> well. I still got a snappy search form but it seemed to run about half the network calls. 

<p/>

So what about Kevin's advice? He suggested using some form of caching on the client side. Now - this can get incredibly complex if you have a need for it. I decided to do something very simple. Every time I work with the result of a search, I take that generated string and store it in a variable. For example:

<p/>

<code>
if(field in cache) {
	console.log(field + " was in cache");
	$("#results").html(cache[field]);
	return;
}
</code>

<p>

In the example above, "field" represents what we are searching for. I apologize - that isn't a great name for the variable. Later on we store to the cache in the handle result for my network call.

<p/>

<code>
cache[field] = s;
</code>

<p/>

So yeah - this is pretty trivial. You can imagine that over time, the cache will get big. In my opinion this simple solution should work ok. This is <i>not</i> GMail. User's won't be sitting here constantly searching again and again. They should - as far as I know - do some searches and click on a result. If they come back to search again the cache will be reset. 

<p/>

Given these two changes, the application should be even better than the original. It's going to be making quite a few fewer network calls between the user of the debouncer and the cache. Here's the entire front end code.

<p/>

<code>

&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	var debounce = function (func, threshold, execAsap) {
	    var timeout;
	 
	    return function debounced () {
	        var obj = this, args = arguments;
	        function delayed () {
	            if (!execAsap)
	                func.apply(obj, args);
	            timeout = null; 
	        };
	 
	        if (timeout)
	            clearTimeout(timeout);
	        else if (execAsap)
	            func.apply(obj, args);
	 
	        timeout = setTimeout(delayed, threshold || 100); 
	    };
	 
	}


	//http://stackoverflow.com/questions/217957/how-to-print-debug-messages-in-the-google-chrome-javascript-console/2757552#2757552
	if (!window.console) console = {};
	console.log = console.log {% raw %}|| function(){}{% endraw %};
	console.dir = console.dir {% raw %}|| function(){}{% endraw %};
	
	cache = {};

	//listen for keyup on the field
	$("#searchField").keyup(debounce(function() {
		//get and trim the value
		var field = $(this).val();
		field = $.trim(field)

		//if blank, nuke results and leave early
		if(field == "") {
			$("#results").html("");
			return;
		}
		
		console.log("searching for "+field);
		if(field in cache) {
			console.log(field + " was in cache");
			$("#results").html(cache[field]);
			return;
		}
		
		$.getJSON("search.cfc?returnformat=json&method=search&queryformat=column", {% raw %}{"string":field}{% endraw %}, function(res,code) {
			var s = "";
			s += "&lt;h2&gt;Results&lt;/h2&gt;";
			for(var i=0; i &lt; res.ROWCOUNT; i++) {
				//display a blog entry
				if(res.DATA.TYPE[i] == "entry") {
					s += "&lt;p&gt;&lt;img src=\"blog.png\" align=\"left\"&gt;";
					s += "&lt;b&gt;Blog Entry: &lt;a href=\"\"&gt;" + res.DATA.TITLE[i] + "&lt;/a&gt;&lt;/b&gt;&lt;br/&gt;";
					s += res.DATA.SUMMARY[i];
					s += "&lt;br clear=\"left\"&gt;&lt;/p&gt;";
				//display a blog comment
				} else {
					s += "&lt;p&gt;&lt;img src=\"" + res.DATA.GRAVATAR[i] + "\" align=\"left\"&gt;";
					s += "&lt;b&gt;Comment by " + res.DATA.AUTHOR[i] + "&lt;/b&gt;&lt;br/&gt;";
					s += "&lt;b&gt;Blog Entry: &lt;a href=\"\"&gt;" + res.DATA.TITLE[i] + "&lt;/a&gt;&lt;/b&gt;&lt;br/&gt;";
					s += res.DATA.SUMMARY[i];
					s += "&lt;br clear=\"left\"&gt;&lt;/p&gt;";
				}
			}
			cache[field] = s;
			$("#results").html(s);
		});
	},250));
})
&lt;/script&gt;
&lt;style&gt;
#results p {
	border-style:solid;
	border-width:thin;
	padding: 10px;
}
&lt;/style&gt;

&lt;form&gt;
Search: &lt;input type="text" name="search" id="searchField"&gt;
&lt;/form&gt;

&lt;div id="results"&gt;&lt;/div&gt;
</code>

<p/>

And as always, I've put up a demo for you to play with. Enjoy!

<p/>


<a href="http://www.coldfusionjedi.com/demos/feb62011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
---
layout: post
title: "PhoneGap RSS Reader - Part 2"
date: "2011-12-19T14:12:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/12/19/phonegap-rss-reader-part-2
guid: 4465
---

Two months ago I wrote a <a href="http://www.raymondcamden.com/index.cfm/2011/10/11/PhoneGap-RSS-Reader">blog entry</a> on how to build a simple PhoneGapp application. This application just read in an RSS feed and used jQuery Mobile to display the results. I think this was helpful, but a few readers pointed out some issues with the code that caused me to come back to it this weekend and work on some updates. The issues were...
<!--more-->
<p/>

<b>Error Handling</b><br/>
I admit it. I do <i>not</i> do a good job of error handling in most of my AJAX based applications. While this <i>may</i> be acceptable in some applications, in a mobile application where the entire functionality depends on things working right, there is no excuse for lacking proper error handling. My application really just did one main thing - fetch an RSS feed. Everything after that was display. But as with server side apps, any network call is a point of failure. My first change was to add in a simple error handler. In jQuery, this is rather simple. Since the application can't do much of anything without an RSS feed (or can it - see my PS below), for now we just display a simple error message.

<p/>

<code>
$.ajaxSetup({
	error:function(x,e,errorThrown) {
		console.log(x.getStatusCode());
		$("#status").prepend("Error!");		
	}
});
</code>

<p/>

That's it. jQuery makes it simple to add global handlers and since we only have one network operation anyway, I can use this just fine. As I said, we don't really need to provide a lot of detail in this case, but we can at least let the user know something went wrong. To be fair, in a real application I'd probably add a <i>bit</i> more text. I'd let the user know the data couldn't be loaded and to please try again. 

<p>

<b>Page load issues</b><br/>
This one was a bonehead mistake. If you look at the code in the original blog entry, I do my network call and render results using the pageshow event. This means that <b>every time the page is shown, it will fire</b>, including times when the user hits back from an entry view. As I said - bonehead. Luckily it's simple enough to change to pageinit. Another change I made was to not make use of jQuery's document.ready logic. Instead, I simply load everything up at once. Here is my updated JavaScript file in it's entirety.

<p>

<code>


$.ajaxSetup({
	error:function(x,e,errorThrown) {
		console.log(x.getStatusCode());
		$("#status").prepend("Error!");		
	}
});

//EDIT THESE LINES
//Title of the blog
var TITLE = "ColdFusion Jedi";
//RSS url
var RSS = "http://feedproxy.google.com/RaymondCamdensColdfusionBlog";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);

	$.get(RSS, {}, function(res, code) {
		entries = [];
		var xml = $(res);
		var items = xml.find("item");
		$.each(items, function(i, v) {
			entry = { 
				title:$(v).find("title").text(), 
				link:$(v).find("link").text(), 
				description:$.trim($(v).find("description").text())
			};
			entries.push(entry);
		});

		//now draw the list
		var s = '';
		$.each(entries, function(i, v) {
			s += '&lt;li&gt;&lt;a href="#contentPage" class="contentLink" data-entryid="'+i+'"&gt;' + v.title + '&lt;/a&gt;&lt;/li&gt;';
		});
		$("#linksList").html(s);
		$("#linksList").listview("refresh");
	});

});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].description;
	contentHTML += '&lt;p/&gt;&lt;a href="'+entries[selectedEntry].link + '"&gt;Read Entry on Site&lt;/a&gt;';
	$("#entryText",this).html(contentHTML);
});
</code>

<p>

And here is the front end HTML. The only change here was the addition of the status div used by error handling. 

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
    &lt;head&gt; 
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;    
    &lt;title&gt;&lt;/title&gt; 
    &lt;link rel="stylesheet" href="js/jquery.mobile-1.0.min.css" /&gt;
	&lt;script type="text/javascript" src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
	&lt;script src="js/jquery.mobile-1.0.min.js"&gt;&lt;/script&gt;
    &lt;script src="js/main.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" id="mainPage"&gt;

    &lt;div data-role="header"&gt;
        &lt;h1&gt;&lt;/h1&gt;
    &lt;/div&gt;

    &lt;div data-role="content"&gt;  
		&lt;div id="status"&gt;&lt;/div&gt;  
        &lt;ul id="linksList" data-role="listview" data-inset="true"&gt;&lt;/ul&gt;
    &lt;/div&gt;

    &lt;div data-role="footer"&gt;
        &lt;h4&gt;SimpleBlog by Raymond Camden&lt;/h4&gt;
    &lt;/div&gt;

    
&lt;/div&gt;

&lt;div data-role="page" id="contentPage"&gt;

    &lt;div data-role="header"&gt;
        &lt;a href="#mainPage" data-rel="back"&gt;Home&lt;/a&gt;
        &lt;h1&gt;&lt;/h1&gt;
    &lt;/div&gt;

    &lt;div data-role="content" id="entryText"&gt;
    &lt;/div&gt;
        
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

There you go! I've wrapped up the entire Eclipse project into a zip. It also includes a debug APK you can install to your device if you want to try it out.

<p>

p.s. Technically, we could try to handle network issues better. I'm not just talking about the RSS feed being down, but what if the user is offline? I've decided to follow this up with a third version that will try storing the RSS feed in local storage. If the user is offline, we can at least resort to the older data.<p><a href='/enclosures/RSSDemo.zip'>Download attached file.</a></p>
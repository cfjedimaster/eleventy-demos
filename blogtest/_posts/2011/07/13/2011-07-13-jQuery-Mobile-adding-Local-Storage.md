---
layout: post
title: "jQuery Mobile - adding Local Storage"
date: "2011-07-13T23:07:00+06:00"
categories: [coldfusion,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/07/13/jQuery-Mobile-adding-Local-Storage
guid: 4305
---

So about a week or so ago I had an idea about a simple jQuery Mobile application that would make use of Local Storage. That was a week ago. Turns out - the "simple" application turned out to be a royal pain in the rear. Not because of Local Storage, but because of some misconceptions and lack of knowledge on my part in jQuery Mobile. What followed was a couple painful days (and more than a few curse words) but after all of that, I feel like I've got a better understanding of jQuery Mobile and got to play with some new features. So with that being said, let's get to the app.
<!--more-->
<p>

My idea was a rather simple one. Given a collection of art, allow the user to browse categories and view individual pieces of art. I've done this before as a jQuery Mobile example. But what I thought would be interesting is to add a simple "Favorites" system. As you browse through the art you can select a piece you like, add it to your favorites, and then later have a quicker way to access them. To make things even more interesting, I thought I'd make use of Local Storage. Local Storage is an HTML5 feature, and unfortunately, it isn't quite as sexy as Canvas so it doesn't get as many cool demos. But it's one of those - you know - <b>useful</b> things that is actually pretty well supported. Local Storage is basically a key system of data. You can store, on the browse, a key and a value. Like name="Raymond". Unlike cookies, this data is <b>not</b> sent to the server on every request. Rather, it just sits there on the client ready to be used by JavaScript. You've got access to both a permanent (localStorage) and session based (sessionStorage) API. The excellent DiveIntoHTML5 talks about Local Storage <a href="http://diveintohtml5.org/storage.html">here</a>. I won't talk any more about the API as it's rather quite simple and the Dive site explains it more than well enough. Before getting into this version though, let's quickly look at the initial, simpler version.

<p/>

My application consists of three HTML files, all powered by ColdFusion. The home page will list categories, the category page will list art, and the detail page will show just an art piece. Let's start with the index page.

<p/>

<pre><code class="language-markup">
&lt;cfset categories = application.artservice.getMediaTypes()&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Art Browser&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.1.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Art Browser&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;cfoutput query="categories"&gt;
				&lt;li&gt;&lt;a href="category.cfm?id=#mediaid#&media=#urlEncodedFormat(mediatype)#"&gt;#mediatype#&lt;/a&gt; &lt;span class="ui-li-count"&gt;#total#&lt;/span&gt;&lt;/li&gt;
			&lt;/cfoutput&gt;
        &lt;/ul&gt;        
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

Note that I begin by asking for media types. Our database categories art by a media type and I'll be considering that my categories. The getMediaTypes method returns a query which means I can simply loop over it in my content. 

<p/>

Next up we have the category page - which is really just a slightly different version of the last one. Note though the use of the Home icon.

<p/>

<pre><code class="language-markup">
&lt;cfparam name="url.media" default=""&gt;
&lt;cfparam name="url.id" default=""&gt;
&lt;cfset art = application.artservice.getArt(mediatype=url.id)&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;cfoutput&gt;&lt;title&gt;Art Category - #url.media#&lt;/title&gt;&lt;/cfoutput&gt;
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.1.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;cfoutput&gt;
	&lt;div data-role="header"&gt;
		&lt;a href="index.cfm" data-icon="home" data-iconpos="notext"&gt;Home&lt;/a&gt;
		&lt;h1&gt;#url.media#&lt;/h1&gt;
	&lt;/div&gt;
	&lt;/cfoutput&gt;

	&lt;div data-role="content"&gt;	
		&lt;cfif art.recordCount&gt;
			&lt;ul data-role="listview" data-inset="true"&gt;
				&lt;cfoutput query="art"&gt;
					&lt;li&gt;&lt;a href="art.cfm?id=#artid#"&gt;#artname#&lt;/a&gt;&lt;/li&gt;
				&lt;/cfoutput&gt;
	        &lt;/ul&gt;        
		&lt;cfelse&gt;
			Sorry, no art in this category.
		&lt;/cfif&gt;
	&lt;/div&gt;


&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip140.png" />

<p/>

And finally, let's look at our detail page.

<p/>

<pre><code class="language-markup">
&lt;cfparam name="url.id"&gt;
&lt;cfset art = application.artservice.getArtPiece(url.id)&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;cfoutput&gt;&lt;title&gt;Art - #art.name#&lt;/title&gt;&lt;/cfoutput&gt;
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.1.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page"&gt;

	&lt;cfoutput&gt;
	&lt;div data-role="header"&gt;
		&lt;a href="index.cfm" data-icon="home" data-iconpos="notext"&gt;Home&lt;/a&gt;
		&lt;h1&gt;#art.name#&lt;/h1&gt;
	&lt;/div&gt;
	&lt;/cfoutput&gt;

	&lt;cfoutput&gt;
	&lt;div data-role="content"&gt;	
		&lt;b&gt;Artist: &lt;/b&gt; #art.artist#&lt;br/&gt;
		&lt;b&gt;Price: &lt;/b&gt; #dollarFormat(art.price)#&lt;br/&gt;
		#art.description#
		&lt;p/&gt;
		&lt;img src="#art.image#"&gt;
	&lt;/div&gt;
	&lt;/cfoutput&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

This page is even simpler. We just get the art detail and render it within the page. Nothing fancy at all - not yet anyway.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip141.png" />

<p/>

<strike>
You can demo this here: http://www.coldfusionjedi.com/demos/artbrowser/v1/
</strike>

<p/>

Ok, ready to go crazy? I decided on two main changes to my application. First, art pieces would have a new button, Add to Favorites (or Remove from Favorites). Once clicked, I'd use a jQuery Mobile dialog to prompt the user if they were sure. (Normally I hate crap like that. Don't second guess me. But I wanted to try dialogs in jQuery Mobile.) If the user confirms the action, I then simply update local storage to store the value. Since you can only store simple values, I used built in JSON features to store complex data about the art piece (really just the ID and name).

<p/>

On the home page, I had, what I thought, was a simple thing to do. When the page loads, simply fill out a dynamic list of the user favorites. Here's where things really took a turn for the worst for me. I want to give a huge shout out to user <a href="http://forum.jquery.com/user/aaronpadoshek">aaraonpadoshek</a> who helped me out on the jQuery Mobile forums. I'll show the new home page and explain what changed.

<p/>

<pre><code class="language-markup">
&lt;cfset categories = application.artservice.getMediaTypes()&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt; 
	&lt;title&gt;Art Browser&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.1.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"&gt;&lt;/script&gt;
	&lt;script&gt;
	//Credit: http://diveintohtml5.org/storage.html
	function supports_html5_storage() {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
	    return false;
	  }
	}
	function supports_json() {
	  try {
	    return 'JSON' in window && window['JSON'] !== null;
	  } catch (e) {
	    return false;
	  }
	}
	
	$(document).ready(function() {

		//only bother if we support storage
		if (supports_html5_storage() && supports_json()) {

			//when art detail pages load, show button
			$('div.artDetail').live('pageshow', function(event, ui){
				//which do we show?
				var id = $(this).data("artid");
				if (!hasInStorage(id)) {
					$(".addToFavoritesDiv").show();
					$(".removeFromFavoritesDiv").hide();
				}
				else {
					$(".addToFavoritesDiv").hide();
					$(".removeFromFavoritesDiv").show();
				}
			});

			//When clicking the link in details pages to add to fav
			$(".addToFavoritesDiv a").live('vclick', function(event) {
				var id=$(this).data("artid");
				$.mobile.changePage("addtofav.cfm", {% raw %}{role:"dialog",data:{"id":id}}{% endraw %});
			});

			//When clicking the link in details pages to add to fav
			$(".removeFromFavoritesDiv a").live('vclick', function(event) {
				var id=$(this).data("artid");
				$.mobile.changePage("removefromfav.cfm", {% raw %}{role:"dialog",data:{"id":id}}{% endraw %});
			});

			//When confirming the add to fav
			$('.addToFavoritesButton').live('vclick', function(event, ui){
				var id=$(this).data("artid");
				var label=$(this).data("artname");
				addToStorage(id,label);
				$("#addToFavoritesDialog").dialog("close");
			});

			//When confirming the remove from fav
			$('.removeFromFavoritesButton').live('vclick', function(event, ui){
				var id=$(this).data("artid");
				var label=$(this).data("artname");
				removeFromStorage(id,label);
				$("#removeFromFavoritesDialog").dialog("close");
			});
			

			$('#homePage').live('pagebeforeshow', function(event, ui){
				//get our favs
				var favs = getStorage();
				var $favoritesList = $("#favoritesList");
				if (!$.isEmptyObject(favs)) {
					if ($favoritesList.size() == 0) {
						$favoritesList = $('&lt;ul id="favoritesList" data-inset="true"&gt;&lt;/ul&gt;');
						
						var s = "&lt;li data-role=\"list-divider\"&gt;Favorites&lt;/li&gt;";
						for (var key in favs) {
							s+= "&lt;li&gt;&lt;a href=\"art.cfm?id="+key+"\"&gt;"+favs[key]+"&lt;/a&gt;&lt;/li&gt;";
						}
						$favoritesList.append(s);
						$("#homePageContent").append($favoritesList);
						$favoritesList.listview();
					} else {
						$favoritesList.empty();
						var s = "&lt;li data-role=\"list-divider\"&gt;Favorites&lt;/li&gt;";
						for (var key in favs) {
							s+= "&lt;li&gt;&lt;a href=\"art.cfm?id="+key+"\"&gt;"+favs[key]+"&lt;/a&gt;&lt;/li&gt;";
						}
						$favoritesList.append(s);
						$favoritesList.listview("refresh");
					}
				} else {
					// remove list if it exists and there are no favs
					if($favoritesList.size() &gt; 0) $favoritesList.remove();
				}
			});		
					
			//Adding to storage
			function addToStorage(id,label){
				if (!hasInStorage(id)) {
					var data = getStorage();
					data[id] = label;
					saveStorage(data);
				}
			}	
			
			//loading from storage
			function getStorage(){
				var current = localStorage["favorites"];
				var data = {};
				if(typeof current != "undefined") data=window.JSON.parse(current);
				return data;
			}
			
			//Checking storage
			function hasInStorage(id){
				return (id in getStorage());
			}		

			//Adding to storage
			function removeFromStorage(id,label){
				if (hasInStorage(id)) {
					var data = getStorage();
					delete data[id];
					console.log('removed '+id);
					saveStorage(data);
				}
			}	
			
			//save storage
			function saveStorage(data){
				console.log("To store...");
				console.dir(data);
				localStorage["favorites"] = window.JSON.stringify(data);
			}
	
		}		

	});
	&lt;/script&gt;

&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" id="homePage"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Art Browser&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content" id="homePageContent"&gt;	
		&lt;ul data-role="listview" data-inset="true"&gt;
			&lt;cfoutput query="categories"&gt;
				&lt;li&gt;&lt;a href="category.cfm?id=#mediaid#&media=#urlEncodedFormat(mediatype)#"&gt;#mediatype#&lt;/a&gt; &lt;span class="ui-li-count"&gt;#total#&lt;/span&gt;&lt;/li&gt;
			&lt;/cfoutput&gt;
        &lt;/ul&gt;  
		
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

Ok - a bit more going on here. I'll take it step by step. On top I've got two utility functions taken based on code from the DiveIntoHTML5 site. One checks for local storage support and one for JSON. It's probably overkill for mobile, but it doesn't hurt. Notice that I check both of these functions before I do anything else. It occurs to me that I wrapped up a lot of code in that IF and I should have simply exited the document.ready event handler instead. 

<p/>

I begin by using the "pageshow" event for my art detail page to decide if I should show the "Add to" or "Remove from" buttons. The hasInStorage function is defined later on and is just a utility I wrote for my code to quickly see if a particular art piece is favorited. I'll show that art page in a bit so you can see the HTML differences.

<p/>

The next two functions listen for clicks on the new buttons. Notice the "vclick" listener. This is not - as far as I know - actually documented. At least 5 of my gray hairs this week came from this. Apparently this is the new way to listen in for click events on multiple devices. It's in the jQuery Mobile blog, but again, it isn't documented. When I went live and tested my code, it had worked fine in Chrome but not at all in iOS or Android. Apparently this is why. <b>Very frustrating!</b> Notice - when you click, I use the built in changePage utility to load a page. But this is the cool thing - I can turn this into a dialog by adding a role attribute. So basically - addtofav.cfm and removefromfav.cfm are normal pages - but because of how I tell jQuery Mobile to load them, turn turn into dialogs. Sweet.

<p/>

Moving down - the next two event handlers are for the actual confirmations. Nothing special there. They call my utility functions defined later on to change local storage values.

<p/>

Ok - so here is the part I <i>really</i> struggled with and where aaraonpadoshek helped. I needed a way to say, "When the page loads, write out the list." Unfortunately, the pageshow event, which runs every time, <i>also runs before the page initializes</i>. Read that again - it runs every time the page shows and also before it's even fully drawn. There's a pageinit method which does run after the page initializes but only runs once. So when I used pageshow and tried to change my list, I got an error because jQuery Mobile hadn't added the magical unicorn dust yet to make it pretty. When I used pageinit it worked... once. Here's where Aaron's code helped. Notice we have pagebeforeshow being listened for now. It now detects in the list exists in the DOM. If it doesn't, we create it and initialize it ourselves as a list view. If it does exist, we update it using refresh. I'll be honest and say this still is a bit... fuzzy... in my mind. But it works! And that's good enough for me. I've got a bit of DRY going on there with the display but I'll fix that later.

<p/>

Moving down - you can now see my functions for working with local storage. To be honest, it's all pretty trivial. I've got a function to add and remove, to check for existence, and to get and persist. I added wrappers for them because I'm using JSON to store the data. Now let's look at the update to art.cfm:

<p/>

<pre><code class="language-markup">
&lt;div class="addToFavoritesDiv" style="display:none"&gt;&lt;a href="" data-role="button" data-artid="#art.id#"&gt;Add to Favorites&lt;/a&gt;&lt;/div&gt;
&lt;div class="removeFromFavoritesDiv" style="display:none"&gt;&lt;a href="" data-role="button" data-artid="#art.id#"&gt;Remove from Favorites&lt;/a&gt;&lt;/div&gt;
</code></pre>

<p/>

That's the two buttons. Notice they are both hidden by default. Also note the use of data-artid to store in the primary key I'll use later. Now let's look at addtofav.cfm. I won't bother with the remove as it's pretty much the same.

<p/>

<pre><code class="language-markup">
&lt;cfparam name="url.id"&gt;
&lt;cfset art = application.artservice.getArtPiece(url.id)&gt;

&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Add to Favorites?&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.6.1.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0b1/jquery.mobile-1.0b1.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" id="addToFavoritesDialog"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Add to Favorites?&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;p&gt;
		&lt;cfoutput&gt;
		&lt;a href="" data-role="button" data-theme="b" data-artid="#url.id#" data-artname="#art.name#" class="addToFavoritesButton"&gt;Yes!&lt;/a&gt;
		&lt;a href="art.cfc?id=#url.id#" data-rel="back" data-role="button"&gt;No thank you&lt;/a&gt;
		&lt;/cfoutput&gt;
		&lt;/p&gt;	
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p/>

Nothing fancy here either. Just simple content with some buttons. Here's a shot of the art view:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip142.png" />

<p/>

And here's a shot of the dialog.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip143.png" />

<p/>

And finally - the new home page:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip144.png" />

<p/>

Whew! Done. By the way, I'll also point out another issue I had. When I first tested on a mobile device, the text was incredibly small. I got a nice tweet from @jquerymobile pointing out that in beta1, you need to include a new meta tag in your page templates:

<p/>

<pre><code class="language-markup">
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt; 	
</code></pre>

<p/>

Adding that helped right away. Ok - that's it. I've included a zip below and you can play with this yourself via the uber Demo button. Enjoy.

<p/>

<p><a href='https://static.raymondcamden.com/enclosures/artbrowser.zip'>Download attached file.</a></p>
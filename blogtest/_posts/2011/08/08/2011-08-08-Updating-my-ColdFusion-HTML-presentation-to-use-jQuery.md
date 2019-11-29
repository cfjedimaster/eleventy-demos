---
layout: post
title: "Updating my ColdFusion HTML presentation to use jQuery"
date: "2011-08-08T17:08:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/08/08/Updating-my-ColdFusion-HTML-presentation-to-use-jQuery
guid: 4320
---

So a few hours ago I <a href="http://www.raymondcamden.com/index.cfm/2011/8/8/cfpresentation-and-HTML-slides">blogged</a> about how you can use the cfpresentation tag to create an HTML-based presentation. As I mentioned in the blog post, the output works, but, is a bit atrocious. It looks like I designed it. Drunk. (To be fair, I'd probably do better design if I was drinking.) I spent a few minutes Googling today to see if I could find a nicer example, one based on jQuery. It didn't take long at all. I turned up this blog entry, <a href="http://www.jay-han.com/2011/07/21/8-html-presentation-plugins-that-you-can-use/">8 HTML presentation plugins that you can use</a>, and decided to play around a bit.
<!--more-->
<p>

After looking at a couple of them, I decided my favorite was the simple <a href="http://www.viget.com/inspire/jquery-presentation-plugin/">jQuery Presentation Plugin</a> by Trevor Davis. It wasn't the sexiest of them all, but it was the easiest to work with. (I also liked the <a href="http://code.google.com/p/html5slides/">html5slides</a> project, but I don't like presentations that show you a bit of the next slide on screen. I think it's distracting to the audience.) Here's how simple his code is to use:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html class="no-js"&gt;
  &lt;head&gt;
    &lt;title&gt;jQuery Presentation Plugin&lt;/title&gt;
    &lt;meta http-equiv="Content-type" content="text/html; charset=utf-8" /&gt;
    &lt;script type="text/javascript"&gt;(function(H){% raw %}{H.className=H.className.replace(/\bno-js\b/,'js')}{% endraw %})(document.documentElement)&lt;/script&gt; 
    &lt;link href="stylesheets/screen.css" type="text/css" rel="stylesheet" media="Screen,projection" /&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="header"&gt;
      &lt;div class="container"&gt;
        &lt;h1&gt;jQuery Presentation Plugin&lt;/h1&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div id="content"&gt;
      &lt;div id="slides"&gt;
        &lt;div class="slide"&gt;
          &lt;h2&gt;Slide 1&lt;/h2&gt;
          &lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;
          &lt;ul&gt;
           &lt;li&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation&lt;/li&gt;
           &lt;li&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/li&gt;
           &lt;li&gt;Here is a short list item&lt;/li&gt;
          &lt;/ul&gt;
         
        &lt;/div&gt;
        &lt;div class="slide"&gt;
          &lt;h2&gt;Slide 2&lt;/h2&gt;
          &lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;
        &lt;/div&gt;
        &lt;div class="slide"&gt;
          &lt;h2&gt;Slide 3&lt;/h2&gt;
          &lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;
        &lt;/div&gt;
        &lt;div class="slide"&gt;
          &lt;h2&gt;Slide 4&lt;/h2&gt;
          &lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;
        &lt;/div&gt;
        &lt;div class="slide"&gt;
          &lt;h2&gt;Slide 5&lt;/h2&gt;
          &lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div id="footer"&gt;
      &lt;div class="container"&gt;
        &copy; 2010 Trevor Davis Viget Labs
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;script type="text/javascript" src="scripts/jquery.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="scripts/jquery.presentation.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="scripts/global.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As you can see, it's just a collection of DIV tags. The presentation is enabled in global.js, but is just this few lines of code:

<p>

<code>
$(document).ready(function(){
  $('#slides').presentation();
});
</code>

<p>

If you want to see this live on my server, just click here: <a href="http://www.coldfusionjedi.com/demos/aug82011/preso/index.htm">http://www.coldfusionjedi.com/demos/aug82011/preso/index.htm</a>. Note that you can use the left and right arrow to navigate. Also note that the URL changes as you advance. This means you can deep link (for example, <a href="http://www.viget.com/uploads/file/jquery-presentation/#3">slide 3</a>) to a particular slide. I whipped up a quick example using ColdFusion. I apologize for doing yet another art browser. 

<p>

<code>
&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select	artid, artname, description, price, largeimage, mediatype, firstname, lastname
from	art
left join media on art.mediaid = media.mediaid
left join artists on art.artistid = artists.artistid
&lt;/cfquery&gt;

&lt;!DOCTYPE html&gt;
&lt;html class="no-js"&gt;
  &lt;head&gt;
    &lt;title&gt;Art Presentation&lt;/title&gt;
    &lt;meta http-equiv="Content-type" content="text/html; charset=utf-8" /&gt;
    &lt;script type="text/javascript"&gt;(function(H){% raw %}{H.className=H.className.replace(/\bno-js\b/,'js')}{% endraw %})(document.documentElement)&lt;/script&gt; 
    &lt;link href="stylesheets/screen.css" type="text/css" rel="stylesheet" media="Screen,projection" /&gt;
	&lt;style&gt;
		.artImage {
			float:right;	
			margin-top: 10px;
			margin-left: 10px;
			width: 250px;
			height: 250px;
		}
	
	&lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="header"&gt;
      &lt;div class="container"&gt;
        &lt;h1&gt;jQuery Presentation Plugin&lt;/h1&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div id="content"&gt;
      &lt;div id="slides"&gt;

        &lt;div class="slide"&gt;
          &lt;h2&gt;Art Browser&lt;/h2&gt;
          &lt;p&gt;Welcome to our Art Browser. It is the most beautiful presentation you will see today...&lt;/p&gt;
        &lt;/div&gt;

		&lt;cfoutput query="getArt"&gt;
			
        &lt;div class="slide"&gt;
          &lt;h2&gt;#artname#&lt;/h2&gt;
		  	&lt;p&gt;
			&lt;img src="artgallery/#largeimage#" class="artImage" &gt;
		  		&lt;b&gt;Artist:&lt;/b&gt; #firstname# #lastname#&lt;br/&gt;
				&lt;b&gt;Media:&lt;/b&gt; #mediatype#&lt;br/&gt;
				&lt;b&gt;Price:&lt;/b&gt; #dollarFormat(price)#&lt;br/&gt;
				#description#
			&lt;/p&gt; 
        &lt;/div&gt;

		&lt;/cfoutput&gt;
		


      &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div id="footer"&gt;
      &lt;div class="container"&gt;
        &copy; 2010 Trevor Davis Viget Labs
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;script type="text/javascript" src="scripts/jquery.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="scripts/jquery.presentation.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="scripts/global.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As you can see, I've added a simple query on top. I then replaced the 2nd-N slides with a simple cfoutput. This gives me a title slide and then one slide per piece of art. I could add a concluding slide as well. To see this in action just hit the big ole demo button below.

<p>

<a href="http://www.coldfusionjedi.com/demos/aug82011/preso/index.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>
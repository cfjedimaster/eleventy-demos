---
layout: post
title: "jQuery Tabs and Google Maps"
date: "2009-06-05T14:06:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/06/05/jQuery-Tabs-and-Google-Maps
guid: 3385
---

A reader wrote in earlier this week about an issue with Google Maps and jQuery tabs. He was trying to use a Google Map in one tab but the map wasn't rendering correctly. Here is a quick example showing what went wrong.
<!--more-->
First, a simple HTML page with tabs and a map in the third tab:

<code>
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta name="viewport" content="initial-scale=1.0, user-scalable=no" /&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;
&lt;link type="text/css" rel="stylesheet" href="theme/ui.all.css" /&gt;

&lt;script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=abcdefg&sensor=false"
            type="text/javascript"&gt;&lt;/script&gt;

&lt;script src="jquery-1.3.1.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-personalized-1.6rc6.js"&gt;&lt;/script&gt;
&lt;script&gt;
var map

$(document).ready(function() {

	$("#example").tabs();		

	if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("third-tab"));
		map.setCenter(new GLatLng(-34.397,150.644), 13)
    }

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
&lt;div id="example" style="width:600;height:250"&gt;
     &lt;ul&gt;
         &lt;li&gt;&lt;a href="#first-tab"&gt;&lt;span&gt;Content 1&lt;/span&gt;&lt;/a&gt;&lt;/li&gt;
         &lt;li&gt;&lt;a href="#second-tab"&gt;&lt;span&gt;Content 2&lt;/span&gt;&lt;/a&gt;&lt;/li&gt;
         &lt;li&gt;&lt;a href="#third-tab"&gt;&lt;span&gt;Content 3&lt;/span&gt;&lt;/a&gt;&lt;/li&gt;
     &lt;/ul&gt;
	 
	 &lt;div id="first-tab"&gt;
	 This is the first tab.
	 &lt;/div&gt;

	 &lt;div id="second-tab"&gt;
	 This is the second tab.
	 &lt;/div&gt;

	 &lt;div id="third-tab"&gt;
	 &lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I've blogged about jQuery tabs before (check the <a href="http://jqueryui.com/demos/tabs/">official docs</a> for more information), so the only thing new here for my readers would be the Google Maps code. This was the first time I had ever played with them, so I went with their simplest example possible. (Actually, I did it on a page by itself first so I could see it working without the tabs.) Like all things Google, the API is incredibly powerful and complex to use. When run though, the problem is pretty evident:

<img src="https://static.raymondcamden.com/images//Picture 72.png">

Notice how the map doesn't fill the tab? The Tabs docs actually <a href="http://jqueryui.com/demos/tabs/#...my_slider.2C_Google_Map.2C_sIFR_etc._not_work_when_placed_in_a_hidden_.28inactive.29_tab.3F">cover</a> this issue a bit, but the advice they give doesn't work with the latest Google Maps API. Specifically they suggest the resizeMap() method which isn't a valid call. This led me to dig around some more and find there was something similar: checkResize(). 

I used the code from the jQuery site to execute when the 3rd tag was selected:

<code>
$('#example').bind('tabsshow', function(event, ui) {
    if (ui.panel.id == "third-tab") {
        map.checkResize()
    }
})
</code>

Unfortunately, this produced the same result. Then it occured to me - what if the map was resizing to some DIV/SPAN/whatever that jQuery Tabs created and the height wasn't the same as what I was seeing. On a whim I tried:

<code>
$('#example').bind('tabsshow', function(event, ui) {
    if (ui.panel.id == "third-tab") {
	$(ui.panel).css("height","100%")
        map.checkResize()
    }
})
</code>

This was close... but not exactly right:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 8.png">

It <i>kinda</i> looks like the 100% is referring to the complete tab (content and the header), but not quite exactly. I kept playing around and finally ended up with a hard coded exact number, 170. That seemed to work ok:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 9.png">

Obviously this involved a lot of grunt work and reloading, and obviously if you change the height of the main tab div you would have to change the number. 

If I can make it run a bit better I'll let folks know.
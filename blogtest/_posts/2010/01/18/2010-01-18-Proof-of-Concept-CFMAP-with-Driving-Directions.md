---
layout: post
title: "Proof of Concept - CFMAP with Driving Directions"
date: "2010-01-18T14:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/01/18/Proof-of-Concept-CFMAP-with-Driving-Directions
guid: 3685
---

Earlier today a <a href="http://www.raymondcamden.com/index.cfm/2009/12/27/CFMAP-and-Centering#c95CCD361-B715-20D5-A375B11FE73D1255">reader asked</a> about driving directions and CFMAP. At lunch I worked on a quick proof of concept. Please note that this could be done better, cleaner, etc, but it works, and is kinda cool, so hopefully it is enough to get people started.

<p>

First, I began by looking at the reference guide for <a href="http://code.google.com/apis/maps/documentation/reference.html#GDirections.load">directions</a> under Google Maps. It begins with the creation of a directions object. Once you have that, you can then load a query and have it auto-populate the results. And.... well that's it! You can tweak things up quite a bit as the docs show, but here is a quick example you can play with:

<p>

<code>
&lt;cfset theAddress = "Lafayette, LA"&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#doDirections").click(function() {
		var youraddy = $.trim($("#youraddress").val())
		if(youraddy == '') return
		console.log('Directions from '+youraddy)
		var mapOb = ColdFusion.Map.getMapObject("themap")
		var dir = new GDirections(mapOb, document.getElementById('result'))
		&lt;cfoutput&gt;
		dir.load("from: "+youraddy +" to: #theAddress#")
		&lt;/cfoutput&gt;
		console.log('done')
	})
})
&lt;/script&gt;
&lt;style&gt;
#result {
	width:500px;
	height: 500px;
	overflow: auto;

}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfmap name="themap" centeraddress="#theAddress#" width="400" height="400" zoomlevel="9"&gt;
&lt;p&gt;
&lt;form&gt;
Your Address &lt;input type="text" name="youraddress" id="youraddress" value="San Francisco, CA"&gt;&lt;br/&gt;
&lt;input type="button" id="doDirections" value="Get Directions"&gt;
&lt;/form&gt;
&lt;p&gt;

&lt;div id="result"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I'm going to jump around a bit here so please forgive me. (I find that the way I write CFML does not lead itself well to actually <i>teaching</i> or writing about it well!) The very first line hard coded an address. This would be the store or other location you want to display to your users. At the bottom of the script you can see where I use this within the CFMAP tag. Below it I've created a simple form. I hard coded in San Francisco to save myself some typing. 

<p>

Now if we hop back to the top you can see my jQuery code. I've bound to the button click action. I get the address and ensure something is there. Once I have it then I get the map object (that line of code should be moved up and out of this event handler, I shouldn't be regrabbing it for every click). I then make a new instance of the GDirections object. I give it my map and a pointer to my div that will be used for the results. (jQuery provides a way to do that of course but I forgot and was in a rush!) Next I do the load operation. This takes a string of the form: 

<p>

from: somelocation to: somelocation

<p>

For my demo, the to is hard coded and the from is based on your input. And that's it. The result will get dumped into my div. If I wanted to I could extract out individual bits of it but for now it works fine as is. You can demo this here: <a href="http://www.coldfusionjedi.com/demos/jan182010/test3.cfm">http://www.coldfusionjedi.com/demos/jan182010/test3.cfm</a>

One quick note - I warned folks this is a proof of concept so it shouldn't be used without more testing, but I want to point out one serious mistake that should be corrected. The jQuery document.ready event I use here <b>can</b> and probably <b>will</b> fire before the map is loaded. I should have used ColdFusion's ajaxLoad function to register the setup call. That's a 2 second fix but I wanted to make sure folks remembered that.
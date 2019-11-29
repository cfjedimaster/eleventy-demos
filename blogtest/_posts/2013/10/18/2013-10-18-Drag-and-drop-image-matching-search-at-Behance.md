---
layout: post
title: "Drag and drop image matching search at Behance"
date: "2013-10-18T13:10:00+06:00"
categories: [design,html5,javascript]
tags: []
banner_image: 
permalink: /2013/10/18/Drag-and-drop-image-matching-search-at-Behance
guid: 5063
---

<p>
So, I promise, this is the last <a href="http://www.behance.net">Behance API</a> demo this week. I don't know why this has been on my mind so much, but, screw it, when inspiration strikes I just go along with it. For today's demo I'm going to show something a bit different - search by color.
</p>
<!--more-->
<p>
As you can probably guess, Behance allows us to search for projects that match a certain color (or color range). Building that into my API would be kinda boring, so I decided to build something cooler. Imagine being able to simply drop a picture onto your browser and have it return matching projects?
</p>

<p>
Here is an example. In the screen shot below, the image you see on the top left is one I dragged directly from my desktop. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss1.jpg" />
</p>

<p>
And another one. (Again, the image on the top left, the kitten, came from my computer.)
</p>

<p>
<img src="https://static.raymondcamden.com/images/skitch.jpg" />
</p>

<p>
Ok, so how is it done? For the most part, pretty simply. The drag and drop aspect is rather trivial and I've blogged on it before. Here is that code snippet.
</p>

<pre><code class="language-javascript">
$(document).ready(function() {
	
	//Set my key
	behanceAPI.setKey(behancekey);
	
	imgDom = $("#droppedImage");
	resultsDom = $("#results");
	
	$(document).on("drop", dropHandler);
	$(document).on("dragover", dragOverHandler);

});

//I simply validate the type
function validFile(s) {
	if(s.match("image/*")) return true;
	return false;
}

function dragOverHandler(e) {
	e.preventDefault();
}

function dropHandler(e) {
	e.stopPropagation();
	e.preventDefault();
	 
	if(!e.originalEvent.dataTransfer.files) return;
	var files = e.originalEvent.dataTransfer.files;
	var count = files.length;
	if(!count) return;
	 
	//Only one file allowed
	if(count &gt; 1) {
		window.alert("You may only drop one file.");
		return;
	}

	var file = files[0];
	
	if(!validFile(file.type)) {
		window.alert("You must drop an image.");
		return;
	}
	
	var reader = new window.FileReader();
	reader.onload = function (e) {
		imgDom.attr("src",e.target.result);
		imgDom.on("load", function(e) {
			doColor();
		});
	};
	reader.readAsDataURL(file);

}</code></pre> 

<p>
Next - I make use of <a href="http://lokeshdhakar.com/projects/color-thief/">ColorThief</a>, a library I've mentioned a few times here. It has a function to return the dominant color of a photo.
</p>

<pre><code class="language-javascript">function doColor() {
	var imageResults = [];
	
	console.log("do color");	
	var colorThief = new ColorThief();
	//dominantColor = getDominantColor(imgDom);
	var dom = colorThief.getColor(imgDom[0]);</code></pre> 

<p>
This returns an array of colors. From that I can build a RGB string and pass it to a new method of my API I built to support the search API. Note that Behance supports ranges as well. I could make my demo a bit cooler if I created a range based on the color I got. ColorThief also supports returning a set of dominant colors. I could use that API and perform multiple Behance searches to return a collected set of possible matches.
</p>

<pre><code class="language-javascript">	var rgb = dom[0].toString(16) + dom[1].toString(16) + dom[2].toString(16);
	
	resultsDom.html("&lt;i&gt;Searching Behance for stuff like this - prepare for teh awesome...&lt;/i&gt;");
	
	//Ok, now search by color
	behanceAPI.getProjectsByColor(rgb, function(p) {
		console.log("back from the api");
		//gather up the biggest images possible (nah, just check 2 biggest
		for(var i=0;i&lt;p.length;i++) {
			if(p[i].covers[404]) {
				imageResults.push(p[i].covers[404]);	
			} else if(p[i].covers[230]) {
				imageResults.push(p[i].covers[230]);				
			}
		}

		var html = "";
		for(var i=0;i&lt;imageResults.length;i++) {
			html += "&lt;img src='" + imageResults[i] + "'&gt;&lt;br/&gt;";
		}
		resultsDom.html(html);
	});
</code></pre> 

<p>
And that's it. I've actually put the demo online so you can see, <strong>but please remember that Behance limits API calls to 150 an hour.</strong> Based on the average traffic of my blog that limit will probably be blown away. But you may get lucky. I've attached the code as a zip as well.
</p>

<a href="http://www.raymondcamden.com/demos/2013/oct/18/ct_demo.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive33%{% endraw %}2Ezip'>Download attached file.</a></p>
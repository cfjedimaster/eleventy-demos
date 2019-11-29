---
layout: post
title: "Demo of Color Palettes and PhoneGap"
date: "2012-01-13T13:01:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/01/13/Demo-of-Color-Palettes-and-PhoneGap
guid: 4495
---

Earlier today I discovered the excellent <a href="http://lokeshdhakar.com/projects/color-thief/">Color Thief</a> JavaScript library by Lokesh Dhakr. Color Thief gives you the ability to find the dominant color of a picture, or a palette of major colors. Check the <a href="http://lokeshdhakar.com/projects/color-thief/">site</a> for examples. I thought it would be interesting to wrap this into a PhoneGap project and create palettes based on your camera. Here's what I came up with.
<!--more-->
<p>

First off, if you've never looked at PhoneGap's <a href="http://docs.phonegap.com/en/1.3.0/phonegap_camera_camera.md.html#Camera">Camera</a> API, it's worth taking a quick peak at their documentation. The basics you should be aware of is that PhoneGap can work with either new pictures taken with the camera or existing ones saved to the device. You can control height, width, quality, and how the data is handed over to you. 

<p>

I began by working with two buttons - one to let you take a new picture and one to let you select an existing one.

<p>

<pre><code class="language-markup">
&lt;input type="button" id="takePictureBtn" value="Take Picture"&gt;
&lt;input type="button" id="picPictureBtn" value="Select Picture"&gt;
</code></pre>

<p>

These buttons then were hooked up with event listeners:

<p>

<pre><code class="language-javascript">
$("#takePictureBtn").click(takePic);
$("#picPictureBtn").click(selectPic);


function takePic(e){
	navigator.camera.getPicture(picSuccess, picFail, {% raw %}{quality:75, targetWidth:desiredWidth, targetHeight:desiredWidth, sourceType:Camera.PictureSourceType.CAMERA, destinationType:Camera.DestinationType.FILE_URI}{% endraw %});
	}

function selectPic(e) {
	navigator.camera.getPicture(picSuccess, picFail, {% raw %}{quality:75, targetWidth:desiredWidth, targetHeight:desiredWidth, sourceType:Camera.PictureSourceType.PHOTOLIBRARY, destinationType:Camera.DestinationType.FILE_URI}{% endraw %});
	}
</code></pre>

<p>

In both cases, the picture's file URI is sent to a success handler. I simply then assign that to an empty image:

<p>

<pre><code class="language-javascript">
function picSuccess(imageURI) {
	$("#yourimage").attr("src",imageURI);
}
</code></pre>

<p>

Now for the fun part. The Color Thief API is rather simple, but when I switched from a static image to a dynamic one, I noticed I ran into errors. Turns out - I was trying to run the code before the image was fully loaded. I therefore added a new event listener:

<p>

<pre><code class="language-javascript">
$("#yourimage").load(getSwatches);
</code></pre>

<p>

The getSwatches function then will handle getting the color palette and assigning them to a set of swatches below the image:

<p>

<pre><code class="language-javascript">
function getSwatches(){
	var colorArr = createPalette($("#yourimage"), 5);
	for (var i = 0; i &lt; Math.min(5, colorArr.length); i++) {
		$("#swatch"+i).css("background-color","rgb("+colorArr[i][0]+","+colorArr[i][1]+","+colorArr[i][2]+")");
	}
}	
</code></pre>

<p>

And the results? Here are some samples:

<p>

<img src="https://static.raymondcamden.com/images/shot1.png" />

<p>

<img src="https://static.raymondcamden.com/images/shot3.png" />

<p>


<img src="https://static.raymondcamden.com/images/shot4.png" />

<p>

<img src="https://static.raymondcamden.com/images/shot5.png" />

<p>

I've included a zip of the project below. You will find the code in the assets folder and an APK in the bin folder.<p><a href='https://static.raymondcamden.com/enclosures/ColorThief.zip'>Download attached file.</a></p>
---
layout: post
title: "An example of Cordova's Camera PopoverOptions"
date: "2014-07-23T10:07:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/07/23/An-example-of-Cordovas-Camera-PopoverOptions
guid: 5273
---

<p>
One of the interesting features in Cordova's <a href="https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md">Camera API</a> is something called popoverOptions. While the docs do explain what this feature does, it may not be entirely clear how it works so I whipped up a quick example, with screen shots, to demonstrate what it does.
</p>
<!--more-->
<p>
First off - this feature is <strong>only for iOS (and the iPad at that)</strong> and <strong>only for existing pictures</strong>, it is not something you can use when having the user take new pictures. So right away you can see this is something that will have limited usage. But what exactly does it do? The docs say:
</p>

<blockquote>
iOS-only parameters that specify the anchor element location and arrow direction of the popover when selecting images from an iPad's library or album.
</blockquote>

<p>
The options include:
</p>

<ul>
<li>X and Y values to anchor the popover. This makes sense.
<li>Width and height for the anchor. This didn't quite make sense. My take is - if you are binding the popover to a UI item, then you specify this so iOS knows how big the anchor is, and combined with x and y, it gives it enough data to know how to position it.
<li>An arrowDir property that specifies what direction the popover will be from the anchor. So if you specify a right arrow, the popover will be on the left. Most likely you will use the "any" option to let iOS figure it out.
</ul>

<p>
Let's look at a simple example. I built a very simple HTML page that includes a button for prompting the user to select an image as well a blank image (styled red) that will serve as my anchor. Here is the HTML.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        &lt;link rel=&quot;stylesheet&quot; type=&quot;text&#x2F;css&quot; href=&quot;css&#x2F;app.css&quot; &#x2F;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;img id=&quot;canvas&quot; &#x2F;&gt;
	&lt;button id=&quot;startCamera&quot;&gt;Start Camera Test&lt;&#x2F;button&gt;

	&lt;script src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;	
	&lt;script src=&quot;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
I used a bit of CSS to specify the position and size of the image:
</p>

<pre><code class="language-css">
body {
	margin-top: 20px;
}

#canvas {
	position: absolute;
	left: 300px;
	top: 300px;
	background-color: red;
	width: 200px;
	height: 200px;
}
</code></pre>

<p>
Now let's look at the JavaScript code.
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	document.querySelector(&quot;#startCamera&quot;).addEventListener(&quot;touchend&quot;, startCamera, false);
}

var cameraPopoverHandle;

function startCamera() {

	cameraPopoverHandle = navigator.camera.getPicture(onSuccess, onFail,
     { destinationType: Camera.DestinationType.FILE_URI,
       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
       popoverOptions: new CameraPopoverOptions(300, 300, 200, 200, Camera.PopoverArrowDirection.ARROW_ANY)
     });

}

function onSuccess(u) {
	console.log(&#x27;onSuccess&#x27;);
	document.querySelector(&quot;#canvas&quot;).src = u;
}

function onFail(e) {
	console.log(&#x27;onFail&#x27;);
	console.dir(e);
}

 &#x2F;&#x2F; Reposition the popover if the orientation changes.
 window.onorientationchange = function() {
 	console.log(&#x27;running onorientationchange&#x27;);
	var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
    cameraPopoverHandle.setPosition(cameraPopoverOptions);
 }</code></pre>

<p>
Basically, all we have here is a touch handler for the button that fires off a call to the Camera API. Notice we passed in popover options. The X, Y, Width, and Height attributes are based on the CSS I used for the image. Finally, there is a bit of code to handle orientation changes that I took right from the docs. More on that in a minute. So let's look at this in action.
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jul 23, 2014, 8.42.12 AM.png" />
</p>

<p>
Note how the popover is anchored to my image DOM element. Note too how it is positioned automatically. Once an image is selected, the popover automatically goes away and the rest of my code is fired.
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jul 23, 2014, 8.43.58 AM.png" class="bthumb" />
</p>

<p>
That's mostly it. It's a simple change and it does work better for tablets. You would need to add a bit of logic to see if this is an iPad. Remember that the <a href="https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md">Device API</a> makes this trivial. Although in my testing it didn't really matter. I switched to the iPhone and the popover options were simply ignored. 
</p>

<p>
Now let's talk about the orientation change. I got this right from the docs and it certainly makes sense, but oddly, it seems as if the X,Y values are ignored. Based on the code from the docs, it seems like it should reposition to 0,0 and assume an anchor size of 100,100. I <i>should</i> have used better values for that, but I wanted to test it as is at first. In my testing, these values seemed to have no impact. In fact, if I remove the code completely, iOS still handles the orientation change ok. If I get some clarification on why this is I'll update the code accordingly.
</p>

<p>
As before, I've put this up on GitHub in case you want to quickly test: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/popovertest">https://github.com/cfjedimaster/Cordova-Examples/tree/master/popovertest</a>
</p>
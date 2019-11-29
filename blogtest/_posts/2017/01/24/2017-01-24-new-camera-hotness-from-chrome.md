---
layout: post
title: "New Camera Hotness from Chrome"
date: "2017-01-24T08:44:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/canary_cam0.jpg
permalink: /2017/01/24/new-camera-hotness-from-chrome
---

First off - I apologize for the somewhat lame title. It occurred to me today that it's been a while since I played with new and 
upcoming web standards, and as I recently discovered Chrome was introducing some *really* cool stuff around camera support, I thought
it would be fun to explore a bit. Specifically I'm talking about the "Image Capture" API. This API provides access to the camera and 
supports taking pictures (of course) as well as returning information about the camera hardware itself. Looking into this API led me to
another new API, [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices), which replaces the older getUserMedia that you may
have seen in the past.

I've blogged about this topic in the past. Back in 2013, I wrote ["Capturing camera/picture data without PhoneGap"](https://www.raymondcamden.com/2013/05/20/capturing-camerapicture-data-without-phonegap/). In
that post I made use of the <code>capture</code> of the input tag to let users select from their device camera. That post got so much traffic, 
I revisited it last year: ["Capturing camera/picture data without PhoneGap - An Update"](https://www.raymondcamden.com/2016/06/03/capturing-camerapicture-data-without-phonegap-an-update). 
In that post, I looked more at the capture argument and the various different ways of using it.

With the Image Capture API, we've got something we can use directly in JavaScript without an input tag. In order to use it, you need to either
enable an ["origin trial"](https://github.com/jpchase/OriginTrials/blob/gh-pages/developer-guide.md) in Chrome 56, which will be out very soon, or use
Canary and enable "Experimental Web Platform" in flag. I tested with Canary - which as a reminder is also available on Android devices. You can't use this
at all on iOS. 


Here is a simple example, taken from
the [excellent blog post](https://developers.google.com/web/updates/2016/12/imagecapture) by Google.

First - request access to the camera. This gives a visible prompt to the user:

<pre><code class="language-javascript">
navigator.mediaDevices.getUserMedia({% raw %}{video: true}{% endraw %})
.then(gotMedia)
.catch(error => console.error('getUserMedia() error:', error));
</code></pre>

First and foremost - notice it is promised base. Woot. That argument to <code>getUserMedia</code> is how we tell the browser what we want to access. This
will also impact the warning the end user gets. As an aside, you can go batshit crazy in that argument. While I was digging around the MDN docs
for [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), I found out you have options for the resolution you want,
and by options, I mean min, max, desired and required. That's freaking cool. I can imagine for someone taking pictures for legal, or maybe
scientific purposes, you may want to demand a certain level of fidelity before working with the camera. This is also where you can ask for the front
or rear facing camera, and again, what's cool is that your code can say you *want* the rear camera or you *require* it. It's a bit off topic for
this post, but later on click that link and see how precise you can get. 

Anyway, once you have access to the device camera, taking a picture is trivial:

<pre><code class="language-javascript">
$img = document.querySelector('#testResult');

const mediaStreamTrack = mediaStream.getVideoTracks()[0];
const imageCapture = new ImageCapture(mediaStreamTrack);

imageCapture.takePhoto()
.then(res => {
	$img.src = URL.createObjectURL(res);
});
</code></pre>

In the sample above, $img is an img tag in the DOM. I simply ask for the picture and then display it. 

The API also supports grabbing a frame (called, funny enough, <code>grabFrame</code>) from a video stream and 
returns a slightly different, lower resolution, form of the image. 

Lastly, and this was the really fascinating part, you can ask for the camera settings (<code>getPhotoCapabilities</code>) and set options (like zoom) as well (<code>setOptions</code>). 

So with that in mind, I built a simple demo that would demonstrate capturing an image as well as getting the capabilities of the camera. To 
make it even more interesting, I added in <code>[enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices)</code>, part of the MediaDevices API, which does
pretty much what you think it does. Let's look at the code, front end first even though it's not doing much.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;button id=&quot;takePictureButton&quot;&gt;Take a Picture&lt;&#x2F;button&gt;&lt;br&#x2F;&gt;
		&lt;img id=&quot;testResult&quot; style=&quot;max-width: 400px;max-height:400px&quot;&gt;

		&lt;div id=&quot;capaDiv&quot;&gt;&lt;&#x2F;div&gt;

		&lt;div id=&quot;devDiv&quot;&gt;&lt;&#x2F;div&gt;
		
		&lt;script src=&quot;app1.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

Nothing much here except for a button and a few empty DOM items I'll fill up later. Now for the code - and to be clear, a lot of code here is taken/modified
from the Google/MDN demos.

<pre><code class="language-javascript">
let $button, $img, $capa, $dev;

document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);
function init() {

	$button = document.querySelector(&#x27;#takePictureButton&#x27;);
	$img = document.querySelector(&#x27;#testResult&#x27;);
	$capa = document.querySelector(&#x27;#capaDiv&#x27;);
	$dev = document.querySelector(&#x27;#devDiv&#x27;);

	console.log(&#x27;Ok, time to test...&#x27;);

	navigator.mediaDevices.getUserMedia({% raw %}{video: true}{% endraw %})
	.then(gotMedia)
	.catch(error =&gt; console.error(&#x27;getUserMedia() error:&#x27;, error));
}

function gotMedia(mediaStream) {

	const mediaStreamTrack = mediaStream.getVideoTracks()[0];
	const imageCapture = new ImageCapture(mediaStreamTrack);

	&#x2F;&#x2F;sniff details
	imageCapture.getPhotoCapabilities().then(res =&gt; {
		console.log(res);
		&#x2F;*
		hard coded dump of capabiltiies. i know for most 
		items there are keys under them, but nothing more complex
		*&#x2F;
		let s = &#x27;&lt;h2&gt;Capabilities&lt;&#x2F;h2&gt;&#x27;;
		for(let key in res) {
			s += &#x27;&lt;h3&gt;&#x27;+key+&#x27;&lt;&#x2F;h3&gt;&#x27;;
			if(typeof res[key] === &quot;string&quot;) {
				s += &#x27;&lt;p&gt;&#x27;+res[key]+&#x27;&lt;&#x2F;p&gt;&#x27;;
			} else {
				s += &#x27;&lt;ul&gt;&#x27;;
				for(let capa in res[key]) {
					s += &#x27;&lt;li&gt;&#x27;+capa+&#x27;=&#x27;+res[key][capa]+&#x27;&lt;&#x2F;li&gt;&#x27;;
				}
				s += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			}
			s += &#x27;&#x27;;
		}
		$capa.innerHTML = s;
	});

	&#x2F;&#x2F;sniff devices
	navigator.mediaDevices.enumerateDevices().then((devices) =&gt; {
		console.log(devices);
		let s = &#x27;&lt;h2&gt;Devices&lt;&#x2F;h2&gt;&#x27;;
		&#x2F;&#x2F; https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;API&#x2F;MediaDevices&#x2F;enumerateDevices
		devices.forEach(device =&gt; {
			s += device.kind +&#x27;: &#x27; + device.label + &#x27; id=&#x27;+device.deviceId + &#x27;&lt;br&#x2F;&gt;&#x27;;
		});
		$dev.innerHTML = s;
	});

	$button.addEventListener(&#x27;click&#x27;, e =&gt; {
		console.log(&#x27;lets take a pic&#x27;);
		imageCapture.takePhoto()
		.then(res =&gt; {
			$img.src = URL.createObjectURL(res);
		});
	}, false);
}
</code></pre>

From the top - I grab some DOM items to reuse later, than try to fire off a request to get a device. On my desktop, where I don't have a webcam yet, this
throws an error. (Although I do have a mic, and if I asked for audio support instead, it should work just fine.) Once we get access to 
a camera device, I ask for the photo capabilities and print them to the DOM. I do the same for all the media devices, and finally, you can see 
a simple click handler to support taking pictures. 

The level of detail on the photo capablities is pretty interesting. You get results for:

* White Balance Mode
* Color Temperature
* Exposure Mode
* ISO
* Red Eye Reduction
* Focus Mode
* Brightness
* Contrast
* Saturation
* Sharpness
* Image Height and Image width
* Zoom
* Fill Light Mode

For most of the above, you get min, max, current, and step values. Unfortunately, desktop Canary (on Mac) reported *everything* at zero, but Android's Canary reported
good values. Here is a screen shot from my Pixel C:

<img src="https://static.raymondcamden.com/images/2017/1/canary_cam1.png" title="SS" class="imgborder">

Here is the output from device enumeration on my Surface Book:

<img src="https://static.raymondcamden.com/images/2017/1/canary_cam2.png" title="Devices" class="imgborder">

Ok, let's look at a demo!

Demo 1
---

Back in 2013 when I wrote that first post, my demo code made use of a cool library called [Color Thief](http://lokeshdhakar.com/projects/color-thief/). Color Thief
looks at an image and can return prominent colors. So my first demo simply recreates that. First, the front end:

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;style&gt;
		#testImage {
			width:100%;
		}

		#swatches {
			width: 100%;
			height: 50px;	
		}
		.swatch {
			width:18%;
			height: 50px;
			border-style:solid;
			border-width:thin;	
			float: left;
			margin-right: 3px;	
		}
		&lt;&#x2F;style&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;button id=&quot;takePictureButton&quot;&gt;Take a Picture&lt;&#x2F;button&gt;&lt;br&#x2F;&gt;
		&lt;img id=&quot;testImage&quot;&gt;


		&lt;div id=&quot;swatches&quot;&gt;
			&lt;div id=&quot;swatch0&quot; class=&quot;swatch&quot;&gt;&lt;&#x2F;div&gt;
			&lt;div id=&quot;swatch1&quot; class=&quot;swatch&quot;&gt;&lt;&#x2F;div&gt;
			&lt;div id=&quot;swatch2&quot; class=&quot;swatch&quot;&gt;&lt;&#x2F;div&gt;
			&lt;div id=&quot;swatch3&quot; class=&quot;swatch&quot;&gt;&lt;&#x2F;div&gt;
			&lt;div id=&quot;swatch4&quot; class=&quot;swatch&quot;&gt;&lt;&#x2F;div&gt;
		&lt;&#x2F;div&gt;

		&lt;script src=&quot;color-thief.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app2.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

Not much here - just the UI for taking a picture and the result, empty DOM items to be filled later. Now let's look at the code. (And let me be clear, 
I'm not doing good error handling here.)

<pre><code class="language-javascript">
let $button, $img, imageCapture;

document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);
function init() {

	$button = document.querySelector(&#x27;#takePictureButton&#x27;);
	$img = document.querySelector(&#x27;#testImage&#x27;);

	navigator.mediaDevices.getUserMedia({% raw %}{video: true}{% endraw %})
	.then(setup)
	.catch(error =&gt; console.error(&#x27;getUserMedia() error:&#x27;, error));


}

function setup(mediaStream) {
	$button.addEventListener(&#x27;click&#x27;, takePic);
	$img.addEventListener(&#x27;load&#x27;, getSwatches);

	const mediaStreamTrack = mediaStream.getVideoTracks()[0];
	imageCapture = new ImageCapture(mediaStreamTrack);

}

function takePic() {

	imageCapture.takePhoto()
	.then(res =&gt; {
		$img.src = URL.createObjectURL(res);
	});

}

function getSwatches() {
	let colorThief = new ColorThief();
	var colorArr = colorThief.getPalette($img, 5);
	console.dir(colorArr);
	for (var i = 0; i &lt; Math.min(5, colorArr.length); i++) {
		document.querySelector(&#x27;#swatch&#x27;+i).style.backgroundColor = &quot;rgb(&quot;+colorArr[i][0]+&quot;,&quot;+colorArr[i][1]+&quot;,&quot;+colorArr[i][2]+&quot;)&quot;;		
	}
}
</code></pre>

Essentially this is the same as the previous demo, in terms of getting access and working with <code>takePhoto</code>. The rest of the code then is
the exact same as the demo from three years ago. When I detect a <code>load</code> event in the image, run Color Thief and get the swatches.

Here's a screen shot of it in action - yes - that's me.

![Me](https://static.raymondcamden.com/images/2017/1/canary_cam3.png)

And for comparison, here is myself with Mysterio. (Damnit Marvel, when will we see Mysterio on the big screen??)

![Me and Mysterio](https://static.raymondcamden.com/images/2017/1/canary_cam4.png)

Cool - but can we kick it up a notch?

Demo 2
---

After getting this to work, I thought, why not kick it up a notch? I mentioned earlier that you could grab frames from a video source. What if
we could convert the static demo into a live video feed where color swatches were updated in real time? That would be seriously cool, and enterprise for
sure, definitely enterprise. 

So this turned out to be a bit trickier. In order to work with the images from the video stream, you have to copy them to a canvas, 'paint' it out, 
than use that to feed Color Thief. My solution uses an image that is off the view port (via CSS) and a canvas element made on the fly. (I could have probably
done the image that way too.) I modified the front end like so:

<pre><code class="language-javascript">
&lt;img id=&quot;testImage&quot;&gt;
&lt;video id=&quot;testVideo&quot; autoplay&gt;&lt;&#x2F;video&gt;
</code></pre>

As I said, that image is 'hidden' via CSS:

<pre><code class="language-javascript">
#testImage {
	display:none;
}
</code></pre>

And now the code:

<pre><code class="language-javascript">
let $button, $img, imageCapture, mediaStreamTrack, $video;

document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);
function init() {

	$button = document.querySelector(&#x27;#startVideoButton&#x27;);
	$img = document.querySelector(&#x27;#testImage&#x27;);
	$video = document.querySelector(&#x27;#testVideo&#x27;);

	navigator.mediaDevices.getUserMedia({% raw %}{video: true}{% endraw %})
	.then(setup)
	.catch(error =&gt; console.error(&#x27;getUserMedia() error:&#x27;, error));


}

function setup(mediaStream) {
	$video.srcObject = mediaStream;
	$img.addEventListener(&#x27;load&#x27;, getSwatches);

	mediaStreamTrack = mediaStream.getVideoTracks()[0];
	imageCapture = new ImageCapture(mediaStreamTrack);

	setInterval(getFrame,300);
}

function getFrame() {

		console.log(&#x27;running interval&#x27;);

		imageCapture.grabFrame()
		.then(blob =&gt; {
			&#x2F;&#x2F;console.log(&#x27;im in the got frame part&#x27;);
			let $canvas = document.createElement(&#x27;canvas&#x27;);
			$canvas.width = blob.width;
			$canvas.height = blob.height;
			$canvas.getContext(&#x27;2d&#x27;).drawImage(blob, 0,0, blob.width, blob.height);
			
			$img.src = $canvas.toDataURL(&#x27;image&#x2F;png&#x27;);
		});

}

function getSwatches() {
	let colorThief = new ColorThief();
	var colorArr = colorThief.getPalette($img, 5);
	for (var i = 0; i &lt; Math.min(5, colorArr.length); i++) {
		document.querySelector(&#x27;#swatch&#x27;+i).style.backgroundColor = &quot;rgb(&quot;+colorArr[i][0]+&quot;,&quot;+colorArr[i][1]+&quot;,&quot;+colorArr[i][2]+&quot;)&quot;;		
	}
}
</code></pre>

Basically - I set the video source to the media stream I requested earlier. I got that code from [this demo](https://googlechrome.github.io/samples/image-capture/grab-frame-take-photo.html) at Google.

I then use <code>grabFrame</code> and pass the result to the canvas tag I'm creating on the fly. I then update the image source from the canvas and
the same code as before handles the load. I'm doing this ever 300 ms. I tried 200 ms and began getting errors in console so I figure 300 was a bit safer.

To be clear, there is probably a better way of doing this.

But the result is kinda cool...

<iframe width="560" height="315" src="https://www.youtube.com/embed/EyuqP43jkQ8?rel=0" frameborder="0" allowfullscreen></iframe>

If you want to try these demos yourself, be sure you're using Canary with the proper flags installed (or living in the future), and hit:

https://cfjedimaster.github.io/webdemos/camera_new_hotness/test1.html (first demo)<br/>
https://cfjedimaster.github.io/webdemos/camera_new_hotness/test2.html (just the camera)<br/>
https://cfjedimaster.github.io/webdemos/camera_new_hotness/test3.html (live video)

You can find the source code here: https://github.com/cfjedimaster/webdemos/tree/master/camera_new_hotness
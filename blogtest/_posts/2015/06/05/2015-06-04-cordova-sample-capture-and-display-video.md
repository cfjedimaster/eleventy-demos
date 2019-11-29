---
layout: post
title: "Cordova Sample: Capture and Display Video"
date: "2015-06-05T10:16:09+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/06/05/cordova-sample-capture-and-display-video
guid: 6258
---

Just a quickie - a user on Stackoverflow <a href="http://stackoverflow.com/questions/30667183/how-to-show-capture-video-in-phonegap/30669597#30669597">asked</a> how to both capture video and display it in the app. This is fairly easy with the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.media-capture">Media Capture</a> API so I thought I'd whip up a quick demo. 

<!--more-->

First, I created an HTML page with a button and an empty div to hold the video later on:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;/title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;css/app.css&quot; /&gt;
	&lt;/head&gt;
	&lt;body&gt;

		&lt;button id=&quot;takeVideo&quot;&gt;Take Video&lt;/button&gt;
		&lt;div id=&quot;videoArea&quot;&gt;&lt;/div&gt;

	&lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;	
	&lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;</code></pre>

And then I wrote up the following JavaScript:

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	
	
	document.querySelector(&quot;#takeVideo&quot;).addEventListener(&quot;touchend&quot;, function() {
		console.log(&quot;Take video&quot;);
		navigator.device.capture.captureVideo(captureSuccess, captureError, {% raw %}{limit: 1}{% endraw %});
	}, false);
	
}

function captureError(e) {
	console.log(&quot;capture error: &quot;+JSON.stringify(e));
}

function captureSuccess(s) {
	console.log(&quot;Success&quot;);
	console.dir(s[0]);
	var v = &quot;&lt;video controls='controls'&gt;&quot;;
	v += &quot;&lt;source src='&quot; + s[0].fullPath + &quot;' type='video/mp4'&gt;&quot;;
	v += &quot;&lt;/video&gt;&quot;;
	document.querySelector(&quot;#videoArea&quot;).innerHTML = v;
}</code></pre>

So I begin by simply listening for a touch event to the button I create. I then use the Media Capture API to start the video process. In the success handler I just take the result's fullPath property and put it in HTML. I was kinda surprised the path worked as I had thought I'd need to use a URL form, but it worked just fine.

Here it is running on my iPad.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot.png" alt="shot" width="800" height="630" class="aligncenter size-full wp-image-6259" />

If for some reason you want to try this yourself, I uploaded it to my Cordova demo repo: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/videotest1">https://github.com/cfjedimaster/Cordova-Examples/tree/master/videotest1</a>.
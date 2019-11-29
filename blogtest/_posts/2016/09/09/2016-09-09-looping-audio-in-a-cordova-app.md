---
layout: post
title: "Looping Audio in a Cordova App"
date: "2016-09-09T08:20:00-07:00"
categories: [mobile]
tags: [cordova]
banner_image: /images/banners/loopaudio.jpg
permalink: /2016/09/09/looping-audio-in-a-cordova-app
---

Here's a quickie. How do you play audio in an Apache Cordova app and have the sound automatically loop? For example, maybe you want background music for a simple game. It's pretty simple. Begin by adding in the [Media](https://github.com/apache/cordova-plugin-media) plugin.

<!--more-->

<pre><code class="language-markup">
cordova plugin add cordova-plugin-media
</code></pre>

Then get your music. I chose an MP3 from the cool [Arcade Ambiance Project](http://arcade.hofle.com/). This is exactly what you think it is - background sounds from what you would hear in an arcade. If you don't know what an arcade is, ask the old coder next to you. 

Once you have your MP3, then you have an interesting choice. If you are iOS only, then you can actually tell the Media plugin to loop. Technically you can't loop infinitely, but you could use a really large number. Here's an example from the docs:

<pre><code class="language-javascript">
var myMedia = new Media("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
myMedia.play({% raw %}{ numberOfLoops: 9999 }{% endraw %});
</code></pre>

I'm assuming you could probably use JavaScript's MAXINT here: <code>Number.MAX_VALUE</code>. I haven't tried it, but it should work. If not, then certainly 9999 is pretty reasonable. (<i>Be sure to keep reading. I tested MAX_VALUE. It failed.</i>)

A cross-platform solution though isn't that much more difficult. The Media object supports a status event. This is fired every time the current media object has a particular change. Values are:

* Media.MEDIA_NONE = 0;
* Media.MEDIA_STARTING = 1;
* Media.MEDIA_RUNNING = 2;
* Media.MEDIA_PAUSED = 3;
* Media.MEDIA_STOPPED = 4;

So all we need to do is listen for the stopped event and then use `seekTo` to return to the beginning of the file. Here is a complete solution. Notice I'm using the [Device](https://github.com/apache/cordova-plugin-device) plugin to handle how Android loads audio files a bit differently. See my older post for an example: [Cordova Media API Example](https://www.raymondcamden.com/2014/06/23/Cordova-Media-API-Example/)

<pre><code class="language-javascript">
document.addEventListener('deviceready', init, false);
var media;

function init() {
	media = new Media(getMediaURL('arcade1.mp3'), null, mediaError, mediaStatus);
	media.play();
}

function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}

function mediaError(e) {
	console.log('mediaError', e);
}

function mediaStatus(status) {
	if(status === Media.MEDIA_STOPPED) {
		media.seekTo(0);
		media.play();
	}
	console.log('status', JSON.stringify(arguments));
}
</code></pre>

Pretty simple, right? Unfortunately there is a slight gap when it resets that may be annoying. I guess it just depends on the track you are using. You could, in theory, use the loop feature in iOS and only use the seekTo option for Android. 

So I decided to go ahead and try this. The first thing I discovered is that Number.MAX_VALUE <i>really</i> screwed things up. I didn't get an error, but my init function never ran. Weird - but switching to 9999 worked. Unfortunately, you <i>still</i> get a gap, but it is smaller at least. Anyway, here is the version that only does seekTo for Android:

<pre><code class="language-javascript">
document.addEventListener('deviceready', init, false);
var media;
var isAndroid = false;

function init() {
	console.log('init');
	if(device.platform.toLowerCase() === "android") isAndroid = true;

	media = new Media(getMediaURL('arcade1.mp3'), null, mediaError, mediaStatus);
	media.play({% raw %}{numberOfLoops:9999}{% endraw %});
}

function getMediaURL(s) {
    if(isAndroid) return "/android_asset/www/" + s;
    return s;
}

function mediaError(e) {
	console.log('mediaError', e);
}

function mediaStatus(status) {
	if(isAndroid && status === Media.MEDIA_STOPPED) {
		media.seekTo(0);
		media.play();
	}
}
</code></pre>

You can find the full source code for this demo here: 

https://github.com/cfjedimaster/Cordova-Examples/tree/master/loopingaudio

I went ahead and recorded two examples. The sound quality is pretty bad - I was recording from my laptop output. So these samples may be useless. Please note though that the original MP3s sound great, and it sounds great in the Cordova app. 

<iframe width="640" height="360" src="https://www.youtube.com/embed/btTY0asGRF4?rel=0" frameborder="0" allowfullscreen></iframe>

<iframe width="640" height="360" src="https://www.youtube.com/embed/h6ow9DCu7Ho?rel=0" frameborder="0" allowfullscreen></iframe>
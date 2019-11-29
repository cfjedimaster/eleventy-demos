---
layout: post
title: "Cordova Media API Example"
date: "2014-06-23T12:06:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/06/23/Cordova-Media-API-Example
guid: 5251
---

<p>
A few months ago I launched a new GitHub repo (<a href="https://github.com/cfjedimaster/Cordova-Examples">https://github.com/cfjedimaster/Cordova-Examples</a>) as a way to try to collect my various Cordova examples together under one roof. I had planned to add to it regularly but - life - as you know - gets in the way. I've finally gotten around to adding another example, this one for the <a href="https://github.com/apache/cordova-plugin-media/blob/master/doc/index.md">Media API</a>.
</p>
<!--more-->
<p>
Specifically, my example looks at how to play a MP3 file that is shipped with your application. You would think this would be trivial. Assuming I've got a folder under www called sounds and a MP3 file called something.mp3, you would think this would do it:
</p>

<pre><code class="language-javascript">var media = new Media("sounds/something.mp3", null, mediaError);
media.play();</code></pre>

<p>
Unfortunately, this breaks in Android. Why? Because Android. (No, no, I kid, sorry.) Specifically Android requires slightly different "pathing" to get to the same source. Specifically it requires this in front of the path: <code>/android_asset/www/</code>
</p>

<p>
So what I did was write a simple utility function that makes use of the <a href="https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md">Device API</a>. Consider:
</p>

<pre><code class="language-javascript">document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	document.querySelector("#playMp3").addEventListener("touchend", playMP3, false);
};

function playMP3() {
    var mp3URL = getMediaURL("sounds/button-1.mp3");
    var media = new Media(mp3URL, null, mediaError);
    media.play();
}

function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}

function mediaError(e) {
    alert('Media Error');
    alert(JSON.stringify(e));
}
</code></pre>

<p>
All I've done is sniff for the Android platform and modify the passed-in path value to add the Android prefix. I did <strong>not</strong> test this outside of iOS and Android so I can't say if it will work in Blackberry or Firefox, but, it gives you a basic idea of how to use a MP3 in your application.
</p>

<p>
You can find the source for this particular project here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/mp3">https://github.com/cfjedimaster/Cordova-Examples/tree/master/mp3</a>. As a reminder, you can clone the entire repository, and when you make a new Cordova project, simply use the --copy-from attribute to copy in my source code.
</p>
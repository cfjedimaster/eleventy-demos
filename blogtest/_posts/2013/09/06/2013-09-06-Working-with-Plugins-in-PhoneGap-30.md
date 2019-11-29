---
layout: post
title: "Working with Plugins in PhoneGap 3.0"
date: "2013-09-06T11:09:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/09/06/Working-with-Plugins-in-PhoneGap-30
guid: 5030
---

Another post about PhoneGap 3.0! So - I don't work with plugins a lot. I play with them every now and then, but I would certainly not consider myself an expert. Therefore, most of what I'm about to share here may be common knowledge, and if so, great, but I lost an hour or so yesterday trying to understand how to install a plugin via the command line and I figured a quick overview may help others.
<!--more-->
As you know, <a href="http://www.raymondcamden.com/index.cfm/2013/7/19/PhoneGap-30-Released--Things-You-Should-Know">PhoneGap 3</a> made it so that all of the core features (accelerometer, camera, etc) were plugins. To use those features you first had to add the plugin to your project. Luckily, this is rather easy to do at the command line. So for example, here is how you add Camera support:

phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git

Until yesterday, I had not tried this with a custom plugin. The last time I worked with a plugin the process was roughly like so (and this was for Android):

<ul>
<li>Download the bits, typically a Java file (or files) and a JavaScript file.
<li>Place the Java bits in the right src folder.
<li>Place a copy of the JS file in my assets folder.
<li>Include the JS file in my index.html.
<li>Make the appropriate calls to my plugin.
</ul>

In PhoneGap 3, you can use the same command to add a custom plugin as you would use a regular core plugin. The plugin must be compatible (I'm ignoring that aspect for this blog post as I assume the reader is concerned with <i>installing</i> and not creating plugins) with 3.0. For my tests, I made use of the <a href="https://github.com/macdonst/SpeechSynthesisPlugin/">Speech Synthesis</a> plugin by <a href="http://simonmacdonald.blogspot.com/">Simon MacDonald</a>. This plugin supports basic TTS and is pretty cool, but note that the docs aren't quite ready yet. They will be soon. For now, I'm just using it because a) it is pretty simple and b) I can bug Simon on IM for help.

So - to install it, I'd run this at the command line:

phonegap local plugin add https://github.com/macdonst/SpeechSynthesisPlugin

It should "just work", note though that the CLI doesn't recognize what platforms your plugin supports. So for example, the SpeechSynthesis plugin only supports Android (iOS support is forthcoming), but unless you knew that ahead of time, you would have no idea. Keep that in mind.

At this point, I looked into my plugins folder:

<img src="https://static.raymondcamden.com/images/bp1a.jpg" />

My assumption at this point was to copy all the JS files into my www folder and add script tags to my index.html.

<strong>That is not necessary!</strong>

In 3.0 (see footnotes), the build process not only handles copying the Java file over, it copies the JavaScript <i>and injects it</i> into your HTML. Basically, I don't have to do anything special on the HTML side to make use of my plugin. That kicks ass! But I wish I had known that earlier. You can literally just start using the plugin after deviceready has fired:

var u = new SpeechSynthesisUtterance();<br/>
u.text = "You know you're going to make the app say something naughty.";<br/>
u.lang = 'en-US';<br/>
speechSynthesis.speak(u);

<b>Some Notes:</b>

1) My understanding is that the ability to install plugins via the command line is actually part of the "plugman" project which is older than 3.0. So part of what I'm talking about here may not be necessarily "new", but it was new to me. I'm definitely willing to be corrected here, but I assume this particular usage is something many folks may not try until 3.0.

2) I mentioned that Simon's plugin isn't documented quite yet. That will be corrected very soon. But the plugin actually follows the W3C API for Speech Synthesis (you knew they had one, right?) and you can find out more here: <a href="https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section">Speech Synthesis</a>
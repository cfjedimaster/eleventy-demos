---
layout: post
title: "Downloading files to a PhoneGap application - Part 2"
date: "2012-01-20T15:01:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/01/20/Downloading-files-to-a-PhoneGap-application-Part-2
guid: 4502
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2012/1/19/Downloading-files-to-a-PhoneGap-application--Part-1">blogged</a> my experiment with downloading files to a PhoneGap application. Today I decided to take my code and try it out on iOS. Along the way I discovered a little bug, and encountered the White List issue with iOS PhoneGap apps. As with the previous entry, please note that this could possibly be done better.
<!--more-->
<p/>

Before we even get started, I wanted to correct a small issue in the previous code base. The code that handles file downloads looked like so:

<p/>

<code>
 var dlPath = DATADIR.fullPath + "/" + res[i];
                    console.log("downloading crap to " + dlPath);
                    ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(){
                        renderPicture(dlPath);
                        console.log("Successful download");
                    }, onError);
</code>

<p/>

I noticed, however, that my images were all the same URL, but only when the app was run for the first time and the images had to be downloaded. Why? I was using dlPath inside my closure and it wasn't using the right value. Classic JavaScript scoping issue and one I can't believe I made. 

<p/>

Luckily, the FileTransfer event includes all the data I need. Here's the new version:

<p/>

<code>
var dlPath = DATADIR.fullPath + "/" + res[i];
console.log("downloading crap to " + dlPath);
ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(e){
	renderPicture(e.fullPath);
	console.log("Successful download of "+e.fullPath);
}, onError);
</code>

<p/>

Nice and obvious once you see it. Ok, so what about iOS? I had struggled a bit last week to get my first iOS/PhoneGap running, but most of that struggle was due to the fact I had <i>never</i> run XCode before. It's a strange beast! Plus I'm using it over VNC, which works ok for the most part but is a bit tricky at times.

<p/>

Once I got past getting my application certificate crap running (thank you, Apple, for protecting me from my own hardware, lord forbid you allow me to just install anything without asking for permission first... oh crap, I'm going off on a sermon again) everything was mostly kosher. And rants aside - the iOS Simulator makes the Android Simulator look like a TRS-80. (And yes, I know the Android thing is doing more. Guess what - I don't care. It's a pain in the ass and slower than waiting for a picture to download over 14.4 baud modem.) 

<p/>

With my code in place, I immediately ran into an issue with my remote URL. Remember I'm hitting raymondcamden.com to get a list of images. XCode actually fleshed this error out quite obviously in the debugger. It's also something "everyone" knows so I wasn't too surprised. You simply need to go into PhoneGap.plist and add your domain:

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip16.png" />

<p/>

The next change I made was one that would probably work fine in Android too. Instead of switching to an Android based directory:

<p/>

<code>
fileSystem.root.getDirectory("Android/data/com.camden.imagedownloaddemo",{% raw %}{create:true}{% endraw %},gotDir,onError);
</code>

<p/>

I did this instead:

<p/>

<code>
fileSystem.root.getDirectory("com.camden.imagedownloaddemo",{% raw %}{create:true}{% endraw %},gotDir,onError);
</code>

<p/>

My gut tells me this same path would be fine on both - but in my third entry, where I talk about using integrating the iOS/Android version, I'll use this as one of the things I do differently on each platform. Anyway, it runs!

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip17.png" />
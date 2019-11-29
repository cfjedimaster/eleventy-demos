---
layout: post
title: "Using the Progress event in PhoneGap file transfers"
date: "2013-05-01T18:05:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2013/05/01/Using-the-Progress-event-in-PhoneGap-file-transfers
guid: 4923
---

Earlier today I was happy to hear that <a href="http://phonegap.com/blog/2013/04/30/pg-270-released/">PhoneGap 2.7</a> was released. While perusing the changelist, I thought I read that progress events for file transfers were added in this release. However, I was wrong. <a href="http://docs.phonegap.com/en/2.7.0/cordova_file_file.md.html#FileTransfer">FileTransfer</a> has supported a progress event for a few months now. But since I figured this out while halfway through a demo, I figured I'd finish it up anyway and share it on my blog.
<!--more-->
As you can imagine, the onprogress event is a property of the FileTransfer object. It is passed a progressEvent that is - unfortunately - not documented as far as I can see. The code example though gives you enough information I think to deal with it:

<script src="https://gist.github.com/cfjedimaster/5498492.js"></script>

So from what I can see - you get a property that determines if the total size is known, and if so, you can get a percentage by using it with the loaded property. Otherwise you're just guessing at the time left, but at least you know <i>something</i> is going on.

For my demo, I thought I'd build a simple MP3 downloader/player. I googled for 'free open source music' and came across this incredible MP3 by Kansas Joe McCoy and Memphis Minnie: <a href="http://publicdomain4u.com/kansas-joe-mccoy-memphis-minnie-when-the-levee-breaks/mp3-download">When the Levee Breaks</a>. Go ahead and listen to it. As much as I love indie music and trance, the sound of old recordings like this is like pure gold to the ears. 

Anyway - I began by creating an incredibly simple web page. It lists the name of the artists and the song along with a picture. I've included a button that will trigger the download. Also make note of the status div I'll be using for - you guessed it - progress events.

<script src="https://gist.github.com/cfjedimaster/5498519.js"></script>

Here's a screen shot of it in action.

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 1, 2013 4.28.35 PM.png" />

Ok, now let's take a look at the code.

<script src="https://gist.github.com/cfjedimaster/5498530.js"></script>

Starting from the top, the first thing that may interest you is the file system request. I ask for the temporary file system so I have a place to store the mp3. Once I've got a hook to the file system I then enable the button in my web page and start listening for a touch event.

The function that handles the download, startDl, creates the FileTransfer object and points it to the remote MP3. I've used almost the exact same onprogress event as demonstrated in the PhoneGap docs. I changed it to write out a percentage when possible and in other cases, simply append dots to the end of a string. That way people know something is still being transferred.

The final portion simply handles the media portion. I didn't bother adding any real controls so it just begins to play the track and that's it. (To be clear, this wouldn't be hard to add, just check the <a href="http://docs.phonegap.com/en/2.7.0/cordova_media_media.md.html#Media">Media API</a> for more information.)

Watch the video below to see it in action:

<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/DrGAlizaf_8&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><embed src="http://www.youtube.com/v/DrGAlizaf_8&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></embed></object>

As a last tip, note that the docs for Media seem to imply that you need a URI, not a file path. On iOS it seems to require a path, not a URI. Thanks to <a href="http://simonmacdonald.blogspot.com/">Simon MacDonald</a> for helping me with this.
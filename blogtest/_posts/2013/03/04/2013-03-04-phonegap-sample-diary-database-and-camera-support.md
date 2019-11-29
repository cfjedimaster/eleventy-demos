---
layout: post
title: "PhoneGap Sample - Diary (Database and Camera support)"
date: "2013-03-04T14:03:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/03/04/phonegap-sample-diary-database-and-camera-support
guid: 4871
---

Last week a reader wrote in with an interesting problem. They had a simple application that made use of PhoneGap's <a href="http://docs.phonegap.com/en/2.5.0/cordova_storage_storage.md.html#Storage">database</a> support. They wanted to add <a href="http://docs.phonegap.com/en/2.5.0/cordova_camera_camera.md.html#Camera">camera</a> support as well. Their idea was that a picture could be associated with their content. But then they ran into this issue:
<!--more-->
<blockquote>
iOS Quirks:<br>
When destinationType.FILE_URI is used, photos are saved in the application's temporary directory. Developers may delete the contents of this directory using the navigator.fileMgr APIs if storage space is a concern.
</blockquote>

So, right away, this brings up a useful reminder. Most things you do with PhoneGap will work cross platform, but it is crucial that you pay attention to the individual quirks for each platform. In this case, something that works fine in Android will cause problems in iOS. Even worse, because the images aren't removed immediately, you may think there isn't a problem at all. (As a side note, navigator.fileMgr is <i>old</i> code that has not been removed from the docs yet. I've filed a bug report to get this updated.)

I thought I'd help out the reader by building a simple application that made use of both technologies and then work out how I'd handle the iOS issue. I started off by building a simple Diary application. The Diary would allow you to write basic content entries, each with a title, body, and a creation date. I built a <i>very</i> simple "Single Page Architecture" framework to handle my application views and routing. I won't even call it a framework. Really it is just one simple JavaScript function that lets me load a page into the DOM. 

Here's the home page - a simple list of entries with the ability to view an entry and add a new entry.

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Mar 4, 2013 1.29.17 PM.png" />

And the amazingly well-designed entry page:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Mar 4, 2013 1.30.02 PM.png" />

Finally, the form to write entries:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Mar 4, 2013 1.31.03 PM.png" />

I also built a wrapper for my Diary class that would abstract out the persistence for me. Here is that wrapper. Please don't laugh at my pitiful object-oriented-ish JavaScript code.

<script src="https://gist.github.com/cfjedimaster/5084789.js"></script>

This wrapper class is used by index.js, which handles my views, adding and requesting data, etc. Basically, index.js acts like a controller in your typical MVC setup. I'm not going to share all of that file (to be clear, everything is shared via a Download link below), but here is an example. 

<script src="https://gist.github.com/cfjedimaster/5084814.js"></script>

So - nothing too terribly complex. I took this as a starting point (in the zip you can download, this may be found in www1) and then began to integrate camera functionality. I started by adding a new button to my entry field. This button, "Add Picture", would request the device camera and store the resulting image in a hidden form field. I began by using FILE_URIs even though I knew it would be an issue with iOS. In almost everything I do I start slowly, take baby steps, and try to build one thing at a time. So with that in mind, I went ahead and just built it in. 

Here is that code:

<script src="https://gist.github.com/cfjedimaster/5084843.js"></script>

Note that I've updated my form to include a preview and the entry detail view (not shown here) has been updated to display it.

<img src="https://static.raymondcamden.com/images/2013-03-04 13.45.11.png" />

Ok, so at this point, the core functionality is done. (You can find this version in the www2 folder.)  I can add and view content (I didn't bother with edit/delete, but that would be trivial) and I can use the device camera to assign a picture to a diary entry. Now to look into the bug.

My initial thought was to make use of the <a href="http://docs.phonegap.com/en/2.5.0/cordova_file_file.md.html#File">File API</a> to copy the image to a nice location. Even though Android didn't really need this feature, I thought I'd keep things simple and just use the same logic for all. (To be fair, when I say "all", I really was just testing Android and iOS.)

However, I ran into an interesting issue. When requesting the persistent file system, iOS gave me a directory that was customized for my application:

/var/mobile/Applications/362CC22A-BA60-4D81-876C-21072A06CE16/Documents

Unfortunately, the Android version of the exact same code returned a more generic folder. I could then make a folder for my Android app that was specific to the application itself, but that seemed to be a bit too much work. (Really, it wasn't, I was being lazy.) 

I rang up <a href="http://simonmacdonald.blogspot.com/">Simon MacDonald</a>, my goto guy for PhoneGap questions (or at least until I annoy him ;) and in discussions with him, I discovered that right now there isn't a simple way, cross platform, to ask the file system for "a safe application-specific place to store my crap." (My words, not his.) 

I made a decision at this point. Even though it felt a bit wrong, I decided I'd write code just for iOS. I figured the 'forked' code would be pretty small and therefore it wouldn't "pollute" my code too much. This smells like one of those decisions I may regret later, but for now, it is what I'm going with. 

I began by sniffing the device using PhoneGap's <a href="http://docs.phonegap.com/en/2.5.0/cordova_device_device.md.html#Device">Device</a> API.

<script src="https://gist.github.com/cfjedimaster/5085445.js"></script>

Nothing too complex here. If I detect iOS, I request the persistent file system and remember the root directory it gives me.

Next - before I store the Diary entry, if I am on iOS, I simply copy the image over.

<script src="https://gist.github.com/cfjedimaster/5085467.js"></script>

Overall, not as messy as I thought. You can find the complete source code attached below. Enjoy.<p><a href='https://static.raymondcamden.com/enclosures/Archive29.zip'>Download attached file.</a></p>
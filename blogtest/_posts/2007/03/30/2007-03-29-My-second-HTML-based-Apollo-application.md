---
layout: post
title: "My second HTML based Apollo application"
date: "2007-03-30T10:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/30/My-second-HTML-based-Apollo-application
guid: 1933
---

For my second little HTML Apollo test, I thought I'd build a simple log monitor. One of my favorite plugins for Eclipse is <a href="http://www.mikenimer.com/eclipse/logviewer/index.cfm">Mike Nimer's Log Viewer</a>. It lets you watch a log file and updates in real time. Much more nicer than constantly reloading the log view in the ColdFusion Admin.
<!--more-->
I wanted to know if this would be possible with Apollo, and of course, it is. Best of all, it isn't too difficult. I'm not going to describe every line of code (although I am including a zip), but instead will focus on the parts that pertain to Apollo.

First - my main question when it came to Apollo HTML applications was how JavaScript would get all the "Apollo Stuff". In other words - I knew that JavaScript didn't have a native way to write files (*), so was this going to work?

Turns out your JavaScript gets access to a new object, runtime, that then gives you access to all the fun bits. So this bit of code would create a file object pointing to my Application log:

<code>
var path = "/Applications/ColdFusionScorpio/logs/application.log";
var file = new runtime.flash.filesystem.File();
file.nativePath = path;
</code>

Note - there are actually <i>multiple</i> ways of pointing to a file. This is just one and obviously would not work on a PC. You get hooks to multiple default folders which is really handy for development. But in my case, I wanted a hard coded path.

My code was going to monitor a file and note any changes. So the first thing I did was to build a setTimeout. This simply lets you call JavaScript functions on a timed basis. If your function also runs a setTimeout, you can create a constantly running application. But I said I'd focus on the Apollo so let me return to that. 

On my "check" function, I look at the size of the file object. This is automatically updated by Apollo so I don't need to recreate my file. If the file's size doens't match my last recorded size, then I'm going to read in the difference. That is amazingly simple:

<code>
var fileStream = new runtime.flash.filesystem.FileStream();
fileStream.open(file, runtime.flash.filesystem.FileMode.READ);
fileStream.position = oldsize;
var diffsize = file.size - oldsize;
var change = fileStream.readMultiByte(diffsize, "iso-8859-1");
</code>

I create an instance of the FileStream option and point it to my file. I can then read the file - but notice that I can begin at my last position. This means I'm not reading in a 2 gig file all at once. With the old position I can simply read in the rest of the file.

<img src="http://www.blogcfc.com/images/app2.jpg">

That's it. Seriously. How sweet is that? I did run into a bit of trouble though. Sometimes Apollo would run it's function midway through ColdFusion writing a line out to the browser. I took a "back up" approach and simply moved my change string to include only the text up to and including the first line break. 

Outside of that - I think I spent more time figuring out how to add a table row dynamically then I spent trying to figure out the Apollo side. (Between Apollo and AJAX, my JavaScript skills are being reawakened.) I'm not including an AIR for this as the application is hard coded to my path, but you can download the code below. Note that it is a bit ugly as I was mainly just playing.

* Ok - you can stop reading now if you want. Time for an old story. Back in the "old days", I worked for a company that had a nice little document management system. Basically it let you create folders and upload/download files. Simple stuff. But we decided to make it a bit easier to use. Back in those days, you can sign JavaScript files. I'm sure it is still supported - or maybe it isn't - but basically it was a way to securely sign your JS code such that it was given more powers to work with your desktop. This was a complete pain in the rear to work with. I had been doing contract work for Netscape (back when it was cool to say that), but even with our contacts it took me a few weeks to get it working right.

But once I did - I was able to add a very cool feature to our application - something I'm hoping I can do in Apollo. Basically, I made it so that you could drag a file onto the browser. JS would pick up the file and upload it. Even cooler - you could drag a folder, and JS/CF would recreate the folder structure in the virtual folder system and upload all the appropriate files. Cool stuff. I don't think Apollo supports "drag a file on to me" yet, but when/if it does, I'm thinking of building a simple demo of this.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive6%{% endraw %}2Ezip'>Download attached file.</a></p>
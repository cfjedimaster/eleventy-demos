---
layout: post
title: "Downloading files to a PhoneGap application - Part 1"
date: "2012-01-19T09:01:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2012/01/19/Downloading-files-to-a-PhoneGap-application-Part-1
guid: 4500
---

For the past week or so I've been looking at file system access and downloads with PhoneGap. Before going any further, I want to warn folks that I'm still a bit fuzzy on the details here. It was a bit of a struggle to get this working right, and I plan to follow this entry up with a look at iOS and also how to get all platforms working right, but for now, consider this a first draft. I also want to give thanks to <a href="http://hi.im/simonmacdonald">Simon Mac Donald</a> for his help. Anything right here is thanks to him and anything wrong is my fault.
<!--more-->
<p/>

Ok, with that out of the way. Let's talk about file downloads. A reader pinged me recently to ask about how to support offline PhoneGap applications. Specifically, he wanted to work with images that were remote and make them available to the application when the device was offline. I decided to work on a simple application that would fetch images from a server and store them locally.

<p/>

I began by looking over the <a href="http://docs.phonegap.com/en/1.3.0/phonegap_file_file.md.html#File">File</a> docs at PhoneGap. This is - for the most part - a wrapper for the <a href="http://www.w3.org/TR/file-system-api/">W3C File API</a>. I had a real hard time grokking this API. My gut take on it is this:

<p/>

<ul>
<li>You begin by requesting a file system. This request is either for a persistent or temporary storage. Obviously which you pick depends on what your needs are. For my demo application, I need the persistent storage.
<li>What you get back is a file system object. From what I see in the <a href="http://www.w3.org/TR/file-system-api/#idl-def-FileSystem">spec</a>, the object contains a few properties, but your primary usage of this is to get a directory entry.
<li>Once you have a directory object, you can enumerate files, read them, whatever.
</ul>

<p/>

Based on what I learned from Simon, in Android, the place you want to store your files is:

<p/>

<b>Android/data/X</b>

<p/>

Where X is the identify of your application. For my demo, this was com.camden.imagedownloaddemo. For the first iteration of my demo, I requested the file system, the directory, and then a list of files:

<p/>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;Image Download Demo&lt;/title&gt;

&lt;script type="text/javascript" charset="utf-8" src="phonegap-1.3.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8"&gt;
//Global instance of DirectoryEntry for our data
var DATADIR;

//Loaded my file system, now let's get a directory entry for where I'll store my crap	
function onFSSuccess(fileSystem) {
	fileSystem.root.getDirectory("Android/data/com.camden.imagedownloaddemo",{% raw %}{create:true}{% endraw %},gotDir,onError);
}

//The directory entry callback
function gotDir(d){
	DATADIR = d;
	var reader = DATADIR.createReader();
	reader.readEntries(gotFiles,onError);
}

//Result of reading my directory
function gotFiles(entries) {
	console.log("The dir has "+entries.length+" entries.");
    for (var i=0; i&lt;entries.length; i++) {
        console.log(entries[i].name+' '+entries[i].isDirectory);
    }
}

function onError(e){
	console.log("ERROR");
	console.log(JSON.stringify(e));
}

function onDeviceReady() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);	
}

function init() {
document.addEventListener("deviceready", onDeviceReady, true);
}   
&lt;/script&gt;  

&lt;/head&gt;
&lt;body onload="init();" &gt;
&lt;h2&gt;Image Download Demo&lt;/h2&gt;

&lt;div id="status"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

As everything is async, the code gets a bit complex, but I begin by requesting the file system, requesting the directory (and notice, you can pass an optional argument to automatically create it, which is useful), and then the files. 

<p/>

Ok - so that seemed to work. It was then time to look into the file sync aspects. To keep things simple, my sync logic would just ask a remote server for a list of images. Every image the remote server had that I did not, I downloaded. Obviously this means I can be left with images locally I don'rt need, but I wanted to keep things as basic as possible. Here's the new version:

<p/>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;Image Download Demo&lt;/title&gt;
&lt;script type="text/javascript" charset="utf-8" src="jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8" src="phonegap-1.3.0.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8"&gt;
//Global instance of DirectoryEntry for our data
var DATADIR;
var knownfiles = [];	

//Loaded my file system, now let's get a directory entry for where I'll store my crap	
function onFSSuccess(fileSystem) {
	fileSystem.root.getDirectory("Android/data/com.camden.imagedownloaddemo",{% raw %}{create:true}{% endraw %},gotDir,onError);
}

//The directory entry callback
function gotDir(d){
	console.log("got dir");
	DATADIR = d;
	var reader = DATADIR.createReader();
	reader.readEntries(function(d){
		gotFiles(d);
		appReady();
	},onError);
}

//Result of reading my directory
function gotFiles(entries) {
	console.log("The dir has "+entries.length+" entries.");
    for (var i=0; i&lt;entries.length; i++) {
        console.log(entries[i].name+' dir? '+entries[i].isDirectory);
		knownfiles.push(entries[i].name);
		renderPicture(entries[i].fullPath);
    }
}

function renderPicture(path){
	$("#photos").append("&lt;img src='file://"+path+"'&gt;");
	console.log("&lt;img src='file://"+path+"'&gt;");
}

function onError(e){
	console.log("ERROR");
	console.log(JSON.stringify(e));
}

function onDeviceReady() {
	//what do we have in cache already?
	$("#status").html("Checking your local cache....");	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);	
}

function appReady(){
	$("#status").html("Ready to check remote files...");
	$.get("http://www.raymondcamden.com/demos/2012/jan/17/imagelister.cfc?method=listimages", {}, function(res) {
		if (res.length &gt; 0) {
			$("#status").html("Going to sync some images...");
			for (var i = 0; i &lt; res.length; i++) {
				if (knownfiles.indexOf(res[i]) == -1) {
					console.log("need to download " + res[i]);
					var ft = new FileTransfer();
					var dlPath = DATADIR.fullPath + "/" + res[i];
					console.log("downloading crap to " + dlPath);
					ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(){
						renderPicture(dlPath);
						console.log("Successful download");
					}, onError);
				}
			}
		}
		$("#status").html("");
	}, "json");

}

function init() {
document.addEventListener("deviceready", onDeviceReady, true);
}   
&lt;/script&gt;  
&lt;style&gt;
img {
	max-width: 200px;
}
&lt;/style&gt;
&lt;/head&gt;
&lt;body onload="init();" &gt;
&lt;h2&gt;Image Download Demo&lt;/h2&gt;

&lt;div id="status"&gt;&lt;/div&gt;

&lt;div id="photos"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

Ok, it's a bit much, but let's work through the various events. You can still see the file system request as well as the directory list. I do two new things now once I have the files. I remember them (storing them in knownfiles), and I render them using a simple utility function. Yes - you can pass a path to an image source and it works just fine. 

<p/>

Now - take a look at appReady. This handles my remote call. I'll share the ColdFusion code if folks want, but all it's doing is returning a JSON-encoded array of images. For each result, I see if I already have it, and if not, use the download method of the FileTransfer object. <b>Note:</b> One of my images had a space in the file name. This causes all kinds of problems until I simply escaped it:

<p/>

<code>
ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(){
</code>

<p/>

Here's a quick screen shot. Obviously it is static so you can't see it working, but in my testing, when I pushed up a new image remotely, and reran the application, it immediately noticed it was missing one and grabbed it.

<p/>

<img src="https://static.raymondcamden.com/images/device-2012-01-19-091324.png" />


<p/>

So - what's next? As I said, this is currently Android specific, and that's bad. I'm next going to test on iOS, and then get <b>one</b> application that can handle both. Also, I didn't actually bother checking to see if the device was online. That would be trivial via the <a href="http://docs.phonegap.com/en/1.3.0/phonegap_connection_connection.md.html#Connection">Connection</a> API and should be done. (I'll remember to do it for the final, "combined" demo.)

<p/>

Does this make sense? Any questions?

<p/>

<b>Edit on January 20, 2012:</b> Note that I made a mistake in my fileTransfer callback. I talk about this mistake <a href="http://www.raymondcamden.com/index.cfm/2012/1/20/Downloading-files-to-a-PhoneGap-application--Part-2">here</a>, but the critical fix is right here:

<p/>

<code>
var dlPath = DATADIR.fullPath + "/" + res[i];
console.log("downloading crap to " + dlPath);
ft.download("http://www.raymondcamden.com/demos/2012/jan/17/" + escape(res[i]), dlPath, function(e){
    renderPicture(e.fullPath);
    console.log("Successful download of "+e.fullPath);
}, onError);
</code>
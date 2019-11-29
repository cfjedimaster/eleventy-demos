---
layout: post
title: "PhoneGap's File API"
date: "2012-03-09T13:03:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2012/03/09/PhoneGaps-File-API
guid: 4555
---

<strong>Be sure to read the notes at the end of this blog entry!</strong>

This week I had the opportunity to record a few videos on <a href="http://www.phonegap.com">PhoneGap</a> for Adobe TV. One of the videos covered the <a href="http://docs.phonegap.com/en/1.5.0/phonegap_file_file.md.html#File">File API</a> and since it was a bit difficult I figured I'd share my findings, and sample code, with others.
<!--more-->
<p>

My main struggle with the File API was trying to wrap my head around how it worked. The docs weren't entirely clear to me and were a bit confusing. Turns out there's a good reason for that. (Although I'm working to improve the docs.) PhoneGap's File API is really an implementation of the <a href="http://www.w3.org/TR/FileAPI/">W3 File API</a>. The PhoneGap docs mention something similar in the <a href="http://docs.phonegap.com/en/1.5.0/phonegap_storage_storage.md.html#Storage">database area</a> so it makes sense for the File docs to be updated as well. (And as I said - I'm working on that. I did my first pull request to add just such a mention.)

<p>

After I figured that out, I then found an incredibly useful article on the File API over at HTML5 Rocks: <a href="http://www.html5rocks.com/en/tutorials/file/filesystem/">Exploring the Filesystem APIs</a>. I encourage everyone to read over Eric Bidelman's article. He's got examples for pretty much every part of the API. 

<p>

At a high level, working with the File API comes down to a few basic concepts:

<p>

<ul>
<li>First, you request a file system. You can ask for either a persistent or temporary file system. On the desktop, these both point to a sandboxed folder. On PhoneGap, your access is a bit broader, essentially the entire storage system. 
<li>The API supports basic "CRUD" operations for both files and folders. 
<li>The API supports reading and writing to files, both binary and plain text.
<li>Probably the most difficult aspect (well, not difficult, just a bit unwieldy), is that each and every operation is asynchronous. So to get and read a file involves about 3 or 4 levels of callbacks. 
</ul>

<p>

For my Adobe TV video, I built a simple application that demonstrates some of these principles.  I began with a few simple buttons that would let me test basic file operations:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip35.png" />

<p>

In order to do anything, I need access to the file system, and this needs to be done after PhoneGap fires the deviceready event:

<p>

<code>
function onDeviceReady() {

	//request the persistent file system
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, onError);
	
}

function init() {
	document.addEventListener("deviceready", onDeviceReady, true);
}   
</code>

<p>

If the file system is loaded, onFSSuccess will handle storing a pointer to it while also setting up my event handlers:

<p>

<code>

function onFSSuccess(fs) {
	fileSystem = fs;

	getById("#dirListingButton").addEventListener("touchstart",doDirectoryListing);			
	getById("#addFileButton").addEventListener("touchstart",doAppendFile);			
	getById("#readFileButton").addEventListener("touchstart",doReadFile);			
	getById("#metadataFileButton").addEventListener("touchstart",doMetadataFile);			
	getById("#deleteFileButton").addEventListener("touchstart",doDeleteFile);			
	
	logit( "Got the file system: "+fileSystem.name +"&lt;br/&gt;" +
									"root entry name is "+fileSystem.root.name + "&lt;p/&gt;")	

	doDirectoryListing();
}   
</code>

<p>

As a quick aside, getById is simply a wrapper for document.getElementById. (Trying to reduce my dependency on jQuery.) Our fileSystem object has a few properties we can display, like the name for example. It also has a root property which is a pointer to the root directory. (Duh.) The logit function is simply appending to a DIV on the HTML page as a quick debugging technique.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip37.png" />

<p>

This event handler then fires off doDirectoryListing. This is normally run by the "Show Directory Contents" button but I automatically run it after the file system is opened. 

<p>

<code>
function gotFiles(entries) {
	var s = "";
	for(var i=0,len=entries.length; i&lt;len; i++) {
		//entry objects include: isFile, isDirectory, name, fullPath
		s+= entries[i].fullPath;
		if (entries[i].isFile) {
			s += " [F]";
		}
		else {
			s += " [D]";
		}
		s += "&lt;br/&gt;";
		
	}
	s+="&lt;p/&gt;";
	logit(s);
}

function doDirectoryListing(e) {
	//get a directory reader from our FS
	var dirReader = fileSystem.root.createReader();

	dirReader.readEntries(gotFiles,onError);		
}
</code>

<p>

Reading bottom to top, the event handler starts off by creating a reader object off the root property of the file system object. To get the files, you simple call readEntries, and use a callback to handle the result. The entries (which can be files or directories) are a simple array of objects. Here's an example of the output:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip36.png" />

<p>

So what about file reading and writing? Opening a file is simple. You can simply run getFile(name) and the API can (if you want) also create the file if it doesn't exist. This simplifies things a bit. Here's the event handler and call back for clicking "Creating/Append to Test File". 

<p>

<code>
function appendFile(f) {

	f.createWriter(function(writerOb) {
		writerOb.onwrite=function() {
			logit("Done writing to file.&lt;p/&gt;");
		}
		//go to the end of the file...
		writerOb.seek(writerOb.length);
		writerOb.write("Test at "+new Date().toString() + "\n");
	})

}

function doAppendFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, appendFile, onError);
}
</code>

<p>

Again - please read up from bottom to top. You can see the use of getFile here along with the options after it to ensure an error won't be thrown if it doesn't exist. Appending to a file is done by creating a writer object. Do note - and I screwed this up myself - if you don't seek to the end of the file you'll actually overwrite data as opposed to appending. Now let's look at reading:

<p>

<code>
function readFile(f) {
	reader = new FileReader();
	reader.onloadend = function(e) {
		console.log("go to end");
		logit("&lt;pre&gt;" + e.target.result + "&lt;/pre&gt;&lt;p/&gt;");
	}
	reader.readAsText(f);
}

function doReadFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, readFile, onError);
}
</code>

<p>

As before, we begin by opening the file, and in the success callback, create a FileReader object. You can read text or binary data depending on your needs. In this example our content is all text so we readAsText and in <i>that</i> callback append it to our div.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip38.png" />

<p>

Now let's look at metadata. This method doesn't return a lot of data - just the modification date of the file/directory.

<p>

<code>
function metadataFile(m) {
	logit("File was last modified "+m.modificationTime+"&lt;p/&gt;");	
}

function doMetadataFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, function(f) {
		f.getMetadata(metadataFile,onError);
	}, onError);
}
</code>

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip39.png" />

<p>

Finally - let's look at the delete operation:

<p>

<code>
function doDeleteFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, function(f) {
		f.remove(function() {
			logit("File removed&lt;p/&gt;"); 
		});
	}, onError);
}
</code>

<p>

I hope these examples make sense. If it isn't obvious, I slightly tweaked my style as I built each of the sections. Sometimes I wrote the callbacks within the API calls and sometimes I did it separately. I've included the full code below as well as an APK for those of you who want to test on Android.

<p>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;

&lt;head&gt;
&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
&lt;title&gt;Minimal AppLaud App&lt;/title&gt;

&lt;script type="text/javascript" charset="utf-8" src="phonegap-1.4.1.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" charset="utf-8"&gt;
var fileSystem;

//generic getById
function getById(id) {
	return document.querySelector(id);
}
//generic content logger
function logit(s) {
	getById("#content").innerHTML += s;
}

//generic error handler
function onError(e) {
	getById("#content").innerHTML = "&lt;h2&gt;Error&lt;/h2&gt;"+e.toString();
}

function doDeleteFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, function(f) {
		f.remove(function() {
			logit("File removed&lt;p/&gt;"); 
		});
	}, onError);
}

function metadataFile(m) {
	logit("File was last modified "+m.modificationTime+"&lt;p/&gt;");	
}

function doMetadataFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, function(f) {
		f.getMetadata(metadataFile,onError);
	}, onError);
}

function readFile(f) {
	reader = new FileReader();
	reader.onloadend = function(e) {
		console.log("go to end");
		logit("&lt;pre&gt;" + e.target.result + "&lt;/pre&gt;&lt;p/&gt;");
	}
	reader.readAsText(f);
}

function doReadFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, readFile, onError);
}

function appendFile(f) {

	f.createWriter(function(writerOb) {
		writerOb.onwrite=function() {
			logit("Done writing to file.&lt;p/&gt;");
		}
		//go to the end of the file...
		writerOb.seek(writerOb.length);
		writerOb.write("Test at "+new Date().toString() + "\n");
	})

}

function doAppendFile(e) {
	fileSystem.root.getFile("test.txt", {% raw %}{create:true}{% endraw %}, appendFile, onError);
}

function gotFiles(entries) {
	var s = "";
	for(var i=0,len=entries.length; i&lt;len; i++) {
		//entry objects include: isFile, isDirectory, name, fullPath
		s+= entries[i].fullPath;
		if (entries[i].isFile) {
			s += " [F]";
		}
		else {
			s += " [D]";
		}
		s += "&lt;br/&gt;";
		
	}
	s+="&lt;p/&gt;";
	logit(s);
}

function doDirectoryListing(e) {
	//get a directory reader from our FS
	var dirReader = fileSystem.root.createReader();

	dirReader.readEntries(gotFiles,onError);		
}

function onFSSuccess(fs) {
	fileSystem = fs;

	getById("#dirListingButton").addEventListener("touchstart",doDirectoryListing);			
	getById("#addFileButton").addEventListener("touchstart",doAppendFile);			
	getById("#readFileButton").addEventListener("touchstart",doReadFile);			
	getById("#metadataFileButton").addEventListener("touchstart",doMetadataFile);			
	getById("#deleteFileButton").addEventListener("touchstart",doDeleteFile);			
	
	logit( "Got the file system: "+fileSystem.name +"&lt;br/&gt;" +
									"root entry name is "+fileSystem.root.name + "&lt;p/&gt;")	

	doDirectoryListing();
}   
   
function onDeviceReady() {

	//request the persistent file system
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, onError);
	
}

function init() {
	document.addEventListener("deviceready", onDeviceReady, true);
}   
&lt;/script&gt;  

&lt;style&gt;
button {% raw %}{ width: 100%{% endraw %}; padding: 5px; }
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="init();" id="stage" class="theme"&gt;

&lt;button id="addFileButton"&gt;Create/Append to Test File&lt;/button&gt;
&lt;button id="readFileButton"&gt;Read Test File&lt;/button&gt;
&lt;button id="metadataFileButton"&gt;Get Test File Metadata&lt;/button&gt;
&lt;button id="deleteFileButton"&gt;Delete Test File&lt;/button&gt;
&lt;button id="dirListingButton"&gt;Show Directory Contents&lt;/button&gt;

&lt;div id="content"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<strong>Edited August 27, 2013:</strong> Just as an FYI, the File API has been updated a few times since I wrote this blog post. You will note the version link in the text above is for PhoneGap 1.5. PhoneGap is now version 3. One of the big places it changed was in the readAsText area. In my code, I call getFile from the file system object and then pass that into the reader object via the readAsText method. That does not work now. The object passed to getFile is a FileEntry object. You can think of it as a higher-level container for file data. That object has a file() method that returns the file. That thing can then be used in readAsText. You can see an example of this modification in this PhoneGap Google Group posting: <a href="https://groups.google.com/forum/#!topic/phonegap/GKoTOSqD2kc">Post</a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FFileBrowser%{% endraw %}2Eapk'>Download attached file.</a></p>
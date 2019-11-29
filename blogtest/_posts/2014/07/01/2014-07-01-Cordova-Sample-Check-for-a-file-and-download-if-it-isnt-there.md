---
layout: post
title: "Cordova Sample: Check for a file and download if it isn't there"
date: "2014-07-01T12:07:00+06:00"
categories: [html5,mobile]
tags: []
banner_image: 
permalink: /2014/07/01/Cordova-Sample-Check-for-a-file-and-download-if-it-isnt-there
guid: 5256
---

<p>
I've begun work on trying to answer the <a href="http://www.raymondcamden.com/index.cfm/2014/6/23/PhoneGapCordova-File-System-questions">questions I gathered</a> concerning Cordova's FileSystem support. As I work through the questions I'm trying to build "real" samples to go along with the text. My first sample is a simple one, but I think it is pretty relevant for the types of things folks may do with Cordova and the file system - checking to see if a file exists locally and if not - fetching it.
</p>
<!--more-->
<p>
I'll begin by sharing the code and then explaining the parts. Here is the entire JavaScript file for the application. <strong>(Earlier today, Andrew Grieve shared a way my code could be simplified by a good 1/3rd. The code below reflects his update and has been changed since my original writing of the blog post.)</strong>
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);

&#x2F;&#x2F;The directory to store data
var store;

&#x2F;&#x2F;Used for status updates
var $status;

&#x2F;&#x2F;URL of our asset
var assetURL = &quot;https:&#x2F;&#x2F;raw.githubusercontent.com&#x2F;cfjedimaster&#x2F;Cordova-Examples&#x2F;master&#x2F;readme.md&quot;;

&#x2F;&#x2F;File name of our important data file we didn&#x27;t ship with the app
var fileName = &quot;mydatafile.txt&quot;;

function init() {
	
	$status = document.querySelector(&quot;#status&quot;);

	$status.innerHTML = &quot;Checking for data file.&quot;;

	store = cordova.file.dataDirectory;

	&#x2F;&#x2F;Check for the file. 
	window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);

}

function downloadAsset() {
	var fileTransfer = new FileTransfer();
	console.log(&quot;About to start transfer&quot;);
	fileTransfer.download(assetURL, store + fileName, 
		function(entry) {
			console.log(&quot;Success!&quot;);
			appStart();
		}, 
		function(err) {
			console.log(&quot;Error&quot;);
			console.dir(err);
		});
}

&#x2F;&#x2F;I&#x27;m only called when the file exists or has been downloaded.
function appStart() {
	$status.innerHTML = &quot;App ready!&quot;;
}</code></pre>

<p>
Ok, let's break it down. The first step is to check to see if our file exists already. The question is - where should we store the file? If you look at the <a href="https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md">docs for the FileSystem</a>, you will see that the latest version of the plugin adds some useful aliases for common folders. Unfortunately, the docs are not exactly clear about how some of these aliases work. I asked for help (both on the PhoneGap Google group and the Cordova development list) and got some good responses from Kerri Shotts and Julio Sanchez. 
</p>

<p>
The directory that I thought made sense, cordova.file.applicationStorageDirectory, is incorrectly documented as being writeable in iOS. A pull request has already been filed to fix this mistake. For my application, the most appropriate directory is the next one, cordova.file.dataDirectory. Once I have my directory alias, I can make use of resolveLocalFileSystem on the directory plus desired file name to see if it exists. The third argument, downloadAsset, will only be run on an error, in this case a file not existing. 
</p>

<p>
If the file does not exist, we then have to download it. For this we use a second plugin,  <a href="https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md">FileTransfer</a>. This is where one more point of confusion comes in. We need to convert that earlier DirectoryEntry object, the one we used to get an API for files and directories, back to a URL so we can give a path to the Download API. 
</p>

<p>
So to recap - we've got a few moving parts here. We've got a directory alias, built into the plugin for easily finding common folders for our application. Again, the docs here are currently a bit wrong but they should be corrected soon. From that we can quickly see if our desired file exists, and if not, use the FileTransfer plugin to download it.
</p>

<p>
Simple... but even a simple application caused me a bit of trouble, so hopefully this helps others. You can get the full source code here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/checkanddownload">https://github.com/cfjedimaster/Cordova-Examples/tree/master/checkanddownload</a>
</p>
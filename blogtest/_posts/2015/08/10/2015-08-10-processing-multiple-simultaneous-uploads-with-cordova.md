---
layout: post
title: "Processing multiple simultaneous uploads with Cordova"
date: "2015-08-10T17:29:30+06:00"
categories: [development,javascript,jquery,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/08/10/processing-multiple-simultaneous-uploads-with-cordova
guid: 6619
---

I forget where, but a user on one of my posts recently asked about handling multiple uploads with Cordova, so I thought I'd whip up a quick demo. As always, the code below is all on GitHub (link will be at the bottom), so you can skip my post completely and just grab the bits if you want.

<!--more-->

First off, the only reason this is even a little bit complex is because the upload method of the <a href="https://www.npmjs.com/package/cordova-plugin-file-transfer">File Transfer</a> plugin is asynchronous. Luckily there is an easy (heh, ok, kinda easy) way to handle multiple asynchronous responses - Promises. If you are using <a href="http://www.ionicframework.com">Ionic</a>, then I'd strongly suggest using <a href="http://ngcordova.com/">ngCordova</a>. It includes a "Promise-fied" version of the File Transfer plugin already. But I didn't want to assume Angular so I decided to skip ngCordova and instead simply use the promise support from jQuery. (Reminder, I've got 2.5 hours of jQuery training, including promises, here: <a href="https://www.youtube.com/playlist?list=PL_z-rqJYNijrtVAc5qQbkzHnDELANGiOn">https://www.youtube.com/playlist?list=PL_z-rqJYNijrtVAc5qQbkzHnDELANGiOn</a>) 

For my demo, I simply used the Camera plugin to let you select multiple images from the device. Each image is added to the DOM. Here is that code:

<pre><code class="language-javascript">var images = [];
var $imagesDiv;

document.addEventListener("deviceready", init, false);
function init() {
	
	$("#addPicture").on("touchend", selPic);
	$imagesDiv = $("#images");	
	$("#uploadPictures").on("touchend", uploadPics);
}

function selPic() {
	navigator.camera.getPicture(function(f) {
		var newHtml = "&lt;img src='"+f+"'&gt;";
		$imagesDiv.append(newHtml);
		images.push(f);
		if(images.length === 1) {
			$("#uploadPictures").removeAttr("disabled");
		}
	}, function(e) {
		alert("Error, check console.");
		console.dir(e);
	}, { 
		quality: 50,
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		destinationType: Camera.DestinationType.FILE_URI
	});
	
}</code></pre>

I assume this stuff is rather simple, but if not, just let me know in the comments below. Here is a screen shot of the app in action.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/iOS-Simulator-Screen-Shot-Aug-10-2015-5.23.33-PM.png" alt="iOS Simulator Screen Shot Aug 10, 2015, 5.23.33 PM" width="546" height="700" class="aligncenter size-full wp-image-6620 imgborder" />

As you can guess, the upload button at the bottom there will begin the process. For my testing, I set up a ColdFusion script to simply save the uploads to a temporary directory. To add a bit of randonmness though, it will randomly reject images by outputting 0. On successful uploads, it will output 1.

Here is the remainder of the code:

<pre><code class="language-javascript">function uploadPics() {
	console.log("Ok, going to upload "+images.length+" images.");
	var defs = [];

	images.forEach(function(i) {
		console.log('processing '+i);
		var def = $.Deferred();

		function win(r) {
			console.log("thing done");
			if($.trim(r.response) === "0") {
				console.log("this one failed");
				def.resolve(0);
			} else {
				console.log("this one passed");
				def.resolve(1);
			}
		}

		function fail(error) {
		    console.log("upload error source " + error.source);
		    console.log("upload error target " + error.target);
			def.resolve(0);
		}

		var uri = encodeURI("http://localhost/testingzone/test.cfm");

		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=i.substr(i.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";

		var ft = new FileTransfer();
		ft.upload(i, uri, win, fail, options);
		defs.push(def.promise());
		
	});

	$.when.apply($, defs).then(function() {
		console.log("all things done");
		console.dir(arguments);
	});

}</code></pre>

So from top to bottom, what I'm doing is creating an array of promise objects. Or more specifically, the jQuery version of them. I then run an upload call for each image selected by the user. I check the result from the server and either resolve the promise with 0 or 1 based on what the server said. 

Finally, I've got a call to $.when to handle waiting for all these asynch processes to finish. I don't actually show anything, I just console.dir, but you could imagine checking the results and doing - well - whatever makes sense. 

I hope this is useful for folks, and as always, let me know if you have any questions. You can find the complete source here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiupload">https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiupload</a>
---
layout: post
title: "Working with Ionic, Box, and IBM MobileFirst"
date: "2015-06-24T09:02:30+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic,mobilefirst]
banner_image: 
permalink: /2015/06/24/working-with-ionic-box-and-ibm-mobilefirst
guid: 6303
---

Earlier today IBM <a href="http://www-03.ibm.com/press/us/en/pressrelease/47185.wss">announced</a> a new partnership with Box. Box is a cloud storage provider much like Dropbox, OneDrive, and other services, but also provides some pretty cool workflow features as well. While it is still early, you'll soon see some interesting collaborations between IBM and Box. I decided to see how easy it would be to integrate Box into a hybrid mobile application using both <a href="http://ionicframework.com">Ionic</a> and <a href="https://ibm.biz/MobileFirst-Platform">IBM MobileFirst</a>. This is just a simple proof of concept, but it demonstrates how you can use all these different pieces together in one application.

<!--more-->

Before diving into the code, let's look at a few screen shots of the application in action. On loading the application, you will see a button prompting you to login with Box.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-7.55.58-AM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 7.55.58 AM" width="422" height="750" class="aligncenter size-full wp-image-6304 imgborder" />

Clicking this button will begin the authentication process. You need to have an account with Box.com of course.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-7.57.47-AM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 7.57.47 AM" width="422" height="750" class="aligncenter size-full wp-image-6305 imgborder" />

After logging in, you have to allow the application access to your data:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-7.59.09-AM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 7.59.09 AM" width="422" height="750" class="aligncenter size-full wp-image-6306 imgborder" />

After you've allowed the app to access your Box account, you can then begin working with your data. For my demo, I simply let the app upload images from the device to the Box account. (You could modify the code to allow new pictures to be taken with the camera too. Since I was testing with the simulator, I limited it to existing pictures.)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-8.01.00-AM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 8.01.00 AM" width="422" height="750" class="aligncenter size-full wp-image-6307 imgborder" />

After selecting the image, I display a thumbnail and then upload it.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-8.02.20-AM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 8.02.20 AM" width="422" height="750" class="aligncenter size-full wp-image-6308 imgborder" />

If you have your Box account open in a browser (they have a desktop client as well), you can see the image appear.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot14.png" alt="shot1" width="750" height="288" class="aligncenter size-full wp-image-6309" />

And that's it. The Box API allows for <strong>full</strong> access to Box content, more then just uploading. You can even use a special View API to display renditions of Box content. It is a pretty great API and I encourage you to read more about it on their <a href="https://developers.box.com/">developer site</a>. So - let's talk about the code.

In order to handle the OAuth, I used a great library from Nic Raboy called <a href="https://github.com/nraboy/ng-cordova-oauth">ng-cordova-oauth</a>. It provides OAuth support for a butt load of different services, with Box being one of them. How simple is it? Here is the code behind the button you saw in the screen shot above.

<pre><code class="language-javascript">$scope.doAuth = function() {
	Logger.log("Beginning to auth against Box");
		
	$cordovaOauth.box(clientId, clientSecret,state).then(function(result) {
		Logger.log("Successful log to Box");
		token = result.access_token;
		$scope.noAuth = false;
	}, function(error) {
		console.log('Error',error);
	});
}</code></pre>

Yep, that's it. Then using the API itself is rather simple. I first wrote some code to just test hitting the API, in my case, requesting folders at the root of the account. Here is how I did it using Angular's $http service:

<pre><code class="language-javascript">$scope.getFolders = function() {
	console.log("attempting to get folders");
		
	$http.defaults.headers.common.Authorization = 'Bearer '+token;
		 
	$http.get("https://api.box.com/2.0/folders/0").success(function(data, status, headers, config) {
		console.log('succcess');
		console.dir(data);
		  }).
	  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		console.log('error');
		console.dir(arguments);
	 });
}</code></pre>

The only real interesting part here is setting the OAuth token in the header. You can see that is one simple line before the get. Technically I only need to do this once and should set it after logging in - but as I said - I wrote this just as a test of the API. File uploads were a bit more complex. Instead of using $http, I used Cordova's FileTransfer plugin. This let me upload the image file selected by the user. Here's the entirety of the operation including the camera selection and upload.

<pre><code class="language-javascript">$scope.doPicture = function() {
		
	navigator.camera.getPicture(function(uri) {
		$scope.selectedImage = uri;
		$scope.status.message = "Uploading bits to Box...";			
		$scope.$apply();

		Logger.log("Going to send a file to Box");
			
		var win = function (r) {
		    console.log("Code = " + r.responseCode);
		    console.log("Response = " + r.response);
		    console.log("Sent = " + r.bytesSent);
		    $scope.status.message = "Sent to box!";
		    Logger.log("Sent a file to box!");
		    $scope.$apply();
		}
			
		var fail = function (error) {
		    alert("An error has occurred: Code = " + error.code);
		    console.log("upload error source " + error.source);
		    console.log("upload error target " + error.target);
		    Logger.log("Failed to send to Box");
		}
			
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = uri.substr(uri.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";

		var headers={% raw %}{'Authorization':'Bearer '+token}{% endraw %};
			
		options.headers = headers;
			
		var params = {};
		params.attributes = '{% raw %}{"name":"'+options.fileName+'", "parent":{"id":"0"}{% endraw %}}';
			
		options.params = params;
		var ft = new FileTransfer();
		ft.upload(uri, encodeURI("https://upload.box.com/api/2.0/files/content"), win, fail, options);

					
	}, function(err) {
		console.log("Camera error", err);
	}, {
		quality:25,
		destinationType:Camera.DestinationType.FILE_URI,
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY
	});
		
}</code></pre>

And that's it. I then mixed in MobileFirst - specifically the logging service. I blogged about this a few months back (<a href="http://www.raymondcamden.com/2015/03/31/using-remote-logging-with-ionic-and-ibm-mobilefirst"></a>). It is a rather simple API I can make available via a service in my app:

<pre><code class="language-javascript">}).factory('Logger', function() {

	var logger = WL.Logger.create({% raw %}{autoSendLogs:true}{% endraw %});

	return {
		log:function(s) {
			logger.log('log', s);
		        console.log(s);
		}
	}
})</code></pre>

Then when I inject <code>Logger</code> into my controllers, I can just do <code>Logger.log("some message")</code>. There were a few examples of that above. Then when my application is out in the wild, I can look at my analytics in my MobileFirst server:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/06/shot23.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot23.png" alt="shot2" width="800" height="414" class="aligncenter size-full wp-image-6310" /></a>

Want to see all of the code? You can see all the code here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/boxdemo_mfp">https://github.com/cfjedimaster/Cordova-Examples/tree/master/boxdemo_mfp</a>. Note that I ran into two small issues with Nic's OAuth plugin. The first is that after authenticating with Box, you will see a 404 error temporarily. Nic already has a fix for this in the dev branch of his library. It is harmless and can be ignored. The second issue was specifically involving his code running in MobileFirst. Plugins act a bit differently there and his code to check for the InAppBrowser didn't work. (To be clear, that one is absolutely <strong>not</strong> his fault.) The workaround was a quick mod to his code and is in the GitHub repo. You can see a video of the app in action below.

<iframe width="640" height="480" src="https://www.youtube.com/embed/w9q8gwShyBA?rel=0" frameborder="0" allowfullscreen></iframe>
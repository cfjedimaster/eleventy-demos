---
layout: post
title: "Using Authorization Tokens for IBM Watson services"
date: "2015-11-13T10:53:48+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,cordova]
banner_image: 
permalink: /2015/11/13/using-authorization-tokens-for-ibm-watson-services
guid: 7101
---

This is a handy little trick I discovered last week. It is definitely documented (<a href="https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-tokens.shtml">Using tokens with Watson services</a>), but I had not run into the feature until I was investigating a Watson service. Way back in February I wrote up a blog post that discussed how to use the Visual Recognition service with a Cordova application: <a href="http://www.raymondcamden.com/2015/02/06/using-the-new-bluemix-visual-recognition-service-in-cordova">Using the new Bluemix Visual Recognition service in Cordova</a>. While this worked fine, it had a big problem.

<!--more-->

In order for my mobile application to talk to the remote service, I had to embed the username and password in my source code. That's Bad(tm) of course, and I finally got around to correcting that a few months ago: <a href="http://www.raymondcamden.com/2015/08/05/a-real-world-app-with-ibm-bluemix-node-cordova-and-ionic">A real world app with IBM Bluemix, Node, Cordova, and Ionic</a>. The solution was to setup a Node.js server that acted as a proxy between the mobile applications and the Bluemix services. That certainly wasn't hard to do - especially since we've got a kick ass npm package, <a href="https://www.npmjs.com/package/watson-developer-cloud">watson-developer-cloud</a>, that makes it rather trivial to speak to services.

Turns out - there's an even simpler way. Bluemix services support the idea of authorization tokens. Instead of having your mobile app hit Node.js to simply proxy to the remote service, you can have your mobile app hit Node.js and request an authorization token. The token is good for one service so you would need to return multiple tokens if you're using multiple services. Once you have that token, the good news is that you can then skip hitting the Node.js and instead speak directly to the remote service. Let's look at an example. (And I highly encourage you to read the two blog entries I linked to above as the app and it's features are described there.)

First, let's show the server.

<pre><code class="language-javascript">/*eslint-env node*/

var express = require('express');
var bluemix = require('./lib/bluemix.js');
var watson = require('watson-developer-cloud');

var extend = require('util')._extend;


var cfenv = require('cfenv');

var app = express();
//app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

var credentials = extend({
   version: 'v1',
   username: 'get from bluemix',
   password: 'ditto'
}, bluemix.getServiceCreds('visual_recognition'));

var authorization = watson.authorization({
  username: credentials.username,
  password: credentials.password,
  version: 'v1',
  url: 'https://gateway.watsonplatform.net/authorization/api'
});

app.get('/getToken', function(req, res) {
	console.log('ok, lets do this');

	var params = {
		url: 'https://gateway.watsonplatform.net/visual-recognition-beta/api'
	};
	
	authorization.getToken(params, function (err, token) {
		if (!token) {
			console.log('error:', err);
			res.send(&quot;0&quot;);
		} else {
			res.send(token);
		}
	});
	
});

app.listen(appEnv.port, '0.0.0.0', function() {
	console.log(&quot;server starting on &quot; + appEnv.url);
});</code></pre>

The first part of the code handles defaulting my credential information. I get my username and password from the Bluemix console but when I deploy my code to Bluemix, it will pick up on the environment variables instead. 

Now take a look at the authorization section. For the most part this probably makes sense, but there is something that I guarantee will trip you up. It certainly tripped me up. Look at this section of code in particular:

<pre><code class="language-javascript">var authorization = watson.authorization({
  username: credentials.username,
  password: credentials.password,
  version: 'v1',
  url: 'https://gateway.watsonplatform.net/authorization/api'
});</code></pre>

The last setting there, url, is <strong>not</strong> the URL of the API itself. We'll get to that in a minute. Rather, it works kind of a like a "group" in terms of what kind of service you are using. Services are either "regular" or "streaming". A regular service will use the URL you see there: https://gateway.watsonplatform.net/authorization/api. A streaming API will use https://stream.watsonplatform.net/authorization/api. 

Ok, so your next question is, if it isn't obvious, how do I know what type of service I'm using? The answer is in the URL for the service itself. So for example, here is the one I'm using for visual recognition: https://gateway.watsonplatform.net/visual-recognition-beta/api. See "gateway"? Yep, that's your clue. Compare that to the endpoint for text to speech: https://stream.watsonplatform.net/speech-to-text/api. You can see it has "stream" in the domain. This is all probably pretty obvious, and as I type it certainly looks obvious, but as I said, it tripped me up. Also, I discovered this entire feature by looking at the docs for another service, I did <strong>not</strong> have the nicely written <a href="https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-tokens.shtml">feature docs</a> open in my browser.

That's pretty much it. I set up a /getToken route and I call the authorization API. I then just return the token to the caller.

Now let's take a look at the JavaScript code. As I mentioned before, I won't be going over the entire application, instead I'll just focus on the aspect related to this change.

<pre><code class="language-javascript">.controller('MainCtrl', function($scope,$ionicPlatform,$ionicLoading,$http) {
	
	$scope.results = [];
	$scope.cordovaReady = false;

	var token;
	var API_URL = &quot;https://gateway.watsonplatform.net/visual-recognition-beta/api&quot;;

	$ionicPlatform.ready(function() {
		
		$http.get('http://localhost:6006/getToken').then(function(res) {
			token = res.data;
			console.log(token);
			$scope.cordovaReady = true;
		});	
		
	});

	$scope.selectPicture = function() {
					
		var gotPic = function(fileUri) {

			$scope.pic = fileUri;
			$scope.results = [];

			$ionicLoading.show({% raw %}{template:'Sending to Watson...'}{% endraw %});
						
			//So now we upload it
			var options = new FileUploadOptions();
			
			options.fileKey=&quot;image&quot;;
			options.fileName=fileUri.split('/').pop();
			options.headers = {% raw %}{&quot;X-Watson-Authorization-Token&quot;:token}{% endraw %};
			
			var ft = new FileTransfer();
			ft.upload(fileUri, API_URL+&quot;/v1/tag/recognize&quot;, function(r) {
				var result = JSON.parse(r.response);

				var results = [];
				for(var i=0;i&lt;result.images[0].labels.length;i++) {
					results.push(result.images[0].labels[i].label_name);	
				}				

				$scope.$apply(function() {
					$scope.results = results;
				});
				
				$ionicLoading.hide();
				

			}, function(err) {
				console.log('err from watsom', err);
			}, options);
			
		};
			
		var camErr = function(e) {
			console.log(&quot;Error&quot;, e);	
		}
		
		navigator.camera.getPicture(gotPic, camErr, {
			sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType:Camera.DestinationType.FILE_URI	
		});
			
	};
	
})</code></pre>

So the first change is that I immediately call my server to get a token. Since my entire app is "take a picture and identify crap in it" I've bootstrapped the button itself to that load event.

The next change is to the FileTransfer object. I have to add a header with the token, and obviously change the URL. Finally, I have to massage the result a bit. Previously my Node.js app did that for me. Now I'm working with the raw result from the remote service so I do that in the result hander.

And voila - that's it. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/Simulator-Screen-Shot-Nov-13-2015-10.51.51-AM.png" alt="Simulator Screen Shot Nov 13, 2015, 10.51.51 AM" width="394" height="700" class="aligncenter size-full wp-image-7102 imgborder" />
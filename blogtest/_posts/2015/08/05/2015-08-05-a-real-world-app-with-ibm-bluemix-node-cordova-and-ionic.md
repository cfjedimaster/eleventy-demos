---
layout: post
title: "A real world app with IBM Bluemix, Node, Cordova, and Ionic"
date: "2015-08-05T17:01:10+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,cordova,ionic]
banner_image: 
permalink: /2015/08/05/a-real-world-app-with-ibm-bluemix-node-cordova-and-ionic
guid: 6587
---

I'm still working on my <a href="https://github.com/cfjedimaster/SauceDB">large SauceDB project</a>, but during a meeting at work earlier this week my coworkers and I came up with a simple project that may be a nicer introduction to working with <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a> and <a href="http://www.ionicframework.com">Ionic</a>. What follows is a complete application (both back and front end) that is also somewhat simple. There's multiple moving parts here so it does require some setup, but I think this guide would be a good introduction for developers. Of course, the entire thing is also up on GitHub (<a href="https://github.com/cfjedimaster/IonicBluemixDemo">https://github.com/cfjedimaster/IonicBluemixDemo</a>) with the instructions mirrored there as well. Alright, let's get started!

<!--more-->

<h2>What are we building?</h2>

Before we get to the code, what are we actually building? We're building an application that makes use of the <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/visual-recognition.html">Watson Visual Recognition</a> service. We'll create a mobile application that lets you select a picture and send it to the Watson service so it can try and find what's in the picture. If this sounds familiar, it should. I <a href="http://www.raymondcamden.com/2015/02/06/using-the-new-bluemix-visual-recognition-service-in-cordova">blogged</a> about this back in February. However, back then I built a simple Cordova-only demo with the service credentials hard coded into the code. That was bad. This version is "proper" with a Node.js server running as a proxy to Watson on Bluemix. Here's a screen show of the mobile app on start:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/iOS-Simulator-Screen-Shot-Aug-5-2015-10.40.39-AM.png" alt="iOS Simulator Screen Shot Aug 5, 2015, 10.40.39 AM" width="500" height="323" class="aligncenter size-full wp-image-6588 imgborder" />

Clicking the button brings up a prompt to select an image. Note - it would be trivial to make this use a real camera - but by using the photo gallery it is easier to run on a simulator. And obviously you could use two buttons so the user could choose.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/iOS-Simulator-Screen-Shot-Aug-5-2015-10.42.25-AM1.png" alt="iOS Simulator Screen Shot Aug 5, 2015, 10.42.25 AM" width="259" height="300" class="aligncenter size-full wp-image-6590 imgborder" />

After you select the image, it will be uploaded to the Node.js server, sent to Watson for processing (I imagine Watson as millions of tiny minions), and the results returned to the mobile app. Watson includes both labels for things it believe it found as well as scores, but for this app, we'll just display the labels.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/iOS-Simulator-Screen-Shot-Aug-5-2015-10.44.48-AM.png" alt="iOS Simulator Screen Shot Aug 5, 2015, 10.44.48 AM" width="338" height="600" class="aligncenter size-full wp-image-6591 imgborder" />

<h2>Prereqs</h2>

In order to build this project, there's a few things you'll need to get started. 

<ul>
<li><a href="http://cordova.apache.org">Apache Cordova</a> should be installed, and at least one of the mobile SDKs. I tested with iOS, but this should work fine in Android and other platforms as well. In theory, you could try the <a href="http://view.ionic.io/">Ionic View</a> application, but there is one part that I'm fairly certain will not work well. I'm going to test that a bit later.</li>
<li><a href="http://www.ionicframework.com">Ionic</a>.</li>
<li>A <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a> account. Remember, this is 100% free. Yes you will be asked for a credit card after 30 days, but even then you can run Bluemix, and every service on there, at a free tier appropriate for testing. I think our verbiage is a bit unclear on this, but you can run it for free. Free. Did I say it was free? Yes, free.</li>
<li>Node.js installed so you can test locally.</li>
</ul>

<h2>Set up</h2>

Let's begin by creating the application on Bluemix. Assuming you've logged in, begin by clicking Create App under Cloud Foundry Apps.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot1.png" alt="shot1" width="500" height="217" class="aligncenter size-full wp-image-6593" />

Then select Mobile for the type of app you are creating. To be clear, this will only set some default services. You can, and we will in this project, also create a web site via your Node.js application.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot2.png" alt="shot2" width="500" height="204" class="aligncenter size-full wp-image-6594" />

Now select the Mobile option that supports hybrid. To be clear, even though you aren't picking iOS 8, you can still deploy to iOS 8. All we're doing is driving what's automatically added to our application in Bluemix.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot3.png" alt="shot3" width="500" height="246" class="aligncenter size-full wp-image-6595" />

Click Continue and then give this bad boy a name. I like to name my applications optimistically:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot4.png" alt="shot4" width="500" height="220" class="aligncenter size-full wp-image-6596" />

Click Finish and let Bluemix set stuff up for you. When done, you'll get a confirmation screen with some tips for where to go next.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot5.png" alt="shot5" width="600" height="490" class="aligncenter size-full wp-image-6597" />

Just hit continue, and then select the <strong>Start Coding</strong> link in the left hand nav. This next page has a few important links on it:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot6.png" alt="shot6" width="510" height="600" class="aligncenter size-full wp-image-6598 imgborder" />

That first item, "Download CF Command Line Interface", is a <strong>one time</strong> download to get the command line tool. The command line tool, cf, lets you push up your code to the Bluemix server. You'll do this when you want to deploy the app live to the Internet. For our project here you won't ever <i>need</i> to do that, but can if you want to show your app to others. 

The second item, "Download Start Code", gives you the Node.js code to start your server. Normally you could download this to get started on a new application. But our project exists up on GitHub already. Before diving into the code, let's go ahead and set up the service our application will load. Click "Overview" to return to the main application home page, and then "Add a Service or API".

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot8.png" alt="shot8" width="600" height="456" class="aligncenter size-full wp-image-6600" />

Bluemix offers quite a few services, and while I can see "Visual Recognition" there clearly, you may not. You can use the search field on top to quickly narrow down your search. When you click on the Visual Recognition service it will give you a confirmation of the price (free, well, beta, but free!) and where the service will be installed. For now you can accept the defaults.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot9.png" alt="shot9" width="700" height="368" class="aligncenter size-full wp-image-6601" />

<h2>Recap</h2>

Ok, just to recap. We create a new application in Bluemix and added one new service to it, Watson Visual Recognition. 
Now it's time to crack the code!

<h2>The Server</h2>

At the command line, check out the repo: <a href="https://github.com/cfjedimaster/IonicBluemixDemo">https://github.com/cfjedimaster/IonicBluemixDemo</a>

This will give you two folders: server and mobile. The server folder is where the Node.js code will run and the mobile folder is where the Cordova/Ionic code will run. We'll worry about the mobile side in a second. For now, go into the server folder via your Terminal and type:

<code>npm install</code>

This will install the necessary dependencies the application needs. Now, let's open the core file of the application, app.js.

<pre><code class="language-javascript">var express 	= require('express'),
	app     	= express(),
	ibmbluemix 	= require('ibmbluemix'),
	config  	= {
		// change to real application route assigned for your application
		applicationRoute : &quot;put your route here&quot;,
		// change to real application ID generated by Bluemix for your application
		applicationId : &quot;put your id here...&quot;
	};

var watson = require('watson-developer-cloud');
var fs = require('fs');
	
var formidable = require('formidable');

/* This could be read from environment variables on Bluemix */
var visual_recognition = watson.visual_recognition({
  username: 'get this from the BM services panel for Visual Recog',
  password: 'ditto',
  version: 'v1'
});

// init core sdk
ibmbluemix.initialize(config);
var logger = ibmbluemix.getLogger();

//redirect to cloudcode doc page when accessing the root context
app.get('/', function(req, res){
	res.sendfile('public/index.html');
});

app.get('/desktop', function(req, res){
	res.sendfile('public/desktop.html');
});

app.post('/uploadpic', function(req, result) {
	
	console.log('uploadpic');
	
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	
    form.parse(req, function(err, fields, files) {
		var params = {
			image_file: fs.createReadStream(files.image.path)
		};
	 
		visual_recognition.recognize(params, function(err, res) {
		  if (err)
		    console.log(err);
		  else {
			  var results = [];
			  for(var i=0;i&lt;res.images[0].labels.length;i++) {
				results.push(res.images[0].labels[i].label_name);  
			  }
			  console.log('got '+results.length+' labels from good ole watson');

			  /* simple toggle for desktop/mobile mode */
			  if(!fields.mode) {
				  result.send(results);
			  } else {				
				result.send(&quot;&lt;h2&gt;Results from Watson&lt;/h2&gt;&quot;+results.join(', '));  
			  }
		  }
		});

    });
	
});

// init service sdks 
app.use(function(req, res, next) {
    req.logger = logger;
    next();
});

// init basics for an express app
app.use(require('./lib/setup'));

var ibmconfig = ibmbluemix.getConfig();

logger.info('mbaas context root: '+ibmconfig.getContextRoot());
// &quot;Require&quot; modules and files containing endpoints and apply the routes to our application
app.use(ibmconfig.getContextRoot(), require('./lib/staticfile'));

app.listen(ibmconfig.getPort());
logger.info('Server started at port: '+ibmconfig.getPort());</code></pre>

Ok, let's break this down. The first thing you'll notice is a config block:

<pre><code class="language-javascript">config  	= {
	// change to real application route assigned for your application
	applicationRoute : "put your route here",
	// change to real application ID generated by Bluemix for your application
	applicationId : "put your id here..."
};</code></pre>

You need to change these values to the ones specified in the Bluemix console. If you go back to that web page and click the <code>Mobile Options</code> link, you'll see the values there:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot7.png" alt="shot7" width="420" height="120" class="aligncenter size-full wp-image-6599" />

In the screen shot above, the <code>app key</code> value is the <code>applicationId</code> value in code.

Now let's look at this portion:

<pre><code class="language-javascript">var watson = require('watson-developer-cloud');
// ... stuff

var visual_recognition = watson.visual_recognition({
  username: 'get this from the BM services panel for Visual Recog',
  password: 'ditto',
  version: 'v1'
});</code></pre>

So first off, we've added a library called <a href="https://www.npmjs.com/package/watson-developer-cloud">watson-developer-cloud</a> to our application. This provides simple access to various Watson services including the visual recognition one. In order to use the service you need to configure access by supplying the username and password. You can find it by clicking the "Show Credentials" link for the service.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot10.png" alt="shot10" width="400" height="374" class="aligncenter size-full wp-image-6602" />

I want to point out something kinda important here. When your app runs in the Bluemix environment, you have access to environment variables for everything, including services and their authentication information. A <i>better</i> approach here would be for my code to sniff for those variable and use hard coded values when they aren't available. For now though we're keeping it simple. This will let us run the code locally and on Bluemix. Let's carry on through the code. (Note - I'm skipping over some code from the boilerplate that isn't necessarily important. If there is something you want to ask me about, just use the comments below.)

<pre><code class="language-javascript">app.get('/desktop', function(req, res){
	res.sendfile('public/desktop.html');
});</code></pre>

This block will be used to give us a simple web based version of our service. It's going to point to the same API our mobile application will use. By creating this HTML version we end up with a simple (and fast) way to test the functionality of the application before moving to the device.

<pre><code class="language-javascript">app.post('/uploadpic', function(req, result) {
	
	console.log('uploadpic');
	
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	
    form.parse(req, function(err, fields, files) {
		var params = {
			image_file: fs.createReadStream(files.image.path)
		};
	 
		visual_recognition.recognize(params, function(err, res) {
		  if (err)
		    console.log(err);
		  else {
			  var results = [];
			  for(var i=0;i&lt;res.images[0].labels.length;i++) {
				results.push(res.images[0].labels[i].label_name);  
			  }
			  console.log('got '+results.length+' labels from good ole watson');

			  /* simple toggle for desktop/mobile mode */
			  if(!fields.mode) {
				  result.send(results);
			  } else {				
				result.send(&quot;&lt;h2&gt;Results from Watson&lt;/h2&gt;&quot;+results.join(', '));  
			  }
		  }
		});

    });
	
});</code></pre>

Ok, so this is the main API that listens for images. To process the form I'm using a Node package called <a href="https://github.com/felixge/node-formidable">Formidable</a>. This is a super simple package that makes working with file uploads very easy in Node. I create an instance of a form using their API and then ask it to keep extensions. Why? By default Formidable is going to store the file in the operating system's temporary directory. It saves the file with a unique name that has no extension. This file is a valid copy of the binary data you sent to it, but if you try to send it to Watson, the service can't handle the lack of an extension. So I simply tell Formidable to keep the same extension I used when uploading. 

So - finally - we can use the Visual Recognition service to check the file. It is a simple matter of specifying the file (we get that from Formidable) and then pass it to Watson. The result is a complex object including both labels ans scores, but I copy out just the labels to make it easy. 

This final portion:

<pre><code class="language-javascript">/* simple toggle for desktop/mobile mode */
if(!fields.mode) {
	result.send(results);
} else {				
result.send(&quot;&lt;h2&gt;Results from Watson&lt;/h2&gt;&quot;+results.join(', '));  
}</code></pre>

is a somewhat lame way of handling mobile vs desktop testing. A "proper" API would check the headers of the requester to see if it wanted HTML versus JSON and respond accordingly. Since I'm just testing, I use a form field flag to handle this instead.

And that's it. The desktop form is just that - a simple form (you can see all the code <a href="https://github.com/cfjedimaster/IonicBluemixDemo/blob/master/server/public/desktop.html">here</a>), but let's take a look at what this renders in the browser.

At the command line, fire up the server by typing <code>node app</code> then open your browser to the port mentioned in the last line of your terminal:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot11.png" alt="shot11" width="400" height="53" class="aligncenter size-full wp-image-6603" />

Given that your port is probably 3000, open your browser to localhost:3000/desktop:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot12.png" alt="shot12" width="274" height="97" class="aligncenter size-full wp-image-6604 imgborder" />

Select an image and then submit the form. We don't have any validation on the upload for now so be sure to select a valid image. When done, you'll get a result.

Here's the source image:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/Bj1dYR8IUAAaDE4.jpg" alt="Bj1dYR8IUAAaDE4" width="300" height="300" class="aligncenter size-full wp-image-6605" />

And here is the result:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot13.png" alt="shot13" width="500" height="82" class="aligncenter size-full wp-image-6606 imgborder" />

Ok, time to turn to the mobile device!

<h2>The Mobile Client</h2>

As mentioned above, the front end is going to be built using Apache Cordova and Ionic. If you check out the <a href="https://github.com/cfjedimaster/IonicBluemixDemo">Git repo</a> for the project you've got the code already. You will want to create a new Ionic project using the www folder from the Git project as the source. At the time I write this post, the Ionic CLI doesn't make it clear (I filed a bug report and it looks to be fixed already) that you can create a new Ionic project based on a local folder. At your terminal, you can do this:

<code>ionic start mymobileapp ./mobile/www</code>

This assumes you are in the same directory as the Git checkout and you want to call your new folder, mymobileapp. You can call it whatever you want obviously.

You'll want to add your desired platform (for example, <code>ionic platform add ios</code>) and then add the following plugins:

<ul>
<li>cordova-plugin-camera</li>
<li>cordova-plugin-file-transfer</li>
</ul>

You can also use <code>ionic state restore</code> to load plugins from the package.json file.

In theory, you'll be able to test the app right away, but let's take a quick look at the code. First, the index.html page.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;

    &lt;!-- your app's js --&gt;
    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane ng-controller=&quot;MainCtrl&quot;&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Ionic + Bluemix + Watson Demo&lt;/h1&gt;
      &lt;/ion-header-bar&gt;
      &lt;ion-content class=&quot;padding&quot;&gt;
				&lt;button class=&quot;button button-energized button-block&quot; ng-click=&quot;selectPicture()&quot; ng-disabled=&quot;!cordovaReady&quot;&gt;Select Picture&lt;/button&gt;
				
				&lt;p&gt;
				&lt;img ng-src=&quot;{% raw %}{{pic}}{% endraw %}&quot; class=&quot;selPicture&quot;&gt;
				&lt;/p&gt;
				
				&lt;ion-list class=&quot;list-inset&quot;&gt;
					&lt;ion-item ng-repeat=&quot;result in results&quot;&gt;{% raw %}{{result}}{% endraw %}&lt;/ion-item&gt;
				&lt;/ion-list&gt;
				
      &lt;/ion-content&gt;
    &lt;/ion-pane&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

The good stuff starts inside the &lt;body&gt; so let's focus there. The app has a grand total of one screen so we aren't using the fancy State router or views even - we just have one view right inside the index.html file. On top is the button that we'll use to select an image. We then have a blank image that will render the one you selected. Finally, I use a simple &lt;ion-list&gt; to render the results from Watson. Now let's look at the JavaScript.

<pre><code class="language-javascript">// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a &lt;body&gt; attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope,$ionicPlatform,$ionicLoading) {
	
	$scope.results = [];
	$scope.cordovaReady = false;

	$ionicPlatform.ready(function() {	
		$scope.$apply(function() {
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
			
			var ft = new FileTransfer();
			ft.upload(fileUri, &quot;http://localhost:3000/uploadpic&quot;, function(r) {

				//async call to Node, which calls Watson, which gives us an array of crap
				$scope.$apply(function() {
					$scope.results = JSON.parse(r.response);
				});
				
				$ionicLoading.hide();
				

			}, function(err) {
				console.log('err from node', err);
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
	
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})</code></pre>

Alright - let's look at this. The core logic begins with the <code>selectPicture</code> function. As I mentioned, we're only using the photo library, but you could switch to the camera or use both if you would like. When the camera has a selected picture, then the fun begins. We use an instance of the FileTransfer object to send the image to our server. Make a note of this line: <code>ft.upload(fileUri, "http://localhost:3000/uploadpic", function(r) {</code>. This URL assumes you are testing in the simulator on your computer. You need to change this to either a real IP of your machine if testing on a device or the address of your Bluemix server. And that's it. Node.js and Watson handle the crunching. We get back an array of results we can then just add to the scope.

<h2>Wrap Up</h2>

I hope that you have found this a simple, if not necessarily tiny, example of using IBM Bluemix, Node.js, Apache Cordova, and Ionic in a real application. Remember that you can get all of the code here (<a href="https://github.com/cfjedimaster/IonicBluemixDemo">https://github.com/cfjedimaster/IonicBluemixDemo</a>). I'll be updating the readme of the repo tomorrow to be a bit more verbose. If you have any questions, comments, or suggests, just leave me a note below!
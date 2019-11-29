---
layout: post
title: "SauceDB - Building the back end with IBM Bluemix"
date: "2015-07-20T14:40:36+06:00"
categories: [development,html5,javascript]
tags: [bluemix,cordova,ionic]
banner_image: 
permalink: /2015/07/20/saucedb-building-the-back-end-with-ibm-bluemix
guid: 6428
---

Welcome to another post detailing my efforts to build an <a href="http://ionicframework.com">Ionic</a>-based mobile app backed by Node.js and Cloudant on <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a>. In my <a href="http://www.raymondcamden.com/2015/07/15/saucedb-working-on-the-front-end">last post</a>, I focused on the front end of the application. I talked about the various screens I built and how my service layer used mock data to generate data. In today's post, I'm going to setup, design, and connect a back end server to start replacing some of that mock data with real information. As a reminder, you can find the initial post in this series <a href="http://www.raymondcamden.com/2015/07/14/new-demo-project-saucedb">here</a>,

<!--more-->

Alright - so as I mentioned, I'm going to use <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a> to host the application. I've talked about Bluemix before, but let me give you a quick refresher on what it offers.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/Bluemix-logo-right.png" alt="Bluemix-logo-right" width="450" height="167" class="aligncenter size-full wp-image-6429" />

Bluemix is a PaaS offering. If you aren't up to date on the latest acronyms the cool kids use, this is "Platform as a Service". In short, it lets you set up applications and services on the cloud all via a simple dashboard and command line. There's a variety of different services, some I've already blogged about here before, and a large library of code you can add to your application to make using those services even easier. I've already set up my application in Bluemix, but let me walk you through what the process was like.

After signing in (and you can sign up for a trial for free), I clicked on Create App:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot16.png" alt="shot1" width="800" height="408" class="aligncenter size-full wp-image-6430" />

Then selected Mobile:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot23.png" alt="shot2" width="800" height="341" class="aligncenter size-full wp-image-6431" />

And then the option for Hybrid:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot31.png" alt="shot3" width="800" height="404" class="aligncenter size-full wp-image-6432" />

I clicked continue on the detail and then named the app. Note that in the screen shot below I used a slightly different name so as to not conflict with the app I already created.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot42.png" alt="shot4" width="800" height="386" class="aligncenter size-full wp-image-6433" /> 

After you hit finish, your application is going to be staged and a number of default services assigned to it. 

At this point, you have a few options. You can take an existing Node.js app and configure to work with Bluemix services, or you can take their boilerplate code and work with that. Since this is a new app, I recommend getting the boilerplate. You can find that by clicking "Start coding" in the left hand nav:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot6.png" alt="shot6" width="350" height="317" class="aligncenter size-full wp-image-6435" />

This leads you to a documentation page where you can download both the command line interface, something you'll only need to do once, and the boilerplate. As I said, I recommend getting the boilerplate as it has the required modules to work with Bluemix already defined in the package.json. It also includes some sample code that you'll probably want to remove. For example, I'm not using the Mobile Application Security service so I don't need the package. But it is a good place to start.

In case your curious, the "Enable Node.js app" you'll see on top...

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot5.png" alt="shot5" width="800" height="463" class="aligncenter size-full wp-image-6434" />

is just another link to documentation that you can read later. Whenever I see this UI I assume that is a <i>required</i> link, but it is not. To be clear, your Bluemix app itself is ready to kick butt right away, you don't need to flip some toggle. You do need to upload your code using the cf command line. That "Start coding" link I just mentioned explains how to do that. It's fairly simple and I won't repeat it here.

For SauceDB, I needed to modify the services set up by Bluemix. Here is what you get by default:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot7.png" alt="shot7" width="800" height="322" class="aligncenter size-full wp-image-6436" />

Since I'm not using them, I removed both Mobile Application Security and Mobile Data. You can do that using the little gear icon in the upper right side of each service. To add in support for Cloudant, you simply click "Add a Service or API" and find the Cloudant service on the next page. As I said, Bluemix provides access to a bunch of services, so you can use the search form on top to filter them out:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot8.png" alt="shot8" width="600" height="550" class="aligncenter size-full wp-image-6437" />

Ok, so that was a lot, so let me quickly review. I use Bluemix to setup a new mobile application, gave it a new name, and then added a Cloudant service. I can now start building my Node.js app (again, using their boilerplate as a starting point), and then push to Bluemix when I want to deploy. For everything I've done with SauceDB so far, I have yet to actually push my app to Bluemix, which is good because I can work much quicker locally during development.

So, enough with the consoles and crap, let's talk code. First off, everything I'm showing below is available up on the Github project: <a href="https://github.com/cfjedimaster/SauceDB">https://github.com/cfjedimaster/SauceDB</a>.

One of the first things I did was look for a npm module for cloudant. Here's the one I used: <a href="https://www.npmjs.com/package/cloudant">https://www.npmjs.com/package/cloudant</a>. After adding it to my package.json and installing, I added the library to my app.js code and pointed to a database.

<pre><code class="language-javascript">var cloudant = require('cloudant')(credentials.cloudant_access_url);
var db = cloudant.use("sauces");</code></pre>

The URL value you see there, which comes from a credentials.json file that will <i>not</i> be in Github, comes from the service description in the Bluemix console. You can see it by simply clicking the "Show credentials" link:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot9.png" alt="shot9" width="443" height="600" class="aligncenter size-full wp-image-6438" />

Alright... so I'm connecting to a database called sauces, which doesn't actually exist yet. If you click the Cloudant service ... um... "box" I suppose, the detail page will include a link to launch the Cloudant console:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot10.png" alt="shot10" width="800" height="473" class="aligncenter size-full wp-image-6439 imgborder" />

At this point, you can use the "Add New Database" button to add a new database. I did this for "sauces":

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot111.png" alt="shot11" width="800" height="407" class="aligncenter size-full wp-image-6440" />

My goal now was to create some data so that my Node.js app could pick it up and send it back to the mobile app. If you remember the <a href="http://www.raymondcamden.com/2015/07/15/saucedb-working-on-the-front-end">last post</a>, my application begins with a "feed" of reviews. Every review is made by a user and involves a sauce. Cloudant lets you create new docs by hand, so I built a sauce object to start off with:

<pre><code class="language-javascript">{
  "_id": "786fe8d99eaf2c7e5927afe9d2afe44c",
  "name": "Sauce 1",
  "company": "Company 1",
  "reviews": [
    {
      "posted": "2014/05/21 10:00:00",
      "rating": 2,
      "text": "This was a bad sauce.",
      "user": {
        "name": "Joe",
        "img": "http://placekitten.com/g/40/40"
      }
    },
    {
      "posted": "2014/12/21 10:00:00",
      "rating": 2,
      "text": "December This was a bad sauce.",
      "user": {
        "name": "Joe",
        "img": "http://placekitten.com/g/40/40"
      }
    },
    {
      "posted": "2015/6/1 10:00:00",
      "rating": 2,
      "text": "NO IM MORE RECENT This was a bad sauce.",
      "user": {
        "name": "Joe",
        "img": "http://placekitten.com/g/40/40"
      }
    }
  ]
}</code></pre>

User's should probably be a look up reference, but I just wanted some sample data. This data represents one sauce with three reviews. I created a second sauce with one review. At this point I realized I had a problem. It isn't difficult to get all the documents in a database. But that's not what I want. In my case, I need the <i>reviews</i> from the objects, and I need to sort them. I spent a good few hours in the <a href="https://docs.cloudant.com/">Cloudant docs</a>, and I discovered that a "View" could do what I needed. I'm not going to pretend that this is the <strong>best</strong> answer, but it seemed to work well. 

I set up a new design document, and using the Cloudant dashboard, I was able to both write my view and test it interactively, which was a big help. Here's the code I used:

<pre><code class="language-javascript">function(doc) {
  if(doc.reviews.length === 0) return;
  for(var i=0;i&lt;doc.reviews.length;i++) {
      var review = doc.reviews[i];
      emit(review.posted, {% raw %}{review:review,sauce_name:doc.name,sauce_company:doc.company}{% endraw %});
  }
}</code></pre>

And here it is in the dashboard with the output to the right.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot121.png" alt="shot12" width="800" height="408" class="aligncenter size-full wp-image-6441" />

What's cool is - using the Cloudant npm library, it was incredibly trivial to get this view:

<pre><code class="language-javascript">db.view("Reviews", "reviews", {% raw %}{descending:true}{% endraw %}, function(err, body) {</code></pre>

That's simple as heck - but there's one more aspect to this whole thing that I needed to setup. One of the features you can use with your hybrid mobile application is called <a href="https://hub.jazz.net/project/bluemixmobilesdk/ibmcloudcode-javascript/overview">Cloud Code</a>. While it offers a couple features, in general, you can think of it as way to "short cut" your calls to your Node.js application. Using this requires a few changes in your hybrid application. Obviously you have to get the JavaScript library and include it in your HTML. 

Next, you need to initialize Bluemix from within your code. Mine is in app.js, inside $ionicPlatform.ready:

<pre><code class="language-javascript">.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    var config = {
      applicationId:'38a0a550-b018-4a10-b879-aec68868c249',
      applicationRoute:'http://saucedb.mybluemix.net',
      applicationSecret:'735c7d0de828ab956bae772e996a55620676ff05'
    };
    
    IBMBluemix.initialize(config).then(function() {
      console.log('ok maybe?');
    }, function(err) {
       console.log('crap your pants time');
    });
    
    
  });
})</code></pre>

Obviously I'm not actually handling the error case here, but it's something I'll worry about later. (Famous last words.) That sets up basic configuration - and this is where Cloud Code comes in. I can hit my Node.js app with the following code:

<pre><code class="language-javascript">var cc = IBMCloudCode.initializeService();
cc.get("/feed").then(function(data){
	data = JSON.parse(data);
},function(err){
    console.log(err);
});</code></pre>

Note how I just request /feed and nothing more. Because of the earlier configuration code where I specified my application tokens, the Bluemix code knows how to route my requests to my Node.js application on Bluemix. But I just said I was running locally - so how do I fix that?

<pre><code class="language-javascript">var cc = IBMCloudCode.initializeService();
cc.setBaseUrl('http://localhost:3000');
cc.get("/feed").then(function(data){
	data = JSON.parse(data);
},function(err){
    console.log(err);
});</code></pre>

Here is the actual full call now in my services.js file:

<pre><code class="language-javascript">var getFeed = function() {
	var deferred = $q.defer();
	
	//fake it till we make it
	var feed = [];

        //now try the app
        var cc = IBMCloudCode.initializeService();
        cc.setBaseUrl('http://localhost:3000');
        cc.get("/feed").then(function(data){
			data = JSON.parse(data);
			for(var i=0;i&lt;data.length;i++) {
				var result = data[i];
				console.log('did i run');
				var item = {
					id:result.id,
					posted:result.review.posted,
					sauce:{
						name:result.sauce_name,
						company:result.sauce_company
					},
					rating:result.review.rating,
					avgrating:0,
					text:result.review.text,
					user:{
						img:result.review.user.img,
						name:result.review.user.name
					}
				};
				feed.push(item);
			}
			console.log('sending '+feed);
			deferred.resolve(feed);
			
        },function(err){
            console.log(err);
        });

	
	return deferred.promise;
}</code></pre>

On the server side, I have to slightly modify how I create my route. Instead of just app.get('....'), I do something slightly different:

<pre><code class="language-javascript">var ibmconfig = ibmbluemix.getConfig();
app.get(ibmconfig.getContextRoot()+'/feed',  function(req, res) {
	console.log('Requesting feed');

	db.view("Reviews", "reviews", {% raw %}{descending:true}{% endraw %}, function(err, body) {
        //stuff cut out here to keep the code snippet simpler
	});
});</code></pre>

I get an instance of the ibmbluemix config object and grab the context root. This essentially creates a special path that is coordinated (may not be the best word) with the mobile side.

Whew! That was a lot. Did it feel like a lot to you? To be fair, this post covered a <i>lot</i> of setup. We got a server up and running on Bluemix (technically all we did was provision it and we're running code locally), we set up Cloudant, and we created an API to fetch feed data and display it in the mobile app. The end result is real, ok, hand-written essentially, data being driven by Cloudant:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-20-2015-2.33.22-PM.png" alt="iOS Simulator Screen Shot Jul 20, 2015, 2.33.22 PM" width="422" height="750" class="aligncenter size-full wp-image-6442 imgborder" />

Remember, you can see all the source code here:  <a href="https://github.com/cfjedimaster/SauceDB">https://github.com/cfjedimaster/SauceDB</a>

That's it for now. In the next post, I'll continue to flesh out the views and start writing data from the mobile app back to the server.
---
layout: post
title: "Using Cloud Code, Mobile Application Security, Node.js and Bluemix"
date: "2015-06-09T13:35:13+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,cordova,mobilefirst]
banner_image: 
permalink: /2015/06/09/using-cloud-code-mobile-application-security-node-js-and-bluemix
guid: 6275
---

So, first off, forgive the somewhat long, rambly title. I'm working on a new project that involves quite a few moving parts - many of which are new to me. I ran into some trouble along the way (well, a lot of trouble), and this morning I finally broke through and got things working. I want to give huge thanks to my coworker David Cariello for helping me out and not losing patience with me. 
<!--more-->


My application is a hybrid mobile application that makes use of a Node.js app running on <a href="http://www.bluemix.net?cm_mmc=IBM-MobileFirst-_-DevAdvocacy-_-Digital-_-MF">Bluemix</a>. My Node.js app is going to make use of <a href="https://cloudant.com/">Cloudant</a> for data storage and here is where the wrinkle came in. I wanted to make use of a specific feature of Node.js running on Bluemix, <a href="https://www.ng.bluemix.net/docs/#services/mas/index.html#gettingstarted">Mobile Application Security</a> (MAS).

MAS provides a basic framework for locking down resources in your server application. The docs seem to imply it only works with the Mobile Data and Push services, neither of which I'm using. Turns out though you can also secure ad hoc routes in your Node.js application. What's cool is that it isn't an all or nothing solution. You can have some routes open and some closed, depending on whatever your app needs are. So how do you use this? 

Let's start on the client side. You can find all the documentation for working with Bluemix services <a href="http://mbaas-gettingstarted.ng.bluemix.net/javascript">here</a>. It begins by asking you to add a core library using bower:

<code>bower install https://hub.jazz.net/git/bluemixmobilesdk/ibmbluemix-javascript/.git</code>

You then have to add the libraries you'll use. I already said I wasn't using Mobile Application Data and Push. There's another feature though that I will use, <a href="http://mbaas-gettingstarted.ng.bluemix.net/javascript#cloud-code">Cloud Code</a>. You can think of Cloud Code as a quick way of "speaking" to your Node.js application. So while normally you may do something like so:

<code>$.get("the location of my server/my route", etc etc</code>

Cloud Code simplifies this down to calls that look like this:

<code>cc.get("/my route")</code>

So not a <i>big</i> savings, but you then get to add security to your calls automatically and toggle between development and production as well. All in all, it's a nice library. You would add it with bower as well:

<code>bower install https://hub.jazz.net/git/bluemixmobilesdk/ibmcloudcode-javascript/.git</code>

And once you've got both libraries installed, simply address them in your code:

<pre><code class="language-javascript">&lt;script src="lib/ibmbluemix/js/IBMBluemix.js"&gt;&lt;/script&gt;
&lt;script src='lib/ibmcloudcode/js/IBMCloudCode.js'&gt;&lt;/script&gt;</code></pre>

Ok, so now comes the question of using CC. If you aren't using security, or have an unsecured route you want to run, the code looks like this:

<pre><code class="language-javascript">var config = {
  applicationId:"ApplicationID",
  applicationRoute:"ApplicationRoute",
  applicationSecret:"ApplicationSecret"
};

IBMBluemix.initialize(config);
var cc = IBMCloudCode.initializeService();
cc.get("/allfree").then(function(data){
    console.log(data);
},function(err){
    console.log('err',err);
});</code></pre>

The initial block configures your use of Bluemix. All three values can be found by clicking the Mobile Options link on your Bluemix app dashboard:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot12.png" alt="shot1" width="800" height="327" class="aligncenter size-full wp-image-6282" />

You can keep the instance variable around obviously. Also, you get methods for each HTTP type as well, so cc.post, cc.delete, etc. During testing when your Node.js app is running locally, you can switch to hitting your local instance:

<pre><code class="language-javascript">IBMBluemix.initialize(config);
var cc = IBMCloudCode.initializeService();
cc.setBaseUrl('http://localhost:3000');
cc.get("/allfree").then(function(data){
    console.log(data);
},function(err){
    console.log('err',err);
});</code></pre>

That's calling unsecured routes, but what about routes you want locked down? Mobile Application Security supports two types of authentication - Google and Worklight. Google will be easier to use in my mobile application so I selected that. To use Google, you need to use OAuth to log clients in. Nic Raboy has a <strong>very simple</strong> Cordova plugin for this, <a href="https://github.com/nraboy/ng-cordova-oauth">ng-cordova-oauth</a>. His library supports a butt load of different OAuth providers, including Google. To add Google authentication to my app, I added his plugin, and then used this simple code. Note that I do <strong>not</strong> store the result from authentication in this code block. That's something I'll be adding later.

<pre><code class="language-javascript">$cordovaOauth.google("619574182936-8csqdjp25j29ml3l63g985lnqo1p9bnr.apps.googleusercontent.com", ["email"]).then(function(result) {
    console.log('good result');
    console.dir(result)
    $scope.token = result.access_token;
    //more stuff here
}, function(error) {
    // error from oath
    console.log('err '+error);
});</code></pre>

That big value up front there is my Google project client ID. Believe it or not - that's the entirety of the code. The plugin handles popping open a window and running the entire OAuth flow:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-9-2015-1.10.42-PM.png" alt="iOS Simulator Screen Shot Jun 9, 2015, 1.10.42 PM" width="450" height="800" class="aligncenter size-full wp-image-6278 imgborder" />

Once OAuth is done, we can use the access token returned by that process to "sign" our calls to Cloud Code:

<pre><code class="language-javascript">IBMBluemix.setSecurityToken($scope.token, IBMBluemix.SecurityProvider.GOOGLE).done(function(user) {
//stuff here
}, function(err) { 
    console.log('something was bad w/ the token');
}</code></pre>

Now whenever I use Cloud Code calls, they will pass along the token value to the Node.js app. 

That's it for the client-side code. Obviously there's a lot more in the details, and when I get the application I'm <i>really</i> building ready to share, I'll be sharing the complete code base then. Now let's turn our attention to the server-side.

Node.js will require two different packages - first a generic Bluemix library and then the security one. You can install both to your package.json by doing:

<code>
npm install ibmbluemix --save
npm install ibmsecurity --save
</code>

You then configure your application at startup. Here is an example from the boilerplate:

<pre><code class="language-javascript">var express = require('express'),
	app     	= express(),
	ibmbluemix 	= require('ibmbluemix'),
	config  	= {
		// change to real application route assigned for your application
		applicationRoute : 'saucedb.mybluemix.net',
		// change to real application ID generated by Bluemix for your application
		applicationId : '38a0a550-b018-4a10-b879-aec68868c249'
	};
</code></pre>

Now - let's discuss the routes I mentioned earlier using Cloud Code. In the first example, you saw me run a route called <code>/allfree</code>. In order for Cloud Code to access this route, you <strong>must</strong> modify the route path to include an IBM Bluemix context root. This is fairly simple though:

<pre><code class="language-javascript">var ibmconfig = ibmbluemix.getConfig();
app.get(ibmconfig.getContextRoot()+'/allfree', function(req, res) {
    res.send("Pretend I'm doing stuff here.");
});</code></pre>

If you forget this, then you'll get errors running Cloud Code calls from your mobile application. To be clear, a regular HTTP call to /allfree would work, but not the "wrapped" call using Cloud Code.

So the next question is - how do you enable security for routes? To do this, you first physically separate your routes that need security from those that do not. Your core app.js (or whatever file you use to run your Node.js app) should put the unsecured routes first, and then use this block to begin requiring secured calls:

<pre><code class="language-javascript">var mas = require('ibmsecurity')();
app.use(mas);
</code></pre>

Simple, right? Any routes after this call will then require a security token to execute. There's one more part to this that I forgot to mention. When selecting what types of authentication you want to allow, you will want to select the Mobile Application Security service in your dashboard and click the checkbox to enable it, as I've done here:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot21.png" alt="shot2" width="800" height="662" class="aligncenter size-full wp-image-6279" />

I hope this makes sense - if not - just add a comment below.
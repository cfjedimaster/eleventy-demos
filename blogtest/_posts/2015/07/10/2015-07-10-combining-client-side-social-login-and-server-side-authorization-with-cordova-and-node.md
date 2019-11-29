---
layout: post
title: "Combining client-side social login and server-side authorization with Cordova and Node"
date: "2015-07-10T13:57:20+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/07/10/combining-client-side-social-login-and-server-side-authorization-with-cordova-and-node
guid: 6369
---

I believe this wins the title for the longest blog title ever. So what in the hell am I talking about? It isn't too difficult to add a social login aspect to your Apache Cordova application. I've used a variety of plugins/libraries in the past and for the most part - it just plain works. Recently however I ran into an issue that I didn't know how to get around. Given that your mobile client authenticates a user against some OAuth provider, and given than you <i>then</i> allow that user to interact with your server, how do a) ensure that the person running the server API is authenticated and b) how do you uniquely identify that user? That's a bit abstract, so how about a real example?

<!--more-->

Imagine you are building a mobile app that lets a user write notes. While you could store the notes on the client, you really need to store them in your own back end storage. In order to ensure that only authenticated users access your server APIs, you could build your own user system, have the user login (over https of course), store a session variable with their account info, and when they create data (or attempt to read data), use a primary key of some sort to get the right data. 

That's fairly boilerplate. But what happens when you mix in social login on the client-side? In that case, the mobile app handles the OAuth request to the provider and the provider returns a token. So on the client-side you know the current user is kosher. But when she makes a request to your Node (or ColdFusion, PHP, etc) server, how do you handle knowing the user was logged in - and even better - how do you get a unique identifier for that user so you can properly handle their data operations. 

I did a bit of searching and came across this Stackoverflow post/answer: <a href="http://stackoverflow.com/questions/11894506/ios-node-js-how-to-verify-passed-access-token"> iOS & node.js: how to verify passed access token?</a>. User Gijs responded that different OAuth providers have different ways of authenticating an access token. So the idea would be to pass the token to your back-end server, verify it, and then get a unique id.

I decided to give this a shot and build a simple proof of concept. This is very rough, but gives you a basic idea of how you could do this. For my POC, I decided to use Christophe Coenraet's <a href="https://github.com/ccoenraets/OpenFB">OpenFB</a> library. It is a plugin-less JavaScript library that handles OAuth. Most recently I used <a href="https://github.com/nraboy/ng-cordova-oauth">ng-cordova-oauth</a> as well, but I wanted to try something different. I created a quick Ionic application with two simple buttons:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-10-2015-1.44.58-PM.png" alt="iOS Simulator Screen Shot Jul 10, 2015, 1.44.58 PM" width="422" height="750" class="aligncenter size-full wp-image-6371 imgborder" />

The first button fires off the OAuth process. I followed Christophe's directions and created my Facebook app first of course:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-10-2015-1.46.13-PM.png" alt="iOS Simulator Screen Shot Jul 10, 2015, 1.46.13 PM" width="422" height="750" class="aligncenter size-full wp-image-6372 imgborder" />

The code behind this is pretty simple:

<pre><code class="language-javascript">$scope.doLogin = function() {
    console.log("DoLogin");
      openFB.login(
      function(response) {
        if(response.status === 'connected') {
          $scope.token = response.authResponse.accessToken;
          console.log('Token stored: ',response);
          alert('Ok, try to make a call now');
        } else {
          alert('Facebook login failed: ' + response.error);
        }
      }, {% raw %}{scope: 'email'}{% endraw %});                
}</code></pre>

Note I store the access token so I can use it later. Next - we need to call the server. If I remember right, Angular provides a way to modify <i>all</i> HTTP requests to include stuff. For now, I'm keeping it simple and just including the token as part of a form post.

<pre><code class="language-javascript">$scope.doNode = function() {
    $http.post('http://localhost:3000/test1',{% raw %}{msg:"Hello",token:$scope.token}{% endraw %}).
    success(function() {
      console.log('yes im ok');
    }).
    error(function(data,status,headers,config) {
      console.log('error from node');
      console.dir(arguments);      
    });
}</code></pre>

Ok, so far so good. Now let's turn to the Node side. As mentioned in the StackOverflow post I linked to above, you can make a request to graph.facebook.com with the token and if you get the proper response, you know you're good to go. I wrote a function I could use for middleware later on. It caches the test in the session scope which seems safe, but maybe that isn't a good idea.

<pre><code class="language-javascript">function secure(req, result, next) {    
    if(req.session.tokenchecked) {
        next();   
    } else {
		console.log('need to check token ');
		var token = req.body.token;
		//check to ensure token is good
		https.get('https://graph.facebook.com/me?fields=email&access_token='+token, function(res) {
			var str = '';
			res.on('data', function(chunk) {
				str += chunk;
			})
			res.on('end', function() {
				var response = JSON.parse(str);
				console.dir(response);
				if(response.id) {
					console.log('good');
					req.session.tokenchecked = 1;
					next();
				} else {
					console.log('bad');
					result.send("0");
				}
			})
		}).end();
	
    }
}</code></pre>

Something to note here: I'm specifically asking for the email address back. My result looks like this: 

<code>{% raw %}{ email: 'raymondcamden@gmail.com', id: 'abigassnumber' }{% endraw %}</code>

In theory, the ID is unique enough. However, if I use multiple different oauth providers, I can instead use the email as a primary key. That would let you login via Facebook <i>or</i> Twitter and have the same data as long as you have the same email address being used for both accounts. Note that I do <i>not</i> actually store that email address. I would in a real app. Finally, here is the route I called from the mobile app:

<pre><ode class="language-javascript">app.post('/test1', secure, function(req, res) {
	console.log('attempting test1');
	var msg = req.body.msg;
	console.log('msg was '+msg);
	res.send("1");
});</code></pre>

It is pointless, but at least demonstrates using the secure function to wrap the route. 

As I said - this is rough - but it <i>seems</i> to make sense to me. How about you?
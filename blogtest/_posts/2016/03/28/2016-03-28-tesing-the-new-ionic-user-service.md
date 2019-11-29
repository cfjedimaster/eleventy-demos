---
layout: post
title: "Testing the New Ionic User Service"
date: "2016-03-28T10:26:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: /images/banners/ionicuserservice.png
permalink: /2016/03/28/tesing-the-new-ionic-user-service
---

**Please note the date of this article! At the time I wrote this, Ionic Services had recently been given a major update, but they were not fully released yet. What you see in the future may be different than what I demonstrate here!**

A few weeks back Ionic released a brand new version of their services platform. (I discussed it here: [Ionic Services enter Beta](http://www.raymondcamden.com/2016/03/04/ionic-services-enter-beta/)). At that time, I didn't really have the bandwidth to play around with the updates. This morning I spent some time focusing on the [User](http://docs.ionic.io/docs/user-overview) system and I thought I'd share my findings.

<!--more-->

As I mentioned in my earlier post, the User system went from "kinda nice but not terribly useful" to "really freaking good". You can now handle social network logins, custom logins, password resets and custom data. You can also get access to your users via a REST system for complete back-end integration. I built a simple demo to test various aspects of the User API. You can find the complete code for my examples here: [https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicUser2](https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicUser2). Please keep in mind though that this is not a proper 'app', but mainly a test bed, so the code is not optimized and not appropriate for a real application.

Testing Social Login
---

I started off testing the [social login feature](http://docs.ionic.io/docs/social-providers) with Facebook and Twitter. I created two simple buttons, one for each platform. I also did the required set up (see previous link) for each. In both cases, it took less than five minutes to set up and was painless. Here are the buttons:

<pre><code class="language-javascript">
&lt;button class=&quot;button button-block button-positive&quot; ng-show=&quot;!loginButton.hidden&quot; ng-click=&quot;login(&#x27;facebook&#x27;)&quot;&gt;
	Login with Facebook
&lt;&#x2F;button&gt;
&lt;button class=&quot;button button-block button-positive&quot; ng-show=&quot;!loginButton.hidden&quot; ng-click=&quot;login(&#x27;twitter&#x27;)&quot;&gt;
	Login with Twitter
&lt;&#x2F;button&gt;
</code></pre>

Note that I've got a bit of logic to hide them when a user is already authenticated. The user system lets you cache logins so your application needs to prepare for that. Now here is the JavaScript code.

<pre><code class="language-javascript">
$scope.loginButton = {% raw %}{hidden:true}{% endraw %};
	
var user = Ionic.User.current();
console.log('user currently: '+JSON.stringify(user));
	
if (user.isAuthenticated()) {
	console.log('yes auth');
} else {
	console.log('no auth');
	$scope.loginButton = {% raw %}{hidden:false}{% endraw %};
}
// stuff deleted

$scope.customLogin = function() {
	Ionic.Auth.login('basic', {% raw %}{remember:true}{% endraw %}, fakeDetails).then(function(newUser) {
		//goddamn scope freaking issues
		$scope.$apply(function() {
			$scope.loginButton.hidden = true;
		});
		console.log('back ok from custom login, results are '+JSON.stringify(newUser));
		user = newUser;
		//store a custom prop
		user.set('lastLogin',new Date());
		user.save();
	}, function(err) {
		console.log('error from custom '+JSON.stringify(err));
	});
};
</code></pre>

At this point, what you see is based on what button you click. Here is what Facebook login looks like. Notice that I've previously logged in. It is just asking me for my password at this point. Oddly - I don't see a way to change that, and in fact, I could click on the top bar there to browse my Facebook account. That could be a problem. It may be outside of Ionic's control, but I'm going to file a bug report for it right now.

![FB login](https://static.raymondcamden.com/images/2016/03/ionicshot1.png)

On the other hand, Twitter did not seem to cache anything, which is good.

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot2.png" class="imgborder" alt="Twitter Login">

Notice that it is telling you that the app has write access to the account. If you are *only* using Twitter for login, you will want to go into your app settings and change it to read only. I *just* did that, and it was reflected right away.

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot3.png" class="imgborder" alt="Twitter Login 2">

You may be wondering, what happens if you just click "Done" in the bottom of the UI? Nothing. Neither the error nor success handler is run. It basically acts as a 'cancel' for login. Here's where things get interesting. What if you actually hit Cancel in Twitter's UI? First you get this:

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot4.png" class="imgborder" alt="Twitter Login 3">

If you then do, "Return to ionicUser" (that's the name of my app, so I could have picked something nicer), you get this:

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot5.png" class="imgborder" alt="Twitter Login 4">

That's not very nice, but again, I'm not sure what you can do about it. (But to be safe, I logged a bug for that as well.)

Ok, so assuming you login correctly, at the point everything is kosher. Unfortunately, you don't get any information about the user. I expected basic profile data, like their name, or email address, but all you get is a user id. Here is an example after I've logged into Facebook:

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot6.jpg" class="imgborder" alt="FB Login">

I apologize for the slightly ugly display there. Notice that my Facebook ID was returned correctly, but nothing else. (I haven't filed a bug report for this yet as I'm waiting on confirmation that we should get something.) In theory, I could then make use of the Facebook Graph API to get information, but I don't have access to the access token that Ionic used to authenticate. That means - afaik - I'd have to prompt again for the user authentication which wouldn't be nice. The same issue applies to Twitter and I assume the rest of the social login providers.

Using Custom Data
---

Custom data is easy to use. I used it above: `user.set('lastLogin',new Date());`. It just plain works. Don't forget though that when you want to read it, you need to use `get`. I forgot this and was curious why it didn't show up in user.details. I build a function to dump user details just to test this:

<pre><code class="language-javascript">
$scope.details = function() {
	console.log('Details', user.details);
	console.log('custom detail ',user.get('lastLogin'));
};
</code></pre>

The object, `user.details`, is *just* the metadata that Ionic sets. Anything you do custom must be fetched using `get`. Here is an example of it running:

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot7.jpg" class="imgborder" alt="User Details">

You can store simple values and arrays, and they even support [custom types](http://docs.ionic.io/docs/user-usage#data-types) if you want to get fancy. 

As an FYI, user data is stored in LocalStorage on the device. This enables you to know about the user even when you are logged out. 

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot8.jpg" class="imgborder" alt="User Details">

Logout
---

As an FYI, this information is *not* removed from LocalStorage when you run `Ionic.Auth.Logout()`. I think that is a mistake and I've logged a bug for it. When I mentioned it on Slack, another user mentioned it may be useful to keep it around, but at minimum, this should be documented. 

I also logged a bug asking the Ionic folks to clearly state where keys they use in LocalStorage. The docs tell you they use LocalStorage and warn you against removing it with `clear()`, but they should also clearly document the keys they use. I can't see anyone using the same names you see in the screenshot above, but, I'm kinda OCD about stuff like this.

Also - running `Ionic.Auth.Logout()` when you are not logged in does not cause an error. I don't think it should either, but, yeah, I tested that too because I was curious. ;)

Custom Registration
---

To be clear here, I'm talking about *simple* registration, not the [custom authentication](http://docs.ionic.io/docs/custom-authentication) feature. To put it plainly, it just plain worked, although there are a few bugs. Here is the code I used:

<pre><code class="language-javascript">
var fakeDetails = {
	'email':'raymondcamden+test3@gmail.com',
	'password':'12345'
};

$scope.customRegistration= function() {
	//this will work one time
		
	Ionic.Auth.signup(fakeDetails).then(function(newUser) {
		console.log('signup worked ok, here is the new user '+JSON.stringify(newUser));
		//what's the user ob like now?
		user = Ionic.User.current();

		//are they logged on? the docs imply NO
		console.log('newly signed up user logged in?',user.isAuthenticated());	

	}, function(error) {
		console.log('signed failed with '+JSON.stringify(error));
	});
};
</code></pre>

First off, the docs mention a set of error responses. One that was missing was support for an invalid email address. Luckily, this *is* supported, just not documented. (I filed a bug for that.) Another bug is that the success handler is supposed to pass an instance of an Ionic user. It does not - it just passes `true`. (Yes, I filed a bug report.) I can verify that signing up does *not* log you in. I built another button for that, but I think in most cases, you would embed the login directly within the success handler of signup.

<pre><code class="language-javascript">
$scope.customLogin = function() {
	Ionic.Auth.login('basic', {% raw %}{remember:true}{% endraw %}, fakeDetails).then(function(newUser) {
			//goddamn scope freaking issues
		$scope.$apply(function() {
			$scope.loginButton.hidden = true;
		});
		console.log('back ok from custom login, results are '+JSON.stringify(newUser));
		user = newUser;
		//store a custom prop
		user.set('lastLogin',new Date());
		user.save();
	}, function(err) {
		console.log('error from custom '+JSON.stringify(err));
	});
};
</code></pre>

Password Reset
---

Yes, this just works too. If you try to password reset on a social-network authenticated user, you get an error. I expected that, but the error isn't clear. (I logged a bug report for that.) If you use it for a 'basic' login, it works as expected:

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot9.jpg" class="imgborder" alt="Password Reset">

Currently you can't change the email. I filed a bug report suggesting that we should be able to change the from name, the from address, the subject, and the email text (as well as providing both plain and HTMl versions). As I noted in my bug report, this should probably be a premium feature.

The API
---

The last thing I tested was the API. This was something I've been complaining to the Ionic folks about for months, so I was happy to see it fully released. Again, it works as [documented](http://docs.ionic.io/docs/api-getting-started). One thing I noticed though. On the documentation page specifically for [users](http://docs.ionic.io/docs/api-users), they don't tell you that getting all users is supported. This is strongly implied in the [conventions](http://docs.ionic.io/docs/api-conventions) docs, but I believe it should be explictely called out in the list of available methods. (Yep, I filed a bug for it.) I tested in Postman and it works great:

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot10.jpg" class="imgborder" alt="All Users">

Notice that users created with the 'basic' style are marked as 'ionic' users while the Social-created ones have their social network specified.

As a quick aside, the Ionic App's site lets you browser users as well. 

<img src="https://static.raymondcamden.com/images/2016/03/ionicshot11.jpg" class="imgborder" alt="All Users on App Site">


Be aware that there is a caching issue there. I updated a user and then clicked to view their details and my new data wasn't there. Reloading the page updated the data.

Conclusion
---

That's it. I'm going to try to build a "real" application using the service that could possibly be used as a starter for others. Let me know if you have any questions below.
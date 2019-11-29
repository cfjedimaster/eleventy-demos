---
layout: post
title: "Playing with StrongLoop - Building a Blog - Part Three"
date: "2016-02-03T13:11:00-07:00"
categories: [development,javascript]
tags: [strongloop,ionic]
banner_image: /images/banners/strongloop_ibm.png
permalink: /2016/02/03/playing-with-strongloop-building-a-blog-part-three
---

Welcome to the third in my series of building a (somewhat) real-world application using [StrongLoop](http://www.strongloop.com/). In the [first entry](http://www.raymondcamden.com/2016/01/05/playing-with-strongloop-building-a-blog-part-one) I built the beginnings of a simple blog engine. I defined two models (entry and category) and whipped up a quick front end for the blog. In the [last entry](http://www.raymondcamden.com/2016/01/07/playing-with-strongloop-building-a-blog-part-two/) I locked down the APIs so that unauthenticated visitors couldn't create content. Today I'm going to demonstrate an administrator for my blog. My administrator will be a desktop tool built with [Electron](http://electron.atom.io/) and [Ionic](http://www.ionicframework.com). I first [blogged](http://www.raymondcamden.com/2015/07/23/some-initial-thoughts-on-building-desktop-apps-with-ionic-and-electron/) about mixing Ionic and Electron about six months ago. It is still rather easy and you can check out the results on the GitHub repo for this project when your done reading. (I'll include the link at the end.) 

<!--more-->

Let's take a quick tour through the app and then I'll demonstrate it in action with a quick video. On startup, the application prompts you to login. Please do not blame Ionic for my poor color choices.

<img src="https://static.raymondcamden.com/images/2016/02/blogeditor1.png" class="imgborder">

After login, you're presented with a list of existing blog entries as well as a button to add a new one. For this quick demonstration, I did not add editing or deleting capabilities, but it wouldn't be too difficult.

<img src="https://static.raymondcamden.com/images/2016/02/blogeditor2.png" class="imgborder">

Clicking Add Entry brings you to a simple form:

<img src="https://static.raymondcamden.com/images/2016/02/blogeditor3.png" class="imgborder">

And that's it. As I said, proper edit/delete isn't built in yet, but that's all it would take to turn this into a real CRUD desktop app for the server. 

To be clear, I'm really barely scratching the surface of what Electron can do. I've basically used it as a simple wrapper for a web view and nothing more. Off the top of my head - here are some more interesting features I could add to it:

* Drag and drop images. I could capture the drop event - upload the file to the server, and automatically inject the HTML for the image into the source. This is how WordPress does it and it would certainly be possible with Electron.

* Of course, I could customize the icon like a "proper" desktop application.

* And probably more that I'm not thinking about.

So how about the code? First and foremost I want to point out that StrongLoop has an [AngularJS library](https://docs.strongloop.com/display/public/LB/AngularJS+JavaScript+SDK) and I that I *should* have made use of it. I did not. I want to - eventually - but I thought it might be a good opportunity to work more with AngularJS's [$resource](https://docs.angularjs.org/api/ngResource/service/$resource) feature. To be honest, I had a few problems with it and I should have taken that as a clue to just switch to StrongLoop's stuff, but I was stubborn.

Here's how I designed my Services:

<pre><code class="language-javascript">
angular.module('starter.services', [])
.factory('userService', function($q,$resource) {

	return $resource('http://localhost:3000/api/appusers/:id',{},
	{
		'login':{
			'method':'POST',
			'url':'http://localhost:3000/api/appusers/login'
		}
	});

})
.factory('entryService', function($q,$resource) {

	return $resource('http://localhost:3000/api/entries/:id');

});
</code></pre>

As you can see - I simply $resource-wrapped my two main APIs - one for users and one for entries. (I'm still not *really* supporting categories yet.) For users I had to add the custom login method that ships out of the box. On the calling side, here is the controller code for doing login.

<pre><code class="language-javascript">
.controller('loginCtrl', ['$scope', '$rootScope', 'userService', '$state', '$http',
	function($scope, $rootScope, userService, $state, $http) {
	
	$scope.user = {% raw %}{username:'raymondcamden@gmail.com',password:'password'}{% endraw %};

	$scope.doLogin = function() {
		if($scope.user.username === '' || $scope.user.password === '') {
			return;
		}
		userService.login({% raw %}{email:$scope.user.username,password:$scope.user.password}{% endraw %},function(res) {
			$rootScope.authToken = res.id; // don't really need to keep it
			$http.defaults.headers.common['Authorization'] = $rootScope.authToken;
			$state.go('root.Home');	
		},function(e) {
			//for right now - generic error
			alert('Login Failed');
		});
	};

}])
</code></pre> 

First off - I'm hard coding the username and password in there just to save me on typing. That's a pro-tip there. The login call is pretty simple, but I need to remember the auth token returned by the Loopback API. I both store it in rootScope (that's bad, right? I'm ok with bad) and add it to my $http headers. I did that because I had trouble getting custom headers to work with $resource. That's most likely my fault, but this worked for now. You can read more about authenticating requests and StrongLoop at the docs: [Making authenticated requests](https://docs.strongloop.com/display/public/LB/Making+authenticated+requests).

Listing entries is simple - I had to include the ordering argument in the controller code which *also* feels like a mistake (it should be in the service I think), but it worked well enough:

<pre><code class="language-javascript">
entryService.query({% raw %}{"filter[order]":"published desc"}{% endraw %},function(res) {
	$scope.entries = res;
}, function(e) {
	console.log('bad '+JSON.stringify(e));			
});
</code></pre>

Finally - here's how I save a new entry. Note I automate the slug and published values.

<pre><code class="language-javascript">
$scope.doSave = function() {
	var postedDate = new Date();

	var newEntry = new entryService();
	newEntry.title = $scope.entry.title;
	newEntry.body = $scope.entry.body;
	newEntry.released = true;
	newEntry.published = new Date();
	//not perfect...
	newEntry.slug = newEntry.title.replace(/ /g,'-');
	newEntry.$save();
	$state.go('root.Home');	

}
</code></pre>

You can find the source code for my app here: [https://github.com/cfjedimaster/StrongLoopDemos/tree/master/blog2/client/electron-quick-start](https://github.com/cfjedimaster/StrongLoopDemos/tree/master/blog2/client/electron-quick-start). I also built a quick video showing the app in action. Enjoy!

<iframe width="640" height="360" src="https://www.youtube.com/embed/TsLKg7notnA" frameborder="0" allowfullscreen></iframe>
---
layout: post
title: "A quick example of the Ionic Loading Widget"
date: "2015-12-17T09:36:46+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/12/17/a-quick-example-of-the-ionic-loading-widget
guid: 7267
---

One of the things I love most about <a href="http://www.ionicframework.com">Ionic</a> is how rapidly you can build applications. Many of the cooler features are simple things that can be quickly implemented for an easy win. I like easy wins. Here is a great example of that - the <a href="http://ionicframework.com/docs/api/service/$ionicLoading/">Ionic Loading</a> widget.

<!--more-->

Imagine you've got a simple service method runs over HTTP. This process can be fast or slow based on network conditions, size of the data, and other factors. (Like the Force. Hey, it can happen.) Your code probably looks like this:

<pre><code class="language-javascript">.controller('SearchCtrl', function($scope,DataService) {
	$scope.search = {% raw %}{property:''}{% endraw %};
	$scope.results = [];
	
	$scope.doSearch = function() {
		if($scope.search.property === '') return;
		$scope.results = [];
		DataService.searchProperties($scope.search.property).then(function(res) {
			$scope.results = res;
		});
	}
	
})</code></pre>

We're not concerned about the service itself. It returns a promise and will take "some time" to return. So if that service happens to be slow today, it could look like this:

<iframe width="420" height="315" src="https://www.youtube.com/embed/uDyax91JkBU" frameborder="0" allowfullscreen></iframe>

Notice on click there is no visual feedback to the user that anything is happening. If they are impatient (and what user isn't), they could click multiple times and fire off numerous Ajax requests. Let's fix that:

<pre><code class="language-javascript">.controller('SearchCtrl', function($scope,DataService,$ionicLoading) {
	$scope.search = {% raw %}{property:''}{% endraw %};
	$scope.results = [];
	
	$scope.doSearch = function() {
		if($scope.search.property === '') return;
		$scope.results = [];
		$ionicLoading.show();
		DataService.searchProperties($scope.search.property).then(function(res) {
			$scope.results = res;
			$ionicLoading.hide();
		});
	}
	
})</code></pre>

There are precisely three changes here. I added $ionicLoading to the controller - I ran the show() method on it before I began the async process - and finally I hid it using hide(). That's it. I could customize the widget with a message if I was feeling fancy, but today isn't a fancy day. Here is the change:

<iframe width="420" height="315" src="https://www.youtube.com/embed/UOuUD_lEfm0" frameborder="0" allowfullscreen></iframe>

Ok, so this isn't exactly rocket science, but for about 30 seconds of coding I got a much improved experience.
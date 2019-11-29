---
layout: post
title: "Working around Ionic's cached views"
date: "2015-09-08T01:58:19+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/09/08/working-around-ionics-cached-views
guid: 6740
---

Just a quick tip here as it came up in the presentation I did today - how do you handle running code when a particular view runs in Ionic? Let me begin with an example so you get what I'm talking about. Given a new Ionic application using the default tabs application, I'm going to modify the Account controller to add a random number to the scope:

<!--more-->

<pre><code class="language-javascript">.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
	
  console.log("Running stuff...");
  $scope.number = Math.floor(Math.random()*10);

})</code></pre>

In the view for this view I added a quick display for the number: Random number: {% raw %}{{number}}{% endraw %}

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/iOS-Simulator-Screen-Shot-Sep-8-2015-2.50.52-PM.png" alt="iOS Simulator Screen Shot Sep 8, 2015, 2.50.52 PM" width="281" height="500" class="aligncenter size-full wp-image-6741 imgborder" />

Yeah, not the most exciting demo, but you get the idea. What you'll notice right away though is that as you click back and forth between different tabs, the value doesn't change. And if you open up your remote dev tools, you'll see the console message run only once.

This is due to the default caching system built into the <a href="http://ionicframework.com/docs/api/directive/ionView/">ion-view</a> directive. Luckily it is rather easy to fix with one of the life cycle events. The docs say you can listen for these events but don't demonstrate how. Here is an example:

<pre><code class="language-javascript">.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
	
  $scope.$on("$ionicView.beforeEnter", function() {
    console.log("Running stuff...");
    $scope.number = Math.floor(Math.random()*10);
  });
	
})</code></pre>

And that's it. For me the tricky part was $scope.$on, something I've not used in Angular before. You can read more about the events at the <a href="http://ionicframework.com/docs/api/directive/ionView/">docs</a>.
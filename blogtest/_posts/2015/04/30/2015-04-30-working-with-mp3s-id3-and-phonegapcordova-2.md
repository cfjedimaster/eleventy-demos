---
layout: post
title: "Working with MP3s, ID3, and PhoneGap/Cordova (2)"
date: "2015-04-30T16:24:24+06:00"
categories: [development,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/04/30/working-with-mp3s-id3-and-phonegapcordova-2
guid: 6093
---

Yesterday I <a href="http://www.raymondcamden.com/2015/04/29/working-with-mp3s-id3-and-phonegapcordova">blogged</a> about using MP3s and ID3 information in a PhoneGap/Cordova application. Today I've taken the initial proof of concept I built in that demo and updated to make use of the <a href="http://ionicframework.com">Ionic framework</a>. I've also a few other features to make the application a bit more applicable to real world usage. Finally, I've also uploaded it my GitHub repo (along with a copy of the last version) for you to use in your own applications. Before we get into the code, let's take a look at the visual updates.

<!--more-->

The first update was the addition of a spinner dialog. I used the spinner from <a href="http://ngcordova.com/docs/plugins/spinnerDialog/">ngCordova</a>.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/Screen-Shot-2015-04-30-at-4.06.16-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Screen-Shot-2015-04-30-at-4.06.16-PM.png" alt="Screen Shot 2015-04-30 at 4.06.16 PM" width="527" height="850" class="alignnone size-full wp-image-6094" /></a>

This will display while the code is parsing the MP3s for their ID3 information. When done, a list is displayed:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/Screen-Shot-2015-04-30-at-4.09.50-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Screen-Shot-2015-04-30-at-4.09.50-PM.png" alt="Screen Shot 2015-04-30 at 4.09.50 PM" width="527" height="850" class="alignnone size-full wp-image-6095" /></a>

Yeah, not very colorful, I really need to add something to the header to make it prettier. But you get the idea. Then when an item is selected, you get a nice Ionic card display:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/Screen-Shot-2015-04-30-at-4.10.37-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/Screen-Shot-2015-04-30-at-4.10.37-PM.png" alt="Screen Shot 2015-04-30 at 4.10.37 PM" width="527" height="850" class="alignnone size-full wp-image-6096" /></a>

Now let's break down the code - and remember - you can download everything from the repo I'll link to at the bottom. First - the core app.js for the app:

<pre><code class="language-javascript">angular.module('starter', ['ngCordova','ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova &amp;&amp; window.cordova.plugins &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  $stateProvider
  .state('list', {
    url: '/',
    templateUrl: 'templates/list.html',
    controller: 'ListCtrl'
  })
  .state('list-detail', {
      url: '/item/:itemId',
      templateUrl: 'templates/detail.html',
      controller: 'DetailCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  
});</code></pre>

The only thing of note here really is the use of $stateProvider to setup the various states of my app - which in this case is either a list of MP3s or a detail. Now let's look at the controller.

<pre><code class="language-javascript">angular.module('starter.controllers', [])

.controller('ListCtrl', function($scope, MP3Service, $cordovaSpinnerDialog) {
	console.log('ListCtrl loaded');

	document.addEventListener('deviceready', function () {

		console.log('begin to get stuff');
		$cordovaSpinnerDialog.show(&quot;Loading...&quot;,&quot;&quot;, true);
	
		MP3Service.getAll().then(function(results) {
			$cordovaSpinnerDialog.hide();
			$scope.content = results;
		});

	});
		
})
.controller('DetailCtrl', function($scope, $stateParams, MP3Service) {
	console.log('DetailCtrl loaded');
	$scope.detail = {};
	
	getMediaURL = function(s) {
	    if(device.platform.toLowerCase() === &quot;android&quot;) return &quot;/android_asset/www/&quot; + s;
	    return s;
	}

	$scope.play = function() {
		console.log('click for '+$scope.detail.url);
		
		MP3Service.play(getMediaURL($scope.detail.url));
	};

	MP3Service.getOne($stateParams.itemId).then(function(result) {
		console.dir(result);
		result.description = &quot;Artist: &quot; + result.tags.artist + &quot;&lt;br/&gt;&quot; +
		 					 &quot;Album: &quot; + result.tags.album;
		$scope.detail = result;
	});

});</code></pre>

Ok, so this one is a bit more complex. The first controller, ListCtrl, handles asking a service to return a list of MP3s. It uses the spinner dialog to let the user know "stuff" is going on in the background. Once it has the data, it hides the spinner and the results are displayed. Note the deviceready listener wrapping the call. I forgot this initially and spent about an hour trying to figure out why my app wouldn't run until I did a reload in the console. Dumb, I know, but sometimes when I use Ionic I forget to remember I need deviceready in my controller. 

The next controller handles fetching specific information about a MP3 as well as providing a way to play the MP3. I put that in a service as well so I could handle storing the state of the current MP3 being played. 

So far so good? Ok, let's take a look at the service. Most of this is from yesterday's post.

<pre><code class="language-javascript">angular.module('starter.services', [])

.factory('MP3Service', function($q,$cordovaFile) {
	
	//root of where my stuff is
	console.log('running service');
	var items = [];

	function getAll() {
		var rootFolder = cordova.file.applicationDirectory;
		var mp3Loc = 'music/';
		//where the music is
		var mp3Folder = rootFolder + 'www/' + mp3Loc;
		console.log(mp3Folder);

		var deferred = $q.defer();

		window.resolveLocalFileSystemURL(mp3Folder, function(dir) {
			var reader = dir.createReader();
			//read it
			reader.readEntries(function(entries) {
					console.log(&quot;readEntries&quot;);
					console.dir(entries);

					var data = [];

					var process = function(index, cb) {
						var entry = entries[index];
						var name = entry.name;
						entry.file(function(file) {

							ID3.loadTags(entry.name,function() {
								var tags = ID3.getAllTags(name);
								//default to filename
								var title = entry.name;
								if(tags.title) title = tags.title;
								//for now - not optimal to include music here, will change later
								data.push({% raw %}{name:title, tags:tags, url:mp3Loc+entry.name}{% endraw %});
								if(index+1 &lt; entries.length) {
									process(++index, cb);
								} else {
									cb(data);
								}
							},{
								dataReader:FileAPIReader(file)
							});

						});

					};

					process(0, function(data) {
						console.log(&quot;Done processing&quot;);
						console.dir(data);
						items = data;
						deferred.resolve(items);
					});


			});

		}, function(err) {
			deferred.reject(err);
		});


		return deferred.promise;
		
	}

	function getOne(id) {
		var deferred = $q.defer();
		deferred.resolve(items[id]);

		return deferred.promise;
	}

	var media;
	function play(l) {
		if(media) {% raw %}{ media.stop(); media.release(); }{% endraw %}
		media = new Media(l,function() {% raw %}{}, function(err) { console.dir(err);}{% endraw %});
		media.play();
	}
	
	return {
		getAll:getAll,
		getOne:getOne,
		play:play
	};
  
});</code></pre>

Ok, there's a <i>lot</i> going on here. First - for this application I decided to ship the MP3s with the application. Now, in a real world app if you were going to do that, you wouldn't bother using an ID3 service. You would simply hard code it. That would be a heck of a lot quicker. But try to imagine an app where MP3s are downloaded after the initial install. This brings up another interesting issue. The area under www is <strong>read only</strong>, so technically you can't download there. But - and I'm not 100% sure on this - the Media plugin only supports remote URLs and local URLs <strong>under</strong> www. I could be wrong on that (and I've raised the question on the PhoneGap developer list), but... yeah. I'm not sure how the Media plugin would work with stuff outside of www. For now, I'm going to pretend it isn't an issue. 

Another thing I didn't do here is caching. Since the service won't run again when you return to the app home page, I didn't need it, but I'd <strong>strongly</strong> consider adding a simple caching layer with LocalStorage. I think storing the tags for a path would be simple enough and would take maybe five minutes more work. 

And that's pretty much it. You can find the full source here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/mp3reader">https://github.com/cfjedimaster/Cordova-Examples/tree/master/mp3reader</a>. Tomorrow I'll have yet another iteration of this demo.
---
layout: post
title: "SauceDB - Working on the front end"
date: "2015-07-15T16:04:07+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/07/15/saucedb-working-on-the-front-end
guid: 6397
---

Yesterday I <a href="http://www.raymondcamden.com/2015/07/14/new-demo-project-saucedb">blogged</a> about a new project I'm building to demonstrate both <a href="http://www.ionicframework.com/">Ionic</a> and <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a>. I've made some progress on the project so I thought I'd share what I've built so far. My thinking is that as this project goes on I'll continue to share these updates so folks can see how I approach projects. Feel free to comment, criticize and make suggestions!

<!--more-->

Before I begin, note that I've checked in my code to the Github repo: <a href="https://github.com/cfjedimaster/SauceDB">https://github.com/cfjedimaster/SauceDB</a>. You can find the bits I'm covering today in the <code>mobile</code> folder.

This release focuses on the front end. I've decided to try to get as much of the mobile app done as possible. By using services in my Angular app, in theory, I can mock everything up with fake data and then - in theory - just replace with calls to the Node.js server. I'm not going to pretend that I think this will happen perfectly, but I find that if I focus on one aspect of the project at a time I can be a bit more productive. So let's look at the screens done so far.

<h2>Login</h2>

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-15-2015-2.51.51-PM.png" alt="iOS Simulator Screen Shot Jul 15, 2015, 2.51.51 PM" width="394" height="700" class="aligncenter size-full wp-image-6398 imgborder" />

This has a lot of wasted space - and I'd imagine some nice logo above the button - but as I don't have a logo yet (any volunteers) I've let it simple. The Facebook button is going to use the <a href="https://github.com/ccoenraets/OpenFB">OpenFB</a> library I mentioned before. Let's take a look at the controller.

<pre><code class="language-javascript">.controller('LoginCtrl', function($scope, $ionicPlatform, ngFB, $rootScope, $state, $ionicHistory) {
	console.log('LoginCtrl');
  
  //used to skip auth when testing
  var skipAuth=true;
  
  $ionicPlatform.ready(function() {

    ngFB.init({% raw %}{appId: '467761313406666'}{% endraw %});
    
    $scope.doLogin = function() {

      if(skipAuth) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('Home');        
        return;
      }

      ngFB.login({% raw %}{scope: 'email'}{% endraw %}).then(function(response) {          
          console.log('Facebook login succeeded', response.authResponse.accessToken);
          $rootScope.accessToken = response.authResponse.accessToken;
          ngFB.api({
            path:'/me',
            params: {% raw %}{ fields: 'id,name'}{% endraw %}
          }).then(
            function(user) {
              console.log(user);
              $rootScope.user = user;
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('Home');
            }, function(err) {
              
          });
      },function(error) {
          alert('Facebook login failed: ' + error);
      });
                 
    }
    	
  });
	
})</code></pre>

The first thing you'll notice is a "skipAuth" flag. As you can guess, this lets me skip login while testing. Since I'm focused on building out my views and basic integration, I didn't want to have to relogin every time the page reloaded. When that little hack isn't enabled, you can see how I use OpenFB to both authenticate and then call the API to get information about the current user. My thinking here is that I want some basic details about you (email, name, profile picture) so I can greet you by name. 

<h2>Feed</h2>

Next up is the "Feed"/Stream/etc view. This is meant to show all the most recent sauce reviews. Here is how it looks - and yes - it definitely needs some love. This also handles the "Add Review" logic of writing your own sauce reviews. For now though we'll focus on the feed.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-15-2015-3.40.26-PM.png" alt="iOS Simulator Screen Shot Jul 15, 2015, 3.40.26 PM" width="394" height="700" class="aligncenter size-full wp-image-6399 imgborder" />

Let's take a look at the code. First, the controller.

<pre><code class="language-javascript">.controller('HomeCtrl', function($scope,dataService,$ionicLoading,$ionicModal,$state) {
  console.log('HomeCtrl');
  $ionicLoading.show({% raw %}{template:&quot;Loading feed...&quot;}{% endraw %});
  
  dataService.getFeed().then(function(res) {
    $ionicLoading.hide();
    $scope.feed = res;
  });

  $ionicModal.fromTemplateUrl('partials/findsauce.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.doSearch = function(term) {
    console.log('search for: '+term);
    dataService.searchSauce(term).then(function(res) {
      console.log('back from search with '+JSON.stringify(res));
      $scope.results = res;
    });
  }
  
  $scope.doLoad = function(id) {
    $scope.modal.hide();
    $state.go(&quot;AddReview&quot;, {% raw %}{id:id}{% endraw %});
  }
  
  $scope.addReviewForm = function() {
    $scope.modal.show();
  }

})</code></pre>

The part that gets the feed simply speaks to the dataService I mentioned earlier. I'll talk more about 'Add Review' in a bit. Here's the service method handling the feed:

<pre><code class="language-javascript">var getFeed = function() {
	var deferred = $q.defer();
		
	//fake it till we make it
	var feed = [];
	var promises = [];
		
	for(var i=1;i&lt;5;i++) {
		promises.push($http.get('http://api.randomuser.me/?x='+Math.random()));
	}

	$q.all(promises).then(function(data) {
		for(var i=0;i&lt;data.length;i++) {
			var user = data[i].data.results[0].user;
			var item = {
				id:i,
				posted:&quot;July 14, 2015 at 2:32 PM&quot;,
				sauce:{
					name:&quot;Sauce &quot;+i,
					company:&quot;Company &quot;+i
				},
				rating:Math.round(Math.random()*5) + 1,
				avgrating:Math.round(Math.random()*5) + 1,
				text:&quot;This sauce was rather spicy with a nice aftertaste...&quot;,
				user:{
					img:user.picture.thumbnail,
					name:user.name.first+' '+user.name.last
				}
			}
			feed.push(item);			
		}
		deferred.resolve(feed);
	});
		
	return deferred.promise;
}</code></pre>

For absolutely no good reason, I decided I'd make use of the <a href="https://randomuser.me/">Random User Generator</a> API for my mocked data. On reflection that seems kind of stupid and a waste of time, but it was fun to check out the service and get 'real' pictures/names in the feed. Plus, it made the service a bit slow which felt a bit more life like. Each feed item consists of a sauce object (just the name, company) and a review object (user, rating, etc). As I write this, I see that "avgrating" really should be part of the Sauce object (something I naturally did in other code) so I'll have to fix that soon.

Clicking on Add Review pops open a modal. The idea for the modal is to let you search for a sauce to see if it exists. If it does, you can select it and then just write your review. Otherwise you need to include the sauce name and company when writing the review. I built a very simple "search as you type" service in the modal window:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-15-2015-3.52.45-PM.png" alt="iOS Simulator Screen Shot Jul 15, 2015, 3.52.45 PM" width="394" height="700" class="aligncenter size-full wp-image-6400 imgborder" />

I showed the search code at the controller layer up above. The search service itself is hard coded:

<pre><code class="language-javascript">var searchSauce = function(term) {
	var deferred = $q.defer();
	term = term.toLowerCase();
		
	//use hard coded set of names 
	var names = [
		&quot;Alpha&quot;,&quot;Amma&quot;,&quot;Anna&quot;,&quot;Anno&quot;,&quot;Alphabet&quot;,&quot;Alcazam&quot;
	]
	var results = [];
	for(var i=0;i&lt;names.length;i++) {
		if(names[i].toLowerCase().indexOf(term) &gt;= 0) results.push({% raw %}{id:1,label:names[i]}{% endraw %});	
	}
	deferred.resolve(results);
	return deferred.promise;
	
}</code></pre>

<h2>Adding a Review</h2>

My static list is short, but useful enough for testing. For now, I don't support adding new sauces, so I just bound the list to a new review form:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-15-2015-3.55.02-PM.png" alt="iOS Simulator Screen Shot Jul 15, 2015, 3.55.02 PM" width="394" height="700" class="aligncenter size-full wp-image-6401 imgborder" />

The fancy star widget there came from <a href="https://github.com/fraserxu/ionic-rating">https://github.com/fraserxu/ionic-rating</a>. It's rather easy to use. You can see it in the view below:

<pre><code class="language-markup">&lt;!--
	I'll be used for adding a new review to an existing sauce and
	for adding a review to a new sauce.
--&gt;
&lt;ion-view title=&quot;Add Review&quot;&gt;
	
	&lt;ion-content class=&quot;padding&quot;&gt;
	
		&lt;div ng-if=&quot;existingSauce&quot;&gt;
			Sauce: {% raw %}{{sauce.name}}{% endraw %}&lt;br/&gt;
			Company: {% raw %}{{sauce.company}}{% endraw %}
		&lt;/div&gt;
		
		&lt;!-- your text --&gt;
		&lt;div class=&quot;list list-inset&quot;&gt;
		  &lt;label class=&quot;item item-input&quot;&gt;
			  &lt;textarea placeholder=&quot;Your Review&quot; ng-model=&quot;review.text&quot;&gt;&lt;/textarea&gt;
		  &lt;/label&gt;
		&lt;/div&gt;

		Rating: &lt;rating ng-model=&quot;review.rate&quot; max=&quot;max&quot;&gt;&lt;/rating&gt;		

		&lt;button class=&quot;button button-assertive button-full&quot; ng-click=&quot;addReview()&quot;&gt;Add Rating&lt;/button&gt;

	&lt;/ion-content&gt;

&lt;/ion-view&gt;</code></pre>

For now, clicking the Add Review button just returns the user to the sauce. 

<h2>Sauce View</h2>

Speaking of - you can also view a sauce and all its reviews. This really needs some formatting love:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-15-2015-3.59.17-PM.png" alt="iOS Simulator Screen Shot Jul 15, 2015, 3.59.17 PM" width="394" height="700" class="aligncenter size-full wp-image-6402 imgborder" />

For yet another completely silly reason, I changed the user pics here to kittens. Because kittens. Here's the service method that "fakes" a sauce retrieval:

<pre><code class="language-javascript">var getSauce = function(id) {
	var deferred = $q.defer();
	//so a review is the Sauce object + array of reviews
	//to keep it simpler, we'll skip the fancy randomuser integration
	var sauce = {
		name:&quot;Sauce &quot;+id,
		company:&quot;Company &quot;+id,
		avgrating:Math.round(Math.random()*5) + 1,
		reviews:[]
	}
	for(var i=0;i&lt;Math.round(Math.random()*10) + 1;i++) {
		var item = {
			id:i,
			posted:&quot;July 14, 2015 at 2:32 PM&quot;,
			rating:Math.round(Math.random()*5) + 1,
			text:&quot;This sauce was rather spicy with a nice aftertaste...&quot;,
			user:{
				img:&quot;http://placekitten.com/g/40/40&quot;,
				name:&quot;Joe Blow&quot;
			}
		}
		sauce.reviews.push(item);
	}
	deferred.resolve(sauce);
	return deferred.promise;
}</code></pre>

So there ya go. It isn't pretty - but it is coming together. Tomorrow I'm going to switch to the server side and start setting up both my Cloudant database and the Node.js application.
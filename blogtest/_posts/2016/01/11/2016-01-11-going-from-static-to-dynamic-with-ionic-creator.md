---
layout: post
title: "Going from static to dynamic with Ionic Creator"
date: "2016-01-11T14:28:32+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2016/01/11/going-from-static-to-dynamic-with-ionic-creator
guid: 7286
---

As I've mentioned more than once now, I'm <i>really</i> happy with how much <a href="http://creator.ionic.io">Ionic Creator</a> has improved recently. For this blog post, I thought it might be useful to demonstrate how you could go from a "static" Ionic Creator proof of concept to a dynamic one that made use of a real API. For hard core developers, this is probably not going to be very helpful. But I imagine Creator will attract folks who may not have a lot of experience working with JavaScript and APIs so I thought a concrete example would be helpful. As always, if anything doesn't make sense, leave me a comment and I'll try my best to help out.

<!--more-->

Let's begin by discussing the type of application we're going to build. It will be a simple "Master/Detail" example where the initial page is a list of items and the detail provides - well - detail. As a completely random "not related to anything recent" idea, let's use Star Wars films for our data. 

It just so happens that an API exists, <a href="https://swapi.co/">SWAPI</a>, that provides information about Star Wars films. In fact, I've already released a helper library for this API: <a href="https://github.com/cfjedimaster/SWAPI-Wrapper">SWAPI-Wrapper</a>. We won't be using that helper in this blog post, but just remember it if you decide to actually use this data in a real application.

<h2>Creating the Static Proof of Concept</h2>

We'll start off by creating a new application in Ionic Creator. Remember that this is 100% free to try. You only need to pay if you want additional projects. (You can find more detail on their <a href="http://ionic.io/products/creator/pricing">Pricing Page</a>). 

Begin by creating a new project, the name doesn't matter, and use the Blank template:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot1-3.png" alt="shot1" width="750" height="602" class="aligncenter size-full wp-image-7287" />

This will drop you into the editing interface with a blank page. On this page we'll do two things. First, we'll edit the title to give it something that makes sense for the app.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot2-4.png" alt="shot2" width="750" height="604" class="aligncenter size-full wp-image-7288 imgborder" />

Then we'll drag a List component onto the page:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot3-2.png" alt="shot3" width="750" height="604" class="aligncenter size-full wp-image-7289 imgborder" />

Notice how it adds 3 list items automatically. If you want, you can remove some, or add some, but for now, three is just fine. If you click each one, you can give them a unique text value. While not necessary, I'd go ahead and do that just so you mentally keep in mind what we're actually building.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot4-2.png" alt="shot4" width="750" height="603" class="aligncenter size-full wp-image-7290 imgborder" />

Notice that the list items have a "Link" attribute. We can use that to add basic interaction to our demo, but for now, we don't have a page to actually target for that link. Let's fix that by adding a new page. Be sure to use the Blank template again. I gave it a simple title too:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot5-1.png" alt="shot5" width="750" height="604" class="aligncenter size-full wp-image-7291 imgborder" />

This page represents the detail view of the film. Right now we don't necessarily know what we're going to show, so let's keep it simple and imagine we'll just show the opening crawl. On the off chance that my readers have never seen a Star Wars film (for shame), this is an example of what I mean:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/crawl.png" alt="crawl" width="750" height="319" class="aligncenter size-full wp-image-7292" />

For now, let's just use a bit of static text. Drag the Paragraph component onto the page and then edit the content to be something that describes the purpose of the text block.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot6.png" alt="shot6" width="750" height="604" class="aligncenter size-full wp-image-7294 imgborder" />

Now let's hook up the list from the first page to the detail. Now, in the real application, each list item would link to a page showing different text based on the selection. However, the dynamic aspect will be handled by code we add later on. If you were to demonstrate this dummy app to a client, you may need to make 3 distinct pages so they don't get confused. If you do, don't forget that you can select the page in the left hand nav and click the "Duplicate" icon.

For now, click back to the first page, and select the first list item. Note that you can now select a link that points to the new page.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot7.png" alt="shot7" width="750" height="605" class="aligncenter size-full wp-image-7295 imgborder" />

Go ahead and do that for all three list items (and again, you don't <i>really</i> need to) and then click the Preview icon on top to test out your beautiful, if fake, application.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot8.png" alt="shot8" width="750" height="604" class="aligncenter size-full wp-image-7296" />

Woot! We're done with the prototype!

<h2>Creating the Application - Part 1</h2>

Ok, so at this point, we've got a working prototype. The first thing we need to do is get a copy of the code. You can use the Export menu option to open a window showing you four different ways of working with the code. I recommend using the Zip File. While we can create a new application from the code of the prototype directly with the CLI, I think it would be nice to have a copy of the prototype locally to compare and contrast while working on the new version.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot9.png" alt="shot9" width="750" height="603" class="aligncenter size-full wp-image-7297" />

I recommend creating a new folder for this project, and then extracting the zip into a folder. (All of my code for this blog entry is in GitHub, and that's the way I laid out stuff there as well.) Assuming you've done this in a folder called <code>creator_version</code>, we can use the Ionic CLI to create a new application based on the contents. That command is:

<code>ionic start v1 ./creator_version</code>

The "v1" part there is the name of the subdirectory. As you can guess, we're going to iterate a bit from the original Creator version to our final version. Why? 

We currently have a static version of the application. It doesn't use any "real" data. Our first iteration is going to make the application dynamic, but it is going to use fake, static data. 

Ok, that probably sounds confusing. Let me explain again.

Right now, our list of films is a hard coded list of 3 films. 

We're going to create a "Service" in our application responsible for returning the list of films. Our plan is to use SWAPI remote service, but to keep it simple for now we'll build a service that returns 3 'fake' films. We'll then edit the first page to render those films as if they had come from some remote service. Essentially we will go from static to "Dynamic with Fake Data". After we have this running well, we'll then use the "real" service. (This part of the process is very important. So if it doesn't make sense, let me know in the comments.)

Ok, so go into the v1 folder and open it with your favorite editor. We need to modify three things to make the initial page dynamic. Let's start with the template. Right now it is hard coded for three films:

<pre><code class="language-markup">
&lt;ion-view title=&quot;Star Wars Films&quot;&gt;
    &lt;ion-content overflow-scroll=&quot;true&quot; padding=&quot;true&quot; class=&quot;has-header&quot;&gt;
        &lt;ion-list&gt;
            &lt;ion-item href=&quot;#/page4&quot;&gt;A New Hope&lt;/ion-item&gt;
            &lt;ion-item href=&quot;#/page4&quot;&gt;The Empire Strikes Back&lt;/ion-item&gt;
            &lt;ion-item href=&quot;#/page4&quot;&gt;Return of the Jedi&lt;/ion-item&gt;
        &lt;/ion-list&gt;
    &lt;/ion-content&gt;
&lt;/ion-view&gt;
</code></pre>

We'll begin by removing two of the ion-items and making the third dynamic.

<pre><code class="language-markup">
&lt;ion-view title=&quot;Star Wars Films&quot;&gt;
    &lt;ion-content overflow-scroll=&quot;true&quot; padding=&quot;true&quot; class=&quot;has-header&quot;&gt;
        &lt;ion-list&gt;
			&lt;ion-item ng-repeat=&quot;film in films&quot; ui-sref=&quot;filmTitle({% raw %}{id:film.id}{% endraw %})&quot;&gt;{% raw %}{{film.title}}{% endraw %}&lt;/ion-item&gt;
        &lt;/ion-list&gt;
    &lt;/ion-content&gt;
&lt;/ion-view&gt;
</code></pre>

There's two important things here. First, we are repeating "film" over "films". We don't have that data yet, but I know when I build it I'll have it return an array of films. I also guess that I'll have a title value and an ID that uniquely identifies it. (This is actually going to be a mistake, but that's ok, it's a good mistake!)

Now let's look at the controller. By default Creator made a blank one for us called starWarsFilmCtrl. We need to edit this to work with data.

<pre><code class="language-javascript">
.controller('starWarsFilmsCtrl', function($scope,FilmService) {
	$scope.films = [];
	
	FilmService.getFilms().then(function(res) {
		$scope.films = res;		
	});
	
})
</code></pre>

Ok, so what in the heck is FilmService? We haven't written it yet! Basically we're setting up the controller to work with a service we'll write later that's going to return our array of data. Note we use $scope.films to set the initial, empty array. We can then call the service and set the result. 

Let's go ahead and update the other view first. The detail page begins like so:

<pre><code class="language-markup">
&lt;ion-view title=&quot;Film Title&quot;&gt;
    &lt;ion-content overflow-scroll=&quot;true&quot; padding=&quot;true&quot; class=&quot;has-header&quot;&gt;
        &lt;div&gt;
            &lt;p&gt;The opening crawl would go here.&lt;/p&gt;
        &lt;/div&gt;
    &lt;/ion-content&gt;
&lt;/ion-view&gt;
</code></pre>

We need to make the title and text dynamic. Here is the updated version:

<pre><code class="language-markup">
&lt;ion-view&gt;
	&lt;ion-nav-title&gt;{% raw %}{{film.title}}{% endraw %}&lt;/ion-nav-title&gt;
    &lt;ion-content overflow-scroll=&quot;true&quot; padding=&quot;true&quot; class=&quot;has-header&quot;&gt;
        &lt;div&gt;
            &lt;p&gt;{% raw %}{{film.crawl}}{% endraw %}&lt;/p&gt;
        &lt;/div&gt;
    &lt;/ion-content&gt;
&lt;/ion-view&gt;
</code></pre>

Why did we switch to ion-nav-title? See <a href="http://www.raymondcamden.com/2015/12/18/is-your-ionic-view-title-not-updating">this blog post</a> for an explanation. Basically we need to use that directive to handle dynamic titles.

Ok, so now let's go and update the controller. 

<pre><code class="language-javascript">
.controller('filmTitleCtrl', function($scope,$stateParams,FilmService) {
	$scope.film = {};
	
	FilmService.getFilm($stateParams.id).then(function(res) {
		$scope.film = res;	
	});
	
})
</code></pre>

As before, we're using a FilmService that doesn't exist yet. I'm calling the service in a way that makes sense to me (first GetFilms then GetFilm). The $stateParams part relates back to how we handle navigation. In the first view, make note of the ui-sref part. This handles changing to a new state and passing a unique id. In order to make that work, we need to do a small change to the routes.js file. Right now it has this hard coded route:

<pre><code class="language-javascript">
    .state('filmTitle', {
      url: '/page4',
      templateUrl: 'templates/filmTitle.html',
      controller: 'filmTitleCtrl'
    })
</code></pre>

In order to handle recognizing an ID, we modify it to this:

<pre><code class="language-javascript">
    .state('filmTitle', {
      url: '/page4/:id',
      templateUrl: 'templates/filmTitle.html',
      controller: 'filmTitleCtrl'
    })
</code></pre>

Alright - so now for the final part, we build the service. We're going to write it to "agree with" what the controller was expecting. Here's the complete code:

<pre><code class="language-javascript">
angular.module('app.services', [])

.factory('FilmService', ['$q',function($q){

	return {
		getFilms:function() {
			var deferred = $q.defer();
			
			//temp 
			var films = [
				{
					id:1,
					title:"A New Hope",
					crawl:"ANH crawl"
				},
				{
					id:2,
					title:"The Empire Strikes Back",
					crawl:"ESB crawl"
				},
				{
					id:3,
					title:"Return of the Jedi",
					crawl:"ROTJ crawl"
				}
			];
				
			deferred.resolve(films);
			return deferred.promise;
		},
		getFilm:function(id) {
			var deferred = $q.defer();
			
			//temp
			var film = {
				id:id,
				title:"Film "+id,
				crawl:"Crawl for "+id
			};

			deferred.resolve(film);
			return deferred.promise;
			
			
			
		}	
	};

}]);
</code></pre>

So let's quickly review what we did here. We updated the completely static application to be <i>partially</i> dynamic. Both the initial page (the list) and the detail are now dynamic. The controller speaks to the service to ask for data, returns it and makes it available to the templates. The data itself may be static, but every other aspect of the application is now dynamic! Woot.

At this point, I recommend taking the app for test drive just to ensure it is working correctly. Here is it running with <code>ionic serve -l</code>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot10.png" alt="shot10" width="750" height="606" class="aligncenter size-full wp-image-7298 imgborder" />

If you want, edit the services file to add a new film. When you reload, you'll see the new item show up.

<h2>Creating the Application - Part 2</h2>

Alright - so in theory now the only thing we need to is update the services file to use SWAPI. In theory. As I kind of alluded to before, we're going to run into a small issue but that's ok - we're professionals and we can handle it. Using SWAPI is pretty easy (and you can read the <a href="https://swapi.co/documentation">docs</a> for a full explanation), so let's begin by making the call to get films use real data.

Here is the updated version:

<pre><code class="language-javascript">
getFilms:function() {
	var deferred = $q.defer();
			
	$http.get("http://swapi.co/api/films").then(function(res) {
		//console.dir(res.data.results);
		deferred.resolve(res.data.results);
	});
	return deferred.promise;
},
</code></pre>

Yeah, that's it. Literally just a call to a URL. As a quick note, we modified the services injected into the file:

<pre><code class="language-javascript">
.factory('FilmService', ['$http','$q',function($http,$q){
</code></pre>

So in theory, as soon as you test this, it works. You should see a complete list of films:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot11-1.png" alt="shot11" width="696" height="493" class="aligncenter size-full wp-image-7300 imgborder" />

However, clicking to the detail won't work. Why? The SWAPI doesn't actually return an "id" value. Notice the console.dir on the results in the code snippet above? It's currently commented out, but if you remove the comments, you can see the data yourself. This is also fully documented as well.

So what do we do? We need a "unique" way to identify the film so we can fetch the details. Turns out there is a <code>url</code> property on the film. That points to the film's detail on the API. We have two options here. We can actually modify the data in the service file so that id <i>does</i> exist and uses the URL. Or we can simply modify the template to use the new property. I prefer to keep the template as is and modify the service. Basically my code gets to pretend that SWAPI returned the data as I expected:

<pre><code class="language-javascript">
$http.get("http://swapi.co/api/films").then(function(res) {
	//console.dir(res.data.results);
	var results = res.data.results.map(function(result) {
		result.id = result.url;
		return result;
	});
	deferred.resolve(results);
});
</code></pre>

The last modification is to get film details. We're passing in the URL value so the code here is rather simple:

<pre><code class="language-javascript">
getFilm:function(url) {
	var deferred = $q.defer();
			
	$http.get(url).then(function(res) {
		//console.dir(res.data);
		deferred.resolve(res.data);
	});

	return deferred.promise;
			
}	
</code></pre>

And the result:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot12-1.png" alt="shot12" width="696" height="624" class="aligncenter size-full wp-image-7301 imgborder" />

<h2>Wrap Up</h2>

Obviously every application will be different and our API was especially simple, but I hope this demonstration was useful. If you want to look at the code, you can find it here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/statictodynamic">https://github.com/cfjedimaster/Cordova-Examples/tree/master/statictodynamic</a>. As I said, please let me know if anything didn't make sense.

You've read the post, now watch the video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/R9UwlFu56Wo" frameborder="0" allowfullscreen></iframe>
Ok, while not necessarily required reading, here are a few quick notes:

<ul>
<li>Sharp readers may notice that the initial getFilms call actually returns <strong>all</strong> the data. We could make the application better if we stored that data in the service. Calls to getFilm would just return the appropriate portion of the stored data. What's cool is we can make this modification in the service and nothing else needs to change. This is basic MVC architecture stuff, but again, for folks who may be new to development, this is <i>exactly</i> the reason we use setups like this. It allows for optimizations later that are confined to one file and don't break other parts.
<li>Since our application is performing HTTP requests, we really should provide feedback to the user. I'd suggest the Ionic Loading widget. I talked about that here: <a href="http://www.raymondcamden.com/2015/12/17/a-quick-example-of-the-ionic-loading-widget">A quick example of the Ionic Loading Widget</a>
</ul>
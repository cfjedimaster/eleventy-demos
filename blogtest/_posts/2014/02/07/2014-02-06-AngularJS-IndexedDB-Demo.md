---
layout: post
title: "AngularJS IndexedDB Demo"
date: "2014-02-07T11:02:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/02/07/AngularJS-IndexedDB-Demo
guid: 5147
---

<p>
Over the past few months I've had a series of articles (<a href="http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb/">Part 1</a>, <a href="http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb-part-2/">Part 2</a>, <a href="http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb-part-3/">Part 3</a>) discussing IndexedDB. In the last article I built a full, if rather simple, application that let you write notes. (I'm a sucker for note taking applications.) When I built the application, I intentionally did <strong>not</strong> use a framework. I tried to write nice, clear code of course, but I wanted to avoid anything that wasn't 100% necessary to demonstrate the application and IndexedDB. In the perspective of an article, I think this was the right decision to make. I wanted my readers to focus on the feature and not anything else. But I thought this would be an excellent opportunity to try AngularJS again.
</p>
<!--more-->
<p>
For the most part, this conversion worked perfectly. This may sound lame, but I found myself grinning as I built this application. I'm a firm believer that if something makes you happy then it is probably good for you. ;) 
</p>

<p>
I still find myself a bit... not confused... but slowed down by the module system and dependency injection. These are both things I grasp in general, but in AngularJS they feel a bit awkward to me. It feels like something I'll never be able to code from memory, but will need to reference older applications to remind me. I'm not saying they are wrong of course, they just don't feel natural to me yet. 
</p>

<p>
On the flip side, the binding support is incredible. I love working with HTML templates and $scope. It feels <i>incredibly</i> powerful. Heck, being able to add an input field and use it as a filter in approximately 30 seconds was mind blowing. 
</p>

<p>
One issue I ran into and I'm not convinced I created the best solution for was the async nature of IndexedDB's database open logic. AngularJS has a promises library built in and it works incredibly well for my application in general. But I needed the <strong>entire</strong> application to be bootstrapped to an async call for database startup. I got around that with two things that felt a bit like a hack.
</p>

<p>
First, my home view (get all notes) ran a call to an init function to ensure the db was already open. So consider this init():
</p>

<pre><code class="language-javascript">function init() {
		var deferred = $q.defer();

		if(setUp) {
			deferred.resolve(true);
			return deferred.promise;
		}
		
		var openRequest = window.indexedDB.open("indexeddb_angular",1);
	
		openRequest.onerror = function(e) {
			console.log("Error opening db");
			console.dir(e);
			deferred.reject(e.toString());
		};

		openRequest.onupgradeneeded = function(e) {
	
			var thisDb = e.target.result;
			var objectStore;
			
			//Create Note OS
			if(!thisDb.objectStoreNames.contains("note")) {
				objectStore = thisDb.createObjectStore("note", {% raw %}{ keyPath: "id", autoIncrement:true }{% endraw %});
				objectStore.createIndex("titlelc", "titlelc", {% raw %}{ unique: false }{% endraw %});
				objectStore.createIndex("tags","tags", {% raw %}{unique:false,multiEntry:true}{% endraw %});
			}
	
		};

		openRequest.onsuccess = function(e) {
			db = e.target.result;
			
			db.onerror = function(event) {
				// Generic error handler for all errors targeted at this database's
				// requests!
				deferred.reject("Database error: " + event.target.errorCode);
			};
	
			setUp=true;
			deferred.resolve(true);
		
		};	

		return deferred.promise;
	}

</code></pre>

<p>
This logic is similar to what I had in the non-framework app but I've made use of promises and a flag to remember when I've already opened the database. This lets me then tie to init() in my getNotes logic.
</p>

<pre><code class="language-javascript">	function getNotes() {
		var deferred = $q.defer();
		
		init().then(function() {

			var result = [];

			var handleResult = function(event) {  
				var cursor = event.target.result;
				if (cursor) {
					result.push({% raw %}{key:cursor.key, title:cursor.value.title, updated:cursor.value.updated}{% endraw %});
					cursor.continue();
				}
			};  
			
			var transaction = db.transaction(["note"], "readonly");  
			var objectStore = transaction.objectStore("note");
            objectStore.openCursor().onsuccess = handleResult;

			transaction.oncomplete = function(event) {
				deferred.resolve(result);
			};
		
		});
		return deferred.promise;
	}
</code></pre>

<p>
All of this worked ok - but I ran into an issue on the other pages of my application. If for example you bookmarked the edit link for a note, you would run into an error. I could have applied the same fix in my service layer (run init first), but it just felt wrong. So instead I did this in my app.js:
</p>

<pre><code class="language-javascript">$rootScope.$on("$routeChangeStart", function(event,currentRoute, previousRoute){
		if(!persistanceService.ready() && $location.path() != '/home') {
			$location.path('/home');
		};

	});
</code></pre>

<p>
The ready call was simply a wrapper to the flag variable. So yeah, this worked for me, but I still think there is (probably) a nicer solution. Anyway, if you want to check it out, just hit the Demo link below. I want to give a shoutout to Sharon DiOrio for giving me a lot of help/tips/support while I built this app.
</p>

<p>
<a href="https://static.raymondcamden.com/demos/2014/feb/7/index.html#/home"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>  
</p>

<p>
p.s. I assume this is obvious, but I'm not really offering this up as a "Best Practices" AngularJS application. I assume I could have done about every part better. ;)
</p>
---
layout: post
title: "Working with MP3s, ID3, and PhoneGap/Cordova (3)"
date: "2015-05-01T14:40:53+06:00"
categories: [development,mobile]
tags: [cordova,ionic,phonegap]
banner_image: 
permalink: /2015/05/01/working-with-mp3s-id3-and-phonegapcordova-3
guid: 6102
---

This week I've done a few blog posts (<a href="http://www.raymondcamden.com/2015/04/29/working-with-mp3s-id3-and-phonegapcordova">part one</a> and <a href="http://www.raymondcamden.com/2015/04/30/working-with-mp3s-id3-and-phonegapcordova-2">part two</a>) about MP3 and ID3 parsing in PhoneGap/Cordova applications. Today I'm updating the application again - this time to support album art. Let's look at the results in the simulator first and then I'll walk you through the code.

<!--more-->

First - I updated my sample music a bit. My 5 year old <i>loves</i> the Daisy Chainsaw track:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/Screen-Shot-2015-05-01-at-2.25.27-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/Screen-Shot-2015-05-01-at-2.25.27-PM.png" alt="Screen Shot 2015-05-01 at 2.25.27 PM" width="527" height="850" class="alignnone size-full wp-image-6103" /></a>

And here is the detail view - now with album art:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/Screen-Shot-2015-05-01-at-2.26.14-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/Screen-Shot-2015-05-01-at-2.26.14-PM.png" alt="Screen Shot 2015-05-01 at 2.26.14 PM" width="527" height="850" class="alignnone size-full wp-image-6104" /></a>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/Screen-Shot-2015-05-01-at-2.26.24-PM1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/Screen-Shot-2015-05-01-at-2.26.24-PM1.png" alt="Screen Shot 2015-05-01 at 2.26.24 PM" width="527" height="850" class="alignnone size-full wp-image-6107" /></a>

Ok, so how did I do this? While ID3 data can actually include album art (see the <a href="https://github.com/aadsm/JavaScript-ID3-Reader">docs</a> for the JavaScript library I use), it didn't seem like any of my files actually had this data. I made the call that - probably - most files do not. I don't have any scientific data to back this up, but I decided to make use of the <a href="http://www.last.fm">last.fm</a> API. The API was super easy to use. Like - "Wait, it worked on my first try?" easy. Given that you know an artist and an album, you can use the <a href="http://www.last.fm/api/show/album.getInfo">album.getInfo</a> call to fetch data about the album. This includes multiple different sized images.

Of course, the issue is that each of these API calls is asynchronous. Our MP3 service is already handling the ID3 lookup asynchronously. If you remember, I had to single thread it due to memory issues. But the API calls are jut http calls so running multiple in parallel shouldn't be a problem. 

<i>However...</i>

Given that you may have multiple MP3s from the same album, we can improve performance by not requesting the same album cover once we've made one initial request for it.

Ok... so let's take a look at the new services file.

<pre><code class="language-javascript">angular.module('starter.services', [])

.factory('MP3Service', function($q,$cordovaFile,$http) {
	
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
						console.dir(data[0]);
						items = data;
						// New logic - now we get album art
						var defs = [];
						//remember artist + album
						var albums = {};
						
						for(var i=0;i&lt;items.length;i++) {
							var album = items[i].tags.album;
							var artist = items[i].tags.artist;
							console.log(&quot;album=&quot;+album+&quot; artist=&quot;+artist);
							if(albums[album+&quot; &quot;+artist]) {
								console.log(&quot;get from album cache&quot;);
								var def =  $q.defer();
								def.resolve({% raw %}{cache:album+&quot; &quot;+artist}{% endraw %});
								defs.push(def.promise);
							} else {
								albums[album+&quot; &quot;+artist] = 1;
								defs.push($http.get(&quot;http://ws.audioscrobbler.com/2.0/?method=album.getinfo&amp;artist=&quot;+encodeURI(artist)+&quot;&amp;album=&quot;+encodeURI(album)+&quot;&amp;api_key=5poo53&amp;format=json&quot;));
							}
						}
						$q.all(defs).then(function(res) {
							console.log(&quot;in the q all&quot;);
							for(var i=0;i&lt;res.length;i++) {
								console.log(i, res[i]);
								//if we marked it as 'from cache', check cache
								if(res[i].cache) {
									console.log('setting from cache '+albums[res[i].cache])
									items[i].image = albums[res[i].cache];
								} else {
									var result = res[i].data;
									//potential match at result.album.image
									if(result.album &amp;&amp; result.album.image) {
										items[i].image = result.album.image[3][&quot;#text&quot;];
									} else {
										items[i].image = &quot;&quot;;
									}
									albums[items[i].tags.album+&quot; &quot;+items[i].tags.artist] = items[i].image;
								}
							}
							
							deferred.resolve(items);
						});
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

Normally I trim out the console.log messages as noise, but I kept them in due to the complexity of this service. The important bits begin in the <code>process(0, function(data))</code> callback. The general idea is this:

<ol>
<li>Loop over all the MP3s.
<li>Get the album and artist. (This needs to be improved to see if the tags exist.)
<li>Check the albums object to see if we have already fetched it. <strong>Note</strong> - at this moment, the cache object is just a flag. The initial request isn't actually done yet. But we want to know that we've already done a request for that album.
<li>If we aren't, hit last.fm. Note that the API key should be stripped out and put into a constants block. I've temporarily changed the key above to a non-legit value.
<li>We've created an array of deferred objects. These represent the async operations (and yes, some aren't async, which is ok, we can still use deferreds for them). I can then use $q.all to say, "Do this crap when ALL of them are done."
<li>In that handler, I see if I've marked this as an item that should use the cache. In theory, this will never be run before an item that used the cache, so I check the albums object, which now has a real value in it, and use that.
<li>If this isn't a "use the cache item", I fetch out the image from the result data from last.fm and store the cache.
</ol>

And that's it. I then just updated the view to make use of the image. I've updated the GitHub repo with this version: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/mp3reader">https://github.com/cfjedimaster/Cordova-Examples/tree/master/mp3reader</a>
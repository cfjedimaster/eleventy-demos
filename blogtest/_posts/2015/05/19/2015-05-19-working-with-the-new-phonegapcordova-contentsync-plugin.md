---
layout: post
title: "Working with the new PhoneGap/Cordova ContentSync Plugin"
date: "2015-05-19T11:38:11+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/05/19/working-with-the-new-phonegapcordova-contentsync-plugin
guid: 6160
---

Yesterday at PhoneGap Day EU (sooooo sorry I'm missing it!), someone (I forget who) announced two new plugins for PhoneGap development - <a href="https://github.com/phonegap/phonegap-plugin-push">Push</a> and <a href="https://github.com/phonegap/phonegap-plugin-contentsync">ContentSync</a>. Push is what you would expect - a way to deal with push messages easier. ContentSync is another beast altogether. The plugin makes it easier to update your application after it has been released. The API gives you a simple way to say, "Hey, I want to fetch this zip of crap and use it." It handles performing the network request to a zip, downloading it, providing various progress events, unzipping it, and then telling you where it stored stuff. All in all a kick ass plugin, but I had some difficultly understanding it so I worked on a few demos to wrap my mind around it. Before we get started though, let me clarify some things that were confusing to me. (And yes, I've filed some bug reports on where I got confused for possible documentation updates.)

<!--more-->

<ul>
<li>The first example shows this: <code>var sync = ContentSync.sync({% raw %}{ src: 'http://myserver/assets/movie-1', id: 'movie-1' }{% endraw %});</code> What you may not realize is that URL you point to <strong>must be a zip file</strong>. So obviously a zip file need not end in .zip, but it wasn't clear at first that this was a requirement. 
<li>The plugin <i>will</i> unzip the file for you. Again, this is probably obvious, but it wasn't to me. The <code>id</code> value provided in the example above actually ends up being a subdirectory for where your assets will be stored.
<li>The docs say that when the sync is complete, you will be given a path that is "guaranteed to be a compatible reference in the browser." What you're really given (at least in my testing in iOS) is a complete path to a directory. So if your zip had 2 files, a.jpg and b.jpg, to you could get the full path to a.jpg by appending it to the value. <strong>But this is not a 'browser compatible' reference imo.</strong> Rather you need to change it to a file URI if you wish to use it with the DOM. (To be clear, I could be wrong about this, but that's how it seemed to work for me.) 
<li>By default, the plugin will always sync if you tell it too. You can pass an option to specify that it should only cache if a local copy doesn't exist, but for more complex logic like, "sync if the remote source is newer", then you need to build that logic yourself. That seems totally fair, just want to make it clear.
</ul>

Ok, so how about an example? I decided to build a sample that would fetch a zip of kitten images. Here is where I made my first mistake. I took my folder in OSX, right clicked, and selected compress. This created a zip of one item (actually two, one was a system file) where the one item was the folder. That was not what I intended. What I should have done is select all the images, right clicked, and created a zip from that. I then put up the zip on my S3 bucket at https://static.raymondcamden.com/kittens.zip. For my first example, all I wanted to do was sync the zip and display them in the DOM. Here is the JavaScript code for this version:

<pre><code class="language-javascript">//where to put our crap
var imageDiv;
//zip asset
var imageZip = &quot;https://static.raymondcamden.com/kittens.zip&quot;;

document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	startSync();
}

function startSync() {
	imageDiv = document.querySelector(&quot;#images&quot;);
	
	var sync = ContentSync.sync({% raw %}{ src: imageZip, id: 'kittenZip' }{% endraw %});
	
	sync.on('progress', function(data) {
		imageDiv.innerHTML = &quot;&lt;p&gt;Syncing images: &quot;+data.progress + &quot;%&lt;/p&gt;&quot;;
	});
	
	sync.on('complete', function(data) {
		console.log(data.localPath);
		var s = &quot;&lt;p&gt;&quot;;
		for(x=1;x&lt;=7;x++) {
			var imageUrl = &quot;file://&quot; + data.localPath + &quot;/kitten&quot;+x+&quot;.jpg&quot;;
			s += &quot;&lt;img src='&quot;+imageUrl+&quot;'&gt;&lt;br/&gt;&quot;;
		}
		imageDiv.innerHTML = s;
		
	});
	
	sync.on('error', function(e) {
		console.log('Error: ', e.message);
	    // e.message
	});
	
	sync.on('cancel', function() {
	    // triggered if event is cancelled
	});	
}</code></pre>

So for the most part, I assume this is self-explanatory. My zip file had seven images named kitten1.jpg to kitten7.jpg. Since I knew exactly what they were, all I needed to do was iterate and create img tags for each. This worked perfectly. I really don't need to share a screen shot of this. You already know it's seven pictures of cats. But you know me. I've <i>got</i> to share cat pictures.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-19-2015-11.26.20-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-19-2015-11.26.20-AM.png" alt="iOS Simulator Screen Shot May 19, 2015, 11.26.20 AM" width="422" height="750" class="aligncenter size-full wp-image-6161 imgborder" /></a>

Pretty darn easy, right? In case your curious about handling a zip of <i>unknown</i> images, you could use FileSystem APIs to iterate over the entries:

<pre><code class="language-javascript">	window.requestFileSystem(PERSISTENT, 1024 * 1024, function(fs) {
				
	window.resolveLocalFileSystemURL("file://" + data.localPath, function(g) {
		//ok so G is a directory ob
		var dirReader = g.createReader();
		dirReader.readEntries (function(results) {
			console.log('readEntries');
			console.dir(results);
		});
		
	}, function(e) {
		console.log("bad");
		console.dir(e);
	})
				
				
});</code></pre>

Ok, so what if you only wanted to sync once? That is incredibly difficult unfortunately. You have to change

<pre><code class="language-javascript">var sync = ContentSync.sync({% raw %}{ src: imageZip, id: 'kittenZip'}{% endraw %});</code></pre>

to

<pre><code class="language-javascript">var sync = ContentSync.sync({ 
    src: imageZip, 
    id: 'kittenZip', 
    type:'local'
});</code></pre>

Yeah, that's it. Nice, eh? Now I'm not sure how often you'll have a sync strategy that simple, but it's great that the plugin makes it that simple. But what about a more real world example? Consider the code block below:

<pre><code class="language-javascript">//where to put our crap
var $imageDiv;
//zip asset
var imageZip = &quot;https://static.raymondcamden.com/kittens.zip&quot;;

document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	//determine the lastmod for the res

	$imageDiv = $(&quot;#images&quot;);

	$.ajax({
		url:imageZip,
		method:&quot;HEAD&quot;
	}).done(function(res,text,jqXHR) {
		var lastMod = jqXHR.getResponseHeader('Last-Modified');
		console.log(lastMod);
		if(!localStorage.kittenLastMod || localStorage.kittenLastMod != lastMod) {
			console.log('need to sync')
			startSync();
			localStorage.kittenLastMod = lastMod;
		} else {
			console.log('NO need to sync');
			displayImages();
		}
	});
	
}

function displayImages() {
	var s = &quot;&lt;p&gt;&quot;;
	for(x=1;x&lt;=7;x++) {
		var imageUrl = &quot;file://&quot; + localStorage.kittenLocalPath + &quot;/kitten&quot;+x+&quot;.jpg&quot;;
		s += &quot;&lt;img src='&quot;+imageUrl+&quot;'&gt;&lt;br/&gt;&quot;;
	}
	$imageDiv.html(s);
}

function startSync() {
	
	var sync = ContentSync.sync({% raw %}{ src: imageZip, id: 'kittenZip' }{% endraw %});
	
	sync.on('progress', function(data) {
		$imageDiv.html(&quot;&lt;p&gt;Syncing images: &quot;+data.progress + &quot;%&lt;/p&gt;&quot;);
	});
	
	sync.on('complete', function(data) {
		//store localPath 
		localStorage.kittenLocalPath = data.localPath;
		displayImages();
	});
	
	sync.on('error', function(e) {
		console.log('Error: ', e.message);
	    // e.message
	});
	
	sync.on('cancel', function() {
	    // triggered if event is cancelled
	});	
}</code></pre>

In this one I'm using localStorage to remember both the last modified value for the zip as well as I where I stored the assets. I perform a HEAD operation against the zip just to get the last modified value and if it is different from my last request (or doesn't exist), then I do a full sync. Once done we just run a simple function to iterate over the items in the local copy. Since I store the path I'll have access to it when sync operations can be skipped. 

You can find all three examples over on my GitHub repo: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/contentsyncexamples">https://github.com/cfjedimaster/Cordova-Examples/tree/master/contentsyncexamples</a>. Also note that the plugin does even more than I touched on today so be sure to <a href="https://github.com/phonegap/phonegap-plugin-contentsync">read the docs</a> to see more.
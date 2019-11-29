---
layout: post
title: "Cordova and Asset Downloads"
date: "2014-11-07T16:11:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/11/07/Cordova-and-Asset-Downloads
guid: 5345
---

<p>
A few weeks ago (before I thought it would be a good idea to fly to China for a few weeks and dramatically increase the size of my family), I blogged about how a Cordova application could handle downloading binary assets after release. (You can find the discussion here: <a href="http://www.raymondcamden.com/2014/10/7/Cordova-and-Large-Asset-Downloads--An-Abstract">Cordova and Large Asset Downloads - An Abstract</a>.) I finally got around to completing the demo.
</p>
<!--more-->
<p>
Before I go any further, keep in mind that this demo was built to illustrate an example of the concept. It isn't necessarily meant to be something you can download and use as is. Consider it a sample to get you inspired. Here is how the application works.
</p>

<p>
First off, we don't do anything "special" until we need to, so the home page is just regular HTML. I'm using <a href="http://www.jquerymobile.com">jQuery Mobile</a> for this example (don't tell <a href="http://www.ionicframework.com">Ionic</a> I strayed). 
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen Shot Nov 7, 2014, 3.14.04 PM.png" class="bthumb"/>
</p>

<p>
Clicking the Assets button is what begins the thing we want to demonstrate. When this page loads, we need to do a few things. First, we check the file system to see if we have any downloaded assets. If we do, we display them in a list. If not, we tell the user. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen Shot Nov 7, 2014, 3.17.17 PM.png" class="bthumb" />
</p>

<p>
At the same time, we do a "once-per-app" hit to a server where new assets may exist. In my case I just added a JSON file to my local Apache server. This JSON file returned an array of URLs that represent new assets. For each we compare against the list of files we have (and on our first run we will have none), and if we don't have it, we use the FileTransfer plugin to download it. 
</p>

<p>
The next time the user views that particular page, they will see a list of assets. In my demo they are listed by file name which may not be the best UX. You could return metadata about your assets from the server to include things like a nicer name.
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen Shot Nov 7, 2014, 3.20.27 PM.png" class="bthumb" />
</p>

<p>
To wrap up my demo, I used jQuery Mobile's popup widget to provide a way to view the assets. (Note: I've got an odd bug where the <i>first</i> click returns an oddly placed popup. The next clicks work just fine. Not sure if that is a jQuery Mobile bug or something else. Since it isn't really relevant to the topic at hand, I'm going to drink a beer and just not give a you know what.)
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen Shot Nov 7, 2014, 3.22.32 PM.png" class="bthumb" />
</p>

<p>
Ok, so let's take a look at the code. 
</p>


<pre><code class="language-javascript">var globals = {};
globals.checkedServer = false;
globals.assetServer = &quot;http:&#x2F;&#x2F;192.168.1.67&#x2F;assets.json&quot;;
globals.assetSubDir = &quot;assets&quot;;

document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	
	$(document).on(&quot;pageshow&quot;, &quot;#downloadPage&quot;, function(e) {
	
		console.log(&quot;page show for downloads&quot;);
		
		&#x2F;&#x2F;get the current list of assets
		var assetReader = getAssets();
		assetReader.done(function(results) {
			console.log(&quot;promise done&quot;, results);
			if(results.length === 0) {
				$(&quot;#assetDiv&quot;).html(&quot;&lt;p&gt;Sorry, but no assets are currently available.&lt;&#x2F;p&gt;&quot;);	
			} else {
				var list = &quot;&lt;ul data-role=&#x27;listview&#x27; data-inset=&#x27;true&#x27; id=&#x27;assetList&#x27;&gt;&quot;;
				for(var i=0, len=results.length; i&lt;len; i++) {
					list += &quot;&lt;li data-url=&#x27;&quot;+results[i].toURL()+&quot;&#x27;&gt;&quot;+results[i].name+&quot;&lt;&#x2F;li&gt;&quot;;	
				}
				list += &quot;&lt;&#x2F;ul&gt;&quot;;
				console.log(list);
				$(&quot;#assetDiv&quot;).html(list);
				$(&quot;#assetList&quot;).listview();
				
			}
			
			if(!globals.checkedServer) {
				$.get(globals.assetServer).done(function(res) {
					&#x2F;*
					Each asset is a URL for an asset. We check the filename
					of each to see if it exists in our current list of assets					
					*&#x2F;
					console.log(&quot;server assets&quot;, res);
					for(var i=0, len=res.length; i&lt;len; i++) {
						var file = res[i].split(&quot;&#x2F;&quot;).pop();
						var haveIt = false;

						for(var k=0; k&lt;globals.assets.length; k++) {
							if(globals.assets[k].name === file) {
								console.log(&quot;we already have file &quot;+file);
								haveIt = true;
								break;
							}
						}
						
						if(!haveIt) fetch(res[i]);
						
					}
				});
			}
		});
		
		&#x2F;&#x2F;click handler for list items
		$(document).on(&quot;touchend&quot;, &quot;#assetList li&quot;, function() {
			var loc = $(this).data(&quot;url&quot;);
			console.dir(loc);
			$(&quot;#assetImage&quot;).attr(&quot;src&quot;, loc);
			$(&quot;#popupImage&quot;).popup(&quot;open&quot;);
		});
		
	});
	
}

function fsError(e) {
	&#x2F;&#x2F;Something went wrong with the file system. Keep it simple for the end user.
	console.log(&quot;FS Error&quot;, e);
	navigator.notification.alert(&quot;Sorry, an error was thrown.&quot;, null,&quot;Error&quot;);
}

&#x2F;*
I will access the device file system to see what assets we have already. I also take care of, 
once per operation, hitting the server to see if we have new assets.
*&#x2F;
function getAssets() {
	var def = $.Deferred();

	if(globals.assets) {
		console.log(&quot;returning cached assets&quot;);
		def.resolve(globals.assets);
		return def.promise();
	}
	
	var dirEntry = window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		&#x2F;&#x2F;now we have the data dir, get our asset dir
		console.log(&quot;got main dir&quot;,dir);
		dir.getDirectory(globals.assetSubDir+&quot;&#x2F;&quot;, {% raw %}{create:true}{% endraw %}, function(aDir) {
			console.log(&quot;ok, got assets&quot;, aDir);	
			
			var reader = aDir.createReader();
			reader.readEntries(function(results) {
				console.log(&quot;in read entries result&quot;, results);
				globals.assets = results;
				def.resolve(results);
			});
			
			&#x2F;&#x2F;we need access to this directory later, so copy it to globals
			globals.assetDirectory = aDir;
			
		}, fsError);
		
	}, fsError);
	
	return def.promise();
}

function fetch(url) {
	console.log(&quot;fetch url&quot;,url);
	var localFileName = url.split(&quot;&#x2F;&quot;).pop();
	var localFileURL = globals.assetDirectory.toURL() + localFileName;
	console.log(&quot;fetch to &quot;+localFileURL);
	
	var ft = new FileTransfer();
	ft.download(url, localFileURL, 
		function(entry) {
			console.log(&quot;I finished it&quot;);
			globals.assets.push(entry);
		},
		fsError); 
				
}</code></pre>

<p>
There is a lot going on here so I'll try to break it into somewhat manageable chunks.
</p>

<p>
The core code is in the pageshow event for the download page. (The page you see when you click the assets button. I had called it downloads at first.) This event is run every time the page is shown. I used this instead of pagebeforecreate since we can possibly get new assets after the page is first shown.
</p>

<p>
As mentioned above we do two things - check the file system and once per app run, hit the server. The file reader code is abstracted into a method called <code>getAssets</code>. You can see I use a promise there to handle the async nature of the file system. This also handles returning a cached version of the listing so we can skip doing file i/o on every display. 
</p>

<p>
The portion that handles hitting the server begins inside the condition that checks globals.checkedServer. (And yeah, using a variable like globals made me feel dirty. I'm not a JavaScript ninja and Google will never hire me. Doh!) For the most part this is simple - get the array and compare it to the list we got from the file system. When one is <i>not</i> found, we call a function, <code>fetch</code>, to handle downloading it.
</p>

<p>
The fetch method simply uses the FileTransfer plugin. It grabs the resource, stores it, and appends it to the list of assets. This is what is used for the page display. One issue with this setup is that we will <i>not</i> update the view automatically. You have to leave the page and come back. We <i>could</i> update the list, just remember that it is possible that the user left the page and went do other things in your app. I figured this was an implementation detail not terribly relevant so I kept it simple.
</p>

<p>
So that's it. Thoughts? You can find the complete source code for this here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/asyncdownload">https://github.com/cfjedimaster/Cordova-Examples/tree/master/asyncdownload</a>
</p>
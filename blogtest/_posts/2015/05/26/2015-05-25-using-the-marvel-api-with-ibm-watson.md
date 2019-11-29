---
layout: post
title: "Using the Marvel API with IBM Watson"
date: "2015-05-26T09:33:51+06:00"
categories: [development,javascript]
tags: [bluemix]
banner_image: 
permalink: /2015/05/26/using-the-marvel-api-with-ibm-watson
guid: 6211
---

A little over a year ago I blogged about my experience working with the <a href="http://developer.marvel.com/">Marvel API</a> (<a href="http://www.raymondcamden.com/2014/02/02/Examples-of-the-Marvel-API">Examples of the Marvel API</a>. It's been a while since I took a look at it and I thought it might be fun to combine the Marvel data with IBM Watson's <a href="http://ibmmobile.info/VisualRecognition">Visual Recognition service</a>. The Visual Recognition service takes an image as input and Watson's cognitive computing/computer vision intelligence to identify different items within it. 

<!--more-->

I reviewed this service back in February in context of a Cordova app (<a href="http://www.raymondcamden.com/2015/02/06/using-the-new-bluemix-visual-recognition-service-in-cordova">Using the new Bluemix Visual Recognition service in Cordova</a>). At that time, I wrote code that directly spoke to the API via code in my hybrid mobile application. For this though I wanted to make use of <a href="http://ibmmobile.info/Mobile-Catalog">Bluemix</a> and a hosted Node.js application. 

My setup would be simple - let the user search against the Marvel API and return matching comic books. Since I'm planning on scanning the covers, I'd just show them:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/Screen-Shot-2015-05-26-at-09.05.21.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/Screen-Shot-2015-05-26-at-09.05.21.png" alt="Screen Shot 2015-05-26 at 09.05.21" width="788" height="800" class="aligncenter size-full wp-image-6213 imgborder" /></a>

Selecting a comic will load it and then begin the call to Watson's Visual Recognition service. The service will use the cover as input and try to find things within it.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/Screen-Shot-2015-05-26-at-09.07.00.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/Screen-Shot-2015-05-26-at-09.07.00.png" alt="Screen Shot 2015-05-26 at 09.07.00" width="800" height="384" class="aligncenter size-full wp-image-6214" /></a>

Let's take a look at the code. You can download the entire thing at my GitHub repo: <a href="https://github.com/cfjedimaster/marvelcomicrecognition">https://github.com/cfjedimaster/marvelcomicrecognition</a>. First, the main app.js:

<pre><code class="language-javascript">/*jshint node:true*/


var express = require('express');

var bodyParser = require('body-parser');


var marvel = require('./marvel');
var imagerecog = require('./imagerecog');


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

/*
app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
*/
app.use(express.static(__dirname + '/public', {% raw %}{redirect: false}{% endraw %}));
 
app.use(bodyParser());
 
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
	// print a message when the server starts listening
  console.log(&quot;server starting on &quot; + appEnv.url);
});

app.post('/search', function(req, res) {
	
	var term = req.body.q;
	console.log('search for '+term);
	marvel.search(term,function(covers) {
		res.send(covers);
	});
	
});

app.post('/imagescan', function(req, res) {
	var url = req.body.url;
	console.log('scan for '+url);
	imagerecog.scan(url, function(result) {
		res.send(result);
	});
});</code></pre>

Of note here are the following lines:

<ul>
<li>I've split out my Marvel and Visual Cognition code in their own files to keep my app.js nice and slim.
<li><code>cfenv</code> is a helper library for Node.js apps on Bluemix to make it easier to use environment variables and oservices.
<li>You can see some code I commented out for Dust support. I ended up not using <i>any</i> template engine as my entire app was one HTML view and two Ajax calls.</li>
<li>And you can see those two Ajax calls at the end. Easy-peasy.
</ul>

Ok, let's look at the Marvel code. To be fair, this is pretty much the same as I built for my "random comic site" (see the first link) but modified to return all the results for a search.

<pre><code class="language-javascript">/* global require,exports, console */
var http = require('http');
var crypto = require('crypto');

var cache = [];

var IMAGE_NOT_AVAIL = &quot;http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available&quot;;

var cred = require('./credentials.json');
var PRIV_KEY = cred.marvel.privkey;
var API_KEY = cred.marvel.apikey;

function search(s,cb) {
	
	var url = &quot;http://gateway.marvel.com/v1/public/comics?limit=25&amp;format=comic&amp;formatType=comic&amp;title=&quot;+s+&quot;&amp;apikey=&quot;+API_KEY;
	var ts = new Date().getTime();
	var hash = crypto.createHash('md5').update(ts + PRIV_KEY + API_KEY).digest('hex');
	url += &quot;&amp;ts=&quot;+ts+&quot;&amp;hash=&quot;+hash;
	console.log(&quot;url &quot;+url);

	if(s in cache) {
		console.log(&quot;had a cache for &quot;+s);
		cb(cache[s]);
		return;
	}
	
	http.get(url, function(res) {
		var body = &quot;&quot;;

		res.on('data', function (chunk) {
			body += chunk;
		});
		
		res.on('end', function() {

			var result = JSON.parse(body);
			var images;
			
			if(result.code === 200) {
				images = [];
				console.log('num of comics '+result.data.results.length);
				for(var i=0;i&lt;result.data.results.length;i++) {
					var comic = result.data.results[i];
					//console.dir(comic);
					if(comic.thumbnail &amp;&amp; comic.thumbnail.path != IMAGE_NOT_AVAIL) {
						var image = {};
						image.title = comic.title;
						for(x=0; x&lt;comic.dates.length;x++) {
							if(comic.dates[x].type === 'onsaleDate') {
								image.date = new Date(comic.dates[x].date);
							}
						}
						image.url = comic.thumbnail.path + &quot;.&quot; + comic.thumbnail.extension;
						if(comic.urls.length) {
							for(var x=0; x&lt;comic.urls.length; x++) {
								if(comic.urls[x].type === &quot;detail&quot;) {
									image.link = comic.urls[x].url;
								}
							}
						}
						images.push(image);
					}
				}
				
				var data = {% raw %}{images:images,attribution:result.attributionHTML}{% endraw %};
				cache[s] = data;
				cb(data);
			} else if(result.code === &quot;RequestThrottled&quot;) {
				console.log(&quot;RequestThrottled Error&quot;);
				/*
				So don't just fail. If we have a good cache, just grab from there
				*/
				//fail for now 
				poop;
				/*
				if(Object.size(cache) &gt; 5) {
					var keys = [];
					for(var k in cache) keys.push(k);
					var randomCacheKey = keys[getRandomInt(0,keys.length-1)];
					images = cache[randomCacheKey].images;
					cache[randomCacheKey].hits++;
					cb(images[getRandomInt(0, images.length-1)]);		
				} else {
					cb({% raw %}{error:result.code}{% endraw %});
				}
				*/
			} else {
				console.log(new Date() + ' Error: '+JSON.stringify(result));
				cb({% raw %}{error:result.code}{% endraw %});
			}
			//console.log(data);
		});
	
	});

}

exports.search = search;</code></pre>

And yes - poop on line 74 is my lame reminder to add proper error handling later on. Honest, I'll get to it. Now let's look at the Visual Recognition stuff:

<pre><code class="language-javascript">var fs = require('fs');
var http = require('http');
var watson = require('watson-developer-cloud');

var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var imageRecogCred = appEnv.getService(&quot;visual_recognition&quot;);

if(!imageRecogCred) {
	var cred = require('./credentials.json');
	var visual_recognition = watson.visual_recognition({
		username: cred.vr.username,
		password: cred.vr.password,
		version: 'v1'
	});
} else {
	var visual_recognition = watson.visual_recognition({
		version: 'v1',
		use_vcap_services:true
	});
}

var cache = {};

function scan(url, cb) {

	//create a temp file name based on last 3 items from url: http://i.annihil.us/u/prod/marvel/i/mg/a/03/526ff00726962.jpg
	var parts = url.split(&quot;/&quot;);
	var tmpFilename = &quot;./temp/&quot; + parts[parts.length-3] + &quot;_&quot; + parts[parts.length-2] + &quot;_&quot; + parts[parts.length-1];

	if(tmpFilename in cache) {
		console.log('image scan from cache');
		cb(cache[tmpFilename]);
		return;
	}
	// download file then we can use fs.createReadableStream
	var file = fs.createWriteStream(tmpFilename);

	http.get(url, function(response) {
	    response.pipe(file);
	    file.on('finish', function() {
			file.close();
			var params = {
				image_file: fs.createReadStream(tmpFilename)
			};
	
			visual_recognition.recognize(params, function(err, result) {
				if (err) {
					console.log(&quot;visual recog error&quot;,err);
					cb({% raw %}{&quot;error&quot;:1}{% endraw %})
				} else {
					//console.log(JSON.stringify(result));
					var tags = [];
					for(var i=0; i&lt;result.images[0].labels.length; i++) {
						tags.push(result.images[0].labels[i]);
					}
					cache[tmpFilename] = tags;
					cb(tags);
				}
			});

	    });
	});
	
}


exports.scan = scan;</code></pre>

I made use of the <a href="https://www.npmjs.com/package/watson-developer-cloud">Watson Developer Cloud</a> npm package to speak to the service. For the most part this makes it easy, but right now it expects a physical file. (I mentioned this and the team behind it is already working on improving this.) So to make it work I had to download the file from the Marvel API and then send it up to Watson. I don't have "cleanup" code yet, but it gets the job done. As I said, once the Watson team adds  support to talk to a URL, nearly half of this code will go away.

For the final part, here is the JavaScript I use on the front end:

<pre><code class="language-javascript">var $searchField;
var $resultDiv;
var $modal;
var $coverImage;
var $recogStatus;
var $modalTitle;
var $searchBtn;

$(document).ready(function() {
	$searchField = $(&quot;#searchField&quot;);
	$resultDiv = $(&quot;#results&quot;);
	$modal = $(&quot;#coverModal&quot;);
	$coverImage = $(&quot;#coverImage&quot;);
	$recogStatus = $(&quot;#recogStatus&quot;);
	$modalTitle = $(&quot;.modal-title&quot;,$modal);
	$searchBtn = $(&quot;#searchBtn&quot;);
	
	$searchBtn.on(&quot;click&quot;, handleSearch);
	
	$(&quot;body&quot;).on(&quot;click&quot;,&quot;#results img&quot;,doCover);
});

function handleSearch(e) {
	e.preventDefault();
	var value = $.trim($searchField.val());
	if(value === '') return;
	$searchBtn.attr(&quot;disabled&quot;,&quot;disabled&quot;);
	console.log('ok, lets search for '+value);
	$resultDiv.html(&quot;&lt;i&gt;Searching...&lt;/i&gt;&quot;);
	$.post(&quot;/search&quot;, {% raw %}{q:value}{% endraw %}, function(res) {
		//result is an array of cover images
		var s = &quot;&quot;;
		if(res.images.length) {
			for(var x=0;x&lt;res.images.length;x++) {
				s += &quot;&lt;img src='&quot; + res.images[x].url + &quot;' title='&quot; + res.images[x].title + &quot;' class='img-thumbnail'&gt;&quot;;
			}
			s += &quot;&lt;p&gt;&lt;i&gt;&quot;+res.attribution+&quot;&lt;/i&gt;&lt;/p&gt;&quot;;
		} else {
			s = &quot;&lt;p&gt;Sorry, but there were no matches.&lt;/p&gt;&quot;;
		}
		$resultDiv.html(s);	
		$searchBtn.removeAttr(&quot;disabled&quot;);

	});
}

function doCover(e) {
	//default loading msg
	var loadingMsg = &quot;&lt;i&gt;I'm now sending this image to the Bluemix Image scanner. Millions of little baby kittens are running on little treadmills to power the machine behind this scan. I hope you appreciate it!&lt;/i&gt;&quot;;
	var title = $(this).attr(&quot;title&quot;);
	var src = $(this).attr(&quot;src&quot;);
	
	$modalTitle.text(title);
	$coverImage.attr(&quot;src&quot;,src);
	$recogStatus.html(loadingMsg);
	$modal.modal('show');
	
	$.post(&quot;/imagescan&quot;, {% raw %}{url:src}{% endraw %}, function(res) {
		var s = &quot;&lt;ul&gt;&quot;;
		for(var i=0;i&lt;res.length;i++) {
			s += &quot;&lt;li&gt;&quot; + res[i].label_name + &quot;&lt;/li&gt;&quot;;
		}
		s += &quot;&lt;/ul&gt;&quot;;
		$recogStatus.html(s);
	},&quot;JSON&quot;);
}</code></pre>

Nothing too terribly interesting here besides some basic jQuery DOM manipulation. If any of this doesn't make sense, just let me know, but obviously the heavy lifting here is really being done on the back end.

So what else is there? As I said, this is all hosted on Bluemix. I've blogged about Bluemix and Node.js apps before, but in case your curious about the process...

<ol>
<li>Create a new app with Bluemix and select the Node.js starter.
<li>Add the Visual Recognition service.
<li>If you haven't installed the command line, do it <a href="https://github.com/cloudfoundry/cli/releases">one time</a>.
</ol>

The entire process is roughly five minutes. I can then use the command line to push up my code to Bluemix. You can see the final app yourself here: <a href="http://marvelcomicrecognition.mybluemix.net/">http://marvelcomicrecognition.mybluemix.net/</a>.
---
layout: post
title: "SauceDB - Handling the Sauce view"
date: "2015-07-24T09:03:27+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,ionic]
banner_image: 
permalink: /2015/07/24/saucedb-handling-the-sauce-view
guid: 6530
---

"Handling the Sauce view" - how immature would I sound if I said that title made me laugh? Today's post isn't terribly exciting. I'm basically going to cover how I got one more screen in my app working. But I'm ok with this being kind of boring. As I document this process, somethings will be complex and some will simple. This is one of the simple items that I think is still useful to cover. 

<!--more-->

If you remember, in the <a href="http://www.raymondcamden.com/2015/07/20/saucedb-building-the-back-end-with-ibm-bluemix">last post</a>, I detailed the setup of the back end using <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a>. I got a Node.js application up and running (both in the cloud and locally) and I connected my first data view from Cloudant, to Node, to my <a href="http://www.ionicframework.com">Ionic</a>. The mobile-side was especially simple as all I had to do was update my service to call Node.js instead of creating random data.

In today's update, I'm building the "Sauce view", or what you see when you click on review. It should show information about the sauce and all the reviews. I began by building the server side. I've already got a connection to Cloudant, so I literally just needed to add a route and a call.

<pre><code class="language-javascript">app.get(ibmconfig.getContextRoot()+'/sauce/:id',  function(req, res) {
	console.log('Requesting sauce '+req.params.id);

	db.get(req.params.id, function(err, body) {
		console.dir(body);
		//TODO: Handle a bad id
		var result = {};
		//for now, just copy it
		result = body;
		res.setHeader('Content-Type', 'application/json');
		res.json(result);		
	});
});</code></pre>

Unlike the call I did to get reviews, I'm not modifying the result. In theory, this is kind of bad because I'm passing data back to the client that i don't need, specifically a <code>_rev</code> key that my front-end doesn't need:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot19.png" alt="shot1" width="606" height="326" class="aligncenter size-full wp-image-6531" />

But for now, I don't care. I just mention it as something to consider. JSON is small, and Ajax is awesome, but we still shouldn't be wasteful about the crap we send back and forth, right?

On the client-side, the change was simpler. Here is the getSauce method:

<pre><code class="language-javascript">var getSauce = function(id) {
    var deferred = $q.defer();
	
    cc.get("/sauce/"+id).then(function(data){
		data = JSON.parse(data);			
		//to be consistent w/ the Feed, copy _id to id
		data.id = data._id;
		console.log('got ',data);
		deferred.resolve(data);
		
    },function(err){
        console.log(err);
    });
	
    return deferred.promise;
}</code></pre>

<code>cc</code> is an instance of the Cloud Code API I'm sharing in the service. I do modify the code a bit here, changing _id to id. I also slightly modify the result in getFeed too. Thinking about this, I believe it may be best for me to do all these modifications on the server so that my client-side code can use it as is. I don't think that's a super crucial modification so I won't worry about it now.

Finally, I can run this baby in the emulator and see my live data:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-24-2015-8.51.38-AM.png" alt="iOS Simulator Screen Shot Jul 24, 2015, 8.51.38 AM" width="450" height="800" class="aligncenter size-full wp-image-6532 imgborder" />

Ok, that's it for now. Don't forget you can see the complete source code here: <a href="https://github.com/cfjedimaster/SauceDB">https://github.com/cfjedimaster/SauceDB</a>. Next, I'm going to try building the Add Sauce view. This will require a valid login as well as security on the Node side.
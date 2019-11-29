---
layout: post
title: "SauceDB: Writing data back"
date: "2015-07-29T17:28:48+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,cordova,ionic]
banner_image: 
permalink: /2015/07/29/saucedb-writing-data-back
guid: 6547
---

Welcome to another post on my ongoing series exploring building an <a href="http://www.ionicframework.com/">Ionic</a> hybrid mobile app making use of Node.js running on <a href="https://ibm.biz/IBM-Bluemix">IBM Bluemix</a>. Today I'm going to talk about writing data back to the server. Spoiler - this won't be quite as cool as bringing sexy back. In my <a href="http://www.raymondcamden.com/2015/07/24/saucedb-handling-the-sauce-view">last post</a>, I described a few minor updates to help flesh out the views of the mobile app. This included building the "Sauce view" (sauce plus reviews) for the application. Today I built another major aspect of the application - actual review writing.

<!--more-->

Getting review writing working is actually a multistep process. Before you add a review, the application asks you to name the sauce you're going to review. The idea was to autocomplete on the name so you can quickly select one that already exists. I had built this functionality on the client side already (<a href="http://www.raymondcamden.com/2015/07/15/saucedb-working-on-the-front-end">SauceDB – Working on the front end</a>), so at this point, all I needed to do was actually get the server-side version of it working.

I began by creating a <a href="https://cloudant.com/for-developers/search/">Cloudant Search Index</a>. This is a pretty darn powerful tool. You simply create an index in your database of the field you want to search and their API will use a Lucene search engine to interface with the data. 

Here is the index I created. My data consists of Sauces with names, so I simply index the name. I want to get the name back in searches, so I tell the index to include the value.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot113.png" alt="shot1" width="800" height="503" class="aligncenter size-full wp-image-6548" />

This worked well enough, but it took me a good hour of banging my head against the wall to get search working. Why? In the term area, you need to include a field. So for example, this returns nothing:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot26.png" alt="shot2" width="407" height="156" class="aligncenter size-full wp-image-6549" />

But when I added the actual field name, "name", it worked:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/07/shot33.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot33.png" alt="shot3" width="600" height="269" class="aligncenter size-full wp-image-6550" /></a>

Ok, so that's cool. I then needed to work with this on the server-side in my Node code:

<pre><code class="language-javascript">app.get(ibmconfig.getContextRoot()+'/search/:term', function(req, res) {
	console.log("searching for "+req.params.term);
	//we need to manipulate term a bit
	var term = "name:" + req.params.term;
	term += "*";
	console.log(term);
	db.search('SauceName','SauceName', {% raw %}{q:term}{% endraw %}, function(err, results) {
		if(err) throw err;
		var result = [];
		for(var i=0;i&lt;results.rows.length;i++) {
			//console.dir(results.rows[i]);
			result.push({% raw %}{id:results.rows[i].id, name:results.rows[i].fields.name}{% endraw %});	
		}
		console.dir(result);
		res.setHeader('Content-Type', 'application/json');
		res.json(result);		
	});
});</code></pre>

You can see I do a bit of manipulation on the input and then just use the Search API provided by the Cloudant Node module. So back in the client-side code, I then removed my mock code in the service layer and replaced it with Cloud Code calls back to Node:

<pre><code class="language-javascript">var searchSauce = function(term) {
	var deferred = $q.defer();
	term = term.toLowerCase();
				
    cc.get("/search/"+term).then(function(data){
		data = JSON.parse(data);			
		deferred.resolve(data);
		
    },function(err){
        console.log(err);
    });
	
	return deferred.promise;

}</code></pre>

And that was pretty much it. (I did change the view template a tiny bit.) Here it is running in the emulator with real data powering the autocomplete.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-29-2015-5.10.47-PM.png" alt="iOS Simulator Screen Shot Jul 29, 2015, 5.10.47 PM" width="394" height="700" class="aligncenter size-full wp-image-6551 imgborder" />

Ok, so at this point, we load up a form to let you write your review. I had already built this out and included logic to recognize a new sauce via an existing one. So for example, an existing sauce just asks you to write the text and select the rating.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-29-2015-5.13.27-PM.png" alt="iOS Simulator Screen Shot Jul 29, 2015, 5.13.27 PM" width="750" height="657" class="aligncenter size-full wp-image-6552 imgborder" />

Whereas a new sauce requires a name and company:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-29-2015-5.14.33-PM.png" alt="iOS Simulator Screen Shot Jul 29, 2015, 5.14.33 PM" width="700" height="818" class="aligncenter size-full wp-image-6553 imgborder" />

Alrighty... so... here comes the fun part. We now need to communicate back to the server. That's a simple post. But remember that we need to include information in the post that signifies that the user is logged in. I already described how I'm using <a href="https://github.com/ccoenraets/OpenFB">OpenFB</a> for Facebook integration and I've got a login token I copy to $rootScope. I also blogged (<a href="http://www.raymondcamden.com/2015/07/10/combining-client-side-social-login-and-server-side-authorization-with-cordova-and-node">Combining client-side social login and server-side authorization with Cordova and Node</a>) about how you can combine client-side login with server-side authorization in Node. All I had to do was bring those parts together.

First - I built in my login middleware. This will check the Facebook token sent by the user to ensure it is valid. I also want to get user information including their name and profile picture. I store all of this in a Node session so I don't have to fetch it again.

<pre><code class="language-javascript">function secure(req, result, next) {    
    if(req.session.tokenchecked) {
        next();   
    } else {
		console.log('need to check token ');
		var token = req.body.token;
		//check to ensure token is good
		https.get('https://graph.facebook.com/me?fields=email,name,picture&access_token='+token, function(res) {
			var str = '';
			res.on('data', function(chunk) {
				str += chunk;
			})
			res.on('end', function() {
				var response = JSON.parse(str);
				//store name and image
				console.dir(response);
				if(response.id) {
					console.log('good');
					req.session.tokenchecked = 1;
					req.session.name = response.name;
					req.session.img = response.picture.data.url;
					next();
				} else {
					console.log('bad');
					result.send("0");
				}
			})
		}).end();
	
    }
}</code></pre>

Now let's look at adding a review. This has to handle two cases - adding a new sauce with a review as well as adding a review to an existing sauce. My code does not validate that a sauce name is unique. I figure... that's a bit too much for now. 

<pre><code class="language-javascript">app.post(ibmconfig.getContextRoot()+'/addreview', secure, function(req, res) {
	console.log("adding review "+JSON.stringify(req.body));
	
	var newReview = {
		posted:new Date(),
		rating:req.body.rating,
		text:req.body.text,
			user:{
				name:req.session.name,
				img:req.session.img
			}
	};
	console.log("New Review:", JSON.stringify(newReview));

	//So first q, is this a new sauce?
	
	if(!req.body.sauce.id) {
		console.log('i need to make a new sauce');
		
		db.insert({
			name:req.body.sauce.name,
			company:req.body.sauce.company,
			avgrating:newReview.rating,
			reviews:[newReview]		
		}, function(err, body) {
			if(err) throw err;
			res.setHeader('Content-Type', 'application/json');
			res.json(body.id);		
		});	
	} else {
		//not new, so get, then add	
		db.get(req.body.sauce.id, function(err, body) {
			if(err) throw err;
			body.reviews.push(newReview);

			//calculate avgrate
			var totalRating = 0;
			for(var i=0;i&lt;body.reviews.length;i++) {
				totalRating += parseInt(body.reviews[i].rating,10);	
			}
			body.avgrating = totalRating/body.reviews.length;
			db.insert(body, function(err, body) {
				if(err) throw err;
				res.setHeader('Content-Type', 'application/json');
				res.json(body.id);		
			});	
					
		});	
	}
});</code></pre>

And that's it. Here's my last review:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-29-2015-5.21.22-PM.png" alt="iOS Simulator Screen Shot Jul 29, 2015, 5.21.22 PM" width="422" height="750" class="aligncenter size-full wp-image-6554 imgborder" />

There's still plenty of rough edges in this code. For example, going back to the feed doesn't get a fresh copy. I'm going to fix that with a cool Ionic widget in my next post. There's also some view caching going on that needs cleaning. You get the idea. But it's getting there!

Remember, you can view the source code here: <a href="https://github.com/cfjedimaster/SauceDB">https://github.com/cfjedimaster/SauceDB</a>.
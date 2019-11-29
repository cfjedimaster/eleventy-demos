---
layout: post
title: "Getting Images from a Twitter Account"
date: "2016-03-25T09:06:00-07:00"
categories: [javascript]
tags: [nodejs,bluemix]
banner_image: /images/banners/twitteraccount.png
permalink: /2016/03/25/getting-images-from-a-twitter-account
---

I've mentioned before that I follow a few Twitter accounts that are primarily picture driven. For example, [@classicairline](https://twitter.com/classicairline) posts historical pictures of commercial aircraft. I even created my own account, [@randomcomicbook](https://twitter.com/randomcomicbook), which posts pictures of Marvel comics. (You can read how I created that here: [Building a Twitter bot to display random comic book covers](http://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers/))

<!--more-->

Twitter provides a way to look at the media for a given user, you just click the "Photos & videos" link on their profile, but I thought it would be neat to build an application that shows *just* the images by themself. Let me show you what I built, then I'll talk about how I built it. You can find the demo here:

[http://twittersuckimage.mybluemix.net/](http://twittersuckimage.mybluemix.net/)

On first hitting the site, you'll be prompted to authenticate with Twitter:

![Login](https://static.raymondcamden.com/images/2016/03/t1.png )

After you've done that, you can then enter a username:

![Post Login](https://static.raymondcamden.com/images/2016/03/t2.png )

After entering a name, it will then use the Twitter API to find tweets from that account that include pictures. It then renders them in a grid:

![Results](https://static.raymondcamden.com/images/2016/03/t3.jpg )

Clicking on one result opens up the image full size:

![Result](https://static.raymondcamden.com/images/2016/03/t4.jpg )

Ok, so how did I do it? Let's focus on the back end first.  Here's the first portion of my application:

<pre><code class="language-javascript">
var express = require('express');
var app = express();

app.use(express.static('public'));

var credentials = require('./credentials.json');

var OAuth = require('oauth').OAuth;
var oa2;

app.set('port', process.env.PORT || 3000);

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
	resave:false,
	saveUninitialized:false,
	secret:credentials.cookieSecret
}));

app.get('/loginstatus', function(req, res) {
	console.log('ran loginstatus check');
	res.send(req.session.screen_name?'1':'0');
});
</code></pre>

In order to use Twitter authentication, I used the [oauth](https://www.npmjs.com/package/oauth) package from NPM. It works well, but I find it a bit awkward at times. I created a simple route, `loginstatus`, that is used to see if I've already authenticated. If you aren't authenticated, here is the route that will start that process. 

<pre><code class="language-javascript">
app.get('/auth/twitter', function(req, res){
	
	var callbackurl = 'http://' + req.headers.host + '/auth/twitter/callback';

	oa = new OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		credentials.twitter_consumer_key,
		credentials.twitter_secret,
		'1.0',
		callbackurl,
		'HMAC-SHA1'
	);
	
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send('yeah no. didnt work.');
		}
		else {
			req.session.oa = oa;
			req.session.oauth_token = oauth_token;
			req.session.oauth_token_secret = oauth_token_secret;
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);
	}
	});
});
</code></pre>

Upon returning from Twitter, you then end up here:

<pre><code class="language-javascript">
app.get('/auth/twitter/callback', function(req, res, next) {

		var oa = new OAuth(req.session.oa._requestUrl,
	                  req.session.oa._accessUrl,
	                  req.session.oa._consumerKey,
	                  req.session.oa._consumerSecret,
	                  req.session.oa._version,
	                  req.session.oa._authorize_callback,
	                  req.session.oa._signatureMethod);
	
		oa.getOAuthAccessToken(req.session.oauth_token,
							   req.session.oauth_token_secret,
							   req.param('oauth_verifier'), 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				console.log('callback results');
				console.dir(results);
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;
				req.session.screen_name = results.screen_name;
				res.redirect('/');
			}
		}
		);
});
</code></pre>

I'm storing tokens for the auth in session - and to be honest - I may not be using the oauth code entirely correct here, but it seems to work. So how does search work? If you check the docs for the [Search API](https://dev.twitter.com/rest/public/search), you'll see you the two parameters we need: `from` will let you filter to one account and `filter:media` will let you get Tweets with media attachments. Here is the route that handles the search.

<pre><code class="language-javascript">
app.get('/search/:account', function(req, res) {
	console.log('search for images in '+req.params.account);
	var account = req.params.account;
	
	var oa = new OAuth(req.session.oa._requestUrl,
	                  req.session.oa._accessUrl,
	                  req.session.oa._consumerKey,
	                  req.session.oa._consumerSecret,
	                  req.session.oa._version,
	                  req.session.oa._authorize_callback,
	                  req.session.oa._signatureMethod);
	
	oa.get('https://api.twitter.com/1.1/search/tweets.json?q=from{% raw %}%3A'+account+'+filter%{% endraw %}3Amedia&count=100', req.session.oauth_access_token, req.session.oauth_access_token_secret,           
      function (e, retData, ores) {
		if (e) {
			console.log('Search: error result');
			console.dir(JSON.parse(e.data));
			
			var error = JSON.parse(e.data).errors;
			res.send({% raw %}{error:1, message:error[0].message}{% endraw %});			
		} else {
			retData = JSON.parse(retData);
			console.log('got '+retData.statuses.length+ ' items');
			var results = [];
					
			retData.statuses.forEach(function(tweet) {
				if(tweet.entities && tweet.entities.media && tweet.entities.media.length &gt; 0) {
					tweet.entities.media.forEach(function(m) {
						results.push(m.media_url);	
					});
				}

			});
			res.send(results);

		}
      });
	
});
</code></pre>

The end result of this is a simple array of URLs. What's cool is that one media URL can represent both a thumbnail and the original image. You'll see how when we get to the front end. 

So let's talk about the front end. I tried to use a few different "image layout" plugins, but every one I tried didn't work well for me. I ended up just laying them out side by side and using a bit of CSS to add some padding. To create the detail view, I used [Colorbox](http://www.jacklmoore.com/colorbox/), a jQuery plugin. 

Here's the entire front-end JavaScript code.

<pre><code class="language-javascript">
$(document).ready(function() {
	
	$statusDiv = $('#statusArea');
	$twitterAccount = $('#twitterAccount');
	$searchButton = $('#searchButton');
	$results = $('#results');
	$searchForm = $('#searchForm');
	
	$.get('/loginstatus', {}, function(res) {
		if(res == 0) {
			console.log('we need to auth');
			$statusDiv.html('<p>To begin, you need to authenticate with Twitter: <a href="/auth/twitter">Sign in via Twitter</a></p>');
		} else {
			console.log('we are online');
			$searchForm.show();
		}
	});

	$searchButton.on('click', function() {
		var account = $.trim($twitterAccount.val());
		//remove @
		if(account.indexOf('@') === 0) account = account.substr(1);
		if(account === '') return;

		$results.html('<i>Searching...</i>').show();
		$searchButton.prop('disabled',true);
		console.log('begin looking for '+account);

		$.get('/search/'+account, function(result) {
			console.log('Back from search with '+result.length+' items');
			
			$searchButton.prop('disabled',false);
			
			if(result.length === 0) {
				$results.html('<i>Sorry, but no results were found.</i>').show();
				return;
			}
			
			s = '';

			result.forEach(function(u) {
				s += '&lt;a class="gallery" href="'+u+'"&gt;&lt;img src="' + u + ':thumb" data-highres="'+u+'"&gt;&lt;/a&gt;';
			});
			
			$results.html(s).show();
			$('.gallery').colorbox();
			
		});
	});
	
});
</code></pre>

The first function simply handles seeing if we have an active login on the server side. Searching is just a quick call to the back-end and processing the array result. 

You can find the complete code for this application up on GitHub: [https://github.com/cfjedimaster/TwitterSuckImage](https://github.com/cfjedimaster/TwitterSuckImage). Let me know what you think by leaving me a comment below!
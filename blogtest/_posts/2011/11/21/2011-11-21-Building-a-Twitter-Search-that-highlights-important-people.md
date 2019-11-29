---
layout: post
title: "Building a Twitter Search that highlights important tweets"
date: "2011-11-21T12:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/21/Building-a-Twitter-Search-that-highlights-important-people
guid: 4441
---

After spending some time arguing with an "expert" who made a comment about my favorite language without actually trying it, I thought it might be interesting to build a Twitter search tool that helps highlight "important" Tweets. I put "important" in quotes since there are many factors that might make one tweet more important compared to another. (And yes - I'm sure this has been done. But darnit, when has that ever stopped me from coding before?) I decided to whip up a quick prototype and see how it works.
<!--more-->
<p>

I began with a simple form. When you click, I take your result, hit the Twitter API, and render the results. Here's the code for the first draft.

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
	&lt;head&gt;
	&lt;title&gt;Twitter Search with Rating&lt;/title&gt;
	&lt;link rel="stylesheet" href="bootstrap.min.css"&gt;
	&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script&gt;
	function getImportance(t){
		//First we check follower count
		//Then we check RT count
		//Then we check if the first part of the string is 'RT'
		var score=0;
	
		if(t.metadata.hasOwnProperty("recent_retweets")) score+= parseInt(t.metadata.recent_retweets);
		if(t.text.toLowerCase().indexOf("rt") == 0) score+=1;
		console.log(score);
		return score;
	}
	
	function renderTweet(t) {
		//console.log(JSON.stringify(t.metadata));
		var tweet = "";
		var importance = getImportance(t);
		tweet += "&lt;p class='tweet "+importance+"'&gt;";
		tweet += "&lt;img src='"+t.profile_image_url+"'&gt;";
		tweet += "From "+t.from_user_name + " on "+t.created_at + "&lt;br/&gt;";
		tweet += t.text+"&lt;/p&gt;";
		return tweet;
	}
	
	$(document).ready(function() {

		$("#mainForm").submit(function(e) {
			$("#searchButton").trigger("click");
			e.preventDefault();
		});

		$("#searchButton").click(function() {
			var term = $.trim($("#searchterm").val());
			if(term == "") return;
			console.log("Sarch for "+term);
			$.getJSON("http://search.twitter.com/search.json?q="+escape(term)+"&lang=en&include_entities=true&rpp=100&result_type=mixed&callback=?", {}, function(res,code) {
				//console.dir(res.results);
				console.log(res.results.length + " results.");
				var s = "";
				for(var i=0; i&lt;res.results.length; i++) {
					s+=renderTweet(res.results[i]);
				}
				$("#resultContainer").html(s);
			});
		});	
	
	
		
	})
	&lt;/script&gt;
	&lt;style&gt;
	#resultContainer {
		height: 500px;
		overflow:auto;
		border-style:solid;
		border-width:thin;
	}
	
	.tweet {
	
	}
	.tweet img {
		align: left;
		padding-right: 10px;
	}
	&lt;/style&gt;
	&lt;/head&gt;
	
	&lt;body&gt;

		&lt;div class="container"&gt;

			&lt;form id="mainForm"&gt;
				&lt;fieldset&gt;
				&lt;div class="clearfix"&gt;
					&lt;input type="text" id="searchterm" placeholder="Search Term" class="xlarge" size="30"&gt;
					&lt;input type="button" id="searchButton" value="Search" class="btn primary"&gt;
				&lt;/div&gt;
				&lt;/fieldset&gt;
			&lt;/form&gt;
			
			&lt;div id="resultContainer"&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
		
				
	&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

First take a look at the searchButton click handler. I grab the value out of the form and pass it to Twitter's API. For each result I'm running a render function for the tweet. For the most part this is just vanilla HTML, but note the call out to getImportance. Sometimes Twitter will return metadata for a tweet noting how many times it has been retweeted. I take that and a possible "RT" in front and create a score from it. I'm including it in the result HTML but not actually doing anything with it yet. Basically I just wanted to test the types of score values I get back. While Twitter returns the user ID and user name, it doesn't return any additional metadata for the user. I'll address that in the next draft. 

<p>

Demo: <a href="http://www.raymondcamden.com/demos/2011/nov/21/searchwithrating.html">http://www.coldfusionjedi.com/demos/2011/nov/21/searchwithrating.html</a>

<p>

Ok, now let's ramp it up a bit.

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
	&lt;head&gt;
	&lt;title&gt;Twitter Search with Rating&lt;/title&gt;
	&lt;link rel="stylesheet" href="bootstrap.min.css"&gt;
	&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script&gt;
	var tweets = {};
	var users = {};
	var lookupusers = {};

	//Credit: http://stackoverflow.com/questions/5223/length-of-javascript-associative-array/6700#6700
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	function getImportance(t){
		//First we check follower count
		//Then we check RT count
		//Then we check if the first part of the string is 'RT'
		var score=0;
	
		//first draft logic is 1 point per 1k followers
		score += Math.floor(users[t.from_user_id_str].followers_count/1000);
		if(t.metadata.hasOwnProperty("recent_retweets")) score+= parseInt(t.metadata.recent_retweets);
		if(t.text.toLowerCase().indexOf("rt") == 0) score+=1;

		//based on score return 3 levels of importance
		if(score &lt; 10) return "lowImportance";
		if(score &lt; 25) return "mediumImportance";
		return "highImportance";
		return score;
	}
	
	function renderTweet(t) {
		//console.log(JSON.stringify(t.metadata));
		var tweet = "";
		var importance = getImportance(t);
		tweet += "&lt;p class='tweet "+importance +"' id='"+t.id+"'&gt;";
		tweet += "&lt;img src='"+t.profile_image_url+"'&gt;";
		tweet += "From "+t.from_user_name + " on "+t.created_at + "&lt;br/&gt;";
		tweet += t.text+"&lt;/p&gt;";
		//console.log(tweet);
		return tweet;
	}
	
	function renderTweets(){
		var s = "";
		for (var i = 0; i &lt; tweets.length; i++) {
			s += renderTweet(tweets[i]);
		}
		$("#resultContainer").html(s);
	}
	
	$(document).ready(function() {

		$("#mainForm").submit(function(e) {
			$("#searchButton").trigger("click");
			e.preventDefault();
		});

		$("#searchButton").click(function() {
			var term = $.trim($("#searchterm").val());
			if(term == "") return;
			$("#status").html("&lt;i&gt;Working....&lt;/i&gt;");
			lookupusers = {};
			console.log("Search for "+term);
			$.getJSON("http://search.twitter.com/search.json?q="+escape(term)+"&lang=en&include_entities=false&rpp=100&result_type=mixed&callback=?", {}, function(res,code) {
				console.log(res.results.length + " tweet results.");
				tweets = res.results;
				for(var i=0; i&lt;res.results.length; i++) {
					if(!users.hasOwnProperty(res.results[i].from_user_id_str)) lookupusers[res.results[i].from_user_id_str] = 1;
				}
				//if we have lookup users, let's do the api call
				console.log("I need to look up "+Object.size(lookupusers)+" users.");
				var idlist = "";
				for(var u in lookupusers) {
					idlist += u + ",";
				}
				if(idlist != "") {
					$.getJSON("https://api.twitter.com/1/users/lookup.json?user_id="+idlist+"&include_entities=false&callback=?", {}, function(res, code) {
						console.log(res.length + " user results.");
						//add everyone to the users cache
						for(var i=0; i&lt;res.length; i++) {
							users[res[i].id] = res[i];
						}
						//then call render
						$("#status").html("");
						renderTweets();
					});
				} else {
					$("#status").html("");
					renderTweets();
				}
			});
		});	
	
	
		
	})
	&lt;/script&gt;
	&lt;style&gt;
	#resultContainer {
		height: 500px;
		overflow:auto;
		border-style:solid;
		border-width:thin;
	}
	
	.tweet {
	
	}
	.tweet img {
		align: left;
		padding-right: 10px;
	}
	.lowImportance {
	}
	.mediumImportance {
		background-color: yellow;
	}
	.highImportance {
		background-color: red;
	}
	&lt;/style&gt;
	&lt;/head&gt;
	
	&lt;body&gt;

		&lt;div class="container"&gt;

			&lt;form id="mainForm"&gt;
				&lt;fieldset&gt;
				&lt;div class="clearfix"&gt;
					&lt;input type="text" id="searchterm" placeholder="Search Term" class="xlarge" size="30"&gt;
					&lt;input type="button" id="searchButton" value="Search" class="btn primary"&gt; &lt;span id="status"&gt;&lt;/span&gt;
				&lt;/div&gt;
				&lt;/fieldset&gt;
			&lt;/form&gt;
			
			&lt;div id="resultContainer"&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
		
				
	&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Big changes here, so let me try to address each one in kind. First - notice that I've got a global users object. The point of this is to cache user data. So if you search for jquery, for example, and then jquery ui, you may have the user info for a person's tweet already. The lookupusers object is going to be used as a way to track the people I need to look up (versus those I already have in cache).  Hop on down to the click handler. Now - I had thought about displaying the tweets after the search results, doing a user lookup, and then applying the styles when the data came back. You can see that a bit in the fact that I applied the tweet ID to the paragraph wrapping the display. I then discovered that the user look up system could take up to 100 people at once. That means that my network calls come down to just 2 per search. To me, that seemed like it would be fast enough to just make the user wait. 

<p>

You can see then where I loop over the results and figure out which users I don't know. If I have any at all, I call a user request. If not, I immediately render them. The getImportance function now checks the user's follower count. It divides that by 1000 and adds it to the score. Not very scientific perhaps, but it's a demo. ;) 

<p>

Demo - and note - this has bugs that we'll be addressing) - <a href="http://www.coldfusionjedi.com/demos/2011/nov/21/searchwithrating2.html">http://www.coldfusionjedi.com/demos/2011/nov/21/searchwithrating2.html</a>

<p>

Ok - now for the third and final edition. I call this the epic version. In this version I make use of Session Storage. This is an HTML5 feature I've talked about before (but I focused on Local Storage) that makes it really easy to store arbitrary data. I used Session Storage instead of Local Storage since I don't want to persist the data forever. Basically - I take user results, JSONify them, and put them in session. When the HTML page is loaded, if I have data there, I deserialize it. I also fixed a bug where Twitter was - for some reason - returning more than 100 tweets even though a) I asked just for a 100 and b) their docs say they only return 100. I also handled cases where user data for a particular user wasn't returned. (I'm assuming it's a protected user.) Here's the latest code base:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
	&lt;head&gt;
	&lt;title&gt;Twitter Search with Rating&lt;/title&gt;
	&lt;link rel="stylesheet" href="bootstrap.min.css"&gt;
	&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script&gt;
	var tweets = {};
	var users = {};
	var lookupusers = {};

	//Credit: http://stackoverflow.com/questions/5223/length-of-javascript-associative-array/6700#6700
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	function getImportance(t){
		//First we check follower count
		//Then we check RT count
		//Then we check if the first part of the string is 'RT'
		var score=0;
	
		//first draft logic is 1 point per 1k followers
		if (users.hasOwnProperty(t.from_user_id_str) && users[t.from_user_id_str].hasOwnProperty("followers_count")) {
			score += Math.floor(users[t.from_user_id_str].followers_count / 1000);
		} 
		if(t.metadata.hasOwnProperty("recent_retweets")) score+= parseInt(t.metadata.recent_retweets);
		if(t.text.toLowerCase().indexOf("rt") == 0) score+=1;

		//based on score return 3 levels of importance
		if(score &lt; 10) return "lowImportance";
		if(score &lt; 25) return "mediumImportance";
		return "highImportance";
		return score;
	}
	
	function renderTweet(t) {
		//console.log(JSON.stringify(t.metadata));
		var tweet = "";
		var importance = getImportance(t);
		tweet += "&lt;p class='tweet "+importance +"' id='"+t.id+"'&gt;";
		tweet += "&lt;img src='"+t.profile_image_url+"'&gt;";
		tweet += "From "+t.from_user_name + " on "+t.created_at + "&lt;br/&gt;";
		tweet += t.text+"&lt;/p&gt;";
		//console.log(tweet);
		return tweet;
	}
	
	function renderTweets(){
		var s = "";
		for (var i = 0; i &lt; tweets.length; i++) {
			s += renderTweet(tweets[i]);
		}
		$("#resultContainer").html(s);
	}
	
	$(document).ready(function() {

		//if we have users in sessionstore, load em 
		if(sessionStorage.hasOwnProperty("users")) {
			console.log("good news, I have users already");
			users = JSON.parse(sessionStorage["users"]);
			console.log("I preloaded "+Object.size(users)+ " users.");
			console.dir(users);
		} 
		
		$("#mainForm").submit(function(e) {
			$("#searchButton").trigger("click");
			e.preventDefault();
		});

		$("#searchButton").click(function() {
			var term = $.trim($("#searchterm").val());
			if(term == "") return;
			$("#status").html("&lt;i&gt;Working....&lt;/i&gt;");
			$("#resultContainer").html("");
			lookupusers = {};
			console.log("Search for "+term);
			$.getJSON("http://search.twitter.com/search.json?q="+escape(term)+"&lang=en&include_entities=false&rpp=100&result_type=mixed&callback=?", {}, function(res,code) {
				console.log(res.results.length + " tweet results.");
				tweets = res.results;
				for(var i=0; i&lt;Math.min(100,res.results.length); i++) {
					if(!users.hasOwnProperty(res.results[i].from_user_id_str)) lookupusers[res.results[i].from_user_id_str] = 1;
				}
				//if we have lookup users, let's do the api call
				console.log("I need to look up "+Object.size(lookupusers)+" users.");
				var idlist = "";
				for(var u in lookupusers) {
					idlist += u + ",";
				}
				if(idlist != "") {
					$.getJSON("https://api.twitter.com/1/users/lookup.json?user_id="+idlist+"&include_entities=false&callback=?", {}, function(res, code) {
						console.log(res.length + " user results.");
						//add everyone to the users cache
						for(var i=0; i&lt;res.length; i++) {
							users[res[i].id] = res[i];
						}
						//copy to session
						sessionStorage["users"] = JSON.stringify(users);
						//then call render
						$("#status").html("");
						renderTweets();
					});
				} else {
					$("#status").html("");
					renderTweets();
				}
			});
		});	
	
	
		
	})
	&lt;/script&gt;
	&lt;style&gt;
	#resultContainer {
		height: 500px;
		overflow:auto;
		border-style:solid;
		border-width:thin;
	}
	
	.tweet {
	
	}
	.tweet img {
		align: left;
		padding-right: 10px;
	}
	.lowImportance {
	}
	.mediumImportance {
		background-color: yellow;
	}
	.highImportance {
		background-color: red;
	}
	&lt;/style&gt;
	&lt;/head&gt;
	
	&lt;body&gt;

		&lt;div class="container"&gt;

			&lt;form id="mainForm"&gt;
				&lt;fieldset&gt;
				&lt;div class="clearfix"&gt;
					&lt;input type="text" id="searchterm" placeholder="Search Term" class="xlarge" size="30"&gt;
					&lt;input type="button" id="searchButton" value="Search" class="btn primary"&gt; &lt;span id="status"&gt;&lt;/span&gt;
				&lt;/div&gt;
				&lt;/fieldset&gt;
			&lt;/form&gt;
			
			&lt;div id="resultContainer"&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
		
				
	&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And here is a sample. Yes, the red is horrible. I know. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip236.png" />

<p>

You can demo this one here: <a href="http://www.coldfusionjedi.com/demos/2011/nov/21/searchwithrating3.html">http://www.coldfusionjedi.com/demos/2011/nov/21/searchwithrating3.html</a>
---
layout: post
title: "Working with SOAP in a Node App"
date: "2016-10-12T14:56:00-07:00"
categories: [javascript]
tags: [nodejs]
banner_image: 
permalink: /2016/10/12/working-with-soap-in-a-node-app
---

I've been lucky to have been able to avoid SOAP for a few years now, but today there was an API I wanted to work with that had this right on top of their documentation:

<!--more-->

<blockquote>
The API is implemented as an XML SOAP web service. Please read the the WSDL. There are no plans at present to make it available via JSON.
</blockquote>

My reaction was, of course, quite reasonable. 

!["Yes, I barfed"](https://static.raymondcamden.com/images/2016/10/cartbarf.jpg)

So once I got over that initial reaction, I thought, "I wonder how folks in Node-land work with SOAP?" I did a bit of research and found a great solution, [node-soap](https://github.com/vpulim/node-soap).

node-soap lets you easily make SOAP calls to web services as well as setup your own SOAP service if you need to. And let's be honest, that's the only reason you would set one up because, my god... SOAP. (Sorry, I promise not to rag on SOAP and WSDL anymore. Not a lot anyway.)

The API in question was one for the site, [Brickset](http://brickset.com). Brickset is a nice little site that contains a *huge* amount of information on Lego brick sets. It's got a huge product directory as well as an events calendar and forum. I've built a few Lego sets in my life, but I'm thinking about getting a bit more involved next year so this looks to be a great resource. 

!["Brickset.com"](https://static.raymondcamden.com/images/2016/10/bs.png)

On top of that, they have an [API](http://brickset.com/tools/webservices/v2)! A SOAP API, but no one's perfect, right? I thought it might be fun to build a little app to randomly select a Lego set from their database. I've done "select a random X from the db" thing a few times now (see ["Building a Twitter bot to display random comic book covers"](https://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers/) as an example) and I don't know but the idea just interests me. I'll sit there and just reload and just... explore. 

So with that in mind, I began writing. I create a simple web page that would make an Ajax call to my local Node server. I'd have a route that would handle finding the random set and then returning that JSON to the front-end code. I'm assuming most of the front-end code and route stuff isn't interesting, so I'll just share the module I wrote to work Brickset's API. It shows you how nice node-soap was to work with.

<pre><code class="language-javascript">var soap = require('soap');
var apiWSDL = 'http://brickset.com/api/v2.asmx?WSDL';

var key = '';

//based on searching brickset.com
var minYear = 1950;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setKey(k) {
	key = k;
}

function getRandomSet() {

	//first, determine the year
	year = getRandomInt(minYear, (new Date()).getFullYear());
	console.log('chosen year', year);

	var p = new Promise(function(resolve, reject) {
		
		soap.createClient(apiWSDL, function(err, client) {
			if(err) throw new Error(err);

			var args = {
				apiKey:key,
				userHash:'',
				query:'',
				theme:'',
				subtheme:'',
				setNumber:'',
				year:year,
				owned:'',
				wanted:'',
				orderBy:'',
				pageSize:'2000',
				pageNumber:'1',
				userName:''
			}

			client.getSets(args, function(err, result) {
				if(err) reject(err);
				if(!result) {
					return getRandomSet();
				}

				var sets = result.getSetsResult.sets;
				console.log('i found '+sets.length+' results');
				if(sets.length) {
					var chosen = getRandomInt(0, sets.length-1);
					var set = sets[chosen];
					// now that we have a set, try to get more images
					if(set.additionalImageCount &gt; 0) {
						client.getAdditionalImages({% raw %}{apiKey:key, setID:set.setID}{% endraw %}, function(err, result) {
							if(err) reject(err);
							console.log('i got more images', result);
							set.additionalImages = result;
							resolve(set);
						});
					} else {
						resolve(set);
					}
				}
			});
		});
		
		
	});

	return p;

}

exports.setKey = setKey;
exports.getRandomSet = getRandomSet;</code></pre>

To handle selecting a random set, I used the following logic. First, I searched a bit on Brickset to determine what was the earliest year of data. While I found one year in the 40s with one result, 1950 was the first year to have multiple results. So selecting the year is simply a random selection between 1950 and the current year.

As far as I could tell, their API allowed you to select as many items as you want in your call, so I used a `pageSize` value of 2000 to grab everything. Then it was simply a matter of selecting a random set. 

The SOAP client is created with `soap.createClient`, and note that all I have to do is pass in the WSDL. WSDL is the "descriptor" for SOAP services. Imagine asking someone to write up documentation for an API, then throw that away and select 20000 random words from the dictionary. That's WSDL. 

Actually calling the API is done via `client.X`, where `X` is the specific method. In this case I just called `getSets`. I noticed that if I didn't pass *every* argument, the result was null. I don't know if that's a SOAP thing or a particular issue with the API, but that's why that `args` object has a bunch of empty values. 

The API also supports returning additional images, so you can see I call that too, but I never ended up using it in the front end. Maybe next time.

And that's it. Here's a random example:

!["Example"](https://static.raymondcamden.com/images/2016/10/bs1a.png)

And another:

!["Example"](https://static.raymondcamden.com/images/2016/10/bs2a.png)

I don't know why, but I just love seeing those old sets. Anyway, you can give it a whirl yourself if you want, although I've been having some issues with Bluemix today so forgive me if it isn't up and running.

http://randombrickset.mybluemix.net/

And as I said, if you want to see the rest of the code, just let me know!
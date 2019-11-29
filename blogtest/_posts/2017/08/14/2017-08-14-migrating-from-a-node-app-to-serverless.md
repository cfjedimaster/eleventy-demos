---
layout: post
title: "Migrating from a Node App to Serverless"
date: "2017-08-14T09:24:00-07:00"
categories: [serverless]
tags: [nodejs,openwhisk]
banner_image: 
permalink: /2017/08/14/migrating-from-a-node-app-to-serverless
---

For a while now I've been thinking about how I would go about migrating a "traditional" Node application to a serverless one. All I've needed is a good example - and last week I found one. While going through the apps I had set up on Bluemix, I remembered that I had a Node server running to power my Twitter bot, <a href="https://twitter.com/randomcomicbook">https://twitter.com/randomcomicbook</a>. 

I blogged about this project over a year ago (<a href="https://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers/">Building a Twitter bot to display random comic book covers</a>) and while looking at the code again, I realized it would be a perfect candidate for rewriting using a serverless framework. Let's begin by reviewing the old application.

Version One - Traditional Node App
---

I've already linked to the blog entry where I went into detail about the application, so I'll just cover the high points here. Let me start off by saying that this isn't necessarily the best Node app out there. Ok, honestly, it's probably pretty crappy. But it works - and I'm still learning - so I pretty much expect any code I look at that is a year old is going to have a few issues. You can find the entire code base on the <a href="https://github.com/cfjedimaster/randomcomicbook">Github repo</a>, but let me share the main application file.

<pre><code class="language-javascript">/*eslint-env node*/

var request = require('request');

var express = require('express');

var credentials = require('./credentials.json');

var Twitter = require('twitter');
var client = new Twitter(credentials.twitter);

var marvel = require('./marvel');
marvel.setCredentials(credentials.marvel.private_key, credentials.marvel.api_key);

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var app = express();

app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
	console.log(&quot;server starting on &quot; + appEnv.url);
});

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function tweetRandomCover() {
	console.log('First, we get a random cover.');

	marvel.getCover(function(res) {
		console.log('back from mavel');
		console.dir(res);
		var tweet = res.title + ' published '+(MONTHS[res.date.getMonth()])+' '+res.date.getFullYear() +'\n'+res.link;
		
		console.log('Now going to fetch the image link.');

		request.get({% raw %}{url:res.url,encoding:null}{% endraw %}, function(err, response, body) {
			if(!err &amp;&amp; response.statusCode === 200) {
				console.log('Image copied to RAM');

				client.post('media/upload', {% raw %}{media: body}{% endraw %}, function(error, media, response) {

					if(error) {
						console.error('Error from media/upload: '+error);
						return;	
					}
					
					// If successful, a media object will be returned.
					console.log('Image uploaded to Twitter');

					var status = {
						status: tweet,
						media_ids: media.media_id_string 
					}

					client.post('statuses/update', status, function(error, tweet, response){
						if (!error) {
							console.log('Tweeted ok');
						}
					});

				});
						
			}
		});
	});	
}

app.get('/forceTweet', function(req, res) {
	tweetRandomCover();
	res.end('Done (not really)');
});

var cron = require('cron');
var cronJob = cron.job('0 6,12,18 * * *', function() {
	console.log('do the cover');
	tweetRandomCover();	
	console.log('cron job complete');
});
cronJob.start();
</code></pre>

There's a few things to note here.

* First off, I still stuggle with "how much code goes in my main app file versus includes", and you can see I've got a mismash of stuff here. I put the Marvel API logic in a module, but the Twitter stuff is not. Since this isn't a traditional web app and I don't have a lot of routes (more on that in a second), I'm kinda ok with it, but this could definitely be organized a bit nicer.
* I didn't even notice it till this week - but I'm using Express. I love Express. But the app has a grand total of one public route, and it's not even meant to be used - it's just a way for me to test. So I loaded an entire framework for no good reason. Hell I even set up a static directory that I never ended up using. 
* And then the biggest thing to note here is - my code tweeted 4 times a day, but ran 24 hours a day. Cost wise that *could* have been a huge waste of money. (It really wasn't, but you get the idea.)

Version Two - Serverless Version
---

In designing my new version, I split up the job into the following actions.

* The first action handles selecting a date.
* The second action handles searching Marvel.
* The third action simply selects the random comic.
* The four action "prepares" the tweet.
* The fifth and last action fires off the Tweet.

Let's look at these components. I began with the date selection code.

<pre><code class="language-javascript">function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main(params) {
    &#x2F;&#x2F;get random values
    let year = getRandomInt(1960, new Date().getFullYear()-1);
    let month = getRandomInt(1,12);
    
    let monthStr = month&lt;10?&quot;0&quot;+month:month;
    let daysInMonth = new Date(year, month, 0).getDate();

    let beginDateStr = year + &quot;-&quot; + monthStr + &quot;-01&quot;;
    let endDateStr = year + &quot;-&quot; + monthStr + &quot;-&quot; + daysInMonth;
    
    let dateString = beginDateStr+&#x27;,&#x27;+endDateStr;
    console.log(&#x27;dateString is &#x27;+dateString);
    
    return {
        limit:100,
        format:&quot;comic&quot;,
        formatType:&quot;comic&quot;,
        dateRange:dateString
    }
}
</code></pre>

Nothing too interesting here, but note the kinda cool logic to get the end of the month. If you use day 0 for a month, it really means day minus one. I found this trick on <a href="https://stackoverflow.com/a/222439/52160">StackOverflow</a> of course. The rest of the code is basically setting up parameters to use with the Marvel API. Speaking of - here is the action.

<pre><code class="language-javascript">const request = require(&#x27;request-promise&#x27;);
const crypto = require(&#x27;crypto&#x27;);

const API = &#x27;http:&#x2F;&#x2F;gateway.marvel.com&#x2F;v1&#x2F;public&#x2F;comics?&#x27;;

function main(args) {

	let url = API + `&amp;apikey=${% raw %}{args.api_key}{% endraw %}`;

	&#x2F;&#x2F;Add optional filters
	if(args.limit) url += `&amp;limit=${% raw %}{args.limit}{% endraw %}`;
	if(args.format) url += `&amp;format=${% raw %}{encodeURIComponent(args.format)}{% endraw %}`;
	if(args.formatType) url += `&amp;formatType=${% raw %}{encodeURIComponent(args.formatType)}{% endraw %}`;
	if(args.dateRange) url += `&amp;dateRange=${% raw %}{args.dateRange}{% endraw %}`;
	&#x2F;&#x2F;lots more go here

	let ts = new Date().getTime();
	let hash = crypto.createHash(&#x27;md5&#x27;).update(ts + args.private_key + args.api_key).digest(&#x27;hex&#x27;);
	url += `&amp;ts=${% raw %}{ts}{% endraw %}&amp;hash=${% raw %}{hash}{% endraw %}`;

	return new Promise((resolve, reject) =&gt; {

		let options = {
			url:url,
			json:true
		};

		request(options).then((result) =&gt; {
			resolve({% raw %}{result:result}{% endraw %});
		})
		.catch((err) =&gt; {
			reject({% raw %}{error:err}{% endraw %});
		});
	});

}
</code></pre>

This is a new package I created specifically for the Marvel API. If you've read my blog for a while now you know I like to play around with comics, so I created a new package just for Marvel. Their API supports a lot of different end points and this just covers one, and I barely touched upon the supported arguments. But what's cool here is that I can now use this action in other applications in the future. You can too - I forgot to actually share the package, but just ask and I'll do so. (Yeah, that's a bit weird, but I'd like to know if anyone actually wants to use it before I make it public - and of course the code is up on Github.) 

As a package I plan on making public, I created a bound copy of it with my Marvel credentials. This lets me use the action with no authentication required. 

The next action handles selected a random comic book. (I named the file, "selctCover", but technically it is selecting a comic. This bugs me, but not enough to rename the file.)

<pre><code class="language-javascript">const IMAGE_NOT_AVAIL = &quot;http:&#x2F;&#x2F;i.annihil.us&#x2F;u&#x2F;prod&#x2F;marvel&#x2F;i&#x2F;mg&#x2F;b&#x2F;40&#x2F;image_not_available&quot;;

function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main(args) {
    let comics = args.result.data.results;
    console.log(&#x27;before filter - &#x27;+comics.length+&#x27; comics&#x27;);
    &#x2F;*
    first, filter the array by comics that have a cover
    *&#x2F;
    comics = comics.filter((comic) =&gt; {
        return (comic.thumbnail &amp;&amp; comic.thumbnail.path != IMAGE_NOT_AVAIL);
    });

    console.log(&#x27;after filter - &#x27;+comics.length+&#x27; comics&#x27;);

    let selectedComic = {};

    if(comics.length) {
        selectedComic = comics[getRandomInt(0, comics.length-1)];
        &#x2F;*
        remove a crap ton of stuff as we don&#x27;t need everything
        *&#x2F;
        delete selectedComic.characters;
        delete selectedComic.collectedIssues;
        delete selectedComic.collections;
        delete selectedComic.creators;
        delete selectedComic.description;
        delete selectedComic.diamondCode;
        delete selectedComic.digitalId;
        delete selectedComic.ean;
        delete selectedComic.events;
        delete selectedComic.format;
        delete selectedComic.id;
        delete selectedComic.images;
        delete selectedComic.isbn;
        delete selectedComic.issn;
        delete selectedComic.modified;
        delete selectedComic.pageCount;
        delete selectedComic.prices;
        delete selectedComic.series;
        delete selectedComic.stories;
        delete selectedComic.textObjects;
        delete selectedComic.upc;
        delete selectedComic.variantDescription;
        delete selectedComic.variants;
    }

    return {
        comic:selectedComic
    }
}
</code></pre>

I begin by filtering out comics without a thumbnail (or the default "no picture available") and then just pick one by random. I also decided to remove a lot of extra data. I wrote this code last night, and looking at it now, that feels wrong to me. Yes, this action is specifically for this new application and yes, I know I don't need all that data, but I think I should have left the data as is. How about we pretend I didn't do that?

The next action then prepares information for the Tweet. Basically this is where I craft the text I want to use on each one. Here is an example of how a tweet looks:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">&quot;Avengers West Coast (1985) #56&quot; published March 1990<a href="https://t.co/vGzRiPQSzl">https://t.co/vGzRiPQSzl</a> <a href="https://t.co/mU6y726Ep2">pic.twitter.com/mU6y726Ep2</a></p>&mdash; Random Comic Book (@randomcomicbook) <a href="https://twitter.com/randomcomicbook/status/897065428131991553">August 14, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

My god - the neck on her is insane. Anyway, here is the code:

<pre><code class="language-javascript">const MONTHS = [&#x27;January&#x27;, &#x27;February&#x27;, &#x27;March&#x27;, &#x27;April&#x27;, &#x27;May&#x27;, &#x27;June&#x27;, &#x27;July&#x27;, &#x27;August&#x27;, &#x27;September&#x27;, &#x27;October&#x27;, &#x27;November&#x27;, &#x27;December&#x27;];

function main(args) {
    &#x2F;&#x2F;initialize to now just in case...
    let saleDate = new Date();

    &#x2F;&#x2F;get the onsale date
    args.comic.dates.forEach((dateRec) =&gt; {
        if(dateRec.type === &#x27;onsaleDate&#x27;) saleDate = new Date(dateRec.date);
    });

    &#x2F;&#x2F;get the right link
    let link = &#x27;&#x27;;
    args.comic.urls.forEach((urlRec) =&gt; {
        if(urlRec.type === &#x27;detail&#x27;) link = urlRec.url;
    });

    &#x2F;&#x2F;get the cover
    let cover = args.comic.thumbnail.path + &#x27;.&#x27; + args.comic.thumbnail.extension;

    console.log(args.comic);

    &#x2F;&#x2F; Create the text based on the comic data
    let tweet = &#x27;&quot;&#x27;+ args.comic.title + &#x27;&quot; published &#x27;+ (MONTHS[saleDate.getMonth()])+&#x27; &#x27;+saleDate.getFullYear() +&#x27;\n&#x27;+link;

    return {
        status:tweet,
        image:cover
    }
}
</code></pre>

For the most part, I'm just digging into the comic data and finding the right values. Nothing special. 

Alright, so for the final part - I just need to send a Tweet. I built, and released, a Twitter package for OpenWhisk earlier this year: <a href="https://www.raymondcamden.com/2017/03/15/a-twitter-package-for-openwhisk">A Twitter Package for OpenWhisk</a>. But at the time, I didn't support sending tweets. I added support for that later on, but it didn't support uploading media. The last time I wrote code for sending tweets that including media, I noticed that the Twitter API requires two calls. First, you upload the media, then you make your tweet and attach the media. I thought - why not just make that simpler. Check it out below:

<pre><code class="language-javascript">const Twitter = require('twitter');
const request = require('request');

/*
I send a tweet. i need:

args.status (the text)
args.image (url of an image)

and that's all I'm supported for now! Note, unlike getTweets
which can get by with less access, for this you need user auth
as documented here: https://www.npmjs.com/package/twitter
*/

function main(args) {

	return new Promise( (resolve, reject) =&gt; {

		let client = new Twitter({
			consumer_key:args.consumer_key,
			consumer_secret:args.consumer_secret,
			access_token_key:args.access_token_key,
			access_token_secret:args.access_token_secret
		});

		/*
		Special branching for images. Since images require a two step process, we split
		up the code into two paths.
		*/

		if(!args.image) {
			client.post('statuses/update', {% raw %}{status:args.status}{% endraw %}, function(err, tweet, response) {
				if(err) reject(err);
				resolve({% raw %}{result:tweet}{% endraw %});
			});
		} else {

			request.get({% raw %}{url:args.image, encoding:null}{% endraw %}, function(err, response, body) {
				if(!err &amp;&amp; response.statusCode === 200) {

					client.post('media/upload', {% raw %}{media: body}{% endraw %}, function(error, media, response) {

						if(error) {
							reject({% raw %}{error:error}{% endraw %});
						}
						
						var status = {
							status: args.status,
							media_ids: media.media_id_string 
						}

						client.post('statuses/update', status, function(error, tweet, response){
							if (!error) {
								resolve({% raw %}{result:tweet}{% endraw %});
							}
						});

					});
				}
			});
		}

	});

}

exports.main = main;
</code></pre>

Basically - if I detect you are including an image with a Tweet (just a URL for now), I handle that logic for you. All you need to do is send me your Tweet and the action handles it. Cool. 

And that was basically it. But how did I run it? First I made a new trigger with a CRON setting:

<code>wsk trigger create randomcomicbook_trigger --feed /whisk.system/alarms/alarm --param cron "0 */3 * * *"</code>

And then I simply made a rule that associated my trigger with a sequence that tied the 5 things above together. The OpenWhisk management system on Bluemix actually does a great job of visualizing all of this. I had to take three screen shots though so hopefully this looks ok:

![Screen shot](https://static.raymondcamden.com/images/2017/8/nodetoow1.jpg)
![Screen shot](https://static.raymondcamden.com/images/2017/8/nodetoow2.jpg)
![Screen shot](https://static.raymondcamden.com/images/2017/8/nodetoow3.jpg)

If we consider the Marvel and Twitter packages as separate concerns (one was mostly done, so that seems fair), then really the code was pretty simple. Basically setting up params, selecting and then transforming data. 

You can find all the code for this on my main Serverless Github repository: https://github.com/cfjedimaster/Serverless-Examples/tree/master/randomcomicbook

Wrap Up
---

So, what was the net result? First - I was able to kill a server running 24 hours a day. Did this save me a lot of money? Nope. Bluemix has a free tier for Node apps using this little memory. You can see prices yourself on the <a href="https://console.ng.bluemix.net/?direct=classic/&cm_mc_uid=16564867146514973661512&cm_mc_sid_50200000=1502115670&cm_mc_sid_52640000=1501601663#/pricing/cloudOEPaneId=pricing&paneId=pricingSheet">calculator</a>.

OpenWhisk also has a <a href="https://console.bluemix.net/openwhisk/learn/pricing">pricing calculator</a>. I set up my task to run 8 times a day so I'll say 250 times a month. It takes about 10 seconds to run, but I'll bump that to 15. I'm using less than 256 megs of RAM. At that level, I'm also on the free tier. 

But to me, the biggest benefit is the code. I'm using minimal "custom" code and I'm no longer worrying about an active server running. To be fair, I didn't worry too much about it on Bluemix, but it was unnecessary. 

If you have any questions, just let me know in the comments below!
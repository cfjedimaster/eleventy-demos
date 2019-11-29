---
layout: post
title: "Text Sentiment Analysis IoT Demo"
date: "2018-05-21"
categories: ["serverless"]
tags: ["webtask"]
banner_image: /images/banners/analysis.jpg
permalink: /2018/05/21/text-sentiment-analysis-iot-demo
---

I spent the last week at a company offsite in Panama (which is quite beautiful, although I spent most of my time in a hotel). During that time I participated in a hackathon using multiple IoT devices. One of them was this nice little LCD panel:

![LCD Panel](https://static.raymondcamden.com/images/2018/05/lcd1.jpg)

I've got no idea what this hardware is actually called (I mean what brand) and I was totally useless in terms of setting it up, but after my partners got it up and running and fired up a Node server on it, I built code that would sent data to it. For my part I decided to use Microsoft's [Text Analytics API](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/) and [Webtask](https://webtask.io/). The idea was to build a "sentiment analysis" of tweets concerning a keyword (in this case Auth0) and provide a report on the average. You could imagine this the display giving a real-time(ish) status of how things are going. In the screen shot above you can see that things are going well. Awesome! We also built support for a more neutral response:

![Neutral](https://static.raymondcamden.com/images/2018/05/lcd2a2.jpg)

And a "oh crap, we must have done something really bad" result:

![Oh crap](https://static.raymondcamden.com/images/2018/05/lcd3a2.jpg)

Again - I didn't do any of the cool hardware part, I just built the "get the data and send it part", but I thought it might be cool to share that code. About two weeks ago I wrote about doing something similar with Slack: [Adding Serverless Cognitive Analysis to Slack](https://goextend.io/blog/adding-serverless-cognitive-analysis-to-slack). This meant most of my work was done for me. Let's look at the webtask.

```js
/**
* @param context {WebtaskContext}
*/

const Twit = require('twit');
let T = null; 
const Pusher = require('pusher');
const rp = require('request-promise');

module.exports = async function(context, cb) {

  let pusher = new Pusher({
    appId: context.secrets.pusher_appId,
    key: context.secrets.pusher_key,
    secret: context.secrets.pusher_secret,
    encrypted: true, // optional, defaults to false
    cluster: 'us2', // optional, if `host` is present, it will override the `cluster` option.
  });

	T = new Twit({
		consumer_key:         context.secrets.consumer_key,
		consumer_secret:      context.secrets.consumer_secret,
		access_token:         context.secrets.access_token,
		access_token_secret:  context.secrets.access_token_secret,
		timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
	});

  let results = (await searchForAuth0()).map(t => {
    return t.text;
  });
  console.log('I have '+results.length+' results to process.');
  let analysis = await analyzeText(results, context.secrets.text_api);
  //go ahead and simplify it a bit...
  analysis = analysis.toFixed(2);
  let emotion = getEmotion(analysis);
  
  console.log(analysis,emotion);
  pusher.trigger('tinylcd', 'text', { text: ["Auth0 Sentiment",emotion+' ('+analysis+')'] } );
  
  cb(null, {result:analysis});
  
};

function getEmotion(x) {
  if(x < 0.3) return '{*}';
  if(x < 0.7) return '{-}';
  return '{+}';
}

async function searchForAuth0() {
	return new Promise((resolve, reject) => {

		let now = new Date();
		let datestr = now.getFullYear() + '-'+(now.getMonth()+1)+'-'+now.getDate();

		T.get('search/tweets', { q: 'auth0 since:'+datestr, count: 100 }, function(err, data, response) {
			resolve(data.statuses);
		})

	});
}

async function analyzeText(texts, key) {
  //return Promise.resolve(0.99);
  let documents = {'documents':[]};
  let counter = 1;
  texts.forEach(t => {
    documents.documents.push({id:counter, language:'en', text:t});
    counter++;
  });

  //todo: make url a secret
  const response = await rp({
    method:'post',
    url:'https://southcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
    headers:{
      'Ocp-Apim-Subscription-Key':key
    },
    body:JSON.stringify(documents)
  });
  
  try {
    let result = JSON.parse(response);
    let total = 0;
    result.documents.forEach(d => {
      total += d.score;
    });
    let avg = total/result.documents.length;
    console.log(result.documents.length,'total is '+total,'avg is '+avg);
    return Promise.resolve(avg)
  } catch(e) {
    return Promise.reject(e);
  }
  
}
```

Alright, let's break it down bit by bit.

I begin by initializing a [Pusher](https://pusher.com/) object. This was my first time using it and I had a bit of trouble getting things working at first. I'll blame myself and not Pusher as I was trying to work quickly. Pusher makes it easy (somewhat) to connect different clients and send messages back and forth. My code sends messages and the Node app running on the device would listen for it and then display it. 

I then setup my Twitter library. I had keys from a previous app I created so I just reused it. The Twitter search is nicely aggregated in this call:

```js
  let results = (await searchForAuth0()).map(t => {
    return t.text;
  });
```

I've only just begun using `async` and `await` and I probably barely understand it, but I freaking love it. `searchForAuth0` simply handles calling the Twitter search API for my particular keyword, `auth0`. 

Then - I ask for it to be analyzed:

```js
let analysis = await analyzeText(results, context.secrets.text_api);
```

This just calls off to the Text Analysis API. And here I need to point out a major issue with my implementation. You'll notice I treat each tweet as a separate doc. To me, that makes sense as putting all the tweets together into one string would imply one particular author. However - keep in mind that even though I'm batching the call to the API, Microsoft will still "charge" you for 100 calls. To be clear, that's totally fair! But at the free tier of 5000 calls per month, I ran though 3.5K calls in about 30 minutes of testing. You'll notice the commented out line there that I used to short circuit calls to the API. It's also how I tested the different "smiley faces." My coworker built support for that on the panel so I used that as a mean to test the different faces.

You can see that being setup in `getEmotion`, which translates the average score into one of three states represented by a string. My coworker looked for that string in the result and replaced it with the face. 

Finally it all comes down to:

```js
pusher.trigger('tinylcd', 'text', { text: ["Auth0 Sentiment",emotion+' ('+analysis+')'] } );
```

And that's it. I think it's pretty cool and I wish I understood the hardware aspect a bit more. I've setup my own RetroPie, but that was about three steps and didn't involve any real wiring. That being said, I hope the code above is helpful to folks!

<i>Header photo by <a href="https://unsplash.com/photos/HId6JGZ7urI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">rawpixel</a> on Unsplash</i>
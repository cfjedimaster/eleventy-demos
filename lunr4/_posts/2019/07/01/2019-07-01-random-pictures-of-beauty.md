---
layout: post
title: "Random Pictures of Beauty with Azure Functions and the NPS"
date: "2019-07-01"
categories: ["serverless","javascript"]
tags: ["azure"]
banner_image: /images/banners/park.jpg
permalink: /2019/07/01/random-pictures-of-beauty
description: 
---

I'm a sucker for randomness, especially when it leads to something interesting or a new discovery. For example, the Twitter account [OnePerfectShot](https://twitter.com/OnePerfectShot) shares stills from movies throughout all of cinematic history.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">BATMAN (1989)<br><br>Cinematography by Roger Pratt<br>Directed by Tim Burton<br>Here&#39;s a list of weird facts about this movie: <a href="https://t.co/xA3EHdSC5r">https://t.co/xA3EHdSC5r</a> <a href="https://t.co/tAjzRHBlLK">pic.twitter.com/tAjzRHBlLK</a></p>&mdash; One Perfect Shot (@OnePerfectShot) <a href="https://twitter.com/OnePerfectShot/status/1145735849138708480?ref_src=twsrc%5Etfw">July 1, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Another example is [Dragon Hoards](https://twitter.com/dragonhoards). This is a bot that posts random microstories. It doesn't always work, but when it does, damn is it fascinating.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">A yellow dragon lives on the shore of an ocean. She inventories her hoard, which consists of a good amount of moons, boxes full of unicorn hair, and way too many pies. She is paranoid.</p>&mdash; Dragon Hoards (@dragonhoards) <a href="https://twitter.com/dragonhoards/status/1145582902463389698?ref_src=twsrc%5Etfw">July 1, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

And then finally, one of my own creation is [RandomComicBook](https://twitter.com/randomcomicbook). I [blogged](https://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers) about this over three years ago and is still one of my favorite things I've created. Here's an example:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;The Amazing Spider-Man (1963) #12&quot; published May 1964<a href="https://t.co/18BRdt7UkS">https://t.co/18BRdt7UkS</a> <a href="https://t.co/gkJ0d4ygZH">pic.twitter.com/gkJ0d4ygZH</a></p>&mdash; Random Comic Book (@randomcomicbook) <a href="https://twitter.com/randomcomicbook/status/1145663388867059713?ref_src=twsrc%5Etfw">July 1, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

So with that in mind, last week I had an inspiration. I discovered that the National Parks System has an [API](https://www.nps.gov/subjects/digital/nps-data-api.htm). A whole set of APIs actually but one in particular stood out, the Parks API. According to the docs, this provides:

<blockquote>
Park basics data includes location, contact, operating hours, and entrance fee/pass information for each national park At least five photos of each park are also available.
</blockquote>

Specifically the fact that it provides photos for each park. I thought it would be kind of neat to create a bot that picked a random park and a random photo and shared it via Twitter. My logic ended up pretty simple:

1) The API lets you search by state, or states, so step one is simply picking a random state.
2) The API lets you get a list of parks with a limit, but in my testing even California had less than 50, so I figured just asking for 100 should cover my basis.
3) From that list, filter to those with images. Yes the docs said they all do, but I figured it couldn't hurt.
4) Pick one from that list and select a random image.
5) Tweet.

And that's it. I decided on [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) as I still feel like I need to dig a lot more into it. [Netlify](https://netlify.com) does serverless too, but as I didn't plan on having *any* HTML content for this project, I figured it wasn't a good fit. I used [Visual Studio Code extension](https://code.visualstudio.com/tutorials/functions-extension/getting-started) which worked perfectly fine except for a few hiccups that were (mostly) my fault. Finally, I also tied my deployment to a GitHub repo. This is [documented well](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment) except for one small bug that took me a while to fix. And by "took me a while" I mean begging [Burke Holland](https://twitter.com/burkeholland) for help until he caved in and found my issue. (It's a critical detail missing from the doc. I filed an issue for it so it may be fixed by now. If not, you can see my comment at the bottom with the correction.)

The function is all of about 120 lines. I'll share it first than go over the bits.

```js
const fetch = require('node-fetch');
const Twit = require('twit')

const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

const states = {
    "AL": "Alabama",
    "AK": "Alaska",
// deleted a bunch
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

const NPS_KEY = process.env.NPS_KEY;

// Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

module.exports = async function (context, req) {

    let stateAbbrs = Object.keys(states);
    let chosenState = stateAbbrs[getRandomIntInclusive(0, stateAbbrs.length)];

    context.log(`I chose ${chosenState}`);

    let httpResult = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${chosenState}&limit=100&fields=images&api_key=${NPS_KEY}`);
    let results = await httpResult.json();
    data = results.data.filter(r => r.images.length);

    // now select a random park
    let selectedPark = data[getRandomIntInclusive(0, data.length - 1)];
    // now select a random image
    let selectedImage = selectedPark.images[getRandomIntInclusive(0, selectedPark.images.length - 1)];

    context.log(JSON.stringify(selectedPark));

    let imageRequest = await fetch(selectedImage.url, { headers: { 'user-agent': 'Chrome' } });
    let image = await imageRequest.buffer();
    image = image.toString('base64');

    let mediaResult = await new Promise((resolve, reject) => {

        T.post('media/upload', { media_data: image }, (err, data, response) => {
            if(err) {
                console.log(err);
                reject(err);
            }
            resolve(data.media_id_string);
        });

    });
    
    context.log('mediaResult', mediaResult);
    let text = `Picture from ${selectedPark.fullName}. More information at ${selectedPark.url}`;

    let params = { status: text, media_ids: [mediaResult] }

    let tweetResult = await new Promise((resolve, reject) => {
        T.post('statuses/update', params, function (err, data, response) {
            resolve(data);
        })
    });

    context.res = {
        body: `Tweet ID: ${tweetResult.id}`
    };
    context.done();

};
```

Alright, so what's going on? The first real bits involve me loading the [Twit](https://www.npmjs.com/package/twit) library, my preferred way of working with the Twitter API. Skipped over the 50 states in JSON (I should convert that to one long line), the main function starts off by selecting the state. My data includes the abbreviation and full name because I thought I might end up using both, but that didn't pan out. I could optimize that later. 

I then hit the API with my state, filter the results to those with images, and select one by random. With that park, I then select my image. Posting media to Twitter requires you to upload it first which is a bit of a hassle, but async/await makes everything a bit nicer. Twit uses a callback style API so I wrap it in a promise so I can await it. Once I have my media uploaded I can then reference it in a tweet. The text I use is a bit minimal and could be improved a bit I think. I'm open to any suggestions. And that's it. You can see the results at <https://twitter.com/npsbot>. Here's a few examples.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Picture from Augusta Canal National Heritage Area. More information at <a href="https://t.co/8jO0mzgyBT">https://t.co/8jO0mzgyBT</a> <a href="https://t.co/AJiEee2gvc">pic.twitter.com/AJiEee2gvc</a></p>&mdash; npsbot (@npsbot) <a href="https://twitter.com/npsbot/status/1145753982054219776?ref_src=twsrc%5Etfw">July 1, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Picture from Weir Farm National Historic Site. More information at <a href="https://t.co/GI1GilXcO3">https://t.co/GI1GilXcO3</a> <a href="https://t.co/PlmQfsiNsO">pic.twitter.com/PlmQfsiNsO</a></p>&mdash; npsbot (@npsbot) <a href="https://twitter.com/npsbot/status/1145482203503054849?ref_src=twsrc%5Etfw">July 1, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If you want, you can view the entire code base here: <https://github.com/cfjedimaster/npsbot>. I will keep the bot running for as long as Azure doesn't charge me. :)

Edit - one quick note I forgot to mention. The last thing I had to do was switch the function from a HTTP driven one to a scheduled one. I thought that would be simple. The file, `function.json`, determines the types of connections your functions can use (along with other settings), but the docs for scheduled tasks always showed a subset of the function.json file, not the whole thing. My first attempt to add the right values broke the function because I discovered you can't have a HTTP driven function *and* one that uses a schedule. That seems silly, but you can work around it by adding a second function that just calls the first. Since I only needed HTTP support for testing, I just removed it. My `function.json` is in the GitHub repo so if you are curious, you can take a look.

<i>Header photo by <a href="https://unsplash.com/@divewithchuck?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Charles Black</a> on Unsplash</i>
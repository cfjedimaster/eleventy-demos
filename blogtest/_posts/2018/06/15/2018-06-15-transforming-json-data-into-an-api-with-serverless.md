---
layout: post
title: "Transforming JSON Data into an API with Serverless"
date: "2018-06-15"
categories: ["serverless"]
tags: ["webtask"]
banner_image: /images/banners/transform.jpg
permalink: /2018/06/15/transforming-json-data-into-an-api-with-serverless
---

This is something that has been sitting in my "To Write" Trello board for a while now and today I finally got around to building a demo. One of my favorite things to do with serverless is to build API wrappers. There are thousands of APIs out there, but many times you need to manipulate or change the data to make it more appropriate for your use. While you can do that on the client, it can be much more efficient to do so on the server. Of course, who wants to setup a server just to change an API when you can use a serverless function instead? Some examples of this are:

* Transformation: A few months back I used an API that was XML only. I used a severless function to transform it into JSON since this isn't 1995.
* Reduction: A while ago I made use of a music API that returned a lot of information. However, I only needed one small part of it. By building a serverless proxy that reduced the data returned, my client, a mobile app, received much less data and therefore was quicker for the end user.
* Combination: If one API doesn't cover what you need, two or more may, and you can use a serverless function to grab and combine those APIs. A good example of this is getting shipping information from multiple providers.
* Proxy: And finally - just having your own end point means you can do things like server-side caching or even wholesale replacement of the 'real' API at any time in the future.

For my demo today, I'm doing something interesting I think. Sometimes an API isn't really an API, but just a data dump. It may update every now and then, but it doesn't support arguments. It's simply a URL that returns JSON. I thought it would be cool to show how you can build your own API in front of that JSON dump. I'll be using [Webtask.io](https://webtask.io/) but obviously any serverless provider will do.

For my data, I'm using a JSON packet of Pokemon data here: https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json. I found this dataset via jdorfman's [awesome-json-datasets](https://github.com/jdorfman/awesome-json-datasets) repo. The JSON data contains 151 different Pokemon. I have no idea how accurate that is. I've got kids who do but they aren't around me and I don't care enough to Google for it. ;) 

For the first draft of my function, I simply returned the data. I also used a cache. As you know (or may know!), serverless is stateless. However, most serverless providers will keep your function "warm" (think active) for a short duration. That means repeated calls within a certain timeframe can make use of locally cached values for quicker results.

```js
const JSON_URL = 'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json';

let rp = require('request-promise');
let cached;

module.exports = async (context, cb) => {
  
  let data = await getData();  
  
  cb(null, { data });
};

async function getData() {
  if(cached) {
    console.log('using cache');
    return cached;
  }
  else {
    return new Promise((resolve, reject) => {
      rp(JSON_URL)
      .then(res => {
        cached = JSON.parse(res).pokemon;
        resolve(cached);
      });
      
    });
  }
}
```

That's a fairly simple function. Basically return a cache or hit a URL and return that. No transformation, manipulation, or anything else. Again though I have some immediate benefits. If the server hosting the data is a bit slow, my cache can help with that. If the URL ever goes away, or if they decide to start charging for the data, I can potentially switch to another provider and my client's will never know. (And if the data changed, then I can change it back!)

Alright - now let's add some filtering!

```js
const JSON_URL = 'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json';

let rp = require('request-promise');
let cached;


module.exports = async (context, cb) => {
  
  let data = await getData();  

  // support filter by name
  if(context.query.name) {
    console.log('filter to name '+context.query.name);
    let sname = context.query.name.toLowerCase();
    data = data.filter(p => {
      let lname = p.name.toLowerCase();
      return lname.indexOf(sname) >= 0;
    });
  }
  
  // support filter by type
  if(context.query.type) {
    let type = context.query.type.toLowerCase();
    console.log('filtering to type '+type);
    data = data.filter(p => {
      //rewrite types to lowercase 
      let types = p.type.join(',').toLowerCase().split(',');
      return types.indexOf(type) >= 0;
    });
  }
  
  cb(null, { data });
};

async function getData() {
  if(cached) {
    console.log('using cache');
    return cached;
  }
  else {
    return new Promise((resolve, reject) => {
      rp(JSON_URL)
      .then(res => {
        cached = JSON.parse(res).pokemon;
        resolve(cached);
      });
      
    });
  }
}
```

I've added 2 possible filters here using the query string. (This is done via the [Context](https://webtask.io/docs/context) object that all Webtasks have access to.) In both cases, I just do simple array based filtering. The only real "work" here is to lowercase stuff so you don't have to worry about matching the same case. My core API may be found here:

[https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi](https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi)

And you can search by name, or type, or both. For example:

[https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi?name=Ba](https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi?name=Ba)

Or:

[https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi?type=ghost](https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi?type=ghost)

Or:

[https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi?type=fire&name=ca](https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/eoApi?type=fire&name=ca)

That's it. Let me know if you have any questions by leaving me a comment below.

<i>Header photo by <a href="https://unsplash.com/photos/vuMTQj6aQQ0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Samule Sun</a> on Unsplash</i>
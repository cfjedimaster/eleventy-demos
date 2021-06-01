---
layout: post
title: "Using Geolocation with Vue.js"
date: "2019-09-01"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/map2.jpg
permalink: /2019/09/01/using-geolocation-with-vuejs
description: 
---

I decided to spend my lazy Sunday morning working on a quick Vue.js post. [Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) is one of the older and simpler APIs you can use with your web browser so this article won't necessarily be that exciting, but I thought a quick demo of the API with Vue, and a few variations, could be useful to folks. As a reminder, web pages that use Geolocation <strong>must</strong> be run on either localhost or an https server. This is a security precaution and... let's be honest - there is <strong>zero</strong> reason to be using a non-secure server in 2019.

## Example One

For the first example, let's build a simple Vue application that will:

* Automatically try to get your location
* Display a "loading" type message while this is happening
* And properly support error conditions.

First we'll build the front end:

```html
<div id="app" v-cloak>
  
  <div v-if="errorStr">
    Sorry, but the following error
    occurred: {% raw %}{{errorStr}}{% endraw %}
  </div>
  
  <div v-if="gettingLocation">
    <i>Getting your location...</i>
  </div>
  
  <div v-if="location">
    Your location data is {% raw %}{{ location.coords.latitude }}{% endraw %}, {% raw %}{{ location.coords.longitude}}{% endraw %}
  </div>
  
</div>
```

I've got three divs here. The first handles displaying an error. The second is the loading message. And the final div displays our location. Now let's look at the code.

```js
const app = new Vue({
  el:'#app',
  data:{
    location:null,
    gettingLocation: false,
    errorStr:null
  },
  created() {
    //do we support geolocation
    if(!("geolocation" in navigator)) {
      this.errorStr = 'Geolocation is not available.';
      return;
    }

    this.gettingLocation = true;
    // get position
    navigator.geolocation.getCurrentPosition(pos => {
      this.gettingLocation = false;
      this.location = pos;
    }, err => {
      this.gettingLocation = false;
      this.errorStr = err.message;
    })
  }
})
```

I'm using the `created` method to start requesting location as soon as the application is ready. I do a quick check to see if the API is supported. After that, I simply use the API. It's all rather simple, but even this code could be improved. You'll notice that my front end is addressing the result as `location.coords.latitude`. If I know for a fact that I only need latitude and longitude, I could copy those values out. My front end code could then look something like this: 

```html
Your location data is {% raw %}{{ latitude }}{% endraw %}, {% raw %}{{ longitude}}{% endraw %}
```

That's a bit better in my opinion as the layout code is simpler and not directly tied to knowing that the Geolocation API was used. You can play with this example here:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="ZEzJwZN" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Geolocation 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/ZEzJwZN/">
  Geolocation 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Example Two

In my next example, I'm going to switch the code so that it doesn't request your location until the user actually needs it. In this case I'm going to use a simple button to kick off that process. Here's the HTML:

```html
<div id="app" v-cloak>

  <p>
    Let us locate you for better results...
    <button @click="locateMe">Get location</button>
  </p>
  
  <div v-if="errorStr">
    Sorry, but the following error
    occurred: {% raw %}{{errorStr}}{% endraw %}
  </div>
  
  <div v-if="gettingLocation">
    <i>Getting your location...</i>
  </div>
  
  <div v-if="location">
    Your location data is {% raw %}{{ location.coords.latitude }}{% endraw %}, {% raw %}{{ location.coords.longitude}}{% endraw %}
  </div>
  
</div>
```

Most of the layout above is the same with the exception of the paragraph and button on top. For the code, I decided to abstract things a bit. The `locateMe` method referenced by the button will be simpler as I've migrated out the Geolocation stuff. Let's take a look.

```js
const app = new Vue({
  el:'#app',
  data:{
    location:null,
    gettingLocation: false,
    errorStr:null
  },
  methods: {
    async getLocation() {
      
      return new Promise((resolve, reject) => {

        if(!("geolocation" in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos);
        }, err => {
          reject(err);
        });

      });
    },
    async locateMe() {

      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
      } catch(e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
      
    }
  }
})
```

If you focus on `locateMe`, you can see it is much simpler. I use `async` and `await` to call `getLocation`. My method handles things like the loading screen and errors, and the result, but the actual mechanism of the location request is now abstracted away. `getLocation` makes use of a Promise to properly work with `async` and `await`, but outside of that it's mostly the same as before.

You can test this version here:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="jONLdgQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Geolocation 2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/jONLdgQ/">
  Geolocation 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Option Three

For one last example, let's do something fun with the location. Most people can't translate a longitude and latitude into something useful. It would be cooler if we could use reverse geocoding (which is the process of attempting to map a latitude/longitude to a place with a name) to display the user's location in a friendlier name. For this example I'm going to be making use of the [Geocoding API](https://developer.here.com/signup/geocoding) by HERE. Disclaimer - I started working for HERE last week so I'm talking about my employers products. This API (and many more) have a free tier so you can play with them all you want!

The API is rather extensive (you can see the docs [here](https://developer.here.com/documentation/maps/topics/geocoding.html)) but I'll focus on the simplest example. To begin, I created a new JavaScript project in my HERE account. This gave me an API key I could then use in my code. I added two HERE JavaScript libraries and then this bit of initialization code:

```js
const platform = new H.service.Platform({
  'apikey': 'iEnZe8bO68AnNVZEdPpq7hl9UFqiPxTSPjQkLfR3Qcg'
});
const geocoder = platform.getGeocodingService();
```

Note that you can specify a domain whitelist for your API keys which will make the code above perfectly safe for your public web pages. Once you've configured your geocoder, to do a reverse geocode you can simply do this (pseudo-code):

```js
let reverseGeocodingParameters = {
    prox: 'Latiude,Longitude', // not literaly that, but the real values
    mode: 'retrieveAddresses',
    maxresults: 1
};

geocoder.reverseGeocode(
    reverseGeocodingParameters,
    res => {
        // work with results
    },
    e => reject(e) 
);
```

Here's the updated JavaScript for `getLocation`:

```js
async getLocation() {
    
    return new Promise((resolve, reject) => {

    if(!("geolocation" in navigator)) {
        reject(new Error('Geolocation is not available.'));
    }

    navigator.geolocation.getCurrentPosition(pos => {
        let reverseGeocodingParameters = {
            prox: `${pos.coords.latitude},${pos.coords.longitude}`,
            mode: 'retrieveAddresses',
            maxresults: 1
        };

        geocoder.reverseGeocode(
        reverseGeocodingParameters,
        res => {
            let results = res.Response.View;
            if(results.length === 0) {
                resolve('No match.')
            } else {
                resolve(results[0].Result[0].Location);
            }
        },
        e => reject(e) 
        );
    }, err => {
        reject(err);
    });

    });
},
```

For the most part this is just a simple update to the previous example, but do note that when I leave the function, I "dig down" into the Geocoder result to simplify things a bit: `resolve(results[0].Result[0].Location);`


The HTML now uses this:

```html
<div v-if="location">
    Your location data is {% raw %}{{ location.Address.Label }}{% endraw %}
</div>
```

If you remember what I said about Option One, I kind of don't like my HTML having too much knowledge about the data so a nicer solution would probably just store `Address.Label` to `location`. You can run this here:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="wvwqOMx" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Geolocation 3">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/wvwqOMx/">
  Geolocation 3</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

As always, let me know what you think and ask any questions in the comments below. There's also multiple options for Vue components to simply Geolocation for you. One is [vue-browser-geolocation](https://www.npmjs.com/package/vue-browser-geolocation).

<i>Header photo by <a href="https://unsplash.com/@paulamayphotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Paula May</a> on Unsplash</i>
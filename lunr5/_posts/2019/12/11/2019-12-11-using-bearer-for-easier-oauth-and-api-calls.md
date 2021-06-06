---
layout: post
title: "Using Bearer for Easier OAuth and API Calls"
date: "2019-12-11"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/pictures_eggs.jpg
permalink: /2019/12/11/using-bearer-for-easier-oauth-and-api-calls
description: 
---

For the past few days I've been playing with a new service that I'm *really* excited about, [Bearer](https://www.bearer.sh/). At a high level, Bearer gives you a proxy to other APIs to provide monitoring, logging, incident reporting, and more. At a lower level, there's one aspect of Bearer (and again, this blog entry is on *one* aspect of Bearer) that really got my attention.

Working with OAuth isn't *terribly* difficult, especially if you can use a library like [Passport](http://www.passportjs.org/) to simplify it a bit. I first blogged about [my experiences](https://www.raymondcamden.com/2016/06/23/some-quick-tips-for-passport) with Passport back in 2016. Things get more interesting when you then work with APIs that require OAuth first, as you typically (or at least in my experience) have to follow up the initial OAuth flow with a call to get a "bearer token" and *then* call your API.

Again, not *terribly* difficult, but not exactly fun either. It's also something you can't do 100% client-side. ([Auth0](https://auth0.com) helps here, I'll talk about it a bit more at the end.) With serverless functions it's possible to have a "mostly" client-side JAMStack type site but what if you could skip that entirely? 

Bearer will give you the ability to login with OAuth flow and handle the process of getting bearer tokens for you. Finally, it lets you use it's JavaScript library to make calls to remote API, CORS or not, by proxying via it's network. It took me a few tries to get it working correctly, but once I did, I was incredibly impressed. As an example, I'd like to share a demo I built.

Back in 2016, I create a Node.js demo that retrieved images from a Twitter account: [Getting Images from a Twitter Account](https://www.raymondcamden.com/2016/03/25/getting-images-from-a-twitter-account) I built this because I follow (and have created) a number of Twitter accounts that only (or mostly) post pictures. My tool would let you specify an account, fetch the pictures, and just display them in one big wall of media.

<img src="https://static.raymondcamden.com/images/2016/03/t3.jpg" alt="Screenshot from older demo" class="imgborder imgcenter">

If you look at the [repo](https://github.com/cfjedimaster/TwitterSuckImage) for that demo, you can see a lot of code involved in the OAth flow and then handling the API calls to Twitter. Again, not terrible, but "work". I don't like work. So what was this like in Bearer?

The first thing I did was sign up at Bearer of course. Then I registered a new Twitter API.

<img src="https://static.raymondcamden.com/images/2019/12/b1.png" alt="Screenshot of the dashboard" class="imgborder imgcenter">

This involved me making an app on Twitter's developer portal first and then providing those credentials to Bearer. Once registered, if you intend to use their API, you must go into Settings, scroll down to Security, and toggle Client-Side API Calls.

<img src="https://static.raymondcamden.com/images/2019/12/b2.png" alt="Security setting" class="imgborder imgcenter">

Don't forget this. I did. 

Once enabled, it's time for the code. At a basic level, it comes down to doing the auth first, which can look like this:

```js
this.client = bearer('pk_development_e38bd15803c95f9c09e64a0da804e181299dc477dd05751651')

this.client.connect("twitter")
.then(data => {
	this.authId = data.authId;
})
.catch(console.error);
```	

The resulting `authId` value is then used in later API calls:

```js
this.client.integration('twitter')
.auth(this.authId)
.get('users/show.json?screen_name=raymondcamden')
.then(({ data }) => { this.settings = data; })
.catch(err => { console.log('Error: ', err) })
```

Note I only use the ending portion of the URL for Twitter API calls. Bearer knows how to handle it. And that's basically it. With that in mind, I rebuilt my previous demo using Vue.js. I didn't built it exactly the same as the previous one. I didn't add the "lightbox" effect for example. But I got everything done in one simple(ish) component. First - the template:

```html
<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title>Twitter Image Search</v-toolbar-title>
    </v-app-bar>

    <v-content class="ma-5">

      <p>
      This tool provides an "image only" view of a Twitter account. Simply enter the username of an account 
      and you'll see the most recent pictures they've embedded into their Tweets. You can click an individual
      image for a close up view.          
      </p>

      <div v-if="!authId">
        <v-btn @click="login">Authenticate with Twitter</v-btn>
      </div>
      <div v-else>
        
          <v-row>
            <v-col cols="12" sm="3">
              <v-text-field v-model="user" required label="Username"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn @click="getImages">Get Images</v-btn>
            </v-col>
          </v-row>

        <div v-if="loading">
          <p>
            <i>Loading...</i>
          </p>
        </div>

        <v-container fluid v-if="images">
          <v-row>
            <v-col class="d-flex child-flex" cols="3" v-for="(img,idx) in images" :key="idx" >
              <v-img :src="img" max-width="350" max-height="500" />
            </v-col>
          </v-row>
        </v-container>

      </div>

    </v-content>
  </v-app>
</template>
```

I'm using [Vuetify](https://vuetifyjs.com/en/) for the UI layout. Initially the button prompting for login is displayed, and after you've authenticated, I then show a form where you can enter a username and ask for their images. I defaulted to [oneperfectshot](twitter.com/oneperfectshot) as it's a damn cool account. Here's how it renders.

<img src="https://static.raymondcamden.com/images/2019/12/b3b.jpg" alt="Screenshot of demo" class="imgborder imgcenter">

Now for the JavaScript:

```js
import bearer from '@bearer/js';

const BEARER_KEY = 'pk_development_e38bd15803c95f9c09e64a0da804e181299dc477dd05751651';

export default {
  name: 'App',
  data: () => ({
      authId: null,
      client: null,
      images: [],
      user: 'oneperfectshot',
      loading: false
  }),
  mounted() {
    this.client = bearer(BEARER_KEY);
  },
  methods: {
    login() {
      this.client
        .connect("twitter")
        .then(data => {
          this.authId = data.authId;
        })
        .catch(console.error);
    },
    getImages() {
      this.images = [];
      this.loading = true;
      let account = this.user;
      console.log(`loading images for ${account} and my auth is ${this.authId}`);
      this.client
        .integration("twitter")
        .auth(this.authId)
        .get(
          `search/tweets.json?q=from%3A${account}+filter%3Amedia&count=100&tweet_mode=extended`
        )
        .then(({ data }) => {
          this.loading = false;
          console.log(`Got ${data.statuses.length} tweets`);
          // in theory not needed since we asked for stuff with media
          let filtered = data.statuses.filter(t => {
            return (
              t.entities && t.entities.media && t.entities.media.length > 0
            );
          });
          console.log(`Filtered to ${filtered.length} tweets with media`);
          filtered.forEach(t => {
            t.entities.media.forEach(m => {
              this.images.push(m.media_url_https);
            });
          });
        })
        .catch(err => {
          console.log("Error: ", err);
        });
    }
  }

};
```

Outside of the Vue stuff, this is mostly a repeat of what I showed before. One call to auth and one call to the API. In this case, I'm using Twitter's API to search for tweets from a user, that have media, and then filtering out to get the image URLs. 

Want to try it out yourself? I'm hosting it here: <https://twitter-image-search.raymondcamden.now.sh/> You can find the source code here: <https://github.com/cfjedimaster/vue-demos/tree/master/twitter-image-search>

And that's basically it. As I said, Bearer does more. As one more small example, here are the included logs for my demo.

<img src="https://static.raymondcamden.com/images/2019/12/b4.jpg" alt="Logs" class="imgborder imgcenter">

I also like the simpler stats on the dashboard:

<img src="https://static.raymondcamden.com/images/2019/12/b6.jpg" alt="Dashboard" class="imgborder imgcenter">

As I said, I'm really impressed by their service and how easy it was to get going with an entirely client-side application. Earlier I mentioned Auth0. Auth0 obviously does login really simple. What it doesn't do simply is the bearer token stuff. It is definitely possible and my buddy [Bobby Johnson](https://iamnotmyself.com/) showed me an example. I couldn't get it working, but I trust his worked and that it was my issue. But honestly, I was really surprised Auth0 didn't make this as simple as Bearer did. All in all, Bearer just feels easier to use. (I should add that while I worked at Auth0, I never worked with their main identity product. My experience there was with their serverless platform.) 

Anyway - I'd love to hear from anyone who may be using Bearer. Please leave me a comment below and tell me what you think.

<i>Header photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Annie Spratt</a> on Unsplash</i>
---
layout: post
title: "A National Parks Service API Demo with Vue.js"
date: "2019-09-09"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/forest.jpg
permalink: /2019/09/09/a-national-parks-service-api-demo-with-vuejs
description: A Vue.js wrapper for the National Parks Service API
---

This weekend I was on the road and had some time to build (yet another) application with Vue.js. I don't think this one necessarily does anything terribly cool. At minimum it was more "exercise" for my Vue muscles and provides another demo I can share with folks. As always though, if you have any suggestions or feedback in general, just let me know. If posts like these *aren't* helpful, also free free to share!

Let me start by giving a high level overview of what I built. I'll start with a few screen shots. The initial page shows a list of all fifty states.

<img src="https://static.raymondcamden.com/images/2019/09/nps1.png" alt="List of 50 States" class="imgborder imgcenter">

Selecting a state will then make a call out to the [National Park Systems API](https://www.nps.gov/subjects/digital/nps-data-api.htm) to ask for all the parks within that state. I then render them out:

<img src="https://static.raymondcamden.com/images/2019/09/nps2.png" alt="List of parks" class="imgborder imgcenter">

Behind the scenes I'm using the following technologies:

* [Vue.js](https://vuejs.org/) of course. :)
* [Vue Router](https://router.vuejs.org/)
* [Vuex](https://vuex.vuejs.org/) to handle calling my API and caching (this is somewhat interesting I think).
* [Vuetify](https://vuetifyjs.com/en/) for the UI.
* [Zeit](https://zeit.co/) for my serverless function.

Before I dig into the code more, you can find the complete repository here: <https://github.com/cfjedimaster/vue-demos/tree/master/nps_gallery>. You can run the demo here: <https://npsgallery.raymondcamden.now.sh/> 

Alright, so I'm not going to share anything about the first view of this page. I've got a hard coded list of the 50 states (and abbreviations) I store in my Vuex store and I simply fetch them to render. The only part that was interesting here is that I discovered the `<router-link>` will correctly handle URL encoding values:

```html
<v-btn color="teal" width="100%" :to="`/state/${state}/${abbr}`">
{% raw %}{{state}}{% endraw %}
</v-btn>
```

In the link above, note that I can safely use the `state` value without worry. I should have expected this, but I was happy to see it worked well. 

It's the state view where things get interesting. First, the main view component, which is pretty simple since my complexity lies elsewhere.

```html
<template>

  <v-container>
      <h3>National Parks for {% raw %}{{state}}{% endraw %}</h3>

      <i v-if="loading">Please stand by - loading data.</i>

      <v-row>
        <v-col cols="4" v-for="(park,idx) in parks" :key="idx">
          <Park :park="park" />
        </v-col>
      </v-row>
  </v-container>

</template>

<script>
import Park from '../components/Park';

export default {
  components: { Park },
  data() {
    return {
      state:'',
      abbr:''
    }
  },
  computed: {
    loading() {
      return !this.parks.length;
    },
    parks() {
      return this.$store.state.selectedParks;
    }
  },
  async created() {
    // clear selecion
    this.$store.commit('clearSelection');

    this.state = this.$route.params.state;
    this.abbr = this.$route.params.abbr;
    this.$store.dispatch('loadParks', this.abbr);
  }
}
</script>
```

You can see I'm rendering values by binding to a `parks` variable that comes from my store. You'll notice I'm calling two things in my `created` related to the store. I first call `clearSelection` and then `loadParks`. `clearSelection` removes any previously loaded parks from the view and `loadParks` obviously fires off the request to load parks. Let's look at the store now because here is where things get a bit deep.

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import api from './api/nps';

export default new Vuex.Store({
  state: {
    states:{
      "AL": "Alabama",
	  // stuff removed here
      "WY": "Wyoming"
    }, 
    parks:{

    },
    selectedParks:[]
  },
  mutations: {
    cache(state, args) {
      console.log('storing cache for '+args.abbr+ ' and '+args.parks.length + ' parks');
      state.parks[args.abbr] = args.parks;
    },
    clearSelection(state) {
      state.selectedParks = [];
    },
    select(state, parks) {
      state.selectedParks = parks
    }
  },
  actions: {
    async loadParks(context, abbr) {
      // check the cache
      if(context.state.parks[abbr]) {
        console.log('woot a cache exists');
        context.commit('select', context.state.parks[abbr]);
      } else {
        console.log('no cache, sad face');
        let results = await api.getParks(abbr);
        context.commit('cache', {abbr:abbr, parks:results});
        context.commit('select', context.state.parks[abbr]);
      }
    }
  }
})
```

So the biggest thing I want to point here is that I'm using the store to wrap calls to my API and as a simple cache. Anytime you ask for parks for state X, I first see if it's cached and if so - return it immediately. Otherwise I make a call out to the API. It's a pretty simple system but I love how it came out, and performance wise it works really. 

The API part is actually two fold. You can see I load in `'./api/nps'`, which is yet another wrapper:

```js
const NPS_API = '/api/npswrapper';


export default {

    async getParks(state) {
        return new Promise(async (resolve, reject) =>{
          let results = await fetch(NPS_API+`?state=${state}`);
          let parks = await results.json();
          /*
            API returns park.images[], we want to change this to park.image to simplify it
          */
          let parkData = parks.data.map(p => {
            if(p.images && p.images.length > 0) {
                p.image = p.images[0].url;
            }
            return p;
          });
          resolve(parkData);  
        });
    }

}
```

All this does is call my serverless function. The NPS API doesn't support CORS so I need that to handle that aspect. I also do a bit of filtering to ensure we get images back. (Although this doesn't seem to work perfectly - I think some parks have images that 404.) The final bit is the serverless function:

```js
const fetch = require('node-fetch');

const NPS_KEY = process.env.NPS_KEY;

module.exports = async (req, res) => {

    let state = req.query.state;
    let httpResult = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${state}&limit=100&fields=images&api_key=${NPS_KEY}`);
    let results = await httpResult.json();
    res.json(results);

};
```

If you want to know more about serverless and Zeit, check out the [article](https://www.raymondcamden.com/2019/09/06/a-look-at-zeits-zero-config-and-serverless-platform) I wrote a few days on it. 

Anyway, that's it! As I always say, I'd love some feedback, so leave me a comment below.

<i>Header photo by <a href="https://unsplash.com/@sebastian_unrau?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sebastian Unrau</a> on Unsplash</i>
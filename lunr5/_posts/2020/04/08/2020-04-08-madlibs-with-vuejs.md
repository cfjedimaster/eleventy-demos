---
layout: post
title: "MadLibs with Vue.js"
date: "2020-04-08"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/hello.jpg
permalink: /2020/04/08/madlibs-with-vuejs
description: A look at building a MadLibs game with Vue.js
---

It's been a while since I built a game with Vue.js so I figured it was time to take a stab at creating another one. This time I've built an implementation of MadLibs. If you've never heard of this game it's pretty simple. You begin by asking a reader to enter various parts of speech, like a noun, verb, and so forth. You then put their input into a story for (typically) a funny result.

In researching options for this demo I found a few cool utilities. The first was the [Madlibz API](https://madlibz.herokuapp.com/api), an API that returns a random MadLib. I thought this was neat, but the content was pretty slim and I kinda wanted my final solution to be offline capable. 

Another really cool resource was the [Libberfy Mad Libs API](https://github.com/SamSamskies/libberfy). This one lets you pass text in and it spits out a MaLib version. You should check out his [demo](http://samsamskies.github.io/libberfy-demo/) to see it in action. I didn't use this myself as my goal was to have pre-built MadLibs. 

In the end I decided on a simpler approach. I'd have a data file that could be cached offline. I also wanted a data file that was easy to work with. Whenever it comes to stuff like this I always think JSON first, but for this application a text file made more sense. My format was rather simple. Use plain text for your MadLib and use single brackets around things you want to replace. Each MadLib is separated with a --- character. So here's a sample of how it could look:

```html
## My Birthday

Today is {name}'s birthday. They want a {noun} for their birthday so they can {verb} with it. 
Be sure it comes from {foreign country} and it costs at least {number} dollars.

---

## Another One

My name is {proper noun}.

```

Notice the `## My Birthday` part? I allow for Markdown in the MadLib as well. The idea was that a non-technical person could easily edit the file to add content. Shoot, I'm technical and I find this much easier than JSON as well. 

The actual application breaks down into three parts. First, a simple title screen:

<img data-src="https://static.raymondcamden.com/images/2020/04/ml1.png" alt="Title screen" class="lazyload imgborder imgcenter">

I employed *all* of my incredible design skills there as you can see. I won't share the code for this part as it's just what you see.

The next route handles prompting for the parts of the MadLib. I show one prompt at a time. A user on Twitter suggested asking a progress bar here and I agree that it would be a good change.

<img data-src="https://static.raymondcamden.com/images/2020/04/ml2.png" alt="Prompt example" class="lazyload imgborder imgcenter">

Let's look at the code for this. I'm skipping the styling part but you'll be able to see everything in the repository. (I'll share the link at the end.) 

```html
<template>
  <div>
    <div v-if="prompt" class="promptBlock">
        <p>
        Give me a {{ prompt }}: 
        <input v-model="currentPrompt" ref="promptField" v-on:keyup.enter="savePrompt"> 
        <button @click.prevent="savePrompt">Next</button>
        </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  created() {
    this.$store.dispatch('initMadLib');
    this.$nextTick(() => {
      if(this.$refs.promptField) this.$refs.promptField.focus();
    });
  },
  watch: {
    prompt(n,o) {
      console.log('prompt changed',n,o);
      this.$nextTick(() => {
        if(this.$refs.promptField) this.$refs.promptField.focus();
      });
    }
  },
  computed: {
    ...mapGetters(['prompts']),
    prompt() {
      return this.prompts[this.promptIndex];
    }
  },
  data() {
    return {
      promptIndex:0,
      currentPrompt:'',
      answers:[]
    }
  },
  methods: {
    savePrompt() {
      if(this.currentPrompt === '') return;
      this.answers.push(this.currentPrompt);
      this.promptIndex++;
      this.currentPrompt = '';
      if(this.promptIndex === this.prompts.length) {
        this.$store.commit('setAnswers', this.answers);
        this.$router.replace('/render');
      }
    }
  }
}
</script>
```

So initially my code called out to my Vuex store to setup a MadLib. Doing this will give me a MadLib set of prompts, an array of things like noun, country, and so forth. In my UI then I can render one at a time and accept user input. You'll see that when I've answered every prompt, I move the user on.

This was all pretty easy. What took me the most time was getting the darn `focus()` stuff working correctly. I wanted to make it easier for kids so they wouldn't have to use the mouse as much. I did get it working but I don't believe I've done it the best way possible. 

The final view simply renders the MadLib:

<img data-src="https://static.raymondcamden.com/images/2020/04/ml3.png" alt="Render of the ML" class="lazyload imgborder imgcenter">

I'll skip the code for this route as well as it just uses a Vuex method to get the rendered HTML. Let's look at that store:

```js
import Vue from 'vue'
import Vuex from 'vuex'
import marked from 'marked';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    madlibs:null,
    madlib:null,
    answers:null
  },
  getters: {
    prompts(state) {
      if(state.madlib) return state.madlib.prompts;
      return [];
    },
    render(state) {
      /*
      current bug, when i select a new madlib, this runs cuz
      prompts changes, but answers is []. Hence the new
      if below. Smells wrong though.
      */
      if(state.madlib.prompts.length != state.answers.length) return '';
      let text = state.madlib.text;
      for(let i=0;i<state.madlib.prompts.length;i++) {
        let answer = state.answers[i];
        let prompt = '{' + state.madlib.prompts[i] + '}';
        text = text.replace(prompt, '**'+answer+'**');
        //console.log(`replace ${answer} for ${prompt} in ${text}`);
      }
      return marked(text);
    }
  },
  mutations: {
    setAnswers(state, a) {
      state.answers = a;
    },
    pickMadLib(state) {
      state.madlib = state.madlibs[getRandomInt(0, state.madlibs.length)];
      state.answers = [];
    },
    setMadLibs(state, data) {
      state.madlibs = data;
    }
  },
  actions: {
    async initMadLib(context) {
      if(!context.state.madlibs) {
        console.log('need to load madlibs');
        let result = await fetch('./data.txt');
        let data = await result.text();
        let parts = data.split('---');
        parts = parts.map(p => fixRawMadLib(p));
        context.commit('setMadLibs', parts);
        context.commit('pickMadLib');
      } else context.commit('pickMadLib');

    }
  },
  modules: {
  }
})

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function fixRawMadLib(str) {
  let result = {};
  // first trim any potential white space around it
  result.text = str.trim();
  result.prompts = [];
  let matches = result.text.matchAll(/{.*?}/g);
  if(matches) {
    for(let match of matches) {
      let prompt = match[0];
      prompt = prompt.replace(/[{}]/g, '');
      result.prompts.push(prompt);
    }
  }

  return result;
}
```

So there's a few things going on here but the main aspects are where I load the MadLibs and when I render one. Loading involves making an XHR request to my text file. I parse it (splitting on `---`) and then doing some basic parsing of the values within tokens. The result is a MadLib object that has an array of prompts (as well as the original text).

Rendering then is a simple matter of replacing the tokens with the user's inputs. The final step is passing it through the `marked` library to convert the Markdown into HTML. Don't forget that when you pass HTML into a value to render for Vue, you need to use the `v-html` directive:

```html
<div v-html="render"></div>
```

And that's it. You can view the complete source code at <https://github.com/cfjedimaster/vue-demos/tree/master/madlibs>. I've got a version up and running at <https://madlibs-sooty.now.sh/>. Note that I did *not* go ahead and turn it into an offline-capable game. Honestly, I don't have the energy right now. (By the way, it's my birthday. I'm old.) However it wouldn't be too difficult to add that in. 

<i>Header photo by <a href="https://unsplash.com/@siora18?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Siora Photography</a> on Unsplash</i>
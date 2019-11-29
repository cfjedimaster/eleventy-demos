---
layout: post
title: "Creating a Slide Show for Pinterest Boards in Vue.js"
date: "2018-10-09"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/pint3.jpg
permalink: /2018/10/09/creating-a-slide-show-for-pinterest-boards-in-vuejs
---

I've avoided [Pinterest](https://www.pinterest.com/) like the plague because I absolutely hated the way they made you sign up just to view basic content. But a good friendly recently got me interested in and I decided to sign up myself. I'm not doing anything terribly interesting with it but I've decided to give it a shot. The friend recently reached out to me to ask if I knew of any way to create a slide show from a Pinterest board. 

For those who don't use Pinterest, "boards" are simply collections of items. Pictures, text, etc. I did some quick Googling and I couldn't find anything recent that was helpful. This friend was pretty smart, but also not technical, so I thought it might be cool to build something from scratch using Vue.js. All public Pinterest boards have a RSS feed, so all I needed to do was parse the RSS and then show one item at a time. If you just want to play with the tool and don't care about the code, go here:

<https://codepen.io/cfjedimaster/full/yRVYJa/>

There isn't great error handling yet so - um - don't screw up? Ok, so how did I build this? I began with a simple Vue app that had an initial screen to prompt for your username and board name:

<img src="https://static.raymondcamden.com/images/2018/10/pint1.jpg" class="imgborder imgcenter" alt="Screenshot of demo showing input fields">

After entering this information, the code parses the RSS found at:

https://www.pinterest.com/USER/BOARD.rss/

For my RSS parsing, I used [Feednami](https://toolkit.sekando.com/docs/en/feednami), a service I first [reviewed](https://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options) way back in 2015. It still works well and was pretty much a no-brainer.

Once loaded, I then inject the HTML of each item in the view, wait six seconds, and then go to the next one. 

<img src="https://static.raymondcamden.com/images/2018/10/pint2.jpg" class="imgborder imgcenter" alt="Screenshot of Pinterest item">

I could have added a bit of CSS, but I kept it simple. Let's begin by taking a quick look at the HTML.

```markup
<div id="app" v-cloak>
  
  <div v-if="inputMode">
    <h2>Pinterest Board to Slide Show</h2>
    
    <p>
      Enter the name of a Pinterest user and board in the fields below to create a slide show.
    </p>
    
    <p>
      <label for="user">Pinterest User</label>
      <input id="user" v-model="user">
    </p>
    <p>
      <label for="board">Pinterest Board</label>
      <input id="board" v-model="board">
    </p>
    <p>
      <button @click="loadSlideShow" :disabled="loadDisabled">Load Slide Show</button>
    </p>
  </div><div v-else>
  
    <div v-if="loading"><i>Loading content...</i></div>
    <transition name="fade" mode="out-in">
    <div v-if="curItem" v-html="curItem" :key="curItem">
    </div>
    </transition>
  </div>
  
</div>
```

I assume there isn't much here interesting, but I can say the `transition` bit was difficult for me to get right. No matter how many times I use transitions in Vue I still struggle with it. 

The JavaScript is rather short too:

```js
const SLIDE_DURATION = 6000;

const app = new Vue({
  el:'#app',
  data:{
    inputMode:true,
    user:'theraymondcamden',
    board:'star trek',
    loading:true,
    items:[],
    selected:null,
    curItem:null
  },
  methods:{
    loadSlideShow() {
      this.inputMode = false;
      let board = this.board.replace(/ /g, "-");
      let url = `https://www.pinterest.com/${encodeURIComponent(this.user)}/${encodeURIComponent(board)}.rss/`;
      console.log('url to load is '+url);
      feednami.load(url)
      .then(feed => {
        console.log('total en', feed.entries.length);
        //console.log(feed.entries[0]);
        for(let entry of feed.entries) {
          // add the entries to results, but remove link from desc
          let newItem = entry.description;
          newItem = newItem.replace(/<a.*?>/,'');
          newItem = newItem.replace(/<\/a>/,'');
          this.items.push(newItem);
          //console.log(newItem);
          this.loading = false;
        }
        this.selected = 0;
        this.curItem = this.items[this.selected];
        setInterval(() => {
          this.newItem();
        }, SLIDE_DURATION);
      });
      
    },
    newItem() {
      console.log('newItem running, current selected ', this.selected);
      this.selected++;
      if(this.selected === this.items.length) this.selected = 0;
      this.curItem = this.items[this.selected];
    }
  },
  computed:{
    loadDisabled() {
      return this.user == '' || this.board == '';
    }
  }
})
```

Only real cool part (in my opinion) is the feednami integration, and it's interesting mainly due to how simple it is. Simple is good! You can find the complete CodePen below for your enjoyment. From what I know this was something my friend wanted for her kids so to me - it was time well spent!

<p data-height="265" data-theme-id="0" data-slug-hash="yRVYJa" data-default-tab="js,result" data-user="cfjedimaster" data-pen-title="Pinterest to Slide Show with Vue" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/yRVYJa/">Pinterest to Slide Show with Vue</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
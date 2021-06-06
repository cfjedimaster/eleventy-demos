---
layout: post
title: "Creating a Live Time Duration Component in Vue.js"
date: "2019-01-07"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/duration.jpg
permalink: /2019/01/07/creating-a-live-time-duration-component-in-vuejs
---

Pardon the somewhat awkward title of the post. Today's [Vue.js](https://vuejs.org/) demo is based on something I saw recently on the cnn.com site - a live update of how long the government shutdown has been going on. They don't have it online now, but it basically showed this...

Partial government shutdown has gone on for 11d 15h 49m 7s

The values were updated in real time. You could argue (and I'd agree) that it was a bit overly dramatic for a news site (and maybe that's why it isn't there now), but when I saw it, I thought it would be something fun to build in Vue. I ended up with not one, but two iterations of the idea and I'd like to share them below. As always, I welcome your comments about what could be improved. Let's get started.

## Version One

The initial version began with a simple set of features. The component should accept a `date` value (either in the past or future) and then simply display the duration while updating it automatically. Here's an example of how it could be used:

```html
<div id="app" v-cloak>
  
  My birthday was <time-since :date="birthday"></time-since> ago. 

</div>
```

And here's the JavaScript code behind it. First, just the Vue app itself:

```js
const app = new Vue({
  el:'#app', 
  data:{
    birthday:new Date(2018, 3, 8)
  }
})
```

As you can see, all I bothered to add was a value for the date. The real meat is in the component:

```js
Vue.component('time-since',{
  template:`
<span>{% raw %}{{days}}{% endraw %} days {% raw %}{{hours}}{% endraw %} hours {% raw %}{{minutes}}{% endraw %} minutes {% raw %}{{seconds}}{% endraw %} seconds</span>
`,
  data() {
    return {
      interval:null,
      days:0,
      hours:0,
      minutes:0,
      seconds:0,
      intervals:{
        second: 1000,
        minute: 1000 * 60,
        hour: 1000 * 60 * 60,
        day: 1000 * 60 * 60 * 24
      }
    }
  },
  props:{
    date:{
      required:true
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.updateDiffs();
    },1000);
    
    this.updateDiffs();
  },
  destroyed() {
    clearInterval(this.interval);    
  },
  methods:{
    updateDiffs() {
      //lets figure out our diffs
      let diff = Math.abs(Date.now() - this.date.getTime());
      this.days = Math.floor(diff / this.intervals.day);
      diff -= this.days * this.intervals.day;
      this.hours = Math.floor(diff / this.intervals.hour);
      diff -= this.hours * this.intervals.hour;
      this.minutes = Math.floor(diff / this.intervals.minute);
      diff -= this.minutes * this.intervals.minute;
      this.seconds = Math.floor(diff / this.intervals.second);
    }
  }
});
```

Alright, so let's tackle it from the top to the bottom. The template is rather simple, and hard coded, to display the duration as:

```html
<span>X days Y hours Z minutes A seconds</span>
```

There's no options here to change that. The next block handles the data for the component with the only interesting part (in my opinion) being the math set up to remember various millisecond based intervals.

Next look at `mounted` and `destroyed`. `mounted` is responsible for setting up a second based interval to update the display (and running it right away). `destroyed` handles removing the interval if the component is removed from the DOM completely.

Finally, `updateDiffs` just handles doing the math. Something tells me this part could probably be written in less lines of code by people smarter than me, but it worked so I left it alone.

You can view the complete code (and play with it) in this CodePen:

<p data-height="400" data-theme-id="0" data-slug-hash="BvYPPM" data-default-tab="js,result" data-user="cfjedimaster" data-pen-title="time-since vue test" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/BvYPPM/">time-since vue test</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Pretty cool, right? But let's look at how we can kick it up a notch.

## Version the Second

So one of the issues with the first version is that it forces a particular kind of output. What if you wanted to customize the display a bit? That's where slots come in. Check out this version:

```html
<div id="app" v-cloak>
  
  My birthday was <time-since :date="birthday">
  <template slot-scope="int">
  {% raw %}{{int.days}}{% endraw %}D {% raw %}{{int.hours}}{% endraw %}H {% raw %}{{int.minutes}}{% endraw %}M {% raw %}{{int.seconds}}{% endraw %}S
  </template>
  </time-since> ago. 

</div>
```

In this version, I'm using a slot and customizing the labels used for the intervals to make it a bit closer to the CNN version. If I wanted to, I could even get rid of the seconds value to make it a bit less distracting. Let's look at the updated component.

```js
Vue.component('time-since',{
  template:`
<span>
<slot :days="days" :hours="hours" :minutes="minutes" :seconds="seconds">{% raw %}{{days}}{% endraw %} days {% raw %}{{hours}}{% endraw %} hours {% raw %}{{minutes}}{% endraw %} minutes {% raw %}{{seconds}}{% endraw %} seconds</slot>
</span>
`,
 //stuff deleted...
});
```

The change was rather minor. Now the template supports default output (the same as the previous version) but also binds values for all four intervals that can be used in the markup. The text inside that slot will only be used if you don't pass a slot in. Now the component supports the same output as before but also complete customization.

You can see the output here:

<p data-height="400" data-theme-id="0" data-slug-hash="xmjROa" data-default-tab="js,result" data-user="cfjedimaster" data-pen-title="time-since vue test 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/xmjROa/">time-since vue test 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Ok, so what do you think?

<i>Header photo by <a href="https://unsplash.com/photos/ft0-Xu4nTvA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Djim Loic</a> on Unsplash</i>

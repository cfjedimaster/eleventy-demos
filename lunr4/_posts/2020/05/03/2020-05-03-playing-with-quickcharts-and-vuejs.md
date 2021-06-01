---
layout: post
title: "Playing with QuickChart and Vue.js"
date: "2020-05-03"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/chart.jpg
permalink: /2020/05/03/playing-with-quickchart-and-vuejs
description: A look at building charts with simple image tags and the QuickChart service.
---

A while ago my buddy [Todd Sharp](https://recursive.codes/) shared a cool resource with me, [QuickChart](https://quickchart.io/). QuickChart is a static image only version of [Chart.js](https://www.chartjs.org/docs/latest/charts/). By "static image" only I mean you can generate a chart via a URL request and get an image out, not a dynamic JavaScript-based chart. This is a good replacement for a service Google killed off about a year ago, Image Charts. 

Why would you go for an image-based chart instead of a dynamic one? Emails are probably the best example. Also, I think many times you do not need interactivity. If you're showing a simple chart and the user doesn't need to toggle items off and on, than there's no real point in having an interactive chart. (And as I'll show, you can still have some interactivity with this library.) 

QuickChart works by essentially creating a server wrapper to Chart.js. (An open source server that you could host yourself if you want, but their [free tier](https://quickchart.io/pricing/) is pretty dang good.) You craft a URL that, for the most part, matches Chart.js, and then that's it. So for example:

```html
<img src="https://quickchart.io/chart?c={type:'pie',options:{title:{display:true, text:'The Battle'}},data:{labels:['Knowing','Red and Blue Lasers'], datasets:[{data:[50,50]}]}}">
```

The URL can get rather complex, but the end result is just an image.

<p>
<img data-src="https://quickchart.io/chart?c={type:'pie',options:{title:{display:true, text:'The Battle'}},data:{labels:['Knowing','Red and Blue Lasers'], datasets:[{data:[50,50]}]}}" alt="" class="lazyload imgborder imgcenter">
</p>

Since most of the work is done on the chart.js side, you'll want to have some basic familiarity with it before starting, but it isn't a difficult library to use. Also, QuickChart will return nice errors when you screw up. For example, I added an extra } to the URL below:

```html
<img src="https://quickchart.io/chart?c={type:'pie',options:{title:{display:true, text:'The Battle'}}},data:{labels:['Knowing','Red and Blue Lasers'], datasets:[{data:[50,50]}]}}">
```

And the result:

<p>
<img data-src="https://quickchart.io/chart?c={type:'pie',options:{title:{display:true, text:'The Battle'}}},data:{labels:['Knowing','Red and Blue Lasers'], datasets:[{data:[50,50]}]}}" alt="" class="lazyload imgborder imgcenter">
</p>

Cool, so given that it's just simple HTML, how can we integrate Vue with it? For my first demo, I setup an image that was bound to a computed property:

```html
<div id="app" v-cloak>
  {{ chartSrc }}
  <img :src="chartSrc">
</div>
```

The chartSrc output above the image is just there for testing. On the Vue side, I moved my chart data into Vue's data block and set up my computed property:

```js
const app = new Vue({
  el:'#app',
  data: {
    months:['January','February','March','April', 'May'],
    cats:[100,200,300,400,500],
    dogs: [50, 60, 70, 180, 190]
  },
  computed: {
    chartSrc() {
      // great tip for quoted array, https://stackoverflow.com/a/43651811/52160
      let monthStr = this.months.map(x => "'" + x + "'").toString();
      return `https://quickchart.io/chart?width=500&height=300&c={type:'bar',data:{labels:[${monthStr}], datasets:[{label:'Dogs',data:[${this.dogs}]},{label:'Cats',data:[${this.cats}]}]}}`
    }
  }
})
```

The only thing really fancy here is ensuring months is output as a quoted string. Thank you StackOverflow for having a great solution. You can play with this in my CodePen:

<p class="codepen" data-height="500" data-theme-id="light" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="YzyrEZM" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="QuickCharts1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/YzyrEZM">
  QuickCharts1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Because I've tied my QuickChart URL to data and because Vue is so awesome, as soon as my data changes, so will my chart. Now I said above, if you want interactivity you probably want the "real" library. But I think for some *simple* use cases, it's fine to use this approach. I modified my code to update the values every three seconds. At that speed I'd definitely use the JavaScript charts instead, but I wanted something you (my favorite reader, yes you) could easily see.

```js
const app = new Vue({
  el:'#app',
  data: {
    months:['January','February','March','April', 'May'],
    cats:[100,200,300,400,500],
    dogs: [50, 60, 70, 180, 190]
  },
  created() {
    setInterval(() => {
      if(Math.random() < 0.5) {
        let idx = getRandomInt(0, this.cats.length-1);
        this.$set(this.cats, idx, this.cats[idx] + getRandomInt(-20, 20));
      } else {
        let idx = getRandomInt(0, this.dogs.length-1);
        this.$set(this.dogs, idx, this.dogs[idx] + getRandomInt(-20, 20));
      }
    }, 3000);
  },
  computed: {
    chartSrc() {
      // great tip for quoted array, https://stackoverflow.com/a/43651811/52160
      let monthStr = this.months.map(x => "'" + x + "'").toString();
      return `https://quickchart.io/chart?width=500&height=300&c={type:'bar',data:{labels:[${monthStr}], datasets:[{label:'Dogs',data:[${this.dogs}]},{label:'Cats',data:[${this.cats}]}]}}`
    }
  }
})

// https://stackoverflow.com/a/1527820/52160
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

<p class="codepen" data-height="500" data-theme-id="light" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="dyYVZRr" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="QuickCharts2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/dyYVZRr">
  QuickCharts2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So what about a "real" example? I built a chart based on API on [CovidTracking.com's](https://covidtracking.com/) set of APIs. Specifically the data related to my home state, Louisiana. I modified my HTML a bit so as to not have the image rendered until data was ready:

```html
<div id="app" v-cloak>
  <img :src="chartSrc" v-if="loaded">
</div>
```

And then I updated my JavaScript to make use of the API:

```js
const app = new Vue({
  el:'#app',
  data: {
    loaded: false,
    positives:[],
    deaths:[],
    labels:[]
  },
  async created() {
    let data = await fetch('https://covidtracking.com/api/v1/states/LA/daily.json').then(res => res.json());
    data.reverse();
    this.positives = data.map(i => i.positive);
    this.deaths = data.map(i => {
      if(i.death) return i.death;
      return 0;
    });
    this.labels = data.map(i => {
      let year = i.date.toString().substring(0,4);
      let month = i.date.toString().substring(4,6);
      let day = i.date.toString().substring(6,8);
      return year + '/' + month + '/' + day;
    });
    this.loaded = true;
  },
  computed: {
    chartSrc() {
      // great tip for quoted array, https://stackoverflow.com/a/43651811/52160
      let dateStr = this.labels.map(x => "'" + x + "'").toString();
      return `https://quickchart.io/chart?width=500&height=300&c={type:'line',data:{labels:[${dateStr}], datasets:[{label:'Positives',data:[${this.positives}]},{label:'Deaths',data:[${this.deaths}]}]}}`
    }
  }
})
```

In `created` I fetch my data and then immediately reverse is so the first values are the oldest. I then create an array of positives, deaths, and labels. I could then put this on a web page and every day the chart would have the freshest data, but still be just a simple image. Here's the CodePen for this version (feel free to fork and change the state):

<p class="codepen" data-height="700" data-theme-id="light" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="OJyxQvd" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="QuickCharts3">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/OJyxQvd">
  QuickCharts3</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

All in all, I think this is a pretty sweet service. As I said, crafting the URL can be a bit delicate. I'd suggest using something like Postman to test, but once that's done, it's just an image tag. If you are interesting in more information about charting and Vue, I wrote up a [comparison](https://blog.logrocket.com/charting-with-vue-a-comparison/) article a few months back you might find helpful.

<i>Header photo by <a href="https://unsplash.com/@isaacmsmith?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Isaac Smith</a> on Unsplash</i>
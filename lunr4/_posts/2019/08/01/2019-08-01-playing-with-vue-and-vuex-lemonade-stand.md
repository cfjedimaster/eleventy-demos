---
layout: post
title: "Playing with Vue and Vuex - Lemonade Stand"
date: "2019-08-01"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/lemonadestand.jpg
permalink: /2019/08/01/playing-with-vue-and-vuex-lemonade-stand
description: 
---

One of my goals for this year was to play more with Vue "apps" (ie, not simple page enhancement demos) and to dig more into [Vuex](https://vuex.vuejs.org/). I really like Vuex, but I'm struggling with the "best" way to use it, what makes sense with it and what doesn't, and generally just how to approach it. I figure one of the best ways to get more comfortable is to just build stuff and see what feels right. With that in mind, today I'm sharing a game I built called Lemonade Stand.

<img src="https://static.raymondcamden.com/images/2019/08/ls.png" alt="Lemonade Stand" class="imgborder imgcenter">

Lemonade Stand was a classic PC game from way, *way* back in the old days. I remember playing it on my Apple II at home and at school. I also remember editing the code so I'd have a lot of money, which wasn't really as fun as you'd imagine. (Although ask me about editing Bard's Tale saves, that was cool.) 

The game is a really simple economic simulator. You run a lemonade stand and every day you're given a weather report, a cost of materials, and you have to decide how many cups of lemonade you want to make as well as the cost. You can also buy advertising signs to help improve your sales. 

The entire project is hosted up on [Code Sandbox](https://codesandbox.io) - <https://codesandbox.io/s/lemonade-stand-oxbfq?fontsize=14&view=preview>. You can both play the game and edit the code (and if you do, let me know in a comment below). Let me break down how I built this.

First, the application makes use of [Vue Router](https://router.vuejs.org/) to handle the different states of the game. There's an initial page that provides a basic introduction.

<img src="https://static.raymondcamden.com/images/2019/08/ls2.png" alt="Introduction View" class="imgborder imgcenter">

The next view is the "planner" where you determine how many glasses you want to make, how many signs you want to buy, and what price you want to sell your goods.

<img src="https://static.raymondcamden.com/images/2019/08/ls3.png" alt="Screen where you set selling options." class="imgborder imgcenter">

When you figure out your options, you then go to the next screen and see the results.

<img src="https://static.raymondcamden.com/images/2019/08/ls4.png" alt="Sales results" class="imgborder imgcenter">

Now let's look at the code. I'm not going to show every single line but will rather focus on what I think is important. Don't forget you can use the link above to see the code and fork it.

First, let's look at main.js, the top level setup for my game.

```js
import Vue from "vue";
import App from "./App.vue";

import router from "./routes";
import store from "./store";

Vue.config.productionTip = false;

Vue.filter("money", value => {
  if (!window.Intl) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
});

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");
```

The unique parts here are loading a router, loading a Vuex store, and setting up a global filter for displaying money values.

The router is trivial as I only have three views:

```js
import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./views/Home";
import Game from "./views/Game";
import Report from "./views/Report";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/game",
    component: Game
  },
  {
    path: "/report",
    component: Report
  }
];

export default new VueRouter({
  routes
});
```

The first view is called `Home.vue` and is mainly just text, but make note of the `<router-view>` to handle navigation.

```html
<template>
  <div>
    <h1>Welcome to Lemonade Stand</h1>

    <p>
      In this game, you will have ten turns to try to earn as
      much profit as you can at a simulated Lemonade Stand.
    </p>

    <p>
      On each turn you will be given a weather forecast and the price
      for each cup of lemonade. You can then select
      <strong>how many glasses you want to make</strong>,
      <strong>how many advertising signs you want to produce</strong>, and at
      <strong>what price you will see your lemonade</strong>.
    </p>

    <p>
      Good luck, and remember that the weather forecase will
      <strong>not</strong> always be correct!
    </p>

    <router-link to="/game" tag="button">Get Started</router-link>
  </div>
</template>

<script>
export default {};
</script>
```

So far so good. Now let's look at the next view, `Game.vue`.

```html
<template>
  <div>
    <h1>Forecast: {% raw %}{{ forecast }}{% endraw %}</h1>
    <p>On day {% raw %}{{ day }}{% endraw %} the cost of lemonade is {% raw %}{{ costOfLemonade }}{% endraw %} cents each.</p>
    <p>You currently have {% raw %}{{ assets | money }}{% endraw %} in cash.</p>
    <p>
      How many glasses of lemonade do you wish to make?
      <input
        type="number"
        v-model.number="numGlasses"
        min="0"
      >
    </p>
    <p>
      How many advertising signs ({% raw %}{{costOfSigns}}{% endraw %} cents each) do you wish to make?
      <input
        type="number"
        v-model.number="numSigns"
        min="0"
      >
    </p>
    <p>
      What price (in cents) do you wish to charge for lemonade?
      <input
        type="number"
        v-model.number="pricePerGlass"
        min="0"
      >
    </p>

    <div v-if="hasErrors">
      <strong>Oh oh! Please fix these errors!</strong>
      <ul>
        <li v-for="e in errors">{% raw %}{{e}}{% endraw %}</li>
      </ul>
    </div>

    <button @click="initiateSales">Start Selling!</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numGlasses: 0,
      numSigns: 0,
      pricePerGlass: 0
    };
  },
  created() {
    console.log('created');
    this.$store.commit("generateForecast");
  },
  computed: {
    assets() {
      return this.$store.state.assets / 100;
    },
    day() {
      return this.$store.state.day;
    },
    costOfLemonade() {
      return this.$store.getters.costOfLemonade;
    },
    costOfSigns() {
      return this.$store.state.signCost;
    },
    errors() {
      return this.$store.state.errors;
    },
    forecast() {
      return this.$store.getters.forecast;
    },
    hasErrors() {
      return this.$store.getters.hasErrors;
    }
  },
  methods: {
    initiateSales() {
      // try to sell - note we pass the getter value cuz Mutations can't use Getters (weird!)
      this.$store.commit("doSales", {
        glasses: this.numGlasses,
        signs: this.numSigns,
        cost: this.pricePerGlass,
        costOfLemonade: this.costOfLemonade
      });
      if(!this.hasErrors) this.$router.replace("/report");
    }
  }
};
</script>
```

There's a lot going on here. The component begins with the layout which is essentially a report on top and three form fields. 

The first thing the code does in the `created` handler is to ask the store to generate a forecast: `this.$store.commit("generateForecast");`. I'll share the store code soon, but basically every aspect of the game that relates to numbers and logic is placed in the store. You can see this in multiple places, like where we ask for the price of signs. While that value won't change, I set it up as a constant in my store so I can change it in one place. 

This is why you see a bunch of `computed` values that just call out to the store. There *is* a nicer way of doing this (see [mapGetters](https://vuex.vuejs.org/guide/getters.html)) but I just didn't feel like using that. 

And note the last bit of code, `initiateSales`, simply gets the values and asks the store to try to start selling lemonade. If there aren't any errors, we go on to the report page. Let's look at that next.

```html
<template>
  <div>
    <h1>Daily Financial Report</h1>

    <p v-if="message">
      <strong>{% raw %}{{message}}{% endraw %}</strong>
    </p>

    <p>For day {% raw %}{{day}}{% endraw %}, you sold {% raw %}{{glassesSold}}{% endraw %} glasses of lemonade.</p>

    <p>
      You earned {% raw %}{{income | money}}{% endraw %} and had expenses of {% raw %}{{expenses | money}}{% endraw %}
      for a net profit of {% raw %}{{ profit | money }}{% endraw %}.
    </p>

    <p>You currently have {% raw %}{{ assets | money }}{% endraw %}.</p>

    <router-link to="/game" tag="button">Next Day</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // we update our assets now, nto before, so i don't have to worry about the
    // display changing for a spli second. could be better?
    this.$store.commit("updateAssets");
  },
  computed: {
    assets() {
      return this.$store.state.assets / 100;
    },
    day() {
      return this.$store.state.day;
    },
    glassesSold() {
      return this.$store.state.glassesSold;
    },
    income() {
      return this.$store.state.income / 100;
    },
    expenses() {
      return this.$store.state.expenses / 100;
    },
    profit() {
      return this.income - this.expenses;
    },
    message() {
      return this.$store.state.message;
    }
  },
  methods: {}
};
</script>
```

In general, all this view does is report back to the user what happened. My store will know how many items were sold, the profit, and so forth (and you'll see the store next), so my view just has to ask for the values. The only *slightly* weird part is probably this, `this.$store.commit("updateAssets");`. This store mutation updates your assets and I do it here so you don't see a split second change in the previous view after sales are tabulated. Something tells me this could be done nicer.

Alright, now let's take a look at the store!

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/*
forecast posibilities and their impacts on sales
*/
const FORECASTS = [
  {
    label: "Sunny",
    salesRange: [60, 90],
    chanceOfRain: 10
  },
  {
    label: "Cloudy",
    salesRange: [40, 60],
    chanceOfRain: 40
  },
  {
    label: "Storms",
    salesRange: [20, 40],
    chanceOfRain: 70
  },
  {
    label: "Heat Wave",
    salesRange: [70, 100],
    chanceOfRain: 5
  },
  {
    label: "Partly Cloudy",
    salesRange: [50, 70],
    chanceOfRain: 20
  }
];

const SIGN_COST = 15;
const RAIN_PENALTY = 33;

// Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default new Vuex.Store({
  state: {
    day: 0,
    assets: 200,
    forecast: null,
    signCost: SIGN_COST,
    errors: [],
    message: "",
    glassesSold: null,
    expenses: null,
    income: null
  },
  mutations: {
    doSales(state, salesData) {
      console.log("Attempting to do sales with " + JSON.stringify(salesData));
      // reset errors
      state.errors = [];
      if (salesData.glasses <= 0)
        state.errors.push(
          "You must enter a positive number of glasses to sell."
        );

      if (salesData.signs < 0)
        state.errors.push("You can only buy a positive number of signs.");
      if (salesData.cost < salesData.costOfLemonade)
        state.errors.push(
          "You can't sell glasses for less than they are worth."
        );

      let totalCost =
        salesData.glasses * salesData.costOfLemonade +
        salesData.signs * state.signCost;
      console.log("totalCost", totalCost);

      if (totalCost > state.assets)
        state.errors.push(
          `Your cost (${totalCost / 100}) is more than you have.`
        );

      if (state.errors.length > 0) return;

      /*
        Ok, so a few things here. We have a forecast, and that gives us a range of sales, 
        ie on sunny days you can expect to sell 60-100% of your inventory. 

        The # of signs though has an impact, 1 to 0 signs will reduce your chance. Many signs
        will help, but to a max (the user doesnt know)

        Finally, we have a random chance of rain that is higher with cloudy and partly cloudy, 
        rain reduces your sales range too. We could add more things like construction on the street, etc

        Nope, not finally, cost of lemonade impacts sales too
      */

      //Ok, first get the range
      let range = state.forecast.salesRange;
      console.log("current range is " + range);

      //now determine signs bonus
      let signsBonus = 0;
      if (salesData.signs === 0) signsBonus = -20;
      else if (salesData.signs === 1) signsBonus = -10;
      else if (salesData.signs <= 4) signsBonus = 10;
      else if (salesData.signs <= 6) signsBonus = 15;
      else if (salesData.signs > 6) signsBonus = 20;

      console.log("bonus from signs is " + signsBonus);

      //now determine cost bonus
      let costBonus = 0;
      if (salesData.cost < 10) costBonus = 25;
      else if (salesData.cost < 30) costBonus = 15;
      else if (salesData.cost < 50) costBonus = 10;
      else if (salesData.cost < 75) costBonus = 10;
      else if (salesData.cost < 100) costBonus = 0;
      else costBonus = -10;

      console.log("bonus from col is " + costBonus);

      //now do we have rain?
      let didItRain = getRandomInt(0, 100) < state.forecast.chanceOfRain;
      console.log("did it rain?", didItRain);

      //ok, get our percent sold
      let [bottom, top] = state.forecast.salesRange;
      let percentSold = getRandomInt(bottom, top);

      console.log("initial percent sold", percentSold);

      //modify range based on signsBonus and didItRain
      percentSold += signsBonus;
      percentSold += costBonus;
      if (didItRain) percentSold -= RAIN_PENALTY;

      console.log("now percent sold is ", percentSold);
      //figure our glasses sold
      let glassesSold = Math.floor((percentSold / 100) * salesData.glasses);
      let moneyEarned = glassesSold * salesData.cost;
      console.log("you sold " + glassesSold + " and earned " + moneyEarned);

      //save the data
      state.glassesSold = glassesSold;
      state.income = moneyEarned;
      state.expenses = totalCost;
      if (didItRain) state.message = "It rained!";
    },
    generateForecast(state) {
      let prediction = FORECASTS[getRandomInt(0, FORECASTS.length - 1)];
      state.forecast = prediction;
      //also clear previous message
      state.message = "";
      state.day++;
    },
    updateAssets(state) {
      state.assets += state.income - state.expenses;
    }
  },
  getters: {
    costOfLemonade(state) {
      if (state.day > 2) return 4;
      return 2;
    },
    forecast(state) {
      return state.forecast.label;
    },
    hasErrors(state) {
      return state.errors.length > 0;
    }
  }
});
```

My store contains state that represents the current values of the game, but it also has "config" information that won't change. Things like the price of a sign. As folks play the game and provide feedback, I could tweak that value higher or lower. 

The `FORECASTS` constant represents the types of weather that can happen in the game. Each weather type has an impact on sales (`salesRange`) and a chance of rain. You can see this logic employed in `doSales`. After I calculate if your sales values were ok (i.e. you aren't spending more than you have), I determine what percentage of your glasses you sold. This is based on the weather, how many signs you made, the cost of your lemonade, and whether or not it rained. This will increase (or decrease) the percentage of glasses sold. 

Once that's known the values are all stored in the state so they can be used on the report view.

And that's pretty much it, but I wanted to call out some specific things that occurred to me while I was building this.

* One of the things I like best about Vuex is how it gives me a nice abstraction for my logic. My store ends up complex, my Vue app and components end up simple and dumb. 
* I was a bit unsure about using Vuex for "config" data as well as state that actually changes. I asked on Twitter though and it looks like people do that so at least I'm not alone. ;)
* I ran into an interesting issue. Mutations are not allowed to access Getters. Actions can, but I didn't have any async calls in my store. You can see my workaround in `doSales` where I have to pass in the cost of lemonade, even though it's a getter. This brings me back to the whole mutation/action thing which still feels awkward to me. Yes one is for sync and one is for async but I just kinda wish Vuex had one way to change data, async or not. 

As always, I'd love feedback on this (critical or not!), please leave me a comment below.

<i>Header photo by <a href="https://unsplash.com/@rodlong?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Rod Long</a> on Unsplash</i>
---
layout: post
title: "An Example of Vuex and State Management for Vue.js"
date: "2017-12-20"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/12/20/an-example-of-vuex-and-state-management-for-vuejs
---

When I first started learning Vue, I began hearing about [Vuex](https://vuex.vuejs.org/en/) and try as a I might, I couldn't wrap my head around what it actually did. The [docs](https://vuex.vuejs.org/en/intro.html) describe it like so:

<blockquote>
Vuex is a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.
</blockquote>

Frankly, I felt kind of stupid as I didn't quite grok what "state management pattern" was supposed to mean. I also found the docs and examples... difficult. It's hard to explain exactly why, and in general, the Vue docs are incredibly good, but the Vuex docs didn't make sense to me. Sarah Drasner has a good article on it (["Intro to Vue.js:Vuex"](https://css-tricks.com/intro-to-vue-4-vuex/)) but I still had difficulty wrapping my head around it.

This feels wrong, but the closest mental model I have is an Angular provider. One of the things I've been missing since learning Vue is an idea of a central "data source" for my components to use. Typically this is a wrapper for an API service of some sort, but I love having all those calls packaged up in a provider that my Angular bits can make use of. I don't think that's a fair comparison to Vuex, but it feels like something in the same neighborhood at least. 

From what I can tell, Vuex is especially handy when working with multiple components. It allows you to have one central place of "truth" for your data in each component, and know that if your data updates, any component using it will also get updated. With that said, I'm not sure how useful it would be in a Vue app that doesn't use custom components, but it may still serve as a nice separation of concerns. Plus - you may move from a "simple" Vue app to a more complex one using multiple components, and if you do, your data is ready to go.

Obviously I don't have a super great understanding of this yet. As always I try to be honest about what I know. But - I was able to build a demo. I've been thinking lately about text-based games. Not the old Infocom text adventures, but things like [A Dark Room](http://adarkroom.doublespeakgames.com/) and [Universal Paperclips](http://www.decisionproblem.com/paperclips/index2.html). If you haven't seen those games, well, I'm sorry. Say goodbye to your productivity. My initial idea was to rebuild Taipan, but I thought I'd go simpler with a basic stock market simulation. Take a couple of stocks, have them change prices over time, and then let you buy and sell and try to become right. 

My idea is that the data for the game: stocks, prices, cash on hand, etc, would be handled by my data store in Vuex. The Vue app (separate from Vuex) would handle UI interactions and retrieving data from the store, as well as pushing out updates. The code here is going to get a bit hairy, so let me try to make this as gentle as possible. Let's start with the front end. Before I even show the code, here is a screen shot:

![Game screen shot](https://static.raymondcamden.com/images/2017/12/vuex1.jpg)

The top portion of the screen represents the stocks. You see the current prices as well as how much you hold of each. Below that are two simple controls - one to buy stock and one to sell. I'm using the [Bootstrap + Vue](https://bootstrap-vue.js.org/) project to render the UI. What you can't see in the screen shot are the prices updating every 2 seconds. Here's the code.

``` html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap@next/dist/css/bootstrap.min.css"/>
		<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css"/>
		<style>
		#app {
			padding-top: 20px;
		}

		[v-cloak] { 
			display: none; 
		}

		.customBtn {
			width: 120px;
		}
		</style>

	</head>
	<body>

	<div id="app" v-cloak>

		<b-container>
			<b-row>
				<b-col>
					<b-card title="Stocks">
						<b-list-group>
							<b-list-group-item v-for="stock in stocks" :key="stock.name">
								<b-container>
									<b-row>
										<b-col>{% raw %}{{ stock.name }}{% endraw %}</b-col>
										<b-col class="text-right">{% raw %}{{ stock.price |{% endraw %} money}}</b-col>
									</b-row>
								</b-container>
							</b-list-group-item>
						</b-list-group>
					</b-card>
				</b-col>
				<b-col>
					<b-card title="Holdings">
						<b-list-group>
							<b-list-group-item v-for="stock in stocks" :key="stock.name">
								<b-container>
									<b-row>
										<b-col>{% raw %}{{ stock.name }}{% endraw %}</b-col>
										<b-col class="text-right">{% raw %}{{ stock.held}}{% endraw %}</b-col>
									</b-row>
								</b-container>
							</b-list-group-item>
						</b-list-group>
						<p class="card-text">
							Total value of holdings: {% raw %}{{ holdingValue |{% endraw %} money }}
						</p>
					</b-card>
				</b-col>
			</b-row>
			<!-- todo, add some vertical space -->
			<div style="height:20px"></div> <!-- this feels lame -->
			<b-card title="Purchase and Sell Stocks">
			
				<p class="card-text">
					Buy <b-form-input v-model.number="buy" type="number" style="width:100px;display:inline"></b-form-input> shares of 
					<b-form-select style="width:120px;display:inline" v-model="buyStock">
						<option v-for="stock in stocks" :key="stock.name">{% raw %}{{ stock.name }}{% endraw %}</option>
					</b-form-select>
					<b-button :variant="'success'" @click="buyStocks" class="customBtn">Purchase</b-button>
					<span v-if="buyError">Not enough cash.</span>
				</p>
				<p class="card-text">
					Sell <b-form-input v-model.number="sell" type="number" style="width:100px;display:inline"></b-form-input> shares of 
					<b-form-select style="width:120px;display:inline" v-model="sellStock">
						<option v-for="stock in stocks" :key="stock.name">{% raw %}{{ stock.name }}{% endraw %}</option>
					</b-form-select>
					<b-button :variant="'success'" @click="sellStocks" class="customBtn">Sell</b-button>
					<span v-if="sellError">Not enough on hand.</span>
				</p>

				<p class="card-text">
					You currently have {% raw %}{{ cash |{% endraw %} money }} in cash.
				</p>

			</b-card>

		</b-container>

	</div>
	
	<script src="https://unpkg.com/vue"></script>
	<script src="https://unpkg.com/vuex"></script>
	<script src="//unpkg.com/babel-polyfill@latest/dist/polyfill.min.js"></script>
	<script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.js"></script>
	<script src="stockgame.js"></script>
	</body>
</html>
```

That's probably a lot to digest, but what I want to point out is that at this layer, you aren't concerned with Vuex at all. All the data you see being used here, like with `v-model` and `{% raw %}{{ cash |{% endraw %} money }}` are integrated with the Vue app. If you're curious, the `| money` thing is a [Vue filter](https://vuejs.org/v2/guide/filters.html). This is the first time I've used one and it was as easy as most things are in Vue. Now let's look at the JavaScript. First the Vue app.

```js
const app = new Vue({
	el:'#app',
	store,
	data() {
		return {
			buy:0,
			buyStock:null,
			buyError:false,
			sell:0,
			sellStock:null,
			sellError:false
		}
	},
	filters:{
		money(value) {
			let numb = Number(value).toFixed(2);
			return '$'+numb;
		}
	},
	mounted:function() {
		setInterval(() => {
			console.log('running stock update');
			store.commit('changeStocks');
		}, STOCK_UPD*1000);	
	},
	computed:{
		stocks() {
			return store.state.stocks;
		},
		holdingValue() {
			return store.getters.holdingValue;
		},
		cash() {
			return store.state.cash;
		}
	},
	methods:{
		buyStocks() {
			if(this.buy < 0) this.buy = 0;
			if(this.buy === 0) return;
			console.log('going to buy '+this.buy +' of '+this.buyStock);
			store.commit('buyStock', {% raw %}{ amount:this.buy, stock:this.buyStock }{% endraw %});
			this.buy = 0;
			this.buyStock = null;
		},
		sellStocks() {
			if(this.sell < 0) this.sell = 0;
			if(this.sell === 0) return;
			console.log('going to sell '+this.sell +' of '+this.sellStock);
			store.commit('sellStock', {% raw %}{ amount:this.sell, stock:this.sellStock }{% endraw %});
			this.sell = 0;
			this.sellStock = null;
		}
	}
});
```
The first important change here is the passing in of the store object. I'll show that next, but this is how my Vue app knows how to work with the Vuex dta store. 

I've got a set of data that doesn't refer to game data, but more UI labels and controls and such. The "meat" of the data is in the store. 

Next you'll see the filter (love it) and a `mounted` function which handles updating my data. You'll see the first (real) use of Vuex here. My `store.commit` call basically asks the store to run a method to update itself. This method can take data too, but in this case, it's just an an event by itself. 

In order to render data from the store, I use 3 computed values. Both stocks and cash are returned as is. `holdingValue` requires special logic so I'm using a 'getter' on my store. I suppose you could always use getters to be consistent, but I think in cases when you know you aren't performing any logic, it's ok to use them as is. (Remember, I'm new at this.)

Finally we have two methods for buying and selling stock. I do a bit of validation and then call out to the store's `buyStock` or `sellStock` methods. Note that I don't actually check if I *can* buy or sell the stocks here. The store is responsible for that. If you look at the front end code, I've got hidden (by default) error states to report that. I wasn't able to figure out how to actually get that working though. I mean, I could use a computed value for it that's bound to the store. That would work - but something felt off about it. I'll probably return to this later.

Alright, so let's look at that store.

```js
const store = new Vuex.Store({
	state:{
		stocks:[
			{% raw %}{name:"IBM", price:100, held:0}{% endraw %},
			{% raw %}{name:"Amazon", price:90, held:0}{% endraw %},
			{% raw %}{name:"Microsoft", price:110, held:0}{% endraw %},
			{% raw %}{name:"Disney", price:120, held:0}{% endraw %},
		],
		cash:1000
	},
	getters:{
		holdingValue(state) {
			return state.stocks.reduce(function(current,elm) {
				return current + (elm.price * elm.held);
			},0); 
		}
	},
	mutations:{
		changeStocks(state) {
			state.stocks.forEach(stock => {
				stock.price += getRandomArbitrary(-20,20);
				if(stock.price < 0) stock.price = 0;
			});
		},
		buyStock(state, order) {
			console.log('order is '+JSON.stringify(order));
			//first, find the stock
			let stock = state.stocks.findIndex(elm => {
				return elm.name === order.stock;
			});
			if(stock >= 0) {
				let purchasePrice = (state.stocks[stock].price * order.amount).toFixed(2);
				if(state.cash >= purchasePrice) {
					state.stocks[stock].held += order.amount;
					state.cash -= purchasePrice;
				}
			}
		},
		sellStock(state, order) {
			console.log('order is '+JSON.stringify(order));
			//first, find the stock
			let stock = state.stocks.findIndex(elm => {
				return elm.name === order.stock;
			});
			if(stock >= 0) {
				if(state.stocks[stock].held >= order.amount) {
					let sellPrice = (state.stocks[stock].price * order.amount).toFixed(2);
					state.stocks[stock].held -= order.amount;
					state.cash += Number(sellPrice);
				}
			}
		}
	}
});
```

We begin with the data inside our `state` property. You can see the default stocks, prices, and the amount of cash you begin with. Next we've got `getters`. This is where I defined my special `holdingValue` method which handles iterating over your stock holdings and determine their current total value. Plus it uses Array.reduce which means I can maybe pass the Google coding interview now.

The last portion, `mutations`, contains the code the Vue app was "calling out to". I described them as events, although that's probably not the best terminology. `changeStocks` simply modifies stock prices in a random manner. `buyStock` and `sellStock` handle changing your portfolio. 

You can view the entire code base, and run it, in the codepen below. (It is a bit constrained width-wise, but you can view it in a new tab by hitting the "Edit" button - don't worry - it won't change my code.)

<p data-height="700" data-theme-id="dark" data-slug-hash="WdxZZE" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Stock Game in Vue (with Vuex)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/WdxZZE/">Stock Game in Vue (with Vuex)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

I hope it is obvious that I'm not entirely sure this is the best example of Vuex, and I think it loses something without using custom components (which I may work on next), but I hope this example is useful. Let me know what you think by leaving a comment below!
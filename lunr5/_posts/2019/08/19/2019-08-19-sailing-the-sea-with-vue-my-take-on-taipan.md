---
layout: post
title: "Sailing the Seas with Vue - My Take on Taipan"
date: "2019-08-19"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/taipan.jpg
permalink: /2019/08/19/sailing-the-seas-with-vue-my-take-on-taipan
description: My Vue.js version of the classic Taipan game.
---

As a young kid, I spent a *hell* of a lot of time on my Apple 2. I played many different games, but one of my favorite was [Taipan!](https://en.wikipedia.org/wiki/Taipan!). 

<figure>
<img src="https://static.raymondcamden.com/images/2019/08/TaipanGameTitle.png" alt="title screen for Taipain!" class="imgborder imgcenter">
<figcaption>By Source, Fair use, https://en.wikipedia.org/w/index.php?curid=8888638</figcaption>
</figure>

Taipan was a basic trade simulator based in the far east. You had a ship with storage capacity and would buy and sell goods across multiple ports. The game had basic combat, a money lender, and other details to make things interesting, but for me, my enjoyment came from pure grinding. I'd play it for a few hours at night just to see how much money I could make. (Of course, once I found the money lender bug it became trivial to get rich.) 

As part of my basic "get more experience with Vue apps" goal this year, I decided to rebuild the game (to the best of my ability) using, of course, Vue.js. I didn't want an exact rebuild though and in my version I made a few changes.

* First, I got rid of combat. I *hated* the combat aspect of the game as it felt incredible slow. I liked the fact that it added risk to the game, but didn't like how it killed the pace. In my version, you can be attacked by pirates but they simply do damage and steal some goods.
* I got rid of the money lender. It's an interesting aspect, but it also slowed down the pace of the game when arriving at port. 
* I got rid of the 'shake down' aspect via Li Yuen. I liked this aspect too and may eventually bring it back.
* I got rid of the warehouse. To me this always felt like a distraction.
* I also skipped making one of my goods illegal. 

That's pretty much it but there's a few other smaller mods as well. My game feels quite a bit more snappy and quick compared to the original which feeds into how I enjoyed playing it. 

I also tried to make use of the keyboard as much as possible. You can read about my work in that area here: [Working with the Keyboard in your Vue App](https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app). I didn't make *everything* keyboard accessible, but navigation from port to port can be done entirely by keyboard and while playing it felt like a really good setup. So before I get into the code, if you want to give it a try, you can play here:

<https://taipan.raymondcamden.now.sh/>

And you can view the source code here: 

<https://github.com/cfjedimaster/vue-demos/tree/master/taipan/>

Alright, so let's take a look at the code a bit. I'm not going to go over every single line, but rather talk about the more interesting bits (to me) at a high level.

Taipan makes use of both Vue Router and Vuex. My router use wasn't anything special. There's an home route which introduces you to the game. A "setup" route which just asks for your name. Then the game route were most of the work is done. Next is a "travel" route which handles going from one port to another. Finally there's a end of game route which shows your final stats.

My Vuex usage was interesting. As with my [Lemonade Stand](https://www.raymondcamden.com/2019/08/01/playing-with-vue-and-vuex-lemonade-stand) game, I spent a good amount of time thinking about what should go in my views versus what should go into the store. I definitely think I have a few things in views that should not be there. I think this particular aspect of Vue development is something that will change over the iteration of an application. 

Let's look at how gameplay happens. Each turn consists of the following logic.

* First, I ask Vuex to consider random events. This was - truly - the most difficult aspect of the entire game. The core "turn to turn, buy, sell" etc logic wasn't too hard. But handling "special events" was definitely problematic. 
* My view prompts for input. This can be one of - buying goods, selling goods, repairing damage, upgrading the ship, or moving to another port.

That "prompts for input" aspect is related to the keyboard. My solution involved showing a menu based on the current 'state' of what you are doing. So initially the state is - show the menu. But if you want to buy something, I switch to another menu prompting you for an amount and good. You can see this in play in the layout for Game.vue.

```html
<template>
	<div>
		<p>
			The date is {% raw %}{{ date }}{% endraw %}, Captain {% raw %}{{captain}}{% endraw %}. You are currently docked at {% raw %}{{ port }}{% endraw %}.
		</p>

		<div class="container">
			<Stats />
			<Hold />
			<Prices />
		</div>

		<p v-if="canUpgrade">
			<strong>Good News!</strong> You can upgrade your ship for {% raw %}{{ upgradeCost }}{% endraw %}.
			<span v-if="money < upgradeCost">Unfortunately you do not have the funds.</span>
			<span v-else><button @click="doUpgrade">Purchase Upgrade</button></span>
		</p>

		<p v-if="!keyState">
			<b>Menu:</b> Type <code>B</code> to buy, <code>S</code> to sell, 
			<span v-if="damage"><code>R</code> to repair, </span>
			<code>M</code> to go to another port or <code>Q</code> to quit.
		</p>

		<p v-if="keyState == 'Move'">
			Move to 
				<span v-for="(p, i) in ports" :key="i">{% raw %}{{ i+1 }}{% endraw %}) {% raw %}{{ p }}{% endraw %} </span>
			<br/>
			Or <code>C</code> to cancel.
		</p>

		<p v-if="keyState == 'Buy'">

			Buy 
				<input v-model.number="toBuyQty" type="number" min="0"> units of 
				<select v-model="toBuy">
				<option v-for="(s, i) in prices" :value="s" :key="i">{% raw %}{{ s.name }}{% endraw %}</option>
				</select> 
				for {% raw %}{{ purchasePrice | num }}{% endraw %}.
				<button :disabled="cantBuy" @click="buyGoods">Purchase</button>
			<br/>
			Or <code>C</code> to cancel.
		</p>

		<p v-if="keyState == 'Sell'">

			Sell 
				<input v-model.number="toSellQty" type="number" min="0"> units of 
				<select v-model="toSell">
				<option v-for="(s, i) in prices" :value="s" :key="i">{% raw %}{{ s.name }}{% endraw %}</option>
				</select> 
				for {% raw %}{{ sellPrice | num }}{% endraw %}.
				<button :disabled="cantSell" @click="sellGoods">Sell</button>
			<br/>
			Or <code>C</code> to cancel.
		</p>

		<p v-if="keyState == 'Repair'">

			Spend 
				<input v-model.number="toRepairQty" type="number" min="0"> on repairs. 
				<button :disabled="cantRepair" @click="doRepair">Repair</button>
			<br/>
			Or <code>C</code> to cancel.
		</p>

	</div>
</template>
```

I moved my a lot of my display stuff into components which lets the layout of this page mainly focus on responding to your inputs. The `keyState` value is how I handle dynamically changing the current menu. Here's the JavaScript:

```js
import Hold from '@/components/Hold.vue'
import Prices from '@/components/Prices.vue'
import Stats from '@/components/Stats.vue'

export default {
	data() {
		return {
			keyState:null,
			ray:null,
			toBuy:null,
			toBuyQty:0,
			toSell:null,
			toSellQty:0,
			toRepairQty:0
		}
	},
	components:{
		Hold, Prices, Stats
	},
	created() {
		this.$store.commit('newTurn');
		window.addEventListener('keypress', this.doCommand);
	},
	destroyed() {
		window.removeEventListener('keypress', this.doCommand);
	},
	computed: {
		cantBuy() {
			return (
				this.toBuy === null
				||
				(this.toBuy.price * this.toBuyQty) > this.money
				||
				this.toBuyQty + this.shipUsedSpace > this.holdSize
			)
		},
		cantRepair() {
			return this.toRepairQty > this.money;
		},
		cantSell() {
			if(this.toSell === null) return true;
			let avail = 0;
			for(let i=0;i<this.hold.length;i++) {
				if(this.hold[i].name === this.toSell.name) {
					avail = this.hold[i].quantity;
				}
			}
			console.log('avail is '+avail);
			return (
				this.toSellQty > avail
			)
		},
		canUpgrade() {
			return this.$store.state.offerUpgrade;
		},
		captain() {
			return this.$store.state.name;
		},
		damage() {
			return this.$store.state.damage;
		},
		date() {
			return this.$store.getters.gameDate;
		},
		hold() {
			return this.$store.state.hold;
		},
		holdSize() {
			return this.$store.state.holdSize;
		},
		money() {
			return this.$store.state.money;
		},
		port() {
			return this.$store.state.port.name;
		},
		ports() {
			return this.$store.getters.ports;
		},
		prices() {
			return this.$store.state.prices;
		},
		purchasePrice() {
			if(!this.toBuy) return 0;
			/* disabled due to warning about unexpected side effect, which makes sense
			if(this.toBuyQty < 0) this.toBuyQty = 0;
			*/
			return this.toBuy.price * this.toBuyQty;
		},
		repairCost() {
			return this.$store.getters.repairCost;
		},
		sellPrice() {
			if(!this.toSell) return 0;
			return this.toSell.price * this.toSellQty;
		},
		shipUsedSpace() {
			return this.$store.getters.shipUsedSpace
		},
		upgradeCost() {
			return this.$store.getters.upgradeCost;
		}
	},
	methods: {
		buyGoods() {
			//in theory not needed due to other checks
			if(!this.toBuy) return;
			if(this.toBuyQty <= 0) return;

			this.$store.commit('purchase', { good: this.toBuy, qty: this.toBuyQty });
			this.keyState = null;
		},
		doUpgrade() {
			this.$store.commit('upgrade', { cost: this.upgradeCost });
		},
		sellGoods() {
			if(!this.toSell) return;
			if(this.toSellQty <= 0) return;

			this.$store.commit('sale', { good: this.toSell, qty: this.toSellQty });
			this.keyState = null;
		},
		doCommand(e) {
			let cmd = String.fromCharCode(e.keyCode).toLowerCase();

			/*
			How we respond depends on our state. If keyState is null, 
			it meand we aren't doing anything, so BSM are valid.
			*/
			if(!this.keyState) {

				if(cmd === 'b') {
					console.log('Buy');
					this.toBuy = null;
					this.toBuyQty = 0;
					this.keyState = 'Buy';
				}

				if(cmd === 's') {
					console.log('Sell');
					this.toSell = null;
					this.toSellQty = 0;
					this.keyState = 'Sell';
				}

				if(cmd === 'm') {
					console.log('Move');
					this.keyState = 'Move';
				}

				if(cmd === 'r') {
					console.log('Repair');
					this.keyState = 'Repair';
				}

				if(cmd === 'q') {
					this.$router.replace('/end');
				}
				return;
			}

			//keystate for move
			if(this.keyState === 'Move') {

				if(cmd === 'c') {
					this.keyState = null;
					return;
				}

				cmd = parseInt(cmd, 10);
				for(let i=0;i<this.ports.length;i++) {
					if(cmd-1 === i) {
						console.log('going to move to '+this.ports[i]);
						this.$router.replace({ name:'travel', 
						params: { 
							destination: this.ports[i],
							destinationIndex: i
						} });
					}
				}
			}

			//keystate for buy
			if(this.keyState === 'Buy' || this.keyState === 'Sell') {

				if(cmd === 'c') {
					this.keyState = null;
					return;
				}

			}

		},
		doRepair() {
			// in theory not needed
			if(this.toRepairQty >= this.money) return;
			if(this.toRepairQty >= this.repairCost) this.toRepairQty = this.repairCost;

			this.$store.commit('repair', { total: this.toRepairQty, repairCost: this.repairCost });
			this.keyState = null;
		}

		
	}
}
```

That's quite a bit and I apologize. Probably the most interesting aspect is `doCommand`, where I respond to keyboard events and based on the current state I handle the input. I feel like this could be done better, but for a first draft, I'm happy with it. 

One part I'm not happy with is all of the items in `computed` that simply reach out to the Vuex state and their getters. I know I could use [mapState](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper) to make it a bit cleaner but I decided to hold off on that for now. (I'm going to force myself to use it in myh next demo.) 

Outside of that though most of the code here just handles input and interacts with the store. Here's a quick screen shot of my awesome design.

<img src="https://static.raymondcamden.com/images/2019/08/taipan1.png" alt="Game screen" class="imgborder imgcenter">


Let's take a look at `Travel.vue`. This is an temporary screen you see while moving between ports.

```html
<template>
	<div>
		<h1>On the sea...</h1>
		<p>
			You are on the way to {% raw %}{{ destination }}{% endraw %}.
		</p>
		<p v-if="randomEvent">
			{% raw %}{{ randomMessage }}{% endraw %}
		</p>

		<p v-if="damage >= 100">
			<strong>Your ship is completely destroyed!</strong>
		</p>
	</div>
</template>

<script>
export default {
	computed: {
		damage() {
			return this.$store.state.damage;
		},
		destination() {
			return this.$route.params.destination;
		},
		randomEvent() {
			return this.randomMessage !== '';
		},
		randomMessage() {
			return this.$store.state.randomMessage;
		}
	},
	created() {
		// check for random event
		this.$store.commit('generateRandomEvent', {destination: this.$route.params.destination});

		// this feels icky
		let destinationIndex = this.$route.params.destinationIndex;
		if(this.$store.state.newPortIndex) {
			destinationIndex = this.$store.state.newPortIndex;
		}

		let timeToWait = 1000;
		// if there was a special event, we need more time to read, and possibly end the game
		if(this.randomEvent) {
			timeToWait += 2000;
		}

		setTimeout(() => {
			console.log('done waiting');
			if(this.damage >= 100) {
				this.$router.replace('/end');
			} else {
				this.$store.commit('setPort', destinationIndex);
				this.$router.replace('/game');
			}
		}, timeToWait);
	}
}
</script>
```

The most interesting aspect of this is the `setTimeout` in `created`. The idea is that you enter this view but then move out automatically. Normally this is done in one second, but if a random event happens I delay it to three seconds total so you have time to read what happened. And since a random event could actually end the game for you, I've got some logic in there to move to the end view.

Finally, let's take a look at the store. I'm going to break this up a bit instead of just pasting the entire thing.

```js
/*
starting year for the game
*/
const BASE_YEAR = 1900;

const MONTHS = ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"];

/*
Ports. For now ports just have names but I may add boosts later, like port
X for good Y is good.
*/
const PORTS = [
  {
    name:'Bespin'
  },
  {
    name:'Dagobah'
  },
  {
    name:'Naboo'
  },
  {
    name:'Coruscant'
  },
  {
    name:'New Boston'
  }
];

/*
Goods have a value range representing, generally, what they will sell for.
illegal=true means there is a chance it will be stolen
*/
const GOODS = [
  {
    name:'General',
    salesRange: [5, 20],
    illegal:false
  },
  {
    name:'Arms',
    salesRange: [60, 120],
    illegal:false
  },
  {
    name:'Silk',
    salesRange: [200, 500],
    illegal:false
  },
  {
    name:'Spice',
    salesRange: [3000, 6000],
    illegal:true
  }

];

//how much each upgrade adds
const HOLD_UPGRADE = 10;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
```

My store starts off with various constants that impact game play. You can see the ports (yes, I diverted a bit from the old game), goods, and more. Ports are just names for now, but my intent was to allow for ports to 'favor' certain goods. Goods support a range in which their prices will fall and you can see I marked `Spice` as illegal, but haven't yet implemented it yet. Finally I've got a random utility function in there, `getRandomInt`. 

Here's my store state:

```js
state: {
	name:'',
	port:null,
	money:100000,
	turn:0,
	holdSize:100,
	hold:[],
	prices: [],
	damage:0,
	randomMessage:'',
	newPortIndex:null
},
```

Most of this is self explanatory, but note that the last two items, `randomMessage` and `newPortIndex`, are only used for the special events that happen when you travel. 

Now let's look at the various mutations. First up is `bootstrap`, which simply sets up things for a new game.

```js
bootstrap(state) {
	state.port = PORTS[0];
	GOODS.forEach(g => {
	state.hold.push({name:g.name, quantity: 0});
	});
},
```

Next is my special event handling:

```js
/*
A random event is one of the following:
	Nothing (ie nothing happened, no event
	Storm sends you to X port
	Storm damages you Y percentage points
	Pirates attack - steal items + Y damage

Also note we skip random events for the first ten turns or so

*/
generateRandomEvent(state, info) {
	state.randomMessage = '';
	state.offerUpgrade = false;

	if(state.turn < 10) return;

	let rand = getRandomInt(0, 100);

	//nothing
	if(rand < 60) return;

	if(rand >= 60 && rand < 70) {
		console.log('storm redirection');
		let newPort = null;

		while(!newPort || newPort.name === info.destination.name) {
			state.newPortIndex = getRandomInt(0, PORTS.length);
			newPort = PORTS[state.newPortIndex];
		}
		state.randomMessage = 'A storm has blown you off course to ' + newPort.name;
		console.log(state.randomMessage);
	}

	if(rand >= 70 && rand < 80) {
		let damage = getRandomInt(1, 12);
		console.log('Storm damages you for '+damage);
		state.randomMessage = 'A violent storm damages your ship!';
		state.damage += damage;
	}

	if(rand >= 80 && rand < 90) {
		//note, if your hold is empty, we ignore everything;
		//now get the hold and filter to items with stuff
		let heldItems = state.hold.filter(h => {
			return h.quantity > 0;
		});
		if(heldItems.length === 0) return;

		console.log('pirates attack and damage and steal shit');
		//first, do damange, bit less than storm to be nice
		let damage = getRandomInt(1, 7);
		console.log('Storm damages you for ' + damage);

		console.log('state.hold with items',JSON.stringify(heldItems));
		//select the index to steal
		let stealIndex = getRandomInt(0, heldItems.length);
		console.log('going to steal from '+JSON.stringify(heldItems[stealIndex]));
		let stealAmt = getRandomInt(1, heldItems[stealIndex].quantity + 1);
		console.log('stealing '+stealAmt);
		let target = -1;
		for(let i=0;i<state.hold.length;i++) {
			if(heldItems[stealIndex].name === state.hold[i].name) target = i;
		}

		state.randomMessage = 'Pirates attack your ship and steal some cargo!';
		state.damage += damage;
		state.hold[target].quantity -= stealAmt;
	}

	if(rand >= 90) {
		state.offerUpgrade = true;
	}
	
},
```

As you can see, I basically just pick a random number and based on the result, a few different things can happen. One of them (`offerUpgrade`) will actually trigger when you arrive at the port, not "in transit". 

The rest of the mutations are that interesting as the mainly apply goods changes and do repairs or upgrades. In the `getters` section, I thought these parts were neat.

```js
gameDate(state) {
	let years = Math.floor((state.turn-1)/12);
	let month = (state.turn-1) % 12;
	return `${MONTHS[month]} ${BASE_YEAR + years}`;
},
```

The `gameDate` getter is how I handle showing a date that advances month to month and year to year.

```js
rank(state) {
	// your final score is just based on money, cuz life
	if(state.money < 10000) return 'Deck Hand';
	if(state.money < 50000) return 'Ensign';
	if (state.money < 100000) return 'Lieutenant';
	if (state.money < 1000000) return 'Commander';
	//below is 10 million, just fyi ;)
	if (state.money < 10000000) return 'Captain';
	//below is 100 million, just fyi ;)
	if (state.money < 100000000) return 'Admiral';
	return 'Grand Admiral';
},
```

The `rank` getter simply returns a label based on the money you earned. Note that I used comments there to help me read the large numbers. There's an ES proposal for [numeric separators](https://2ality.com/2018/02/numeric-separators.html) that aims to make this easier. So for example, imagine if that last condition was:

```
if (state.money < 100_000_000) return 'Admiral';
```

Unfortunately this is not supported very well yet. The latest Chrome has it, but not Firefox. 

The last interesting bit was handling the cost of ship upgrades:

```js
upgradeCost(state) {
	// the cost to upgrade is based on the size of your ship;
	let cost = state.holdSize * 200 * (1 + getRandomInt(5,10)/10);
	return Math.floor(cost);
}
```

My goal here was to make it expensive, and progressively so, as you got bigger and bigger. This is something I'd tweak as folks play and provide feedback.

Anyway, I hope this demo is interesting to folks, and as always, I'm very much open to feedback and critiques of my design decisions! Let me know what you think by leaving me a comment below!

<i>Header photo by <a href="https://unsplash.com/@jcotten?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Joshua J. Cotten</a> on Unsplash</i>
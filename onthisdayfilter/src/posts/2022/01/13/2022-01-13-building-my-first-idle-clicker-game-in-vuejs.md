---
layout: post
title: "Building my First Idle Clicker Game in Vue.js"
date: "2022-01-13T18:00:00"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/van-fleet.jpg
permalink: /2022/01/13/building-my-first-idle-clicker-game-in-vuejs.html
description: How I built a simple browser game with Vue.js
---

For a while now I've been enamoured with so-called "idle" or "clicker" games. These are games that are (typically) incredibly simple, sometimes having you just click one button over and over again, and typically let you run them in the background, coming back hours later to check your progress. What makes these games interesting is that while they start simpler, as I said, with one button sometimes, they typically grow in complexity as the game goes on.

Some of the most wellknown games of this genre are [A Dark Room](https://adarkroom.doublespeakgames.com/) and [Universal Paperclips](https://www.decisionproblem.com/paperclips/index2.html). I'll warn you - before clicking either of those links, be sure you have the willpower to walk away from them. At least for me, both are incredibly addicting. They start off so simple, but then morph into something so incredibly engaging it's hard to let go. I play both maybe 2-3 times a year and typically I get obsessed with it over a three to four day period. 

As someone who loves games, I've also taken a stab at building my own games as well. I've discovered that, not surprisingly, it's a hell of a lot of work, but I still enjoy doing it from time to time. Most recently, I came up with a simple clicker game in Vue.js - [IdleFleet](https://idlefleet.netlify.app/).

Now if you want - stop reading, open the link above, and just play the game. The rest of the post will talk about how it was built, how it works, and so forth, but if you want to be surprised, now is the time to check it out. 

## The Basics

IdleFleet is based on a simple premise. You are a commander of a fleet of ships. You order them to go out and do "trade stuff". The ships of your fleet return after some random amount of time (each ship does it's own thing so they come back one by one) and you earn money. You take that money and buy more ships. Repeat.

One of the first fun things you'll see is that I use a npm package called [random-word-slug](https://www.npmjs.com/package/random-word-slugs) to name ships. This gives you fun little names like "Wet Book", "Early Printer", and "Ripe Fountain". This is done with the following function:

```js
generateShipName() {
	const options = {
		format:'title',
		partsOfSpeech: ['adjective', 'noun'],
	}
	return randomWordSlugs.generateSlug(2, options);
},
```

Like most idle clicker games, IdleFleet will slowly add more options as you play. The first option is simple a stat, "Credits Per Second", and it gets added to your display once you hit 5K credits. 

Then you get "Mercantile Skill". It opens up once you've earned 10K in credits. This is a skill that slowly improves the credits your ships earn. It can be scaled infinitely, but the price goes up in a linear fashion. I did this with a simple computed value:

```js
newMercantileCost() {
	return 10000 * this.mercantileSkill;
 },
```

The next item that opens up is Ship Speed. You can start buying that at 100K credits and it will impact how long your ship needs to travel to get credits. I'll talk a bit more about travelling in a minute. This stat uses the same formula as the Mercantile skill. 

The final unlockable is "auto ship send", which basically removes the need to click anything at all. It will run at an interval and click "Send Ships", automatically sending out every idle ship. This opens up at one million credits.

## The Not So Basics

As I said, sending your ships out is a somewhat variable process and one that evolved as I worked on the game. Initially, I designed a simple object for the ship. Here's an early version of the `addShip` function.

```js
addShip() {
	let mainThat = this;
	// idea: new name based on npm package that picks nouns
	let name = this.generateShipName();
	let newShip = {
	available: true,
	name,
	returnTime:null,
	trip() {
		mainThat.addLog(`${this.name} departed...`);
		this.available = false;
		this.tripDuration = getRandomInt(DURATION_MIN, DURATION_MAX);
		// reduce by ship speed bonus
		/*
		current logic, given X for speed, you get 1-X percent saving, maxed at 95. 
		So if ship speed is 200, most likely you will max out
		*/
		if(mainThat.shipSpeed >= 2) {
			let percentSavings = Math.min(getRandomInt(1, mainThat.shipSpeed), 95);
			console.log('percent savings based on speed is ', percentSavings);
			console.log('return time was ', this.tripDuration);
			this.tripDuration -= Math.floor((this.tripDuration * (percentSavings/100)));
			console.log('return time is now ', this.tripDuration);
		}
		console.log('trip started, returns in '+this.tripDuration+ ' seconds');
		let now = new Date();
		now.setSeconds(now.getSeconds() + this.tripDuration);
		this.returnTime = now;

		let that = this;

		setTimeout(function() {
			that.available = true;
			that.returnTime = null;
			let moneyEarned = mainThat.earnMoney();
			mainThat.addLog(`${that.name} returned and earned ${moneyEarned} credits.`);
			mainThat.credits += moneyEarned;
		}, this.tripDuration*DURATION_INTERVAL);
	}
	};
	this.ships.push(newShip);
	this.addLog(`${newShip.name} acquired.`);
},
```

That's quite a bit of logic, but it worked well, at least at first. Notice how the ship has a function, `trip`, that handles figuring out ow long the trip will be. It's random based on a min and max range that gets better as you increase your ship speed. I use a `setTimeout` to handle the ship returning. It marks it as available again and adds money to your account.

As I said, this worked great, until one of my players had a few thousand or so ships. The timeouts were making the game drag. So, I pivoted. Instead of a ship having it's own timed function, I created a central "heart beat" for the game. Now ships will simply figure out, "I return at X", and the heart beat can iterate through them and figure which ones are done.

Here's that new logic:

```js
addShip() {
	let mainThat = this;
	// idea: new name based on npm package that picks nouns
	let name = this.generateShipName();
	let newShip = {
	available: true,
	name,
	returnTime:null,
	trip() {
		mainThat.addLog(`${this.name} departed...`);
		this.available = false;
		this.tripDuration = getRandomInt(DURATION_MIN, DURATION_MAX);
		// reduce by ship speed bonus
		/*
		current logic, given X for speed, you get 1-X percent saving, maxed at 95. 
		So if ship speed is 200, most likely you will max out
		*/
		if(mainThat.shipSpeed >= 2) {
			let percentSavings = Math.min(getRandomInt(1, mainThat.shipSpeed), 95);
			//console.log('return time was ', this.tripDuration);
			this.tripDuration -= Math.floor((this.tripDuration * (percentSavings/100)));
			//console.log('return time is now ', this.tripDuration);
		}
		//console.log('trip started, returns in '+this.tripDuration+ ' seconds');
		let now = new Date();
		now.setSeconds(now.getSeconds() + this.tripDuration);
		this.returnTime = now;
	}
	};
	this.ships.push(newShip);
	this.addLog(`${newShip.name} acquired.`);
},
```

As you can see, I still have a `trip` function, but now it's just figuring out how long it will be. My heart beat function will handle checking it. I also let the user know when the *next* ship is returning. Given N ships out on a job, I report on the one that's returning the soonest.

```js
 heartBeat() {
	/*
	heartBeat now handles all ship related travel announcements. 
	*/

	let nextShipResult = new Date(2099,1,1);
	let hasNextShip = false;

	//loop through ships and see who is done
	for(let ship of this.ships) {
	//unavailable ships are traveling
	if(!ship.available) {
		if(new Date() > ship.returnTime) {
		ship.available = true;
		ship.returnTime = null;
		let moneyEarned = this.earnMoney();
		this.addLog(`${ship.name} returned and earned ${numberFormat(moneyEarned)} credits.`);
		this.credits += moneyEarned;
		} else if (ship.returnTime < nextShipResult) {
			nextShipResult = ship.returnTime;
			hasNextShip = true;
		}
	}


	}

	if(hasNextShip) {
	this.nextShipReturnTime = Math.max(Math.floor((((new Date()) - nextShipResult) / 1000) * -1),0) + ' seconds';
	} 

},
```

I also have two other timed functions. One is a simple random message generator and one is an "event" system. On startup, I request a JSON file:

```js
this.messages = await (await fetch('./messages.json')).json();
```

This messages files contains a list of five things - random messages, which have no impact on the game. Then I have a list of events that represent you winning or loosing money as well as winning or loosing ships. The file looks like this (and yes, I see the typos now, going to correct them after I finish the blog post):

```json

{
  "news": [
    "Starbrand announces new line of eco-friendly spaceships.",
    "Economic reports continue to boom - stockholders happy!",
    "Most popular social network promises edit support soon.",
    "In a recent survey, ship captains report general satisifaction with job.",
    "In a recent survey, ship captains report general dissatisifaction with job.",
    "Billions reeling as social media star switches to new toilet paper brand.",
    "Galaxy-wide Outlook service down - please use tin cans in the meantime."
  ],
  "moneyWon": [
    "A long-lost aunt left you an inheritance.",
    "You got a refund from the Intergalatic Revenus Service.",
    "You won the lottery!",
    "You found a stash of credits in the back of one of your ships.",
    "You won a lawsuit against another trader.",
    "You came in first place in a game show."
  ],
  "moneyLost": [
    "You got a tax bill from the Intergalatic Revenus Service.",
    "One of your ships needed repairs.",
    "You lost credits betting on space horses.",
    "You lost credits to email spammers.",
    "Gas prices spiked retroactively.",
    "You lost a lawsuit against another trader."
  ],
  "shipWon": [
    "Congratulations! You won a new ship on a game show!",
    "A long-lost uncle left you his ship.",
    "You found an abandoned ship and add it to your fleet.",
    "You sued another trader for their ship and won it!"
  ],
  "shipLost": [
    "A ship was lost to a black hole.",
    "Pirates blew up one of your ships!",
    "Pirates stole one of your ships!",
    "Space monkeys destroy one of your ships!"
  ]
}
```

I wanted a separate list of strings like this so that it was easy to expand when I was feeling creative. Random messages work like so:

```js
randomMsg() {
	let msg = this.messages.news[getRandomInt(0, this.messages.news.length)];
	this.addLog(`<strong>${msg}</strong>`);
},
```

Random events are a bit more complex. Since they can have a negative impact, I have to ensure you don't end up with negative money or ships. Here's that routine:

```js
randomEvent() {
	/*
	Random events fall into 4 categories:
	get money
	lose money
	get ship
	lose ship
	for $$ stuff, it's always a percentage so the rewards are good later on
	*/
	let whatHappened = getRandomInt(0, 100);

	if(whatHappened < 40) {
		let moneyWon = Math.floor(this.credits * (getRandomInt(10, 70)/100));
		let msg = this.messages.moneyWon[getRandomInt(0, this.messages.moneyWon.length)] + ` Gain ${numberFormat(moneyWon)} credits!`;
		this.credits += moneyWon;
		this.addLog(`<strong class="good">${msg}</strong>`);
	} else if(whatHappened < 80) {
		// if money is real low, do nothing
		if(this.credits < 500) return;
		let moneyLost = Math.floor(this.credits * (getRandomInt(5, 30)/100));
		let msg = this.messages.moneyLost[getRandomInt(0, this.messages.moneyLost.length)] + ` Lose ${numberFormat(moneyLost)} credits.`;
		this.credits -= moneyLost;
		this.addLog(`<strong class="bad">${msg}</strong>`);
	} else if(whatHappened < 92) {
		let msg = this.messages.shipWon[getRandomInt(0, this.messages.shipWon.length)];
		this.addLog(`<strong class="good">${msg}</strong>`);
		this.addShip();
	} else {
		/* disabled for now as I need to work on logic for removing a ship */
		return;
		if(this.ships.length < 10) return;
		let msg = this.messages.shipLost[getRandomInt(0, this.messages.shipLost.length)];
		this.addLog(`<strong class="bad">${msg}</strong>`);
		//no idea if this will break shit
		this.ships.shift();
	}

	setTimeout(this.randomEvent, (5000 * 60) + (getRandomInt(0,3000)*60));

},
```

Basically, pick a random number, and that decides on the type of event (money won, money lost, ship won, ship lost), and then I run that logic. Loosing a ship is currently disabled, but I'm going to fix that soon. (I'm pretty sure I can just remove the `return` statement.) 

All in all, it's a pretty simple game, but it's a bit fun. I would love for folks to submit ideas and PRs, you can find the complete source code here: <https://github.com/cfjedimaster/IdleFleet>. 

Enjoy!

Photo by <a href="https://unsplash.com/@markuswinkler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Winkler</a> on <a href="https://unsplash.com/s/photos/fleet-of-spaceships?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
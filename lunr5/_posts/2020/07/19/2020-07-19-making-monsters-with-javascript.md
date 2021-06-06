---
layout: post
title: "Making Monsters with JavaScript"
date: "2020-07-19"
categories: ["javascript"]
tags: []
banner_image: /images/banners/monsters.jpg
permalink: /2020/07/19/making-monsters-with-javascript
description: A look at generating random monsters in JavaScript
---

A few days ago I [blogged](https://www.raymondcamden.com/2020/07/17/testing-vuejs-application-files-that-arent-components) about how I had started on a Vue.js RPG game a while ago and never got around to putting more work into it. This may be hard to believe, but building games is pretty hard! I realized though that the parts I most looked forward too, the more creative parts, were things that I could work on and just stop worrying about actually finishing the game. 

That realization was incredibly freeing. It also immediately started the creative juices flowing. While walking my dog a few days ago (another activity that really improves my creativity) I formulated a good plan to build random monsters. One of the staples of many RPGs are random encounters. Your character, or party, is wondering the wilderness and all of a sudden they find themselves under attack.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/bt1.gif" alt="Screen shot from Bards Tale 1" class="lazyload imgborder imgcenter">
</p>

The idea I had took a base set of monsters and then applied various modifiers and randomness to them. The idea being that you could have a small of monsters that would "scale up" to many more unique ones. Now, by "unique" I mean something like comparing a blue gremlin to a red gremlin. Many old games would take a base monster, apply a color shift to it, and call it done. Here's the basic flow of what I built.

First - define an array of monsters. For now, I just have five: 

```js
const baseMonsters = [
	{
		name: "rat", 
		str: "1d3", 
		dex: "1d4",
		int: "1d3", 
		hp: "1d4"
	},
	{
		name: "pig",
		str: "1d4", 
		dex: "1d3", 
		int: "1d6", 
		hp: "1d4"
	}, 
	{
		name: "gremlin", 
		str: "1d3", 
		dex: "1d4", 
		int: "1d4", 
		hp: "1d4"
	}, 
	{
		name: "skeleton", 
		str: "1d6", 
		dex: "1d6", 
		int: "1d4", 
		hp: "1d6+2"
	},
	{
		name: "flying lizard", 
		str: "2d6", 
		dex: "2d6", 
		int: "1d6", 
		hp: "2d6"
	}
];
```

Each monster has a name, three attributes related to how well they fight (my game only has strength, dexterity, and intelligence) and their hit points. For each stat I assign dice rolls applicable for their respective strength as a creature. This was kinda arbitrary of course. I gave rats higher (possible) dexterity because I figured they were quick. I gave gremlins higher intelligence because, well, gremlins. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/gremlin.jpg" alt="Gremlin from the old movie" class="lazyload imgborder imgcenter">
</p>

So the first step is to select one and then run the dice rolls for each stat. Next, there is a chance that a monster has a boon. A boon is a positive or negative change to one part of their stats. The chance for this change is based on a constant:

```js
const boonChance = 20;
```

This is out of a 100, but I also make it a bit higher if the monster is scaled higher. I haven't mentioned scales yet but I will in a second. Here's the function that determines if the monster has a boon:

```js
/*
As described above, it's the boonChance, which is kinda low, but the higher the scale, the higher
the change of a boon. Right now its boonChance + 2*scale
*/
function hasBoon(scale) {
	let chance = boonChance + (2*scale);
	return (misc.getRandomIntInclusive(0, 100) < chance);
}
```

If true, I then flip a coin to see if it's a good or bad one:

```js
let positive = 1;
if(misc.getRandomIntInclusive(0,100) > 50) positive = -1;
```

Now I figure out what stat is changed by just picking a number from 1 to 3 (ok technically 0 to 2):

```js
let boonType = misc.getRandomIntInclusive(0, 2);
```

Now I have an if statement and based on boonType, either change STR, DEX, or INT. The boon does two things. It adds, or subtracts, a 1D6 value (roll a six sided die one time). For example:

```js
monster.str += positive * dice.roll('1d6');
if(monster.str < 1) monster.str = 1;
```

Notice I also ensure the value doesn't go below 1. Next, I wanted a way to let the player know that there's something special about this creature. I created a list of "titles" for each stat and each type of boon, as well as whether they were positive or negative.

```js
const boons = {
	str: {
		positive: ["strong", "ripped", "beefy"], 
		negative: ["weak", "wimpy", "pushover", "meek"]
	}, 
	dex: {
		positive: ["quick", "nimble", "spry", "dexterous"], 
		negative: ["clumsy", "fumbly"]
	}, 
	int: {
		positive: ["smart", "brilliant", "intelligent"],
		negative: ["slow", "dumb", "dull"]
	}
}
```

At this point, we've got a random monster, with random stats, although stats that make sense for how strong they are in general, and a potential boon that impacts their name, so for example, if face a clumsy pig, you may know this means their dexterity is lower than normal.

Alright, the final part comes in the scale I previously mentioned. In most RPGs, the monsters closer to you when you start out or relatively easy to take on. The farther you move away from the starting point, the stronger they get. My utility takes a scale argument. This scale can be any number. For example, a scale of 1.2 means a monster bit higher than normal. The scale does two things.

First, it improves every stat:

```js
monster.str = Math.floor(scale * monster.str);
monster.dex = Math.floor(scale * monster.dex);
monster.int = Math.floor(scale * monster.int);
monster.hp = Math.floor(scale * monster.hp);
```

And remember, this is done after a boon. So a monster that got a bonus to strength will be incredibly strong after the scaling. Next, I created a set of titles that helped reflect the higher scale. 

```js
const scaledTitles = [
	["experienced", "tough"],
	["expert", "trained", "veteran"],
	["elite", "master", "powerful", "lord"],
	["epic", "god-like", "super-powered"]
];
```

Scale titles are only used when the scale is above 2. A scale of 2.0 to 2.9 will use a random title from the first index of scaledTitles, and so forth. If you pass a scale of 5 or 6, it uses the highest tier.

```js
if(scale >= 2) {
	scale = Math.floor(scale);
	scale -= 2;
	if(scale > scaledTitles.length-1) scale = scaledTitles.length-1;
	let picked = misc.getRandomIntInclusive(0, scaledTitles[scale].length-1);
	monster.name =  scaledTitles[scale][picked]+ ' ' + monster.name;
}
```

So just to recap - while I only have 5 monsters now, the total number of variations is really high. And even better, to improve the set of possibilities, I can add a new base monster, add new boon titles, new scaled titles, as they come to me. Every single addition is a multiplicative change. I'll be honest, the actual is probably so so in terms of quality. I don't care. What excites me is that as soon as I get a creative idea, it's an incredible simple change!

Following the tip I [previously posted](https://www.raymondcamden.com/2020/07/17/testing-vuejs-application-files-that-arent-components) about, I wrote a quick test script:

```js
/*
Ray, run with: node -r esm test.js
*/

import { monsterMaker } from '../src/utils/monsterMaker'


console.log('no scale');
console.log(monsterMaker.create());

console.log('\nscale 1.5');
console.log(monsterMaker.create(1.5));

console.log('\nscale 2');
console.log(monsterMaker.create(2));

console.log('\nscale 3');
console.log(monsterMaker.create(3));

console.log('\nscale 4');
console.log(monsterMaker.create(4));

console.log('\nscale 5');
console.log(monsterMaker.create(5));

console.log('\nscale 6');
console.log(monsterMaker.create(6));
```

And here's some results:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/monsters.jpg" alt="List of resulting monsters" class="lazyload imgborder imgcenter">
</p>

You can find this repo at <https://github.com/cfjedimaster/vue-demos/tree/master/grpg>. Feel free to make PRs to add new monsters and titles.

<span>Photo by <a href="https://unsplash.com/@polarmermaid?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Anne Nygård</a> on <a href="https://unsplash.com/s/photos/monsters?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
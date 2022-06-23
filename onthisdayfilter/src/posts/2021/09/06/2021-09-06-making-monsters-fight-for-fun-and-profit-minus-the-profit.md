---
layout: post
title: "Making Monsters Fight for Fun and Profit (minus the profit)"
date: "2021-09-06T18:00:00"
categories: ["javascript"]
tags: ["pipedream"]
banner_image: /images/banners/miniature_monster.jpg
permalink: /2021/09/06/making-monsters-fight-for-fun-and-profit-minus-the-profit.html
description: How I built a bot to pit two monsters against each other while learning about some cool npm packages.
---

My frequent readers (do I have those?) will know I've got a thing for building random Twitter bots. I just like randomness in general. A few days ago I was thinking about an API I had run across, the [Dungeons and Dragon's API](https://www.dnd5eapi.co/). This is a free, simple to use API that returns information related to D &amp; D. Pretty much every aspect ofthe ruleset is available via the API. Part of the API is deep information about [monsters](https://www.dnd5eapi.co/docs/#monster-section). 

This got me thinking about what I could build with that information. I thought it would be kind of fun to pit these creatures against each other. Not in the "Godzilla vs Kong" fashion, but something simpler and - of course - sillier. 

With that - I built [@monsterconflict](https://twitter.com/monsterconflict), a bot that shares a conflict between two different creatures. Here's a few examples:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">A lawful neutral Satyr and a chaotic neutral Deep Gnome (Svirfneblin) are having a misunderstanding over a kitchen.<br>They resolve their issue by discussing the merits of cats instead.</p>&mdash; monsterconflict (@monsterconflict) <a href="https://twitter.com/monsterconflict/status/1434957813546094601?ref_src=twsrc%5Etfw">September 6, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">A chaotic evil Kobold and a lawful neutral Lion are having a misunderstanding over a mouse.<br>They resolve their issue with an epic dance off.</p>&mdash; monsterconflict (@monsterconflict) <a href="https://twitter.com/monsterconflict/status/1434837001405075459?ref_src=twsrc%5Etfw">September 6, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Building this was fun because I ran into some interesting issues with the language of the conflict. Resolving those issues introduced me to some cool npm modules as well. Everything is built on Pipedream and you can see a complete copy (and fork it) here: <https://pipedream.com/@raymondcamden/peaceful-d-d-bot-p_mkCGly6>

The first step the bot takes is to get a list of all the monsters. This is done by making a call to <https://www.dnd5eapi.co/api/monsters>. That API returns an index of monsters that looks like so:

```json
{
  "count": 332,
  "results": [
    {
      "index": "aboleth",
      "name": "Aboleth",
      "url": "/api/monsters/aboleth"
    },
    {
      "index": "acolyte",
      "name": "Acolyte",
      "url": "/api/monsters/acolyte"
    },
    {
      "index": "adult-black-dragon",
      "name": "Adult Black Dragon",
      "url": "/api/monsters/adult-black-dragon"
    },
	//lots more
  ]
}
```

I figured this data doesn't change too often, so I made use of Pipedream's `$checkpoint` feature for some simple caching. Here's the entire workflow step:

```js
async (event, steps) => {
	const { default: fetch } = await import('node-fetch');

	// length to cache in ms (five days)
	const CACHE_LENGTH = 5 * 24 * 60 * 60 * 1000;

	if($checkpoint && $checkpoint.monsterCache && $checkpoint.monsterCache.lasthit) {
		let lasthit = $checkpoint.monsterCache.lasthit;
		let now = new Date().getTime();
		console.log(`duration is ${now-lasthit}ms`);
		if(now - lasthit < CACHE_LENGTH) this.monsters = $checkpoint.monsterCache.monsters;
		if(this.monsters) console.log('i used the cached version');
	}

	if(!this.monsters) {
		console.log('need to fetch monsters');
		//first get all the monsters
		let resp = await fetch('https://www.dnd5eapi.co/api/monsters');
		let data = await resp.json();
		this.monsters = data.results;
		if(!$checkpoint) $checkpoint = {};
		$checkpoint.monsterCache = {
			lasthit:new Date().getTime(),
			monsters:data.results
		}
	}
}
```

Dylan Sather of Pipedream shared [this workflow](https://pipedream.com/@dylan/cache-data-for-one-day-p_6lCkrAR/edit) as another example of using `$checkpoint` to cache network calls. Be sure to check his example for a much nicer version of what I did above. 

So - at this point we have a list of all the monsters. Selecting two by random is trivial. Initially I then made calls to the API to fetch more information about the creatures. But I realized I was only using one piece of information from that detail - the alignment. While I like the idea of my creature having it's "real" (according to the rules) alignment, I figured that having a random one instead would both save me two network calls and make things a bit more random. The next step handles that.

```js
async (event, steps) => {
	const { default: fetch } = await import('node-fetch');

	getRandomInt = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}

	randomAlignment = function() {
		let law = ["lawful","neutral","chaotic"];
		let good = ["good","neutral","evil"];
		let alignment = law[getRandomInt(0,3)] + ' '+good[getRandomInt(0,3)];
		if(alignment === 'neutral neutral') alignment = 'neutral';
		return alignment;
	}

	this.monsterA = steps.get_monsters.monsters[getRandomInt(0, steps.get_monsters.monsters.length )].name;
	//theoretically possible to select the same monter twice, I'm ok with that
	this.monsterB = steps.get_monsters.monsters[getRandomInt(0, steps.get_monsters.monsters.length )].name;

	// sometimes a creature name is: Werewolf, human form. Drop that
	this.monsterA = this.monsterA.replace(/,.*/, '');
	this.monsterB = this.monsterB.replace(/,.*/, '');

	this.monsterAAlignment = randomAlignment();
	this.monsterBAlignment = randomAlignment();
}
```

Basically I'm just getting random values from arrays - either my list of monsters or the list of alignment types. D&D supports the idea of "true neutral" which I just return as "neutral". Also, the monster names sometimes had things after a comma that I just drop.

Alright, now comes the interesting bit. I've got my two monsters - it's time to put them in conflict. I went with a generic form that looked like this:

<blockquote>
Monster A and Monster B are TYPEOFCONFLICT over NOUN. They resolve it RESOLUTION.
</blockquote>

For "TYPEOFCONFLICT", I just made an array of types of conflicts. Some serious, most silly. The NOUN part was interesting. I used the npm package [random-word-slugs](https://www.npmjs.com/package/random-word-slugs) to generate a noun. This is typically used to create random strings based on real words. I use it to simply select a noun. This worked well into I noticed a problem. I began to see results like this: so and so are fighting over a umbrella". The "a" in that sentence shuold be "an". At first I thought I'd just write a utility function to check the noun and see if it starts with a vowell, but then I remembered there were exceptions, like unicorn. Turns out there's yet another npm package for this, [indefinite](https://www.npmjs.com/package/indefinite). Give it a string and it will return "a" or "an". This worked well, if a bit complex in code. Here's the entire step:

```js
async (event, steps) => {
	// import { generateSlug } from "random-word-slugs";
	const indefinite = require('indefinite');
	const { generateSlug } = await import('random-word-slugs');
	const fightTypes = ["argument","heated discussion","Facebook comments argument","fight","misunderstanding",
	"war of words","confrontation","verbal battle","debate","violent disagreement"];
	const resolveTypes = [
	"over a cup of tea",
	"with a good hug",
	"by calmly discussing their problem",
	"with an epic dance off",
	"by discussing the merits of cats instead"
	];

	getRandomInt = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}

	let conflict = generateSlug(1, { 
		partsOfSpeech:['noun'], 
		format: 'lower' });

	let fight = fightTypes[getRandomInt(0, fightTypes.length)];

	let resolution = resolveTypes[getRandomInt(0, resolveTypes.length)];
		
	this.conflict_text = `
	${indefinite(steps.select_monsters.monsterAAlignment, {capitalize:true})} ${steps.select_monsters.monsterA} and ${indefinite(steps.select_monsters.monsterBAlignment)} ${steps.select_monsters.monsterB} are having a ${fight} over ${indefinite(conflict)}.
	They resolve their issue ${resolution}.
	`;
}
```

Like I said - that last line there is a bit hard to read in my opinion, but it works so I'm not touching it. And that's it. The last step just posts the text to Twitter and that's the entirety of the bot. Don't forget you can see the entire thing here: <https://pipedream.com/@raymondcamden/peaceful-d-d-bot-p_mkCGly6>.

Photo by <a href="https://unsplash.com/@polarmermaid?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Anne Nygård</a> on <a href="https://unsplash.com/s/photos/monsters?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
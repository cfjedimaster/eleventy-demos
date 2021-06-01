---
layout: post
title: "Designing Random Encounters for my Vue RPG"
date: "2020-08-19"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/deer-road.jpg
permalink: /2020/08/19/designing-random-encounters-for-my-vue-rpg
description: Describing the game design for random enouncters in a Vue.js RPG
---

So I'm still piddling away at my RPG in Vue.js. To be clear, I'm never going to finish it. But you can read about it here ([Testing Vue.js Application Files That Aren't Components](https://www.raymondcamden.com/2020/07/17/testing-vuejs-application-files-that-arent-components)) and here ([Making Monsters with JavaScript](https://www.raymondcamden.com/2020/07/19/making-monsters-with-javascript)). Over the past few months I've been slowly reading an incredible book for RPG lovers, [The CRPG Book](https://www.amazon.com/gp/product/1999353307/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1999353307&linkCode=as2&tag=raymondcamd06-20&linkId=077052bcad5a83b2c2d8292cc5b61619). It's a review of over 400 games over the past 40 years of computer role-playing. 

While reading the book, I'm discovering some cool features that older games had and that I missed while growing up. (Or possibly just don't remember.) A few games have mentioned using encounters with simple "Choose Your Own Adventure" logic. Basically, you are presented with something and given a choice of options. No combat, just simple choices. 

The more I thought about this the more I thought it could be an interesting part of my game. If you imagine that there's a random chance of combat as you walk around (part of the core gameplay I want to have), then there could be a smaller chance of a simple encounter. I'd imagine these happening maybe once or twice per gameplay so somewhat rare, but they would be a break from the typical combat encounter.

I designed my system with the following features:

* Encounters are in an array, randomly chosen.
* Each encounter has hard coded text and is static.
* Each enouncter has hard coded options.
* However, each option has random results.
* Results can impact player stats, for example, draining health or giving your gold.
* Finally, each encounter has an optional "prereq". This is a 'safety' check to make things a bit easier for results. So if a result drains 10 gold, I don't want to have to worry about negative balances. Ditto for death. While I'm fine with an encounter harming you, I didn't want it to kill you. I can say this point is one I'm reconsidering and may roll back. For gold, I could simply let it take all your gold and leave you at 0, and for harmful encounters, it may be kinda fun if some could actually kill you.

My data structure than looks like so:

<ul>
<li>prereq: If passed, a string that is evaluated against player data, like "hp>10". If false, this encounter can't happen.</li>
<li>text: The text of the encounter.</li>
<li>options: An array of options where:
<ul>
<li>text: The text of the option</li>
<li>results: An array of results based on this option where one is randomly selected. Each result has:
<ul>
<li>text: The text describing the result.</li>
<li>effect: An effect, if any, on the player, also a string that is evaluated, like gold+=10.</li>
</ul>
</ul>
</li>
</ul>

Here's an example:

```js
{
	prereq:'gold>0 && hp>0',
	text:'You meet a beggar who asks for help. He looks desperate.',
	options: [
		{
			text: 'Give a gold coin to him.',
			results:[
				{ text: 'The beggar thanks you!', effect:'gold--' }, 
				{ text: 'The beggar thanks you, winks, and dissappears.', effect:'gold += 300'}, // it was a god or whatever in disguise
				{ text: 'The beggar smirks and punches you!', effect:'hp--' }
			]
		},
		{
			text: 'Walk away.',
			results:[
				{ text: 'The beggar spits at you!', effect:'' }, // no effect
				{ text: 'The beggar growls and punshes you!', effect:'hp--' }
			]
		},

	]
},
```

The JavaScript utility has two main methods. The first returns a random encounter that's filtered by prereqs. A player object is passed in (I'm not using TypeScript so what I really mean is a "simple object representation" of the player). The next method takes a player object, an encounter, and a selected option. It figures out the random result and applies the effect. Here's the entire utility.

```js
import { misc } from './misc'

const data = [
	{
		prereq:'gold>0 && hp>0',
		text:'You meet a beggar who asks for help. He looks desperate.',
		options: [
			{
				text: 'Give a gold coin to him.',
				results:[
					{ text: 'The beggar thanks you!', effect:'gold--' }, 
					{ text: 'The beggar thanks you, winks, and dissappears.', effect:'gold += 300'}, // it was a god or whatever in disguise
					{ text: 'The beggar smirks and punches you!', effect:'hp--' }
				]
			},
			{
				text: 'Walk away.',
				results:[
					{ text: 'The beggar spits at you!', effect:'' }, // no effect
					{ text: 'The beggar growls and punshes you!', effect:'hp--' }
				]
			},

		]
	},
	{
		prereq:'hp>0',
		text:'You hear a growl from behind you.',
		options: [
			{
				text: 'Put on a brave face.',
				results:[
					{ text: 'You seem to have scared off whatever was stalking you.', effect:'exp+=100' }
				]
			},
			{
				text: 'Run away',
				results:[
					{ text: 'You run until your out of breath.' , effect:'' }, // no effect
					{ text: 'You run, but trip and sprain your ankle!', effect:'hp--' }
				]
			},

		]
	}
]
export const encounterMaker = {
 
	// given a player ob, find an encounter they can do
	select(player) {
		let possibleEncounters = data.filter(d => {
			if(!d.prereq) return true;
			let prereq = fixEvalString(d.prereq);
			return eval(prereq);
		});
		if(possibleEncounters.length === 0) return null;
		return possibleEncounters[misc.getRandomIntInclusive(0, possibleEncounters.length-1)];
	},
	resolve(player, encounter, choice) {
		if(choice >= encounter.options.length) choice = 0;
		let selected = encounter.options[choice];
		let result = selected.results[misc.getRandomIntInclusive(0, selected.results.length-1)];
		console.log('result for '+choice, result);
		if(result.effect != '') {
			console.log(player);
			eval(fixEvalString(result.effect));
			console.log(player);
		}
		return player;
	}

}

// utility function to fix eval string to include player
function fixEvalString(str) {
	str = str.replace(/gold/g, 'player.gold');
	str = str.replace(/hp/g, 'player.hp');
	str = str.replace(/exp/g, 'player.exp');
	return str;
}
```

The two methods I described above are defined as `select` and `resolve`. Notice that I wrote a function, `fixEvalString`, that can be used by my prereqs and effects to modify the player. This feels like bad code. I mean, eval is bad in general. Given that I know the "shape" of my player data I could switch to another way of doing this, but I'll worry about that when I finish the game, which is, you know, never. 

I did build a utility to help test this, and here's what it looks like:

```js
/*
Ray, run with: node -r esm test.js
*/

import { encounterMaker } from '../src/utils/encounterMaker'

console.log('basic player');
console.log(encounterMaker.select({
	gold:10,
	hp:10
}));

console.log('poor player');
console.log(encounterMaker.select({
	gold:0,
	hp:10
}));

console.log('dead player');
console.log(encounterMaker.select({
	gold:10,
	hp:0
}));
console.log('---------------------------------');
console.log('basic player resolve');
let player = {
	gold:10, hp: 10, exp:200
};
let enc = encounterMaker.select(player);
console.log('chosen enc', enc);
player = encounterMaker.resolve(player, enc, 0);
console.log('Player at end', player);
player = encounterMaker.resolve(player, enc, 1);
console.log('Player at end2', player);
```

As you can see, I've got a few `select` calls and a few `resolve` ones. The output looks like so:

```
basic player
{
  prereq: 'hp>0',
  text: 'You hear a growl from behind you.',
  options: [
    { text: 'Put on a brave face.', results: [Array] },
    { text: 'Run away', results: [Array] }
  ]
}
poor player
{
  prereq: 'hp>0',
  text: 'You hear a growl from behind you.',
  options: [
    { text: 'Put on a brave face.', results: [Array] },
    { text: 'Run away', results: [Array] }
  ]
}
dead player
null
---------------------------------
basic player resolve
chosen enc {
  prereq: 'gold>0 && hp>0',
  text: 'You meet a beggar who asks for help. He looks desperate.',
  options: [
    { text: 'Give a gold coin to him.', results: [Array] },
    { text: 'Walk away.', results: [Array] }
  ]
}
result for 0 { text: 'The beggar thanks you!', effect: 'gold--' }
{ gold: 10, hp: 10, exp: 200 }
{ gold: 9, hp: 10, exp: 200 }
Player at end { gold: 9, hp: 10, exp: 200 }
result for 1 { text: 'The beggar spits at you!', effect: '' }
Player at end2 { gold: 9, hp: 10, exp: 200 }
```

You can find the complete repo at <https://github.com/cfjedimaster/vue-demos/tree/master/grpg>. I think next I'm going to take a stab and creating a map. I've been hashing around some ideas for a few weeks now and I think I'm ready to put pen to paper so to speak. 

<span>Photo by <a href="https://unsplash.com/@ttoommy?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Tommy Tang</a> on <a href="https://unsplash.com/s/photos/encounter?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
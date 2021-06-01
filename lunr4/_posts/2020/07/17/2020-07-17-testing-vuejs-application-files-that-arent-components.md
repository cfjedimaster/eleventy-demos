---
layout: post
title: "Testing Vue.js Application Files That Aren't Components"
date: "2020-07-17"
categories: ["javascript","serverless"]
tags: ["vuejs"]
banner_image: /images/banners/catsleeping1.jpg
permalink: /2020/07/17/testing-vuejs-application-files-that-arent-components
description: Working with Vue.js application files outside the "normal" context of Vue apps
---

Ok, before I begin, a *huge* disclaimer. My confidence on this particular tip is hovering around 5% or so. Alright, so some context. I'm working on a game in Vue.js. Surprise surprise. It probably won't ever finish, but I'm having some fun building small parts of it here and there. The game is an RPG and one of the first things I built was a basic dice rolling utility.

In my Vue application, I created a `utils` folder and made a file `dice.js`. I used this setup because I wasn't building a component, but rather a utility that my Vue components could load and use. My dice utility takes strings like this - `2d6` - which translate to "roll a six sided die 2 times". It even supports `2d6+2` which means to "roll a six sided die 2 times and 2 to the final result". It's rather simple string parsing, but here's the entirety of it:

```js
export const dice = {

	roll(style) {
		let bonus=0, total=0;
		if(style.indexOf('+') > -1) {
			[style, bonus] = style.split('+');
		} 
		
		let [rolls, sided] = style.split('d');
		
		//console.log(rolls, sided);
		for(let i=0;i<rolls;i++) {
			total += getRandomIntInclusive(1, sided);
		}
		total += parseInt(bonus);
		return total;
	}
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
```

In one of my Vue components, I use it like so:

```js
import { dice } from '@/utils/dice';

export default {
	data() {
		return {
			newName:'gorf',
			str: '',
			dex: '',
			int: ''
		}
	}, 
	created() {
		this.reroll();
	},
	computed: {
		cantContinue() {
			return this.newName == ''
		}
	},
	methods: {
		reroll() {
			this.str = dice.roll('3d6');
			this.dex = dice.roll('3d6');
			this.int = dice.roll('3d6');
		},
		start() {
			this.$store.commit('player/setName', this.newName);
			this.$store.commit('player/setStats', { str: this.str, dex: this.dex, int: this.int });
			this.$router.replace('game');
		}
	}
}
```

I import the dice code and then can make calls to it for my UI. Nothing too crazy here, but I ran into an interesting issue today. My initial version of `dice.js` didn't support the "+X" syntax. I wanted to add it, but also wanted a quick way to test it.

So I could have simply gone into my Vue component and add some random tests to the `created` block, something like:

```js
console.log(dice.roll('2d6+2'));
```

And that would work, but as I developed, I'd have to wait for Vue to recompile and reload my page. In general that's pretty speedy, but what I really wanted to do was write a quick Node script and run some tests at the CLI. To be clear, not unit tests, just literally a bunch of console logs and such. That may be lame, but I thought it might be quick and simple.

However... it wasn't. If you look back at the source of dice.js, you'll see it's *not* using `module.exports` but just a regular export.  This was my test:

```js
import { dice } from '../src/utils/dice'

// just some random rolls
for(let i=1;i<4;i++) {
	for(let k=3;k<10;k++) {
		let arg = i+'d'+k;
		console.log('input = '+arg, dice.roll(arg));
	}
}

console.log(dice.roll('2d6+2'));
```

And this was the result:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/vrpg1.jpg" alt="Error output from script" class="lazyload imgborder imgcenter">
</p>

Ok, so an admission. I'm still a bit hazy on the whole module thing in Node, and JavaScript in general. I've used require, imports, exports, but I wouldn't pass a technical interview question on them. I hope you don't think less of me. Honestly. 

That being said, the error kinda made sense, but I didn't want to use the `.mjs` extension because I didn't know if that would break what the Vue CLI does. 

I was about to give up and was actually considering adding a route to my Vue application just for debugging.

Thankfully, StackOverflow came to the rescue. I found [this solution](https://stackoverflow.com/a/54090097/52160) which simply required me adding `esm` and then running my code like so: `node -r esm testDice.js`.  It worked perfectly! And because my memory is crap, I added this to the top of the file:

```js
/*
Ray, run with: node -r esm test.js
*/
```

Yes, I write notes to myself in comments. You do too, right?

Anyway, I hope this helps others, and I'm more than willing to be "schooled" about how this could be done better. Just leave me a comment below!

<span>Photo by <a href="https://unsplash.com/@seven_77?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Nancy Yang</a> on <a href="https://unsplash.com/s/photos/cats-sleeping?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
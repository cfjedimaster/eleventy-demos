---
layout: post
title: "Another Vue Game Demo - Hangman"
date: "2019-12-26"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/words.jpg
permalink: /2019/12/26/another-vue-game-demo-hangman
description: 
---

I decided to wrap up my year with one last post... and yet another web game built with my favorite framework, Vue.js. Many, *many* years ago (like, 2010) I built a Hangman game using Adobe AIR. For folks who don't remember, AIR was a product that let you use Flash, Flex, or HTML to build cross-platform desktop and mobile applications. I thought it was pretty neat, but it's gone the way of many of Adobe's developer products and is best left in the past. I thought I'd take a stab at building the game in Vue.js.

For folks who may not know, [Hangman](https://en.wikipedia.org/wiki/Hangman_(game)) is a word guessing game. You're presented with a series of blank characters and must select letters you think make up the word. Every correct choice will make the character show up in the word. Every incorrect choice will bring you closer to "death", death being represented by a stick figure that gets closer to completion on every mistake. 

My game would need to:

* Select a random word
* Display the word as blanks (or dashes)
* Let you type to pick letters
* Update the display based on your choice, either filling in correct letters or drawing the stick figure
  
I got everything working and if you want to stop reading this boring blog post and just play, head over here: <https://hangman.raymondcamden.now.sh/>

Now let me share some of the tidbits on how I built it.

### Finding Words

The first thing I did was find my source of words. I found this repository (<https://github.com/first20hours/google-10000-english>) which contains the ten thousand most common English words. One list had the swear words removed so I used that. It ended up as 9894 words which felt like more than enough. 

Originally my plan was to store the words in IndexedDB and select a random result from there ([Selecting a random record from an IndexedDB Object Store](https://www.raymondcamden.com/2014/11/30/Selecting-a-random-record-from-an-IndexedDB-Object-Store)). But then I realized that the word list was only 74k. While I still think it would make sense to cache this locally, I decided it was ok to skip that for now. 

I set up an action in Vuex to handle fetching the words, splitting the text file by new lines, and handling the random selection. Here's that code:

```js
async selectWord(context) {
	//did we load the words yet?
	if(context.state.words.length === 0) {
		let resp = await fetch('./words.txt');
		let text = await resp.text();
		context.commit('setWords', text.split('\n'));
	}
	let selected = context.state.words[getRandomInt(0, context.state.words.length)];
	context.commit('initGame', selected);
}
```

As you can see, I do cache the network call so if you play multiple times in one session, it won't need to reload the data.

### The Game

So I described the steps of the game above. I showed the random word selection logic above, let me share a few more interesting bits.

When you play the game, the word you have to figure out is displayed as a series of dashes, like so:

<img src="https://static.raymondcamden.com/images/2019/12/hang1.png" alt="Game display" class="imgborder imgcenter">

This is done via a Getter that handles recognizing what letters you've guessed:

```js
maskedWord(state) {
	let maskedWord = '';
	for(let i=0;i<state.word.length;i++) {
		let char = state.word.charAt(i);
		if(state.pickedLetters.indexOf(char) === -1) {
			maskedWord += '-';
		} else {
			maskedWord += char;
		}
	}
	return maskedWord;
}
```

In the same area, I use a Getter to return the image to display, based on the number of incorrect guesses. 

```js
hangman(state) {
	if(state.misses === 0) return "images/h0.png";
	if(state.misses === 1) return "images/h1.png";
	if(state.misses === 2 || state.misses === 3) return "images/h2.png";
	if(state.misses === 4) return "images/h3.png";
	if(state.misses === 5) return "images/h4.png";
	if(state.misses === 6 || state.misses === 7) return "images/h5.png";
	return "images/h6.png";
},
```

The images themselves come from the Wikipedia page and could be fancier, but it works. 

Playing the game requires keyboard input which I detailed back in [August](https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app) (and have used multiple times since then). 

There is one interesting part of the keyboard handling code - I used a hack I found multiple times to see if the input was a letter:

```js
doGuess(e) {
	let letter = String.fromCharCode(e.keyCode).toLowerCase();
	// hack as seen on multiple SO posts
	if(letter.toUpperCase() === letter.toLowerCase()) return;
	this.$store.dispatch('guess', letter)
}
```

Honestly the hack feels a bit dangerous, but as I said, I saw this used *a lot* so I figure, it's got to be safe, right?

The last bit I think I is interesting is how I handle checking if the game is over:

```js
guess(context, letter) {
	context.commit('addLetter', letter);

	// did we win?
	if(context.getters.maskedWord === context.state.word) {
		context.commit('gameOver', true);
	}
	if(context.state.misses === MAX_MISSES) {
		context.commit('gameOver', false);
	}

},
```

Checking if the maskedWord equals the real word feels smart which probably means I did it wrong. 

### Am I doing this right?

Most of the logic is done in my Vuex store and honestly, it felt a bit off to me. I've been spending this entire year working on getting more practice with Vue applications and Vuex in particular, but I still feel like I'm figuring out to best place to put my logic. 

I try to keep "complex logic" in a separate file and let Vuex simply handle proxying calls to it. In general, and I want to write about this in a longer form, I'd setup my Vue apps like so:

* Main components handle UI and use code to handle events.
* On those events, it calls out to Vuex to handle loading and storing data.
* Finally, business logic is handled in their own specific files.
  
This is flexible of course, but it's generally where I'm trying to organize things. Like I said, I'm going to write this up in a more formal sense later on. 

Anyway, it's a game and it's fun to play! If you want to see the complete source, check out the repo here: <https://github.com/cfjedimaster/vue-demos/tree/master/hangman>. You can play it yourself here: <https://hangman.raymondcamden.now.sh/> As always, let me know what you think by leaving me a comment below!

<i>Header photo by <a href="https://unsplash.com/@ilumire?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jelleke Vanooteghem</a> on Unsplash</i>
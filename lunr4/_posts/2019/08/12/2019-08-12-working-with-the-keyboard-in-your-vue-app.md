---
layout: post
title: "Working with the Keyboard in your Vue App"
date: "2019-08-12"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/typebars.jpg
permalink: /2019/08/12/working-with-the-keyboard-in-your-vue-app
description: 
---

This weekend I started working on another game in Vue.js (if you're curious, you can take a peak at it [here](https://taipan.raymondcamden.now.sh/) if you want). For part of the game I wanted to really make use of the keyboard for interaction. My goal, and I won't make it 100%, is a game where you can use the keyboard for the entire time you play. I knew that JavaScript had access to keyboard events, but I had never tried using them in Vue. Before I share what I found, I want to give a shoutout to [LinusBorg](https://forum.vuejs.org/u/LinusBorg) of the Vue forums. The good stuff below is all him, the bad stuff and mistakes are my fault.

Alright, so let's start with a simple example. If you look at the Vue docs for event handling, you'll find a specific section that talks about [key modifiers](https://vuejs.org/v2/guide/events.html#Key-Modifiers). This section discusses how you can add shortcuts to listen for specific keys. While not exactly what I was looking for, it reassured me that working with the keyboard was going to be easy. So for example, this will fire an event on every `keyup` call:

```html
<input @keyup="keyEvent">
```

This modification will only fire when the enter key is pressed:

```html
<input @keyup.enter="keyEvent">
```

Cool! But notice how the event is bound to an input field. For my needs, I wanted keyboard handling at the "app" level, by that I mean without having to use an input field first. Consider this example.

```html
<div id="app" v-cloak @keyup.enter="test('div enter', $event)" @keyup="test('div',$event)">
  <input @keyup="test('input', $event)"><br/>
  enter only: <input @keyup.enter="test('second input', $event)">
</div>
```

I've got multiple uses of `keyup` here. I'm passing a label to my test handler as well as the `$event` object. I listen, twice, at the `div` level, and then once for each input field. My handler just echoes out what was passed in:

```js
test(where, e) {
	console.log(`keyuptest at ${where} with code ${e.keyCode}`);
}
```

The result is interesting. If you type outside of any input field, nothing is registered. But if you first click into one of the two input fields, things work as expected. Both the input handler and div handler will fire. You can test this yourself at my [Codepen](https://codepen.io/cfjedimaster/pen/rXbywY?editors=1111). 

So a bit more Googling, and I came across this Vue.js forum post: [Capture keypress for all keys](https://forum.vuejs.org/t/capture-keypress-for-all-keys/14560). In it, the poster asks about responding to any and all keypress events globally across the app. LinusBorg came up with a simple solution that boils down to this:

```js
mounted() {
	window.addEventListener("keypress", e => {
		console.log(String.fromCharCode(e.keyCode));
	});
}
```

In my testing, this worked great, but I ran into an interesting issue. My game makes use of routing and I only need to listen for keyboard events in one route. When I'd leave that route and return, the event listener would get bound again. The more I did this, the more duplicate event handlers were being bound for `keypress`. 

I struggled with this some more, and again, LinusBorg came up with a solution. I knew about `window.removeEventListener`, but it doesn't work with anonymous functions. The solution was to just use a Vue method for both registering and removing the event. That may not make sense, but here's a simple example:

```js
created() {
	window.addEventListener('keypress', this.doCommand);
},
destroyed() {
	window.removeEventListener('keypress', this.doCommand);
},
methods: {
	doCommand(e) {
		let cmd = String.fromCharCode(e.keyCode).toLowerCase();
		// do stuff
	}
}
```

And that's it! Of course, things are a bit more complex in my game, but I'll leave those bits for the post describing my game. As always, I hope this helps!

<i>Header photo by <a href="https://unsplash.com/@bulgakovmihaly?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Csabi Elter</a> on Unsplash</i>
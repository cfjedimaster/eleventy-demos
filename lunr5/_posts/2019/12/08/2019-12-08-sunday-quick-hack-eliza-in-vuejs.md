---
layout: post
title: "Sunday Quick Hack - Eliza in Vue.js"
date: "2019-12-08"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/robot1.jpg
permalink: /2019/12/08/sunday-quick-hack-eliza-in-vuejs
description: 
---

I tend to be a bit hesitant when I go to blog what I consider to be totally trivial examples, but while working on this project this morning, I ran into a few little issues that I thought might be helpful to share for folks who don't waste their time building dumb games in Vue. Before I get into the code (and the small little issues I found), a quick history lesson.

Eliza, or more correctly, ELIZA, is an *old* program (circle 1964) that attempts to parse your input and respond intelligently. The "intelligence" really wasn't. All Eliza really did was try to match patterns and then parrot them back to you. So telling it you don't like cats could give you a response of "Don't you really like cats?" 

The creator of Eliza (Joseph Weizenbaum) was trying to demonstrate the "superficiality of communication" between people and machines, but was surprised by how people responded to it. Instead of noticing the shallowness of the responses, multiple people felt an emotional connection to Eliza. You can read much more about Eliza at it's [Wikipedia](https://en.wikipedia.org/wiki/ELIZA) page and if you Google, you will find implementations of Eliza in pretty much every language possible. And as an interesting aside, there's also [PARRY](https://en.wikipedia.org/wiki/PARRY), another early chatbot meant to simulate a person with paranoid schizophrenia. Of course, folks connected the two and you can see read one of their [conversations](https://phrasee.co/parry-the-a-i-chatterbot-from-1972/) if you're interested.

So - that's a long winded way of saying - I felt like finding a simple Eliza JavaScript implementation and building a Vue.js demo around it. I did some Googling and one of the first ones I found was here: <https://www.masswerk.at/elizabot/>. This code is nearly **fifteen** years old but was the first I found that was the easiest to "plug and play" into another application. It definitely doesn't follow what we would consider to be "modern best practices", and in fact, it comes in two separate JavaScript files, with no minification, and pollutes the global variable space.

But it works.

Alright, so given that, let me share the end result so you can see it in action. I'll then explain the code. You can run Vue Eliza here: <https://cfjedimaster.github.io/vue-demos/eliza/>

Here's a screen shot of in action, with all my design skills at play:

<img src="https://static.raymondcamden.com/images/2019/12/eliza1.png" alt="Screen shot of Eliza conversation." class="imgborder imgcenter">

As you can see in the conversation above, it isn't terribly intelligent, but it comes close. If you didn't know better you could (possibly) be fooled into thinking you were talking to a real, if lazy, therapist. (And for folks curious, a real therapist isn't like this at all!) Let's look at the code. First, my HTML.

```html
<html>
	<head>
		<title>Vue-Eliza</title>
		<script src="js/elizabot.js"></script>
		<script src="js/elizadata.js"></script>
		<link rel="stylesheet" href="style/app.css">
	</head>

	<div id="app">
		<div class="chatBox" ref="chatBox"><span v-html="chat"></span></div>
		<form @submit.prevent=""><input v-model="msg" class="msg"><button @click="speak" :disabled="!msg" class="chatBtn">Chat</button></form>
	</div>

	<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
	<script src="js/app.js"></script>
	<body>
</html>
```

You can see I start off loading up Eliza, and like I mentioned, it's two different script files. The second one just provides data for your bot and - unfortunately - uses the global name space. Luckily my Vue app is completely separated from that (except for it's own instance) so I don't really have to worry about it.

The UI consists of a chatbox, an input for your typing, and a button to send in the results. You can also use the enter key and make note of `@submit.prevent=""` to stop the form from submitting itself. I've never used an event handler pointing to an empty string before, but Vue seemed to handle it perfectly. My confidence isn't terribly high on that but I tried it in Firefox and Chrome and it worked. (I just tested in Edge and it worked fine there too.)

Now let's look at the JavaScript.

```js
const app = new Vue({
	el:'#app',
	data: {
		chat:'',
		msg:'',
		eliza:null
	},
	created() {
		this.eliza = new ElizaBot();
		this.chat = 'Eliza: '+this.eliza.getInitial();
	},
	methods: {
		speak() {
			let reply = this.eliza.transform(this.msg);
			this.chat += `<br/>You: ${this.msg}<br/>Eliza: ${reply}`;
			this.msg = '';
			this.$nextTick(() => {
				// https://stackoverflow.com/a/40737063/52160
				this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;

				if(this.eliza.quit) {
					alert('Your conversation is now over.');
					window.location.reload(true);
				}
			});
		}
	}
});
```

Not much to it, but let's point out some of the interesting bits.

First, I begin by making a new instance of the Eliza bot. The library supports multiple bots so in theory, you could have a conversation with multiple Eliza's at once. I track the chat using one large string object where I keep appending new messages. I'm using HTML to break up newlines so note how I use `v-html` in my template to render it. I feel like this would be more memory efficient as an array perhaps but if you're having that long of a conversation with my bot... you should just stop. 

What's happening in `$nextTick`? Two things actually. First, I wanted to ensure that the div displaying the chat was always scrolled to the bottom. I found a simple one liner of doing that at StackOverflow (and I credited in the code above.) However, due to Vue updating the DOM asynchronously, I needed to wait until it had written out my new chat. You can read more about `$nextTick` on this [blog post](https://www.raymondcamden.com/2019/02/22/what-is-nexttick-in-vue-and-when-you-need-it) I wrote earlier in the year. 

Secondly, I also check to see if the conversation is over. The bot provides a simple boolean value, `quit`, that you can check and respond to if you wish. In my demo I simply alert the user and then reload the page. Another option would be to make a new instance of the bot and clear the chat. It would be all of maybe 2-3 more lines of code but I took the easy way out with a reload. 

Anyway, that's it, and let me know if you have any questions by leaving a comment below. You can find the complete source coe for this demo here: <https://github.com/cfjedimaster/vue-demos/tree/master/eliza>

<i>Header photo by <a href="https://unsplash.com/@rocknrollmonkey?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Rock'n Roll Monkey</a> on Unsplash</i>
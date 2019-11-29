---
layout: post
title: "Generating Random Cure Song Titles with Markov Chain"
date: "2018-01-16"
categories: [development]
tags: [javascript]
banner_image: 
permalink: /2018/01/16/generating-random-cure-song-titles
---

Before you go any further, please note that this blog post contains absolutely nothing of value. This was a stupid idea I had last night that I decided to quickly build this morning. It worked. It made me laugh. But there is nothing of value here. If your boss catches you reading this you'll probably be fired. You've been warned.

So - a [Markov chain](https://en.wikipedia.org/wiki/Markov_chain) is - in my understanding - a way of determining what value would come after another based on a set of initial input. So given a set of data, let's say words, you can determine which word is most likely to come after another. You can find a great example of this to generate realistic Lifetime movie titles: ["Using Javascript and Markov Chains to Generate Text"](https://www.soliantconsulting.com/blog/title-generator-using-markov-chains). Unfortunately the code samples in the blog are broken, but the examples are funny as hell.

I did a quick search and found a great npm library that simplifies creating demos like this: [titlegen](https://www.npmjs.com/package/titlegen). From the docs, here is a sample of how easy it is use:

```js
var generator = titlegen.create();
 
generator.feed([
  'You Only Live Twice',
  'From Russia with Love',
  'The Man with the Golden Gun',
  'Live and Let Die',
  'Die Another Day'
]);
 
console.log(generator.next()); // -> "From Russia with the Golden Gun" 
console.log(generator.next()); // -> "You Only Live and Let Die Another Day" 
console.log(generator.next()); // -> "The Man with Love" 
```

Pretty cool, right? So I thought - what if I tried this with Cure songs? I scraped the content from [Wikipedia](https://en.wikipedia.org/wiki/Category:The_Cure_songs), did a bit of cleanup, and created this demo:

https://cfjedimaster.github.io/webdemos/generateCure/titlegen.html

If you don't want to click, here are some examples:

![Sleep When I'm a Cult Hero](https://static.raymondcamden.com/images/2018/1/cure1.jpg)

![The Only One Hundred Years](https://static.raymondcamden.com/images/2018/1/cure2.jpg)

![Hot Hot Hot Hot Hot!!!](https://static.raymondcamden.com/images/2018/1/cure3.jpg)

![Three Imaginary Boys Don't Cry](https://static.raymondcamden.com/images/2018/1/cure4.jpg)

The demo is a stupid simple Vue app. The layout is just a few tags so I'll skip it, but here is the JavaScript. Note I've removed most of the Cure titles to keep it shorter:

```js
// source: https://en.wikipedia.org/wiki/Category:The_Cure_songs

let input = `10:15 Saturday Night
The 13th
Accuracy
LOTS OF STUFF REMOVED
The Walk
Why Can't I Be You?
Wrong Number`;

input = input.split('\n');

var generator = titlegen.create();
generator.feed(input);

const app = new Vue({
	el:'#app',
	data() {
		return {
			title:""
		}
	},
	created() {
		this.newTitle();
	},
	methods: {
		newTitle() {
			console.log('generating cureness');
			this.title = generator.next();
		}
	}
});
```

I don't think I understand even 1% of the math behind this and I don't know how realistic this is but my God did it bring it a smile to my face. If you want to look at all the code, you can find it here: https://github.com/cfjedimaster/webdemos/tree/master/generateCure
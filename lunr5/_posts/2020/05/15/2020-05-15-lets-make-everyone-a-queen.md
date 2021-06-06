---
layout: post
title: "Let's Make Everyone a Queen!"
date: "2020-05-15"
categories: ["serverless","javascript"]
tags: ["pipedream","vuejs"]
banner_image: /images/banners/queencard.jpg
permalink: /2020/05/15/lets-make-everyone-a-queen
description: A look at how I used a text generating library to build a queen making demo.
---

Forgive the somewhat over the top title. For a while now I've been meaning to make an application with a nifty little JavaScript library called [Tracery](https://www.brightspiral.com/). Tracery is a library created by [Kate Compton](http://www.galaxykate.com/). It's a fascinating tool for generating text based on a set of inputs. I saw fascinating because sometimes it makes some pretty incredible little stories. For example:

<blockquote>
<p>
This is a story about a faceless man. You know, the faceless man who hardly ever crys when they feel the forest. Well, I was listening to the faceless man, when we both saw this tree. Blinking, orange...well, more of a blueish white. We backed away because as everybody knows, trees don't exist. That was the last we saw of it. And now, the weather.
</p>

<p>
Music plays. You recall summertime and pain. You recall a lover and a friend. Operatic folk harpsichord echoes out into dissonance.
</p>

<p>
You know, I miss the tree. It was pretty terrible. I mean, really beautiful, for a tree. Eventually, I hope it comes back. We'll see it, glistening, grey...well, more of an indigoish indigo. But it'll be back. I mean, eventually. If not, it's just so bewildering.
</p>
</blockquote>

So yes, that's a bit crazy at times. But there's something interesting about it. If you [reload the site](https://www.brightspiral.com/) you'll see new random generated stories and I could spend *quite* a bit of time seeing what it does. 

I first becamse of aware of this library when I discovered [@dragonhoards](https://twitter.com/dragonhoards] on Twitter. This is a bit that makes use of the library. Here's an example tweet that's both interesting and horifying at the same time:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">A magical dragon lives by an enchanted lake. She estimates her hoard, which consists of a heap of memoirs, a group of pies, and an unknowable amount of corpses. She is exhausted.</p>&mdash; Dragon Hoards (@dragonhoards) <a href="https://twitter.com/dragonhoards/status/1261003706507628544?ref_src=twsrc%5Etfw">May 14, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

At the simplest level, Tracery works by combining different arrays of input values. So for example, given this input:

```js
let input = {
	"sentence": ["The #color# #animal# of the #natureNoun# is called #name#"],	
	"color": ["orange","blue","white","black","grey","purple","indigo","turquoise"],
	"animal": ["unicorn","raven","sparrow","scorpion","coyote","eagle","owl","lizard","zebra","duck","kitten"],
	"natureNoun": ["ocean","mountain","forest","cloud","river","tree","sky","sea","desert"],
	"name": ["Arjun","Yuuma","Darcy","Mia","Chiaki","Izzi","Azra","Lina"]
}
```

You can generate a random sentence like so:

```js
grammar = tracery.createGrammar(input);
let sentence = grammar.flatten('#origin#');
```

The code starts with sentence and looks for tokens. For each token it will look for a corresponding array of values and select a random one. Here's an example result:

	The turquoise lizard of the river is called Mia

That part is relatively simple, but Tracery gets very complex. So for example, it supports picking a random animal once and re-using the same value again if you need it. Honestly the complexity goes beyond what I think I can understand currently, but she's got a great testing utility you can play with here: <http://www.crystalcodepalace.com/traceryTut.html>. And of course, it's up on GitHub: <https://github.com/galaxykate/tracery>. Note that you want to make use of the [tracery2](https://github.com/galaxykate/tracery/tree/tracery2) branch, not master.

Ok, so with that being said, I thought it would build a few demos with this. 

### The Web Site

As I said, Tracery is powerful, but complex. While I had a end game in mind (the second demo I'll be showing), I thought it would make sense to start with a web site first to keep it simple. As the title of this post suggests, it's all about making you a queen. I had my daughters in mind but anyone can be a queen if they want. Here's the end result:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/q1.png" alt="Queen Of" class="lazyload imgborder imgcenter">
</p>

You can demo this yourself here: <https://queenof.netlify.app/#Lindy> Notice I've included the name in the URL. You can change the hash mark to whatever, or just type whatever you want in the form field. The basic pattern is relatively simple: X is the queen of A, something of B, and something else of C. It's built using Vue.js because of course I'd use Vue for this. Here's the code:

```js
const input = {
	"things":["Shadows","Night","the Sea","the Moon","Stars",
				"the Sun","Kittens","Fear","Courage","Dancing",
				"the Internet","Unicorns","Dolphins","Mermaids","Upstairs",
				"Foxes","Puppies","Chairs","Trees","Plants",
				"Flowers","Music","Singing","Painting","Song",
				"Sparkles","Jewels","Intelligence","Smarts","Dragons",
				"Wolves","Shoes","Bravery","Honesty","Empathy",
				"Compassion","Wisdon","Knowledge","Cats","Storms",
				"Lightning","Thunder","Rain","Snow","Clouds",
				"Wind","the Earth","the Universe","the Galaxy","the Piano",
				"the Sky","the Land","the Realm","the oceans","cookies",
				"cakes","pies","macarons","pizza","parties"],
	"role":["Defender","Champion","Scion","Empress","Sorceress",
			"Master","Mistress","Boss","CEO","President",
			"Prime Minister","DJ","Knight","Dame","Duchess",
			"Baroness","Countess","Manager","Singer","Drummer",
			"Muse","Siren","Painter","Crafter","Creator",
			"Accountant","Chancellor","Jedi","Teacher","Jedi Master",
			"Tutor"],
	"origin":[" is the Queen of #things#, #role# of #things#, and #role# of #things#."]
};

const app = new Vue({
	el:'#app',
	data: {
		grammar:null,
		name:'',
		result:''
	},
	methods:{
		makeQueen() {
			if(this.name === '') return;
			this.result = this.name + grammar.flatten('#origin#');
			window.location.hash = this.name;
		}
	},
	mounted() {
		grammar = tracery.createGrammar(input);
		grammar.addModifiers(baseEngModifiers);
		if(window.location.hash && window.location.hash.length > 1) {
			//remove # 
			this.name = window.location.hash.substring(1);
			this.makeQueen();
		}
	}
});
```

The crucial bits are the `origin` value as that forms the basic structure of the random sentence. I leave off the beginning because that will be the name. The VUe parts then are pretty trivial. Setup Tracery and wait for you to enter a value (although note that `mounted` will notice the hash). 

If you want, you can peruse the entire code base here: <https://github.com/cfjedimaster/queenof>

### The Twitter Bot

So as I said, I had an endgame and mind, and that was a Twitter bot. I've got something of a problem when it comes to creating Twitter bots, but I'm sure I got stop whenever I want to. Using [Pipedream](https://pipedream.com/), I built a Twitter bot at [@generatorqueen](https://twitter.com/generatorqueen). She works rather simply. Send her a tweet with "queen me" in the text and you'll get a response within a minute.

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">You are the Queen of the Earth, Chancellor of Smarts, and Creator of Plants.</p>&mdash; Queen Generator (@GeneratorQueen) <a href="https://twitter.com/GeneratorQueen/status/1261367197315686401?ref_src=twsrc%5Etfw">May 15, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I built this using a Pipedream workflow you can find here: <https://pipedream.com/@raymondcamden/queen-of-bot-v2-p_MOCQen/edit>. Don't forget that one of the coolest features of Pipedream is that you can share workflows with others so they can fork and use for their own purposes! Let's break down the workflow bits.

I began with a Twitter search event source. I [blogged](https://www.raymondcamden.com/2020/05/07/looking-at-pipedreams-event-sources) about these last week. They are a powerful way to build event driven workflows. In this case the event source is simply a Tweet that matches "@generatorqueen". 

Next I have a custom Node.js step to do validation on the text:

```js
async (event, steps) => {
	if(steps.trigger.event.full_text.indexOf('queen me') === -1) $end('queen me not in tweet');
}
```

Remember that `$end` is Pipedream's way of letting you end a workflow early.

The next step generates the text:

```js
async (event, steps) => {
	const tracery = require('tracery-grammar');

	const grammar = tracery.createGrammar({
			"things":["Shadows","Night","the Sea","the Moon","Stars",
					"the Sun","Kittens","Fear","Courage","Dancing",
					"the Internet","Unicorns","Dolphins","Mermaids","Upstairs",
					"Foxes","Puppies","Chairs","Trees","Plants",
					"Flowers","Music","Singing","Painting","Song",
					"Sparkles","Jewels","Intelligence","Smarts","Dragons",
					"Wolves","Shoes","Bravery","Honesty","Empathy",
					"Compassion","Wisdon","Knowledge","Cats","Storms",
					"Lightning","Thunder","Rain","Snow","Clouds",
					"Wind","the Earth","the Universe","the Galaxy","the Piano",
					"the Sky","the Land","the Realm","the oceans","cookies",
					"cakes","pies","macarons","pizza","parties"],
			"role":["Defender","Champion","Scion","Empress","Sorceress",
					"Master","Mistress","Boss","CEO","President",
					"Prime Minister","DJ","Knight","Dame","Duchess",
					"Baroness","Countess","Manager","Singer","Drummer",
					"Muse","Siren","Painter","Crafter","Creator",
					"Accountant","Chancellor","Jedi","Teacher","Jedi Master",
					"Tutor"],
			"origin":["the Queen of #things#, #role# of #things#, and #role# of #things#."]
	});

	grammar.addModifiers(tracery.baseEngModifiers); 

	this.sender = steps.trigger.event.user.screen_name;
	this.message = '@' + this.sender + ' You are ' + grammar.flatten('#origin#');
	console.log(this.message);
}
```

Now, at this point, everything's been pretty simple. In theory the next step is to just use the "Post Tweet" action. I've used that before and it's one of the many built in actions at Pipedream. However, my buddy [Dylan Sather](https://twitter.com/dylansather) at Pipedream noticed a potential issue with my use case. Because my bot would be replying to users, it was a potential TOS issue with Twitter's API. When you use Pipedream's Post Tweet action it's using Pipedream's application credentials for the call. It's using *your* authentication, but the lower level app itself is Pipedreams. Because of the potential for abuse, it would be problemtic to allow the Post Tweet action to "at" people in tweets. Luckily, the workaround was relatively simple. 

First, Pipedream created a new action that lets you use *your* credentials:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/q2.png" alt="New action for posting tweets" class="lazyload imgborder imgcenter">
</p>

Once you've added this, you supply your own application credentials. You can get these simply enough at <https://developer.twitter.com/en> but note! If you've just today made the account for your bot, your bot itself needs to ask for permission to create Twitter apps. Twitter is totally fine with this, but there's an approval process. Mine took seven days. It's been a while since I've done this before so I can't tell you if that's slow or fast, but if you're planning something like this, you may want to request this as soon as possible. 

Once you've done that then it's a simple matter of copying your keys into the Pipedream action and then specifying what to tweet. Here's how I did it. (Note, the text in white is a sample value.)

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/q3.png" alt="Action values used for posting the tweet" class="lazyload imgborder imgcenter">
</p>

I believe that this is only an issue for automation of tweets that are sent *to* users but again, the Pipedream side of this was simple. The only real issue was the week delay in getting the developer account approved. 

<i>Header photo by <a href="https://unsplash.com/@glencarrie?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Glen Carrie</a> on Unsplash</i>
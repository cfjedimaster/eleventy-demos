---
layout: post
title: "Building a Text-Based Adventure in Vue.js"
date: "2018-02-14"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/cavegame.jpg
permalink: /2018/02/14/building-a-text-based-adventure-in-vuejs
---

<strong>Note - I found a bug with the room description that was fixed in a later build. Sorry about that!</strong> Happy Valentines Day! Today I'm showing my love for Vue.js by building something totally impractical and fun - a text-based adventure in Vue.js. As a child of 80s, I grew up playing text-based games from Infocom. In fact, to this day I still say that some of the most interesting games ever created were done by Infocom. My favorite? "A Mind Forever Voyaging"

![Cover art](https://static.raymondcamden.com/images/2018/2/mindv.jpg)

Heck, the first time I added RAM to a machine was just to support playing "Wishbringer", another Infocom classic. I graduated from these games into MUDs while at college and had fun not only playing them but coding them as well. (See this nearly [five year old post](https://www.raymondcamden.com/2012/09/06/SOT-Review-of-my-Everdark-Quest/) about the code I'm most proud of.) I thought it might be fun to take a stab at building a simple text-based game in Vue.

Now - to be clear, a text parser is not a simple task. Infocom games were notorious for their complex parsers and their ability to take input and map it to a proper action in the game. I'm not going to pretend to have the coding chops to do that. I did think it would be interesting to try a few basic commands, like movement, and then see if I could build up from there. With that in mind, I'm happy to share my initial version. 

Before I get into the code, note that you can find the complete code base here: https://github.com/cfjedimaster/webdemos/tree/master/vuetextbasedgame.

Alright, so what did I build? For my initial version, I decided that I would only support basic navigation among a dataset of rooms. So given that a room has exits to the west and east, I'd support the user typing commands to move in those directions. If you moved to the west, I'd let the user know about the new room and then they would be able to move in whatever directions that particular room supported. I began by designing my game data. Right now this is a JSON file, but in the next version, I'm going to support the abilty to use individual files for rooms and use a Node script to handle converting that data into JSON. That will let me write more freely and not worry about escaping crap that JSON complains about. Anyway, here is the current version:

```js
{
	"initial":{
		"description":"This is a rather boring room, but despite that, you feel the pull of a new adventure!",
		"exits":[
			{
				"dir":"w",
				"room":"westroom"
			},
			{
				"dir":"e",
				"room":"eastroom"
			}
		]
	},
	"westroom":{
		"description":"This is a rather dramatic room, almost presidential you would say.",
		"exits":[
			{
				"dir":"e",
				"room":"initial"
			}
		]
	},
	"eastroom":{
		"description":"You've entered Ray's office. You are surrounded by a mess of Star Wars toys and other distractions. No wonder Ray never seems to get anything done.",
		"exits":[
			{
				"dir":"w",
				"room":"initial"
			}
		]
	}
}
```

Each room has a unique ID. This is used to allow one room to 'target' another for movement. And in theory, you could imagine items (magic potions?) that transport a user. Each room currently has 2 properties - a simple description and an array of exits. Now let's take a look at the front end.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<link rel="stylesheet" href="app.css">
	</head>
	<body>

		<div id="app" v-cloak>
			<h1>Game</h1>
			<div v-if="loading">
				Please stand by - loading your adventure...
			</div><div v-else>
				<div id="roomDesc" v-if="room">
					<p>
					{% raw %}{{roomDesc}}{% endraw %}
					</p>

					<p v-if="room.exits.length > 1">
						You see exits to the {% raw %}{{ room.exits | exitDesc}}{% endraw %}.
					</p><p v-else>
						You see an exit to the {% raw %}{{ room.exits | exitDesc }}{% endraw %}.
					</p>
				</div>
				<div id="cli">
					<input v-model="input" @keydown.enter="cli" ref="input">
				</div>
			</div>

		</div>

		<script src="https://unpkg.com/vue"></script>
		<script src="app.js"></script>
	</body>
</html>
```

The game's view layer is split into two states - one to use while stuff is loading (you could imagine the room data becoming quite large) and one to display the main "game" UI. Right now that supports two elements - a room description with exit data dynamically generated and then a "CLI" that's really just an input field. I applied all my CSS powers to generate this:

![Game UI](https://static.raymondcamden.com/images/2018/2/game1.jpg)

Alright, now let's tackle the code. First, here is a filter I wrote to handle displaying exits. It simply handles converting "x,y" to "X and Y", or "x,y,z" to "X, Y, and Z". I could have done that in the view layer, but I also needed to support converting "n" to "North."

```js
// mapping of short dir to long
const dirMapping = {
	'w':'West',
	'e':'East',
	'n':'North',
	's':'South'
};


Vue.filter('exitDesc', function (exits) {
	let result = '';

	if(exits.length > 1) {
		for(let i=0;i<exits.length;i++) {
			result += dirMapping[exits[i].dir];
			if(i < exits.length-2) result += ', ';
			if(i == exits.length-2) result += ' and ';
		}
	} else {
		result = dirMapping[exits[0].dir];
	}
	return result;
});
```

By the way, `dirMapping` is external to the filter as it is used someplace else as well. Ok, now for the core logic.

```js
const app = new Vue({
	el:'#app',
	data() {
		return {
			loading:true,
			room:null,
			roomDesc:'',
			input:'',
			rooms:null,
			initialRoom:'initial'
		}
	},
	mounted() {
		console.log('Loading room data...');
		fetch('rooms.json')
		.then(res => res.json())
		.then(res => {
			console.log('Loaded.');
			this.rooms = res;
			this.room = this.rooms[this.initialRoom];
			this.roomDesc = this.room.description;
			this.loading = false;
			//nextTick required because line above changes the DOM
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		});
	},
	methods: {
		cli() {
			console.log('Running cli on '+this.input);

			// first see if valid input, for now, it must be a dir
			if(!this.validInput(this.input)) {
				alert('Sorry, but I don\'t recognize: '+this.input);
				this.input = '';
				return;
			}
			// Ok, currently this is just handles moving, nothng else
			// so this is where I'd add a parser, imagine it is there
			// and after running, it determines our action is "movement"
			let action = 'movement';
			// arg would be the argument for the action, so like "go west", arg=west. 
			// for now, it's just the cli
			let arg = this.input;

			switch(action) {
				case 'movement':{
					this.doMovement(arg);
				}
			}

			this.input = '';
		},
		doMovement(d) {
			console.log('Move '+d);
			// first, change North to n
			let mappedDir = '';
			for(let dir in dirMapping) {
				if(dir === d.toLowerCase()) mappedDir = d;
				if(dirMapping[dir].toLowerCase() === d.toLowerCase()) mappedDir = dir;
			}
			// see if valid direction
			for(let i=0;i<this.room.exits.length;i++) {
				if(this.room.exits[i].dir === mappedDir) {
					this.room = this.rooms[this.room.exits[i].room];
					return;
				}
			}		
			// if we get here, boo
			alert(dirMapping[d] + ' is not a valid direction!');
		},
		validInput(i) {
			// v1 is stupid dumb
			let valid = ['w','e','s','n','west','east','south','north'];
			return valid.includes(i.toLowerCase());
		}
	}
});
```

Alright, so that's a bit of code there, let me break it down bit by bit. The `data` block handles storing things like my current position and other flags. 

Next I use `mounted` to load the initial data. I previously had `created` but ran into an issue when I was trying to automatically focus the input field. First - refs can't be used in `created`, the DOM isn't rendered yet, and secondly, I had to use `$nextTick()` because `this.loading = false;` changes the DOM and actually makes that input visible. This one little part took me maybe twenty minutes, but I'm really glad I ran into it as I learned something new.

The `cli` method handles input and as the comments say, it is pretty simplistic at the moment. Right now it has no parser and just assumes everything is a movement. `validInput` is the beginning of the abstraction to handle verifying input, but obviously later I'll need some code to handle taking in input and mapping it to a proper action. As I said, this is just a beginning. 

The only supported action now is movement, and you can see that in play in `doMovement`. First this converts your input to a shorthand value (ie, "north" to "n"), then verifies that it is valid for the room. If it is, I simply move you.

For errors I'm using alerts, but I really want to do something different. Like maybe have a div that is an active response to your input. It could handle both showing errors as well as responding to good commands ("You move west."), but I wasn't sure how to handle that visually. Anyone have an idea?

So that's it. I've got some [notes](https://github.com/cfjedimaster/webdemos/blob/master/vuetextbasedgame/notes.txt) about what I want to do next. If you want to "play", visit the demo here:  https://cfjedimaster.github.io/webdemos/vuetextbasedgame/

<i>Header photo by <a href="https://unsplash.com/photos/4PwRZXbXKxY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeremy Bishop</a> on Unsplash</i>
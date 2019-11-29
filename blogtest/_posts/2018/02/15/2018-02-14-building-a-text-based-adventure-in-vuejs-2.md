---
layout: post
title: "Building a Text-Based Adventure in Vue.js (2)"
date: "2018-02-15"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/cavegame.jpg
permalink: /2018/02/15/building-a-text-based-adventure-in-vuejs-2
---

Yesterday I [posted](https://www.raymondcamden.com/2018/02/14/building-a-text-based-adventure-in-vuejs/) a proof of concept of a simple text-based adventure game built in Vue.js. While it was incredibly simple (and a bit broken, sorry), I made some progress in updating the engine today that I thought would be cool to share. Pretty much nothing visually changed, but I made some structural changes that I think will go a long way to improving the core game.

One of the first things I did was add support for command aliases. I already had this in terms of "w" being an alias for "west", but I wanted a generic structure for this I could update more easily. With that in mind, I added a simple aliases.json file:

```js
{
	"north":"n",
	"west":"w",
	"east":"e",
	"south":"s",
	"look at{% raw %}|l at|{% endraw %}l":"look"
}
```

Take a look at that last line. The use of pipe allows me to have multiple variations of an alias. I could have simply repeated them, but I liked this form. It felt more compact.

Next, I added a file called commands.json. It's only purpose was to serve as a definition of legal commands:

```js
[
	"w",
	"e",
	"n",
	"s",
	"look *"
]
```

Again, the last line is important here. My game doesn't support "looking" yet, but I used the form `look *` as a way of supporting the ability to look at anything. Eventually my code will map "look X" to a result that says, "She wants to do command `look` with an arg `X`."

I then combined my three data files into one JSON file called `data.json` and simply fetched that on start. I did this via a utility script I'm going to show in a bit. Here is the new startup routine:

```js
mounted() {
	console.log('Loading room data...');
	fetch('data.json')
	.then(res => res.json())
	.then(res => {
		console.log('Loaded.');
		this.aliases = this.prepareAliases(res.aliases);
		this.commands = res.commands;
		this.rooms = res.rooms;
		this.room = this.rooms[this.initialRoom];
		this.loading = false;
		//nextTick required because line above changes the DOM
		this.$nextTick(() => {
			this.$refs.input.focus();
		});
	});
},
```

The `prepareAliases` method simply handles taking those pipes and 'exploding' them out:

```js
prepareAliases(s) {
	/*
	To make it easier for the author, I allow for X|Y, which I'll expand out at X:alias and Y:alias
	*/
	let aliases = {};
	for(let key in s) {
		if(key.indexOf('|') === -1) {
			aliases[key] = s[key];
		} else {
			let parts = key.split('|');
			parts.forEach(p => {
				aliases[p] = s[key];
			});
		}
	}
	return aliases;
},
```

As the comment says, I want it to be easier for the author, or game developer. And that desire is what drove my final change. As I mentioned, I built a simple utility that would combine my JSON files into one. But I wanted to do something special for rooms. In the first version, rooms were defined in JSON. Here is an example:

```js
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
```

While that isn't bad, the description field doesn't really work well for long descriptions. I can't use line breaks or quotes without escaping and what I really want is the ability to just write. So I came up with a new format:

```html
<description>
You are in a rather simple room. Plain white walls surround you and nothing really
stands out of the ordinary. Despite that, you feel the pull of a new adventure and
steel yourself for what waits ahead!
</description>

<exits>
w|westroom
e|eastroom
</exits>
```

I've got a simple `description` tag where I can put in anything I want. Exits are a line-delimited list of values where each line has a direction and destination. Finally, the name of the file is the "key" for the room. So this file would be `initial.room`. 

With that in place, I built this utility:

```js
/*
Simple Node script to read in a few JSON files (soon to be text too) 
and output a JSON output that can be saved into a file.
*/
const fs = require('fs');

//let rooms = fs.readFileSync('./rooms.json', 'UTF-8');
let aliases = fs.readFileSync('./aliases.json', 'UTF-8');
let commands = fs.readFileSync('./commands.json', 'UTF-8');

let data = {};
//data.rooms = JSON.parse(rooms);
data.aliases = JSON.parse(aliases);
data.commands = JSON.parse(commands);
data.rooms = {};

/*
now parse everything in rooms
*/
let rooms = fs.readdirSync('./rooms');
let descRe = /<description>([\s\S]+)<\/description>/m;
let exitRe = /<exits>([\s\S]+)<\/exits>/m;

rooms.forEach(room => {
	let r = {};
	let roomContent = fs.readFileSync('./rooms/'+room,'UTF-8');
	let desc = roomContent.match(descRe);
	r.description = desc[1].trim();

	let exitStr = (roomContent.match(exitRe))[1].trim();
	let exitArr = exitStr.split(/\r\n/);

	r.exits = [];
	exitArr.forEach(e => {
		let [dir,loc] = e.split('|');
		r.exits.push({% raw %}{"dir":dir, "room":loc}{% endraw %});
	});

	let name = room.split('.')[0];
	data.rooms[name] = r;
});

console.log(JSON.stringify(data));
```

And then ran: `node util.js > data.json`. And voila - done. You can view the code here (https://github.com/cfjedimaster/webdemos/tree/master/vuetextbasedgame) and actually play it here (https://cfjedimaster.github.io/webdemos/vuetextbasedgame/).

<i>Header photo by <a href="https://unsplash.com/photos/4PwRZXbXKxY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeremy Bishop</a> on Unsplash</i>
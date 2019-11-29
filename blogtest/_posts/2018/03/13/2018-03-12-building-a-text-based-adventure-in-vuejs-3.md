---
layout: post
title: "Building a Text-Based Adventure in Vue.js (3)"
date: "2018-03-13"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/cavegame.jpg
permalink: /2018/03/13/building-a-text-based-adventure-in-vuejs-3
---

It's been a while since I updated my little Vue-based game but I had a bit of time over the weekend to make some small tweaks. Primarily my work was on supporting what I call "lookables" - things that you can look at in a room to get more detail. I got it working, and I'm happy with how I did it, so let me quickly cover how I did it.

Updating the CLI
---

Up until this point, my CLI was pretty basic. I had a basic list of commands that was used to verify input, but after that, the code always assumed your input was a movement. Getting "look" working was a bit complex. Since the command always requires an argument, I needed to update how I verify commands. I tried to keep it nice and generic. In my list of valid commands I added `look *` as a way of saying "this is a valid commands but it must take an argument", but things got messy. 

So I decided to punt. I thought to myself - in a real game engine, I think it's safe to assume that some commands are baked in and some are dynamic. I had already hard coded in support for movement and decided that "look" could also be baked in. I changed my earlier method, `validInput` to a new method, `parseInput`. This method would return a simple object containing a `cmd` and `arg` value. So movements would become `{% raw %}{cmd:'movement', arg:'e'}{% endraw %}` (move east) and input like `look cat` would be: `{% raw %}{cmd:'look', arg:'cat'}{% endraw %}`. Here's the updated code:

```js
parseInput(i) {

	if(i === 'w' {% raw %}|| i === 'e' |{% endraw %}{% raw %}| i === 's' |{% endraw %}| i === 'n') {
		return {
			cmd:'movement',
			arg:i
		};
	}

	if(i.indexOf('look ') === 0) {
		let parts = i.split(' ');
		parts.shift();
		let target = parts.join(' ');
		return {
			cmd:'look',
			arg:target
		}
	}

}
```

Look Data
---

The next thing I did was decide on the "look" data structure. Every room would have an array called `lookables`. Every lookable item consisted of two parts:

* aliases: This is what you're looking at and as the name implies, allows for a list of aliases. So for example, I'd want you to be able to look at a cat, a fat cat, and so on.
* desc: This is simply the text description of what you're looking at.

All together then the look command is simple:

```js
doLook(t) {
	if(!this.room.lookables) this.room.lookables = [];
	for(let i=0;i<this.room.lookables.length;i++) {
		let l = this.room.lookables[i];
		for(let x=0; x<l.aliases.length; x++) {
			if(t.toLowerCase() === l.aliases[x].toLowerCase()) {
				this.status = l.desc;
				return true;
			}
		}
	}
	alert(`You don't see ${% raw %}{t}{% endraw %} here.`);
}
```

Writing Lookables
---

The final part was creating an easy way to include lookables in room data. I decided on this format:

```html
<lookables>
cat|fat cat@The cat is quite fat!
dog@The dog has fleas.
</lookables>
```

Each lookable is defined on one line. The aliases and description are separated by an `@` character. Aliases are separated by the `|` character. I then updated my utility script to parse this. It's boring text parsing but you can see it [here](https://github.com/cfjedimaster/webdemos/blob/master/vuetextbasedgame/util.js) if you want. The entire code base can be found here: https://github.com/cfjedimaster/webdemos/tree/master/vuetextbasedgame

Oh - and I also added support for a 'status' display to handle displaying the result of what you look at. I'm going to move the error conditions there and get rid of the alerts. You can "play" the game here: https://cfjedimaster.github.io/webdemos/vuetextbasedgame/. But note I only added lookables to the first room.

Well... I think I'm almost done with this little experiment. I've got an idea for one last mod and then I think I'll move on.
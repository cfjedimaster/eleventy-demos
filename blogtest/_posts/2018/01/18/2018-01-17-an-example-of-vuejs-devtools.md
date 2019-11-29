---
layout: post
title: "An Example of Vue.js DevTools"
date: "2018-01-18"
categories: [javascript]
tags: [vuejs]
banner_image: 
permalink: /2018/01/18/an-example-of-vuejs-devtools
---

Yesterday I tweeted about the release of the [latest version](https://medium.com/the-vue-point/whats-new-in-vue-devtools-4-0-9361e75e05d0) of the devtools extension for Vue.js and one of my followers had this to say:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I never find vue tools useful, what is the use of it? I still use console.log to debug js errors</p>&mdash; Muhammed Rashid  N.K (@rashidnk) <a href="https://twitter.com/rashidnk/status/953478396998119424?ref_src=twsrc%5Etfw">January 17, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

First off - I'm definitely in the "console.log for debugging" club myself. Yes, I know I can do step by step debugging with dev tools, but honestly, I'm typically quicker with just some logging. That being said, his tweet encouraged me to dig around a bit in the extension myself. I'm going to share what I've found below, but if you don't want to read, just scroll down to the end and I've got a video demonstration of everything covered here. Ok, ready?

Where to Get it:
===

The official home page for the Vue DevTools project is up on GitHub: https://github.com/vuejs/vue-devtools. You can find installation instructions, help for some problems, and more. Currently the extension is supported in Chrome and Firefox but apparently there is also a work around for Safari. Obviously you want to begin with installing the extension and don't forget to reload your page if you've got a Vue app already opened. Yes, I've made this mistake more than once.

Getting Started
===

Let's begin with a super simple Vue app. Here is the entire thing:

```html
<div id="app">
	<input type="text" v-model="name">
	<ul>
		<li v-for="cat in cats">{% raw %}{{cat.name}}{% endraw %}</li>
	</ul>
</div>

<script src="https://unpkg.com/vue"></script>
<script>
const app = new Vue({
	el:'#app',
	data() {
		return {
			name:'Luna the Destroyer of Dogs',
			cats:[
				{% raw %}{name:'Simba',age:11}{% endraw %},
				{% raw %}{name:'Robin',age:5}{% endraw %},
				{% raw %}{name:'Luna',age:9}{% endraw %},
				{% raw %}{name:'Cracker',age:6}{% endraw %},
				{% raw %}{name:'Pig',age:3}{% endraw %}
				]
		}
	}

});
</script>
```

As you can see, I've got one input field bound to a model called `name` and then an unordered list that iterates over an array of cats. First thing you may notice in your devtools is the extension kind of "announcing" itself - you know - just in case you forget to notice the tab on the right.

![The vue extension saying hi](https://static.raymondcamden.com/images/2018/1/vuedt1.jpg)

Clicking on the Vue tab will expose the Vue-specific options. First up is components. In my app I just have one, a root app, and when you click it, it highlights the data available to it. Which could be cool if your view is only showing some of the data. Here I can see it all.

![Component data inspection](https://static.raymondcamden.com/images/2018/1/vuedt2.jpg)

This is "live" so if I type in the input field it will be reflected immediately in the dev tools view. Even better, you can directly edit within devtools. Mousing over the items will give you controls for editing:

![Editing data](https://static.raymondcamden.com/images/2018/1/vuedt3.jpg)

This also extends to the array - with options to completely remove or add items. To add an item, you need to enter valid JSON, but the extension will provide live feedback as you type.

![Nope, not JSON](https://static.raymondcamden.com/images/2018/1/vuedt4a.jpg)

<i>A little bit later...</i>

![Now that's JSON!](https://static.raymondcamden.com/images/2018/1/vuedt5.jpg)

The extension will also handle computed properties. Consider this version:

```html
<div id="app">
	<input type="text" v-model="name">
	<ul>
		<li v-for="cat in oldcats">{% raw %}{{cat.name}}{% endraw %}</li>
	</ul>
</div>

<script src="https://unpkg.com/vue"></script>
<script>
const app = new Vue({
	el:'#app',
	data() {
		return {
			name:'Luna the Destroyer of Dogs',
			cats:[
				{% raw %}{name:'Simba',age:11}{% endraw %},
				{% raw %}{name:'Robin',age:5}{% endraw %},
				{% raw %}{name:'Luna',age:9}{% endraw %},
				{% raw %}{name:'Cracker',age:6}{% endraw %},
				{% raw %}{name:'Pig',age:3}{% endraw %}
				]
		}
	},
	computed:{
		oldcats() {
			return this.cats.filter(c => {
				return c.age > 10;
			});
		}
	}

});
</script>
```

All I've done here is switch to a computed property called `oldcats`. The extension will now display this along with my data.

![Computed properties](https://static.raymondcamden.com/images/2018/1/vuedt6.jpg)

You can't edit those values (of course, it's computed!) but if you edit a cat in the data array such that one is older than ten, it will immediately show up below in the computed list.

![Computed properties updated in real time](https://static.raymondcamden.com/images/2018/1/vuedt7.jpg)

Neat!

Ok, so seeing data that I've got in my own file may not be terribly exciting. But what if we try a remote data source?

```html
<div id="app">
	<ul>
		<li v-for="film in films">{% raw %}{{film.title}}{% endraw %}</li>
	</ul>
</div>

<script src="https://unpkg.com/vue"></script>
<script>
const app = new Vue({
	el:'#app',
	data() {
		return {
			films:[]
		}
	},
	created() {
		fetch('https://swapi.co/api/films/')
		.then(res => res.json())
		.then(res => {
			this.films = res.results;
		});
	}

});
</script>
```

In this version I've just switched to use the Star Wars API for my data source. Once run, I can see the remote data in my devtools extension and I can even edit it.

![Data from the Star Wars API](https://static.raymondcamden.com/images/2018/1/vuedt8.jpg)

Custom Components
===

So what about custom components? Here is a script where I've defined a cat component. Frankly the fact that Vue doesn't ship with one by default is a terrible mistake.

```html
<div id="app">
	<cat v-for="cat in cats" :cat="cat"></cat>
</div>

<script src="https://unpkg.com/vue"></script>
<script>

Vue.component('cat', {
	template:'<p @click="alertCat(cat)"><strong>{% raw %}{{ cat.name }}{% endraw %} is {% raw %}{{ cat.age }}{% endraw %} years old.</strong></p>',
	props:['cat'],
	methods:{
		alertCat:function(c) {
			alert(c.age);
		}
	}
});

const app = new Vue({
	el:'#app',
	data() {
		return {
			cats:[
				{% raw %}{name:'Simba',age:11}{% endraw %},
				{% raw %}{name:'Robin',age:5}{% endraw %},
				{% raw %}{name:'Luna',age:9}{% endraw %},
				{% raw %}{name:'Cracker',age:6}{% endraw %},
				{% raw %}{name:'Pig',age:3}{% endraw %}
				]
		}
	}
});
</script>
```

Look now how the devtools recognizes the new component:

![Custom component support](https://static.raymondcamden.com/images/2018/1/vuedt9.jpg)

Notice how it also picked up on the properties sent to it. Now I'm going to skip over the Vuex tab and go right into Events. This was the only part of the extension that caused me trouble. The readme at the GitHub repo doesn't tell you this, but the Events tab is only for custom events emited by components. So when I had used a simple `@click="doSomethingYo"` test and it failed to render, I thought it was broken at first. In the code sample above, you can see I've got a click event, but hitting that did nothing. I had to modify the code to emit a new event.

```js
Vue.component('cat', {
	template:'<p @click="alertCat(cat)"><strong>{% raw %}{{ cat.name }}{% endraw %} is {% raw %}{{ cat.age }}{% endraw %} years old.</strong></p>',
	props:['cat'],
	methods:{
		alertCat:function(c) {
			alert(c.age);
			// this is what triggers it
			this.$emit('catevent', c);
		}
	}
});
```

With this in play, you can now see events recorded. What's cool is that the extension will let you know an event was fired:

![Highlighting an event](https://static.raymondcamden.com/images/2018/1/vuedt10.jpg)

Clicking the tab and then the event lets you inspect what fired it and any additional information.

![Event details](https://static.raymondcamden.com/images/2018/1/vuedt11.jpg)

Working with Vuex
===

Getting better and better, right? Now let's look at Vuex. Back in December I [blogged](https://www.raymondcamden.com/2017/12/20/an-example-of-vuex-and-state-management-for-vuejs/) an example application that made use of Vuex to build a simple stock game. This is where the Vue DevTools *realy* kick butt. You get insight into the data within your store as well as a running list of mutations.

![Vuex](https://static.raymondcamden.com/images/2018/1/vuedt12.jpg)

The stuff on the left is "live" which is pretty cool in my stock app as it has a "heartbeat" that does mutations every few seconds. Clicking on them provide detail about the particular mutation - here is one for buying stock.

![Vuex](https://static.raymondcamden.com/images/2018/1/vuedt13.jpg)

Even cooler - you can actually reject or roll back your store state by just mousing over a particular mutation.

![Vuex](https://static.raymondcamden.com/images/2018/1/vuedt14.jpg)

You can also use an export/import command to save/restore your Vuex state. This is *incredibly* useful for debugging issues.

The TV Version
===

Ok, if none of the above made any sense to you, hopefully the video version will make it more clear. As always, I'd love to hear from my readers about what they thing, if they've made use of the extension, and more. Leave me a comment below!

<iframe width="560" height="315" src="https://www.youtube.com/embed/odKVakhMk1o?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
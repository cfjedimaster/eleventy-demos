---
layout: post
title: "Building a Dual Selects Control in Vue.js"
date: "2020-06-08"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/neonlights.jpg
permalink: /2020/06/08/building-a-dual-selects-control-in-vuejs
description: How to build a "dual select" control in Vue.js
---

Earlier this week, an old friend of mine and all around good/smart guy Ben Nadel wrote up his experience on building a "dual select" control in AngularJS: ["Managing Selections With A Dual-Select Control Experience In Angular 9.1.9"](https://www.bennadel.com/blog/3841-managing-selections-with-a-dual-select-control-experience-in-angular-9-1-9.htm). If you aren't aware, a "dual select" control is one where two vertical columns of information are presented and the user can move items from one side to another. Ben had a great animated GIF on his blog entry that he was cool with me sharing:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/ds.gif" alt="Animated gif showing how a dual select works" class="lazyload imgborder imgcenter">
</p>

I've built these types of controls before but had not yet attempted to build it in Vue.js. With that mind, this weekend I worked on an example of it - both in a simple Vue.js application and also as a component version. While I'm sure this could be done differently (and I'd love to see examples in the comments below!), here's how I built it.

### Version One

As stated above, I built my first version in a simple application. For thise I made use of [CodePen](https://codepen.io/) which has recently added Vue SFC (Single File Component) support to their site. While not necessary for my demo I thought I'd give it a try for this first example. I began by building out my HTML. I knew I'd need two select controls with the `multiple` attribute and two buttons between them. One to move items to the right and one to move them back to the left. 

My initial demo data consisted of an array of users, but to be clear this was arbitrary:

```js
leftUsers: [
	"Raymond Camden",
	"Lindy Camden",
	"Jacob Camden",
	"Lynn Camden",
	"Jane Camden",
	"Noah Camden",
	"Maisie Camden",
	"Carol Camden",
	"Ashton Roberthon",
	"Weston Camden"
],
```

I rendered the left select like so:

```html
<h2>Possible Users</h2>
<select multiple v-model="leftSelectedUsers" @dblclick="moveRight">
	<option v-for="user in leftUsers">
		{% raw %}{{ user }}{% endraw %}
	</option>
</select>
```

Note that my option tags are iterating over my data but my v-model is connected to another value, `leftSelectedUsers`. The point of that is to let me have an array of "initial" data and an array representing values selected in the control. That value will be an array whether I pick one or more options.

The right side looks pretty similar:

```html
<h2>Selected Users</h2>
<select multiple v-model="rightSelectedUsers" @dblclick="moveLeft">
<option v-for="user in rightUsers">
	{% raw %}{{ user }}{% endraw %}
</option>
```

My two buttons in the middle simply fired off respective calls to move data:

```html
<button @click="moveRight">=&gt;</button>
<button @click="moveLeft">&lt;=</button>
```

You'll notice I also use the "double click" event. This makes it easier to move one item quickly by just quickly clicking on an individual user. Alright, let's check out the JavaScript:

```js
export default {
  data() {
    return {
			leftSelectedUsers:[],
			leftUsers: [
				"Raymond Camden",
				"Lindy Camden",
				"Jacob Camden",
				"Lynn Camden",
				"Jane Camden",
				"Noah Camden",
				"Maisie Camden",
				"Carol Camden",
				"Ashton Roberthon",
				"Weston Camden"
			],
			rightSelectedUsers:[],
			rightUsers:[]
    };
  },
  methods: {
		moveLeft() {
			if(!this.rightSelectedUsers.length) return;
			console.log('moveLeft',this.rightUsers);
			for(let i=this.rightSelectedUsers.length;i>0;i--) {
				let idx = this.rightUsers.indexOf(this.rightSelectedUsers[i-1]);
				this.rightUsers.splice(idx, 1);
				this.leftUsers.push(this.rightSelectedUsers[i-1]);
				this.rightSelectedUsers.pop();
			}
		},
		moveRight() {
			if(!this.leftSelectedUsers.length) return;
			console.log('moveRight', this.leftSelectedUsers);
			for(let i=this.leftSelectedUsers.length;i>0;i--) {
				let idx = this.leftUsers.indexOf(this.leftSelectedUsers[i-1]);
				this.leftUsers.splice(idx, 1);
				this.rightUsers.push(this.leftSelectedUsers[i-1]);
				this.leftSelectedUsers.pop();
			}
		}
  }
};
```

In both cases, I check first to see if anything has been selected. If so, I consider it an array and loop from the end of the array to the beginning. I do this because I'm going to be removing items from the array as I process them. The logic basically boils down to - for each of the selected items, I remove them from one array and add them to the other. Honestly that one part was the hardest for me. But that's it, and you can see it working below:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="GRoJvvg" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Duel Select">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/GRoJvvg">
  Vue Duel Select</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Version Two

Alright, so for the second version, I wanted to turn the above into a proper Vue component. I could have gone crazy with the number of options and arguments it took to allow for deep customization, but I decided to keep things simple and limit your options to:

* The name of the left column.
* The data in the left column.
* The name of the right column.
* The data in the right column.

Because CodePen can't (as far as I know) work with multiple SFCs in one pen, I decided to switch to [CodeSandbox](https://codesandbox.io/). On their platform, I created my component and set it up to support the parameters above. Here it is in it's entirety.

```html
{% raw %}<template>
  <div id="app" class="container">
    <div>
      <h2>{{leftLabel}}</h2>
      <select multiple v-model="leftSelectedData" @dblclick="moveRight">
        <option v-for="item in leftData">{{ item }}</option>
      </select>
    </div>

    <div class="middle">
      <button @click="moveRight">=&gt;</button>
      <button @click="moveLeft">&lt;=</button>
    </div>

    <div>
      <h2>{{rightLabel}}</h2>
      <select multiple v-model="rightSelectedData" @dblclick="moveLeft">
        <option v-for="item in rightData">{{ item }}</option>
      </select>
    </div>
  </div>
</template>
{% endraw %}
<script>
export default {
  data() {
    return {
      leftSelectedData: [],
      rightSelectedData: []
    };
  },
  props: {
    leftLabel: {
      type: String,
      required: true
    },
    rightLabel: {
      type: String,
      required: true
    },
    leftData: {
      type: Array,
      required: true
    },
    rightData: {
      type: Array,
      required: true
    }
  },
  methods: {
    moveLeft() {
      if (!this.rightSelectedData.length) return;
      for (let i = this.rightSelectedData.length; i > 0; i--) {
        let idx = this.rightData.indexOf(this.rightSelectedData[i - 1]);
        this.rightData.splice(idx, 1);
        this.leftData.push(this.rightSelectedData[i - 1]);
        this.rightSelectedData.pop();
      }
    },
    moveRight() {
      if (!this.leftSelectedData.length) return;
      for (let i = this.leftSelectedData.length; i > 0; i--) {
        let idx = this.leftData.indexOf(this.leftSelectedData[i - 1]);
        this.leftData.splice(idx, 1);
        this.rightData.push(this.leftSelectedData[i - 1]);
        this.leftSelectedData.pop();
      }
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: grid;
  grid-template-columns: 30% 10% 30%;
  align-items: center;
}

.container select {
  height: 200px;
  width: 100%;
}

.container .middle {
  text-align: center;
}

.container button {
  width: 80%;
  margin-bottom: 5px;
}
</style>
```

It's roughly the same as what I showed above (although this time you can see my lovely CSS styling), but with variables names that are a bit more abstract. Also note the use of the four props to pass in data. This then allows me to do this in a higher level component:

```html
<DualSelects
	leftLabel="Available Users"
	rightLabel="Chosen Users"
	:leftData="leftUsers"
	:rightData="rightUsers"
></DualSelects>
```

Which frankly I think is freaking cool. By binding the data I can now simply set/get the left and right side at will and let the user customize whats in each list. Here's the CodeSandbox version:

<iframe
     src="https://codesandbox.io/embed/duel-select-demo-ewsc9?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="duel select demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-autoplay allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

As I said above, I'm *sure* there is a nicer way to build this and I absolutely wouldn't mind seeing examples below, and finally, thank you again Ben for the inspiration!

<i>Header photo by <a href="https://unsplash.com/@levi_stute_cinematography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Levi Stute</a> on Unsplash</i>
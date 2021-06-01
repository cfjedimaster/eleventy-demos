---
layout: post
title: "Building Sudoku in Vue.js - Part 2"
date: "2019-12-19"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/papers.jpg
permalink: /2019/12/19/building-sudoku-in-vuejs-part-2
description: 
---

Earlier this week I [blogged](https://www.raymondcamden.com/2019/12/16/building-sudoku-in-vuejs-part-1) about my attempt to build a Sudoku game in Vue.js. At the time, I felt like I had done a good majority of the work, but that I was at a good stopping point to write it up and blog. Well last night I "finished" the app (to be clear, there's absolutely room for polish) and I'm kind of embarrassed at how little I had left to do. I'm going to assume I'm just far more intelligent than I think and am an awesome coder despite failing the Google test more than once.

In this update I tackled three things:

* Added the ability start a new game with a custom difficulty.
* Marking incorrect entries. Which again is a personal preference, it wouldn't be too hard to make this optional.
* Added the ability to notice when you won.

Let me tackle each part separately. For difficulty, I began by adding the supported difficulty levels to my state:

```js
difficulties: ["easy", "medium", "hard", "very-hard", "insane", "inhuman"],
```

I then modified `initGrid` to handle an optional difficulty:

```js
mutations: {
	initGrid(state, difficulty) {
		if(!difficulty) difficulty = state.difficulties[0];
 		state.origString = sudokuModule.sudoku.generate(difficulty);
```

Finally, over in my main `App.vue`, I added UI to render the difficulties and a button to start a new game. There's no restriction on when you can do this. First the HTML:

```html
<select v-model="difficulty"> 
<option v-for="(difficulty,idx) in difficulties" :key="idx">{% raw %}{{difficulty}}{% endraw %}</option>
</select> <button @click="newGame">Start New Game</button>
```

And here's the code behind this. 

```js
import { mapState } from 'vuex';

import Grid from '@/components/Grid';

export default {
  name: 'app',
  components: {
    Grid
  },
  data() {
    return {
      difficulty: null
    }
  },
  computed: mapState([
    'difficulties', 'wonGame'
  ]),
  created() {
    this.$store.commit('initGrid');
    this.difficulty = this.difficulties[0];
  },
  methods: {
    newGame() {
      this.$store.commit('initGrid', this.difficulty);
    }
  }
}
```

I'm using `mapState` to bring in the difficulties and then added a method, `newGame`, that calls `initGrid` with the selected difficulty.

Now let's look at marking incorrect values. I modified `setNumber` in my store to simply check if the new value matches the solution value:

```js
// highlight incorrect answers
if(x !== state.grid[state.selected.x][state.selected.y].solution) {
	row[state.selected.y].error = true;
} else {
	row[state.selected.y].error = false;
}
```

Then in Grid.vue, I check for this value and apply a class:

```html
<td v-for="(cell,idy) in row" :key="idy" 
:class="{ 
	locked: grid[idx][idy].locked, 
	selected:grid[idx][idy].selected,
	error:grid[idx][idy].error
}"
@click="setSelected(grid[idx][idy], idx, idy)"> {% raw %}{{ grid[idx][idy].value }}{% endraw %}</td>
```

Finally, to handle if you've won the game, I further modified `setNumber` by adding in this code:

```js
/*
did we win? this feels like it should be it's own method
*/
let won = true;
for(let i=0;i<state.grid.length;i++) {
	for(let x=0;x<state.grid[i].length;x++) {
		if(state.grid[i][x].value !== state.grid[i][x].solution) won = false;
	}
}
if(won) state.wonGame = true;
```

As the comment says, it really felt like this should be it's own method. Looking over my code now, I'd probably consider moving my Sudoku "game" logic in it's own file and keep my store focused on just the data. I say this again and again but I still struggle, or not struggle, but really think about, where to put my logic when it comes to Vue and Vuex. I love that Vue is flexible in this regard though!

The final part of handling "game won" logic is a simple conditional in the main component:

```html
<div v-if="wonGame">
	<h2 class="wonGame">YOU WON!</h2>
</div>
```

That's pretty simple and could be much more exciting, but I'm happy with it. You can see the code at <https://github.com/cfjedimaster/vue-demos/tree/master/sudoku>. If you want to see it in your browser, visit <https://sudoku.raymondcamden.now.sh/>. Please let me know what you think by leaving me a comment below!

<i>Header photo by <a href="https://unsplash.com/@tiendabandera?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tienda Bandera</a> on Unsplash</i>
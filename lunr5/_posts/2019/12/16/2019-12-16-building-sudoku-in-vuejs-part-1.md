---
layout: post
title: "Building Sudoku in Vue.js - Part 1"
date: "2019-12-16"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/phone_numbers.jpg
permalink: /2019/12/16/building-sudoku-in-vuejs-part-1
description: 
---

While sitting at my local airport yesterday, I decided to take advantage of a ninety minute delay by working on another Vue.js game - an implementation of Sudoku. No, not *that* guy...

<img src="https://static.raymondcamden.com/images/2019/12/dooku2.jpg" alt="Count Dooku" class="imgborder imgcenter">

But the [game](https://en.wikipedia.org/wiki/Sudoku) where you must fill in a puzzle grid. The grid consists of 9 rows of 9 cells. Each row must contain the numbers 1-9. Each column as well. And each "block" of 3x3 grids must always contain the numbers. Here's how a typical puzzle may look...

<img src="https://static.raymondcamden.com/images/2019/12/puzzle1.png" alt="Sudoku puzzle" class="imgborder imgcenter">

And here's the puzzle solved.

<img src="https://static.raymondcamden.com/images/2019/12/puzzle2.png" alt="Solved Sudoku puzzle" class="imgborder imgcenter">

I am - shall we say - slightly addicted to this game. It's a great way to pass some time and I enjoy the feeling of completing the puzzle. I'll typically play one to two puzzles per day and I'm *slowly* getting better at it. I thought it would be fun to take a stab at building my own Sudoku puzzle game in Vue.

To be clear, I didn't want to write the code to build a puzzle or solve it. That's some high level algorithm stuff that I simply suck at. (Ask me sometime about how I failed these tests trying to get a developer advocate job at Google.) But I figured if I googled for "sudoku javascript" I'd find about a million results and I wasn't disappointed. I came across a great library at <https://github.com/robatron/sudoku.js>. It generates puzzles, solutions, even possible candidates for empty cells it had everything. It was a bit old, but I figured that just meant it had some experience and why hold that against it? 

I've worked on this off and on over the past two days and I've gotten it about 70% done. I figured it was a good place to take a break, share what I've done so far, and then continue on to wrap the game later in the week. (And the good news is that when I couldn't sleep last night, I thought about *another* game I'm going to build in Vue later!) 

So, let's take a look! First, what do I have working so far?

* I have the puzzle being generated and displayed.
* You can click an empty square to select it.
* You can type a number and it fills in.
  
What's left?

* See if you solved the puzzle
* Let you start a new game and select the difficulty
  
Honestly there isn't a lot left, but I really felt like I hit a milestone tonight, and I'm tired, so I figured it was a good place to stop and blog. 

I'll start off with the `App.vue` page. Right now it's pretty minimal.

```html
<template>
  <div id="app">
    <h1>Sudoku</h1>
    <Grid />
  </div>
</template>

<script>
import Grid from '@/components/Grid';

export default {
  name: 'app',
  components: {
    Grid
  },
  created() {
    this.$store.commit('initGrid');
  }
}
</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
```

Basically it just calls the `Grid` component and then asks the grid to initialize itself. I'm using Vuex in this demo and most of the logic is there. Let's look at the Grid component.


```html
<template>
  <div>
    <table>
      <tbody>
      <tr v-for="(row,idx) in grid" :key="idx">
        <td v-for="(cell,idy) in row" :key="idy" 
		:class="{ locked: grid[idx][idy].locked, selected:grid[idx][idy].selected }"
        @click="setSelected(grid[idx][idy], idx, idy)"> {% raw %}{{ grid[idx][idy].value }}{% endraw %}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Grid',
  computed: mapState([
    'grid'
  ]),
  methods: {
    pickNumber(e) {
      let typed = parseInt(String.fromCharCode(e.keyCode),10);
      // if it was NaN, split out
      if(!typed) return;
      console.log(typed);
      this.$store.commit('setNumber', typed);
    },
    setSelected(cell,x,y) {
      this.$store.commit('setSelected',{x,y});
    }
  },
  mounted() {
    window.addEventListener('keypress', this.pickNumber);
  },
  destroyed() {
    window.removeEventListener('keypress', this.pickNumber);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  border-collapse: collapse;
  border: 2px solid;
}

td {
  border: 1px solid;
  text-align: center;
  height: 40px;
  width: 40px;
}

table tbody tr td:nth-child(3), table tbody tr td:nth-child(6) {
  border-right: 2px solid;
}

table tbody tr:nth-child(3), table tbody tr:nth-child(6) {
  border-bottom: 2px solid;
}

td.locked {
  cursor: not-allowed;
}

td {
  cursor: pointer;
}

td.selected {
  background-color: bisque;
}
</style>
```

Let me start off by saying that I am DAMN PROUD OF MY CSS! I honestly didn't think I'd get the design right.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I am *incredibly* proud I was able to style this Sudoku table with CSS. It was just a few border commands, but I honestly thought I couldn&#39;t do it. <a href="https://t.co/l8rzF2049E">pic.twitter.com/l8rzF2049E</a></p>&mdash; Raymond Camden 🥑 (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/1206341688874156032?ref_src=twsrc%5Etfw">December 15, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Outside of that my display just renders the table. I've got some basic keyboard support in (see my [article](https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app)) on that topic) as well as the ability to select a cell. You have to pick a cell before you can type in a number. But that's it. The real meat of the application is in my Vuex store.

```js
import Vue from 'vue'
import Vuex from 'vuex'

import sudokuModule from '@/api/sudoku.js';

Vue.use(Vuex);

/*
difficulty: easy,medium,hard,very-hard,insane,inhuman
*/

export default new Vuex.Store({
  state: {
    grid: null,
    origString:null,
    difficulty:'hard',
    selected:null
  },
  mutations: {
    initGrid(state) {
      state.origString = sudokuModule.sudoku.generate(state.difficulty);

      let candidates = sudokuModule.sudoku.get_candidates(state.origString)
      state.grid = sudokuModule.sudoku.board_string_to_grid(state.origString);

      let solution = sudokuModule.sudoku.solve(state.origString);
      let solvedGrid = sudokuModule.sudoku.board_string_to_grid(solution);

      // change . to "", also store a ob instead of just numbers
      for(let i=0;i<state.grid.length;i++) {
        for(let x=0;x<state.grid[i].length;x++) {

          let newVal = {
            value:parseInt(state.grid[i][x],10),
            locked:true,
            candidates:candidates[i][x],
            selected:false,
            solution:parseInt(solvedGrid[i][x],10)
          };
          if(state.grid[i][x] === '.') {
            newVal.value = '';
            newVal.locked = false;
          }
          state.grid[i][x] = newVal;
        }
      }
    },
    setNumber(state, x) {
      if(!state.selected) return;
      let row = state.grid[state.selected.x];
      row[state.selected.y].value = x;
      Vue.set(state.grid, state.selected.x, row);
    },
    setSelected(state, pos) {
      if(state.grid[pos.x][pos.y].locked) return;
      for(let i=0;i<state.grid.length;i++) {
       let row = state.grid[i];
       for(let x=0;x<row.length;x++) {
         if((i !== pos.x || x !== pos.y) && row[x].selected) { 
           row[x].selected = false;
         }
         if(i === pos.x && x === pos.y) {
           row[x].selected = true;
           state.selected = pos;
         }
       }
       Vue.set(state.grid, i, row);
     }
    }
  }
})
```

This is somewhat large, so let me point out some interesting bits. First off, this line:

```js
import sudokuModule from '@/api/sudoku.js';
```

I honestly guessed at this. The Sudoku code I used defines a sudoku object under `window` and is typically loaded via a script tag. I was going to add the script tag to my `index.html` but decided I'd try that. It worked, but I didn't know how to actually *get* to the methods. After some digging I found I could do it via `sudokuModule.sudoku.something()`. Again, I was just guessing here and I really don't know if this is "best practice", but it worked. 

`initGrid` does a lot of the setup work. I generate the puzzle, which is a string, and then convert it to a 2D array. The library has this baked in, but I made my own grid and store additional information - candidates, solution, and a locked value to represent numbers that were set when the game started (you can't change those).

`setNumber` simply sets a cell value, it doesn't validate if it's ok. I'm probably going to change that. When I play I like automatic alerts when I've picked the wrong value. That's probably cheating a bit, but I only guess when I'm frustrated with a hard puzzle and I'm fine with that.

Finally, `setSelected` is how I select a cell. I also use this to deselect anything picked previous. Make note of `Vue.set`. This is required when working with nested arrays/objects and it's probably something everyone using Vue runs into eventually. Check the docs on it for more details: [Change Detection Caveats](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats)

That's it for the first part. You can see the code as it stands currently at <https://github.com/cfjedimaster/vue-demos/tree/master/sudoku>. If you want to see it in your browser, visit <https://sudoku.raymondcamden.now.sh/>.

<i>Header photo by <a href="https://unsplash.com/@jamessutton_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">James Sutton</a> on Unsplash</i>
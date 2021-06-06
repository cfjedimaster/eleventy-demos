---
layout: post
title: "Yet Another Damn ToDo App in Vue.js"
date: "2020-01-08"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/todo.jpg
permalink: /2020/01/08/yet-another-damn-todo-app-in-vuejs
description: The second part in my series on building ToDo in Vue, with IndexedDB
---

So last week I published my thrilling post on building a ToDo app in Vue.js (["Another Damn ToDo App in Vue.js"](https://www.raymondcamden.com/2020/01/03/another-damn-todo-app-in-vuejs)). As promised, I'm following up on that post with an "enhanced" version of the application. The previous version was quite simple. It used Vue as a script tag, not a full Vue application, and stored the ToDos in memory. That meant on every reload the data was lost.

In this version I made three main changes:

* First I switched over to a complete Vue application.
* I added Vuex as a way to put my all my data access code in one place.
* I used IndexedDB to persist the ToDos over every load. This is still only *per device* so if you open the app on another machine or in another browser, it won't have the same data.
  
Let me explain each step of this.

### Switching to an Application

This part should be relatively straight forward. The original version of my application (which you can see [here](https://codepen.io/cfjedimaster/pen/NWPwweX)) was built with just a script tag and some code, no build process. There's nothing wrong with that! But with the idea that I'm enhancing this application to make it more powerful, it made sense for me to move this into an application.

I simply used the Vue CLI to scaffold a new application, using the `-b` option to keep it clean of stuff I didn't need.

With the new application, I copied over the HTML, CSS, and JavaScript from the first version and ensured everything still worked. A tip I like to share from time to time is to take baby steps as you develop. 

### Adding Vuex

I then added Vuex to the application. The idea being that my application components will ask for their data from Vuex and Vuex will handle retrieving, updating, and so forth. This required changes in the front-end component, so let's take a look. First, the HTML as the change here is super minor.

```html
<template>
	<div id="app">
		<h2>ToDos</h2>

		<table>
		<tr v-for="todo in sortedToDos" :key="todo.id">
			<td><span :class="{todoDone:todo.done}">{% raw %}{{todo.text}}{% endraw %}</span></td>
			<td>
				<button @click="toggleDone(todo)">
					<span v-if="todo.done">
					Incomplete
					</span><span v-else>
					Done
					</span>
				</button>
			</td>
		</tr>
		</table>

		<p>
			<input type="text" v-model="todoText">
			<button @click="saveToDo">Save ToDo</button>
		</p>    

	</div>
</template>
```

So literally the only change here is in the index in my loop. Previously my todos didn't have a primary key so I had to use the loop index as the key. Now my todos *do* have one so I use that instead. ANd that's it. The JavaScript changed quite a bit more though.


```js
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			todoText:''
		}
	},
	created() {
		this.$store.dispatch('loadToDos');
	},
	computed: {
		...mapGetters(['sortedToDos'])
	},
	methods: {
		saveToDo() {
			if(this.todoText === '') return;
			this.$store.dispatch('saveToDo', { text:this.todoText, done:false} );
			this.todoText = '';			
		},
		toggleDone(todo) {
			this.$store.dispatch('toggleToDo', todo);
		}
	}
}
```

First, I import `mapGetters`. This Vuex utility makes it easier to use getters from Vuex, which act like computed properties. My `created` method calls an action on the store that will fetch our data. Both `saveToDo` and `toggleDone` now call the store to handle their logic. 

### Implementing IndexedDB

For the most part, I copied the work I did back in October last year when I first discussed this topic, [Using IndexedDB in Vue.js](https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs). My store handles the data, but the persistence is handled by another script, `idb.js`. (That isn't the best name, but whatevs...) Here's my store:

```js
import Vue from 'vue'
import Vuex from 'vuex'

import idb from '@/api/idb';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: []
  },
  getters: {
    sortedToDos(state) {
      return state.todos.slice().sort((a,b) => {
        if(!a.done && b.done) return -1;
        if(a.done && b.done) return 0;
        if(a.done && !b.done) return 1;
      });
    }
  },
  mutations: {
    addToDo(state, todo) {
      state.todos.unshift(todo);
    },
    clearToDos(state) {
      state.todos = [];
    },
    toggleToDo(state, id) {
      state.todos = state.todos.map(t => {
        if(t.id === id) t.done = !t.done;
        return t;
      });
    }

  },
  actions: {
    async loadToDos(context) {
      context.commit('clearToDos');
      context.state.todos = [];
      let todos = await idb.getToDos();
      todos.forEach(t => {
        context.commit('addToDo', t);
      });
    },
    async saveToDo(context, todo) {
      await idb.saveToDo(todo);
      context.dispatch('loadToDos');
    },
    async toggleToDo(context, todo) {
      todo.done = !todo.done;
      await idb.saveToDo(todo);
      context.dispatch('loadToDos');
    }
  }
})
```

Note that I'm importing that second, new script, and I don't actually ever manipulate the state values. I load them from logic in the script. I manipulate a copy in my getter. But reading and writing is done in `idb.js`. That code is pretty much exactly the same as the blog post mentioned above, but here it is:

```js
const DB_NAME = 'tododb';
const DB_VERSION = 1;
let DB;

export default {

	async getDb() {
		return new Promise((resolve, reject) => {

			if(DB) { return resolve(DB); }
			console.log('OPENING DB', DB);
			let request = window.indexedDB.open(DB_NAME, DB_VERSION);
			
			request.onerror = e => {
				console.log('Error opening db', e);
				reject('Error');
			};
	
			request.onsuccess = e => {
				DB = e.target.result;
				resolve(DB);
			};
			
			request.onupgradeneeded = e => {
				console.log('onupgradeneeded');
				let db = e.target.result;
				db.createObjectStore('todos', { autoIncrement: true, keyPath:'id' });
			};
		});
	},
	async getToDos() {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['todos'],'readonly');
			trans.oncomplete = () => {
				resolve(todos);
			};
			
			let store = trans.objectStore('todos');
			let todos = [];
			
			store.openCursor().onsuccess = e => {
				let cursor = e.target.result;
				if (cursor) {
					todos.push(cursor.value)
					cursor.continue();
				}
			};

		});
	},
	async saveToDo(todo) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['todos'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('todos');
			store.put(todo);

		});
	
	}
}
```

Again, if you want more details on how this works, check out my [earlier post](https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs) (and feel free to ask me in a comment below). 

And that's pretty much it. You can see the complete source code of the application here: <https://github.com/cfjedimaster/vue-demos/tree/master/todos2>. I also have a live version you can run here: <https://todos2.raymondcamden.now.sh/>

<i>Header photo by <a href="https://unsplash.com/@glenncarstenspeters?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Glenn Carstens-Peters</a> on Unsplash</i>
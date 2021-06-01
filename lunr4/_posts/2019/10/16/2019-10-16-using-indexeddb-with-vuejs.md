---
layout: post
title: "Using IndexedDB with Vue.js"
date: "2019-10-16"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/storage2.jpg
permalink: /2019/10/16/using-indexeddb-with-vuejs
description: A look at storing data with IndexedDB and Vue
---

It's been a while since I've talked about one of my favorite APIs, [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Mainly because as cool as it is, there hasn't been much new about it recently. That being said, I was thinking about how I'd use it in Vue.js and decided to build a few demos to test it out. This post is *not* meant to be an introduction to IndexedDB, please see that previous link for a good guide. You can also check out jsMobileConf where I'm giving a [talk](https://jsmobileconf.com/schedule/session-camden.html) on client-side data storage next month. For my exploration, I built two demos. The first one is rather simple and makes use of CodePen and Vue embedded directly on the page. I.e. a "non-app" use of Vue. (I'm still struggling with the best way to refer to that!) The second demo is more complete, uses a full Vue application, and works with Vuex. As always, I'm hoping folks will provide feedback, suggestions, and share their own examples.

## Example One

As I said above, the first example was meant to be as simple as possible. With that in mind, I built a demo that lets you work with Cat data. You can add cats, but not via a form, just a simple button that adds random data. You can delete cats. And that's it. 

As it's rather short, let's start with the HTML.

```html
<div id="app" v-cloak>
  <div v-if="ready">
    <button @click="addCat" :disabled="addDisabled">Add Cat</button>
    <p/>
    <ul>
      <li v-for="cat in cats">
        {% raw %}{{cat.name}} is {{cat.age}}{% endraw %} years old. <button @click="deleteCat(cat.id)">Delete</button>
      </li>
    </ul>
  </div>
</div>
```

You can see the button used to add new cats, the list of existing cats, and then a delete button for each one. The JavaScript is where things get interesting. I tried my best to separate out the Vue methods such that event handlers focused on their own thing and other methods were specifically targeting IndexedDB calls. This will (hopefully) make a bit more sense when you see the code. Let's start with the `created` handler:

```js
async created() {
	this.db = await this.getDb();
	this.cats = await this.getCatsFromDb();
	this.ready = true;
},
```

This does three things. First, it initializes the IndexedDB database and waits for the db object so it can be used later. Then it asks for any existing data. Let's first look at `getDb`:


```js
async getDb() {
	return new Promise((resolve, reject) => {

	let request = window.indexedDB.open(DB_NAME, DB_VERSION);
	
	request.onerror = e => {
		console.log('Error opening db', e);
		reject('Error');
	};

	request.onsuccess = e => {
		resolve(e.target.result);
	};
	
	request.onupgradeneeded = e => {
		console.log('onupgradeneeded');
		let db = e.target.result;
		let objectStore = db.createObjectStore("cats", { autoIncrement: true, keyPath:'id' });
	};
	});
}
```

This is fairly boilerplate IndexedDB stuff. Open the database and setup an object store the first time you run the application. Our object store ("cats") uses autoincrementing primary keys. I don't specify any indexes on the store as I'm keeping it simple. In order to use `async` and `await`, I return a promise from the method and I resolve it in the `onsuccess` handler for the database. Now let's look at `getCatsFromDb`:

```js
async getCatsFromDb() {
	return new Promise((resolve, reject) => {

		let trans = this.db.transaction(['cats'],'readonly');
		trans.oncomplete = e => {
			resolve(cats);
		};
		
		let store = trans.objectStore('cats');
		let cats = [];
		
		store.openCursor().onsuccess = e => {
			let cursor = e.target.result;
			if (cursor) {
				cats.push(cursor.value)
				cursor.continue();
			}
		};

	});
},
```	

This method opens up a read transaction, then a cursor, and will iterate over each object until done. As before, I wrap this up in a promise so I can use `async\await`. 

Whew, ok, almost there. Let's look at the 'add cat' logic. As I said above, to make this simpler, I just created random data. I've written enough forms in my life, I'm allowed to skip them from time to time.

```js
async addCat() {
	this.addDisabled = true;
	// random cat for now
	let cat = {
		name:"Cat" + Math.floor(Math.random() * 100),
		age:Math.floor(Math.random() * 10)+1
	};
	console.log('about to add '+JSON.stringify(cat));
	await this.addCatToDb(cat);
	this.cats = await this.getCatsFromDb();
	this.addDisabled = false;      
},
```

This method is primarily just concerned with the UI/UX of the operation. It chains out to `addCatToDb` for the actual persistence.

```js
async addCatToDb(cat) {
	return new Promise((resolve, reject) => {

	let trans = this.db.transaction(['cats'],'readwrite');
	trans.oncomplete = e => {
		resolve();
	};

	let store = trans.objectStore('cats');
	store.add(cat);

	});
},
```

While not much more complex, I liked separating this out. And as before, I'm wrapping my calls in a promise. The final bit is deletion and it uses a similar pattern. First the method you call when clicking the delete button.

```js
async deleteCat(id) {
	await this.deleteCatFromDb(id);
	this.cats = await this.getCatsFromDb();      
},
```

And then the actual deletion:

```js
async deleteCatFromDb(id) {
	return new Promise((resolve, reject) => {
	let trans = this.db.transaction(['cats'],'readwrite');
	trans.oncomplete = e => {
		resolve();
	};

	let store = trans.objectStore('cats');
	store.delete(id);
	});
},
```

All in all not too bad. If you want, you can play with the complete demo here:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="oNNxavx" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="IDB1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/oNNxavx">
  IDB1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Example Two

For the second example, I went all in. A full Vue.js application, routing, Vuex, and more. I built a full CRUD that lets you view cats, add and edit them, and then delete it.

<img src="https://static.raymondcamden.com/images/2019/10/catdb.png" alt="Example of the app's UI" class="imgborder imgcenter">

All of the code for this demo may be found in my GitHub repo: <https://github.com/cfjedimaster/vue-demos/tree/master/idb> 

You can run this version in your browser here: <https://idb.raymondcamden.now.sh/>

I won't share all of the code as it's mostly UI stuff (and you can browse it yourself at the link above), but I will describe my general approach. I built the first version of the app such that IndexedDB wasn't used at all. Instead, Vuex kept the data in memory. This allowed me to build out the UI, routing, and so forth, and then simply edit the store later. Here's the initial version of my store.

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cats:[]
  },
  mutations: {

  },
  actions: {
    deleteCat(context, cat) {
      console.log('store is being asked to delete '+cat.id);
      context.state.cats = context.state.cats.filter(c => {
        return c.id != cat.id;
      });
    },
    getCats(context) {
      if(context.state.cats.length === 0) {
        context.state.cats.push({name:'default cat', age:1, id: 1});
        context.state.cats.push({ name: 'cat deux', age: 2, id: 2 });
      }
    },
    async saveCat(context, cat) {
      if(cat.id) {
        context.state.cats.forEach(c => {
          if(c.id === cat.id) {
            c.name = cat.name;
            c.age = cat.age;
          }
        });
      } else {
        cat.id = context.state.cats.length+1;
        context.state.cats.push(cat);
      }
    }
  }
})
```

Just three methods, all working with a simple array of data. This worked perfectly though and let me focus on the flow of the application. Switching to IndexedDB then was a completely separate job. Here's the current version of the store.

```js
import Vue from 'vue'
import Vuex from 'vuex'

import idb from '@/api/idb';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cats:[]
  },
  mutations: {

  },
  actions: {
    async deleteCat(context, cat) {
      await idb.deleteCat(cat); 
    },
    async getCats(context) {
      context.state.cats = [];
      let cats = await idb.getCats();
      cats.forEach(c => {
        context.state.cats.push(c);
      });
    },
    async saveCat(context, cat) {
      await idb.saveCat(cat);
    }
  }
})
```

As you can see, it's actually somewhat simpler. That's because the actual storage work is being done in a new component, `idb`. In this version, Vuex simply handles managing the data, but not storing or retrieving. I could replace IndexedDB with API calls and no one would be the wiser. Let's consider `idb.js` now.

```js
const DB_NAME = 'catdb';
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
				db.createObjectStore("cats", { autoIncrement: true, keyPath:'id' });
			};
		});
	},
	async deleteCat(cat) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['cats'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('cats');
			store.delete(cat.id);
		});	
	},
	async getCats() {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['cats'],'readonly');
			trans.oncomplete = () => {
				resolve(cats);
			};
			
			let store = trans.objectStore('cats');
			let cats = [];
			
			store.openCursor().onsuccess = e => {
				let cursor = e.target.result;
				if (cursor) {
					cats.push(cursor.value)
					cursor.continue();
				}
			};

		});
	},

	async saveCat(cat) {

		let db = await this.getDb();

		return new Promise(resolve => {

			let trans = db.transaction(['cats'],'readwrite');
			trans.oncomplete = () => {
				resolve();
			};

			let store = trans.objectStore('cats');
			store.put(cat);

		});
	
	}

}
```

In general, this is pretty similar to the code used in the first version. I've got IndexedDB calls wrapped in promises. I cache the database handler too so it's only opened once. I could make this easier too if I used one of the many IndexedDB wrapper libraries out there, but as I was a bit out of practice working with IndexedDB, I kinda wanted to do things "by hand" as a way of remembering.

So - I hope this helps. If you want to learn more, definitely look at the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) on the subject. As always, leave me a comment below if you have a question or suggestion!

<i>Header photo by <a href="https://unsplash.com/@frankiefoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">frank mckenna</a> on Unsplash</i>

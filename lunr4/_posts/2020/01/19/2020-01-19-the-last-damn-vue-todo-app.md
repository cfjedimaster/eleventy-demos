---
layout: post
title: "The Last Damn Vue ToDo App"
date: "2020-01-19"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/todo.jpg
permalink: /2020/01/19/the-last-damn-vue-todo-app
description: Last in a series of Vue.js ToDo app posts
---

Welcome to the last, ever (ok, for me) iteration of the ToDo app in Vue.js. I started this series a few weeks ago (["Another Damn ToDo App in Vue.js"](https://www.raymondcamden.com/2020/01/03/another-damn-todo-app-in-vuejs)). In the first iteration, the data was ephemeral and lost every time you closed the application. I then followed up with a version that persisted the data using IndexedDB, ["Yet Another Damn ToDo App in Vue.js"](https://www.raymondcamden.com/2020/01/08/yet-another-damn-todo-app-in-vuejs). In this third and final version I decided to kick it up quite a bit by adding [Google Firebase](https://firebase.google.com/).

Firebase is a platform I've been meaning to play with for quite sometime now. It's got quite a few features but at minimum I knew it supported a cloud-based database and authentication. With that in mind, I wanted to add the following support to the previous version.

* Store data in Firebase. 
* Add authentication to the application.
* Associate data with the current user.
* Make it so only logged in users can read and write data.
* Make it so you can only read and write your own data.
  
I got it working, but I want to be super, duper clear that this is my first attempt at building such a thing. <strong>My assumption is that my security rules are NOT RIGHT.</strong> They seem right, but if you aren't 100% sure when it comes to security you might as well be 0% sure. I also think my code, in general, is a bit messy and could be organized a bit better perhaps. But as I got the basic features done I thought it was a good place to stop, take stock, and write about my experience.

Lastly, I intentionally did *not* look for Vue/Firebase plugins/modules/etc as I wanted to do everything "by hand" so to speak, at least for this first build.

Basically - I hope this post gives you an idea about Firebase and Vue but please, please, please consider this a rough first draft that is incomplete. 

Ok, ready?

## Getting Started

I started off with the [Cloud Firestore](https://firebase.google.com/docs/firestore) documentation. Firebase is the overall product whereas Firestore is specifically related to data storage. Initially this went rather well. Setting up the project was pretty simple. Although at the time I didn't realize that the project is like an overall... err... well project and you need an "app" under the project as well. Things got a bit confusing in the [quickstart](https://firebase.google.com/docs/firestore/quickstart):

<img src="https://static.raymondcamden.com/images/2020/01/fs1.png" alt="Screen shot of directions" class="imgborder imgcenter">

Notice how step 1 takes you to *another* guide, kinda, and I tried to manage that section plus this section together and it was... weird. Looking at it now... I guess the idea is that you add Firebase, and then Firestore? Although step 2 has that already. Maybe it's just me. :)

## Initial Version

So going through the docs, my initial changes basically came down to:

1) Adding script tags to my index.html. The Vue CLI uses it as a template that gets injected with your Vue app.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-firestore.js"></script>
    <title>todos3</title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but todos3 doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

Next it was time to work with Firestore. In the previous iteration, my component calls to a Vuex store. The store uses an API library that manages access to IndexedDB. My goal was to simply make a new API library and 'drop' it into the store. I was able to do that. Here's the new API file, `firestore.js`:

```js
const FS_API_KEY = 'AIzaSyC2AhAIueIBhcUHt1zLW69HSlUy8gIyCuE';
const FS_AUTH_DOMAIN = 'todos3.firebaseapp.com';
const FS_PROJECT_ID = 'todos3';
const FS_COLLECTION = 'todos';

let DB;

export default {

	async getDb() {
		return new Promise((resolve, reject) => {

			if(DB) { return resolve(DB); }
			console.log('OPENING FS');
			try {
				firebase.initializeApp({
					apiKey: FS_API_KEY,
					authDomain: FS_AUTH_DOMAIN,
					projectId: FS_PROJECT_ID
				});

				DB = firebase.firestore();
				resolve(DB);
			} catch(e) {
				reject(e);
			}
		});
	},
	async getToDos() {

		let db = await this.getDb();

		return new Promise(resolve => {
			console.log('attempt to get data');
			let todos = [];
			db.collection(FS_COLLECTION).get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
					let todo = doc.data();
					todo.id = doc.id;
					todos.push(todo);
				});
				resolve(todos);
			});			

		});
	},
	async saveToDo(todo) {
		let db = await this.getDb();

		if(!todo.id) return db.collection(FS_COLLECTION).add(todo);
		else return db.collection(FS_COLLECTION).doc(todo.id).update(todo);

	}
}
```

Let's tackle it bit by bit. The `getDB` routing now handles Firebase initialization and grabbing the firestore object. As a method though it acts the same as the previous version, returning a databasr object.

`getToDos` makes use of Firestore's API to load every document. I manipulate the results a bit to store the ID the Firestore creates into the document object itself. But at the end, as before, I'm returning an array of todos.

Finally, `saveToDo` makes use of the Firestore API as well. In my code I detect a new versus old todo by looking for the ID value. I'm pretty confident that Firestore probably has a "storeThisThingNewOrOld" method, like IndexedDB does, that would make my code simpler and if anyone wants to chime in below in the comments, I'd love it. But I'm also fine with it as is - it's very short.

And that was it!! Honestly I was a bit surprised actually. I tested offline support and saw that it handled it mostly well. When I went offline (using devtools of course) and tried to store a value, I got an error in the console. But when I went online, Firestore automatically saved the data. <strong>That's awesome!</strong> So I guess all I would need to do is add my own support for noticing the error and let the user know their data would sync when online. In other words, I'd handle letting the user know, Firestore would handle the acutal synchronization, which is bad ass. 

## Bring in the Users

Ok, just to re-iterate what I said above, I do not have confidence that I did the security aspect right. It *seems* to be working but you should not take this as a complete 100% safe example. 

So, working with the security aspect was a bit more difficult. I guess that's to be expected, and I did get it working, but it was definitely harder.

I started off at the core docs, [Firebase Auth](https://firebase.google.com/docs/auth/). This had me then go to their [UI library](https://github.com/firebase/firebaseui-web) which reminds me a bit of Auth0. It was a bit weird going from "official" Google docs to GitHub, it also made me feel like this was not an official supported part of the project. Don't get me wrong - I'm pro GitHub of course, but I was surprised this was "external" documentation. 

The UI stuff lets you select providers, like Google, Facebook, etc, again much like Auth0. For my testing I kept it simple and just used Google. The net result of this part of the process is that you get a user object. From what I know, all calls from that moment on will include the authentication data. 

I began by adding more stuff to the index.html file:

```html
<script src="https://www.gstatic.com/firebasejs/7.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/ui/4.3.0/firebase-ui-auth.js"></script>
<link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.3.0/firebase-ui-auth.css" />
```

I then added support to login to my application. In the main component, I added a 'logged in' and 'not logged in' view like so:

```html
<template>
	<div id="app">
		<div v-if="user">
			<h2>ToDos for {{ user.displayName }}</h2>

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
		</div><div v-else>
			<p><i>You must login first...</i></p>
			<button @click="login">Login with Google</button>
		</div>
	</div>
</template>
```

Previously I was only using my firestore API in Vuex, but I added it to my component so I could fire off the request here. This is the part where I think could be a bit messy. Previously only Vuex "spoke" to the API and the component had no idea of Firestore. Now my app is tied to Firestore outside of Vuex as well. Not saying this is wrong, just saying I'm not sure.

Here's the code:

```js
import { mapGetters } from 'vuex';
import fs from '@/api/firestore';

export default {
	data() {
		return {
			todoText:'',
			user:null
		}
	},
	created() {

	},
	computed: {
		...mapGetters(['sortedToDos'])
	},
	methods: {
		async login() {
			console.log('trying login');
			let user = await fs.login();
			this.user = user;
			this.$store.dispatch('loadToDos');
		},
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

Now let's look at `firestore.js` again. It's been updated to support a login method. Note that it will store the user ID and use it when both fetching data as well as saving data.

```js
const FS_API_KEY = 'AIzaSyC2AhAIueIBhcUHt1zLW69HSlUy8gIyCuE';
const FS_AUTH_DOMAIN = 'todos3.firebaseapp.com';
const FS_PROJECT_ID = 'todos3';
const FS_COLLECTION = 'todos';

let setup = false;
let DB;
let UID;

export default {

	init() {

		if(setup) return;
		firebase.initializeApp({
			apiKey: FS_API_KEY,
			authDomain: FS_AUTH_DOMAIN,
			projectId: FS_PROJECT_ID
		});

		setup = true;

	},
	async login() {

		this.init();
		let provider = new firebase.auth.GoogleAuthProvider();
		return new Promise((resolve, reject) => {

			firebase.auth().signInWithPopup(provider).then(function(result) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				let token = result.credential.accessToken;
				// The signed-in user info.
				let user = result.user;
				UID = user.uid;
				resolve(user);
			}).catch(function(error) {
				reject(error);
			});

		});

	},
	async getDb() {
		return new Promise((resolve, reject) => {

			if(DB) { return resolve(DB); }
			try {
				this.init();
				DB = firebase.firestore();
		
				resolve(DB);
			} catch(e) {
				reject(e);
			}
		});
	},
	async getToDos() {

		let db = await this.getDb();

		return new Promise(resolve => {
			let todos = [];
			db.collection(FS_COLLECTION).where('userId','==',UID).get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					let todo = doc.data();
					todo.id = doc.id;
					todos.push(todo);
				});
				resolve(todos);
			});			

		});
	},
	async saveToDo(todo) {
		let db = await this.getDb();
		// always associate with me
		todo.userId = UID;
		if(!todo.id) return db.collection(FS_COLLECTION).add(todo);
		else return db.collection(FS_COLLECTION).doc(todo.id).update(todo);

	}
}
```

When I run the app now and click the button, it will open a popup and use a similar UI that I've seen elsewhere for Google login. If you've got multiple signins associated with the browser, you can select the right one. Basically, it's conforms to what users expect when it comes to Google signin.

The final part of this was securing things on the server side. This was probably the thing that impressed me the most in Firestore. You can write your security rules as simple logic right in the UI for your project. So for example, my "only logged in people can do stuff and you only get your own stuff" rule was:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todo} {
      allow read, update, delete: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

You can see more examples at the [docs](https://firebase.google.com/docs/firestore/security/get-started) and as I said multiple times above, I'm not sure this is right, but I really dig how this is done. I love having my security right there at the database level and the syntax felt right, even if I had to guess a bit before it worked right.

Before I published this blog entry, I switched it to their sample "Deny All" rule:

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

And that's it. I ran my demo in two separate browsers, both logged in as me, and the data was the same between them.

For folks who read this long, thank you! If you want the source, you can find it here: <https://github.com/cfjedimaster/vue-demos/tree/master/todos3> Despite having a bit of a rough start, I'm pretty impressed by Firestore and I definitely want to use it again.


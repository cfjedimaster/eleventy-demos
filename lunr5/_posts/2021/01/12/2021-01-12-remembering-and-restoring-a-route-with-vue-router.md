---
layout: post
title: "Remembering (and Restoring) a Route with Vue Router"
date: "2021-01-12"
categories: ["JavaScript"]
tags: ["vuejs"]
banner_image: /images/banners/routes.jpg
permalink: /2021/01/12/remembering-and-restoring-a-route-with-vue-router
description: How you can return a route in Vue Router after an event, like a login.
---

While playing Dragon Quest X1 Sunday morning, a random idea popped in my head and it was interesting enough to convince me
to put down the controller and take out the laptop and work on a quick demo. What idea was it? In most (well built) sites, if you request a resource that requires a login, you will be returned to that resource after successfully logging in. I was curious how I'd do that with a Vue single page application.

I began by creating an incredibly simple Vue application. It consisted of these views:

* A home page.
* A products page with a list of static products.
* A detail page for each product.
* A users age with a list of static users.
* A detail page for each user.
* A login page with a button you can click to login.

Nothing in the above was hitting an API so it was pretty quick to build. If you are reading this I'm assuming you're already familiar with Vue and [Vue Router](https://router.vuejs.org/). I'm also using [Vuex](https://vuex.vuejs.org/) for state management. 

The only thing really interesting in the initial demo would be how I handle login checking and redirecting. This is from the end of my `router/index.js` file:

```js
router.beforeEach((to, from, next) => {
  if(!store.state.loggedin && !(to.name === 'Login')) {
    next({name:'Login'});
  } else next();
});
```

Pretty straightforward. If I'm not logged in and I'm not actually loading the login page, redirect. As I said, everything is static data, so this is how the `login` routine works on `Login.vue`:

```js
login() {
	this.$store.commit('setLogin', true);
	this.$router.replace({name:'Home'});
}
```

Basically pass on to Vuex the current login state and then go home.

You can demo this yourself live here: <https://v1.raymondcamden.vercel.app/>. Click the button to login, click around a bit, and reload. Note that you will be logged out. After logging in again, you return to the home page. The source code for this initial version may be found here: <https://github.com/cfjedimaster/vue-demos/tree/master/rememberroute/v1>

Ok, so that's V1. To support what I wanted, here's the changes I made in V2. First, in my router, I told Vuex to remember my route:

```js
router.beforeEach((to, from, next) => {
  if(!store.state.loggedin && !(to.name === 'Login')) {
    store.commit('setLastPath', to.fullPath);
    next({name:'Login'});
  } else next(); 
});
```

I store the value of `fullPath` as it contained *everything* possible in the URL, including the path as well as query string parameters. To test this, I modified a page to manually include one, like so: 

```html
<router-link to="/user/3?name=jacob">Test</router-link>
```

My next change was to my login routing. Here's how it was modified:

```js
login() {
	this.$store.commit('setLogin', true);
	if(this.$store.state.lastPath) {
		let next = this.$store.state.lastPath;
		this.$store.commit('setLastPath', '');
		this.$router.replace(next);
	} else {
		this.$router.replace({name:'Home'});
	}
}
```

As before, I store my login state, but now I look to see if a `lastPath` value was stored in Vuex. In theory, it *always* should be. If so, I clear the old value and redirect there, otherwise I just go home. Again, in theory, `lastPath` should always be there, but it just felt safer using the if statement to be sure. 

You can demo this version here, and note I'm linking to a subpage, not the home page: <https://v2.raymondcamden.vercel.app/users>. And you can see the full source here: <https://github.com/cfjedimaster/vue-demos/tree/master/rememberroute/v2>

Definitely not rocket science Vue.js stuff, but I wanted to see it in action myself so I figured I'd share the results. I'd love to hear how others are doing it and if you would like, share a comment below with your implementations.

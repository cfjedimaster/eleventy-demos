---
layout: post
title: "Saving Form Data in Client-Side Storage"
date: "2022-03-27T18:00:00"
categories: ["JavaScript"]
tags: []
banner_image: /images/banners/grocery2.jpg
permalink: /2022/03/27/saving-form-data-in-client-side-storage.html
description: A look at aching form field data for restoring later
---

Today's post is one of those that started off with me worrying that it was going to be too simple and quickly turned into a bit of a complex little beast. I love that as it usually means my expectations were wrong and I've got a chance to expand my knowledge a bit. This post came from a simple idea: While working on a form, can we save your form data for restoring later in case you navigate away, close the tab by accident, or perhaps get "surprised" by an operating system update. While this is not something you would want to use in every situation (for example, storing a new password field), there's plenty of examples where this could be helpful, especially in a larger form. 

For our demo I will only cover client-side storage, which means the data will be unique to one browser on the device. Although what I described here could be tied to a back-end service for storing temporary form data as well.

Initially I tried to build a generic solution that would apply to any and all forms but quickly discovered that it became Non-Trivial to the point where I decided a more hard-coded solution would be better. My assumption here is that my readers can take these techniques and apply to them to their site with a bit of work. As always, if you have any questions, just let me know!

## The Form

Alright, let's start off by looking at the form I'll use for the demo. While covering every unique kind of form field would be overwhelming, I tried to cover the main ones: A few text fields, a set of checkboxes, a set of radio fields, and a textarea. Here's the HTML:

```html
<form id="mainForm">
	<p>
	<label for="name">Name</label>
	<input type="text" name="name" id="name">
	</p>
	<p>
	<label for="email">Email</label>
	<input type="email" name="email" id="email">
	</p>
	<p>
	<label for="inus">In US?</label>
	<select name="inus" id="inus">
		<option></option>
		<option value="true">Yes</option>
		<option value="false">No</option>
	</select>
	</p>
	<p>
		<label for="department">Department</label><br/>
		<input type="radio" name="department" id="dept1" value="dept1"><label for="dept1">Dept 1</label><br/>
		<input type="radio" name="department" id="dept2" value="dept2"><label for="dept2">Dept 2</label><br/>
		<input type="radio" name="department" id="dept3" value="dept3"><label for="dept3">Dept 3</label><br/>
</p>
<p>
	<label for="cookie">Favorite Cookie (Select as many as you want):</label><br/>
	<input type="checkbox" name="cookie" id="cookie1" value="Chocolate Chip"><label for="cookie1">Chocolate Chip</label><br/>
	<input type="checkbox" name="cookie" id="cookie2" value="Sugar"><label for="cookie2">Sugar</label><br/>
	<input type="checkbox" name="cookie" id="cookie3" value="Ginger"><label for="cookie3">Ginger</label><br/>
	<input type="checkbox" name="cookie" id="cookie4" value="BW"><label for="cookie4">Black &amp; White</label><br/>
</p>		
<p>
	<label for="comments">Comments</label><br/>
	<textarea name="comments" id="comments"></textarea>
</p>
<p>
	<input type="submit">
</p>
</form>
```

It's not terribly exciting, but gets the job done in terms of demonstrating multiple types of form fields. 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/03/f1.jpg" alt="Picture of the rendered form fields" class="lazyload imgborder imgcenter">
</p>

## Saving Form Data

Let's begin with how to save the form. Here's the high level approach I'm going to use:

* The data will be stored in LocalStorage. This will let it persist forever (not really, but close enough) and will be an incredibly simple API to work with. IndexedDB can store a *lot* more data, but all we're storing is a form.
* I will persist the data on every change. We could get fancy and save on an interval, but it's relatively inexpensive to just save on every change. 

To begin, I setup my code to fire some logic on `DOMContentLoaded` as well as create some global variables:

```js
document.addEventListener('DOMContentLoaded',init,false);

let name, email, inus, depts, cookies, comments;
```

Now let's look at `init`:

```js
function init() {
	// get the dom objects one time
	name = document.querySelector('#name');
	email = document.querySelector('#email');
	inus = document.querySelector('#inus');
	depts = document.querySelectorAll('input[name=department]');
	cookies = document.querySelectorAll('input[name=cookie]');
	comments = document.querySelector('#comments');
	
	// listen for input on all
	let elems = Array.from(document.querySelectorAll('#mainForm input, #mainForm select, #mainForm textarea'));
	elems.forEach(e => e.addEventListener('input', handleChange, false));
}
```

As I mentioned above, I'm not going for a generic solution, but rather one tied to my exact form. You can see then I create a variable representing the DOM item for each of my fields. `depts` and `cookies` ae special as they are a set of items, not just one. 

But while I'm *not* going dynamic to set up the variables pointing to the form fields, I *did* go dynamic to set up the event handler. I could have added an event listener for each of my variables (and ensuring I handled `depts` and `cookies` in a loop), but this shortcut handles matching any form fields inside my form and then letting me quickly assign the handler for each. 

Now that we've got event handlers, we can build logic to persist the form. This handler will fire on *any* change in the fields, but as I said above, we'll get *all* the data and persist.

```js
function handleChange(e) {
	
	console.log('handleChange');
	/*
	get all values and store
	first the easy ones
	*/
	let form = {};
	form.name = name.value;
	form.email = email.value;
	form.inus = inus.value;
	form.comments = comments.value;
	// either null or one
	depts.forEach(d => {
		if(d.checked) form.department = d.value;
	});
	// either empty array or some things
	form.cookies = [];
	cookies.forEach(c => {
		if(c.checked) form.cookies.push(c.value);
	});
	
	// now store
	saveForm(form);
}
```

I create an object, `form`, to store my data, and then get the "simple" ones where I can just check the `value`. This works for the `select` tag too. For the radio and checkbox ones, I handle them a bit differently. The radio one, `depts`, will either have nothng selected ore one, so if nothing is picked, it's never saved, or it's a value. For `cookies`, I'll always have an empty array at minimum, but will fill it with the values when selected.

Finally, I take the data and pass it to another function. The code to use LocalStorage is very simple, but I wanted it abstracted in case the decision was made to change to something else in the future. Here's that function:

```js
function saveForm(form) {
	let f = JSON.stringify(form);
	window.localStorage.setItem('form', f);
}
```

Remember that LocalStorage only takes simple values, so the object is serialized to a string first.

Woot! Ok, at this point, I can type in data, and confirm it's working in DevTools:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/03/f2.jpg" alt="Picture from DevTools showing saved form" class="lazyload imgborder imgcenter">
</p>

## Retrieving the Data

Now that there's a way to store the form, let's look at fetching the data (if it exists) and use it. Back in `init`, I added the following:

```js
// do we have a cached form?
let cached = getForm();
if(cached) {
	name.value = cached.name;
	email.value = cached.email;
	inus.value = cached.inus;
	comments.value = cached.comments;
	if(cached.department) {
		depts.forEach(d => {
			if(d.value === cached.department) d.checked = true;
		});
	}
	if(cached.cookies) {
		cookies.forEach(c => {
			if(cached.cookies.includes(c.value)) c.checked = true;
		});
	}
}
```

I begin by fetching the form (I'll show that in a second) and if the cache exists, I make use of it. For all the simple values, and the `select`, it's easy to set. For the checkbox and radio ones, it's slightly more complex. `depts` will either be null or a value, but `cookies` will be an array (technically it will always exists so the `if` there isn't really necessary) and I make use `includes` to check the cached array. 

As with `saveForm`, I wanted to wrap the cache retrieval logic to handle updating the storage in the future. Here's `getForm`:

```js
function getForm() {
	let f = window.localStorage.getItem('form');
	if(f) return JSON.parse(f);
}
```

There's one last thing to do. When the form is submitted, it makes sense to clear the cache. I added this to the end of `init`:

```js
document.querySelector('#mainForm').addEventListener('submit', () => {
	window.localStorage.removeItem('form');
}, false);
```

This is nice and simple, but I'm being a bit inconsistent here by not abstracting out how I work with persistence. It's one line, and I feel kinda bad about it, but I'm also fine leaving it for now. 

Here's the complete demo for you to play with and copy!

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="abEWNaG" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/abEWNaG">
  Save Form Draft (B)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Stop Reading (If you want...)

Ok, if you've learned something from this post and don't want to read my ramblings, feel free to stop reading now. None of this will make things any more clearer or help in any way, I just thought I'd share something interesting I found. 

As I mentioned, my initial hope was to build a generic solution to make serializing and deserializing the form much simpler. I thought about making use of [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData). One of the feature it supports is initializing it's data on an existing form. 

It worked well in my testing, but I was worried about the checkboxes and radio elements. It handled getting the data just fine, but there was no built in way to serialize FormData to a string. I could loop over the items manually, but then I felt like I wasn't saving much time. Also, there was no way to tell if the name/value pairs applied to a checkbox or radio set. So I'd still need to gather up the field types so that I could know how to apply the data again later.

All in all - I absolutely felt like I could write a generic utility to handle any form - but was worried it would be a bit too much for this post. And I figured it was probably already done better by others. :) 

Photo by <a href="https://unsplash.com/@nathaliarosa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nathália Rosa</a> on <a href="https://unsplash.com/s/photos/store?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
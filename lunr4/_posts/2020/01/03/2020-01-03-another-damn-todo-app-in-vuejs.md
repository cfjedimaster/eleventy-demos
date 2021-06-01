---
layout: post
title: "Another Damn ToDo App in Vue.js"
date: "2020-01-03"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/todo.jpg
permalink: /2020/01/03/another-damn-todo-app-in-vuejs
description: How I built the classic ToDo app in Vue.js, the first in a series
---

It's become somewhat of a trend these days to build ToDo apps in various languages. In fact, it's a rule that you can't release a new programming language, or framework, unless it can build a ToDo app. Seriously, I read it on the Internet. 

<img src="https://static.raymondcamden.com/images/2020/01/vuetodo1.jpg" alt="It's true" class="imgborder imgcenter">

You can even find an entire website dedicated to showing you different examples of the ToDo app: <http://todomvc.com/> 

It's gotten to a point where I just really don't like seeing ToDo apps even if I recognize their appeal. The functionality is rather simple. We've all got a basic idea of what they do. Etc. That being said, I just never wanted to actually write a post like this.

But during the holiday break, I was thinking about how I could use the classic ToDo app as a way to show different iterations of the same app with Vue.js. Specifically I want to write three blog posts.

The first post (this one!) will demonstrate the simplest form of the app and be completely in memory, meaning that as soon as you close the browser tab the data will go away.

The second post will update the code to add in Vuex and IndexedDB to persist the data. I've talked about [IndexedDB and Vue](https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs) a few times already, but I think showing the upgrade to add it's support will be useful.

Finally, the third post will show storing the data using [Firebase](https://firebase.google.com). Firebase has been on my own "todo" list to learn for sometime now and I thought it would make an awesome final iteration of the project. 

Now I'm starting this right before heading to my first CES so there may be a bit of break between posts, but I'm sure yall are fine waiting a bit while I do my best to survive the madness in Vegas.

Alright, with that out of the way, let me describe how I built the simplest version of my ToDo app in Vue.js. First let's look at the UI/UX:

<img src="https://static.raymondcamden.com/images/2020/01/vuetodo2.jpg" alt="Initial Screen" class="imgborder imgcenter">

Initially you're presented with a header, no todos (because remember, the data doesn't persist), and a form field to add a new one. Type in some text and hit the button and you get:

<img src="https://static.raymondcamden.com/images/2020/01/vuetodo3.jpg" alt="One item added" class="imgborder imgcenter">

You can add as many as you like, each one appearing on top of the list.

<img src="https://static.raymondcamden.com/images/2020/01/vuetodo4.jpg" alt="More items added" class="imgborder imgcenter">

The button to the right of each todo lets you mark it done. There is no edit or delete. Do the damn task. When clicked, the item is crossed out, moved to the bottom, and you have the option to "re-open" it so to speak.

<img src="https://static.raymondcamden.com/images/2020/01/vuetodo5.jpg" alt="Items marked complete" class="imgborder imgcenter">

And that's it. So what's the code look like? 

I began by defining my data which consists of the array of todos and the variable that will be bound to the form field.

```js
data: {
	todos:[],
	todoText:''
},
```

To add a new todo, I use this simple HTML. It could definitely have some validation and nicer UI. 

```html
<input type="text" v-model="todoText">
<button @click="saveToDo">Save ToDo</button>
```

This is tied to this method:

```js
saveToDo() {
	if(this.todoText === '') return;
	this.todos.unshift({
		text:this.todoText,
		done:false
	});
	this.todoText = '';
},
```

The logic is simple. If the value in the field is blank, do nothing. Otherwise add to the front of the array an object containing a text field and done property defaulted to false. Lastly I reset the field so you could type in another one.

Now let's go back to the HTML, here is how I render the ToDos and the button to mark them complete/incomplete:

```html
<table>
	<tr v-for="todo in sortedToDos">
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
```

Basically I loop over `sortedToDos` (which I haven't shown you yet, don't worry, I will in a second) and do something
different for each one based on the `done` property. In the text, I dynamically add the `todoDone` class when done is true. This adds the gray and strikethrough. In the second column, I toggle the text of the button based on the done state.

The `toggleDone` method does exactly that - changes true to false or false to true:

```js
toggleDone(todo) {
	todo.done = !todo.done;
}
```

Finally, `sortedToDos` is a computed value that takes the original array and sorts them such that done items are at the end of the list.

```js
computed: {
	sortedToDos() {
		return this.todos.sort((a,b) => {
			if(!a.done && b.done) return -1;
			if(a.done && b.done) return 0;
			if(a.done && !b.done) return 1;
		});
	}
},
```

You can view the entire sample and run it at the following CodePen:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="NWPwweX" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="ToDos 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/NWPwweX">
  ToDos 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

That's it. As I said, the next version is going to kick it up a notch and add both Vuex and IndexedDB for storage. 

p.s. As a total aside, I've been loving the *hell* out of the [Microsoft ToDo](https://todo.microsoft.com/tasks/) app. It's got desktop and mobile clients, built in syncing, and a lovely UI. 

<i>Header photo by <a href="https://unsplash.com/@glenncarstenspeters?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Glenn Carstens-Peters</a> on Unsplash</i>
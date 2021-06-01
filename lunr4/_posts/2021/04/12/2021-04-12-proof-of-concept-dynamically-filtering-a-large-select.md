---
layout: post
title: "Proof of Concept - Dynamically Filtering a Large Select"
date: "2021-04-12"
categories: ["javascript"]
tags: ["javascript"]
banner_image: /images/banners/coffee_filter.jpg
permalink: /2021/04/12/proof-of-concept-dynamically-filtering-a-large-select
description: Adding a filter control to a select tag with lots of options
---

A while back a friend wrote me with an interesting problem. He has a form where one of the fields can have near a thousand or so entries. It didn't impact load time that much for his users, but it did create a dropdown control that was difficult to use. He was curious to see if there was a way to let the user filter the dropdown to make it a bit more easier to read. Here's what I came up.

First, I did *not* go down the [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) route. While that provides similar behavior, it only lets you pick a string value. A select field lets you display a string value while binding it to a value in the option. So for example, the text displayed to the user could be American and the value some primary key value used in a database. 

Instead of using a datalist, I went with a simple text field next to the dropdown: 

```html
<input type="search" id="filter" placeholder="Filter" autocomplete="off">
<select id="myOptions"></select>
```

My JavaScript code then listened for changes to the filter and applied them to a filter on the data that populated the dropdown. Here's the complete code. 

```js
function getOptions() {
	let result = [];
	let prefix = ["A","B","C","D","E","F","G","H","I","J","K"];
	prefix.forEach(p => {
		for(let x=0; x<250; x++) {
			result.push(p+x);
		}
	});
	return result;
}


function setOptions(opts) {
	let select = document.querySelector('#myOptions');
	
	//set values for drop down
	let html = '';
	opts.forEach(o => {
		html += `<option>${o}</option>`;
	});
	select.innerHTML = html;
}

let filter = document.querySelector('#filter');

filter.addEventListener('input', () => {
	let value = filter.value.trim().toLowerCase();
	let options = (getOptions()).filter(f => {
		return value === '' || f.toLowerCase().includes(value);
	});
	setOptions(options);
},false);

setOptions(getOptions());
```

So first off, `getOptions` is meant to represent the API call or some other 'real' process. In my case I'm just generating dummy data. 

The function `setOptions` handles setting the options available to the dropdown. It expects an array of values passed to it. By default this is the full result of `getOptions`, but when you type into the filter, it filters the values returned. Here's a demo:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="MWJrZVL" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Select Filter">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/MWJrZVL">
  Select Filter</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

I shared this on Twitter and got some good responses. Markus Oberlehner responded with a fork of the CodePen where he does something fascinating. Clicking in the filter field activates the `multiple` property of the dropdown, providing a bit more visual feedback of the filter being performed. Here's his version.

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="maoberlehner" data-slug-hash="VwPQZgx" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Select Filter">
  <span>See the Pen <a href="https://codepen.io/maoberlehner/pen/VwPQZgx">
  Select Filter</a> by Markus Oberlehner (<a href="https://codepen.io/maoberlehner">@maoberlehner</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Let me know what you think - remember you can fork my CodePen (or Markus) to work on your own version!
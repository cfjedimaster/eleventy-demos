---
layout: post
title: "Vue Quick Shot - Downloading Data as a File"
date: "2020-12-15"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/12/15/vue-quick-shot-downloading-data-as-a-file
description: How to download data to the client as a new file
---

This isn't necessarily a new trick (and it's one I've covered sometime in the past), but I thought a quick example of how to do it in Vue.js would be helpful. For folks who may not know, HTML has included, for a few years now, a way to force a link to act as a download. This is done via the [download](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) attribute of the anchor tag. So for example:

```
<a href="cats.csv" download>Cats in CSV</a>
```

You can supply a filename to the `download` attribute but left blank like that it will use the filename specified in the link. While you can do this with "physical" files, you can also use it with JavaScript data on the client-side. There's multiple web pages explaining how to do this, but the general technique involves:

* Creating an anchor element in JavaScript
* Styling it to be invisible
* Setting the link to a data URI that includes an encoded version of your data
* Adding the element to the DOM
* Firing the click event.
* And then removing the element.

I found a nice example of this here: [Making JavaScript download files without the server](https://www.bitdegree.org/learn/javascript-download). Let's take this and add it to a simple Vue application. 

First, let's begin with an app that just displays a table of cats. Not a cat on a table...

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/black-cat-yawn.jpg" alt="" class="lazyload imgborder imgcenter">
</p>

but an HTML table of cats. Here's the code with some static data:

```js
const app = new Vue({
  el:'#app', 
  data: {
    cats:[
      {name:"Alese", gender:"female", age: 10},
      {name:"Sammy", gender:"male", age: 12},
      {name:"Luna", gender:"female", age: 8},
      {name:"Cracker", gender:"male", age: 7},
      {name:"Pig", gender:"female", age: 6},
      ]
  }
})
```

And here's the layout:

```html
<div id="app" v-cloak>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Gender</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
{% raw %}      
		<tr v-for="cat in cats">
        <td>{{cat.name}}</td>
        <td>{{cat.gender}}</td>
        <td>{{cat.age}}</td>
      </tr>
{% endraw %}    
	</tbody>
  </table>
</div>
```

Now let's add a button to let the user download the information:

```html
<p>
<button @click="download">Download</button>
</p>
```

And then a method to handle it:

```js
download() {
	// credit: https://www.bitdegree.org/learn/javascript-download
	let text = JSON.stringify(this.cats);
	let filename = 'cats.json';
	let element = document.createElement('a');
	element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();
	document.body.removeChild(element);     
}
```

For the most part this follows the blog post I linked to above with a few small changes. I modified the MIME type to be appropriate for JSON and switched a few var statements to let, because I'm hip like that. This works great and you can test it below:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="bGwqzLO" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Download">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/bGwqzLO">
  Vue Download</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Cool. While this is nice, JSON is only really familiar to us nerds. It's a table of data, and tables just scream Excel, right? I've been enjoying the heck out of [PapaParse](https://www.papaparse.com/) lately for *parsing* CSV, but it also *generates* CSV as well. I added the library to my CodePen, and then spent about 30 seconds rewriting the code to support CSV:

```js
download() {
	// credit: https://www.bitdegree.org/learn/javascript-download
	let filename = 'cats.csv';
	let text = Papa.unparse(this.cats);
	
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();
	document.body.removeChild(element); 
	
}
```

The changes were me just making use of the `unparse` method and then updating the filename and MIME type. That's literally it. Now if you download, and you have Excel or another such program installed, you can open up the file right away.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/12/excel1.jpg" alt="Excel in dark mode is so awesome. This is a picture of Excel rendering the cat data." class="lazyload imgborder imgcenter">
</p>

You can play with this version here:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="oNzZmde" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Download 2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/oNzZmde">
  Vue Download 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Enjoy, and let me know if you've used this technique in your own code by leaving me a comment below!

<span>Photo by <a href="https://unsplash.com/@aga4ar?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Valentin Vlasov</a> on <a href="https://unsplash.com/s/photos/table-cats?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>


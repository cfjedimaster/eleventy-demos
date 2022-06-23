---
layout: post
title: "Building Table Sorting and Pagination in JavaScript"
date: "2022-03-14T18:00:00"
categories: ["javascript"]
tags: []
banner_image: /images/banners/hannes-egler-369155.jpg
permalink: /2022/03/14/building-table-sorting-and-pagination-in-javascript.html
description: Rendering a sortable, paginated table in JavaScript
---

As part of my job in managing this blog, I check my stats frequently, and I've noticed that some of my more basic Vue.js articles have had consistently good traffic for quite some time. As I find myself doing more and more with "regular" JavaScript (sometimes referred to as "Vanilla JavaScript", but I'm not a fan of the term) I thought it would be a good idea to update those old posts for folks who would rather skip using a framework. With that in mind, here is my update to my post from over four years ago, [Building Table Sorting and Pagination in Vue.js](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs)

You don't need to read that old post as I think the title is rather descriptive. How can we use JavaScript to take a set of data - render it in a table - and support both sorting and pagination? Here's how I solved this. Before I begin, a quick note. I'll be loading all of my data and while that works with a "sensible" amount of data, you don't want to be sending hundreds of thousands of rows of data to the client and sorting and paging in the client. That being said, I think an entirely client-side solution is absolutely safe if you understand the size of your data and know it's not going to impact performance. 

Speaking of data, all of my examples will be fetching an array of cats from this endpoint: <https://www.raymondcamden.com/.netlify/functions/get-cats>

Here's a sample of that data:

```json
[
  {
    "name": "Fluffy",
    "age": 9,
    "breed": "calico",
    "gender": "male"
  },
  {
    "name": "Luna",
    "age": 10,
    "breed": "long hair",
    "gender": "female"
  },
  {
    "name": "Cracker",
    "age": 8,
    "breed": "fat",
    "gender": "male"
  }
]
```

Alright, let's get started!

## Version One - Just Rendering

In the first version, I'm just going to load the data and render it in a table. I began by creating an HTML table:

```html
<table id="catTable">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Breed</th>
      <th>Gender</th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="4"><i>Loading...</i></td></tr>
  </tbody>
</table>
```

Note that the `tbody` has a loading message. This will render while the remote data is fetched and be replaced with the contents. Now let's look at the JavaScript:

```js
document.addEventListener('DOMContentLoaded', init, false);

async function init() {
  
  // Select the table (well, tbody)
  let table = document.querySelector('#catTable tbody');
  // get the cats
  let resp = await fetch('https://www.raymondcamden.com/.netlify/functions/get-cats');
  let data = await resp.json();
  // create html
  let result = '';
  data.forEach(c => {
     result += `<tr>
     <td>${c.name}</td>
     <td>${c.age}</td>
     <td>${c.breed}</td>
     <td>${c.gender}</td>
     </tr>`;
  });
  table.innerHTML = result;
}
```

This boils down to:

* Wait for the page to load (this fires before images, stylesheets, and so forth are done though, more info on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event))
* Select the `tbody` element
* Hit my function and gets the cats
* Loop over each cat and generate HTML
* Inject the HTML into the table

Note that while I named my variable `table`, it's really just the `tbody` I'm updating. Part of me doesn't like that and part of me thinks I'm being too picky. Guess who won? Here's the complete demo:

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="BaJyPNL" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/BaJyPNL">
  JS-Sortable Table</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Version Two - Sorting

For the next version, let's add sorting. Sorting will be enabled by clicking on a table header. Clicking once will sort in one direction, clicking again will reverse the sort. First, I modified my table to include `data` attributes related to the column I'm sorting:

```html
<table id="catTable">
  <thead>
    <tr>
      <th data-sort="name">Name</th>
      <th data-sort="age">Age</th>
      <th data-sort="breed">Breed</th>
      <th data-sort="gender">Gender</th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="4"><i>Loading...</i></td></tr>
  </tbody>
</table>
```

Data attributes are a great way to include metadata in your HTML and - as always - you can learn more at [MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). 

To handle sorting, I did a few things. First, I created variables to represent the current sort column and direction. I placed these with a few other values I'll need up top:

```js
let data, table, sortCol;
let sortAsc = false;
```

Next, I added a click event handler to my header cells. I needed to do one per cell:

```js
document.querySelectorAll('#catTable thead tr th').forEach(t => {
	t.addEventListener('click', sort, false);
});
```

As I realized I was going to be redrawing my table a lot, I built a new function to handle rendering the table. 

```js
function renderTable() {
  // create html
  let result = '';
  data.forEach(c => {
     result += `<tr>
     <td>${c.name}</td>
     <td>${c.age}</td>
     <td>${c.breed}</td>
     <td>${c.gender}</td>
     </tr>`;
  });
  table.innerHTML = result;
}
```

Finally, I added the sort function. This handles sorting based on both the column and direction:

```js
function sort(e) {
  let thisSort = e.target.dataset.sort;
  if(sortCol === thisSort) sortAsc = !sortAsc;
  sortCol = thisSort;
  data.sort((a, b) => {
    if(a[sortCol] < b[sortCol]) return sortAsc?1:-1;
    if(a[sortCol] > b[sortCol]) return sortAsc?-1:1;
    return 0;
  });
  renderTable();
}
```

I'm not a huge fan of ternary expressions as I find them hard to read at times, but it did make the code a bit simpler above. As I'm not using Vue anymore I have to manually call `renderTable` again, but that's fine. Here's this version:

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="popvZeL" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/popvZeL">
  JS-Sortable Table (2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

One thing I went back and forth on is whether or not I should apply a default sort. I decided not to, but I could definitely seeing doing that. 

## Version Three - Paging

Alright, for the third and final version, we need to add paging. My dataset isn't terribly large, so I went with a page size of 3 cats per page. Here is a completely unnecessary picture of three cats:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/03/3cats.jpg" alt="Three kittens" class="lazyload imgborder imgcenter">
</p>

I started off in HTML by adding two new buttons:

```html
<button id="prevButton">Previous</button> 
<button id="nextButton">Next</button> 
```

That's it for the HTML changes. Now let's look at the JavaScript. I began by adding a few extra variables related to paging:

```js
const pageSize = 3;
let curPage = 1;
```

Then I added click handlers for the buttons:

```js
document.querySelector('#nextButton').addEventListener('click', nextPage, false);
document.querySelector('#prevButton').addEventListener('click', previousPage, false);
```

Both of these functions need to do basic bounds checking and tell the table to re-render:

```js
function previousPage() {
  if(curPage > 1) curPage--;
  renderTable();
}

function nextPage() {
  if((curPage * pageSize) < data.length) curPage++;
  renderTable();
}
```

That logic in `nextPage` was a pain in the rear to get right, but luckily I was able to just use the logic from the previous blog post. So where is the paging happening? I do my slicing in the render:

```js
function renderTable() {
  // create html
  let result = '';
  data.filter((row, index) => {
        let start = (curPage-1)*pageSize;
        let end =curPage*pageSize;
        if(index >= start && index < end) return true;
  }).forEach(c => {
     result += `<tr>
     <td>${c.name}</td>
     <td>${c.age}</td>
     <td>${c.breed}</td>
     <td>${c.gender}</td>
     </tr>`;
  });
  table.innerHTML = result;
}
```

Unlike `sort` which modifies an array in place, `filter` returns a new array which means I can use it here to get my page of cats and then render that to HTML. Here's that demo:

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="LYeEJRb" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/LYeEJRb">
  JS-Sortable Table (3)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

This could be enhanced by adding `disabled` attributes to the button when at the edge. Feel free to fork my CodePen and show me! As always, I hope this is helpful and if you've got any feedback, just reach out!
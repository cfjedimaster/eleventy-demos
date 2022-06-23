---
layout: post
title: "Building Table Sorting and Pagination in a Web Component"
date: "2022-05-23T18:00:00"
categories: ["development"]
tags: ["javascript","web components"]
banner_image: /images/banners/hannes-egler-369155.jpg
permalink: /2022/05/23/building-table-sorting-and-pagination-in-a-web-component.html
description: Building a web component to abstract loading data into a table and adding sorting and pagination.
---

Last week I [blogged](https://www.raymondcamden.com/2022/05/18/my-first-web-component) about my first experience building a simple web component. As I said, this was something I've heard about for *years* but never got around to playing with. If you read that first article, you'll see it didn't take a lot of work to get started. I didn't need a build process or a framework, just a JavaScript file to define my custom component. If you are a regular reader here, you know I've built the same demo a few times, a basic table with Ajax loaded data that supported sorting and pagination. As a refresher, here are those previous articles:

* [Building Table Sorting and Pagination in Vue.js](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs)
* [Building Table Sorting and Pagination in JavaScript](https://www.raymondcamden.com/2022/03/14/building-table-sorting-and-pagination-in-javascript/)
* [Building Table Sorting and Pagination in Alpine.js](https://www.raymondcamden.com/2022/05/02/building-table-sorting-and-pagination-in-alpinejs)

In each of these articles, I hit a back-end service (<https://www.raymondcamden.com/.netlify/functions/get-cats>) that returned an array of cats. Each array instance had a name, age, breed, and gender value. For each of my previous demos, I began with a demo that simply loaded the data and rendered it. I then added sorting. As a final iteration, I then added pagination. 

## Version One - Just Rendering

So how would I build this as a web component? I began with a JavaScript file, `datatable.js`. My plan for the component's API was rather simple. One required attribute points to an API and an optional attribute that would let you specify the specific columns to output. Here's the simplest use case:

```html
<data-table src="https://www.raymondcamden.com/.netlify/functions/get-cats"></data-table>
```

And here's one specifying the columns:

```html
<data-table src="https://www.raymondcamden.com/.netlify/functions/get-cats" cols="name,age"></data-table>
```

In my first iteration, I simply focused on rendering:

```js
class DataTable extends HTMLElement {

    constructor() {
        super();


        if(this.hasAttribute('src')) this.src = this.getAttribute('src');
        // If no source, do nothing
        if(!this.src) return;

        // attributes to do, datakey + cols
        if(this.hasAttribute('cols')) this.cols = this.getAttribute('cols').split(',');


        const shadow = this.attachShadow({
            mode: 'open'
        });
        
        const wrapper = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        wrapper.append(thead, tbody);
        shadow.appendChild(wrapper);

        const style = document.createElement('style');
        style.textContent = `
table { 
    border-collapse: collapse;
}

td, th {
  padding: 5px;
  border: 1px solid black;
}

th {
    cursor: pointer;
}
    `;

        // Attach the created elements to the shadow dom
        shadow.appendChild(style);

    }

    async load() {
        console.log('load', this.src);
        // error handling needs to be done :|
        let result = await fetch(this.src);
        this.data = await result.json();
        this.render();
    }

    render() {
        console.log('render time', this.data);
        if(!this.cols) this.cols = Object.keys(this.data[0]);

        this.renderHeader();
        this.renderBody();
    }

    renderBody() {

        let result = '';
        this.data.forEach(c => {
            let r = '<tr>';
            this.cols.forEach(col => {
                r += `<td>${c[col]}</td>`;
            });
            r += '</tr>';
            result += r;
        });

        let tbody = this.shadowRoot.querySelector('tbody');
        tbody.innerHTML = result;

    }

    renderHeader() {

        let header = '<tr>';
        this.cols.forEach(col => {
            header += `<th>${col}</th>`;
        });
        let thead = this.shadowRoot.querySelector('thead');
        thead.innerHTML = header;

    }

    static get observedAttributes() { return ['src']; }

    attributeChangedCallback(name, oldValue, newValue) {
        // even though we only listen to src, be sure
        if(name === 'src') {
            this.src = newValue;
            this.load();
        }
    }

}

// Define the new element
customElements.define('data-table', DataTable);
```

From the top, my constructor first checks attributes and ensures it has at least the `src` attribute and optional `cols`. I wasn't exactly sure what to do when `src` wasn't passed, but in general, web pages 'break' nicely, and I figured just exiting was the simplest solution.

I then begin creating my DOM, in this case, a table with a head and body. I create a style sheet to add borders as well. 

The logic for rendering the table is broken out across a few methods. `load` handles fetching the data and when done, calls out to `render`. I broke `render` up into two more functions, one for the header and one for the body. I was thinking ahead a bit and figured I would not want to re-render the header on sorting or paging, just the body. Finally, note that `attributeChangedCallback` handles noticing `src` values and will call `load`. This works in my "just plain html usage" and would work if I used JavaScript to change the `src` value dynamically. Check out this version here:

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="js,result" data-slug-hash="MWQvRVw" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/MWQvRVw">
  WC Table1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Version Two - Sorting

For sorting, I made a few changes. First, in `renderHeader`, I changed it like so:

```js
renderHeader() {

    let header = '<tr>';
    this.cols.forEach(col => {
        header += `<th data-sort="${col}">${col}</th>`;
    });
    let thead = this.shadowRoot.querySelector('thead');
    thead.innerHTML = header;

    this.shadowRoot.querySelectorAll('thead tr th').forEach(t => {
        t.addEventListener('click', this.sort, false);
    });

}
```

I use a data attribute to define the column to sort by and then add an event listener for each header to listen for click events. My sort event is as follows:

```js
async sort(e) {
    let thisSort = e.target.dataset.sort;
    console.log('sort by',thisSort);

    if(this.sortCol && this.sortCol === thisSort) this.sortAsc = !this.sortAsc;
    this.sortCol = thisSort;
    this.data.sort((a, b) => {
        if(a[this.sortCol] < b[this.sortCol]) return this.sortAsc?1:-1;
        if(a[this.sortCol] > b[this.sortCol]) return this.sortAsc?-1:1;
        return 0;
    });
    this.renderBody();  
}
```

I get the sort by column by examining the data attribute of the element that recognized the click event. After that, it's a regular JavaScript sort function and I run `renderBody`. 

Now, at this point, I ran into an issue. In `sort`, the value of `this` no longer pointed to the main scope of my component. I had no idea why. I did some googling and ran into this: [This is why we need to bind event handlers in Class Components in React](https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/). It seemed like a very similar issue and while I can't promise to understand the issue completely, but it's solution worked well for me. In my constructor, I added this at the end:

```js
this.sort = this.sort.bind(this);
```

And it worked like a charm. You can see the updated version here:

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="js,result" data-slug-hash="bGLrJxJ" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/bGLrJxJ">
  WC Table1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Version Three - Paging

For the third and final version, I added paging. In my previous two editions, the 'root' of my component was the table tag. Because I was going to add buttons for navigation, I ended up making a new div to contain them. It didn't occur to me to use [tfoot](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot) and now I kinda wish I had, but I'm ok with that. Here's the updated constructor with the new DOM elements as well as two new event handlers for navigation. I set the page size to 5 as my array of cats isn't very large.

```js
constructor() {
    super();

    if(this.hasAttribute('src')) this.src = this.getAttribute('src');
    // If no source, do nothing
    if(!this.src) return;

    // attributes to do, datakey 
    if(this.hasAttribute('cols')) this.cols = this.getAttribute('cols').split(',');

    this.pageSize = 5;
    if(this.hasAttribute('pagesize')) this.pageSize = this.getAttribute('pagesize');

    // helper values for sorting and paging
    this.sortAsc = false;
    this.curPage = 1;

    const shadow = this.attachShadow({
        mode: 'open'
    });

const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.append(thead, tbody);

    const nav = document.createElement('div');
    const prevButton = document.createElement('button');
    prevButton.innerHTML = 'Previous';
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next';
    nav.append(prevButton, nextButton);

    shadow.append(table,nav);

    const style = document.createElement('style');
    style.textContent = `
table { 
border-collapse: collapse;
}

td, th {
padding: 5px;
border: 1px solid black;
}

th {
cursor: pointer;
}

div {
padding-top: 10px;
}
`;
    
    // Attach the created elements to the shadow dom
    shadow.appendChild(style);

    // https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
    this.sort = this.sort.bind(this);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    nextButton.addEventListener('click', this.nextPage, false);
    prevButton.addEventListener('click', this.previousPage, false);

}
```

Notice that I repeat the `bind` call for my new event handlers. Pagination is done like so:

```js
nextPage() {
    if((this.curPage * this.pageSize) < this.data.length) this.curPage++;
    this.renderBody();
}

previousPage() {
    if(this.curPage > 1) this.curPage--;
    this.renderBody();
}
```

And then `renderBody` is updated with a `filter` call to just get the "page" of data:

```js
renderBody() {

    let result = '';
    this.data.filter((row, index) => {
        let start = (this.curPage-1)*this.pageSize;
        let end =this.curPage*this.pageSize;
        if(index >= start && index < end) return true;
    }).forEach(c => {
        let r = '<tr>';
        this.cols.forEach(col => {
            r += `<td>${c[col]}</td>`;
        });
        r += '</tr>';
        result += r;
    });

    let tbody = this.shadowRoot.querySelector('tbody');
    tbody.innerHTML = result;

}
```

You can demo this version here:

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="js,result" data-slug-hash="OJQjGqq" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/OJQjGqq">
  WC Table2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## What's Left?

So, all I really did here was build the bare minimum. As long as I've been doing client-side development, there have been frameworks out there with *super* complex data tables. I could see adding support for things like, "my API returns an array, but it's in a subelement named items". I could see passing the page size as an attribute too. Maybe even a `colLabels` attribute to let me specify my header labels. You get the idea. :) If this is helpful, or if you have any questions, let me know!
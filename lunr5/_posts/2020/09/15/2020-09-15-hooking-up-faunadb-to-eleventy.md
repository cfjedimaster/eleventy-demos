---
layout: post
title: "Hooking Up FaunaDB to Eleventy"
date: "2020-09-15"
categories: ["static sites"]
tags: ["eleventy","faunadb"]
banner_image: /images/banners/field-flowers.jpg
permalink: /2020/09/15/hooking-up-faunadb-to-eleventy
description: 
---

As a *very* new user of [FaunaDB](https://dashboard.fauna.com/accounts/register?utm_source=DevTo&utm_medium=referral&utm_campaign=WritewithFauna_Hooking-upto-Eleventy_RCamden), I'm pretty impressed by how easy it was to setup and start using, both from the server as well as the browser. I decided to take a quick look at how FaunaDB could be integrated with my favorite static site generator, [Eleventy](https://www.11ty.dev/). Eleventy (aka 11ty) is one of the many options developers have for working with the Jamstack (JavaScript, APIs, and Markup) and is known both for it's speed as well as it's flexibility. I've been using Eleventy pretty exclusively now and it's easily become my preferred way to build static sites. While I won't be giving an introduction to Eleventy here, be sure to read the [docs](https://www.11ty.dev/docs/) for more information and if you would like an introduction, check out this great one by Gift Egwuenu, ["Getting Started with Eleventy"](https://dev.to/lauragift21/getting-started-with-eleventy-4ofg). 

So given that a Jamstack site is static by it's very nature, how can we incorporate FaunaDB data into it? For my experiment, I began by creating a database of products. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/img1.png" alt="Dashboard view of Products" class="lazyload imgborder imgcenter">
</p>

Each product had a pretty simple structure:

* Name
* Price
* Description
* shippingTimeInDays

I made a few random products using the dashboard and employed all of my creativity for the names and descriptions.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/img2.png" alt="One example product" class="lazyload imgborder imgcenter">
</p>

Alright - so I have data. Not a lot of it, but enough for a demo. How to get it into Eleventy? One of the more interesting features of Eleventy are [global data files](https://www.11ty.dev/docs/data-global/). These are files that provide data to the rest of the site. So for example, you could build a hard coded like of products and name it products.json:

```js
[
	{ "name": "foo", "price": 2.99, "description": "something", "shippingTimeInDays":9 },
	{ "name": "goo", "price": 9.99, "description": "something else", "shippingTimeInDays":8 },
	{ "name": "zoo", "price": 1.50, "description": "something more", "shippingTimeInDays":10 },
]
```

Once saved in a special folder (`_data`), Eleventy templates can make use of it. Another strength of Eleventy is the large amount of different template engines it supports. My personal favorite is Liquid so I'll be using that, but note that Eleventy also supports Handlebars, Jade, and more. Here's a simple Liquid template that makes use of this data:

```html
<h2>Our Products</h2>

<ul>
{% raw %}{% for product in products %}
<li>{{ product.name }} costs ${{ product.price }} and ships in {{ shippingTimeInDays }} days.</li>
{% endfor %}
{% endraw %}</ul>
```

When Eleventy runs, it reads in the hard coded JSON file, makes it available as a `products` variable (this is because of the filename, if you had used something like `prods.json`, the variable would be `prods`), and then Liquid can loop over the product and output values. 

Static data can be useful, but obviously we want to be able to use our FaunaDB data. While plain JSON files work as global data in Eleventy, you can also use JavaScript files. These files will be executed when Eleventy creates a static build of your site and can perform any logic necessary, including integrating with FaunaDB! Here's an example where I fetch my data from FaunaDB:

```js
const faunadb = require('faunadb'),
  q = faunadb.query;

module.exports = async function() {
	const client = new faunadb.Client({ secret: process.env.FAUNADB })

	let productObs = await client.query(
		q.Map(
			q.Paginate(q.Documents(q.Collection('products'))),
			q.Lambda(x => q.Get(x))
		)
	);
	let data = productObs.data.map(po => {
		return po.data;
	});
	console.log(data.length + ' products loaded from Fauna');
	return data;

}
```

I'm using the `faunadb` npm library and ask for my products. For each object I really only want the data so after fetching the information from FaunaDB I return an array of product values. The `console.log` message will get displayed locally while I build and helps me see that things are working.

Next, I built a home page for my site that loops over the products. Here's that template:

```html
---
layout: main
title: Products
---

<h2>Products</h2>

<ul>
{% raw %}{% for product in products %}
	<li><a href="/product/{{product.name | slug}}">{{product.name}}</a></li>
{% endfor %}
{% endraw %}</ul>
```

The portion you see on top is front matter, a common way in Jamstack programs to set metadata for web pages. In this case I'm specifying a layout file for the page as well as a title. Layout files simply take the content of the current page and insert them inside some markup. (See the Eleventy [layout](https://www.11ty.dev/docs/layouts/) docs for more information.) 

The code loops over each product and creates a link to a product detail page I'll share in a moment. This portion, `{% raw %}{{product.name | slug}}{% endraw %}`, demonstrates a filter. It takes input, like "Raymond Camden", and creates a filename safe version of it: "raymond-camden". The end result is a set of links and names based on my data in FaunaDB:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/img3.png" alt="List of products" class="lazyload imgborder imgcenter">
</p>

Notice that the products are sorted based on how the FaunaDB code returned it. I could have sorted it there, or I could sort it in Eleventy. In my case I'm happy with the default sort. Now lets look at the product pages. 

Eleventy supports the ability to [paginate](https://www.11ty.dev/docs/pagination/) data. It will take a large list of data and let you create pages of them dynamically. It also supports taking a list of data and creating [one page each](https://www.11ty.dev/docs/pages-from-data/). This is perfect for our needs here. This is how I defined a product template.

```html
{% raw %}---
layout: main
pagination:
   data: products
   size: 1
   alias: product
permalink: "/product/{{product.name | slug}}/"
eleventyComputed:
   title: "{{product.name}}"
---

<h2>{{ product.name }}</h2>

<p>
{{product.description}}
</p>

<p>
It costs ${{product.price}} and ships in {{product.shippingTimeInDays}} days.
</p>
{% endraw %}
```

The frontmatter on top is a bit more complex here, but hopefully understandable. I've defined a pagination of 1, basically one page product. I've specified a permalink for each product (where to save the file) that matches how I linked to them from the index page. The last part, `eleventyComputed`, is a workaround for specifying custom values in front matter based on pagination. Basically it just ensures the title value is based on the current product being generated.

After front matter I simply display the product. After saving this, Eleventy generates one page per product:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/img4.png" alt="Product file output" class="lazyload imgborder imgcenter">
</p>

And if we return to the index page, we can click to load one of the products:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/img5.png" alt="One product page" class="lazyload imgborder imgcenter">
</p>

And voila, we're done! (You can demo this version here: <https://faunadbv1.vercel.app/>) But while this may make you incredibly happy, you probably realize an important issue. Eleventy will only load the products from FaunaDB when the site is built. What if your products change? 

Luckily we have some options. First, many Jamstack services provide a simple way to trigger builds. [Netlify](https://www.netlify.com/), for example, lets you expose a hidden URL that you can hit programatically to start a new build. Whatever process you use to edit your products could also fire off a request to start a new build.

You could also schedule this on a periodic basis. If you know, for example, that your logistics department updates shipping times once a day, you can simply automate the rebuild to also run once a day. But let's consider another approach.

FaunaDB provides both a server-side library to work with data as well as a client-side side one. We've got Eleventy loading products at build time and generating pages for each one. What if we assume some of that data is pretty static (products are probably rarely added or removed) and some is very dynamic? Let's update the site such that the `shippingTimeInDays` value is loaded on the client and is *always* up to date.

To get started, I first modified my data file to copy the ID of each product:

```js

const faunadb = require('faunadb'),
  q = faunadb.query;

module.exports = async function() {
	const client = new faunadb.Client({ secret: process.env.FAUNADB })

	let productObs = await client.query(
		q.Map(
			q.Paginate(q.Documents(q.Collection('products'))),
			q.Lambda(x => q.Get(x))
		)
	);
	let data = productObs.data.map(po => {
		let result = po.data;
		//add the id
		result.id = po.ref.id;
		return result;
	});
	console.log(data.length + ' products loaded from Fauna');
	return data;

}
```

You can see me grabbing `ref.id` in the loop and assigning it the `id` property. Now let's look at the product template.

```html
{% raw %}---
layout: main
pagination:
   data: products
   size: 1
   alias: product
permalink: "/product/{{product.name | slug}}/"
eleventyComputed:
   title: "{{product.name}}"
---

<h2>{{ product.name }}</h2>

<p>
{{product.description}}
</p>

<p>
It costs ${{product.price}}.
</p>

<p>
Availability: <span id="availabilityText"><i>Fetching...</i></span>
</p>

<script src="//cdn.jsdelivr.net/npm/faunadb@latest/dist/faunadb-min.js"></script>
<script>
const pid = '{{product.id}}';

document.addEventListener('DOMContentLoaded', async () => {
   let availabilityText = document.querySelector('#availabilityText');

   console.log('product page, load '+pid);
   let client = new faunadb.Client({ secret: 'fnAD0SNbNaACE9yDvC7hoFJRJQR35uwJZOjl2qpa' });
   let q = faunadb.query;

   let result = await client.query(
      q.Get(q.Ref(q.Collection('products'), pid))
   );
   let product = result.data;
   console.log(product);
   availabilityText.innerHTML = `Ships in ${product.shippingTimeInDays} days.`;

}, false);
</script>{% endraw %}
```

I've modified the HTML to remove the hard coded availability value and replaced it with a "Fetching" message. This value is going to be updated via JavaScript. For simplicity sake I've put the code on the page itself. This isn't an Eleventy requirement and I could, and should, absolutely put this on it's own file. That being said, the code is rather simple. The ID value is generated when the site is built. Each product page will have a different value for `pid`. I use the FaunaDB client-side library to retrieve just the one product and once I have it, I update my HTML with the result. Note - the key I've used here is a "read only" key generated in the FaunaDB dashboard. As it can't modify data it's safe to use in my JavaScript.

Here's an example:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/img6.png" alt="Static+Dynamic product info" class="lazyload imgborder imgcenter">
</p>

Now I've got the best of both worlds. I've got a static site driven by dynamic content that will load incredibly fast but can still include up to date shipping estimates for my users. (You can demo this version here: <https://faunadbv2.vercel.app/>)

I hope this quick look at FaunaDB and Eleventy has gotten you excited about the Jamstack in general. You can learn more about the Jamstack at <https://jamstack.org/>. Also, you can get the demo files for this post here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/fauna_test/>

<span>Photo by <a href="https://unsplash.com/@worldsbetweenlines?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Patrick Hendry</a> on <a href="https://unsplash.com/s/photos/fauna?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
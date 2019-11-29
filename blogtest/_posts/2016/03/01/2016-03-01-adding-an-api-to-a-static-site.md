---
layout: post
title: "Adding an API to a static site"
date: "2016-03-01T14:59:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/03/01/adding-an-api-to-a-static-site
---

Ok, so I'm starting off this tutorial with something of a lie. By every *practical* definition of an API, we really can't create one on a static site. An API typically involves a complete CRUD cycle (reading data, creating and updating data, and deleting) process for content and since a static site doesn't have an app server, than that's just not going to happen. However, if we can stretch our point of a view a bit, there's room for a bit of interpretation here.

<!--more-->

![Obi knows best](https://static.raymondcamden.com/images/2016/03/obi.jpg)

If you consider just the *read* aspect of an API, it is possible to create such a thing for a static site, but only if you ignore things like searching, filtering, or otherwise manipulating the data.

That certainly sounds like a heck of a lot to give up, but it doesn't mean your site is completely devoid of any way of sharing data. Consider for a moment that static site generators (SSGs) all have some way of outputting RSS. Folks don't tend to think of it because it "just works", but RSS is a data-friendly format for your blog and is - barely - an API for your site. 

Let's consider a real example. You've got a site for your e-commerce shop and you've set up various products. We'll use [Jekyll](https://jekyllrb.com) for the demo but any SSG would be fine. I created a new Jekyll site and then added a `_data` folder. Within that folder I created a file called products.json. It was a simple array of products.

<pre><code class="language-javascript">
[
	{
		"name":"Apple",
		"description":"This is the Apple product.",
		"price":9.99,
		"qty":13409
	},	
	{
		"name":"Banana",
		"description":"This is the Banana product.",
		"price":4.99,
		"qty":1409
	},	
	{
		"name":"Cherry",
		"description":"This is the Cherry product.",
		"price":9.99,
		"qty":0
	},	
	{
		"name":"Donut",
		"description":"This is the Donut product.",
		"price":19.99,
		"qty":923
	}
]
</code></pre>

This is the standard way by which you can provide generic data for a Jekyll site. See the [docs](https://jekyllrb.com/docs/datafiles/) on this feature for more examples. At this point I can add product information to my site in HTML. I edited the main home page and just added a simple list. I decided to list the name and price - this was completely arbitrary.

<pre><code class="language-javascript">
&lt;h1 class=&quot;page-heading&quot;&gt;Products&lt;&#x2F;h1&gt;
&lt;ul class=&quot;post-list&quot;&gt;
	{% raw %}{% for p in site.data.products %}{% endraw %}
	&lt;li&gt;{% raw %}{{ p.name }}{% endraw %} at {% raw %}{{p.price}}{% endraw %}&lt;&#x2F;li&gt;
	{% raw %}{% endfor %}{% endraw %}	  
&lt;&#x2F;ul&gt;
</code></pre>

And here it is on the site:

<img src="https://static.raymondcamden.com/images/2016/03/ssg1.png" class="imgborder">

Yeah, not terribly pretty, but for a demo it will suffice. I could also create HTML pages for my products so you can click to view more information. (For Jekyll, that could be done by hand, or by using a generator to read the JSON file and automatically create the various detail pages.)

So let's create a JSON version of our products. Technically, we already have the file, but it isn't accessible. In order to make this public, we need to create a file outside of `_data`. I chose to make a folder called `api` and a file named `products.json`. Here is how I made that file dynamically output the products in JSON format.

<pre><code class="language-javascript">
---
layout: null
---

{% raw %}{{ site.data.products |{% endraw %} jsonify }}
</code></pre>

Yeah, that's it. So a few things. In order to have anything dynamic in a random page in Jekyll, you must use front matter. For me that was just fine as I wanted to ensure no layout was used for the file anyway. Jekyll also supports a `jsonify` filter that turns data into JSON. So basically I went from JSON to real data to JSON again, and it outputs just fine in my browser:

<img src="https://static.raymondcamden.com/images/2016/03/ssg2.png" class="imgborder">

Of course, this assumes that my core data file matches, 100%, to what I want to expose to my "API". That may not work for every case. I could manually output the JSON by looping over my site data and picking and choosing what properties to output. Heck, I could even make new properties on the fly. For an example of this, see this Jekyll snippet: [JSONify your Jekyll Site](http://jekyllsnippets.com/excluding-jsonify-your-site/).

Cool! But what about sorting, filtering, etc? Well, we could do it manually. For example, I made a new file, `products.qty.json`, that supports a sorted by qty list, with highest first:

<pre><code class="language-javascript">
---
layout: null
---
{% raw %}{{ site.data.products |{% endraw %} sort: "qty" {% raw %}| reverse |{% endraw %} jsonify }}
</code></pre>

This resulted in this JSON:

<pre><code class="language-javascript">
[{% raw %}{"name":"Apple","description":"This is the Apple product.","price":9.99,"qty":13409}{% endraw %},{% raw %}{"name":"Banana","description":"This is the Banana product.","price":4.99,"qty":1409}{% endraw %},{% raw %}{"name":"Donut","description":"This is the Donut product.","price":19.99,"qty":923}{% endraw %},{% raw %}{"name":"Cherry","description":"This is the Cherry product.","price":9.99,"qty":0}{% endraw %}]
</code></pre>

I could do similar sorts for price or name. How about filtering? I built a new file, `products.instock.json`, to represent products that have a `qty` value over zero. I had hoped to do this in one line like in the example above, and Liquid (the template language behind Jekyll) does support a where filter, but from what I could see, it did not support a where filter based on a "greater than" or "not equal" status. I could be wrong. I just used the tip from the Jekyll snippet above.

<pre><code class="language-javascript">
---
layout: null
---
[
{% raw %}{% for p in site.data.products %}{% endraw %}	
	{% raw %}{% if p.qty &gt; 0 %}{% endraw %}
	{
		"name":"{% raw %}{{p.name}}{% endraw %}",
		"description":"{% raw %}{{p.description |{% endraw %} escape}}",
		"price":{% raw %}{{p.price}}{% endraw %},
		"qty":{% raw %}{{p.qty}}{% endraw %},
			
	}
	{% raw %}{% endif %}{% endraw %}
{% raw %}{% endfor %}{% endraw %}
]
</code></pre>

And the result. Note the white space is a bit fatter. I could fix that by manipulating my source code a bit.

<pre><code class="language-javascript">
[
	
	
	{
		"name":"Apple",
		"description":"This is the Apple product.",
		"price":9.99,
		"qty":13409,
			
	}
	
	
	
	{
		"name":"Banana",
		"description":"This is the Banana product.",
		"price":4.99,
		"qty":1409,
			
	}
	
	
	
	
	
	{
		"name":"Donut",
		"description":"This is the Donut product.",
		"price":19.99,
		"qty":923,
			
	}
	

]
</code></pre>

So I think you get the idea. If I wanted to, I could add any number of possible combinations (in stock, sorted by name, but with a price less than 100). It is definitely a manual process, and I'm not supporting dynamic sorting and filtering, but it is certainly something, and it may be useful to your site users. 

I'd love to know what you think of this technique, and if you are making use of a SSG and have done something like this, please share an example in the comments below!
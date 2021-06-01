---
layout: post
title: "Adding Search to your Eleventy Static Site with Lunr"
date: "2019-10-20"
categories: ["javascript","static sites"]
tags: ["vuejs", "eleventy"]
banner_image: /images/banners/search.jpg
permalink: /2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr
description: Using Lunr to add client-site search to your static site
---

I recently came back from [connect.tech](http://connect.tech/) (one of my favorite conferences). I had the honor of giving not one, but two different talks. One of them was on static sites, or the JAMstack. This is a topic I've covered many times in the past, but it had been a while since I gave a presentation on it. During my presentation I covered various ways of adding dynamic features back to the static site, one of them being search. 

For my blog here, I make use of [Google's Custom Search Engine](https://cse.google.com) feature. This basically lets me offload search to Google, who I hear knows a few things about search. But I also give up a bit of control over the functionality. Oh, and of course, Google gets to run a few ads while helping find those results...

<img src="https://static.raymondcamden.com/images/2019/10/lunr1.png" alt="Ads in search result" class="imgborder imgcenter">

To be clear, I don't fault Google for those ads, I'm using their service for free, but it isn't something a lot of folks would want on their site.

There's an alternative that's been around for a while that I've finally made some time to learn, [Lunr](https://lunrjs.com/). Lunr is a completely client-side search solution. Working with an index of your creation (a *lot* more on that in a moment), Lunr will take in search input and attempt to find the best match it can. You are then free to create your search UI/UX any way you choose. 

I was first introduced to Lunr while working at Auth0, we used it in the docs for [Extend](https://goextend.io/docs). (Note - this product is currently EOLed so the previous link may not work in the future.) If you use the search form on the top right, all the logic of running the search, finding results, and displaying them, are all done client-side.

<img src="https://static.raymondcamden.com/images/2019/10/lunr2.png" alt="Example of search results at GoExtend" class="imgborder imgcenter">

Lunr is a pretty cool project, but let's talk about the biggest issue you need to consider - your index. In order for Lunr to find results, you need to feed it your data. In theory, you could feed it the plain text of every page you want to index. That essentially means your user is downloading all the text of your site on every request. While caching can be used to make that a bit nicer, if your site has thousands of pages, that's not going to scale. This is why I didn't even consider Lunr for my blog. You also need to determine what you want to actually search.

Consider an ecommerce site. Adding search for products is a no brainer. But along with text about the product, you may want to index the category of the product. Maybe a subcategory. Shoot, maybe even a bit of the usage instructions. 

And even after determining what you want to index, you need to determine if some parts of your index are more important than others. If you are building a support site, you may consider usage instructions for products more important than the general description.

Lunr isn't going to care what you index, but you really think about this aspect up front. I definitely recommend spending some time in the [Lunr docs](https://lunrjs.com/docs/index.html) and [guides](https://lunrjs.com/guides/getting_started.html) to get familiar with the API. 

So, how about an example?

### Our Site

For my test, I decided to build a simple static site using [Eleventy](https://www.11ty.io/). This is my new favorite static site generator and I'm having a lot of fun working with it. You can use absolutely any other generator with Lunr. You could also absolutely use an application server like Node, PHP, or ColdFusion. 

My static site is a directory of GI Joe characters sourced from <a href="https://gijoe.fandom.com/wiki/Joepedia_-_The_G.I._Joe_Wiki">Joepedia</a>. I only copied over a few characters to keep things simple. You can see the site (including the full search functionality we're going to build) at <https://lunrjoe.raymondcamden.now.sh/>. Here's an example character page.

```html
---
layout: character
title: Cobra Commander
faction: Cobra
image: https://vignette.wikia.nocookie.net/gijoe/images/b/b4/Cobra-commander-02.jpg/revision/latest?cb=20091014201339
---

Not much is known of the background of the man many call the Cobra Commander. What we can only tell is how he works and how he thinks. We know that he has deliberately started political and social conflict in a number of areas. He has amassed an army by recruiting displaced people, promising them money, power and a chance to get back at the world that hurt them. In return, he demands that they swear absolute loyalty to his cause. What is his cause? World domination. 

Cobra Commander does not delude himself by justifying his actions as matters of principles or glory. He knows he does it for control and power. He is ruthless, hatred-personified and totally obsessed. A meticulous person, he likes to personally oversee vital projects himself, even engaging in military combat himself on occasion. Not much is known about him, he is a master of disguise and he has appeared as a goatee artist looking man with a son in a coma, in the Marvel comics. His appearance in the 12 inch G.I. Joe line shows him as a man with dark slicked back hair, his appearance constantly changing leaves him assumed to wear masks, even the commander can keep his identity from the people around him.
```

And how it looks on the site:

<img src="https://static.raymondcamden.com/images/2019/10/lunr3.png" alt="Cobra Commander page" class="imgborder imgcenter">

### Our Search Index 

I decided to build my index out of the character pages. My index would include the title, URL, and the first paragraph of each character page. You can see the final result here: <https://lunrjoe.raymondcamden.now.sh/index.json>. So how did I build it?

The first thing I did was create a [custom collection](https://www.11ty.io/docs/collections/) for Eleventy based on the directory where I stored my character Markdown files. I added this to my `.eleventy.js` file.

```js
eleventyConfig.addCollection("characters", function(collection) {
	return collection.getFilteredByGlob("characters/*.md").sort((a,b) => {
		if(a.data.title < b.data.title) return -1;
		if(a.data.title > b.date.title) return 1;
		return 0;
	});
});
```

I am embarrassed to say it took me like 10 minutes to get my damn sort right even though that's a pretty simple JavaScript array method. Anyway, this is what then allows me to build a list of characters on my site's home page, like so:

```html
{% raw %}<ul>
{% for character in collections.characters %} 
  <li><a href="{{ character.url }}">{{ character.data.title }}</a></li>
{% endfor %}
</ul>
{% endraw %}```

This is also how I'm able to look over my characters to build my JSON index. But before I did that, I needed a way to get an "excerpt" of text out of my pages. The docs at Eleventy were a bit weird about this. I had the impression it was baked in via one of the tools it uses, but for the life of me I could not get it to work. I eventually ended up using a modified form of the tip on this article, [Creating a Blog with Eleventy](https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/). I added his code there to add a short code, `excerpt`, built like so:

```js
eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

// later in my .eleventy.js file...
// https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/
function extractExcerpt(article) {
	if (!article.hasOwnProperty('templateContent')) {
	  console.warn('Failed to extract excerpt: Document has no property "templateContent".');
	  return null;
	}
   
	let excerpt = null;
	const content = article.templateContent;

	// The start and end separators to try and match to extract the excerpt
	const separatorsList = [
	  { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
	  { start: '<p>', end: '</p>' }
	];
   
	separatorsList.some(separators => {
	  const startPosition = content.indexOf(separators.start);
	  const endPosition = content.indexOf(separators.end);
   
	  if (startPosition !== -1 && endPosition !== -1) {
		excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
		return true; // Exit out of array loop on first match
	  }
	});
	return excerpt;
  }
 ```

 Note that I modified his code such that it finds the *first* closing P tag, not the last. 

 With these pieces in place, I built my index in `lunr.liquid`:

 ```js
 ---
permalink: /index.json
---

[
{% raw %}{% for character in collections.characters %}
{
	"title":"{{character.data.title}}",
	"url":"{{character.url}}",
	"content":"{% excerpt character %}"
} {% if forloop.last == false %},{% endif %}
{% endfor %} 
{% endraw %}]
```

### Our Search Front-End

Because I'm a bit slow and a glutton for punishment, I decided to build my search code using Vue.js. Why am implying this was a mistake? Well it really wasn't a mistake per se, but I did run into an unintended consequence of using Liquid as my template engine and Vue.js. You see, by using Liquid on the back end (in my static site generator), I made use of a template syntax that is similar to Vue.js. So if I did `{% raw %}{{ name }}{% endraw %}` it would be picked up by Liquid first before Vue ever got a chance to run it. The solution wasn't too difficult, but possibly added a bit of complexity that may be something you wish to avoid in the future. 

Of course, using Vue was totally arbitrary here and not something you need to use with Lunr, so please keep that in mind when looking at my solution. Since my own blog *also* uses Liquid, I'm going to share the HTML code via an image. Note that my entire demo is available at GitHub (via the link I'll share at the end).

<img src="https://static.raymondcamden.com/images/2019/10/lunr4.png" alt="Use of raw" class="imgborder imgcenter">

In the screen shot above, note the `raw` and `endraw` tags surrounding my Vue code. That's how I was able to get it working. But as I said, let's ignore that. ;) The code here is rather simple. A search field, a place for the results, and a simple way to handle it when no results are found. Note that my results include a `url` and `title` value. This actually takes a little bit of work, and I'll explain why in a bit. Alright, let's switch to the JavaScript.

First, let's look at the `data` and `created` parts of my code.

```js
data:{
	docs:null,
	idx:null,
	term:'',
	results:null
},
async created() {
	let result = await fetch('/index.json');
	docs = await result.json();
	// assign an ID so it's easier to look up later, it will be the same as index
	this.idx = lunr(function () {
		this.ref('id');
		this.field('title');
		this.field('content');

		docs.forEach(function (doc, idx) {
			doc.id = idx;
			this.add(doc); 
		}, this);
	});
	this.docs = docs;
},
```

When my Vue application loads up, I first make a request to my index data. When that's done, it's time to build the Lunr index. This is done via a function passed in to the constructor. The first thing I do is define the `ref`, or primary identifier of each thing I'm indexing, what Lunr refers to as docs. I then define the fields in my content I want indexed. Note that I could boost certain fields here if I want one to be more important than another.

I then loop over each item in my index and here's a <strong>SUPER IMPORTANT</strong> thing you need to keep in mind. When Lunr returns search matches, it only returns the `ref` value. If you remember, my index consists of the url, the title, and a block of text. If I want to tell my users the title of the matched document, and if I want to link to that result, I have to get that information. But I just said - Lunr doesn't return it. So how do I get it?

Since Lunr returns the `ref` value, I can use that as a way to look up my information in the index. My URLs are unique and I could use array methods to find my data, but if I simply use the position value, the `idx` above, then I've got a quick and easy way to get my original document. This comes together in the `search` method:

```js
search() {
	let results = this.idx.search(this.term);

	// we need to add title, url from ref
	results.forEach(r => {
		r.title = this.docs[r.ref].title;
		r.url = this.docs[r.ref].url;
	});

	this.results = results;
}
```

I begin by just doing the search, passing your input as is. Lunr will parse it, do it's magic, and return the results. In order for me to use the title and url values, I refer back to the original array as I loop over the results. And that's basically it. You can test this yourself - try searching for `weapon` to find Destro. 

Finally, you can find the entire repository for this demo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/lunr>. I hope this helps, and now you know how to use client-site search with Lunr and Eleventy. And as we know...

<img src="https://static.raymondcamden.com/images/2019/10/lunr5.png" alt="Knowing is half the battle..." class="imgborder imgcenter">

<i>Header photo by <a href="https://unsplash.com/@imagesbykayla?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kayla Farmer</a> on Unsplash</i>
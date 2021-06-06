---
layout: post
title: "Adding Algolia Search to Eleventy and Netlify"
date: "2020-06-24"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/search.jpg
permalink: /2020/06/24/adding-algolia-search-to-eleventy-and-netlify
description: How I added Algolia Search to an Eleventy Site
---

Before I begin, a quick warning. I got things working, but I honestly cannot say this is the best way to do it. I'm still learning and my goal is to add Algolia to my site here, but I failed in that attempt. (I'll explain why after the main tutorial.) I first wrote about [search and the Jamstack](https://www.stackbit.com/blog/jamstack-search/) earlier this year, and one of the first comments I got was about why I had not covered [Algolia](https://www.algolia.com/). At the time, I didn't have a good answer outside of "I just haven't tried it yet." Over the past week I've played with it off and on and I have to say I'm incredibly impressed even after a brief foray into it. As I said, what follows is rough, and just my first attempt, but I hope it helps others.

I also want to note that my approach is pretty specific to Eleventy and Netlify. You'll see why Netlify was important but any Jamstack host that has support for "run this on a build" (for example, via a webhook) would be able to achieve similar results.

Before I begin, note that Algolia is a commercial service with multiple [pricing tiers](https://www.algolia.com/pricing/). The free tier allows for 50K operations and 10K records. That's *incredibly* generous but did cause a problem with my blog. (Again though, I'm holding off until the end.) 

At a high level, Algolia is very similar to Verity and Lucene. I don't hear people talk about either of these anymore, but I spent many years using them with ColdFusion. You start off by defining your bucket of data that will be searched. Algolia refers to this as an index. Indexes have data as well as many options, for example, specifying how some properties may be more important than others. You can even do cool things like custom synonyms relevant to your data. 

The index is a mirror of your data which is an important thing to keep in mind. Every time you add, edit, or delete data from your site you need to update the index to reflect that change. In an app server type site, that's trivial. On the Jamstack, it's a bit more complex. Here's how I solved it in a simple Eleventy application.

I began by creating a boring blog in Eleventy. One home page, a posts folder and a couple of markdown files. Nothing else really.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/ag1.png" alt="Screenshot of Blog" class="lazyload imgborder imgcenter">
</p>

I'm not going to show the code for this part as I'm assuming you already have a basic understanding of Eleventy, but everything's in my GitHub repo I'll share at the end. 

For my search, I decided to index the posts. These are all markdown files available to Eleventy as `collections.posts`. Algolia supports seeding your index with a JSON file, so I built the following:

```html
---
permalink: /algolia.json
---
{% raw %}
{% assign posts = collections.posts | reverse %}
[
{% for post in posts %}
	{
		"title": {{post.data.title | jsonify}},
		"date":"{{ page.date }}",
		"url":"{{ post.url | prepend: site.url }}",
		"content":{{ post.templateContent | algExcerpt | jsonify }}
	}{% unless forloop.last %},{% endunless %}
{% endfor %}
{% endraw %}]
```

The output of this will be a JSON collection of all my posts. I include the title, date, url, and content. (I'll explain the filters in a second.) I could also include post categories and other information. Algolia lets you index anything and you've got control over what's searched, which means you can include data you want to return in searches but not actually search against. You can see this live here: <https://eleventyalgolia.netlify.app/algolia.json> By the way, the reverse sort was just a way for me to see if it was updating properly with a large amount of data. 

So there's two filters for my content, `algExcerpt` and `jsonify`. `jsonfify` just does a JSON stringify on the data. `algExcerpt` is a bit more complex:

```js
// Remove <code>.*</code>, remove HTML, then with plain text, limit to 5k chars
eleventyConfig.addFilter('algExcerpt', function (text) {
	//first remove code
	text = text.replace(/<code class="language-.*?">.*?<\/code>/sg, '');
	//now remove html tags
	text = text.replace(/<.*?>/g, '');
	//now limit to 5k
	return text.substring(0,5000);
});
```

As the comment says, I wanted to remove code blocks, and the text inside them, and HTML. Also, Algolia has a max record size limit on the free tier (10k). I figured 5k was enough to get the point across. I also decided it made sense to get rid of code as if I blog about code feature `foo` I'm probably going to mention `foo` more than once in the regular text of the post. Obviously these are a bit arbitrary. Also, I don't think Algolia has a problem with HTML, but I figured it would make the size a bit smaller. (On reflection, this may be even be a mistake. Algolia may recognize text in a `h1` as being more important than a `p` tag.)

With that file generated, I manually uploaded it to Algolia and tested. Their dashboard is *damn* well done and really helpful. One of the best features is that you can search right away:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/ag2.png" alt="Algolia dashboard" class="lazyload imgborder imgcenter">
</p>

Ok, so technically, if you don't mind some manual work, you're done. You could simply reupload the JSON file every time you generate your site. And I know that sounds lame, but I can totally see people building a site that potentially gets updated pretty rarely. In that case it may be worth the (relatively minor) hassle.

But what if you *do* want to automate it? Here's where things get a bit... interesting. I knew that Algolia had REST APIs I could use. I also knew that Netlify has a `deploy-succeeded` event you can write custom code for. (See my [blog post](https://www.raymondcamden.com/2020/05/29/enhancing-your-netlify-build-notifications) from last month on it.) My first issue was trying to determine how I'd know what changed since my last build. I couldn't really use the file system as Netlify checks stuff out to their system and the last modified values wouldn't match what I would expect. I toyed with the idea of using the date of my posts to grab the last new post. But this wouldn't handle edits to old posts. I then thought about adding new front matter, `lastEdited`, and then simply merging the last few posts and the last few edited posts. I say "few" because my assumption is that I may push a few files at once to GitHub. 

All of this felt possible... but daunting. I was talking about this on Twitter when a few folk came out to help me. One of them, [Tim Carry](https://twitter.com/pixelastic) shared that he had a cool project that would help, [algolia-indexing](https://github.com/pixelastic/algolia-indexing). It took all of the complexity away and basically reduced it to a few lines:

```js
const indexing = require('algolia-indexing');

const credentials = { appId: 'XXX', apiKey: 'YYY', indexName: 'my_index' };
const records = [{ foo: 'bar' }];
const settings = { searchableAttributes: ['foo'] };

await indexing.fullAtomic(credentials, records, settings);
```

It handles comparing your old data to your new and figuring out what needs to update. It's still in beta (his words), but in my testing it's worked really well so far. I created this `deploy-succeeded.js` serverless function on Netlify.

```js
const indexing = require('algolia-indexing');
const algCredentials = { appId: process.env.ALG_APP_ID, apiKey: process.env.ALG_API_KEY, indexName: 'eleventy_test' };

const fetch = require('node-fetch');

exports.handler = async (event, context) => {

  try {

    /// HANDLE ALOGLIA
    // first, get my index
    let dataResp = await fetch('https://eleventyalgolia.netlify.app/algolia.json');

    let data = await dataResp.json();
    console.log('Successfully got the data, size of articles '+data.length, data[0].title);

    indexing.verbose();

    const settings = { };
    try {
      await indexing.fullAtomic(algCredentials, data, settings);
    } catch(e) {
      console.log('error in fullAtomic', e);
    };
    console.log('Algolia indexing updated. Hopefully.');
    

    return { statusCode: 200, body: 'I\'m done with this shit...' }

  } catch (err) {
    console.log('error handler for function ran', err.toString());
    return { statusCode: 500, body: err.toString() }
  }

}
```

Probably the weirdest line is this:

```js
let dataResp = await fetch('https://eleventyalgolia.netlify.app/algolia.json');
```

Even though my serverless functions are in the same repository as the rest of my site, they aren't on the file system. When deployed, it can't just read the JSON file Eleventy created. That means I need to retrieve it via HTTP. Once done, I just pass it to his library and that's it. I tested this a few times by writing new blog posts, committing to GitHub, and then seeing the index update automatically when the build was done.

Woot! Now I needed to actually add a search to my site. This is the only thing I really found awkward with Algolia. (To be clear, not wrong, just... awkward.) In the Algolia docs, they have a section titled "Building Search UI". Going there leads you to their [InstantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/) product. This looks to be a cool library for working with their search, but it's more than I wanted really. It felt like a solution for people not as familiar with JavaScript. Or folks who wanted more of the UI built out automatically for them. That's fine, but what I really wanted was a simple `.search` method I could use where I'd handle all the UI.

I had to search a bit, but I did find their more basic APIs, and a [JavaScript version](https://www.algolia.com/doc/api-client/getting-started/what-is-the-api-client/javascript/?language=javascript) that was exactly what I was looking for. I built a simple search interface with Vue.js and their library. First, the layout:

<script src="https://gist.github.com/cfjedimaster/c3d7f2d605ba3d458b7b8579eb63637a.js"></script>

By the way, when using Liquid and Vue in Eleventy, don't forget you need to [escape the Vue tokens](https://www.raymondcamden.com/2020/04/03/quick-tip-on-using-vue-with-eleventy) in order for it to work. That's why I used a Gist for this part.

Then the JavaScript:

```js
const app = new Vue({
	el:'#app',
	data: {
		search:'',
		algolia_client:null,
		algolia_index:null,
		results:null,
		numResults:null
	},
	created() {
		this.client = algoliasearch('WFABFE7Z9Q', 'd1c88c3f98648a69f11cdd9d5a87de08');
		this.index = this.client.initIndex('eleventy_test');
	},
	methods: {
		async doSearch() {
			this.results = null;
			if(this.search === '') return;
			console.log('search for '+this.search);
			let resultsRaw = await this.index.search(this.search,{
				attributesToRetrieve:['title', 'url']
			});
			console.log('results', resultsRaw);
			this.results = resultsRaw.hits;
			this.numResults = resultsRaw.nbHits;
		}
	}
})
```

As you can see, the Algolia aspect is simple. Do note that when you define the `algoliasearch` object you should use a `search` only key so that it's safe to be in client-side code. Also note that when I did my search, I specified the attributes to return because I didn't want `content` being sent back. The search API supports paging and more stuff too, but I kept it simple. Heck, I just realized I never actually displayed the number of results, but I could add that in if I need.

Here's my incredibly beautiful search engine:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/06/ag3.png" alt="Search form and results" class="lazyload imgborder imgcenter">
</p>

Yes, I could do a *heck* of a lot more to make this nicer looking. They even return information to let you highlight results too. Just please don't judge Algolia by my pretty basic demo here. :)

So hopefully you've followed along so far. You can see the entire site here: <https://eleventyalgolia.netlify.app>. Just click the Search link in the top nav to test it out. Also note that if my blog had a search field in the layout itself that POSTed or GETed to my search template, I could sniff that data on page load and do a search immediately. 

The entire code base for this project may be found here: <https://github.com/cfjedimaster/eleventy_algolia>

### So What Went Wrong?

Alright, so as I said, my initial idea for all of this was to use it on my site. I currently use a Google Custom Search Engine, but would like to have more control over the setup and would like to get rid of the ads. Algolia requires you to add a message saying the results came from them, but they don't serve up advertising in the results. 

The free tier has a limit of 10k entries and I'm currently at 6,119, but if you look at my [stats](https://www.raymondcamden.com/stats), a majority of that was in the first ten years of me blogging. I could probably go another decade before I hit that limit and at that point I'd either cough up the bucks for an upgrade or figure out something else. 

So I built, on my blog, basically what you see above. The first issue I ran into was the `deploy-succeeded` function took too long to run. Netlify limits you to 10 seconds per function. I asked for more time, and they responded super quick, but they only go up to 20. 

I then thought - why not use [Pipedream](https://pipedream.com/)? There's nothing specific about my logic that has to be on the Netlify server. They support webhooks so I could use that to fire off the Pipedream webhook. I rebuilt my logic there (it took about three minutes, I'm a huge Pipedream fan!), but then ran into another issue.

As part of how `algolia-indexing` works, it has to duplicate your index and work on a copy. My index was over 6k and when it tried to duplicate it, that brought me over the 10k limit. I've reached out to Tim to see if there's a way around that, but for now I'm kinda stuck. I'm still going to work on it and hopefully I can get it in here soon.

Anyway, I'd love to hear from others using Algolia and the Jamstack. Leave me a comment below describing your implementation!
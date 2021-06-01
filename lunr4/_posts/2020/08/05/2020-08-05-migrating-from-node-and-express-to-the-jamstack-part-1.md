---
layout: post
title: "Migrating from Node and Express to the Jamstack - Part 1"
date: "2020-08-06"
categories: ["serverless","javascript"]
tags: ["eleventy"]
banner_image: /images/banners/migrate.jpg
permalink: /2020/08/06/migrating-from-node-and-express-to-the-jamstack-part-1
description: A look at how you can migrate from Node to the Jamstack
---

Welcome to the first of a series of some unknown length. For the past year or so (seriously), I've been looking at an old Node.js project I have and thinking about how I could update to it. I have to be a bit vague because it's a secret project I'm doing with some friends but it involved a number of features:

* MongoDB for storage
* Auth0 for identity
* Stripe for ecommerce

I used [Express.js](https://expressjs.com/) for the framework. The front end used a bit of JavaScript, but not much. Auth0 was used for login and registration with [Passport.js](http://www.passportjs.org/) being used as well. Ecommerce was done via [Stripe](https://stripe.com/) and a simple checkout modal. This was followed by a POST handler in Node to record the order. 

The site itself was fairly small. A few pages that were just text and a set of dynamic pages representing the main content. As I have to be a bit vague, let's pretend for now it is a movie site with the ability to load information about a movie via a path like so: `/movie/urlslug`, so for example: `/movie/the-force-awakens`. 

While the site worked, the service it was on was moving past Node.js hosting and while I could find another, I thought it might be time to look into a Jamstack solution. As I said though, this has been on my mind for about a year now. While I feel really comfortable with the Jamstack, I just struggled with how to convert this existing site over, especially with the Mongo, login, and ecommerce aspects. I knew there were solutions for all of that, but again, I just struggled with the particulars. 

Finally last weekend I decided to take a stab at it. I made some progress and after talking with some friends, I think I know how to proceed. While I can't show a "before" and "after" demo, I am working on a new demo that mimics some of the existing site. I'm not necessarily saying this is the best conversion, but I had to start somewhere. As always, I'd *love* your feedback in the comments below. With that out of the way, let me begin by covering what the features of this demo site are and the technology stack.

* The site in question will be a film site. You'll hit the home page, see a list of films, and can click for details. You can optionally login to post comments and there will be a page that lists every comment you wrote.

* I had to decide between a Single Page Application written in Vue and a Jamstack site written in [Eleventy](https://www.11ty.dev/). Since the site is so simple, I decided to go with Eleventy. I'm still using Vue a bit on the front end, but I wanted static files backed by serverless functions as my core architecture. 

* I'm using [Mongo](https://www.mongodb.com/) for data storage. It's what I used for the Node site and I see no reason to change that. Previously I used Mongoose as a wrapper for Mongo but I'll be dropping that for now. I haven't used Mongo seriously in a while, but I was really impressed with how much it's improved and how quick it was to setup. Im also now using their Compass application for local editing. 

* I'll be using Netlify for the site, because of couse I am.

* [Auth0](https://auth0.com/) will be used for identity. I wanted to use [Netlify Identity](https://docs.netlify.com/visitor-access/identity/), but they only support Google for social login (and a few others that none of our users will recognize). I need Twitter and Facebook support as well. I'm really surprised this hasn't been added to Netlify Identity yet. I raised it on the forums as a request for now.

* My "dynamic" content will be split between "kinda" dynamic and really dynamic. This is an important point. I wanted a real file for every film. For that I used Eleventy's pagination support. That means when a new film is added, a site build has to happen. Since this can be automated and is quick, I was fine with that. Also, in the context of this demo, films are added only so often. At the same time, every film has data that does change often, namely comments. So when you hit the film page, a serverless function will "enhance" the page by fetching that additional data. I'm also tracking the total number of film puchases so that will be fetched as well. (See bullet point below.)

* To post comments, you have to login. The site knows you are logged in as you go from page to page. This has to work even though I'm using static pages and not a SPA. This was a big deal because nearly every demo I saw of this assumed a SPA. I've got a good friend who works at Auth0 and he helped me out. I'm going to wait to the next post though before I show that.

* Finally, you can buy a film. Ok, that doesn't necessarily make sense, but I need to have ecommerce in the demo. Stripe will process the payment and serverless functions will be used to record the order. It has to know who did it (via Auth0) and what film was purchased. 

So that's nearly a thousand words, and I still don't feel like I've quite nailed it down precisely, but my entire reason for building this blog was to work through things that confused me (and excited me) and share them. I've got the first phase done so let me share what I did.

I began with an existing MongoDB database. (Actually it was on a service called mLab and I had to migrate it. That went painlessly.) MongoDB gave me my connection string information which I knew was going to be sensitive, so step one was adding it to my Netlify site an environment variable.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/sj1.jpg" alt="Netlify environemnt settings" class="lazyload imgborder imgcenter">
</p>

I then switched to Eleventy. My first page us a list of films and to get that, I'm using a global data file. Here it is:

```js
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;


module.exports = async function() {
    let films = await getFilms();
    return films;
}

async function getFilms() {

	const client = new MongoClient(url, { useUnifiedTopology: true });
  	await client.connect();
  	const db = client.db('eleventy_demo');
  	const films = db.collection('films');

	const query = { "public": true };
	const filmArray = await films.find(query).toArray();
	await client.close();
	return filmArray;
}
```

There's a couple of things that are important here. First, I get my Netlify environment variable like any other, but for this to work I need to use `ntl dev` to run my site and not `eleventy --serve`. Technically `ntl dev` is doing that anyway, but don't forget. This is what will "inject" the environment variable. You can see it in your console:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/sj2.jpg" alt="ntl dev output" class="lazyload imgborder imgcenter">
</p>

Although crucial aspect? Closing the Mongo connection. That's huge and cost me two days of trying to figure out why it could run locally but never built on Netlify. Huge thanks go to [Dave Rupert](https://daverupert.com/) for finding this issue and even submitting a PR so I could fix it in one click. 

Notice that I'm doing a filter on "public" films. That was me replicating a feature of the 'real' site, the ability to have content that wasn't published yet. 

So this gives me a list of films. I could then list them in my home page:

```html
<ul>
{% raw %}{% for film in films %}
	<li><a href="films/{{film.title | slug }}/">{{film.title}}</a></li>
{% endfor %}
{% endraw %}
</ul>
```

Next I needed to build one page per film. I did that like so:

```html
{% raw %}
---
layout: main
pagination:
   data: films
   alias: film
   size: 1
permalink: "/films/{{ film.title | slug }}/index.html"
---

<h2>{{ film.title }}</h2>

<p>
	{{ film.description }}
</p>
{% endraw %}
```

This creates one page per film using a "slugged" version of the title. I mentioned earlier that I need to use Ajax to get additional data on films that needs to be "live", but I'll get to that later in the process. 

I know this isn't a post just specifically about Eleventy, but I freaking love Eleventy. 

Anyway, at this point I've got a static site driven by data in a MongDB database. It requires a rebuild on data editing, but for now it's got all the benefits of my older Node site (well, with a few features built) and zero need for a live server. Technically I'm running my MongoDB server 24/7, but I'm *well* within a free tier and the fine folks at MongoDB are handling the server. I trust them to handle that part.

You can see this running live here: <https://hardcore-curie-802f8f.netlify.app/>. And the GitHub repo is at: <https://github.com/cfjedimaster/eleventy-auth0-serverless-mongo>

That's it for now. The next version will implement Auth0 for login. It's going to be in the top nav and as you navigate, will remember that you're logged in. The code for that is done (again, via a friend of mine at Auth0), but it may be a few days. Again, if you have any comments, or if you've done this process yourself, please drop me a comment below!

<span>Photo by <a href="https://unsplash.com/@7bbbailey?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Barth Bailey</a> on <a href="https://unsplash.com/s/photos/migrate?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
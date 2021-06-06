---
layout: post
title: "Building a Database Driven Eleventy Site"
date: "2021-04-15"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/database.jpg
permalink: /2021/04/15/building-a-database-driven-eleventy-site
description: Using a database (MySQL) to drive content for an Eleventy site
---

For a large portion of my development career, I've been a databaser user of some sort or another. I spent many years working with app servers (ColdFusion) and almost always they were tied to a SQL database of some sort. In the beginning this was Microsoft Access (it was really easy to use), then SQL Server and eventually [MySQL](https://www.mysql.com/). Most recently I've made more use of NoSQL databases, like [Mongo](https://www.mongodb.com/) and [Fauna](https://fauna.com/). While I definitely prefer NoSQL databases, after years of using SQL, I still have a bit of fondness for it. It's with this in mind that I decided to look into integrating MySQL with [Eleventy](https://www.11ty.dev/). Over the weekend I built a quick demo and was planning on blogging *sometime* this week, but was inspired to get this out sooner when I saw this cool Tweet:

<blockquote class="twitter-tweet tw-align-center" data-theme="dark"><p lang="en" dir="ltr">Did you know you can query a MYSQL database right in <a href="https://twitter.com/eleven_ty?ref_src=twsrc%5Etfw">@eleven_ty</a>? With JavaScript data files, it&#39;s easy!<br><br>I’ve built a new, ever-growing database to catalog a music collection I’m building. You can see it here: <a href="https://t.co/KQZWPnN8P5">https://t.co/KQZWPnN8P5</a><br><br>Context for why: <a href="https://t.co/7jwdB3JNHo">https://t.co/7jwdB3JNHo</a> <a href="https://t.co/KXXksbloOq">pic.twitter.com/KXXksbloOq</a></p>&mdash; Andy Bell (@piccalilli_) <a href="https://twitter.com/piccalilli_/status/1382451790004813828?ref_src=twsrc%5Etfw">April 14, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

For my demo (and I'll link to the code at the end) I decided to build a simple blog. I created a MySQL database containing three tables:

* posts - has columns for id (integer, primary key, autonumber), title, body, and published
* categories - has columns for id (integer, primary key, autonumber), name
* posts_categories - a table that lets you associate a blog post with multiple categories - has a column pointing to the primary key of posts and the primary key of categories

Once I created the tables, I used the MySQL Workbench to input some basic data. Once I had data, I then created a blank Eleventy site, added a `_data` folder, and Googled for "nodejs mysql". When I teach about Eleventy, I tell people it's Node-based, but that you do not need to know NodeJS in order to use it. That's true, but having some familiarity with Node, even just the basics, will help you in the long run. 

My search turned up the [mysql](https://www.npmjs.com/package/mysql) npm package. It looked easy enough to use, but I quickly ran into a connection problem. Hitting up Google again, I discovered that another package, [mysql2](https://www.npmjs.com/package/mysql2) fixed my issue and seemed to be the best library to use. (You can read more about the 'why' of this package [here](https://www.npmjs.com/package/mysql2#history-and-why-mysql2)). 

Here's an example of this in use. I set up my connection properties (host, username and password, and database name) in an `.env` file and then created a file to grab my blog posts:

```js
require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const mysql = require('mysql2/promise');

module.exports = async function() {

	let posts = [];

	const connection = await mysql.createConnection({
		host     : DB_HOST,
		user     : DB_USER,
		password : DB_PASSWORD,
		database : DB_NAME
	});

	const [rows] = await connection.execute('select id, title, body, published from posts order by published desc');

	for(let i=0; i<rows.length; i++) {
		// for each posts, get categories
		const [cats] = await connection.execute('select id, name from categories where id in (select categoryidfk from posts_categories where postidfk = ?)', [rows[i].id]);
		let categories = [];
		for(let k=0; k<cats.length; k++) {
			categories.push({
				id:cats[k].id,
				name:cats[k].name
			});
		}
		posts.push({
			id:rows[i].id,
			title:rows[i].title,
			body:rows[i].body,
			published:rows[i].published,
			categories
		});
	}

	connection.end();
	
	return posts;
}
```

Pay special attention to this line, `const mysql = require('mysql2/promise');`, you will absolutely want to use the promisified version of the library (assumng you are comfortable with async/await and promises, and if you aren't, just ask me fo rhelp!). The logic to generate post data for my site is slightly complex as I have to get posts and then for each one, get a list of associated categories. This is exactly the kind of thing a NoSQL database makes easier, but honestly it isn't too much work here. 

The end result is an array of post objects that contain the id, title, body, published properties and an array of categories (id and name). Here's how I used it in my blog's home page:

```html
---
title: Home Page for Blog
layout: layout
---

<h2>Blog Demo</h2>

<p>
This folder is meant to be used as a basic blog that I will copy to use in <i>other</i> demos.
</p>

<h2>Posts</h2>

{% raw %}<ul>
{% for post in posts %}
  <li><a href="/post/{{post.title | slug}}/">{{ post.title }}</a> ({{ post.published | dtFormat }})</li>
{% endfor %}
</ul>
{% endraw %}
```

I then used Eleventy's awesome [pagination from data](https://www.11ty.dev/docs/pages-from-data/) feature to create one page per post:

```html
---
layout: layout
pagination:
   data: posts
   size: 1
   alias: post
   
{% raw %}permalink: "/post/{{post.title | slug}}/"
eleventyComputed:
---

<h2>{{ post.title }}</h2>
<p>
Posted on {{ post.published | dtFormat }}<br/> 
Posted in {% for cat in post.categories %} <a href="/category/{{ cat.name | slug }}">{{ cat.name }}</a>{% if forloop.last == false %}, {% endif %}{% endfor %}
</p>

{{ post.body | markdown }}
{% endraw %}
```

I think most of the above is standard Eleventy usage, but I'll point out the very last line. Notice I take the post body string and pass it to a markdown filter. I defined this in `.eleventy.js`:

```js
let markdownIt = require("markdown-it")();

eleventyConfig.addFilter("markdown", function(str) {
	return markdownIt.render(str);
});
```

I did this so that blog posts could be written simpler. So for example, a post body could look like so:

```text
This is some text. Hello world.

Here is more text.
```

And the space between each line above would become one paragraph. 

Back in the post template, you may have noticed I linked each category to a page. Let's look at how I handled that. First, I created `categories.js` in my `_data` folder:

```js
require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const mysql = require('mysql2/promise');

module.exports = async function() {

	let cats = [];

	const connection = await mysql.createConnection({
		host     : DB_HOST,
		user     : DB_USER,
		password : DB_PASSWORD,
		database : DB_NAME
	});

	const [rows] = await connection.execute('select id, name from categories order by name');

	for(let i=0; i<rows.length; i++) {
		cats.push({
			id:rows[i].id,
			name:rows[i].name
		});
	}

	connection.end();
	
	return cats;
}
```

I've got a bit of repitition here connecting to the database and I could probably optimize that so that both `posts.js` and `categories.js` share some common connection code. I'm going to be honest here. One of the reasons I like the Jamstack is that I can write, um, "not the best code", and know it's only going to be run once during the build process. If it's a bit slow, I'm ok with that. 

Alright, with that done, I then build the category pages like so:

```html
---
layout: layout
pagination:
   data: categories
   size: 1
   alias: category
{% raw %}permalink: "/category/{{category.name | slug}}/"
---

<h2>{{ category.name }}</h2>

{% assign posts = posts | getByCategory: category.id %}

<ul>
{% for post in posts %}
  <li><a href="/post/{{post.title | slug}}/">{{ post.title }}</a> ({{ post.published | dtFormat }})</li>
{% endfor %}
{% endraw %}
```

The only thing really interesting here is the filter to get posts by category. Here's how I defined that in `.eleventy.js`:

```js
eleventyConfig.addFilter('getByCategory', (posts,cat) => {
	let results = [];

	for(let post of posts) {
		if(post.categories.findIndex(c => c.id === cat) >= 0) results.push(post);
	}
	return results.reverse();
});
```

Notice how in Eleventy filters, the first argument is the object you pass to the filter and the second argument was the argument I passed after naming the filter. When I first started building these kind of things, it was a bit confusing to me. 

So the end result is a home page with a list of posts, pages for each post, and category lists. You can see this in action here: <https://mysqleleventy.vercel.app/>. The source code may be found here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/mysql_blog>. Obviously the big missing piece here is administration. As I said, I "wrote" my blog posts by using the MySQL Workbench. In a real world example of this, you could have a "traditional" app server site with authentication providing CRUD for the data with Eleventy driving the public facing front of it. If any of this doesn't make sense, just reach out. 

p.s. A quick note for WSL users. In order for my Ubuntu install to "connect" to my Windows-based MySQL server, I ran a quick `ipconfig` in the command prompt to get the IP address Windows was using. Ubuntu had no problem connecting to it that way.

Photo by <a href="https://unsplash.com/@jankolar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jan Antonin Kolar</a> on <a href="https://unsplash.com/s/photos/database?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
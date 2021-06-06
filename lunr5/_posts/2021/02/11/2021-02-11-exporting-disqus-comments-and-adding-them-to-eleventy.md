---
layout: post
title: "Exporting Disqus Comments and Adding Them to Eleventy"
date: "2021-02-11"
categories: ["development"]
tags: []
banner_image: /images/banners/hanging-pots.jpg
permalink: /2021/02/11/exporting-disqus-comments-and-adding-them-to-eleventy
description: A look at how to get your Disqus comments and convert them to static content.
---

Apologies for what may be a long winded, kinda haphazzard post. The beginning of what I'm sharing here would be useful to anyone using [Disqus](https://disqus.com/) while the remainder will only be of use to [Eleventy](https://www.11ty.dev/) folks. I'll try to be clear about when that transition occurs so you can stop reading when it makes sense. Or you can just read everything, I won't mind!

Alright, so what's the point of all this? I've noticed for some time now the comment traffic on my blog has decreased to near nothing. In fact, here's a chart that shows in pretty stark detail how much it's dropped:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/d1.jpg" alt="Line chart showing drop of comments" class="lazyload imgborder imgcenter">
</p>

For folks curious, that chart comes from the Disqus reporting tool I built a few years ago called Vader. You can read more about it here: [Working with the Disqus API - Deeper Stats (2)](https://www.raymondcamden.com/2016/08/25/working-with-the-disqus-api-deeper-stats-2) Disqus is a simple way to add commenting to a site, and I totally get why strong analytics requires a paid update, but I will never understand why Disqus simply can't tell you the total number of comments a site has. That's incredibly silly, if you ask me.

That being said, I decided it was time for a change. I decided I would export my Disqus data, create a static version of it, and start working with [Webmention](https://indieweb.org/Webmention). The first part is done and is covered in this post. 

Let's begin by talking about the data. Disqus does have an export feature, which they warn you may not be available for all sites (tip to every developer resource ever - don't have vague limits in your docs). I tried it on mine and was surprised when I got an email five minutes later with a link to my export. Unfortunately it ended up being a corrupt gzip file so it was useless. As I had previous familiarity with their [API](https://disqus.com/api/docs/), I decided to give that a shot. 

Disqus considers comments to be in threads, where each thread, typically, relates to one blog post. (You can use Disqus for non-blog sites of course.) Their API to retrieve comments lets you get related thread data for each comment, so my first strategy was to get all the comments for my blog. Here's the script for that (I'll share links to GitHub sources at the end):

```js
/*
Part 1. Get a raw set of data that later scripts will make better. But for now, just download.
Result will be one huge array of posts. Each post object has a thread object.
*/

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

// change this to your site
const FORUM = 'raymondcamden';
const KEY = process.env.KEY;
/* 
hard coded export, could be an arg, keeping it simple for now, slightly dynamic
as I add the forum name, which I believe is always filename safe
*/
const FILENAME = 'rawdata.json';

(async () => {
	console.log(`Fetching threads for ${FORUM}`);
	let posts = await getPosts(FORUM);
	console.log(`Done fetching posts, total is ${posts.length}`);
	let exportFile = FORUM + '_' + FILENAME;
	fs.writeFileSync(exportFile, JSON.stringify(posts), 'utf-8');
	console.log(`Data written to ${exportFile}`);
	// temp
	posts.forEach(p => {
		if(p.isDeleted) {
			console.log('DELETED POST', p);
		}
	});
})();

async function getPosts(forum, cursor, posts) {

	let url = `https://disqus.com/api/3.0/posts/list.json?forum=${encodeURIComponent(forum)}&api_key=${KEY}&limit=100&order=asc&related=thread`;
	if(cursor) url += '&cursor='+cursor;
	if(!posts) posts = [];

	let resp = await fetch(url);
	let data = await resp.json();
	let newPosts = data.response;
	newPosts.forEach(p => posts.push(p));
	// only one per K
	if(posts.length % 1000 === 0) console.log('Post total is now '+posts.length);

	if(data.cursor && data.cursor.hasNext) {
		return getPosts(forum, data.cursor.next, posts);
	} else return posts;
}
```

For the most part this is simply a recursive call to retrieve a 'page' of comments one a time. That's the highest value possible. For my sixty thousand plus comments this took roughly a minute I think. I don't do any data transformation at this part as I figure it would be the slowest. I wanted the data local so that I could then slice and dice it. 

You'll notice a "temp" block in there. I was worried the API would return comments I had deleted (for spam obviously) but I never saw that happen. I'm still not 100% sure that's safe so I'm leaving the block in for now.

The result is a very, very large JSON file (well for my site anyway) consisting of an array of comments with embedded thread information. Here's one comment:

```js
{
	"editableUntil": "2021-02-12T22:37:28",
	"dislikes": 0,
	"thread": {
		"feed": "https://raymondcamden.disqus.com/building_table_sorting_and_pagination_in_vuejs/latest.rss",
		"clean_title": "Building Table Sorting and Pagination in Vue.js",
		"dislikes": 0,
		"likes": 11,
		"message": "",
		"ratingsEnabled": false,
		"isSpam": false,
		"isDeleted": false,
		"category": "3375237",
		"adsDisabled": false,
		"author": "17736500",
		"userScore": 0,
		"id": "6467564608",
		"signedLink": "http://disq.us/?url=http%3A%2F%2Fwww.raymondcamden.com%2F2018%2F02%2F08%2Fbuilding-table-sorting-and-pagination-in-vuejs&key=_egD8dUdRxY70Yph3kSn5A",
		"createdAt": "2018-02-08T22:31:44",
		"hasStreaming": false,
		"raw_message": "",
		"isClosed": false,
		"link": "http://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs",
		"slug": "building_table_sorting_and_pagination_in_vuejs",
		"forum": "raymondcamden",
		"identifiers": [],
		"posts": 114,
		"userSubscription": false,
		"validateAllPosts": false,
		"title": "\n        Building Table Sorting and Pagination in Vue.js\n    ",
		"highlightedPost": null
	},
	"numReports": 0,
	"likes": 0,
	"message": "<p>please mr, how can I add filter to this table, like i want to filter by name</p>",
	"id": "5256177490",
	"createdAt": "2021-02-05T22:37:28",
	"author": {
		"name": "mara",
		"url": "",
		"profileUrl": "",
		"emailHash": "",
		"avatar": {
			"small": {
				"permalink": "//a.disquscdn.com/1611874952/images/noavatar32.png",
				"cache": "//a.disquscdn.com/1611874952/images/noavatar32.png"
			},
			"large": {
				"permalink": "//a.disquscdn.com/1611874952/images/noavatar92.png",
				"cache": "//a.disquscdn.com/1611874952/images/noavatar92.png"
			},
			"permalink": "//a.disquscdn.com/1611874952/images/noavatar92.png",
			"cache": "//a.disquscdn.com/1611874952/images/noavatar92.png"
		},
		"signedUrl": "",
		"isAnonymous": true
	},
	"media": [],
	"isSpam": false,
	"isDeletedByAuthor": false,
	"isHighlighted": false,
	"parent": null,
	"isApproved": true,
	"isDeleted": false,
	"isFlagged": false,
	"raw_message": "please mr, how can I add filter to this table, like i want to filter by name",
	"isAtFlagLimit": false,
	"canVote": false,
	"forum": "raymondcamden",
	"url": "http://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs#comment-5256177490",
	"points": 0,
	"moderationLabels": [
		"anonymous"
	],
	"isEdited": false,
	"sb": false
},
```

By the way, it totally freaks me out when people call me mister. I mean I get that I'm older (more experienced!) but it still surprises me. 

Ok, so that gives up comments, but what I really want is an object where the top level array is threads and the posts are underneath it. For that, I wrote the second script.

```js
/*

I take the export of getData.js and convert it such that we have an array of thread objects which 
then contain an array of posts. I remove the .thread key from posts to make it smaller.

*/

const fs = require('fs');

const INPUT = './raymondcamden_rawdata.json';
const OUTPUT = './raymondcamden_threaddata.json';

console.log(`Reading ${INPUT}`);
let rawdata = fs.readFileSync(INPUT, 'utf-8');
let data = JSON.parse(rawdata);

let threads = [];

data.forEach(p => {
	index = threads.findIndex(t => t.id === p.thread.id);
	if(index === -1) {
		threads.push(p.thread);
		delete p.thread;
		index = threads.length-1;
		threads[index].posts = [];
	}
	threads[index].posts.push(p);
});

console.log(`Converted to a thread object of size ${threads.length}`);
fs.writeFileSync(OUTPUT, JSON.stringify(threads), 'utf-8');
console.log(`Result saved to ${OUTPUT}`);
```

The logic here is to create new threads when encountered, add the comment to an array inside the thread, and remove the embedded thread. The end result is essentially the same data, but now centered on an array of threads.

Woot! OK, if all you want to do is export your Disqus comments you can stop reading now.

Alright, so the next part was tricky. My goal was to create a set of files such that blog post X could import comment file X (when it existed) and display them instead of the Disqus embed. For that, I wrote a script that read in my thread data and wrote out one file per thread. It also applied basic HTML layout to the thread. To help with this, I used a CodePen ([this one](https://codepen.io/cfjedimaster/pen/mdOENXd) if your curious) to design something I thought was decent. 

Here's that script:

```js
/*
I read in the thread-centered data and then output rendered html for each thread.

notes for later - comment examples i like:
	https://css-tricks.com/how-to-add-commas-between-a-list-of-items-dynamically-with-css/
	
*/

const fs = require('fs');

const INPUT = './raymondcamden_threaddata.json';
const OUTPUT_DIR = './output/';

let threads = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

// TEMP
// threads = threads.slice(0,50);

console.log(`Working with ${threads.length} threads.`);

threads.forEach(t => {
	//console.log(t.link+' '+t.posts.length);
	let filename = OUTPUT_DIR + generateFileName(t);
	let content = generateContent(t.posts);
	// ensure directory exists
	let dir = filename.split('/');
	dir.pop();
	dir = dir.join('/');
	fs.mkdirSync(dir, { recursive:true });
	fs.writeFileSync(filename, content, 'utf-8');
});
console.log('Complete.');

/*
given a thread, determine a strategy for generating a file name. for me, this was
based on the url, minus the host

changed to .inc so Eleventy wouldn't try to process liquid tags
*/
function generateFileName(t) {
	return t.link.replace('http://www.raymondcamden.com/','') + '.inc';
}

/*
Given an array of posts, generate an HTML string. 
*/
function generateContent(posts) {
	let html = '';
	posts.forEach((p,idx) => {
		let parentText = '';
		if(p.parent) { 
			let parentNumber = posts.findIndex(post => post.id == p.parent);
			//console.log('parentNumber', parentNumber);
			/*
			console.log('PARENT', p.parent);
			console.log(JSON.stringify(p, null, '\t'));
			*/
			parentText = `(In reply to <a href="#c_${p.parent}">#${parentNumber+1}</a>) `;
		}
		html += `
<div class="comment" id="c_${p.id}">
	<div>
		<img src="${p.author.avatar.small.permalink}" class="comment_author_profile_pic">
	</div>
	<div>
		<div class="comment_header">
		Comment <a href="#c_${p.id}">${idx+1}</a> ${parentText}by ${p.author.name}
		posted on ${dateFormat(p.createdAt)}
		</div>
		<div class="comment_text">${p.message}</div>
	</div>
</div>
		`;
	});

	return html;
}

function dateFormat(d) {
	d = new Date(d);
	return new Intl.DateTimeFormat().format(d) + ' at ' + new Intl.DateTimeFormat('en-US', {hour:'numeric',minute:'2-digit'}).format(d);
}
```

A few things to note. The function `generateFileName` uses the `link` value from the comment to create a file name based on the URL of the blog post. I originally used a `.html` extension because they're HTML files, but I discovered that some of my comments had code in them that broke Liquid rendering in Eleventy. By simply renaming it I avoided the issue. 

The end result of this was a *bunch* of folders and files that mimicked my blog:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/d2.jpg" alt="Folder/file view of output" class="lazyload imgborder imgcenter">
</p>

The next thing I want to point out is the use of `parentText`. Disqus supports deep comment threading. In order to keep my sanity, I decided I'd simply present them in a single list of comments, but to flag (and link) to parent posts. Let me be clear, this is not the best solution by a long run, but it felt like a reasonable compromise. 

I copied this into my repo inside the `_includes` folder... and surprisingly, this is where things got dicey. You see, I needed to import comments into each blog post but a) the import was dynamic and b) would only be done when the file actually existed, since not every post had comments. 

I was not able to get dynamic includes working so I worked around it a bit. What follows is my solution for Eleventy but you should absolutely take this with a grain of salt. First, the include used for comments itself:

```html
{% raw %}{% capture hasComments %}{% hasAnyComments page.url, oldurl %}{% endcapture %}

{% if hasComments == "true" %}
<div class="comments-area">
	<div class="comments-inner">
	<h3>Archived Comments</h3>
    {% commentInclude page.url, oldurl %}
    </div>
</div>
{% endif %}
{% endraw %}
```

From the top, I use a short code to figure out if a page has comments. I pass two arguments, the URL and OLDURL, which relates to a hack I have for *very* old blog posts on my site. I'd say just ignore that old url thing for now. 

If I have comments, I then use *another* short code to include them. This comes from not being able to do a dynamic include. Here's both short codes from `.eleventy.js` file:

```js
eleventyConfig.addShortcode("hasAnyComments", function(e, old) {
	return getCommentText(e,old) !== '';
});

eleventyConfig.addShortcode("commentInclude", function(e, old) {
	return getCommentText(e,old);
});

//later in the file...

/*
I support hasAnyComments and commentInclude. I take the logic of trying to load
old comment html. I return either the html or a blank string
*/
function getCommentText(path, old) {
    path = './_includes/comments'+path+'.inc';
    let oldpath = '';
    if(old) oldpath = './_includes/comments' + old.replace('http://www.raymondcamden.com','') + '.inc';
    if(fs.existsSync(path)) {
      return fs.readFileSync(path,'utf-8');
    } else if(old && fs.existsSync(oldpath)) {
      return fs.readFileSync(oldpath,'utf-8');
    } else {
      return '';
    }
}
```

It's basically a quick check to see if a file exists and returning it when it does. This could be written probably much better, as always, but it worked. You can see an example on [this post](https://www.raymondcamden.com/2021/01/12/remembering-and-restoring-a-route-with-vue-router).

For source code, you can find the Disqus stuff here: <https://github.com/cfjedimaster/disqus-analytics/tree/master/export_research>. The repo for this site may be found here: <https://github.com/cfjedimaster/raymondcamden2020>

After mentioning what I was doing on Twitter, I got not one but two replies for folks who have done similar things. First is Zach (Eleventy creator) here: [Import Your Disqus Comments To Eleventy](https://www.zachleat.com/web/disqus-import/)/ And here is Nicolas Hoizey here: [Comments history is not lost!](https://nicolas-hoizey.com/articles/2017/07/27/so-long-disqus-hello-webmentions/#comments-history-is-not-lost). Note that Nicolas also talks about adding Webmention. I'll be there soon - got some stuff brewing which explains why I've been a bit quiet here. :)

<span>Photo by <a href="https://unsplash.com/@rhythm596?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Rhythm Goyal</a> on <a href="https://unsplash.com/s/photos/comments?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
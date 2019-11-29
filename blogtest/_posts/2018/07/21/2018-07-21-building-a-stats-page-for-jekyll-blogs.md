---
layout: post
title: "Building a Stats Page for Jekyll Blogs"
date: "2018-07-21"
categories: ["static sites"]
tags: ["vuejs","jekyll"]
banner_image: /images/banners/stats.jpg
permalink: /2018/07/21/building-a-stats-page-for-jekyll-blogs
---

Back when I ran this blog on [Hugo](http://gohugo.io/), I built my own little stats script (<a href="https://www.raymondcamden.com/2016/12/01/a-simple-stats-script-for-hugo">A Simple Stats Script Hugo</a>) to help me look at my blog at a high level. I converted to [Jekyll](https://jekyllrb.com/) a few months ago and recently I started work on rebuilding that support back into my site. What follows is my own little stab at creating a script to report on Jekyll-based blog content. All of the code I'll show below is up on my GitHub repo for this site and I'll share specific links at the end. This is just the beginning and I have some ideas for more stats I'd like to add, but I'd love to hear what you think so drop me a line below.

First and foremost - I decided to did *not* want to use the same approach I had done for my Hugo script. In that one, I used a local Node script to generate a set of JSON data. I then copied that into a simple web app that used JavaScript to render the data. Instead, I wanted something that required zero manual work on my end. To accomplish that - I wrote two scripts.

The first one was a `stats.json` file that would use Liquid (Jekyll's template engine) to output the raw data. The second script was `stats.md`. This would use Vue.js to load in the JSON and then render it out. Let's first take a look at the JSON script.

Before I show the code, let me show the output:

```js
{
	"totalPosts":15,
	"totalCategories": 8,
	"totalTags": 6,
	"totalWords": 13757,
	"averageWordsPerPost": 917,
	"firstPost": {
		"title":"Adding a Recent Content Component to VuePress",
		"published":"2018-05-09",
		"url":"/2018/05/09/adding-a-recent-content-component-to-vuepress"
	},
	"lastPost": {
		"title":"Building a Stats Page for Jekyll Blogs",
		"published":"2018-07-21",
		"url":"/2018/07/21/building-a-stats-page-for-jekyll-blogs"
	},
	"postsPerCategory":[
			{ "name": "static sites", "size":3 }
			,
			{ "name": "misc", "size":1 }
			,
			{ "name": "serverless", "size":2 }
			,
			{ "name": "ColdFusion", "size":1 }
			,
			{ "name": "Uncategorized", "size":1 }
			,
			{ "name": "development", "size":3 }
			,
			{ "name": "javascript", "size":1 }
			,
			{ "name": "Serverless", "size":3 }
	],
	"postsPerTag":[
			{ "name": "vuejs", "size":4 }
			,
			{ "name": "development", "size":3 }
			,
			{ "name": "webtask", "size":2 }
			,
			{ "name": "visual studio code", "size":1 }
			,
			{ "name": "azure", "size":3 }
			,
			{ "name": "jekyll", "size":1 }	
	],

	"dates":"2018-07-21,2018-07-16,2018-07-06,2018-07-02,2018-06-18,2018-06-15,2018-06-13,2018-06-11,2018-06-07,2018-06-04,2018-05-22,2018-05-21,2018-05-16,2018-05-15,2018-05-09"

}
```

While it should be obvious from the names of the values, let me go over the stats:

* Total Posts, total categories, and total tags. Of those three, only total posts is really interesting, but I do think it makes sense to keep track of how many tags and categories you have. Too many may reflect a lack of editorial focus.
* Total words is 100% silly. Average words per post is definitely a bit more relevant.
* First and last post is interesting from a simple historical perspective.
* Posts per category and tags gives you an idea of where you focus your content.
* Finally - the list of dates. So this is where I ran into an issue with Liquid. I wanted to create an "index" that represented posts per year, month, day of week, etc. This turned out to be extraordinarily difficult in Liquid. Then I thought - what if I simply output all the dates and let the client handle it? I was worried about the size of the data but even on my blog with near six thousand entries the JSON only got to about 68K. I do have a lot of whitespace in my JSON (that I removed above) so there is room for improvement, but for now I'm satisfied with it.

Now let's look at the script behind this:

{% raw %}
```js
---
layout: null
---

{% assign totalWords = 0 %}
{% assign dateOb = '' %}

{% for post in site.posts %}
	{% assign postWords = post.content | number_of_words %}
	{% assign totalWords = totalWords | plus:  postWords %}
	{% assign pd = post.date | date: "%Y-%m-%d" %}
	{% unless forloop.first %}
		{% assign dateOb = dateOb | append: "," %}
	{% endunless %}
	{% assign dateOb = dateOb | append: pd %}
{% endfor %}

{% assign avgWords = totalWords | divided_by: site.posts.size %}

{
	"totalPosts":{{ site.posts.size }},
	"totalCategories": {{ site.categories.size }},
	"totalTags": {{ site.tags.size }},
	"totalWords": {{ totalWords }},
	"averageWordsPerPost": {{ avgWords }},
	"firstPost": {
		"title":"{{ site.posts.last.title }}",
		"published":"{{ site.posts.last.date | date: "%Y-%m-%d" }}",
		"url":"{{site.posts.last.url}}"
	},
	"lastPost": {
		"title":"{{ site.posts.first.title }}",
		"published":"{{ site.posts.first.date | date: "%Y-%m-%d" }}",
		"url":"{{site.posts.first.url}}"
	},
	"postsPerCategory":[
		{% for category in site.categories %}
			{% assign cat = category[0] %}
			{% unless forloop.first %},{% endunless %}
			{ "name": "{{cat}}", "size":{{site.categories[cat].size}} }
		{% endfor %}
	],
	"postsPerTag":[
		{% for tag in site.tags %}
			{% assign tagName = tag[0] %}
			{% unless forloop.first %},{% endunless %}
			{ "name": "{{tagName}}", "size":{{site.tags[tagName].size}} }
		{% endfor %}
	],
	"dates":"{{ dateOb }}"

}
```
{% endraw %}

I begin by looping over every single post to gather up my word and data data. Once I have that, the rest of the content is pretty simple to generate. Do note that the `first` and `last` values for `site.posts` is reversed because `site.posts` is in reverse chronological order. (A big thank you to @mmistakes from the <a href="https://talk.jekyllrb.com/t/question-about-site-posts-values/1972/7">Jekyll forum</a>.)

So that's the "back end" - although to be clear - when I publish my site this is run once and output as raw JSON. You can see the output [here](https://www.raymondcamden.com/stats.json). Now for the "front end":

{% raw %}
```html
---
layout: page
title: Stats
---

<style>
[v-cloak] {display: none}
</style>

{% raw %}
<div id="app" v-cloak="">
	<table>
		<tr>
			<td width="30%">Total Posts:</td>
			<td width="70%">{{totalPosts}}</td>
		</tr>
		<tr>
		<td>First Post:</td>
		<td>
		<a :href="firstPost.url">{{firstPost.title}}</a> published {{firstPost.age}} on {{firstPost.date}}
		</td>
		</tr>
		<tr>
		<td>Last Post:</td>
		<td>
		<a :href="lastPost.url">{{lastPost.title}}</a> published {{lastPost.age}} on {{lastPost.date}}
		</td>
		</tr>
		<tr>
		<td>Total Words Written:</td>
		<td>{{totalWords}}</td>
		</tr>
		<tr>
		<td>Average Words per Post:</td>
		<td>{{avgWords}}</td>
		</tr>
	</table>

    <h3>Posts Per Year</h3>
    <table>
        <tr>
            <td>Year</td>
            <td>Number of Posts</td>
        </tr>
        <tr v-for="year in sortedYears">
            <td>{{year}}</td>
            <td>{{years[year]}}</td>
        </tr>
    </table>

    <h3>Posts Per Category</h3>
    <table>
        <tr>
            <td>Category</td>
            <td>Number of Posts</td>
        </tr>
        <tr v-for="cat in sortedCats">
            <td>{{cat.name}}</td>
            <td>{{cat.size}}</td>
        </tr>
    </table>

    <h3>Posts Per Tag</h3>
    <table>
        <tr>
            <td>Tag</td>
            <td>Number of Posts</td>
        </tr>
        <tr v-for="tag in sortedTags">
            <td>{{tag.name}}</td>
            <td>{{tag.size}}</td>
        </tr>
    </table>

</div>
{% endrawx %}

<script src="https://cdn.jsdelivr.net/npm/moment@2.22.2/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script>
new Vue({
	el:'#app',
	data:{
		totalPosts:0,
		firstPost:{
			title:"",
			date:"",
			url:""
		},
		lastPost:{
			title:"",
			date:"",
			url:""
		},
		totalWords:0,
		avgWords:0,
        years:{},
        cats:[], 
        tags:[]
	},
	created:function() {
		fetch('/stats.json')
		.then(res => res.json())
		.then(res => {
			console.log(res);
			this.totalPosts = res.totalPosts;
			
			this.firstPost = {
				title:res.firstPost.title,
				date:res.firstPost.published,
				url:res.firstPost.url,
				age:moment(res.firstPost.published).fromNow()
			};

			this.lastPost = {
				title:res.lastPost.title,
				date:res.lastPost.published,
				url:res.lastPost.url,
				age:moment(res.lastPost.published).fromNow()
			};

			this.totalWords = res.totalWords;
			this.avgWords = res.averageWordsPerPost;

            let dates = res.dates.split(',');
            // process res.dates on the client site
            dates.forEach(d => {
                let year = new Date(d).getFullYear();
                if(!this.years[year]) Vue.set(this.years,year,0);
                Vue.set(this.years,year, this.years[year]+1);
            });

            this.cats = res.postsPerCategory;
            this.tags = res.postsPerTag;

		}).catch(e => {
            console.error(e);
        });
	},
    computed:{
        sortedCats:function() {
            return this.cats.sort((a,b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
        },
        sortedTags:function() {
            return this.tags.sort((a,b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
        },
        sortedYears:function() {
            return Object.keys(this.years).sort();
        }
    }
});
</script>
```
{% endraw %}

(Note - due to an issue of trying to render Liquid stuff to the browser in the source code, I renamed an `endraw` tag above to `endrawx`. It is correct in GitHub.) So this is a pretty trivial Vue app. I fetch my JSON and then just start assigning values. The only real work I do is to parse the dates. Right now I'm just rendering a "per year" stat, but I will probably add a "per month" and "per dow" table as well. You can view the output for my blog's stats here: <https://www.raymondcamden.com/stats>. 

If you want the code yourself, you can grab both scripts here:

* <https://github.com/cfjedimaster/raymondcamden2018/blob/master/stats.json>
* <https://github.com/cfjedimaster/raymondcamden2018/blob/master/stats.md>

So, what do you think? Are there any stats you would add? Leave me a comment below!

<i>Header photo by <a href="https://unsplash.com/photos/1qkyck-UL3g?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">James Pond</a> on Unsplash</i>
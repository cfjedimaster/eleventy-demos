---
layout: post
title: "Some HarpJS experiments involving categories"
date: "2014-01-02T09:01:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/01/02/Some-HarpJS-experiments-involving-categories
guid: 5116
---

<p>
A few weeks ago I <a href="http://www.raymondcamden.com/index.cfm/2013/10/22/Moving-from-dynamic-to-static-with-Harp">blogged</a> about <a href="http://harpjs.com">HarpJS</a>, a static site builder that lets you have the benefits of a dynamic web app during development and the simplicity of a static site for deployment. I've been thinking about Harp, and tools like it, quite a bit since then (see my <a href="http://flippinawesome.org/2013/12/16/moving-to-static-and-keeping-your-toys/">recent article</a> for flippin' awesome) and I decided to try a few things during the break. What follows is a proof of concept, an experiment, please note that there are probably <i>far</i> better ways to do what I did, but on the off chance this may help others, I thought I'd share.
</p>
<!--more-->
<p>
If you know the basics of how HarpJS works (and if you do not, be sure to check their documentation or my article linked to above), then you know that data is stored in a JSON file. This JSON file can create a basic index of data for your site. (It can do a lot more, but let's keep things simple for now.) So a simple blog may have something like this:
</p>

<pre><code class="language-javascript">{
	"art1": {
		"title":"This is a test"
	},
	"art2": {
		"title":"This is a test 2"
	},
	"art3": {
		"title":"This is a test 3"
	},
	"art6": {
		"title":"This is a test 6"
	}
	
}</code></pre>

<p>
This JSON file creates a link between 4 HTML files (or EJS, or Jade, or Markdown) represented by the keys of the data structure. So in my case, Harp would expect to find art1.html, art2.html, etc. (Or art1.ejs, or art1.jade, etc.) The data inside each of these elements is available to the page, and other pages, and can be used dynamically. For example, the home page could list out all blog entries using this:
</p>

<pre><code class="language-markup">for article, slug in public.articles._data
  a(href="/articles/#{% raw %}{ slug }{% endraw %}")
    h2= article.title</code></pre>

<p>
By the way, that example uses Jade, which I absolutely hate, but I was able to quickly copy it from the docs. Ok, so hopefully now you get what's going on here. The thing that I was mulling over was how to handle categories. Again, imagine a basic blog. Your articles typically belong to one or more categories (or tags). While you can simply use these categories in the blog entry render template, you probably also want to provide a way for users to browser content related to that category. So I began by simply adding a category field to my entry data. (For my experiments I used one category only, but obviously you would want to support multiple.)
</p>

<pre><code class="language-javascript">{
	"art1": {
		"title":"This is a test",
		"category":"aaa"
	},
	"art2": {
		"title":"This is a test 2",
		"category":"bbb"
	},
	"art3": {
		"title":"This is a test 3",
		"category":"bbb"
	},
	"art4": {
		"title":"This is a test 4",
		"category":"aaa"
	},
	"art5": {
		"title":"This is a test 5",
		"category":"aaa"
	},
	"art6": {
		"title":"This is a test 6",
		"category":"aaa"
	}
	
}</code></pre>

<p>
In the data above I've got two unique categories, aaa and bbb. If I wanted to build an "aaa" and "bbb" category page, one simple way would be to just create new directories with their own JSON files and duplicate the data. That would work, but the duplication bugged me. If I ever edited a title or decided to remove a category from a blog entry, I'd have to remember to update the corresponding JSON file. That's not a lot of work of course, but it is an opportunity to screw up. I'm <i>really</i> good at screwing up so I try to avoid these opportunities when I can.
</p>

<p>
For my first experiment, I thought I'd build a page that listed out my categories and the corresponding entries related to those categories. HarpJS supports EJS and Jade, but I greatly prefer EJS as it lets me build more complex templating. I built the following file, called categories.ejs, and stored it in the root of my HarpJS application.
</p>

<pre><code class="language-markup">
&lt;%
	function catList(data) { 
		var cats = {};
		for(var key in data) {
			var category = data[key].category;
			if(!(category in cats)) {
				cats[category] = [];	
			}
			cats[category].push(data[key]);
			&#x2F;&#x2F;copy the key itself as a slug
			cats[category][cats[category].length-1][&quot;slug&quot;] = key;
		}
		&#x2F;&#x2F;you could alpha sort the cats
		return cats;
	} 
%&gt;

&lt;h2&gt;Categories&lt;&#x2F;h2&gt;

&lt;ul&gt;
&lt;% 
	catData = catList(public.entries._data);
	for(cat in catData) { 
%&gt;
	&lt;li&gt;
		&lt;b&gt;&lt;{% raw %}%- cat %{% endraw %}&gt;&lt;&#x2F;b&gt;
		&lt;ul&gt;
			&lt;{% raw %}% for(entry in catData[cat]) { %{% endraw %}&gt;
				&lt;li&gt;&lt;a href=&quot;&#x2F;entries&#x2F;&lt;{% raw %}%- catData[cat][entry].slug %{% endraw %}&gt;&quot;&gt;&lt;{% raw %}%- catData[cat][entry].title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
			&lt;{% raw %}% }{% endraw %} %&gt;
			
		&lt;&#x2F;ul&gt;
	&lt;&#x2F;li&gt;
	
&lt;{% raw %}% }{% endraw %} %&gt;
&lt;&#x2F;ul&gt;</code></pre>

<p>
Yes, this is a bit messy, it reminds me of Classic ASP, but you get the basic idea. HarpJS provides access to my data via a documented scope (public), and with that data I can use JavaScript to manipulate it. In my case, I simply create a list of data based on the category field. Once I've got that, I can then render it out below. Here is the result:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_2_14__8_28_AM.png" />
</p>

<p>
Slick, right? While that works, what I really want is a specific page for my categories. Now, from what I know, I can't use HarpJS to dynamically generate files based on data in my JSON files. So I did have to create physical files, but in theory, you rarely change your categories, and once you see my solution, you will see it shouldn't be that big of a deal. I created a folder called categories, and then two blank files, aaa.ejs and bbb.ejs.
</p>

<p>
One of the cool features of HarpJS is support for <a href="http://harpjs.com/docs/development/partial">partials</a>. This allows you to create code that can be dynamically inserted into other templates. Based on that, I created a new file called _categorylist.ejs. Here is what it does:
</p>

<pre><code class="language-markup">&lt;%
	&#x2F;&#x2F;what category are we?
	var thisCat = current.source;

	&#x2F;&#x2F;Loop through entries and get matches
	var matches = [];

	for(var key in public.entries._data) {
		var entry = public.entries._data[key];
		if(entry.category == thisCat) {
			matches.push(entry);
			&#x2F;&#x2F;copy slug too
			matches[matches.length-1].slug = key;
		}
	}
	
%&gt;

&lt;h2&gt;Category &lt;{% raw %}%- thisCat %{% endraw %}&gt;&lt;&#x2F;h2&gt;
&lt;ul&gt;
	&lt;{% raw %}% for(var i=0; i&lt;matches.length; i++) { %{% endraw %}&gt;
		&lt;li&gt;&lt;a href=&quot;&#x2F;entries&#x2F;&lt;{% raw %}%- matches[i].slug %{% endraw %}&gt;&quot;&gt;&lt;{% raw %}%- matches[i].title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
	&lt;{% raw %}% }{% endraw %} %&gt;
&lt;&#x2F;ul&gt;</code></pre>

<p>
Probably the only thing here that needs explanation is current.source. HarpJS passes information about the current request into your code so you can do - well - whatever you want with it. (See the docs for current <a href="http://harpjs.com/docs/development/current">here</a>.) In my case, I use it to determine what category is being loaded and filter the display based on that. So going back to my category files, aaa.ejs and bbb.ejs then only need one block of code:
</p>

<pre><code class="language-markup">&lt;{% raw %}%- partial(&quot;_categorylist&quot;) %{% endraw %}&gt;</code></pre>

<p>
Now, in theory, I can write new blog entries, assign them a category, and they will show up automatically in the appropriate category file. As I said, if I do add a new category (or delete one), I'd then need to remove the file as well. 
</p>

<p>
Of course, the end result of all this code is just plain HTML. You can see the rendered result here: <a href="http://www.raymondcamden.com/demos/2014/jan/2/">http://www.raymondcamden.com/demos/2014/jan/2/</a>. I created a zip of the entire project (original EJS files and rendered output) as well. 
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fharpcattest%{% endraw %}2Ezip'>Download attached file.</a></p>
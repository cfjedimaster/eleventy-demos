---
layout: post
title: "Using friendlier URLs for a HarpJS Static Site"
date: "2015-07-08T09:38:45+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2015/07/08/using-friendlier-urls-for-a-harpjs-static-site
guid: 6364
---

Ok, "friendly" is in the eye of the beholder, but honestly, I spent about five minutes trying to think of the "best" title for this post and just gave up. What I'm really trying to describe here is how to use "year/month/date/slug" type URLs for a <a href="http://www.harpjs.com">HarpJS</a> static site. As an example, the URL for this blog entry includes the year, month, day, and a 'slug' or "URL-friendly" version of the title. In general, Harp doesn't care what folder structure you use, but the issue I ran into was how to handle metadata about the blog. So for example, how do you generate a list on the home page of the most recent articles and create an RSS feed?

<!--more-->

By default, HarpJS asks you to place a _data.json file in your folder to associate metadata with content. That works fine if you have one folder for your entries, but for my demo, I've got a bunch of folders. One for the year, one for the month, one for the day, and finally, one for the article. Heres an example of just how deep/complex this can get:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot12.png" alt="shot1" width="574" height="650" class="alignnone size-full wp-image-6365" />

You could, if you wanted, create a _data.json file in every single folder. That wouldn't be horrible per se, but if you ever change the structure of your metadata, to add categories for example, you would need to update a butt-load of files. So I wanted to figure out another solution that would make handling the metadata easier. I also wanted a solution that emphasized ease of content creation. I didn't necessarily mind if the core solution itself was complex, but the actual act of writing a blog entry should require minimal work/direction/etc in order to publish. Here is what I came up with.

First, I created a _data.json file for the root of my site. Within it, I create a key called "articles". Within it, I'm going to list my articles. The idea is to be similar to the default metadata examples Harp provide, but using an array instead of an object. Here is a sample, with some of the data removed to make it shorter:

<pre><code class="language-javascript">{
	"articles":[
		{
			"title":"Why I like goo",
			"posted":"2014-07-11 10:30 AM",
			"path":"2014/07/11/an-article-about-goo"
		},
		{
			"title":"Foo is dead",
			"posted":"2015-03-20 9:59 PM",
			"path":"2015/03/20/an-article-about-foo"
		},
		{
			"title":"An article about Foo!",
			"posted":"2014-07-02 9:49 AM",
			"path":"2014/07/02/an-article-about-foo"
		}

	]
}</code></pre>

Each article instance contains a title, a posted value, and a path. Why the path? One of the things Harp provides when using _data.json is an automatic "sync" between your current URL and metadata. In order words, if you are at url /article/foo.html and you had a "foo" key in the article folder's metadata, Harp will copy that data to the global scope automatically. As a practical example of that, you can use "title" in your layout and have it default to a global value but then automatically switch to the article's title when viewing that page.

That behavior is nice, but we won't have it because we're skipping the "put a data file in every folder" thing. I'm ok with that. The article writing process now is:

<ol>
<li>Make your folder:
<ul>
<li>year, if the first entry of the year</li>
<li>month, if the first entry of the month</li>
<li>day, if the first entry of the day</li>
<li>"slug" - friendly version of the title</li>
</ul></li>
<li>Write your blog article.</li>
<li>Add to the list of articles in the root _data.json file.</li>
</ol>

Everything outside of step 2 there is "process crap" that I want to minimize, and I think that's pretty good. 

So how about working with the data? How do we create a list of articles on the home page? I began by creating a file called _article_parser.ejs. The idea behind this file was to do various "parsing" things for my article data so I had easier access to them in my templates. (As a reminder, files that begin with _ in Harp are automatically ignored when generating the static version.) Let's take a look at the code and then I'll explain what it does.

<pre><code class="language-javascript">&lt;%
var articlesRaw = public._data.articles;

//This create a variable templates can use to iterate over articles
articles = articlesRaw.sort(function(a, b) {
	var aDate = new Date(a.posted);
	var bDate = new Date(b.posted);
	return aDate &lt; bDate;
});

//This sniffs to see if we are on an article, and if so, overwrites globals
pageTitle = title;
isArticle = false;
if(current.path.length === 5) {
	isArticle = true;
	//http://davidwalsh.name/javascript-clone-array
	var path = current.path.slice(0);
	path.pop();		
	var testPath = path.join(&quot;/&quot;);
	for(var i=0;i&lt;articles.length;i++) {
		if(articles[i].path === testPath) {
			pageTitle = articles[i].title;
		}
	}
}

%&gt;</code></pre>

There's two main blocks here. The first grabs the article array and performs a sort on it. I wanted to ensure that when the author entered data, they didn't have to worry about putting things in a particular order. Most likely they will always just add to the end or the bottom, but this code ensures I don't have to worry about it. Note the use of var for articlesRaw versus articles. Var scoping articlesRaw keeps it to this file, while not scoping articles means I can use it outside in my template.

The next block is a bit weird. As I mentioned, when we don't have a "url to path" match in data files, we don't have an easy way of having global variables, like title, automatically switch when viewing a particular file. The second code block handles this by looking at the current scope. The <a href="http://harpjs.com/docs/development/current">current scope</a> provides information about where you are in the site. I simply assume that if we're at a place with 5 levels, we're viewing a blog entry. I could make this a bit tighter. For example, I could look at the first part of the path and see if it is all numeric and 4 characters, but that wasn't necessary now so I kept it simple. I compare the path from the current data to the path in my JSON file and if there is a match, I have new title to use. 

So, how do we use this? Check out my home page:

<pre><code class="language-markup">&lt;h1&gt;Welcome to the Blog&lt;/h1&gt;


&lt;{% raw %}%- partial(&quot;_article_parser&quot;) %{% endraw %}&gt;

&lt;h3&gt;Articles&lt;/h3&gt;
&lt;ul&gt;
&lt;% 
for(var i=0;i&lt;Math.min(5, articles.length);i++) { 
	article = articles[i];
%&gt;

	&lt;li&gt;&lt;a href=&quot;&lt;{% raw %}%= article.path %{% endraw %}&gt;&quot;&gt;&lt;{% raw %}%= article.title %{% endraw %}&gt;&lt;/a&gt; - posted &lt;{% raw %}%= article.posted %{% endraw %}&gt;&lt;/li&gt;

&lt;{% raw %}% }{% endraw %} %&gt;
&lt;/ul&gt;</code></pre>

For the most part, this is pretty similar to other Harp demos. The only difference is that I loaded up my article "library" and it provided a variable, articles, that I could use. In my case I'm just showing the 5 most recent articles.

That's done - but there's one more part to this I think is kind of cool. I wanted a custom layout for blog entries, and HarpJS, using EJS, doesn't support nested layouts. If you remember, my article parser created a flag that represented the user being on an article. I'm able to use that within my layout template. Let's check it out:

<pre><code class="language-markup">&lt;{% raw %}% partial(&quot;_article_parser&quot;) %{% endraw %}&gt;
  
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;&lt;{% raw %}%= pageTitle %{% endraw %}&gt;&lt;/title&gt;
  &lt;link rel=&quot;stylesheet&quot; href=&quot;/main.css&quot;&gt;
&lt;/head&gt;

&lt;body&gt;

  &lt;{% raw %}% if(isArticle) { %{% endraw %}&gt;
     &lt;{% raw %}%- partial(&quot;_article_layout&quot;) %{% endraw %}&gt;
  &lt;{% raw %}% }{% endraw %} else {% raw %}{ %{% endraw %}&gt;
    &lt;{% raw %}%- yield %{% endraw %}&gt;
  &lt;{% raw %}% }{% endraw %} %&gt;
    
  &lt;footer&gt;&lt;p&gt;Copyright &amp;copy; &lt;{% raw %}%= new Date().getFullYear() %{% endraw %}&gt; ~ &lt;a href=&quot;/&quot;&gt;Home&lt;/a&gt;&lt;/p&gt;&lt;/footer&gt;  

&lt;/body&gt;
&lt;/html&gt;</code></pre>

So - as before - load in the parser. I then check for isArticle and if it is true, load in another layout file. Let's look at that.

<pre><code class="language-markup">&lt;h1&gt;&lt;{% raw %}%- pageTitle %{% endraw %}&gt;&lt;/h1&gt;

&lt;{% raw %}%- yield %{% endraw %}&gt;</code></pre>

Yeah, there isn't much there, but you get the idea. I can now create a unique layout for my blog entries all from one file, which I like. 

So, that's it. There's a bit missing here - for example - how to handle archives. I'm not really a big fan of them as I don't personally find myself using them on sites, but I may come back to this demo tomorrow and address that. (I've got some ideas already.) Want to see all the code? It's up on GitHub here: <a href="https://github.com/cfjedimaster/Static-Site-Examples/tree/master/yearmonthday">https://github.com/cfjedimaster/Static-Site-Examples/tree/master/yearmonthday</a> And for the hell of it, I surged up the output so you can run it in your browser. Warning - it isn't pretty: <a href="http://opposite-fly.surge.sh/">http://opposite-fly.surge.sh/</a>.
---
layout: post
title: "Creating a JSON Feed for Hugo"
date: "2017-05-18T11:32:00-07:00"
categories: [static sites]
tags: [hugo]
banner_image: 
permalink: /2017/05/18/creating-a-json-feed-for-hugo
---

*Edit on 3/26/2018 to fix tags, thanks to commenter Carl* Recently a new specification was launched to recreate RSS in JSON, [JSON Feed](https://jsonfeed.org). For folks who may not be aware, RSS is an XML spec (well, multiple ones) for sharing content between sites. Blogs, primarily, and content-heavy sites typically make use of this. I'm not sure how many people outside of developers actually *use* RSS, but it's still definitely a "thing" even if you don't necessarily think of it when thinking about APIs.

The idea behind JSON Feed is to simply recreate the same, or similar, functionality in JSON as opposed to XML. You can read more about the launch on their [announcement post](https://jsonfeed.org/2017/05/17/announcing_json_feed) and read the full [spec](https://jsonfeed.org/version/1) as well. (And actually, this is one of the better written specs I've seen. You won't need a PhD in CompSci to grok it.)

I thought it might be fun to build a JSON feed for my Hugo site. I ran into some trouble getting the JSON output working right and want to thank @bep for [helping me out](https://discuss.gohugo.io/t/output-formats-any-help-yet/6611/9) on the forums. I based my solution on a new Hugo feature, [Output Formats](http://gohugo.io/extras/output-formats/), but obviously I may have done this in a completely stupid manner as well. As always, I encourage folks to leave me a comment and let me know what could be improved.

ALright, so to begin, I created a file in `/content` called `jsonfeed.md`. This file is empty and just serves as a way to tell Hugo where to create the feed.

<pre><code class="language-javascript">{
	"outputs":["json"],
	"layout":"feed"
}

</code></pre>

Note that I'm specifying json as my output and I'm saying my layout will be the feed template. That's where the real work takes place:

<pre><code class="language-javascript">{
    "version": "https://jsonfeed.org/version/1",
    "title": "{% raw %}{{ .Site.Title }}{% endraw %}",
    "home_page_url": "{% raw %}{{ .Site.BaseURL }}{% endraw %}",
    "feed_url": "{% raw %}{{ .Permalink}}{% endraw %}",
	{% raw %}{{ if isset .Site.Params "description" }}{% endraw %}
	"description": "{% raw %}{{ .Site.Params.description }}{% endraw %}",
	{% raw %}{{ end }}{% endraw %}
	{% raw %}{{ if isset .Site.Params "author" }}{% endraw %}
	"author": {% raw %}{ "name": "{{ .Site.Params.author }}{% endraw %}" },
	{% raw %}{{ end }}{% endraw %}
    "items": [
    {% raw %}{{ range $i, $e := first 10 .Site.Pages }}{% endraw %}
		{% raw %}{{ if $i }}{% endraw %}, {% raw %}{{ end }}{% endraw %}
			{
				"id": "{% raw %}{{ .Permalink }}{% endraw %}",
				"title": "{% raw %}{{ .Title }}{% endraw %}",
				"content_text": {% raw %}{{ .Summary | jsonify }}{% endraw %},
				"url": "{% raw %}{{ .Permalink }}{% endraw %}",
				"date_published": "{% raw %}{{ .Date }}{% endraw %}",
				"tags": ["{% raw %}{{ delimit .Params.tags "," }}{% endraw %}"]
			}
		{% raw %}{{ end }}{% endraw %}
    ]
}
</code></pre>

Most of this should make sense I think - but let me call out some particular aspects. First, I've made description and author both optional based on whether or not the user has this in their Hugo settings.

In the range call, I had to use slightly weird syntax to support "include a comma except for the last iteration." This syntax makes zero sense to me, but I copied it from another support post by @bep located [here](https://discuss.gohugo.io/t/conditional-behavior-in-template-if-last-array-item-was-found/1270). Even though the internal `if` with the comma is at the top, it renders at the bottom. Yeah, ok. 

As for each item, for the most part it just plain works as shown. Hugo summaries are plain text only so I used `content_text` instead of `content_html`. I run it through a pipe to make it safe for JSON. For tags, I was a bit torn. Hugo supports both categories and tags, and in theory you could use both I guess. Or just categories. I used tags just to keep it simple, but that's definitely something you would want to look into for your own Hugo site.

Finally, the date one rendered a bit weird on my blog. Let's look at the output to see the full response (I removed a bunch of items to make it shorter):

<pre><code class="language-javascript">{
    "version": "https://jsonfeed.org/version/1",
    "title": "Raymond Camden",
    "home_page_url": "http://localhost:1313/",
    "feed_url": "http://localhost:1313/jsonfeed/index.json",
	"author": {% raw %}{ "name": "Raymond Camden" }{% endraw %},
	
    "items": [
		
			{
				"id": "http://localhost:1313/2017/05/18/creating-a-json-feed-for-hugo/",
				"title": "Creating a JSON Feed for Hugo",
				"content_text": "Recently a new specification was launched to recreate RSS in JSON, JSON Feed. For folks who may not be aware, RSS is an XML spec (well, multiple ones) for sharing content between sites. Blogs, primarily, and content-heavy sites typically make use of this. I\u0026rsquo;m not sure how many people outside of developers actually use RSS, but it\u0026rsquo;s still definitely a \u0026ldquo;thing\u0026rdquo; even if you don\u0026rsquo;t necessarily think of it when thinking about APIs.",
				"url": "http://localhost:1313/2017/05/18/creating-a-json-feed-for-hugo/",
				"date_published": "2017-05-18 11:32:00 -0700 -0700",
				"tags": ["hugo"]
			}
		
		, 
			{
				"id": "http://localhost:1313/2017/05/15/my-own-openwhisk-stat-tool/",
				"title": "My Own OpenWhisk Stat Tool",
				"content_text": "While waiting at the airport this past weekend, I worked on a little utility to help me retrieve information about my OpenWhisk actions. As you know (hopefully know!), Bluemix provides a \u0026ldquo;stats\u0026rdquo; page for your OpenWhisk stuff but it is a bit limited in terms of how far it goes back and doesn\u0026rsquo;t yet provide good aggregate data about your action. So for example, I really wanted to see how well my action was responding in a simple tabular fashion.",
				"url": "http://localhost:1313/2017/05/15/my-own-openwhisk-stat-tool/",
				"date_published": "2017-05-15 09:22:00 -0700 -0700",
				"tags": ["openwhisk"]
			}
		
		, 
		
			{
				"id": "http://localhost:1313/2017/04/28/bound-packages-openwhisk-and-web-actions/",
				"title": "Bound Packages, OpenWhisk, and Web Actions",
				"content_text": "Hey folks, this is just a warning to other users in case they run into the same issue I did. As you (may) know, OpenWhisk supports the idea of packages. Packages let you organize actions into a cohesive unit, much like packages in other languages/platforms. Packages can also have default parameters that apply to every action in the package.\nPackages can also be shared, which makes them callable by other users.",
				"url": "http://localhost:1313/2017/04/28/bound-packages-openwhisk-and-web-actions/",
				"date_published": "2017-04-28 09:08:00 -0700 -0700",
				"tags": ["openwhisk"]
			}
		
    ]
}
</code></pre>

Notice the double `-0700 -0700`? I'm pretty sure that's just an issue on my blog due to how I specify dates in my posts. I probably did it wrong, but with near 6000 posts, I'm not changing it. For my fix, I switched up the above code to:

<pre><code class="language-javascript">"date_published": "{% raw %}{{ replace .Date "-0700 -0700" "-0700"}}{% endraw %}",
</code></pre>

And that's it. As I said, there's probably a better way of doing this, and I honestly don't know if anyone is going to even make use of JSON Feed, but if folks want mine, they can find it at https://www.raymondcamden.com/jsonfeed/index.json
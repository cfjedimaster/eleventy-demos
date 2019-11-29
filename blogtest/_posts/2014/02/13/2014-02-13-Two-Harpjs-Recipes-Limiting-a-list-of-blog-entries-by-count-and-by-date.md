---
layout: post
title: "Two Harp.js Recipes: Limiting a list of blog entries by count and by date"
date: "2014-02-13T15:02:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2014/02/13/Two-Harpjs-Recipes-Limiting-a-list-of-blog-entries-by-count-and-by-date
guid: 5151
---

<p>
Here are two simple recipes for a <a href="http://harpjs.com">Harp.js</a> blog. Both are built using EJS but could be ported to Jade pretty easily. As I hate Jade I will not be the person doing it. ;) First, let's look at the sample data - a set of blog entries defined in _data.json.
</p>
<!--more-->
<p>

<pre><code class="language-javascript">{
	"aaa": {
		"title":"All about AAA",
		"published":"February 13, 2014"
	}, 
	"bbb": {
		"title":"Something else",
		"published":"February 12, 2014"
	},
	"bbb2": {
		"title":"Something else 2",
		"published":"February 10, 2014"
	},
	"bbb3": {
		"title":"Something else 3",
		"published":"January 12, 2014"
	},
	"bbb4": {
		"title":"Something else 4",
		"published":"January 11, 2014"
	},
	"bbb5": {
		"title":"Something else 5",
		"published":"January 11, 2014"
	},
	"bbb6": {
		"title":"Something else 6",
		"published":"January 10, 2014"
	},
	"bbb7": {
		"title":"Something else 7",
		"published":"January 9, 2014"
	},
	"bbb8": {
		"title":"Something else 8",
		"published":"January 8, 2014"
	},
	"bbb9": {
		"title":"Something else 9",
		"published":"January 7, 2014"
	},
	"bbb10": {
		"title":"Something else 10",
		"published":"January 6, 2014"
	},
	"bbb11": {
		"title":"Something else 11",
		"published":"January 4, 2014"
	}
}</code></pre>

<p>
So yeah, not the most imaginative titles, but you get the idea. So first, let's look at just printing everything:
</p>

<pre><code class="language-markup">&lt;h2&gt;All&lt;&#x2F;h2&gt;

&lt;ol&gt;
&lt;{% raw %}% for(article in public.articles._data) { %{% endraw %}&gt;
	&lt;li&gt;&lt;a href=&quot;&#x2F;articles&#x2F;&lt;{% raw %}%- article %{% endraw %}&gt;.html&quot;&gt;&lt;{% raw %}%- public.articles._data[article].title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
&lt;{% raw %}% }{% endraw %} %&gt;
&lt;&#x2F;ol&gt;
</code></pre>

<p>
Which gives us:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot16.png" />
</p>

<p>
Now let's consider an example that limits the display to 10 entries. All I did was switch to a for loop that iterates from 1 to 10 (or the number of entries if it is less than 10):
</p>

<pre><code class="language-markup">&lt;h2&gt;Last 10&lt;&#x2F;h2&gt;

&lt;ol&gt;
&lt;% 
	var keys = Object.keys(public.articles._data);
	for(var i=0; i&lt;Math.min(10,keys.length); i++) {
%&gt;
	&lt;li&gt;&lt;a href=&quot;&#x2F;articles&#x2F;&lt;{% raw %}%- keys[i] %{% endraw %}&gt;.html&quot;&gt;&lt;{% raw %}%- public.articles._data[keys[i]].title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
&lt;{% raw %}% }{% endraw %} %&gt;
&lt;&#x2F;ol&gt;
</code></pre>

<p>
Which gives us:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot26.png" />
</p>

<p>
I should note that I am not <strong>convinced</strong> this strategy will always work since I don't believe the order is guaranteed to be in a particular order. Also, it assumes you enter your posts in a particular order. Keep that in mind. Now let's look at how to filter by "current" posts. In this case, items in the last 7 days.
</p>

<pre><code class="language-markup">&lt;h2&gt;Last Week&lt;&#x2F;h2&gt;

&lt;% 
	&#x2F;&#x2F;credit: http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;7763364&#x2F;52160
	function daysDifferent(d1,d2) {
		var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)&#x2F;(24*3600*1000));
	}

	var now = new Date();
							 
	for(article in public.articles._data) {
		var articleOb = public.articles._data[article];
		var d = new Date(articleOb.published);
		if(daysDifferent(d, now) &lt;= 7) {
%&gt;
	&lt;li&gt;&lt;a href=&quot;&#x2F;articles&#x2F;&lt;{% raw %}%- article %{% endraw %}&gt;.html&quot;&gt;&lt;{% raw %}%- articleOb.title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
&lt;% 
		}
	} 
%&gt;
</code></pre>

<p>
All I've done here is use a simple function (stolen, I mean borrowed, from StackOverflow) to get the date difference between two dates. I compare when the blog entry was written to the current date and display it if the value is less than or equal to 7. And this returns:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot34.png" />
</p>

<p>
Of course, this solution has an interesting side effect - it won't work if you output Harp to a static site. You <i>could</i> create a build process that runs this daily and saves the output to your server. I'd imagine that if you have even a semi-active blog (a few entries per week) then it would be less of an issue, especially if you don't say in the HTML what "Current" means. So for example, if my list in the screen shot above ends up getting a bit stale because I haven't blogged a bit, it is still not <i>terribly</i> old. 
</p>
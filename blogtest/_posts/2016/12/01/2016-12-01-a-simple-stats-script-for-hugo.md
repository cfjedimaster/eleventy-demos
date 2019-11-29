---
layout: post
title: "A Simple Stats Script for Hugo"
date: "2016-12-01T06:30:00-07:00"
categories: [development]
tags: [nodejs]
banner_image: 
permalink: /2016/12/01/a-simple-stats-script-for-hugo
---

I'm somewhat obsessed with stats, and one of the things I look at is my rate of publishing overtime. I've run this blog since 2003 and have gone from blogging 30+ times a month to - well - somewhat less than that. Quality is - of course - far more important than quantity. But as a general stat, I just like to know how much I'm writing.

My static site generator of choice, [Hugo](http://gohugo.io/), doesn't have anything built in to support getting this. You can get post counts and stuff like, but I wanted something a bit deeper, and something more focused on the amount of content published over time. So with that in mind, I wrote the following script. If your Hugo site follows the same convention as mine (year/month/day folders), then in theory, it should just work for you.

<pre><code class="language-javascript">
&#x2F;*
Step one - read all the md files in content&#x2F;post
We assume yyyy&#x2F;mmmm&#x2F;dd
*&#x2F;

var fs = require(&#x27;fs&#x27;);
var path = &#x27;.&#x2F;content&#x2F;post&#x2F;&#x27;;
console.log(&#x27;Scan &#x27;+path);

var data = {
	years:{},
	months:[],
	posts:0,
	categories:{},
	tags:{},
	wordCount:0
};

years = fs.readdirSync(path);
years.forEach((year) =&gt; {
	&#x2F;&#x2F;console.log(&#x27;working on &#x27;+year);
	data.years[year] = 0;
	months = fs.readdirSync(path+year);
	months.forEach((month) =&gt; {
		let bareMonth = Number(month)-1;
		if(!data.months[bareMonth]) data.months[bareMonth] = 0;

		&#x2F;&#x2F;console.log(&#x27;working on &#x27;+month);
		days = fs.readdirSync(path+year+&#x27;&#x2F;&#x27;+month);
		days.forEach((day) =&gt; {
			posts = fs.readdirSync(path+year+&#x27;&#x2F;&#x27;+month+&#x27;&#x2F;&#x27;+day);
			data.posts += posts.length;
			data.years[year] += posts.length;
			data.months[bareMonth] += posts.length;
			posts.forEach((file) =&gt; {
				let content = fs.readFileSync(path+year+&#x27;&#x2F;&#x27;+month+&#x27;&#x2F;&#x27;+day+&#x27;&#x2F;&#x27;+file,&quot;utf8&quot;);
				&#x2F;&#x2F; get the front matter
				let closingBracket = content.indexOf(&quot;}&quot;, 1);
				let fm = content.substring(0, closingBracket+1);
				let rest = content.replace(fm, &#x27;&#x27;);

				let fmData = JSON.parse(fm);
				if(fmData.categories) {
					fmData.categories.forEach((cat) =&gt; {
						if(!data.categories[cat]) data.categories[cat] = 0;
						data.categories[cat]++;
					});
				}
				if(fmData.tags) {
					fmData.tags.forEach((tag) =&gt; {
						if(!data.tags[tag]) data.tags[tag] = 0;
						data.tags[tag]++;
					});
				}

				data.wordCount += rest.split(&#x27; &#x27;).length;
			});
		});
	});

});

data.avgWordCount = data.wordCount &#x2F; data.posts;

console.log(data);
</code></pre>

Basically I just iterate over every year, month, and day, and then open up each file. Hugo stores metadata, or "front matter", on top of each blog post in a JSON string. I can read that, parse it, and then figure out what categories and tags are being used. I can then strip that out and get a basic word count too. 

The end result is just an object containing the number of posts per year, month, tag, and category. I also store the total word count (why not?) and an average.

As a reminder, you should typically avoid using sync functions in Node, but as this was a simple script just for me, I went for simplicity and I'm ok with that.

Then - for the heck of it - I whipped up a simple [stats](https://www.raymondcamden.com/stats) page to render the data. You can just click that link, but here are the four reports. For the first two, I literally copied and pasted the [quick start](https://developers.google.com/chart/interactive/docs/quick_start) code from Google's Charting library and modified it slightly.

![By Year](https://static.raymondcamden.com/images/2016/12/hugos1.PNG )

![By Month](https://static.raymondcamden.com/images/2016/12/hugos2.PNG )

Here's the top portion of my categories and tags stats:

![Categories](https://static.raymondcamden.com/images/2016/12/hugos3.PNG )
![Tags](https://static.raymondcamden.com/images/2016/12/hugos4.PNG )

And finally - a few generic stats:

![Generic](https://static.raymondcamden.com/images/2016/12/hugos5.PNG )

The only real interesting part of this page is how I'm handling number formatting - I'm using Intl - a kick ass built in standard for internationalization for the web. Here's how I make it fail gracefully:

<pre><code class="language-javascript">
var formatter;
if(window.Intl) {
	formatter = new Intl.NumberFormat();
} else {
	formatter = {
		format:function(x) {% raw %}{ return x; }{% endraw %}
	};
}
</code></pre>

I can then just do <code>formatter.format(x)</code> to get my nicely formatted numbers.

Anyway - is this useful to folks using Hugo? Any suggestions?
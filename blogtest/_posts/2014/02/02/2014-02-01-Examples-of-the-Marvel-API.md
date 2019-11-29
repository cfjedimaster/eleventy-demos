---
layout: post
title: "Examples of the Marvel API"
date: "2014-02-02T11:02:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/02/02/Examples-of-the-Marvel-API
guid: 5143
---

<p>
A few days ago, the greatest API in the entire Internet was released - the <a href="http://developer.marvel.com/">Marvel API</a>. Ok, maybe greatest is a strong word, but I love APIs, I love comics, and the combination of the two is nothing less than Galactus-level news. (And by Galactus I mean the giant purple guy, not the amorphous giant cloud from the forgettable Fantastic Four movie.) 
</p>
<!--more-->
<p>
The API supports getting data on characters, comics, creators, events, stories, series, and stories. You can try out their <a href="http://developer.marvel.com/docs">interactive docs</a> for details. You will want to sign up for a <a href="http://developer.marvel.com/account">key</a> first though so you can actually see results. The docs are well done, but currently have a silly CSS bug that prevents you from copying text from them. (You can correct this via DevTools - if you don't know how to do that just leave me a comment in the docs.) The API doesn't support text-based searches yet, so if you wanted to find all the "Spider" characters you're out of luck. (But this has been requested as well.) 
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-02-02 at 10.43.39.png" />
</p>

<p>
Outside of that the API is pretty powerful with a lot of options. You can use the API in both client-side and server-side applications with a very simple GET request. The API does have a pretty low limit (imo) of 1000 calls per day. Multiple people have asked for a higher limit and the Marvel folks have said they would consider it. They wanted to launch with a lower limit just to be careful and I can understand that. Another oddity is that they don't have a proper forum for API discussions yet. Instead they have <a href="http://developer.marvel.com/community">one page</a> with comments. That's not going to scale well. I hope they change to something else rather soon as it is already getting a bit messy. (Heck, even a simple Google Group would be cool.) 
</p>

<p>
I worked on a simple demo using the <a href="http://developer.marvel.com/docs#!/public/getComicsCollection_get_5">Comics API</a>. The API lets you fetch comic data and apply multiple different filters. So you can ask for collections versus single comics - request comics at a certain date - or even look for a particular character. The result data for an individual comic is <i>very</i> detailed.
</p>

<p>
For my first demo I thought it would be interesting to do a date comparison. I wrote a demo that would fetch 100 comics for a year and figure out the average price and page count, and display 5 random images. I was curious to see how prices and sizes had changed over the years. Let's look at the code. First, my HTML.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;1&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;handlebars-v1.3.0.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;link rel=&quot;stylesheet&quot; href=&quot;style.css&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;div id=&quot;results&quot;&gt;&lt;&#x2F;div&gt;
	&lt;div id=&quot;status&quot;&gt;&lt;&#x2F;div&gt;

	&lt;script id=&quot;reportTemplate&quot; type=&quot;text&#x2F;x-handlebars-template&quot;&gt;
		&lt;h1&gt;{% raw %}{{year}}{% endraw %}&lt;&#x2F;h1&gt;
		&lt;p&gt;
		Average Price: ${% raw %}{{avgPrice}}{% endraw %}&lt;br&#x2F;&gt;
		Low&#x2F;High Price: ${% raw %}{{minPrice}}{% endraw %} &#x2F; ${% raw %}{{maxPrice}}{% endraw %}&lt;br&#x2F;&gt;
		Average Page Count: {% raw %}{{avgPageCount}}{% endraw %}&lt;br&#x2F;&gt;
		&lt;&#x2F;p&gt;
		{% raw %}{{#each thumbs}}{% endraw %}
		&lt;img src=&quot;{% raw %}{{this}}{% endraw %}&quot; class=&quot;thumb&quot;&gt;
		{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;br clear=&quot;left&quot;&gt;
		&lt;p&#x2F;&gt;
	&lt;&#x2F;script&gt;
	&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;

	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
There isn't much here but a Handlebars template to handle the results. Let's look at the JavaScript now.
</p>

<pre><code class="language-javascript">&#x2F;* global $,console,document,Handlebars *&#x2F;

&#x2F;&#x2F;default not avail image
var IMAGE_NOT_AVAIL = &quot;http:&#x2F;&#x2F;i.annihil.us&#x2F;u&#x2F;prod&#x2F;marvel&#x2F;i&#x2F;mg&#x2F;b&#x2F;40&#x2F;image_not_available&quot;;

&#x2F;&#x2F;my key
var KEY = &quot;mykeyisbetterthanyours&quot;;

&#x2F;&#x2F;credit: http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;1527820&#x2F;52160
function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
		
function getComicData(year) {
	var url = &quot;http:&#x2F;&#x2F;gateway.marvel.com&#x2F;v1&#x2F;public&#x2F;comics?limit=100&amp;format=comic&amp;formatType=comic&amp;dateRange=&quot;+year+&quot;-01-01%2C&quot;+year+&quot;-12-31&amp;apikey=&quot;+KEY;
	console.log(&#x27;getComicData(&#x27;+year+&#x27;)&#x27;);
	return $.get(url);
}
		
$(document).ready(function() {
	
	var $results = $(&quot;#results&quot;);
	var $status = $(&quot;#status&quot;);
	
	var templateSource = $(&quot;#reportTemplate&quot;).html();
	var template = Handlebars.compile(templateSource);
	var start = 2013;
	var end = 1950;
	
	var promises = [];
	
	$status.html(&quot;&lt;i&gt;Getting comic book data - this will be slow - stand by...&lt;&#x2F;i&gt;&quot;);
	
	for(var x=start; x&gt;=end; x--) {
		promises.push(getComicData(x));
	}
	
	$.when.apply($,promises).done(function() {

		var args = Array.prototype.slice.call(arguments, 0);

		$status.html(&quot;&quot;);
		
		for(var x=0; x&lt;args.length; x++) {
			var year = start-x;
			console.log(&quot;displaying year&quot;, year);	

			var stats = {};
			stats.year = year;
			stats.priceTotal = 0;
			stats.priceCount = 0;
			stats.minPrice = 999999999;
			stats.maxPrice = -999999999;
			stats.pageTotal = 0;
			stats.pageCount = 0;
			stats.pics = [];
			
			var res = args[x][0];
			
			if(res.code === 200) {
				for(var i=0;i&lt;res.data.results.length;i++) {
					var comic = res.data.results[i];
					&#x2F;&#x2F;just get the first item
					if(comic.prices.length &amp;&amp; comic.prices[0].price !== 0) {
						stats.priceTotal += comic.prices[0].price;
						if(comic.prices[0].price &gt; stats.maxPrice) stats.maxPrice = comic.prices[0].price;
						if(comic.prices[0].price &lt; stats.minPrice) stats.minPrice = comic.prices[0].price;
						stats.priceCount++;
					}
					if(comic.pageCount &gt; 0) {
						stats.pageTotal+=comic.pageCount;
						stats.pageCount++;
					}
					if(comic.thumbnail &amp;&amp; comic.thumbnail.path != IMAGE_NOT_AVAIL) stats.pics.push(comic.thumbnail.path + &quot;.&quot; + comic.thumbnail.extension);
					
				}
				stats.avgPrice = (stats.priceTotal&#x2F;stats.priceCount).toFixed(2);
				stats.avgPageCount = (stats.pageTotal&#x2F;stats.pageCount).toFixed(2);
				
				&#x2F;&#x2F;pick 5 thumbnails at random
				stats.thumbs = [];
				while(stats.pics.length &gt; 0 &amp;&amp; stats.thumbs.length &lt; 5) {
					var chosen = getRandomInt(0, stats.pics.length);
					stats.thumbs.push(stats.pics[chosen]);
					stats.pics.splice(chosen, 1);
				}
				
				console.dir(stats);
				var html = template(stats);
				$results.append(html);
			}
		}
	});
	
});</code></pre>

<p>
There isn't a lot to this. I basically loop over a set of years and fire off async requests to get the data. For each year I figure out my averages, collect images, and pick out 5 random ones. Finally the results are printed to screen. This app is <i>slow</i> as I wait for all 63 requests to finish before I render. A better demo would render as the results came in and properly handle displaying them in the right order. The result was... fascinating. 
</p>

<p>
I kinda knew prices would go up over time so that wasn't surprising. In 2013 my data shows an average of $4.12 compared to ten cents in 1950. Page count is a bit lower, but not dramatically. What was <i>really</i> epic was the covers. I mean, I knew styles have changed over time, but to see it all at once was awesome! For example, here are the ones I got for 2013.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s17.png" />
</p>

<p>
Now go back to 1985.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s29.png" />
</p>

<p>
And finally - 1960.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s34.png" />
</p>

<p>
Because of the API limit I can't share the live application, but I did take the rendered output and save that. If you're curious, you can get dynamically generated HTML by simply opening up the console and doing $(body).html(). You can view the static report here: <a href="https://static.raymondcamden.com/demos/2014/jan/31/report.html">https://static.raymondcamden.com/demos/2014/jan/31/report.html</a>
</p>

<p>
So - I realized that the coolest part of that last demo was the covers. So I built a second demo focused just on that. I created a Node.js/Express application that did one thing: Pick a random year, pick a random month, and pick a random cover. It then displayed this to the user along with the title/publication date on the lower left side. Because it was server-side, I was able to use caching. I used a range of 1960 to 2013, which is 756 different API calls. In theory - I should be able to run the application and never hit my limit. I also built in code to handle cases where the API limits are hit anyway. If I have at least 5 months cached, I'll just use the existing cache. I'll share the entire code base, but here is the marvel.js module the app uses to return the cover.
</p>

<pre><code class="language-javascript">&#x2F;* global require,exports, console *&#x2F;
var http = require(&#x27;http&#x27;);
var crypto = require(&#x27;crypto&#x27;);

var cache = [];

var PRIV_KEY = &quot;iamthegatekeeper&quot;;
var API_KEY = &quot;iamthekeymaster&quot;;

&#x2F;&#x2F;default not avail image
var IMAGE_NOT_AVAIL = &quot;http:&#x2F;&#x2F;i.annihil.us&#x2F;u&#x2F;prod&#x2F;marvel&#x2F;i&#x2F;mg&#x2F;b&#x2F;40&#x2F;image_not_available&quot;;

exports.getCache = function() {% raw %}{ return cache; }{% endraw %};

function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getCover(cb) {
	&#x2F;&#x2F;first select a random year
	var year = getRandomInt(1960, 2013);
	&#x2F;&#x2F;then a month
	var month = getRandomInt(1,12);

	var cache_key = year + &quot;_&quot; + month;
	
	if(cache_key in cache) {
		console.log(&#x27;had cache for &#x27;+cache_key);
		var images = cache[cache_key].images;
		cache[cache_key].hits++;
		cb(images[getRandomInt(0, images.length-1)]);		
	} else {
		var monthStr = month&lt;10?&quot;0&quot;+month:month;
		&#x2F;&#x2F;lame logic for end of month
		var eom = month==2?28:30;
		var beginDateStr = year + &quot;-&quot; + monthStr + &quot;-01&quot;;
		var endDateStr = year + &quot;-&quot; + monthStr + &quot;-&quot; + eom;
		var url = &quot;http:&#x2F;&#x2F;gateway.marvel.com&#x2F;v1&#x2F;public&#x2F;comics?limit=100&amp;format=comic&amp;formatType=comic&amp;dateRange=&quot;+beginDateStr+&quot;%2C&quot;+endDateStr+&quot;&amp;apikey=&quot;+API_KEY;
		var ts = new Date().getTime();
		var hash = crypto.createHash(&#x27;md5&#x27;).update(ts + PRIV_KEY + API_KEY).digest(&#x27;hex&#x27;);
		url += &quot;&amp;ts=&quot;+ts+&quot;&amp;hash=&quot;+hash;
		&#x2F;&#x2F;TEMP
		&#x2F;&#x2F;var url =&quot;http:&#x2F;&#x2F;127.0.0.1&#x2F;testingzone&#x2F;html5tests&#x2F;marvel&#x2F;resp.json&quot;;
		
		console.log(new Date()+&#x27; &#x27;+url);
		
		http.get(url, function(res) {
			var body = &quot;&quot;;

			res.on(&#x27;data&#x27;, function (chunk) {
				body += chunk;
			});
			
			res.on(&#x27;end&#x27;, function() {
				&#x2F;&#x2F;result.success = true;

				var result = JSON.parse(body);
				var images;
				
				if(result.code === 200) {
					images = [];
					console.log(&#x27;num of comics &#x27;+result.data.results.length);
					for(var i=0;i&lt;result.data.results.length;i++) {
						var comic = result.data.results[i];
						&#x2F;&#x2F;console.dir(comic);
						if(comic.thumbnail &amp;&amp; comic.thumbnail.path != IMAGE_NOT_AVAIL) {
							var image = {};
							image.title = comic.title;
							for(var x=0; x&lt;comic.dates.length;x++) {
								if(comic.dates[x].type === &#x27;onsaleDate&#x27;) {
									image.date = new Date(comic.dates[x].date);
								}
							}
							image.url = comic.thumbnail.path + &quot;.&quot; + comic.thumbnail.extension;
							images.push(image);
						}
					}
					&#x2F;&#x2F;console.dir(images);
					&#x2F;&#x2F;now cache it
					cache[cache_key] = {% raw %}{hits:1}{% endraw %};
					cache[cache_key].images = images;
					cb(images[getRandomInt(0, images.length-1)]);
				} else if(result.code === &quot;RequestThrottled&quot;) {
					console.log(&quot;RequestThrottled Error&quot;);
					&#x2F;*
					So don&#x27;t just fail. If we have a good cache, just grab from there
					*&#x2F;
					if(Object.size(cache) &gt; 5) {
						var keys = [];
						for(var k in cache) keys.push(k);
						var randomCacheKey = keys[getRandomInt(0,keys.length-1)];
						images = cache[randomCacheKey].images;
						cache[randomCacheKey].hits++;
						cb(images[getRandomInt(0, images.length-1)]);		
					} else {
						cb({% raw %}{error:result.code}{% endraw %});
					}
				} else {
					console.log(new Date() + &#x27; Error: &#x27;+JSON.stringify(result));
					cb({% raw %}{error:result.code}{% endraw %});
				}
				&#x2F;&#x2F;console.log(data);
			});
		
		});
	}

}

exports.getCover = getCover;</code></pre>

<p>
Here is a screenshot:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s4.jpg" />
</p>

<p>
You can view this yourself here: <a href="http://marvel.raymondcamden.com">marvel.raymondcamden.com</a>. Note that I am <i>not</i> displaying the "Data by Marvel" attribution label yet  and I need to add that to comply with Marvel's API rules. (Which is totally fair - I just haven't wanted to restart the server yet!)
</p>

<p>
I know I'm biased, but I love my demo. The first time I watched it I saw titles I had never heard of. I don't know if I'd consider myself a "serious" comic collector, I just buy what I like, but seeing the depth of history in the Marvel line is actually encouraging me to pick up more comics from the past. I've included the full source code for both my demos as an attachment to this blog post. I've removed the keys obviously.
</p><p><a href='https://static.raymondcamden.com/enclosures/marvel.zip'>Download attached file.</a></p>
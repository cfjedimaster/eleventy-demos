---
layout: post
title: "Example of a JavaScript Disqus Recent Comment Widget"
date: "2014-03-21T16:03:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/03/21/Example-of-a-JavaScript-Disqus-Recent-Comment-Widget
guid: 5180
---

<p>
I've made great use of <a href="http://www.disqus.com">Disqus</a> on a few sites now and am planning on converting my 50K+ comments here some day soon. One of the features I'm interested in is building a way to list out recent comments per site. Disqus has a pretty complex <a href="http://disqus.com/api/docs/">API</a> but oddly, I wasn't able to find many examples of JavaScript clients for the API. I suppose with the API limits and the inherit concern about including keys in your code it may limit the uses, but I was able to build a simple "Recent Comments" pod pretty easily. This is ugly, but hopefully it will be useful to others.
</p>
<!--more-->
<p>
To start, you need to create an Application. You do <strong>not</strong> do this in the Admin or Dashboard. Instead must click on the API link first. Since I wasn't building a real application I simply called my app "CFLibJS" as a way of making it clear what I was building. (For this demo I used <a href="http://www.cflib.org">CFLib</a> for my source.) I set the application to read only, which I'd recommend strongly. I don't think folks can do anything naughty with just the API key you will need in the code, but better safe than sorry. Finally, use the referrers setting to specify where your code is allowed to run. I began with "localhost" and then added raymondcamden.com for the demo. Once you've built your application, make note of your <strong>public key</strong>.
</p>

<p>
While there are a number of different API calls you can make, I wanted <a href="http://disqus.com/api/docs/forums/listPosts/">forums/listPosts</a>. Disqus considers a site as a forum (well, in theory you could have multiple per site) and posts are your comments. Make note of the various arguments you can pass to this API. For my demo two were important. First, I wanted a smaller number of results so I used limit=10. Secondly, the default results do not provide a way to get back to the original URL where the comment may be seen. Use related=thread to get thread data (and again, for a simple site one thread is one page) which will include the URL.
</p>

<p>
And that's it. The rest is simply looping over the array and printing your crap. In my demo below I didn't bother with a JS template so it is a bit uglier than normal, and I spent a grand total of 5 minutes on the design, but you get the idea.
</p>

<pre><code class="language-markup">&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;&#x2F;title&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
&lt;&#x2F;head&gt;
&lt;style&gt;
.comment {
	background-color: #c0c0c0;
	border-style: solid;
	border-width: thin;
	width: 500px;
	margin-bottom: 10px;
}

.postRef {
	font-size: 12px;
	font-style: italic;
	text-align: right;
}
&lt;&#x2F;style&gt;
&lt;body&gt;

&lt;div id=&quot;comments&quot;&gt;&lt;&#x2F;div&gt;

&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.0.3&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script&gt;

$(document).ready(function() {

	$commentDiv = $(&quot;#comments&quot;);
	
	$.get(&quot;https:&#x2F;&#x2F;disqus.com&#x2F;api&#x2F;3.0&#x2F;forums&#x2F;listPosts.json?forum=cflib&amp;limit=10&amp;related=thread&amp;api_key=vSK5ndtqzaZGn4aEsYsR9xCrV1z656kxT0VODoLLbCOQvFQezy6wtBWNe9Jy3GW4&quot;, function(res, code) {
		&#x2F;&#x2F;Good response?
		if(res.code === 0) {
			var result = &quot;&quot;;
			for(var i=0, len=res.response.length; i&lt;len; i++) {
				var post = res.response[i];
				console.dir(post);
				var html = &quot;&lt;div class=&#x27;comment&#x27;&gt;&quot;;
				html += &quot;&lt;img src=&#x27;&quot; + post.author.avatar.small.permalink + &quot;&#x27;&gt;&quot;;
				html += &quot;&lt;a href=&#x27;&quot;+ post.author.profileUrl + &quot;&#x27;&gt;&quot; + post.author.name + &quot;&lt;&#x2F;a&gt;&quot;;
				html += &quot;&lt;p&gt;&quot;+post.raw_message+&quot;&lt;&#x2F;p&gt;&quot;;
				html += &quot;&lt;p class=&#x27;postRef&#x27;&gt;Posted at &quot; + post.createdAt + &quot; on &lt;a href=&#x27;&quot;+ post.thread.link + &quot;&#x27;&gt;&quot; + post.thread.title + &quot;&lt;&#x2F;a&gt;&lt;&#x2F;p&gt;&quot;;
				html += &quot;&lt;&#x2F;div&gt;&quot;;
				
				result+=html;
			}
			$commentDiv.html(result);
		}
	});
});
&lt;&#x2F;script&gt;
&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
You can view a live version of this in all its glory here:
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2014/mar/21/test.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>   
</p>

<p>
The Disqus API is rather forgiving in terms of rate limits. You get 1000 calls per hour. My blog gets 4-6K visits per day, so this should be more than enough. Obviously you add a nice error message to the display if the comments didn't return for any reason.
</p>
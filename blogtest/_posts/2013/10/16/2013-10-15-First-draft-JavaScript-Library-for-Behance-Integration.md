---
layout: post
title: "First draft - JavaScript Library for Behance Integration"
date: "2013-10-16T07:10:00+06:00"
categories: [design,development]
tags: []
banner_image: 
permalink: /2013/10/16/First-draft-JavaScript-Library-for-Behance-Integration
guid: 5060
---

<p>
Back in April of this year I <a href="http://www.raymondcamden.com/index.cfm/2013/4/5/Quick-Code-Sample--Add-your-Behance-portfolio-to-your-web-site">blogged</a> about how you could create a "widget" version of your <a href="http://www.behance.net">Behance</a> portfolio on your web site. This was done using a little library I built and a user's RSS feed. By using the RSS feed we could bypass the somewhat strict limits on the Behance API (150 hits per hour). I had a few people ask about using the <i>real</i> API so I decided to take a stab at it today.
</p>
<!--more-->
<p>
I've begun with the simplest use case imaginable, getting the projects for a single user. First, you begin with your HTML template.
</p>

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
	&lt;head&gt;
	&lt;&#x2F;head&gt;
	
	&lt;body&gt;
		
		&lt;h1&gt;Regular Site&lt;&#x2F;h1&gt;
		
		&lt;p&gt;
		Some vanilla content.
		&lt;&#x2F;p&gt;

		&lt;h1&gt;My Projects&lt;&#x2F;h1&gt;
		&lt;div id=&quot;projects&quot;&gt;
		
		&lt;&#x2F;div&gt;
		
		&lt;script src=&quot;jquery-2.0.0.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;behance_api.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;demo1.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
Nothing special here. I've got a basic template with an empty div block I'll be using to display my templates. I'm loading jQuery as a dependency, my new library, and demo1.js, which is just the JavaScript file for this page. Let's look at that next.
</p>

<pre><code class="language-javascript">&#x2F;* global $,console,document,behanceAPI *&#x2F;
var behancekey = &quot;vNvOiZI0cD9yfx0z4es9Ix6r4L2J7KdI&quot;;

$(document).ready(function() {
	
	&#x2F;&#x2F;Set my key
	behanceAPI.setKey(behancekey);
	
	&#x2F;&#x2F;Now get my projects
	behanceAPI.getProjects(&quot;gwilson&quot;, function(p) {

		&#x2F;&#x2F;Manually draw them out	
		console.dir(p);
		var s = &quot;&quot;;
		for(var i=0; i&lt;p.length; i++) {
			var proj = p[i];
			s += &quot;&lt;h2&gt;&quot; + proj.name + &quot;&lt;&#x2F;h2&gt;&quot;;
			s += &quot;&lt;p&gt;&quot;;
			s += &quot;&lt;a href=&#x27;&quot; + proj.url + &quot;&#x27;&gt;&lt;img src=&#x27;&quot; + proj.covers[404] + &quot;&#x27;&gt;&lt;&#x2F;a&gt;&quot;;
			s += &quot;&lt;&#x2F;p&gt;&quot;;
		}
		$(&quot;#projects&quot;).html(s);
	});

});</code></pre> 

<p>
In this demo, all I'm doing is setting the API key (see note below) and then running the getProjects call. The method takes two arguments - the user and the function to run after the data has been fetched. I do <strong>not</strong> have any error handling yet, that will come later. The result is simply an array of projects that you can display however you want. In this case I just create a big ugly string. Typically you would want to use something like Handlebars instead.
</p>

<p>
The actual library itself is pretty simple:
</p>

<pre><code class="language-javascript">&#x2F;* global console,$ *&#x2F;
var behanceAPI = function() {
	var key;
	var baseURL = &quot;http:&#x2F;&#x2F;www.behance.net&#x2F;v2&#x2F;&quot;;
	
	function setKey(k) {
		key = k;	
	}
	
	function getProjects(user, cb) {
		var url = baseURL + &quot;users&#x2F;&quot; + user + &quot;&#x2F;projects?api_key=&quot; + key + &quot;&amp;callback=&quot;;
		console.log(url);
		$.get(url, {}, function(res, code) {
			cb(res.projects);
		}, &quot;JSONP&quot;);
	}
	
	return {
		setKey: setKey,
		getProjects: getProjects	
	};
	
}();</code></pre>

<p>
So, because of the limits Behance puts on API calls, I decided <i>not</i> to put this demo online. (And yes, I realize my own key is up there!) Instead, I've attached a zip of the project to this blog entry. Here is a screenshot of the result:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_10_16_13_6_10_AM.jpg" />
</p>

<p>
Not terribly exciting yet, I know. But - I'm thinking that in my next revision, I'm going to allow you to create a simple template, pass it to the library, and have the output handled for your automatically. My thinking is that many of the people who may use this API are creatives who may not have much JavaScript experience.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive32%{% endraw %}2Ezip'>Download attached file.</a></p>
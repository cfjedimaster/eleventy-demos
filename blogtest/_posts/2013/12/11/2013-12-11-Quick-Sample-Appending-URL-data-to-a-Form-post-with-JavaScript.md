---
layout: post
title: "Quick Sample: Appending URL data to a Form post with JavaScript"
date: "2013-12-11T12:12:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/12/11/Quick-Sample-Appending-URL-data-to-a-Form-post-with-JavaScript
guid: 5097
---

<p>
This is a quick sample based on a request from a reader. They have a form that is loaded with a dynamic value in the query string. They were curious if there was a simple way to pass along the query string data along with the form post data. There's a couple different ways of handling this. Here is my version.
</p>
<!--more-->
<p>
First - let's build up a simple form. In my HTML I'm including jQuery and a JavaScript file called app.js where I'll do the actual logic.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.0.3&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;
		
		&lt;form id=&quot;theForm&quot;&gt;
			&lt;p&gt;
			&lt;label for=&quot;name&quot;&gt;
				Name
			&lt;&#x2F;label&gt;
			&lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot;&gt;
			&lt;&#x2F;p&gt;
			&lt;p&gt;
			&lt;label for=&quot;email&quot;&gt;
				Email
			&lt;&#x2F;label&gt;
			&lt;input type=&quot;email&quot; id=&quot;email&quot; name=&quot;email&quot;&gt;
			&lt;&#x2F;p&gt;
			&lt;p&gt;
			&lt;input type=&quot;submit&quot; name=&quot;Send Form&quot;&gt;
			&lt;&#x2F;p&gt;
		&lt;&#x2F;form&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
There isn't anything special about the form so let's get right into the JavaScript. Let me repeat though - this is my solution - and is one of several different ways we could accomplish the task.
</p>

<pre><code class="language-javascript">&#x2F;* global window,$,document *&#x2F;
function getQueryString() {
	var result = {};
	if(!window.location.search.length) return result;
	var qs = window.location.search.slice(1);
	var parts = qs.split(&quot;&amp;&quot;);
	for(var i=0, len=parts.length; i&lt;len; i++) {
		var tokens = parts[i].split(&quot;=&quot;);
		result[tokens[0]] = decodeURIComponent(tokens[1]);
	}
	return result;
}

$(document).ready(function() {
	$(&quot;#theForm&quot;).submit(function(e) {
		&#x2F;&#x2F;var that = this;
		var qs = getQueryString();
		for(var key in qs) {
			var field = $(document.createElement(&quot;input&quot;));
			field.attr(&quot;name&quot;, key).attr(&quot;type&quot;,&quot;hidden&quot;);
			field.val(qs[key]);
			$(this).append(field);
		}
	});
});</code></pre>

<p>
Ok, let's break it down. The core of the logic is inside a form submit handler. The idea being that when you submit the form we want to grab the query string and pass it along. I built a simple handler to get the query string and return it as a set of keys and values.
</p>

<p>
So now we have an easy way to get the query string. But what do we do with it? I see two possible options (and there are probably more). 
</p>

<p>
The first option would be to take the query string values, convert them to JSON, and store them in a hidden form field. On the server you would deserialize the JSON and use the values as is. This has the benefit of allowing you to separate the form data from the query string data. That may be important to you.
</p>

<p>
The second option (and again, I'm assuming there are many more) would be to convert the query string values into form fields. This has the benefit of giving you one set of values to work with on the server side. That's simpler and could be better for your logic there. A drawback though is that if a query string value had some name, X, that matched an existing form key, you'll get some duplication.
</p>

<p>
For simplicity sake, I went with the second option. You can see that I simply create hidden form fields and append them to the form. Since my HTML doesn't use POST as a method, you can see this for yourself by using the demo below. I've added two items to the query string. When you submit the form, they will carry over.
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2013/dec/11/jqmincludeqs.html?ray=1&beer=good"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>   
</p>
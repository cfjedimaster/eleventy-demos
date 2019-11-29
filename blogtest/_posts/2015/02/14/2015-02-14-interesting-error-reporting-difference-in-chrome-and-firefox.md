---
layout: post
title: "Interesting error reporting difference in Chrome and Firefox"
date: "2015-02-14T13:03:37+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2015/02/14/interesting-error-reporting-difference-in-chrome-and-firefox
guid: 5683
---

Ok, perhaps "interesting" is a bit of a stretch, but as I'm doing some work while waiting for new tires to be put on my car, my base level for "interesting" is a bit lower than normal. I'm testing some code that I wrote in a Powerpoint slide - code I was sure worked fine but I wanted to be <i>really</i> sure, and I found that I had a typo. Consider the snippet below - you will probably see it right away.

<!--more-->

<pre><code class="language-javascript">
$.getJSON("/data.json", function(res) {
	var s = "&lt;ul&gt;";
	//["ray","jeanne","jacob","lynn","noah","maisie"]
	for(var i=0;i&lt;res.length;i++) {
		if(res[i].length &lt; 4) {
			s+="&lt;li class=\"short\"&gt;"+res[i] + "&lt;/li&gt;");
		} else {
			s+="&lt;li&gt;"+res[i] + "&lt;/li&gt;");
		}
	}
	s += "&lt;/ul&gt;";
	$("#someDiv").html(s);
});</code></pre>

When I ran this in Firefox, I got: <code>SyntaxError: missing ; before statement test1.html:22</code>. 

Line 22 is the line that adds the li with class short to the variable s. I looked at it and couldn't quite figure out what was wrong.

I then switched to Chrome and got this error: <code>Uncaught SyntaxError: Unexpected token )</code>

Now - that made sense! I immediately saw the extra ) I had at the end of my line. (I also had it two lines later.)

But what I found interesting is how different the errors were. Both were syntax errors, but the actual detail was quite different. Anyone have an idea as to why this is?
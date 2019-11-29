---
layout: post
title: "Proof of Concept: Live HTML checking for a textarea"
date: "2014-09-08T16:09:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/09/08/Proof-of-Concept-Live-HTML-checking-for-a-textarea
guid: 5302
---

<p>
Most online forms don't allow HTML, or allow a very strict subset of HTML, but for years now my blog form (the one I'm using right now) has allowed for any and all HTML. I figure if I can't trust myself, who can I trust? Of course, from time to time I screw up and forget to close a tag or make some other mistake. For a while now I've wondered - is there an easy way to check for that and potentially catch those mistakes before I save the form?
</p>
<!--more-->
<p>
I currently know of two services that let you check HTML. One is the <a href="http://validator.w3.org/">W3C Validator</a>. I've used this for one of my Brackets extensions (<a href="https://github.com/cfjedimaster/brackets-w3cvalidation">W3CValidation</a>) and it works ok, but on simple tests it seemed to miss obvious things. For example, given input of: <code>&lt;b&gt;moo</code> it only notices the lack of a root docttype and declaration and basically throws up. Since my input will always be <i>part</i> of a full HTML page, the blog content, this didn't seem appropriate. Also, it would be asynchronous and I wanted something I could run entirely client-side.
</p>

<p>
I then decided to check out <a href="https://github.com/yaniswang/HTMLHint">HTMLHint</a>. HTMLHint provides rules-based reports on HTML input. It is pretty simple to use and - surprise surprise - I also have a Brackets extension for it (<a href="https://github.com/cfjedimaster/brackets-htmlhint">Brackets-HTMLHint</a>). Since I could use it entirely client-side, I thought I'd check it out. I built a simple demo that did validation on keyup.
</p>

<p>
First, I created a simple HTML page and form.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.0&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script src=&quot;htmlhint.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;style&gt;
#blogContent {
	width: 500px;
	height: 300px;
}
#htmlIssues {
	font-weight: bold;
}
&lt;&#x2F;style&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

	&lt;form&gt;
	&lt;textarea id=&quot;blogContent&quot;&gt;&lt;&#x2F;textarea&gt;
	&lt;div id=&quot;htmlIssues&quot;&gt;&lt;&#x2F;div&gt;
	&lt;&#x2F;form&gt;
	
&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
Nothing really special here. You can see the textarea as well as an empty div I plan on using for validation. Now let's look at the code.
</p>

<pre><code class="language-javascript">$(document).ready(function() {
	$issueDiv = $(&quot;#htmlIssues&quot;);
	
	&#x2F;&#x2F;From docs:
	var rules = {
		&quot;tagname-lowercase&quot;: true,
		&quot;attr-lowercase&quot;: true,
		&quot;attr-value-double-quotes&quot;: true,
		&quot;doctype-first&quot;: false,
		&quot;tag-pair&quot;: true,
		&quot;spec-char-escape&quot;: true,
		&quot;id-unique&quot;: true,
		&quot;src-not-empty&quot;: true,
		&quot;attr-no-duplication&quot;: true
	}
	
	function htmlEscape(s) {
		s = s.replace(&#x2F;\&lt;&#x2F;g, &quot;&amp;lt;&quot;);
		s = s.replace(&#x2F;\&gt;&#x2F;g, &quot;&amp;gt;&quot;);
		return s;
	}
	
	$(&quot;#blogContent&quot;).on(&quot;keyup&quot;, function() {
		var content = $(this).val();
		var issues = HTMLHint.verify(content, rules);
		
		if(issues.length === 0) {
			$issueDiv.html(&quot;&quot;);
			return;
		}
		console.dir(issues);
		var s = &quot;Possible HTML issues found:&lt;ul&gt;&quot;;
		for(var i=0, len=issues.length; i&lt;len; i++) {
			s += &quot;&lt;li&gt;&quot;+htmlEscape(issues[i].message)+&quot;&lt;&#x2F;li&gt;&quot;;
		}
		s += &quot;&lt;&#x2F;ul&gt;&quot;;
		$issueDiv.html(s);
		
	});
});</code></pre>

<p>
From the top, I'm caching my results div so I can reuse it when doing validation. I modified HTMLHint's default rule set to turn off the doctype requirement. (Because, again, I'm validating a small part of a page, not the entire page.) And that's basically it. I run the library's verify method and just render out the results. Here is an example of it in action:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s123.png" class="bthumb" />
</p>

<p>
As you can see, it found the unmatched tag pair, but didn't notice that <code>turd</code> was an invalid tag. To be honest, I'm much more concerned about screwing up tag pairs so that makes me happy enough.
</p>

<p>
If you want to play with it yourself, I set up a demo below. 
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2014/sep/8/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>   
</p>
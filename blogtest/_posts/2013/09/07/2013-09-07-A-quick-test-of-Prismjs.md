---
layout: post
title: "A quick test of Prism.js"
date: "2013-09-07T12:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2013/09/07/A-quick-test-of-Prismjs
guid: 5031
---

<p>
Sorry for the noise folks. This is really just a test post. But if you've never tried <a href="http://prismjs.com/index.html">Prism</a> before for code highlighting, I definitely recommend it. I'm using it over on <a href="http://www.javascriptcookbook.com">JavaScript Cookbook</a> and I've decided to start using it here as well.
</p>
<!--more-->
<p>
I've went through a couple of different code highlighters over the past ten years. Most recently I've made use of Gists. I really liked the idea of offloading the code to another server, but when gists.github.com went down, it ended up completely breaking my blog posts. I certainly don't blame them (and they go down much less often than my own blog does), but I thought it might be nice to try something internal, simpler, and less prone to error.
</p>

<p>
Prism.js is the framework I'm going to use. Here is a real example.
</p>

<pre class="line-numbers"><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Foo&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;p&gt;
Stuff
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
The only thing I need now is a quick way to escape HTML. Posting JavaScript won't be an issue but I need to escape my HTML examples. For what you saw above I used this app (<a href="http://www.htmlescape.net/htmlescape_tool.html">Online HTML Escape Tool</a>) but I am going to want something more direct. I'll probably use a bookmarklet or add something to my blog form. 
</p>

<p>
Another example without line numbers.
</p>

<pre><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Foo&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;p&gt;
Stuff
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>
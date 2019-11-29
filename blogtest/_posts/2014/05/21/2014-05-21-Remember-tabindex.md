---
layout: post
title: "Remember tabindex?"
date: "2014-05-21T18:05:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2014/05/21/Remember-tabindex
guid: 5228
---

<p>
A quick tip. I just ran into a form that looked, a bit, like this:
</p>
<!--more-->
<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Demo&lt;&#x2F;title&gt;
&lt;&#x2F;head&gt;

&lt;body&gt;

&lt;form method=&quot;post&quot;&gt;
	&lt;p&gt;
	&lt;label for=&quot;username&quot;&gt;username&lt;&#x2F;label&gt;
	&lt;input type=&quot;text&quot; name=&quot;username&quot; id=&quot;username&quot;&gt;
	&lt;&#x2F;p&gt;

	&lt;p&gt;
	&lt;label for=&quot;password&quot;&gt;password&lt;&#x2F;label&gt;
	&lt;input type=&quot;password&quot; name=&quot;password&quot; id=&quot;password&quot;&gt;&lt;br&#x2F;&gt;
	&lt;a href=&quot;&quot;&gt;Learn about secure passwords!&lt;&#x2F;a&gt;	
	&lt;&#x2F;p&gt;

	&lt;p&gt;
	&lt;label for=&quot;password2&quot;&gt;confirm password&lt;&#x2F;label&gt;
	&lt;input type=&quot;password&quot; name=&quot;password2&quot; id=&quot;password2&quot;&gt;
	&lt;&#x2F;p&gt;

&lt;&#x2F;form&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
Nothing special - but notice the link after the password? If you use the tab button to move through the form, you end up on the link itself after entering the password.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Demo.png" />
</p>

<p>
If you are a fast typist like me, it is easy to miss. Don't forget that HTML has a handy attribute for this, <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#tabindex">tabindex</a>. Fixing it is actually pretty easy. In the past I knew I could use consecutive numbers in my form fields to direct the tabbing, but apparently just using a negative value on the field you don't like is enough to fix it... like so:
</p>

<pre><code class="language-markup">&lt;a href=&quot;&quot; tabindex=&quot;-1&quot;&gt;Learn about secure passwords!&lt;&#x2F;a&gt;
</code></pre>

<p>
So yeah - don't forget it. (As a certain site I just visited did. ;)
</p>